
import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { User } from '../../shared/models';

const router = express.Router();

// Get user profile - protected route
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    
    const user = await User.findById(userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile - protected route
router.put('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { name } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    
    await user.save();
    
    // Update session
    if (req.session.user) {
      req.session.user.name = user.name;
    }
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
