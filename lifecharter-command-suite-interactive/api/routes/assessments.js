const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dbAsync } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Brain.md Questions Structure
const BRAIN_QUESTIONS = {
  identity: [
    { id: 'biz_name', question: 'What is your business name?', type: 'text' },
    { id: 'tagline', question: 'What is your tagline or promise?', type: 'text' },
    { id: 'core_mission', question: 'What is your core mission?', type: 'textarea' },
    { id: 'unique_value', question: 'What makes your approach unique?', type: 'textarea' },
    { id: 'origin_story', question: 'What is your origin story?', type: 'textarea' }
  ],
  model: [
    { id: 'revenue_model', question: 'What is your primary revenue model?', type: 'select', options: ['Coaching', 'Courses', 'Products', 'Services', 'Membership', 'Hybrid'] },
    { id: 'target_audience', question: 'Who is your target audience?', type: 'textarea' },
    { id: 'price_range', question: 'What is your typical price range?', type: 'text' },
    { id: 'current_revenue', question: 'What is your current monthly revenue?', type: 'select', options: ['$0-1K', '$1K-5K', '$5K-10K', '$10K-25K', '$25K-50K', '$50K+'] },
    { id: 'revenue_goal', question: 'What is your revenue goal for the next 12 months?', type: 'text' }
  ],
  strategy: [
    { id: 'primary_offer', question: 'What is your primary offer?', type: 'textarea' },
    { id: 'lead_magnet', question: 'What is your main lead magnet?', type: 'text' },
    { id: 'main_channels', question: 'What are your main marketing channels?', type: 'textarea' },
    { id: 'conversion_method', question: 'How do you convert leads to customers?', type: 'textarea' },
    { id: 'retention_strategy', question: 'How do you retain customers?', type: 'textarea' }
  ]
};

// Soul.md Questions Structure
const SOUL_QUESTIONS = {
  values: [
    { id: 'core_values', question: 'What are your top 5 core values?', type: 'textarea' },
    { id: 'non_negotiables', question: 'What are your non-negotiables?', type: 'textarea' },
    { id: 'value_alignment', question: 'How aligned is your business with your values? (1-10)', type: 'number', min: 1, max: 10 },
    { id: 'value_conflicts', question: 'Where do you feel conflict between values and business?', type: 'textarea' }
  ],
  vision: [
    { id: 'life_vision', question: 'What is your life vision statement?', type: 'textarea' },
    { id: 'dream_lifestyle', question: 'Describe your dream lifestyle:', type: 'textarea' },
    { id: 'legacy', question: 'What legacy do you want to leave?', type: 'textarea' },
    { id: 'freedom_definition', question: 'What does freedom mean to you?', type: 'textarea' }
  ],
  alignment: [
    { id: 'alignment_pattern', question: 'What is your primary alignment pattern?', type: 'select', options: ['Purpose-Ready Butterfly', 'Emerging Visionary', 'Seasoned Transformer', 'Alignment Architect'] },
    { id: 'yellow_light_practice', question: 'What is your Yellow Light practice?', type: 'textarea' },
    { id: 'fear_response', question: 'How do you typically respond to fear?', type: 'textarea' },
    { id: 'truth_practice', question: 'How do you reconnect with truth?', type: 'textarea' }
  ],
  energy: [
    { id: 'peak_hours', question: 'When are your peak energy hours?', type: 'text' },
    { id: 'energy_drains', question: 'What drains your energy?', type: 'textarea' },
    { id: 'energy_boosts', question: 'What gives you energy?', type: 'textarea' },
    { id: 'work_rhythm', question: 'What is your ideal work rhythm?', type: 'textarea' }
  ],
  relationships: [
    { id: 'support_system', question: 'Who is in your support system?', type: 'textarea' },
    { id: 'boundary_challenges', question: 'Where do you struggle with boundaries?', type: 'textarea' },
    { id: 'ideal_client', question: 'Describe your ideal client relationship:', type: 'textarea' }
  ],
  impact: [
    { id: 'desired_impact', question: 'What impact do you want to create?', type: 'textarea' },
    { id: 'success_definition', question: 'How do you define success?', type: 'textarea' },
    { id: 'contribution', question: 'How do you want to contribute?', type: 'textarea' }
  ]
};

// Get Brain.md questions
router.get('/brain/questions', authenticateToken, (req, res) => {
  res.json({ questions: BRAIN_QUESTIONS });
});

// Get Soul.md questions
router.get('/soul/questions', authenticateToken, (req, res) => {
  res.json({ questions: SOUL_QUESTIONS });
});

// Get Brain.md progress for user
router.get('/brain/progress', authenticateToken, async (req, res) => {
  try {
    const answers = await dbAsync.all(
      'SELECT section, question_id, answer, completed FROM brain_assessments WHERE user_id = ?',
      [req.user.id]
    );

    // Calculate progress
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    Object.values(BRAIN_QUESTIONS).forEach(section => {
      totalQuestions += section.length;
    });
    
    answeredQuestions = answers.filter(a => a.completed).length;
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

    res.json({
      answers,
      progress: {
        total: totalQuestions,
        answered: answeredQuestions,
        percent: progressPercent
      }
    });
  } catch (err) {
    console.error('Get brain progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Soul.md progress for user
router.get('/soul/progress', authenticateToken, async (req, res) => {
  try {
    const answers = await dbAsync.all(
      'SELECT section, question_id, answer, completed FROM soul_assessments WHERE user_id = ?',
      [req.user.id]
    );

    // Calculate progress
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    Object.values(SOUL_QUESTIONS).forEach(section => {
      totalQuestions += section.length;
    });
    
    answeredQuestions = answers.filter(a => a.completed).length;
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

    res.json({
      answers,
      progress: {
        total: totalQuestions,
        answered: answeredQuestions,
        percent: progressPercent
      }
    });
  } catch (err) {
    console.error('Get soul progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save Brain.md answer
router.post('/brain/answer', authenticateToken, async (req, res) => {
  try {
    const { section, questionId, answer } = req.body;

    if (!section || !questionId) {
      return res.status(400).json({ error: 'Section and questionId are required' });
    }

    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO brain_assessments (id, user_id, section, question_id, answer, completed) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, section, question_id) 
       DO UPDATE SET answer = excluded.answer, completed = excluded.completed, updated_at = CURRENT_TIMESTAMP`,
      [id, req.user.id, section, questionId, answer || '', answer ? 1 : 0]
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'BRAIN_ANSWER_SAVED', 'assessment', questionId, JSON.stringify({ section })]
    );

    res.json({ message: 'Answer saved successfully' });
  } catch (err) {
    console.error('Save brain answer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save Soul.md answer
router.post('/soul/answer', authenticateToken, async (req, res) => {
  try {
    const { section, questionId, answer } = req.body;

    if (!section || !questionId) {
      return res.status(400).json({ error: 'Section and questionId are required' });
    }

    const id = uuidv4();
    await dbAsync.run(
      `INSERT INTO soul_assessments (id, user_id, section, question_id, answer, completed) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, section, question_id) 
       DO UPDATE SET answer = excluded.answer, completed = excluded.completed, updated_at = CURRENT_TIMESTAMP`,
      [id, req.user.id, section, questionId, answer || '', answer ? 1 : 0]
    );

    // Log activity
    await dbAsync.run(
      `INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), req.user.id, 'SOUL_ANSWER_SAVED', 'assessment', questionId, JSON.stringify({ section })]
    );

    res.json({ message: 'Answer saved successfully' });
  } catch (err) {
    console.error('Save soul answer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get full assessment results
router.get('/results', authenticateToken, async (req, res) => {
  try {
    const brainAnswers = await dbAsync.all(
      'SELECT section, question_id, answer FROM brain_assessments WHERE user_id = ? AND completed = 1',
      [req.user.id]
    );

    const soulAnswers = await dbAsync.all(
      'SELECT section, question_id, answer FROM soul_assessments WHERE user_id = ? AND completed = 1',
      [req.user.id]
    );

    // Organize by section
    const brainResults = {};
    brainAnswers.forEach(a => {
      if (!brainResults[a.section]) brainResults[a.section] = {};
      brainResults[a.section][a.question_id] = a.answer;
    });

    const soulResults = {};
    soulAnswers.forEach(a => {
      if (!soulResults[a.section]) soulResults[a.section] = {};
      soulResults[a.section][a.question_id] = a.answer;
    });

    res.json({
      brain: brainResults,
      soul: soulResults,
      brainProgress: {
        answered: brainAnswers.length,
        total: Object.values(BRAIN_QUESTIONS).reduce((sum, arr) => sum + arr.length, 0)
      },
      soulProgress: {
        answered: soulAnswers.length,
        total: Object.values(SOUL_QUESTIONS).reduce((sum, arr) => sum + arr.length, 0)
      }
    });
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;