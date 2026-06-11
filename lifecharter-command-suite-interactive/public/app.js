// LifeCharter Command Suite - Main Application JavaScript

// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// State Management
let currentUser = null;
let authToken = localStorage.getItem('lccs_token');
let brainQuestions = null;
let soulQuestions = null;
let brainAnswers = {};
let soulAnswers = {};
let currentBrainSection = 'identity';
let currentSoulSection = 'values';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check Authentication
async function checkAuth() {
    if (!authToken) {
        showLoginPage();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showApp();
            loadDashboard();
        } else {
            localStorage.removeItem('lccs_token');
            authToken = null;
            showLoginPage();
        }
    } catch (err) {
        console.error('Auth check error:', err);
        showLoginPage();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Signup Form
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('user-dropdown');
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const btn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('login-error');
    
    btn.classList.add('loading');
    errorDiv.classList.remove('show');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('lccs_token', authToken);
            currentUser = data.user;
            showApp();
            loadDashboard();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.classList.add('show');
        }
    } catch (err) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.classList.add('show');
    } finally {
        btn.classList.remove('loading');
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const btn = document.getElementById('signup-btn');
    const errorDiv = document.getElementById('signup-error');
    
    btn.classList.add('loading');
    errorDiv.classList.remove('show');

    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const businessName = document.getElementById('signup-business').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, businessName, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('lccs_token', authToken);
            currentUser = data.user;
            showApp();
            loadDashboard();
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.classList.add('show');
        }
    } catch (err) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.classList.add('show');
    } finally {
        btn.classList.remove('loading');
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
    
    localStorage.removeItem('lccs_token');
    authToken = null;
    currentUser = null;
    showLoginPage();
}

// Show/Hide Pages
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('app').style.display = 'none';
}

function showSignup() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'flex';
}

function showLogin() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('signup-page').style.display = 'none';
}

function showApp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    // Update user info
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.firstName || currentUser.email.split('@')[0];
        document.getElementById('user-avatar').textContent = (currentUser.firstName?.[0] || currentUser.email[0]).toUpperCase();
    }
}

// Toggle User Dropdown
function toggleUserDropdown() {
    document.getElementById('user-dropdown').classList.toggle('show');
}

// Load Dashboard Data
async function loadDashboard() {
    try {
        // Load dashboard stats
        const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateDashboardStats(stats);
        }

        // Load activity
        const activityResponse = await fetch(`${API_BASE_URL}/activity?limit=5`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (activityResponse.ok) {
            const activity = await activityResponse.json();
            updateActivityFeed(activity.activities);
        }
    } catch (err) {
        console.error('Load dashboard error:', err);
    }
}

// Update Dashboard Stats
function updateDashboardStats(stats) {
    const modulesStarted = stats.modules.byStatus?.filter(s => s.status !== 'not_started').reduce((sum, s) => sum + s.count, 0) || 0;
    const modulesTotal = stats.modules.total || 6;
    
    document.getElementById('stat-modules').textContent = `${modulesStarted}/${modulesTotal}`;
    document.getElementById('stat-brain').textContent = `${stats.assessments.brain.answered}/${stats.assessments.brain.total}`;
    document.getElementById('stat-soul').textContent = `${stats.assessments.soul.answered}/${stats.assessments.soul.total}`;
    document.getElementById('stat-agents').textContent = stats.aiAgents || 0;
}

// Update Activity Feed
function updateActivityFeed(activities) {
    const container = document.getElementById('activity-list');
    if (!activities || activities.length === 0) {
        container.innerHTML = '<li class="activity-item"><div class="activity-content"><div class="activity-text">No recent activity</div></div></li>';
        return;
    }

    container.innerHTML = activities.map(activity => {
        const icon = getActivityIcon(activity.action);
        const text = getActivityText(activity);
        const time = formatTime(activity.created_at);
        
        return `
            <li class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-text">${text}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </li>
        `;
    }).join('');
}

function getActivityIcon(action) {
    const icons = {
        'USER_REGISTERED': '🎉',
        'USER_LOGIN': '👋',
        'BRAIN_ANSWER_SAVED': '🧠',
        'SOUL_ANSWER_SAVED': '✨',
        'MODULE_UPDATED': '📊',
        'AGENT_CREATED': '🤖',
        'AGENT_UPDATED': '🤖',
        'CONTENT_CREATED': '📝',
        'CONTENT_UPDATED': '📝'
    };
    return icons[action] || '•';
}

function getActivityText(activity) {
    const texts = {
        'USER_REGISTERED': 'Welcome to LifeCharter Command Suite!',
        'USER_LOGIN': 'You signed in',
        'BRAIN_ANSWER_SAVED': 'Updated Brain.md assessment',
        'SOUL_ANSWER_SAVED': 'Updated Soul.md assessment',
        'MODULE_UPDATED': 'Updated module progress',
        'AGENT_CREATED': 'Created new AI agent',
        'AGENT_UPDATED': 'Updated AI agent',
        'CONTENT_CREATED': 'Created new content item',
        'CONTENT_UPDATED': 'Updated content item'
    };
    return texts[activity.action] || activity.action;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}

// Navigation Functions
function showDashboard() {
    setActiveNav('dashboard');
    document.getElementById('main-content').innerHTML = getDashboardHTML();
    loadDashboard();
}

function showAssessments() {
    setActiveNav('assessments');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📋 Foundation Assessments</h1>
            <p class="welcome-subtitle">Complete both assessments to unlock your full workspace and personalized AI training.</p>
        </div>
        <div class="workspace-grid">
            <div class="workspace-card" style="border: 2px solid rgba(46, 124, 131, 0.3);">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.2);">🧠</div>
                    <span class="card-status status-progress" id="brain-status-badge">In Progress</span>
                </div>
                <h3 class="card-title">Brain.md Assessment</h3>
                <p class="card-description">Define your business identity, model, revenue streams, and strategic foundation.</p>
                <div class="progress-bar">
                    <div class="progress-bar-fill" id="brain-progress-bar" style="width: 0%"></div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="showBrainAssessment()">Continue →</button>
                </div>
            </div>
            <div class="workspace-card" style="border: 2px solid rgba(205, 190, 214, 0.2);">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(205, 190, 214, 0.2);">✨</div>
                    <span class="card-status status-locked" id="soul-status-badge">Start Here</span>
                </div>
                <h3 class="card-title">Soul.md Assessment</h3>
                <p class="card-description">Connect with your personal values, life vision, and alignment patterns.</p>
                <div class="progress-bar">
                    <div class="progress-bar-fill" id="soul-progress-bar" style="width: 0%"></div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="showSoulAssessment()">Start →</button>
                </div>
            </div>
        </div>
    `;
    loadAssessmentProgress();
}

async function loadAssessmentProgress() {
    try {
        const [brainRes, soulRes] = await Promise.all([
            fetch(`${API_BASE_URL}/assessments/brain/progress`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
            fetch(`${API_BASE_URL}/assessments/soul/progress`, { headers: { 'Authorization': `Bearer ${authToken}` } })
        ]);

        if (brainRes.ok) {
            const brain = await brainRes.json();
            const brainPercent = brain.progress.percent;
            document.getElementById('brain-progress-bar').style.width = `${brainPercent}%`;
            document.getElementById('brain-status-badge').textContent = brainPercent === 100 ? 'Complete' : brainPercent > 0 ? 'In Progress' : 'Start Here';
            document.getElementById('brain-status-badge').className = `card-status ${brainPercent === 100 ? 'status-complete' : brainPercent > 0 ? 'status-progress' : 'status-locked'}`;
            brainAnswers = {};
            brain.answers.forEach(a => brainAnswers[a.question_id] = a.answer);
        }

        if (soulRes.ok) {
            const soul = await soulRes.json();
            const soulPercent = soul.progress.percent;
            document.getElementById('soul-progress-bar').style.width = `${soulPercent}%`;
            document.getElementById('soul-status-badge').textContent = soulPercent === 100 ? 'Complete' : soulPercent > 0 ? 'In Progress' : 'Start Here';
            document.getElementById('soul-status-badge').className = `card-status ${soulPercent === 100 ? 'status-complete' : soulPercent > 0 ? 'status-progress' : 'status-locked'}`;
            soulAnswers = {};
            soul.answers.forEach(a => soulAnswers[a.question_id] = a.answer);
        }
    } catch (err) {
        console.error('Load assessment progress error:', err);
    }
}

function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    // Find and activate the appropriate nav link
}

function getDashboardHTML() {
    return `
        <div class="welcome-section">
            <h1 class="welcome-title">Build Your Command Suite</h1>
            <p class="welcome-subtitle">Create the systems, workflows, and assets that will run your business while you transform lives.</p>
        </div>

        <div class="progress-overview">
            <div class="progress-card">
                <div class="progress-number" id="stat-modules">0/6</div>
                <div class="progress-label">Modules Started</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-brain">0/15</div>
                <div class="progress-label">Brain Questions</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-soul">0/27</div>
                <div class="progress-label">Soul Questions</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-agents">0</div>
                <div class="progress-label">AI Agents</div>
            </div>
        </div>

        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">📋 Foundation Modules</h2>
        </div>
        
        <div class="workspace-grid">
            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.2);">🧠</div>
                    <span class="card-status status-progress">In Progress</span>
                </div>
                <h3 class="card-title">Brain.md Assessment</h3>
                <p class="card-description">Define your business identity, model, revenue streams, and strategic foundation.</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="showBrainAssessment()">Continue →</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(205, 190, 214, 0.2);">✨</div>
                    <span class="card-status status-locked">Start Here</span>
                </div>
                <h3 class="card-title">Soul.md Assessment</h3>
                <p class="card-description">Connect with your personal values, life vision, and alignment patterns.</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="showSoulAssessment()">Start →</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon">🤖</div>
                    <span class="card-status status-locked">Locked</span>
                </div>
                <h3 class="card-title">My AI Support Agents</h3>
                <p class="card-description">Create up to 5 custom AI agents trained on your voice and methodology.</p>
                <div class="card-actions">
                    <button class="btn btn-secondary" disabled>Create Agent</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon">📅</div>
                    <span class="card-status status-locked">Locked</span>
                </div>
                <h3 class="card-title">90-Day Content System</h3>
                <p class="card-description">Build your content calendar and publishing workflow.</p>
                <div class="card-actions">
                    <button class="btn btn-secondary" disabled>Start Planning</button>
                </div>
            </div>
        </div>

        <section class="activity-section">
            <div class="section-header">
                <h2 class="section-title">Recent Activity</h2>
            </div>
            <ul class="activity-list" id="activity-list">
                <li class="activity-item">
                    <div class="activity-content">
                        <div class="activity-text">Loading activity...</div>
                    </div>
                </li>
            </ul>
        </section>
    `;
}

// Brain Assessment
async function showBrainAssessment() {
    setActiveNav('assessments');
    
    // Load questions if not loaded
    if (!brainQuestions) {
        try {
            const response = await fetch(`${API_BASE_URL}/assessments/brain/questions`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                brainQuestions = data.questions;
            }
        } catch (err) {
            console.error('Load brain questions error:', err);
        }
    }

    // Load existing answers
    try {
        const response = await fetch(`${API_BASE_URL}/assessments/brain/progress`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            const data = await response.json();
            brainAnswers = {};
            data.answers.forEach(a => brainAnswers[a.question_id] = a.answer);
        }
    } catch (err) {
        console.error('Load brain answers error:', err);
    }

    renderBrainAssessment();
}

function renderBrainAssessment() {
    const sections = Object.keys(brainQuestions || {});
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🧠 Brain.md Assessment</h1>
            <p class="welcome-subtitle">Define your business identity, model, and strategic foundation.</p>
        </div>
        
        <div class="section-nav">
            ${sections.map(section => `
                <button class="section-nav-btn ${section === currentBrainSection ? 'active' : ''}" 
                        onclick="setBrainSection('${section}')">
                    ${section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
            `).join('')}
        </div>
        
        <div class="assessment-container">
    `;

    const questions = brainQuestions?.[currentBrainSection] || [];
    questions.forEach((q, idx) => {
        const answer = brainAnswers[q.id] || '';
        html += `
            <div class="question-card">
                <div class="question-number">Question ${idx + 1} of ${questions.length}</div>
                <div class="question-text">${q.question}</div>
                ${renderQuestionInput(q, answer, 'brain')}
            </div>
        `;
    });

    html += `
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
                <button class="btn btn-primary" onclick="saveBrainSection()">Save Progress</button>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = html;
}

function setBrainSection(section) {
    currentBrainSection = section;
    renderBrainAssessment();
}

// Soul Assessment
async function showSoulAssessment() {
    setActiveNav('assessments');
    
    if (!soulQuestions) {
        try {
            const response = await fetch(`${API_BASE_URL}/assessments/soul/questions`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                soulQuestions = data.questions;
            }
        } catch (err) {
            console.error('Load soul questions error:', err);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/assessments/soul/progress`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            const data = await response.json();
            soulAnswers = {};
            data.answers.forEach(a => soulAnswers[a.question_id] = a.answer);
        }
    } catch (err) {
        console.error('Load soul answers error:', err);
    }

    renderSoulAssessment();
}

function renderSoulAssessment() {
    const sections = Object.keys(soulQuestions || {});
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">✨ Soul.md Assessment</h1>
            <p class="welcome-subtitle">Connect with your personal values, life vision, and alignment patterns.</p>
        </div>
        
        <div class="section-nav">
            ${sections.map(section => `
                <button class="section-nav-btn ${section === currentSoulSection ? 'active' : ''}" 
                        onclick="setSoulSection('${section}')">
                    ${section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
            `).join('')}
        </div>
        
        <div class="assessment-container">
    `;

    const questions = soulQuestions?.[currentSoulSection] || [];
    questions.forEach((q, idx) => {
        const answer = soulAnswers[q.id] || '';
        html += `
            <div class="question-card">
                <div class="question-number">Question ${idx + 1} of ${questions.length}</div>
                <div class="question-text">${q.question}</div>
                ${renderQuestionInput(q, answer, 'soul')}
            </div>
        `;
    });

    html += `
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
                <button class="btn btn-primary" onclick="saveSoulSection()">Save Progress</button>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = html;
}

function setSoulSection(section) {
    currentSoulSection = section;
    renderSoulAssessment();
}

function renderQuestionInput(question, answer, type) {
    const onChange = `onchange="update${type === 'brain' ? 'Brain' : 'Soul'}Answer('${question.id}', this.value)"`;
    
    if (question.type === 'textarea') {
        return `<textarea class="question-input" ${onChange} placeholder="Enter your answer...">${answer}</textarea>`;
    } else if (question.type === 'select') {
        return `
            <select class="question-select" ${onChange}>
                <option value="">Select an option...</option>
                ${question.options.map(opt => `<option value="${opt}" ${answer === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
        `;
    } else if (question.type === 'number') {
        return `<input type="number" class="question-input" style="min-height: auto;" ${onChange} value="${answer}" min="${question.min}" max="${question.max}" placeholder="${question.min}-${question.max}">`;
    } else {
        return `<input type="text" class="question-input" style="min-height: auto;" ${onChange} value="${answer}" placeholder="Enter your answer...">`;
    }
}

function updateBrainAnswer(questionId, value) {
    brainAnswers[questionId] = value;
}

function updateSoulAnswer(questionId, value) {
    soulAnswers[questionId] = value;
}

async function saveBrainSection() {
    const questions = brainQuestions[currentBrainSection];
    
    for (const q of questions) {
        const answer = brainAnswers[q.id];
        if (answer) {
            try {
                await fetch(`${API_BASE_URL}/assessments/brain/answer`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        section: currentBrainSection,
                        questionId: q.id,
                        answer: answer
                    })
                });
            } catch (err) {
                console.error('Save answer error:', err);
            }
        }
    }
    
    alert('Progress saved!');
    loadDashboard();
}

async function saveSoulSection() {
    const questions = soulQuestions[currentSoulSection];
    
    for (const q of questions) {
        const answer = soulAnswers[q.id];
        if (answer) {
            try {
                await fetch(`${API_BASE_URL}/assessments/soul/answer`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        section: currentSoulSection,
                        questionId: q.id,
                        answer: answer
                    })
                });
            } catch (err) {
                console.error('Save answer error:', err);
            }
        }
    }
    
    alert('Progress saved!');
    loadDashboard();
}

// AI Agents
async function showAIAgents() {
    setActiveNav('ai-tools');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai-agents`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        let agents = [];
        if (response.ok) {
            const data = await response.json();
            agents = data.agents;
        }

        let html = `
            <div class="welcome-section">
                <h1 class="welcome-title">🤖 My AI Support Agents</h1>
                <p class="welcome-subtitle">Create up to 5 custom AI agents trained on your voice and methodology.</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <button class="btn btn-primary" onclick="showCreateAgentForm()" style="width: auto;">
                    + Create New Agent
                </button>
                <span style="margin-left: 16px; color: rgba(246, 241, 232, 0.6);">
                    ${agents.length}/5 agents created
                </span>
            </div>
            
            <div class="workspace-grid">
        `;

        if (agents.length === 0) {
            html += `
                <div class="workspace-card" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                    <h3 class="card-title">No Agents Yet</h3>
                    <p class="card-description">Create your first AI agent to help with content, sales, operations, or client support.</p>
                    <button class="btn btn-primary" onclick="showCreateAgentForm()" style="margin-top: 20px;">Create First Agent</button>
                </div>
            `;
        } else {
            agents.forEach(agent => {
                html += `
                    <div class="workspace-card">
                        <div class="card-header">
                            <div class="card-icon">🤖</div>
                            <span class="card-status ${agent.is_active ? 'status-complete' : 'status-locked'}">
                                ${agent.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <h3 class="card-title">${agent.name}</h3>
                        <p class="card-description">${agent.role}${agent.description ? ': ' + agent.description : ''}</p>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="editAgent('${agent.id}')">Edit</button>
                            <button class="btn btn-secondary" onclick="deleteAgent('${agent.id}')" style="background: rgba(231, 76, 60, 0.1); color: #e74c3c;">Delete</button>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        document.getElementById('main-content').innerHTML = html;
        
    } catch (err) {
        console.error('Load agents error:', err);
    }
}

function showCreateAgentForm() {
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">🤖 Create AI Agent</h1>
            <p class="welcome-subtitle">Define your agent's role and capabilities.</p>
        </div>
        
        <div class="assessment-container">
            <div class="question-card">
                <div class="question-text">Agent Name</div>
                <input type="text" id="agent-name" class="question-input" style="min-height: auto;" placeholder="e.g., Content Assistant">
            </div>
            
            <div class="question-card">
                <div class="question-text">Role</div>
                <select id="agent-role" class="question-select">
                    <option value="">Select a role...</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Sales Assistant">Sales Assistant</option>
                    <option value="Client Support">Client Support</option>
                    <option value="Operations">Operations</option>
                    <option value="Custom">Custom</option>
                </select>
            </div>
            
            <div class="question-card">
                <div class="question-text">Description (Optional)</div>
                <textarea id="agent-description" class="question-input" placeholder="Describe what this agent will help with..."></textarea>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showAIAgents()">Cancel</button>
                <button class="btn btn-primary" onclick="createAgent()">Create Agent</button>
            </div>
        </div>
    `;
}

async function createAgent() {
    const name = document.getElementById('agent-name').value;
    const role = document.getElementById('agent-role').value;
    const description = document.getElementById('agent-description').value;
    
    if (!name || !role) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai-agents`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, role, description })
        });
        
        if (response.ok) {
            showAIAgents();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to create agent');
        }
    } catch (err) {
        console.error('Create agent error:', err);
        alert('Network error. Please try again.');
    }
}

async function deleteAgent(agentId) {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai-agents/${agentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            showAIAgents();
        }
    } catch (err) {
        console.error('Delete agent error:', err);
    }
}

// Content Calendar
async function showContentCalendar() {
    setActiveNav('content');
    
    try {
        const response = await fetch(`${API_BASE_URL}/content-calendar`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        let items = [];
        if (response.ok) {
            const data = await response.json();
            items = data.items;
        }

        let html = `
            <div class="welcome-section">
                <h1 class="welcome-title">📅 Content Calendar</h1>
                <p class="welcome-subtitle">Plan and track your content across all platforms.</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <button class="btn btn-primary" onclick="showCreateContentForm()" style="width: auto;">
                    + Add Content
                </button>
            </div>
            
            <div class="activity-section">
                <div class="section-header">
                    <h2 class="section-title">Upcoming Content</h2>
                </div>
        `;

        if (items.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px; color: rgba(246, 241, 232, 0.5);">
                    No content scheduled yet. Add your first piece!
                </div>
            `;
        } else {
            html += '<div style="display: grid; gap: 16px;">';
            items.slice(0, 10).forEach(item => {
                html += `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(31, 49, 91, 0.3); border-radius: 12px;">
                        <div style="font-size: 24px;">${getContentIcon(item.content_type)}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">${item.title}</div>
                            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">
                                ${item.platform || 'No platform'} • ${item.scheduled_date || 'No date'} • 
                                <span style="color: ${getStatusColor(item.status)}">${item.status}</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary" style="width: auto; padding: 8px 16px;" onclick="editContent('${item.id}')">Edit</button>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';
        document.getElementById('main-content').innerHTML = html;
        
    } catch (err) {
        console.error('Load content calendar error:', err);
    }
}

function getContentIcon(type) {
    const icons = {
        'social': '📱',
        'email': '✉️',
        'article': '📝',
        'video': '🎥',
        'podcast': '🎙️'
    };
    return icons[type] || '📝';
}

function getStatusColor(status) {
    const colors = {
        'draft': 'var(--warning)',
        'scheduled': 'var(--sacred-teal)',
        'published': 'var(--success)'
    };
    return colors[status] || 'rgba(246, 241, 232, 0.6)';
}

function showCreateContentForm() {
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📝 Add Content</h1>
            <p class="welcome-subtitle">Schedule a new content piece.</p>
        </div>
        
        <div class="assessment-container">
            <div class="question-card">
                <div class="question-text">Title</div>
                <input type="text" id="content-title" class="question-input" style="min-height: auto;" placeholder="Content title">
            </div>
            
            <div class="question-card">
                <div class="question-text">Content Type</div>
                <select id="content-type" class="question-select">
                    <option value="">Select type...</option>
                    <option value="social">Social Media</option>
                    <option value="email">Email</option>
                    <option value="article">Article/Blog</option>
                    <option value="video">Video</option>
                    <option value="podcast">Podcast</option>
                </select>
            </div>
            
            <div class="question-card">
                <div class="question-text">Platform</div>
                <input type="text" id="content-platform" class="question-input" style="min-height: auto;" placeholder="e.g., Instagram, LinkedIn">
            </div>
            
            <div class="question-card">
                <div class="question-text">Scheduled Date</div>
                <input type="date" id="content-date" class="question-input" style="min-height: auto;">
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showContentCalendar()">Cancel</button>
                <button class="btn btn-primary" onclick="createContent()">Add Content</button>
            </div>
        </div>
    `;
}

async function createContent() {
    const title = document.getElementById('content-title').value;
    const contentType = document.getElementById('content-type').value;
    const platform = document.getElementById('content-platform').value;
    const scheduledDate = document.getElementById('content-date').value;
    
    if (!title || !contentType) {
        alert('Please fill in required fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/content-calendar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, contentType, platform, scheduledDate })
        });
        
        if (response.ok) {
            showContentCalendar();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to create content');
        }
    } catch (err) {
        console.error('Create content error:', err);
        alert('Network error. Please try again.');
    }
}

// Settings
function showSettings() {
    setActiveNav('settings');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">⚙️ Settings</h1>
            <p class="welcome-subtitle">Manage your account and preferences.</p>
        </div>
        
        <div class="workspace-grid">
            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon">👤</div>
                </div>
                <h3 class="card-title">Profile</h3>
                <p class="card-description">Update your personal information and business details.</p>
                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="showProfile()">Edit Profile</button>
                </div>
            </div>
            
            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon">🔔</div>
                </div>
                <h3 class="card-title">Notifications</h3>
                <p class="card-description">Configure email notifications and alerts.</p>
                <div class="card-actions">
                    <button class="btn btn-secondary">Coming Soon</button>
                </div>
            </div>
            
            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon">🔒</div>
                </div>
                <h3 class="card-title">Security</h3>
                <p class="card-description">Change your password and security settings.</p>
                <div class="card-actions">
                    <button class="btn btn-secondary">Coming Soon</button>
                </div>
            </div>
        </div>
    `;
}

function showProfile() {
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">👤 Profile</h1>
            <p class="welcome-subtitle">Update your personal information.</p>
        </div>
        
        <div class="assessment-container">
            <div class="question-card">
                <div class="question-text">First Name</div>
                <input type="text" id="profile-firstname" class="question-input" style="min-height: auto;" value="${currentUser?.firstName || ''}">
            </div>
            
            <div class="question-card">
                <div class="question-text">Last Name</div>
                <input type="text" id="profile-lastname" class="question-input" style="min-height: auto;" value="${currentUser?.lastName || ''}">
            </div>
            
            <div class="question-card">
                <div class="question-text">Business Name</div>
                <input type="text" id="profile-business" class="question-input" style="min-height: auto;" value="${currentUser?.businessName || ''}">
            </div>
            
            <div class="question-card">
                <div class="question-text">Email</div>
                <input type="email" class="question-input" style="min-height: auto;" value="${currentUser?.email || ''}" disabled>
                <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-top: 8px;">Email cannot be changed</div>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showSettings()">Cancel</button>
                <button class="btn btn-primary" onclick="updateProfile()">Save Changes</button>
            </div>
        </div>
    `;
}

async function updateProfile() {
    const firstName = document.getElementById('profile-firstname').value;
    const lastName = document.getElementById('profile-lastname').value;
    const businessName = document.getElementById('profile-business').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, businessName })
        });
        
        if (response.ok) {
            currentUser = { ...currentUser, firstName, lastName, businessName };
            document.getElementById('user-name').textContent = firstName || currentUser.email.split('@')[0];
            alert('Profile updated!');
            showSettings();
        }
    } catch (err) {
        console.error('Update profile error:', err);
        alert('Failed to update profile');
    }
}

// Notifications & Help
function showNotifications() {
    alert('Notifications coming soon!');
}

function showHelp() {
    alert('Help center coming soon!');
}

// Stub functions for features not yet implemented
function editAgent(agentId) {
    alert('Edit agent coming soon!');
}

function editContent(contentId) {
    alert('Edit content coming soon!');
}
