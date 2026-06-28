const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lifecharter-command-suite.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JWT functions
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Database setup
let supabase = null;
let dbType = 'memory';
let isInitialized = false;

function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY?.trim();

    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      dbType = 'supabase';
    }
  } catch (err) {
    console.error('Database init error:', err.message);
  }
  
  isInitialized = true;
}

// Database helpers
const dbAsync = {
  run: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      const table = sql.match(/INTO\s+(\w+)/i)?.[1] || sql.match(/UPDATE\s+(\w+)/i)?.[1];
      if (sql.toLowerCase().includes('insert')) {
        const data = {};
        const colMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
        if (colMatch) {
          const columns = colMatch[1].split(',').map(c => c.trim());
          columns.forEach((col, i) => { if (i < params.length) data[col] = params[i]; });
        }
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;
        return { id: data.id, changes: 1 };
      }
      return { changes: 1 };
    }
    return { changes: 1 };
  },
  
  get: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      const table = sql.match(/FROM\s+(\w+)/i)?.[1];
      const column = params[0];
      const value = params[1];
      const { data, error } = await supabase.from(table).select('*').eq(column, value).maybeSingle();
      if (error) throw error;
      return data;
    }
    return null;
  },
  
  all: async (sql, params = []) => {
    initializeDatabase();
    if (dbType === 'supabase' && supabase) {
      const table = sql.match(/FROM\s+(\w+)/i)?.[1];
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      return data || [];
    }
    return [];
  }
};

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  initializeDatabase();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: { type: dbType, connected: dbType === 'supabase' }
  });
});

// Auth routes
app.get('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint - use POST to register' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, businessName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existingUser = await dbAsync.get('SELECT id FROM users WHERE email = ?', ['email', email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();
    
    await dbAsync.run(
      `INSERT INTO users (id, email, password, first_name, last_name, business_name, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email.toLowerCase(), hashedPassword, firstName || null, lastName || null, businessName || null, now, now]
    );

    const token = generateToken(userId);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email: email.toLowerCase(), firstName, lastName, businessName }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration', message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbAsync.get('SELECT * FROM users WHERE email = ?', ['email', email.toLowerCase()]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbAsync.get('SELECT id, email, first_name, last_name, business_name FROM users WHERE id = ?', ['id', req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export for Vercel
module.exports = (req, res) => {
  return app(req, res);
};
