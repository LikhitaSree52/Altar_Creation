const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware: Must be admin
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

// Promote user to admin
router.patch('/users/:id/promote', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'User is already an admin' });
    user.role = 'admin';
    await user.save();
    res.json({ message: 'User promoted to admin', user });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete another admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware: Must be superadmin (by email)
function isSuperAdmin(req, res, next) {
  if (!req.user || req.user.email !== 'likhitasreemandula@gmail.com') {
    return res.status(403).json({ message: 'Only the superadmin can perform this action' });
  }
  next();
}

// Demote admin to user (superadmin only)
router.patch('/users/:id/demote', auth, isAdmin, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'admin') return res.status(400).json({ message: 'User is not an admin' });
    if (user.email === 'likhitasreemandula@gmail.com') return res.status(400).json({ message: 'Superadmin cannot demote self' });
    user.role = 'user';
    await user.save();
    res.json({ message: 'Admin demoted to user', user });
  } catch (error) {
    console.error('Demote admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
