const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all AI agents for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const agents = await dbAsync.all(
      `SELECT id, name, role, description, is_active, created_at 
       FROM ai_agents WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ agents, count: agents.length });
  } catch (err) {
    console.error('Get agents error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new AI agent
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, role, description, promptTemplate } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    // Check agent limit (5 per user)
    const count = await dbAsync.get('SELECT COUNT(*) as count FROM ai_agents WHERE user_id = ?', [req.user.id]);
    if (count.count >= 5) {
      return res.status(403).json({ error: 'Maximum of 5 AI agents allowed' });
    }

    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO ai_agents (id, user_id, name, role, description, prompt_template) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, name, role, description || null, promptTemplate || null]
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'AGENT_CREATED', 'ai_agent', id, JSON.stringify({ name, role })]
    );

    res.status(201).json({ message: 'AI agent created successfully', agentId: id });
  } catch (err) {
    console.error('Create agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single AI agent
router.get('/:agentId', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await dbAsync.get(
      'SELECT * FROM ai_agents WHERE id = ? AND user_id = ?',
      [agentId, req.user.id]
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ agent });
  } catch (err) {
    console.error('Get agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update AI agent
router.put('/:agentId', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { name, role, description, promptTemplate, isActive } = req.body;

    const existing = await dbAsync.get(
      'SELECT id FROM ai_agents WHERE id = ? AND user_id = ?',
      [agentId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    let updates = ['updated_at = CURRENT_TIMESTAMP'];
    let params = [];

    if (name) { updates.push('name = ?'); params.push(name); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (promptTemplate !== undefined) { updates.push('prompt_template = ?'); params.push(promptTemplate); }
    if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }

    params.push(agentId);

    await dbAsync.run(
      `UPDATE ai_agents SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'AGENT_UPDATED', 'ai_agent', agentId]
    );

    res.json({ message: 'AI agent updated successfully' });
  } catch (err) {
    console.error('Update agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete AI agent
router.delete('/:agentId', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;

    const existing = await dbAsync.get(
      'SELECT id FROM ai_agents WHERE id = ? AND user_id = ?',
      [agentId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await dbAsync.run('DELETE FROM ai_agents WHERE id = ?', [agentId]);

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'AGENT_DELETED', 'ai_agent', agentId]
    );

    res.json({ message: 'AI agent deleted successfully' });
  } catch (err) {
    console.error('Delete agent error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;