const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  console.log('\n=== Auth Middleware ===');
  console.log('Request Headers:', req.headers);
  
  try {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);
    
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Found token in cookies');
    }
    
    console.log('Token:', token ? `${token.substring(0, 15)}...` : 'No token found');
    
    if (!token) {
      console.error('No token provided in Authorization header or cookies');
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied',
        error: 'MISSING_TOKEN'
      });
    }

    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded Token:', decoded);
    
    if (!decoded.userId) {
      console.error('Token missing userId');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Find user
    console.log('Finding user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error('User not found for token');
      return res.status(401).json({ 
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    console.log('User authenticated:', { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    let errorMessage = 'Token is not valid';
    let errorCode = 'INVALID_TOKEN';
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
      errorCode = 'INVALID_TOKEN';
    }
    
    res.status(401).json({ 
      success: false,
      message: errorMessage,
      error: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = auth;