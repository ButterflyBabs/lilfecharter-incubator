const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lifecharter-command-suite.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessments');
const moduleRoutes = require('./routes/modules');
const aiAgentRoutes = require('./routes/ai-agents');
const contentCalendarRoutes = require('./routes/content-calendar');
const activityRoutes = require('./routes/activity');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/ai-agents', aiAgentRoutes);
app.use('/api/content-calendar', contentCalendarRoutes);
app.use('/api/activity', activityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  const { authenticateToken } = require('./middleware/auth');
  const { dbAsync } = require('./database');
  
  try {
    // Verify token manually since we're in a non-standard route
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const { verifyToken } = require('./middleware/auth');
    const decoded = verifyToken(token || req.cookies?.token);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Get module stats
    const moduleStats = await dbAsync.all(
      `SELECT status, COUNT(*) as count FROM module_progress WHERE user_id = ? GROUP BY status`,
      [userId]
    );

    // Get assessment progress
    const brainCount = await dbAsync.get(
      'SELECT COUNT(*) as count FROM brain_assessments WHERE user_id = ? AND completed = 1',
      [userId]
    );

    const soulCount = await dbAsync.get(
      'SELECT COUNT(*) as count FROM soul_assessments WHERE user_id = ? AND completed = 1',
      [userId]
    );

    // Get agent count
    const agentCount = await dbAsync.get(
      'SELECT COUNT(*) as count FROM ai_agents WHERE user_id = ?',
      [userId]
    );

    // Get recent activity count
    const activityCount = await dbAsync.get(
      `SELECT COUNT(*) as count FROM activity_log WHERE user_id = ? AND created_at > datetime('now', '-7 days')`,
      [userId]
    );

    res.json({
      modules: {
        total: moduleStats.reduce((sum, s) => sum + s.count, 0),
        byStatus: moduleStats
      },
      assessments: {
        brain: { answered: brainCount.count, total: 15 },
        soul: { answered: soulCount.count, total: 27 }
      },
      aiAgents: agentCount.count,
      recentActivity: activityCount.count
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;