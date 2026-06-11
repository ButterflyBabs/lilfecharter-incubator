const express = require('express');
const { dbAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get recent activity
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const activities = await dbAsync.all(
      `SELECT action, entity_type, entity_id, details, created_at 
       FROM activity_log 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    res.json({ activities });
  } catch (err) {
    console.error('Get activity error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get activity stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await dbAsync.all(
      `SELECT 
        action,
        COUNT(*) as count
       FROM activity_log 
       WHERE user_id = ?
       GROUP BY action
       ORDER BY count DESC`,
      [req.user.id]
    );

    const recentCount = await dbAsync.get(
      `SELECT COUNT(*) as count FROM activity_log WHERE user_id = ? AND created_at > datetime('now', '-7 days')`,
      [req.user.id]
    );

    res.json({
      actionBreakdown: stats,
      recentActivityCount: recentCount.count
    });
  } catch (err) {
    console.error('Get activity stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;