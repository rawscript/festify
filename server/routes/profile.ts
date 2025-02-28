
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
import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { User } from '../../shared/models';
import { z } from 'zod';

const router = express.Router();

// Profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.string().max(0)),
});

// Get current user profile
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user?.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/update', isAuthenticated, async (req, res) => {
  try {
    // Validate request body
    const validatedData = profileUpdateSchema.parse(req.body);
    
    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.session.user?.id,
      { 
        ...validatedData,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update session with new user data
    if (req.session.user && validatedData.name) {
      req.session.user.name = validatedData.name;
    }
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        // Include other profile fields that were updated
        bio: user.bio,
        location: user.location,
        website: user.website,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error while updating profile' });
  }
});

export default router;
