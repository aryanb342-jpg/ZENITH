import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Password validation
  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter.' });
  }
  if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(password)) {
    return res.status(400).json({ success: false, message: 'Password must contain at least one special character.' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer' // default role is customer
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({
        success: false,
        message: `Too many failed attempts. Account locked. Please try again in ${remainingSeconds} seconds.`,
        remainingSeconds
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 60 * 1000); // 1 minute lockout
        user.loginAttempts = 0; // Reset attempts after locking
        await user.save();
        return res.status(423).json({
          success: false,
          message: 'Too many failed attempts. Account locked for 1 minute.',
          remainingSeconds: 60
        });
      } else {
        await user.save();
        const attemptsRemaining = 5 - user.loginAttempts;
        return res.status(401).json({
          success: false,
          message: `Invalid email or password. ${attemptsRemaining} attempts remaining.`
        });
      }
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shippingAddress: user.shippingAddress
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile details and default shipping address
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const { name, email, shippingAddress } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email address already in use.' });
      }
      user.email = email;
    }

    if (shippingAddress) {
      user.shippingAddress = {
        streetAddress: shippingAddress.streetAddress !== undefined ? shippingAddress.streetAddress : user.shippingAddress.streetAddress,
        city: shippingAddress.city !== undefined ? shippingAddress.city : user.shippingAddress.city,
        state: shippingAddress.state !== undefined ? shippingAddress.state : user.shippingAddress.state,
        postalCode: shippingAddress.postalCode !== undefined ? shippingAddress.postalCode : user.shippingAddress.postalCode,
        country: shippingAddress.country !== undefined ? shippingAddress.country : user.shippingAddress.country,
        phone: shippingAddress.phone !== undefined ? shippingAddress.phone : user.shippingAddress.phone
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shippingAddress: user.shippingAddress
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
