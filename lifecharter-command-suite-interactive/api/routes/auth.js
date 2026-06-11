const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, businessName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await dbAsync.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    await dbAsync.run(
      `INSERT INTO users (id, email, password, first_name, last_name, business_name) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, email.toLowerCase(), hashedPassword, firstName || null, lastName || null, businessName || null]
    );

    // Create default settings
    await dbAsync.run(
      `INSERT INTO user_settings (id, user_id) VALUES (?, ?)`,
      [uuidv4(), userId]
    );

    // Initialize module progress
    const defaultModules = [
      { id: 'brain-assessment', name: 'Brain.md Assessment' },
      { id: 'soul-assessment', name: 'Soul.md Assessment' },
      { id: 'business-audit', name: 'Business Systems Audit' },
      { id: 'offer-architecture', name: 'Offer Architecture Map' },
      { id: 'ai-agents', name: 'My AI Support Agents' },
      { id: 'content-system', name: '90-Day Content System' }
    ];

    for (const mod of defaultModules) {
      await dbAsync.run(
        `INSERT INTO module_progress (id, user_id, module_id, module_name, status) VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), userId, mod.id, mod.name, 'not_started']
      );
    }

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, details) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), userId, 'USER_REGISTERED', 'user', JSON.stringify({ email })]
    );

    // Generate token
    const token = generateToken(userId);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        businessName: businessName || null
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await dbAsync.get(
      'SELECT id, email, password, first_name, last_name, business_name FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await dbAsync.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type) VALUES (?, ?, ?, ?)`,
      [uuidv4(), user.id, 'USER_LOGIN', 'user']
    );

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        businessName: user.business_name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies?.token;
    const finalToken = token || cookieToken;

    if (!finalToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { verifyToken } = require('../middleware/auth');
    const decoded = verifyToken(finalToken);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const user = await dbAsync.get(
      'SELECT id, email, first_name, last_name, business_name, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user settings
    const settings = await dbAsync.get('SELECT * FROM user_settings WHERE user_id = ?', [user.id]);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        businessName: user.business_name,
        createdAt: user.created_at
      },
      settings: settings || {}
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { verifyToken } = require('../middleware/auth');
    const decoded = verifyToken(token || req.cookies?.token);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const { firstName, lastName, businessName } = req.body;

    await dbAsync.run(
      `UPDATE users SET first_name = ?, last_name = ?, business_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [firstName || null, lastName || null, businessName || null, decoded.userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;