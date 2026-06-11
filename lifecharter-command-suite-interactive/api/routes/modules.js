const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all module progress for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const modules = await dbAsync.all(
      `SELECT module_id, module_name, status, progress_percent, started_at, completed_at 
       FROM module_progress WHERE user_id = ? ORDER BY created_at`,
      [req.user.id]
    );

    // Calculate overall stats
    const total = modules.length;
    const completed = modules.filter(m => m.status === 'completed').length;
    const inProgress = modules.filter(m => m.status === 'in_progress').length;
    const notStarted = modules.filter(m => m.status === 'not_started').length;

    res.json({
      modules,
      stats: {
        total,
        completed,
        inProgress,
        notStarted,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    });
  } catch (err) {
    console.error('Get modules error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update module progress
router.put('/:moduleId', authenticateToken, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { status, progressPercent } = req.body;

    const existing = await dbAsync.get(
      'SELECT id FROM module_progress WHERE user_id = ? AND module_id = ?',
      [req.user.id, moduleId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Module not found' });
    }

    let updates = ['updated_at = CURRENT_TIMESTAMP'];
    let params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
      
      if (status === 'in_progress' && !existing.started_at) {
        updates.push('started_at = CURRENT_TIMESTAMP');
      }
      if (status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
        updates.push('progress_percent = 100');
      }
    }

    if (progressPercent !== undefined && status !== 'completed') {
      updates.push('progress_percent = ?');
      params.push(progressPercent);
    }

    params.push(req.user.id, moduleId);

    await dbAsync.run(
      `UPDATE module_progress SET ${updates.join(', ')} WHERE user_id = ? AND module_id = ?`,
      params
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'MODULE_UPDATED', 'module', moduleId, JSON.stringify({ status, progressPercent })]
    );

    res.json({ message: 'Module updated successfully' });
  } catch (err) {
    console.error('Update module error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get module details
router.get('/:moduleId', authenticateToken, async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await dbAsync.get(
      `SELECT * FROM module_progress WHERE user_id = ? AND module_id = ?`,
      [req.user.id, moduleId]
    );

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json({ module });
  } catch (err) {
    console.error('Get module error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;