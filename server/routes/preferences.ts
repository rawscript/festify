
import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { User } from '../../shared/models';
import mongoose from 'mongoose';

const router = express.Router();

// Update user preferences
router.put('/update', isAuthenticated, async (req, res) => {
  try {
    const { emailNotifications, theme, language } = req.body;
    
    // Find user and update preferences
    const userId = req.session.user?.id;
    
    // First, check if the preferences field exists, if not create it
    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create or update preferences in user document
    // Note: This assumes you've updated your User model to include preferences
    // You may need to update the User schema to support these preferences
    user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: {
          'preferences.emailNotifications': emailNotifications,
          'preferences.theme': theme,
          'preferences.language': language,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    return res.status(200).json({
      message: 'Preferences updated successfully',
      preferences: {
        emailNotifications,
        theme,
        language
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ message: 'Server error while updating preferences' });
  }
});

// Get user preferences
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const user = await User.findById(userId).select('preferences');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      preferences: user.preferences || {
        emailNotifications: {
          accountUpdates: true,
          securityAlerts: true,
          newsletters: false,
          tips: false
        },
        theme: 'system',
        language: 'en'
      }
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return res.status(500).json({ message: 'Server error while fetching preferences' });
  }
});

export default router;
