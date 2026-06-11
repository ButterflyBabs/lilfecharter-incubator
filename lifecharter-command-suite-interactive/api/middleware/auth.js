const jwt = require('jsonwebtoken');
const { dbAsync } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Authentication middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    // Also check cookies
    const cookieToken = req.cookies?.token;
    if (!cookieToken) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  }

  const decoded = verifyToken(token || req.cookies?.token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  try {
    const user = await dbAsync.get('SELECT id, email, first_name, last_name, business_name FROM users WHERE id = ?', [decoded.userId]);
    if (!user) {
      return res.status(403).json({ error: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
}

// Optional auth - doesn't fail if no token
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const cookieToken = req.cookies?.token;
  
  const finalToken = token || cookieToken;
  
  if (finalToken) {
    const decoded = verifyToken(finalToken);
    if (decoded) {
      try {
        const user = await dbAsync.get('SELECT id, email, first_name, last_name, business_name FROM users WHERE id = ?', [decoded.userId]);
        if (user) {
          req.user = user;
        }
      } catch (err) {
        console.error('Optional auth error:', err);
      }
    }
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  optionalAuth,
  JWT_SECRET
};