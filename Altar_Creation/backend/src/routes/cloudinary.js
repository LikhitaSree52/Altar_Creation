const express = require('express');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure Cloudinary
// Note: CLOUDINARY_URL environment variable should be set
// in the format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
if (typeof(process.env.CLOUDINARY_URL) === 'undefined') {
  console.warn('!! CLOUDINARY_URL is not defined');
}

// @route   POST /api/cloudinary/signature
// @desc    Get a signature for uploading to Cloudinary
// @access  Private (should be protected)
router.post('/signature', (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  
  try {
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      ...req.body,
    }, process.env.CLOUDINARY_API_SECRET);
    
    res.status(200).json({
      signature: signature,
      timestamp: timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY
    });

  } catch (error) {
    console.error('Error signing Cloudinary request:', error);
    res.status(500).json({ msg: 'Server error while generating signature.' });
  }
});

module.exports = router; 