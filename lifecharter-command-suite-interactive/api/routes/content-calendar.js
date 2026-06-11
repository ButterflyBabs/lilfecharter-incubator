const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all content items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, platform, month } = req.query;
    
    let query = `SELECT * FROM content_calendar WHERE user_id = ?`;
    let params = [req.user.id];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (platform) {
      query += ` AND platform = ?`;
      params.push(platform);
    }

    if (month) {
      query += ` AND strftime('%Y-%m', scheduled_date) = ?`;
      params.push(month);
    }

    query += ` ORDER BY scheduled_date ASC, created_at DESC`;

    const items = await dbAsync.all(query, params);

    res.json({ items, count: items.length });
  } catch (err) {
    console.error('Get content calendar error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create content item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, contentType, platform, scheduledDate, content } = req.body;

    if (!title || !contentType) {
      return res.status(400).json({ error: 'Title and content type are required' });
    }

    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO content_calendar (id, user_id, title, content_type, platform, scheduled_date, content) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, contentType, platform || null, scheduledDate || null, content || null]
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'CONTENT_CREATED', 'content_calendar', id, JSON.stringify({ title, contentType })]
    );

    res.status(201).json({ message: 'Content item created successfully', contentId: id });
  } catch (err) {
    console.error('Create content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single content item
router.get('/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;

    const item = await dbAsync.get(
      'SELECT * FROM content_calendar WHERE id = ? AND user_id = ?',
      [contentId, req.user.id]
    );

    if (!item) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    res.json({ item });
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update content item
router.put('/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;
    const { title, contentType, platform, scheduledDate, content, status } = req.body;

    const existing = await dbAsync.get(
      'SELECT id FROM content_calendar WHERE id = ? AND user_id = ?',
      [contentId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    let updates = ['updated_at = CURRENT_TIMESTAMP'];
    let params = [];

    if (title) { updates.push('title = ?'); params.push(title); }
    if (contentType) { updates.push('content_type = ?'); params.push(contentType); }
    if (platform !== undefined) { updates.push('platform = ?'); params.push(platform); }
    if (scheduledDate !== undefined) { updates.push('scheduled_date = ?'); params.push(scheduledDate); }
    if (content !== undefined) { updates.push('content = ?'); params.push(content); }
    if (status) { updates.push('status = ?'); params.push(status); }

    params.push(contentId);

    await dbAsync.run(
      `UPDATE content_calendar SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'CONTENT_UPDATED', 'content_calendar', contentId]
    );

    res.json({ message: 'Content item updated successfully' });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete content item
router.delete('/:contentId', authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;

    const existing = await dbAsync.get(
      'SELECT id FROM content_calendar WHERE id = ? AND user_id = ?',
      [contentId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Content item not found' });
    }

    await dbAsync.run('DELETE FROM content_calendar WHERE id = ?', [contentId]);

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'CONTENT_DELETED', 'content_calendar', contentId]
    );

    res.json({ message: 'Content item deleted successfully' });
  } catch (err) {
    console.error('Delete content error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get content stats
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await dbAsync.all(
      `SELECT 
        status,
        COUNT(*) as count
       FROM content_calendar 
       WHERE user_id = ?
       GROUP BY status`,
      [req.user.id]
    );

    const platformStats = await dbAsync.all(
      `SELECT 
        platform,
        COUNT(*) as count
       FROM content_calendar 
       WHERE user_id = ? AND platform IS NOT NULL
       GROUP BY platform`,
      [req.user.id]
    );

    res.json({
      statusBreakdown: stats,
      platformBreakdown: platformStats
    });
  } catch (err) {
    console.error('Get content stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;