const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Altar configuration
  altarData: {
    // Wall and background
    wallBgColor: {
      type: String,
      default: '#f5f3ef'
    },
    wallBgImage: String,
    
    // Deceased photo (single, for backward compatibility)
    deceasedPhoto: String,
    // Multiple deceased photos (new)
    deceasedPhotos: [{
      src: String,
      pos: {
        x: { type: Number, default: null },
        y: { type: Number, default: null },
        dragging: { type: Boolean, default: false },
        offsetX: { type: Number, default: 0 },
        offsetY: { type: Number, default: 0 }
      },
      dimensions: {
        width: { type: Number, default: 180 },
        height: { type: Number, default: 220 }
      }
    }],
    frameStyle: {
      type: String,
      enum: ['classic', 'ornate', 'modern'],
      default: 'classic'
    },
    deceasedPhotoPos: {
      x: Number,
      y: Number
    },
    frameDimensions: {
      width: { type: Number, default: 180 },
      height: { type: Number, default: 220 }
    },
    
    // Items on altar
    items: [{
      img: String,
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      zIndex: Number
    }],
    
    // Custom stickers
    customStickers: [{
      img: String,
      name: String
    }],
    
    // Canvas dimensions
    canvasWidth: {
      type: Number,
      default: 600
    },
    canvasHeight: {
      type: Number,
      default: 360
    }
  },
  
  // Design metadata
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['memorial', 'religious', 'cultural', 'personal', 'other'],
    default: 'memorial'
  },
  
  // Usage statistics
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  
  // Sharing fields
  sharePeople: [{
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ['viewer', 'commenter', 'editor', 'owner'], default: 'viewer' }
  }],
  generalAccess: {
    enabled: { type: Boolean, default: false }, // true = anyone with link
    role: { type: String, enum: ['viewer', 'commenter', 'editor'], default: 'viewer' }
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true // allow null for designs not shared
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
designSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
designSchema.index({ user: 1, createdAt: -1 });
designSchema.index({ isPublic: 1, category: 1 });
designSchema.index({ tags: 1 });

module.exports = mongoose.model('Design', designSchema); 