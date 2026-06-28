// ============================================
// OPERATIONS & SYSTEMS MODULES
// Full implementation with event delegation pattern
// ============================================

// ============================================
// 1. CEO DASHBOARD MODULE
// ============================================

const ceoDashboardState = {
    metrics: JSON.parse(localStorage.getItem('lccs_ceo_metrics') || '[]'),
    activities: JSON.parse(localStorage.getItem('lccs_ceo_activities') || '[]'),
    todos: JSON.parse(localStorage.getItem('lccs_ceo_todos') || '[]')
};

function showCEODashboard() {
    setActiveNav('operations-systems');
    
    // Calculate stats
    const totalRevenue = ceoDashboardState.metrics.find(m => m.type === 'revenue')?.value || 0;
    const activeClients = ceoDashboardState.metrics.find(m => m.type === 'clients')?.value || 0;
    const activeProjects = ceoDashboardState.metrics.find(m => m.type === 'projects')?.value || 0;
    const teamSize = ceoDashboardState.metrics.find(m => m.type === 'team')?.value || 0;
    const pendingTodos = ceoDashboardState.todos.filter(t => !t.completed).length;
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 CEO Dashboard</h1>
            <p class="welcome-subtitle">Overview of your business performance and key metrics.</p>
        </div>

        <!-- Key Metrics Cards -->
        <div class="progress-overview" style="grid-template-columns: repeat(5, 1fr);">
            <div class="progress-card">
                <div class="progress-number">$${formatNumber(totalRevenue)}</div>
                <div class="progress-label">Monthly Revenue</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${activeClients}</div>
                <div class="progress-label">Active Clients</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${activeProjects}</div>
                <div class="progress-label">Active Projects</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${teamSize}</div>
                <div class="progress-label">Team Members</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${pendingTodos}</div>
                <div class="progress-label">Pending Tasks</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div style="display: flex; gap: 16px; margin-bottom: 30px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-add-metric" data-action="add-metric">
                + Add Metric
            </button>
            <button class="btn btn-secondary" id="btn-add-todo" data-action="add-todo">
                + Add Task
            </button>
            <button class="btn btn-secondary" id="btn-view-reports" data-action="view-reports">
                📈 View Reports
            </button>
        </div>

        <!-- Main Dashboard Grid -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <!-- Left Column: Activity Feed & Quick Links -->
            <div>
                <!-- Activity Feed -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold);">📋 Recent Activity</h3>
                        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" data-action="view-all-activity">View All</button>
                    </div>
                    <div id="activity-feed">
                        ${renderActivityFeed()}
                    </div>
                </div>

                <!-- Quick Links -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">🔗 Quick Links</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <button class="btn btn-secondary" data-action="link-sales" style="justify-content: flex-start;">
                            🎯 Sales Command
                        </button>
                        <button class="btn btn-secondary" data-action="link-pipeline" style="justify-content: flex-start;">
                            📊 Pipeline
                        </button>
                        <button class="btn btn-secondary" data-action="link-content" style="justify-content: flex-start;">
                            📝 Content Calendar
                        </button>
                        <button class="btn btn-secondary" data-action="link-agents" style="justify-content: flex-start;">
                            🤖 AI Agents
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: Action Items & Metrics -->
            <div>
                <!-- Action Items / Todos -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">⚡ Action Items</h3>
                    <div id="todo-list">
                        ${renderTodoList()}
                    </div>
                </div>

                <!-- Custom Metrics -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">📈 Custom Metrics</h3>
                    <div id="custom-metrics">
                        ${renderCustomMetrics()}
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('main-content').addEventListener('click', handleCEODashboardAction);
}

function handleCEODashboardAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    
    switch(action) {
        case 'add-metric':
            showAddMetricForm();
            break;
        case 'add-todo':
            showAddTodoForm();
            break;
        case 'view-reports':
            alert('Reports view coming soon!');
            break;
        case 'view-all-activity':
            alert('Full activity log coming soon!');
            break;
        case 'link-sales':
            showSalesCommand();
            break;
        case 'link-pipeline':
            showSalesPipeline();
            break;
        case 'link-content':
            showContentCalendar();
            break;
        case 'link-agents':
            showAIAgents();
            break;
        case 'toggle-todo':
            toggleTodo(id);
            break;
        case 'delete-todo':
            deleteTodo(id);
            break;
        case 'delete-metric':
            deleteMetric(id);
            break;
    }
}

function renderActivityFeed() {
    const activities = ceoDashboardState.activities.slice(0, 5);
    if (activities.length === 0) {
        return '<p style="color: rgba(246, 241, 232, 0.5); text-align: center; padding: 20px;">No recent activity</p>';
    }
    
    return activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(246, 241, 232, 0.03); border-radius: 10px; margin-bottom: 8px;">
            <span style="font-size: 20px;">${activity.icon || '📌'}</span>
            <div style="flex: 1;">
                <div style="font-size: 14px; color: var(--ivory-light);">${activity.message}</div>
                <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">${formatTime(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function renderTodoList() {
    const todos = ceoDashboardState.todos.filter(t => !t.completed).slice(0, 5);
    if (todos.length === 0) {
        return '<p style="color: rgba(246, 241, 232, 0.5); text-align: center; padding: 20px;">No pending tasks</p>';
    }
    
    return todos.map(todo => `
        <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.03); border-radius: 10px; margin-bottom: 8px;">
            <input type="checkbox" data-action="toggle-todo" data-id="${todo.id}" style="cursor: pointer;">
            <span style="flex: 1; font-size: 14px; color: var(--ivory-light);">${todo.text}</span>
            <button data-action="delete-todo" data-id="${todo.id}" style="background: none; border: none; color: rgba(246, 241, 232, 0.5); cursor: pointer; font-size: 16px;">×</button>
        </div>
    `).join('');
}

function renderCustomMetrics() {
    const metrics = ceoDashboardState.metrics;
    if (metrics.length === 0) {
        return '<p style="color: rgba(246, 241, 232, 0.5); text-align: center; padding: 20px;">No custom metrics yet</p>';
    }
    
    return metrics.map(metric => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(246, 241, 232, 0.03); border-radius: 10px; margin-bottom: 8px;">
            <div>
                <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6);">${metric.name}</div>
                <div style="font-size: 18px; font-weight: 600; color: var(--warm-gold);">${metric.value}</div>
            </div>
            <button data-action="delete-metric" data-id="${metric.id}" style="background: none; border: none; color: rgba(246, 241, 232, 0.5); cursor: pointer; font-size: 16px;">×</button>
        </div>
    `).join('');
}

function showAddMetricForm() {
    const name = prompt('Metric name (e.g., Website Visitors):');
    if (!name) return;
    
    const value = prompt('Current value:');
    if (!value) return;
    
    const metric = {
        id: 'metric_' + Date.now(),
        name,
        value,
        type: 'custom',
        timestamp: new Date().toISOString()
    };
    
    ceoDashboardState.metrics.push(metric);
    localStorage.setItem('lccs_ceo_metrics', JSON.stringify(ceoDashboardState.metrics));
    
    addActivity('📊', `Added metric: ${name}`);
    showCEODashboard();
}

function showAddTodoForm() {
    const text = prompt('Task description:');
    if (!text) return;
    
    const todo = {
        id: 'todo_' + Date.now(),
        text,
        completed: false,
        timestamp: new Date().toISOString()
    };
    
    ceoDashboardState.todos.push(todo);
    localStorage.setItem('lccs_ceo_todos', JSON.stringify(ceoDashboardState.todos));
    
    addActivity('✅', `Added task: ${text}`);
    showCEODashboard();
}

function toggleTodo(id) {
    const todo = ceoDashboardState.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('lccs_ceo_todos', JSON.stringify(ceoDashboardState.todos));
        addActivity('✅', `Completed task: ${todo.text}`);
        showCEODashboard();
    }
}

function deleteTodo(id) {
    if (!confirm('Delete this task?')) return;
    ceoDashboardState.todos = ceoDashboardState.todos.filter(t => t.id !== id);
    localStorage.setItem('lccs_ceo_todos', JSON.stringify(ceoDashboardState.todos));
    showCEODashboard();
}

function deleteMetric(id) {
    if (!confirm('Delete this metric?')) return;
    ceoDashboardState.metrics = ceoDashboardState.metrics.filter(m => m.id !== id);
    localStorage.setItem('lccs_ceo_metrics', JSON.stringify(ceoDashboardState.metrics));
    showCEODashboard();
}

function addActivity(icon, message) {
    const activity = {
        icon,
        message,
        timestamp: new Date().toISOString()
    };
    ceoDashboardState.activities.unshift(activity);
    if (ceoDashboardState.activities.length > 50) {
        ceoDashboardState.activities = ceoDashboardState.activities.slice(0, 50);
    }
    localStorage.setItem('lccs_ceo_activities', JSON.stringify(ceoDashboardState.activities));
}

function formatNumber(num) {
    if (!num || isNaN(num)) return '0';
    num = parseInt(num);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

// ============================================
// 2. TEAM COMMUNICATIONS MODULE
// ============================================

const teamCommsState = {
    members: JSON.parse(localStorage.getItem('lccs_team_members') || '[]'),
    channels: JSON.parse(localStorage.getItem('lccs_team_channels') || '[]'),
    messages: JSON.parse(localStorage.getItem('lccs_team_messages') || '[]'),
    currentChannel: null
};

function showTeamCommunications() {
    setActiveNav('operations-systems');
    
    // Initialize default channels if none exist
    if (teamCommsState.channels.length === 0) {
        teamCommsState.channels = [
            { id: 'general', name: 'General', type: 'public' },
            { id: 'announcements', name: 'Announcements', type: 'public' },
            { id: 'random', name: 'Random', type: 'public' }
        ];
        localStorage.setItem('lccs_team_channels', JSON.stringify(teamCommsState.channels));
    }
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">💬 Team Communications</h1>
            <p class="welcome-subtitle">Stay connected with your team.</p>
        </div>

        <div style="display: grid; grid-template-columns: 250px 1fr; gap: 24px; height: calc(100vh - 250px);">
            <!-- Sidebar: Channels & Members -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px; overflow-y: auto;">
                <!-- Channels -->
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="color: var(--warm-gold); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Channels</h4>
                        <button data-action="add-channel" style="background: none; border: none; color: var(--warm-gold); cursor: pointer; font-size: 18px;">+</button>
                    </div>
                    <div id="channels-list">
                        ${renderChannelsList()}
                    </div>
                </div>
                
                <!-- Team Members -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="color: var(--warm-gold); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Team Members</h4>
                        <button data-action="add-member" style="background: none; border: none; color: var(--warm-gold); cursor: pointer; font-size: 18px;">+</button>
                    </div>
                    <div id="members-list">
                        ${renderMembersList()}
                    </div>
                </div>
            </div>

            <!-- Main Chat Area -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; display: flex; flex-direction: column;">
                <!-- Channel Header -->
                <div style="padding: 20px; border-bottom: 1px solid rgba(212, 175, 99, 0.15);">
                    <h3 style="color: var(--ivory-light); font-size: 18px;">
                        # ${teamCommsState.currentChannel ? getChannelName(teamCommsState.currentChannel) : 'general'}
                    </h3>
                </div>
                
                <!-- Messages -->
                <div id="messages-container" style="flex: 1; overflow-y: auto; padding: 20px;">
                    ${renderMessages()}
                </div>
                
                <!-- Message Input -->
                <div style="padding: 20px; border-top: 1px solid rgba(212, 175, 99, 0.15);">
                    <div style="display: flex; gap: 12px;">
                        <input type="text" id="message-input" placeholder="Type a message..." 
                            style="flex: 1; padding: 12px 16px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;"
                            onkeypress="if(event.key==='Enter') sendTeamMessage()">
                        <button class="btn btn-primary" data-action="send-message">Send</button>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('main-content').addEventListener('click', handleTeamCommsAction);
}

function handleTeamCommsAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    
    switch(action) {
        case 'add-channel':
            addChannel();
            break;
        case 'add-member':
            addTeamMember();
            break;
        case 'select-channel':
            teamCommsState.currentChannel = id;
            showTeamCommunications();
            break;
        case 'send-message':
            sendTeamMessage();
            break;
    }
}

function renderChannelsList() {
    return teamCommsState.channels.map(channel => `
        <div data-action="select-channel" data-id="${channel.id}" 
            style="padding: 10px 12px; border-radius: 8px; cursor: pointer; margin-bottom: 4px; 
            background: ${teamCommsState.currentChannel === channel.id ? 'rgba(212, 175, 99, 0.2)' : 'transparent'};
            color: ${teamCommsState.currentChannel === channel.id ? 'var(--warm-gold)' : 'var(--ivory-light)'};">
            # ${channel.name}
        </div>
    `).join('');
}

function renderMembersList() {
    if (teamCommsState.members.length === 0) {
        return '<p style="color: rgba(246, 241, 232, 0.5); font-size: 13px;">No team members yet</p>';
    }
    
    return teamCommsState.members.map(member => `
        <div style="display: flex; align-items: center; gap: 10px; padding: 8px; margin-bottom: 4px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${getMemberColor(member.name)}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--deep-indigo); font-size: 12px;">
                ${getInitials(member.name)}
            </div>
            <span style="font-size: 14px; color: var(--ivory-light);">${member.name}</span>
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${member.online ? '#4CAF50' : '#666'}; margin-left: auto;"></span>
        </div>
    `).join('');
}

function renderMessages() {
    const channelId = teamCommsState.currentChannel || 'general';
    const messages = teamCommsState.messages.filter(m => m.channelId === channelId);
    
    if (messages.length === 0) {
        return '<p style="color: rgba(246, 241, 232, 0.5); text-align: center; padding: 40px;">No messages yet. Start the conversation!</p>';
    }
    
    return messages.map(msg => `
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${getMemberColor(msg.author)}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--deep-indigo); font-size: 12px; flex-shrink: 0;">
                ${getInitials(msg.author)}
            </div>
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-weight: 600; color: var(--ivory-light); font-size: 14px;">${msg.author}</span>
                    <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">${formatTime(msg.timestamp)}</span>
                </div>
                <div style="color: rgba(246, 241, 232, 0.9); font-size: 14px; line-height: 1.5;">${msg.text}</div>
            </div>
        </div>
    `).join('');
}

function getChannelName(id) {
    const channel = teamCommsState.channels.find(c => c.id === id);
    return channel ? channel.name : id;
}

function getMemberColor(name) {
    const colors = ['#D4AF63', '#2E7C83', '#CDBED6', '#5E3B6C', '#B9A9A9'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function addChannel() {
    const name = prompt('Channel name:');
    if (!name) return;
    
    const channel = {
        id: 'channel_' + Date.now(),
        name: name.toLowerCase().replace(/\s+/g, '-'),
        type: 'public'
    };
    
    teamCommsState.channels.push(channel);
    localStorage.setItem('lccs_team_channels', JSON.stringify(teamCommsState.channels));
    showTeamCommunications();
}

function addTeamMember() {
    const name = prompt('Team member name:');
    if (!name) return;
    
    const email = prompt('Email (optional):');
    
    const member = {
        id: 'member_' + Date.now(),
        name,
        email: email || '',
        online: false
    };
    
    teamCommsState.members.push(member);
    localStorage.setItem('lccs_team_members', JSON.stringify(teamCommsState.members));
    showTeamCommunications();
}

function sendTeamMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text) return;
    
    const message = {
        id: 'msg_' + Date.now(),
        channelId: teamCommsState.currentChannel || 'general',
        author: currentUser?.firstName || 'You',
        text,
        timestamp: new Date().toISOString()
    };
    
    teamCommsState.messages.push(message);
    localStorage.setItem('lccs_team_messages', JSON.stringify(teamCommsState.messages));
    
    input.value = '';
    showTeamCommunications();
}

// ============================================
// 3. MEETING AGENDAS MODULE
// ============================================

const meetingAgendasState = {
    meetings: JSON.parse(localStorage.getItem('lccs_meetings') || '[]'),
    templates: JSON.parse(localStorage.getItem('lccs_meeting_templates') || '[]')
};

function showMeetingAgendas() {
    setActiveNav('operations-systems');
    
    // Initialize default templates if none exist
    if (meetingAgendasState.templates.length === 0) {
        meetingAgendasState.templates = [
            { id: 'weekly', name: 'Weekly Team Standup', items: ['Wins from last week', 'Priorities this week', 'Blockers/Help needed'] },
            { id: 'monthly', name: 'Monthly Review', items: ['KPI Review', 'Project Updates', 'Goals for next month'] },
            { id: 'client', name: 'Client Check-in', items: ['Project status', 'Feedback', 'Next steps'] }
        ];
        localStorage.setItem('lccs_meeting_templates', JSON.stringify(meetingAgendasState.templates));
    }
    
    const upcomingMeetings = meetingAgendasState.meetings
        .filter(m => new Date(m.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📅 Meeting Agendas</h1>
            <p class="welcome-subtitle">Plan, organize, and track your meetings.</p>
        </div>

        <!-- Quick Actions -->
        <div style="display: flex; gap: 16px; margin-bottom: 30px; flex-wrap: wrap;">
            <button class="btn btn-primary" data-action="create-meeting">
                + Schedule Meeting
            </button>
            <button class="btn btn-secondary" data-action="create-template">
                + Create Template
            </button>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <!-- Upcoming Meetings -->
            <div>
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">📅 Upcoming Meetings</h3>
                    
                    <div id="meetings-list">
                        ${renderMeetingsList(upcomingMeetings)}
                    </div>
                </div>
            </div>

            <!-- Templates & Past Meetings -->
            <div>
                <!-- Templates -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">📋 Templates</h3>
                    
                    ${meetingAgendasState.templates.map(template => `
                        <div data-action="use-template" data-id="${template.id}" 
                            style="padding: 12px; background: rgba(246, 241, 232, 0.03); border-radius: 10px; margin-bottom: 8px; cursor: pointer;"
                            onmouseover="this.style.background='rgba(212, 175, 99, 0.1)'" 
                            onmouseout="this.style.background='rgba(246, 241, 232, 0.03)'">
                            <div style="font-weight: 500; color: var(--ivory-light);">${template.name}</div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">${template.items.length} agenda items</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Meeting Stats -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">📊 This Week</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div style="text-align: center; padding: 16px; background: rgba(246, 241, 232, 0.03); border-radius: 12px;">
                            <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">${upcomingMeetings.length}</div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6);">Upcoming</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: rgba(246, 241, 232, 0.03); border-radius: 12px;">
                            <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">${meetingAgendasState.templates.length}</div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6);">Templates</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('main-content').addEventListener('click', handleMeetingAgendasAction);
}

function handleMeetingAgendasAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    
    const action =