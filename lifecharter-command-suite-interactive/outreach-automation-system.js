                                        ${item.status}
                                        </span>
                                    </td>
                                    <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div class="action-buttons">
                                            ${item.status === 'pending' ? `
                                                <button class="btn-icon" onclick="sendEmail('${item.id}')" title="Send">📤</button>
                                                <button class="btn-icon" onclick="previewEmail('${item.id}')" title="Preview">👁️</button>
                                            ` : ''}
                                            ${item.status === 'scheduled' ? `
                                                <button class="btn-icon" onclick="unscheduleEmail('${item.id}')" title="Unschedule">📅</button>
                                            ` : ''}
                                            <button class="btn-icon" onclick="deleteFromQueue('${item.id}')" title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <style>
            .queue-manager {
                max-width: 1000px;
                max-height: 80vh;
            }
            
            .queue-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 8px 16px;
                border: 1px solid var(--border-color, #ddd);
                background: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .filter-btn.active {
                background: var(--primary-color, #1F315B);
                color: white;
                border-color: var(--primary-color, #1F315B);
            }
            
            .queue-table-container {
                overflow-x: auto;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .queue-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .queue-table th {
                text-align: left;
                padding: 12px;
                background: var(--bg-secondary, #f5f5f5);
                font-weight: 600;
                position: sticky;
                top: 0;
            }
            
            .queue-table td {
                padding: 12px;
                border-bottom: 1px solid var(--border-color, #eee);
            }
            
            .recipient-cell {
                min-width: 200px;
            }
            
            .recipient-name {
                font-weight: 600;
            }
            
            .recipient-email {
                font-size: 12px;
                color: var(--text-muted, #666);
            }
            
            .status-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
                text-transform: capitalize;
            }
            
            .status-badge.pending {
                background: #fff3cd;
                color: #856404;
            }
            
            .status-badge.scheduled {
                background: #d1ecf1;
                color: #0c5460;
            }
            
            .status-badge.sent {
                background: #d4edda;
                color: #155724;
            }
            
            .status-badge.opened {
                background: #e8f5e9;
                color: #2e7d32;
            }
            
            .status-badge.replied {
                background: #f3e5f5;
                color: #7b1fa2;
            }
            
            .action-buttons {
                display: flex;
                gap: 5px;
            }
            
            .btn-icon {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                font-size: 16px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .btn-icon:hover {
                opacity: 1;
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // Add filter handlers
    modal.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            modal.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            modal.querySelectorAll('.queue-table tbody tr').forEach(row => {
                if (filter === 'all' || row.dataset.status === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Unschedule email
function unscheduleEmail(emailId) {
    const queue = new OutreachQueue();
    const item = queue.queue.find(q => q.id === emailId);
    
    if (item) {
        item.status = OUTREACH_CONFIG.statuses.PENDING;
        item.scheduledFor = null;
        queue.saveToStorage();
        showNotification('Email unscheduled', 'success');
        showQueueManager(); // Refresh
    }
}

// Delete from queue
function deleteFromQueue(emailId) {
    if (!confirm('Are you sure you want to remove this email from the queue?')) return;
    
    const queue = new OutreachQueue();
    queue.queue = queue.queue.filter(q => q.id !== emailId);
    queue.saveToStorage();
    showNotification('Email removed from queue', 'success');
    showQueueManager(); // Refresh
}

// ============================================
// ANALYTICS DASHBOARD
// ============================================

function showAnalytics() {
    const queue = new OutreachQueue();
    const analytics = new OutreachAnalytics(queue);
    const data = analytics.getDashboardData();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content analytics-dashboard">
            <div class="modal-header">
                <h3>📊 Outreach Analytics</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Summary Stats -->
                <div class="analytics-summary">
                    <div class="summary-card">
                        <div class="summary-value">${data.stats.sent}</div>
                        <div class="summary-label">Total Sent</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${data.stats.openRate}%</div>
                        <div class="summary-label">Open Rate</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${data.stats.replyRate}%</div>
                        <div class="summary-label">Reply Rate</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${data.stats.converted}</div>
                        <div class="summary-label">Conversions</div>
                    </div>
                </div>
                
                <!-- Timeline Chart -->
                <div class="analytics-section">
                    <h4>Activity Timeline (Last 30 Days)</h4>
                    <div class="timeline-chart">
                        ${renderTimelineChart(data.timeline)}
                    </div>
                </div>
                
                <!-- Template Performance -->
                <div class="analytics-section">
                    <h4>Template Performance</h4>
                    <div class="template-performance-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Template</th>
                                    <th>Sent</th>
                                    <th>Opened</th>
                                    <th>Replied</th>
                                    <th>Open Rate</th>
                                    <th>Reply Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.templatePerformance.map(t => `
                                    <tr>
                                        <td>${EMAIL_TEMPLATES[t.templateId]?.name || t.templateId}</td>
                                        <td>${t.sent}</td>
                                        <td>${t.opened}</td>
                                        <td>${t.replied}</td>
                                        <td>${t.openRate}%</td>
                                        <td>${t.replyRate}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .analytics-dashboard {
                max-width: 1000px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .analytics-summary {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .summary-card {
                background: linear-gradient(135deg, #1F315B 0%, #2E7C83 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
            
            .summary-value {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 5px;
            }
            
            .summary-label {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .analytics-section {
                margin-bottom: 30px;
            }
            
            .analytics-section h4 {
                margin-bottom: 15px;
                color: var(--primary-color, #1F315B);
            }
            
            .timeline-chart {
                display: flex;
                align-items: flex-end;
                gap: 4px;
                height: 200px;
                padding: 20px;
                background: var(--bg-secondary, #f5f5f5);
                border-radius: 8px;
                overflow-x: auto;
            }
            
            .timeline-bar {
                flex: 1;
                min-width: 20px;
                background: linear-gradient(to top, #2E7C83, #5E3B6C);
                border-radius: 3px 3px 0 0;
                position: relative;
                transition: opacity 0.2s;
            }
            
            .timeline-bar:hover {
                opacity: 0.8;
            }
            
            .timeline-bar .tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
            }
            
            .timeline-bar:hover .tooltip {
                opacity: 1;
            }
            
            .template-performance-table {
                overflow-x: auto;
            }
            
            .template-performance-table table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .template-performance-table th,
            .template-performance-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid var(--border-color, #eee);
            }
            
            .template-performance-table th {
                background: var(--bg-secondary, #f5f5f5);
                font-weight: 600;
            }
        </style>
    `;
    
    document.body.appendChild(modal);
}

// Render timeline chart
function renderTimelineChart(timeline) {
    const maxValue = Math.max(...timeline.map(d => d.sent), 1);
    
    return timeline.map(day => {
        const height = (day.sent / maxValue) * 100;
        return `
            <div class="timeline-bar" style="height: ${height}%">
                <div class="tooltip">
                    ${day.date}: ${day.sent} sent, ${day.opened} opened
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// SETTINGS
// ============================================

function showSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content settings-panel">
            <div class="modal-header">
                <h3>⚙️ Outreach Settings</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="settings-section">
                    <h4>Daily Limits</h4>
                    <div class="form-group">
                        <label>Max emails per day</label>
                        <input type="number" id="max-daily" value="${OUTREACH_CONFIG.maxDailyEmails}" min="1" max="100">
                    </div>
                    <div class="form-group">
                        <label>Minimum minutes between emails</label>
                        <input type="number" id="min-interval" value="${OUTREACH_CONFIG.minTimeBetweenEmails}" min="1" max="60">
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>Follow-up Schedule</h4>
                    <div class="form-group">
                        <label>Days between follow-ups (comma-separated)</label>
                        <input type="text" id="follow-up-schedule" value="${OUTREACH_CONFIG.followUpSchedule.join(', ')}">
                        <small>Default: 3, 7, 14, 30 days</small>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>Email Configuration</h4>
                    <div class="form-group">
                        <label>From Name</label>
                        <input type="text" id="from-name" value="Babs Carroll">
                    </div>
                    <div class="form-group">
                        <label>From Email</label>
                        <input type="email" id="from-email" value="babs@sacredkaleidoscope.community">
                    </div>
                    <div class="form-group">
                        <label>Reply-To</label>
                        <input type="email" id="reply-to" value="babs@sacredkaleidoscope.community">
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4>Calendar Links</h4>
                    <div class="form-group">
                        <label>Alignment Call Booking Link</label>
                        <input type="url" id="calendar-link" value="https://calendly.com/sacredkaleidoscope/alignment-call">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="saveOutreachSettings()">Save Settings</button>
            </div>
        </div>
        <style>
            .settings-panel {
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .settings-section {
                margin-bottom: 25px;
                padding-bottom: 25px;
                border-bottom: 1px solid var(--border-color, #eee);
            }
            
            .settings-section:last-child {
                border-bottom: none;
            }
            
            .settings-section h4 {
                margin-bottom: 15px;
                color: var(--primary-color, #1F315B);
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                font-weight: 500;
                margin-bottom: 5px;
            }
            
            .form-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border-color, #ddd);
                border-radius: 6px;
            }
            
            .form-group small {
                display: block;
                margin-top: 5px;
                color: var(--text-muted, #666);
            }
        </style>
    `;
    
    document.body.appendChild(modal);
}

// Save settings
function saveOutreachSettings() {
    const settings = {
        maxDailyEmails: parseInt(document.getElementById('max-daily').value),
        minTimeBetweenEmails: parseInt(document.getElementById('min-interval').value),
        followUpSchedule: document.getElementById('follow-up-schedule').value.split(',').map(s => parseInt(s.trim())),
        fromName: document.getElementById('from-name').value,
        fromEmail: document.getElementById('from-email').value,
        replyTo: document.getElementById('reply-to').value,
        calendarLink: document.getElementById('calendar-link').value
    };
    
    localStorage.setItem('outreach_settings', JSON.stringify(settings));
    
    // Update config
    Object.assign(OUTREACH_CONFIG, settings);
    
    showNotification('Settings saved!', 'success');
    document.querySelector('.settings-panel').closest('.modal-overlay').remove();
}

// ============================================
// INITIALIZATION
// ============================================

// Load settings on init
function loadOutreachSettings() {
    const saved = localStorage.getItem('outreach_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(OUTREACH_CONFIG, settings);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadOutreachSettings();
    
    // Check for scheduled emails to send
    checkScheduledEmails();
    
    // Set up interval to check scheduled emails
    setInterval(checkScheduledEmails, 60000); // Check every minute
});

// Check and send scheduled emails
function checkScheduledEmails() {
    const queue = new OutreachQueue();
    const now = new Date();
    
    const scheduledToSend = queue.queue.filter(item => {
        if (item.status !== OUTREACH_CONFIG.statuses.SCHEDULED) return false;
        if (!item.scheduledFor) return false;
        return new Date(item.scheduledFor) <= now;
    });
    
    scheduledToSend.forEach(item => {
        // In real implementation, this would actually send
        console.log('Auto-sending scheduled email to:', item.leadEmail);
        queue.markAsSent(item.id);
    });
    
    if (scheduledToSend.length > 0) {
        showNotification(`${scheduledToSend.length} scheduled emails sent!`, 'success');
    }
}

// ============================================
// EXPORT FOR COMMAND SUITE INTEGRATION
// ============================================

// Expose to window for Command Suite integration
window.OutreachAutomation = {
    renderDashboard: renderOutreachDashboard,
    Queue: OutreachQueue,
    Templates: EMAIL_TEMPLATES,
    Personalization: PersonalizationEngine,
    Analytics: OutreachAnalytics,
    FollowUpManager: FollowUpSequenceManager,
    CONFIG: OUTREACH_CONFIG
};

console.log('✅ Outreach Automation System loaded successfully');
