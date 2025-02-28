
import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../shared/models';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);
    
    // Create new user
    const user = new User({
      email: validatedData.email,
      name: validatedData.name,
      passwordHash,
    });
    
    await user.save();
    
    // Create session for the user (auto login)
    const userForSession = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    
    req.session.user = userForSession;
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: userForSession,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create session
    const userForSession = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    
    req.session.user = userForSession;
    
    return res.status(200).json({
      message: 'Login successful',
      user: userForSession,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ 
      isAuthenticated: true, 
      user: req.session.user 
    });
  }
  return res.status(200).json({ 
    isAuthenticated: false 
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
