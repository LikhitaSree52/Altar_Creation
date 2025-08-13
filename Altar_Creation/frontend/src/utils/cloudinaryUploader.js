import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Uploads a file to Cloudinary using a signature from our backend.
 * @param {File} file The file to upload.
 * @returns {Promise<string>} The URL of the uploaded file.
 */
export const uploadToCloudinary = async (file) => {
  try {
    // 1. Get a signature from our backend
    const { data: { signature, timestamp, cloud_name, api_key } } = await axios.post(`${API_BASE_URL}/api/cloudinary/signature`, {
      folder: 'altar_uploads' // Optional: you can specify a folder in Cloudinary
    });

    // 2. Create form data to send to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', api_key);
    formData.append('folder', 'altar_uploads');

    // 3. Upload the file directly to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    const cloudinaryRes = await axios.post(cloudinaryUrl, formData);
    
    // Return the secure URL of the uploaded image
    return cloudinaryRes.data.secure_url;

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // You might want to show a notification to the user here
    throw new Error('Could not upload image. Please try again.');
  }
}; 