const express = require('express');
const { body, validationResult } = require('express-validator');
const Design = require('../models/Design');
const auth = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// @route   POST /api/designs
// @desc    Create a new design
// @access  Private
router.post('/', auth, [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Design name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('altarData')
    .isObject()
    .withMessage('Altar data is required'),
  body('category')
    .optional()
    .isIn(['memorial', 'religious', 'cultural', 'personal', 'other'])
    .withMessage('Invalid category'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, altarData, category, isPublic, tags } = req.body;

    const design = new Design({
      user: req.user._id,
      name,
      description,
      altarData,
      category: category || 'memorial',
      isPublic: isPublic || false,
      tags: tags || []
    });

    await design.save();

    res.status(201).json({
      message: 'Design saved successfully',
      design
    });

  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs
// @desc    Get user's designs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const query = { user: req.user._id };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const designs = await Design.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username firstName lastName');

    const total = await Design.countDocuments(query);

    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs/public
// @desc    Get public designs
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const query = { isPublic: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const designs = await Design.find(query)
      .sort({ views: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username firstName lastName');

    const total = await Design.countDocuments(query);

    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get public designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs/:id
// @desc    Get design by ID
// @access  Private (if user's design) or Public (if public design)
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('user', 'username firstName lastName');

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user can access this design
    const isOwner = req.user && design.user._id.toString() === req.user._id.toString();
    const isPublic = design.isPublic;

    if (!isOwner && !isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment views if not the owner
    if (!isOwner) {
      design.views += 1;
      await design.save();
    }

    res.json({ design });

  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/designs/:id
// @desc    Update design
// @access  Private (owner only)
router.put('/:id', auth, [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Design name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('altarData')
    .optional()
    .isObject()
    .withMessage('Altar data must be an object'),
  body('category')
    .optional()
    .isIn(['memorial', 'religious', 'cultural', 'personal', 'other'])
    .withMessage('Invalid category'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user owns this design
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update design
    const updatedDesign = await Design.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('user', 'username firstName lastName');

    res.json({
      message: 'Design updated successfully',
      design: updatedDesign
    });

  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/designs/:id
// @desc    Delete design
// @access  Private (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user owns this design
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Design.findByIdAndDelete(req.params.id);

    res.json({ message: 'Design deleted successfully' });

  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs/:id/download
// @desc    Increment download count
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user can access this design
    const isOwner = req.user && design.user.toString() === req.user._id.toString();
    const isPublic = design.isPublic;

    if (!isOwner && !isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment download count
    design.downloads += 1;
    await design.save();

    res.json({ message: 'Download count updated' });

  } catch (error) {
    console.error('Update download count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/designs/:id/share
// @desc    Generate or update a share link, set general access, manage people/roles
// @access  Private (owner only)
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { generalAccess, sharePeople } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Generate a share token if not present
    if (!design.shareToken) {
      design.shareToken = crypto.randomBytes(12).toString('hex');
    }
    // Update sharing settings
    if (generalAccess) design.generalAccess = generalAccess;
    if (sharePeople) design.sharePeople = sharePeople;
    await design.save();
    res.json({
      message: 'Share link generated',
      shareLink: `${req.protocol}://${req.get('host')}/api/designs/share/${design.shareToken}`,
      shareToken: design.shareToken,
      generalAccess: design.generalAccess,
      sharePeople: design.sharePeople
    });
  } catch (error) {
    console.error('Share link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/designs/:id/share
// @desc    Update sharing settings (people, roles, general access)
// @access  Private (owner only)
router.put('/:id/share', auth, async (req, res) => {
  try {
    const { generalAccess, sharePeople } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (generalAccess) design.generalAccess = generalAccess;
    if (sharePeople) design.sharePeople = sharePeople;
    await design.save();
    res.json({
      message: 'Sharing settings updated',
      generalAccess: design.generalAccess,
      sharePeople: design.sharePeople
    });
  } catch (error) {
    console.error('Update share settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/designs/share/:token
// @desc    Fetch a design by share token, enforce access control
// @access  Public (role determined by token/email)
router.get('/share/:token', async (req, res) => {
  try {
    const { email } = req.query; // email can be passed as query param if logged in
    const design = await Design.findOne({ shareToken: req.params.token });
    if (!design) return res.status(404).json({ message: 'Design not found' });
    // Determine role
    let role = 'none';
    if (email) {
      const person = design.sharePeople.find(p => p.email === email.toLowerCase());
      if (person) role = person.role;
    }
    if (role === 'none' && design.generalAccess && design.generalAccess.enabled) {
      role = design.generalAccess.role || 'viewer';
    }
    if (role === 'none') {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Only allow actions based on role
    res.json({
      design,
      role
    });
  } catch (error) {
    console.error('Fetch by share token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 