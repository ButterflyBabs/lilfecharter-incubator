// ============================================
// WINGS OUT OUTREACH SYSTEM
// For LifeCharter Command Suite
// Sacred Kaleidoscope Community
// ============================================
//
// "Head up, wings out." - This system helps Babs reach
// the people who need LifeCharter with compassion,
// clarity, and aligned action.
//

// ============================================
// CONFIGURATION
// ============================================

const WINGS_OUT_CONFIG = {
    // Daily limits to maintain human-scale outreach
    maxDailyEmails: 20,
    minTimeBetweenEmails: 15, // minutes
    
    // Follow-up schedule (days after previous contact)
    followUpSchedule: [3, 7, 14, 30],
    
    // Email statuses
    statuses: {
        PENDING: 'pending',
        SCHEDULED: 'scheduled',
        SENT: 'sent',
        OPENED: 'opened',
        CLICKED: 'clicked',
        REPLIED: 'replied',
        CONVERTED: 'converted',
        UNSUBSCRIBED: 'unsubscribed',
        BOUNCED: 'bounced'
    },
    
    // Priority levels
    priorities: {
        HIGH: 'high',
        NORMAL: 'normal',
        LOW: 'low'
    },
    
    // Default sender info (can be overridden in settings)
    fromName: 'Babs Carroll',
    fromEmail: 'babs@sacredkaleidoscope.community',
    replyTo: 'babs@sacredkaleidoscope.community',
    
    // Calendar booking link
    calendarLink: 'https://calendly.com/sacredkaleidoscope/alignment-call',
    
    // LifeCharter links
    links: {
        incubator: 'https://lifecharter.co/incubator',
        circle: 'https://lifecharter.co/circle',
        alignmentSnapshot: 'https://lifecharter.co/alignment-snapshot',
        conversations: 'https://lifecharter.co/conversations'
    }
};

// ============================================
// EMAIL TEMPLATES - ALIGNED WITH BRAND VOICE
// ============================================

const WINGS_OUT_TEMPLATES = {
    // Initial Outreach Templates
    initial_incubator: {
        id: 'initial_incubator',
        name: 'LifeCharter Incubator Invitation',
        category: 'Initial Outreach',
        subject: 'An invitation to remember who you are',
        body: `Hi {{firstName}},

I've been reflecting on something that made me think of you.

So many of us are moving through life on autopilot—reacting, surviving, waiting for the "right time" to finally get clear on what we actually want. But clarity doesn't come from waiting. It comes from choosing to stop and look.

I created the LifeCharter Incubator—a free 90-minute workshop—for people who are ready to do exactly that. Not to fix what's broken, but to remember what's true.

We explore:
• Identity First (who you are beneath the roles and expectations)
• The Yellow Light (recognizing your patterns before they choose for you)
• Aligned Action (moving from clarity, not pressure)

{{personalNote}}

If this resonates, I'd love to have you join us.

{{calendarLink}}

With warmth and respect,
Babs

---
Babs Carroll | Alignment Architect
Sacred Kaleidoscope Community
"Head up, wings out." 🦋`,
        variables: ['firstName', 'personalNote', 'calendarLink'],
        tone: 'warm, invitational, spacious'
    },
    
    initial_alignment: {
        id: 'initial_alignment',
        name: 'Alignment Snapshot Offer',
        category: 'Initial Outreach',
        subject: 'Where are you out of alignment?',
        body: `Hi {{firstName}},

Quick question: If you had to name one area of your life where you feel most out of alignment right now, what would it be?

Not the thing you think you "should" work on. The thing that actually keeps you up at night.

I ask because I built something for this exact moment—the LifeCharter Alignment Snapshot. It's a free assessment that takes about 10 minutes and gives you a clear picture of where you stand across all 12 dimensions of life.

{{personalNote}}

The snapshot won't give you a score to judge yourself by. It will give you a mirror to see yourself through.

Curious?

{{alignmentLink}}

With care,
Babs

---
Babs Carroll | Alignment Architect
Sacred Kaleidoscope Community`,
        variables: ['firstName', 'personalNote', 'alignmentLink'],
        tone: 'curious, reflective, gentle'
    },
    
    initial_conversations: {
        id: 'initial_conversations',
        name: 'Conversations of Consequence Invite',
        category: 'Initial Outreach',
        subject: 'A daily practice in remembering',
        body: `Hi {{firstName}},

I wanted to share something that's become a daily touchstone for me and thousands of others.

Every morning, I record a short audio reflection—5 to 7 minutes—on what it means to live with purpose, clarity, and aligned action. I call them Conversations of Consequence.

They're not motivational speeches. They're invitations to pause and remember what matters before the day starts making decisions for you.

{{personalNote}}

You can listen on Spotify, Apple Podcasts, or watch on YouTube. However you take them in, I hope they serve you.

{{conversationsLink}}

With gratitude,
Babs

---
Babs Carroll | Alignment Architect
Sacred Kaleidoscope Community
New episodes daily at 6am MT`,
        variables: ['firstName', 'personalNote', 'conversationsLink'],
        tone: 'invitational, humble, consistent'
    },
    
    // Follow-up Templates
    follow_up_value: {
        id: 'follow_up_value',
        name: 'Value-First Follow-up',
        category: 'Follow-up',
        subject: 'A thought I wanted to share',
        body: `Hi {{firstName}},

I know your inbox is full, so I'll keep this brief.

I was thinking about our conversation around {{topic}} and wanted to share something that might resonate:

{{valueSnippet}}

No agenda here—just wanted to pass it along in case it serves you today.

With respect for your time,
Babs`,
        variables: ['firstName', 'topic', 'valueSnippet'],
        tone: 'generous, no-pressure, brief'
    },
    
    follow_up_gentle: {
        id: 'follow_up_gentle',
        name: 'Gentle Check-in',
        category: 'Follow-up',
        subject: 'Still thinking about you',
        body: `Hi {{firstName}},

I wanted to circle back and see how you're doing.

Last we spoke, you were navigating {{context}}. I know that territory well, and I know it can feel heavy sometimes.

{{personalNote}}

If now isn't the right time for LifeCharter, I completely understand. Timing is everything, and forcing a fit helps no one.

But if you're still feeling that pull toward clarity and alignment, I'm here.

{{calendarLink}}

Either way, I'm holding space for your journey.

With care,
Babs`,
        variables: ['firstName', 'context', 'personalNote', 'calendarLink'],
        tone: 'compassionate, patient, honoring'
    },
    
    // Nurture Templates
    nurture_resource: {
        id: 'nurture_resource',
        name: 'Resource Share',
        category: 'Nurture',
        subject: 'This made me think of you',
        body: `Hi {{firstName}},

I came across something today that immediately made me think of you.

{{resourceDescription}}

{{resourceLink}}

{{personalNote}}

Hope it serves you in some small way.

Babs`,
        variables: ['firstName', 'resourceDescription', 'resourceLink', 'personalNote'],
        tone: 'thoughtful, generous, connected'
    },
    
    nurture_story: {
        id: 'nurture_story',
        name: 'Story/Insight Share',
        category: 'Nurture',
        subject: 'A moment of clarity',
        body: `Hi {{firstName}},

I wanted to share a brief story with you.

{{storyContent}}

{{personalNote}}

Thanks for being someone I can share these reflections with.

With gratitude,
Babs`,
        variables: ['firstName', 'storyContent', 'personalNote'],
        tone: 'personal, reflective, intimate'
    },
    
    // Conversion Templates
    conversion_circle: {
        id: 'conversion_circle',
        name: 'LifeCharter Circle Invitation',
        category: 'Conversion',
        subject: 'An invitation to go deeper',
        body: `Hi {{firstName}},

I've been watching your journey from a distance, and I want to extend a personal invitation.

LifeCharter Circle is opening for new members. This is the deeper container—the place where we don't just talk about alignment, we practice it together.

{{personalNote}}

In Circle, you'll find:
• Weekly live sessions with teaching and reflection
• A community of travel partners walking the same path
• Direct access to me for questions and guidance
• The structure and support to actually live your LifeCharter

This isn't for everyone. It requires commitment, honesty, and a willingness to be seen.

But if you're feeling called to stop navigating alone, I'd love to talk.

{{calendarLink}}

With respect and anticipation,
Babs

---
Babs Carroll | Alignment Architect
Sacred Kaleidoscope Community
LifeCharter Circle - Enrollment Open`,
        variables: ['firstName', 'personalNote', 'calendarLink'],
        tone: 'direct, honoring, invitational'
    },
    
    // Re-engagement Templates
    reengagement_we_miss_you: {
        id: 'reengagement_we_miss_you',
        name: 'We Miss You',
        category: 'Re-engagement',
        subject: 'Checking in with you',
        body: `Hi {{firstName}},

It's been a while since we connected, and I wanted to reach out.

Life moves fast. Priorities shift. Sometimes the things we intended to explore get pushed to "someday."

{{personalNote}}

I don't want to add to your noise. But I do want you to know that the door is still open if LifeCharter ever feels like the right next step.

No pressure. Just presence.

{{calendarLink}}

Wishing you clarity and peace,
Babs`,
        variables: ['firstName', 'personalNote', 'calendarLink'],
        tone: 'gentle, understanding, open'
    }
};

// ============================================
// OUTREACH QUEUE MANAGER
// ============================================

class WingsOutQueue {
    constructor() {
        this.queue = this.loadFromStorage();
        this.sentToday = this.getSentToday();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('wings_out_queue');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveToStorage() {
        localStorage.setItem('wings_out_queue', JSON.stringify(this.queue));
    }
    
    getSentToday() {
        const today = new Date().toDateString();
        return this.queue.filter(item => {
            if (item.status !== WINGS_OUT_CONFIG.statuses.SENT) return false;
            if (!item.sentAt) return false;
            return new Date(item.sentAt).toDateString() === today;
        }).length;
    }
    
    addToQueue(lead, templateId, priority = 'normal', scheduledFor = null) {
        const template = WINGS_OUT_TEMPLATES[templateId];
        if (!template) {
            console.error('Template not found:', templateId);
            return null;
        }
        
        const item = {
            id: 'wings_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            leadId: lead.id,
            leadName: `${lead.firstName} ${lead.lastName}`,
            leadEmail: lead.email,
            templateId: templateId,
            templateName: template.name,
            subject: template.subject,
            status: scheduledFor ? WINGS_OUT_CONFIG.statuses.SCHEDULED : WINGS_OUT_CONFIG.statuses.PENDING,
            priority: priority,
            createdAt: new Date().toISOString(),
            scheduledFor: scheduledFor,
            sentAt: null,
            openedAt: null,
            repliedAt: null,
            variables: {},
            notes: ''
        };
        
        this.queue.push(item);
        this.saveToStorage();
        
        return item;
    }
    
    getTodaysQueue() {
        const today = new Date().toDateString();
        return this.queue
            .filter(item => {
                if (item.status === WINGS_OUT_CONFIG.statuses.PENDING) return true;
                if (item.status === WINGS_OUT_CONFIG.statuses.SCHEDULED && item.scheduledFor) {
                    return new Date(item.scheduledFor).toDateString() === today;
                }
                return false;
            })
            .sort((a, b) => {
                const priorityOrder = { high: 0, normal: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
    }
    
    getPendingFollowUps() {
        const now = new Date();
        return this.queue.filter(item => {
            if (item.status !== WINGS_OUT_CONFIG.statuses.SENT) return false;
            if (!item.sentAt) return false;
            
            const daysSinceSent = Math.floor((now - new Date(item.sentAt)) / (1000 * 60 * 60 * 24));
            const followUpDays = WINGS_OUT_CONFIG.followUpSchedule;
            
            // Check if it's time for a follow-up
            const shouldFollowUp = followUpDays.some(days => daysSinceSent >= days && daysSinceSent < days + 2);
            
            // Check if we already have a pending follow-up for this lead
            const hasPendingFollowUp = this.queue.some(q => 
                q.leadId === item.leadId && 
                q.status === WINGS_OUT_CONFIG.statuses.PENDING &&
                q.createdAt > item.sentAt
            );
            
            return shouldFollowUp && !hasPendingFollowUp && !item.repliedAt;
        });
    }
    
    markAsSent(itemId) {
        const item = this.queue.find(q => q.id === itemId);
        if (item) {
            item.status = WINGS_OUT_CONFIG.statuses.SENT;
            item.sentAt = new Date().toISOString();
            this.saveToStorage();
            this.sentToday = this.getSentToday();
        }
    }
    
    markAsOpened(itemId) {
        const item = this.queue.find(q => q.id === itemId);
        if (item && !item.openedAt) {
            item.status = WINGS_OUT_CONFIG.statuses.OPENED;
            item.openedAt = new Date().toISOString();
            this.saveToStorage();
        }
    }
    
    markAsReplied(itemId) {
        const item = this.queue.find(q => q.id === itemId);
        if (item) {
            item.status = WINGS_OUT_CONFIG.statuses.REPLIED;
            item.repliedAt = new Date().toISOString();
            this.saveToStorage();
        }
    }
    
    markAsConverted(itemId) {
        const item = this.queue.find(q => q.id === itemId);
        if (item) {
            item.status = WINGS_OUT_CONFIG.statuses.CONVERTED;
            item.convertedAt = new Date().toISOString();
            this.saveToStorage();
        }
    }
    
    skipItem(itemId) {
        const index = this.queue.findIndex(q => q.id === itemId);
        if (index > -1) {
            this.queue.splice(index, 1);
            this.saveToStorage();
        }
    }
    
    getStats() {
        const today = new Date().toDateString();
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        
        const sent = this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.SENT);
        const opened = this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.OPENED || q.status === WINGS_OUT_CONFIG.statuses.REPLIED || q.status === WINGS_OUT_CONFIG.statuses.CONVERTED);
        const replied = this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.REPLIED || q.status === WINGS_OUT_CONFIG.statuses.CONVERTED);
        const converted = this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.CONVERTED);
        
        return {
            sentToday: sent.filter(q => new Date(q.sentAt).toDateString() === today).length,
            sentThisWeek: sent.filter(q => new Date(q.sentAt) >= thisWeek).length,
            sentThisMonth: sent.filter(q => new Date(q.sentAt) >= thisMonth).length,
            totalSent: sent.length,
            totalPending: this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.PENDING).length,
            totalScheduled: this.queue.filter(q => q.status === WINGS_OUT_CONFIG.statuses.SCHEDULED).length,
            openRate: sent.length > 0 ? Math.round((opened.length / sent.length) * 100) : 0,
            replyRate: sent.length > 0 ? Math.round((replied.length / sent.length) * 100) : 0,
            conversionRate: sent.length > 0 ? Math.round((converted.length / sent.length) * 100) : 0,
            remainingToday: Math.max(0, WINGS_OUT_CONFIG.maxDailyEmails - this.sentToday)
        };
    }
}

// ============================================
// PERSONALIZATION ENGINE
// ============================================

class WingsOutPersonalizer {
    static personalize(template, lead, customVars = {}) {
        let content = template.body;
        let subject = template.subject;
        
        // Standard variables
        const vars = {
            firstName: lead.firstName || 'there',
            lastName: lead.lastName || '',
            fullName: `${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
            company: lead.company || '',
            calendarLink: WINGS_OUT_CONFIG.calendarLink,
            alignmentLink: WINGS_OUT_CONFIG.links.alignmentSnapshot,
            incubatorLink: WINGS_OUT_CONFIG.links.incubator,
            circleLink: WINGS_OUT_CONFIG.links.circle,
            conversationsLink: WINGS_OUT_CONFIG.links.conversations,
            ...customVars
        };
        
        // Replace all variables
        Object.keys(vars).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, vars[key] || '');
            subject = subject.replace(regex, vars[key] || '');
        });
        
        return { subject, body: content };
    }
    
    static generatePersonalNote(lead) {
        // Generate contextual personal notes based on lead data
        const notes = [];
        
        if (lead.source) {
            notes.push(`I noticed you found us through ${lead.source}.`);
        }
        
        if (lead.interests && lead.interests.length > 0) {
            notes.push(`Your interest in ${lead.interests[0]} really stood out to me.`);
        }
        
        if (lead.lastInteraction) {
            const days = Math.floor((new Date() - new Date(lead.lastInteraction)) / (1000 * 60 * 60 * 24));
            if (days < 7) {
                notes.push('It was wonderful connecting with you recently.');
            }
        }
        
        return notes.length > 0 ? notes.join(' ') : '';
    }
}

// ============================================
// ANALYTICS DASHBOARD
// ============================================

class WingsOutAnalytics {
    constructor(queue) {
        this.queue = queue;
    }
    
    getDashboardData() {
        const stats = this.queue.getStats();
        const timeline = this.getTimelineData(30);
        const templatePerformance = this.getTemplatePerformance();
        
        return {
            stats,
            timeline,
            templatePerformance
        };
    }
    
    getTimelineData(days) {
        const data = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            
            const dayData = this.queue.queue.filter(q => {
                if (q.sentAt && new Date(q.sentAt).toDateString() === dateStr) return true;
                return false;
            });
            
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sent: dayData.length,
                opened: dayData.filter(q => q.openedAt).length,
                replied: dayData.filter(q => q.repliedAt).length
            });
        }
        
        return data;
    }
    
    getTemplatePerformance() {
        const templateStats = {};
        
        this.queue.queue.forEach(item => {
            if (!templateStats[item.templateId]) {
                templateStats[item.templateId] = {
                    templateId: item.templateId,
                    sent: 0,
                    opened: 0,
                    replied: 0
                };
            }
            
            templateStats[item.templateId].sent++;
            if (item.openedAt) templateStats[item.templateId].opened++;
            if (item.repliedAt) templateStats[item.templateId].replied++;
        });
        
        return Object.values(templateStats).map(t => ({
            ...t,
            openRate: t.sent > 0 ? Math.round((t.opened / t.sent) * 100) : 0,
            replyRate: t.sent > 0 ? Math.round((t.replied / t.sent) * 100) : 0
        }));
    }
}

// ============================================
// COMMAND SUITE INTEGRATION
// ============================================

// Main render function for Wings Out Outreach
function showWingsOutOutreach() {
    setActiveNav('growth-outreach');
    
    // Initialize queue
    if (!window.wingsOutQueue) {
        window.wingsOutQueue = new WingsOutQueue();
    }
    
    const queue = window.wingsOutQueue;
    const stats = queue.getStats();
    const todaysQueue = queue.getTodaysQueue();
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🦋 Wings Out Outreach</h1>
            <p class="welcome-subtitle">Reach the people who need LifeCharter with compassion, clarity, and aligned action. Head up, wings out.</p>
        </div>

        <!-- Daily Intention Card -->
        <div style="background: linear-gradient(135deg, rgba(94, 59, 108, 0.4) 0%, rgba(31, 49, 91, 0.4) 100%); border: 1px solid rgba(212, 175, 99, 0.3); border-radius: 20px; padding: 30px; margin-bottom: 40px;">
            <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                <div style="font-size: 48px;">🦋</div>
                <div style="flex: 1;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 8px;">Today's Intention</h3>
                    <p style="color: rgba(246, 241, 232, 0.8); margin: 0; font-style: italic;">"Every outreach is an invitation, not an imposition. We reach out to serve, not to convince."</p>
                </div>
                <div style="text-align: center; padding: 16px 24px; background: rgba(31, 49, 91, 0.5); border-radius: 12px;">
                    <div style="font-size: 32px; font-weight: 700; color: var(--warm-gold);">${stats.remainingToday}</div>
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); text-transform: uppercase; letter-spacing: 1px;">Remaining Today</div>
                </div>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="progress-overview" style="grid-template-columns: repeat(6, 1fr);">
            <div class="progress-card">
                <div class="progress-number">${stats.sentToday}</div>
                <div class="progress-label">Sent Today</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.totalPending}</div>
                <div class="progress-label">In Queue</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.openRate}%</div>
                <div class="progress-label">Open Rate</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.replyRate}%</div>
                <div class="progress-label">Reply Rate</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.conversionRate}%</div>
                <div class="progress-label">Conversion</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.totalSent}</div>
                <div class="progress-label">Total Sent</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div style="display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="generateWingsOutQueue()" style="display: flex; align-items: center; gap: 10px;">
                <span>🎯</span>
                <span>Generate Daily Queue</span>
            </button>
            <button class="btn btn-secondary" onclick="processWingsOutFollowUps()" style="display: flex; align-items: center; gap: 10px;">
                <span>🔄</span>
                <span>Process Follow-ups</span>
            </button>
            <button class="btn btn-secondary" onclick="showWingsOutComposer()" style="display: flex; align-items: center; gap: 10px;">
                <span>✉️</span>
                <span>Compose One-Off</span>
            </button>
            <button class="btn btn-secondary" onclick="showWingsOutTemplates()" style="display: flex; align-items: center; gap: 10px;">
                <span>📚</span>
                <span>Templates</span>
            </button>
            <button class="btn btn-secondary" onclick="showWingsOutQueueManager()" style="display: flex; align-items: center; gap: 10px;">
                <span>📋</span>
                <span>Manage Queue</span>
            </button>
            <button class="btn btn-secondary" onclick="showWingsOutAnalytics()" style="display: flex; align-items: center; gap: 10px;">
                <span>📊</span>
                <span>Analytics</span>
            </button>
        </div>

        <!-- Today's Queue -->
        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">Today's Queue (${todaysQueue.length})</h2>
        </div>
        
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 40px;">
            ${todaysQueue.length === 0 ? `
                <div style="text-align: center; padding: 60px 40px;">
                    <div style="font-size: 64px; margin-bottom: 24px;">📭</div>
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 12px;">No outreach scheduled for today</h3>
                    <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 30px;">Generate a daily queue from your leads to begin reaching out with intention.</p>
                    <button class="btn btn-primary" onclick="generateWingsOutQueue()">Generate Queue →</button>
                </div>
            ` : `
                <div style="display: grid; gap: 12px;">
                    ${todaysQueue.slice(0, 10).map(item => `
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(246, 241, 232, 0.05); border-radius: 12px; border: 1px solid rgba(212, 175, 99, 0.1);">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${item.priority === 'high' ? '#e74c3c' : item.priority === 'normal' ? '#f39c12' : '#95a5a6'}; box-shadow: 0 0 8px ${item.priority === 'high' ? 'rgba(231, 76, 60, 0.5)' : item.priority === 'normal' ? 'rgba(243, 156, 18, 0.5)' : 'rgba(149, 165, 166, 0.5)'};"></div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--ivory-light);">${item.leadName}</div>
                                <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">${item.leadEmail}</div>
                                <div style="font-size: 12px; color: var(--warm-gold); margin-top: 4px;">${item.templateName}</div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="previewWingsOutEmail('${item.id}')">Preview</button>
                                <button class="btn btn-primary" style="font-size: 12px; padding: 6px 12px;" onclick="sendWingsOutEmail('${item.id}')">Send</button>
                                <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="skipWingsOutEmail('${item.id}')">Skip</button>
                            </div>
                        </div>
                    `).join('')}
                    ${todaysQueue.length > 10 ? `
                        <div style="text-align: center; padding: 16px; color: rgba(246, 241, 232, 0.6);">
                            And ${todaysQueue.length - 10} more in queue...
                        </div>
                    ` : ''}
                </div>
            `}
        </div>

        <!-- Template Library Preview -->
        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">Templates by Category</h2>
        </div>
        
        <div class="workspace-grid" style="margin-bottom: 40px;">
            ${renderTemplateCategoryCard('Initial Outreach', '🌟', 'First contact templates', ['initial_incubator', 'initial_alignment', 'initial_conversations'])}
            ${renderTemplateCategoryCard('Follow-up', '🔄', 'Gentle continuation', ['follow_up_value', 'follow_up_gentle'])}
            ${renderTemplateCategoryCard('Nurture', '🌱', 'Relationship building', ['nurture_resource', 'nurture_story'])}
            ${renderTemplateCategoryCard('Conversion', '💎', 'Invitation to deepen', ['conversion_circle'])}
        </div>

        <!-- Sacred Outreach Principles -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px; text-align: center;">Sacred Outreach Principles</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 12px;">💜</div>
                    <h4 style="color: var(--ivory-light); margin-bottom: 8px;">Service Over Sales</h4>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px;">Every outreach is an act of service. We're inviting, not convincing.</p>
                </div>
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 12px;">🦋</div>
                    <h4 style="color: var(--ivory-light); margin-bottom: 8px;">Aligned Timing</h4>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px;">We respect where people are. No pressure, only invitations.</p>
                </div>
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 12px;">✨</div>
                    <h4 style="color: var(--ivory-light); margin-bottom: 8px;">Personal Presence</h4>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px;">Every email carries Babs' voice—warm, grounded, spiritually spacious.</p>
                </div>
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 12px;">🌟</div>
                    <h4 style="color: var(--ivory-light); margin-bottom: 8px;">Truth Over Tactics</h4>
                    <p style="color: rgba(246, 241, 232, 0.6); font-size: 14px;">No manipulation, no false urgency. Just honest, compassionate communication.</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// Helper function to render template category cards
function renderTemplateCategoryCard(category, icon, description, templateIds) {
    const templates = templateIds.map(id => WINGS_OUT_TEMPLATES[id]).filter(Boolean);
    return `
        <div class="workspace-card" style="cursor: pointer;" onclick="showWingsOutTemplates('${category}')">
            <div class="card-header">
                <div class="card-icon" style="font-size: 28px;">${icon}</div>
                <span class="card-status status-locked">${templates.length} templates</span>
            </div>
            <h3 class="card-title">${category}</h3>
            <p class="card-description">${description}</p>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(212, 175, 99, 0.1);">
                ${templates.map(t => `
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">• ${t.name}</div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// QUEUE GENERATION
// ============================================

function generateWingsOutQueue() {
    const queue = window.wingsOutQueue || new WingsOutQueue();
    
    // Get leads from salesCommandState or localStorage
    const leads = salesCommandState.leads || JSON.parse(localStorage.getItem('lccs_leads') || '[]');
    
    if (leads.length === 0) {
        showNotification('No leads found. Add leads to the database first.', 'warning');
        return;
    }
    
    // Filter leads that need outreach
    const leadsNeedingOutreach = leads.filter(lead => {
        // Check if lead already has pending outreach
        const hasPending = queue.queue.some(q => 
            q.leadId === lead.id && 
            (q.status === WINGS_OUT_CONFIG.statuses.PENDING || q.status === WINGS_OUT_CONFIG.statuses.SCHEDULED)
        );
        return !hasPending;
    });
    
    if (leadsNeedingOutreach.length === 0) {
        showNotification('All leads already have outreach scheduled!', 'info');
        return;
    }
    
    // Generate queue items
    let added = 0;
    const maxToAdd = Math.min(leadsNeedingOutreach.length, WINGS_OUT_CONFIG.maxDailyEmails);
    
    leadsNeedingOutreach.slice(0, maxToAdd).forEach(lead => {
        // Determine best template based on lead data
        let templateId = 'initial_incubator';
        
        if (lead.source === 'alignment-snapshot') {
            templateId = 'initial_alignment';
        } else if (lead.source === 'conversations') {
            templateId = 'initial_conversations';
        }
        
        // Determine priority
        let priority = 'normal';
        if (lead.priority === 'high' || lead.engagementScore > 70) {
            priority = 'high';
        }
        
        queue.addToQueue(lead, templateId, priority);
        added++;
    });
    
    showNotification(`Added ${added} outreach items to today's queue`, 'success');
    showWingsOutOutreach(); // Refresh
}

function processWingsOutFollowUps() {
    const queue = window.wingsOutQueue || new WingsOutQueue();
    const followUps = queue.getPendingFollowUps();
    
    if (followUps.length === 0) {
        showNotification('No follow-ups needed at this time', 'info');
        return;
    }
    
    // Get leads for these follow-ups
    const leads = salesCommandState.leads || JSON.parse(localStorage.getItem('lccs_leads') || '[]');
    
    let added = 0;
    followUps.forEach(item => {
        const lead = leads.find(l => l.id === item.leadId);
        if (lead) {
            queue.addToQueue(lead, 'follow_up_gentle', 'high');
            added++;
        }
    });
    
    showNotification(`Added ${added} follow-ups to queue`, 'success');
    showWingsOutOutreach(); // Refresh
}

// ============================================
// EMAIL ACTIONS
// ============================================

function previewWingsOutEmail(itemId) {
    const queue = window.wingsOutQueue || new WingsOutQueue();
    const item = queue.queue.find(q => q.id === itemId);
    
    if (!item) {
        showNotification('Email not found', 'error');
        return;
    }
    
    const template = WINGS_OUT_TEMPLATES[item.templateId];
    if (!template) {
        showNotification('Template not found', 'error');
        return;
    }
    
    // Get lead data
    const leads = salesCommandState.leads || JSON.parse(localStorage.getItem('lccs_leads') || '[]');
    const lead = leads.find(l => l.id === item.leadId) || { firstName: item.leadName.split(' ')[0], lastName: item.leadName.split(' ')[1] || '' };
    
    // Personalize
    const personalNote = WingsOutPersonalizer.generatePersonalNote(lead);
    const { subject, body } = WingsOutPersonalizer.personalize(template, lead, { personalNote });
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>📧 Preview: ${template.name}</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">To:</div>
                        <div style="color: var(--ivory-light);">${item.leadName} &lt;${item.leadEmail}&gt;</div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Subject:</div>
                        <div style="color: var(--warm-gold); font-weight: 500;">${subject}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 8px;">Body:</div>
                        <div style="color: var(--ivory-light); white-space: pre-wrap; line-height: 1.6;">${body}</div>
                    </div>
                </div>
                
                <div style="background: rgba(46, 124, 131, 0.1); border: 1px solid rgba(46, 124, 131, 0.3); border-radius: 12px; padding: 16px;">
                    <h4 style="color: var(--sacred-teal); margin-bottom: 12px;">✨ Personalization Variables</h4>
                    <div style="display: grid; gap: 8px;">
                        ${template.variables.map(v => `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <code style="background: rgba(31, 49, 91, 0.5); padding: 4px 8px; border-radius: 4px; font-size: 12px;">{{${v}}}</code>
                                <span style="font-size: 13px; color: rgba(246, 241, 232, 0.7);">${v === 'firstName' ? lead.firstName : v === 'personalNote' ? '(auto-generated)' : '(template default)'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                <button class="btn btn-primary" onclick="sendWingsOutEmail('${item.id}'); this.closest('.modal-overlay').remove();">Send Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function sendWingsOutEmail(itemId) {
    const queue = window.wingsOutQueue || new WingsOutQueue();
    
    // Check daily limit
    if (queue.sentToday >= WINGS_OUT_CONFIG.maxDailyEmails) {
        showNotification(`Daily limit reached (${WINGS_OUT_CONFIG.maxDailyEmails} emails). Resume tomorrow.`, 'warning');
        return;
    }
    
    // Mark as sent
    queue.markAsSent(itemId);
    
    showNotification('Email marked as sent! 🦋', 'success');
    showWingsOutOutreach(); // Refresh
}

function skipWingsOutEmail(itemId) {
    if (!confirm('Skip this outreach? It will be removed from the queue.')) return;
    
    const queue = window.wingsOutQueue || new WingsOutQueue();
    queue.skipItem(itemId);
    
    showNotification('Outreach skipped', 'info');
    showWingsOutOutreach(); // Refresh
}

// ============================================
// TEMPLATE LIBRARY
// ============================================

function showWingsOutTemplates(filterCategory = null) {
    setActiveNav('growth-outreach');
    
    const templates = Object.values(WINGS_OUT_TEMPLATES);
    const categories = [...new Set(templates.map(t => t.category))];
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📚 Wings Out Templates</h1>
            <p class="welcome-subtitle">Sacred outreach templates aligned with your voice and values.</p>
        </div>

        ${filterCategory ? `
            <div style="margin-bottom: 24px;">
                <button class="btn btn-secondary" onclick="showWingsOutTemplates()">← All Templates</button>
            </div>
        ` : ''}

        <div style="display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap;">
            <button class="btn ${!filterCategory ? 'btn-primary' : 'btn-secondary'}" onclick="showWingsOutTemplates()">All</button>
            ${categories.map(cat => `
                <button class="btn ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}" onclick="showWingsOutTemplates('${cat}')">${cat}</button>
            `).join('')}
        </div>

        <div class="workspace-grid">
            ${templates
                .filter(t => !filterCategory || t.category === filterCategory)
                .map(template => `
                    <div class="workspace-card" style="cursor: pointer;" onclick="showWingsOutTemplateDetail('${template.id}')">
                        <div class="card-header">
                            <div class="card-icon" style="font-size: 24px;">📧</div>
                            <span class="card-status status-locked">${template.category}</span>
                        </div>
                        <h3 class="card-title">${template.name}</h3>
                        <p class="card-description" style="font-size: 13px; font-style: italic; margin-bottom: 12px;">${template.subject}</p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${template.variables.map(v => `
                                <span style="font-size: 11px; background: rgba(31, 49, 91, 0.5); padding: 4px 8px; border-radius: 4px; color: rgba(246, 241, 232, 0.6);">{{${v}}}</span>
                            `).join('')}
                        </div>
                        <div style="margin-top: 12px; font-size: 12px; color: var(--sacred-teal);">Tone: ${template.tone}</div>
                    </div>
                `).join('')}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function showWingsOutTemplateDetail(templateId) {
    const template = WINGS_OUT_TEMPLATES[templateId];
    if (!template) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>${template.name}</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Category:</div>
                    <div style="color: var(--warm-gold);">${template.category}</div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Subject Line:</div>
                    <div style="color: var(--ivory-light); font-weight: 500;">${template.subject}</div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 8px;">Body:</div>
                    <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; padding: 24px; color: var(--ivory-light); white-space: pre-wrap; line-height: 1.6;">${template.body}</div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 8px;">Variables:</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${template.variables.map(v => `
                            <code style="background: rgba(46, 124, 131, 0.2); padding: 6px 12px; border-radius: 6px; color: var(--sacred-teal);">{{${v}}}</code>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Tone:</div>
                    <div style="color: rgba(246, 241, 232, 0.8);">${template.tone}</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                <button class="btn btn-primary" onclick="showWingsOutComposer('${template.id}'); this.closest('.modal-overlay').remove();">Use Template</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ============================================
// EMAIL COMPOSER
// ============================================

function showWingsOutComposer(templateId = null) {
    setActiveNav('growth-outreach');
    
    const template = templateId ? WINGS_OUT_TEMPLATES[templateId] : null;
    const leads = salesCommandState.leads || JSON.parse(localStorage.getItem('lccs_leads') || '[]');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">✉️ Compose Outreach</h1>
            <p class="welcome-subtitle">Craft a personalized outreach with intention and care.</p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Select Lead *</label>
                    <select id="composer-lead" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-size: 15px;">
                        <option value="">Choose a lead...</option>
                        ${leads.map(lead => `
                            <option value="${lead.id}">${lead.firstName} ${lead.lastName} (${lead.email})</option>
                        `).join('')}
                    </select>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Template (Optional)</label>
                    <select id="composer-template" onchange="loadTemplateIntoComposer(this.value)" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-size: 15px;">
                        <option value="">Start from scratch...</option>
                        ${Object.values(WINGS_OUT_TEMPLATES).map(t => `
                            <option value="${t.id}" ${templateId === t.id ? 'selected' : ''}>${t.name}</option>
                        `).join('')}
                    </select>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Subject *</label>
                    <input type="text" id="composer-subject" value="${template ? template.subject : ''}" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-size: 15px;">
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Body *</label>
                    <textarea id="composer-body" rows="15" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-size: 15px; font-family: inherit; line-height: 1.6; resize: vertical;">${template ? template.body : ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Priority</label>
                    <select id="composer-priority" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-size: 15px;">
                        <option value="high">High - Send ASAP</option>
                        <option value="normal" selected>Normal - Standard queue</option>
                        <option value="low">Low - When time permits</option>
                    </select>
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-secondary" onclick="showWingsOutOutreach()">Cancel</button>
                    <button class="btn btn-secondary" onclick="saveWingsOutDraft()">Save Draft</button>
                    <button class="btn btn-primary" onclick="queueWingsOutEmail()">Add to Queue</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function loadTemplateIntoComposer(templateId) {
    if (!templateId) return;
    
    const template = WINGS_OUT_TEMPLATES[templateId];
    if (!template) return;
    
    document.getElementById('composer-subject').value = template.subject;
    document.getElementById('composer-body').value = template.body;
}

function queueWingsOutEmail() {
    const leadId = document.getElementById('composer-lead').value;
    const subject = document.getElementById('composer-subject').value;
    const body = document.getElementById('composer-body').value;
    const priority = document.getElementById('composer-priority').value;
    
    if (!leadId || !subject || !body) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const leads = salesCommandState.leads || JSON.parse(localStorage.getItem('lccs_leads') || '[]');
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
        showNotification('Lead not found', 'error');
        return;
    }
    
    const queue = window.wingsOutQueue || new WingsOutQueue();
    
    // Create custom one-off item
    const item = {
        id: 'wings_custom_' + Date.now(),
        leadId: lead.id,
        leadName: `${lead.firstName} ${lead.lastName}`,
        leadEmail: lead.email,
        templateId: 'custom',
        templateName: 'Custom Email',
        subject: subject,
        body: body,
        status: WINGS_OUT_CONFIG.statuses.PENDING,
        priority: priority,
        createdAt: new Date().toISOString(),
        scheduledFor: null,
        sentAt: null,
        openedAt: null,
        repliedAt: null,
        variables: {},
        notes: ''
    };
    
    queue.queue.push(item);
    queue.saveToStorage();
    
    showNotification('Email added to queue!', 'success');
    showWingsOutOutreach();
}

// ============================================
// QUEUE MANAGER
// ============================================

function showWingsOutQueueManager() {
    setActiveNav('growth-outreach');
    
    const queue = window.wingsOutQueue || new WingsOutQueue();
    const items = queue.queue.slice().reverse(); // Most recent first
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📋 Queue Manager</h1>
            <p class="welcome-subtitle">Manage and monitor all your outreach.</p>
        </div>

        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
            ${items.length === 0 ? `
                <div style="text-align: center; padding: 60px;">
                    <div style="font-size: 64px; margin-bottom: 24px;">📭</div>
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 12px;">Queue is empty</h3>
                    <p style="color: rgba(246, 241, 232, 0.7);">Generate a queue or compose emails to get started.</p>
                </div>
            ` : `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold); font-weight: 600;">Recipient</th>
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold); font-weight: 600;">Template</th>
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold); font-weight: 600;">Status</th>
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold); font-weight: 600;">Date</th>
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold); font-weight: 600;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr style="border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                                    <td style="padding: 12px;">
                                        <div style="font-weight: 500; color: var(--ivory-light);">${item.leadName}</div>
                                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">${item.leadEmail}</div>
                                    </td>
                                    <td style="padding: 12px; color: rgba(246, 241, 232, 0.8);">${item.templateName}</td>
                                    <td style="padding: 12px;">
                                        <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; background: ${getStatusColor(item.status).bg}; color: ${getStatusColor(item.status).text};">
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td style="padding: 12px; color: rgba(246, 241, 232, 0.6); font-size: 13px;">
                                        ${item.sentAt ? new Date(item.sentAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style="padding: 12px;">
                                        <div style="display: flex; gap: 8px;">
                                            ${item.status === 'pending' ? `
                                                <button class="btn btn-primary" style="font-size: 12px; padding: 6px 12px;" onclick="sendWingsOutEmail('${item.id}')">Send</button>
                                                <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="previewWingsOutEmail('${item.id}')">Preview</button>
                                            ` : `
                                                <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="previewWingsOutEmail('${item.id}')">View</button>
                                            `}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function getStatusColor(status) {
    const colors = {
        pending: { bg: 'rgba(243, 156, 18, 0.2)', text: '#f39c12' },
        scheduled: { bg: 'rgba(52, 152, 219, 0.2)', text: '#3498db' },
        sent: { bg: 'rgba(149, 165, 166, 0.2)', text: '#95a5a6' },
        opened: { bg: 'rgba(46, 204, 113, 0.2)', text: '#2ecc71' },
        clicked: { bg: 'rgba(46, 204, 113, 0.2)', text: '#2ecc71' },
        replied: { bg: 'rgba(155, 89, 182, 0.2)', text: '#9b59b6' },
        converted: { bg: 'rgba(212, 175, 99, 0.3)', text: '#d4af63' },
        unsubscribed: { bg: 'rgba(231, 76, 60, 0.2)', text: '#e74c3c' },
        bounced: { bg: 'rgba(231, 76, 60, 0.2)', text: '#e74c3c' }
    };
    return colors[status] || colors.pending;
}

// ============================================
// ANALYTICS
// ============================================

function showWingsOutAnalytics() {
    setActiveNav('growth-outreach');
    
    const queue = window.wingsOutQueue || new WingsOutQueue();
    const analytics = new WingsOutAnalytics(queue);
    const data = analytics.getDashboardData();
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Wings Out Analytics</h1>
            <p class="welcome-subtitle">Understand how your outreach is landing.</p>
        </div>

        <!-- Summary Cards -->
        <div class="progress-overview" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 40px;">
            <div class="progress-card">
                <div class="progress-number">${data.stats.totalSent}</div>
                <div class="progress-label">Total Sent</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${data.stats.openRate}%</div>
                <div class="progress-label">Open Rate</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${data.stats.replyRate}%</div>
                <div class="progress-label">Reply Rate</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${data.stats.conversionRate}%</div>
                <div class="progress-label">Conversion Rate</div>
            </div>
        </div>

        <!-- Timeline Chart -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 40px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 20px;">Activity Timeline (Last 30 Days)</h3>
            <div style="display: flex; align-items: flex-end; gap: 4px; height: 200px; padding: 20px; background: rgba(31, 49, 91, 0.5); border-radius: 12px; overflow-x: auto;">
                ${data.timeline.map(day => {
                    const maxSent = Math.max(...data.timeline.map(d => d.sent), 1);
                    const height = (day.sent / maxSent) * 100;
                    return `
                        <div style="flex: 1; min-width: 20px; height: ${height}%; background: linear-gradient(to top, var(--sacred-teal), var(--royal-plum)); border-radius: 3px 3px 0 0; position: relative; cursor: pointer;" title="${day.date}: ${day.sent} sent, ${day.opened} opened">
                            <div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s;" class="tooltip">${day.date}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Template Performance -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 20px;">Template Performance</h3>
            
            ${data.templatePerformance.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: rgba(246, 241, 232, 0.6);">
                    No data yet. Start sending outreach to see performance metrics.
                </div>
            ` : `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
                                <th style="text-align: left; padding: 12px; color: var(--warm-gold);">Template</th>
                                <th style="text-align: center; padding: 12px; color: var(--warm-gold);">Sent</th>
                                <th style="text-align: center; padding: 12px; color: var(--warm-gold);">Opened</th>
                                <th style="text-align: center; padding: 12px; color: var(--warm-gold);">Replied</th>
                                <th style="text-align: center; padding: 12px; color: var(--warm-gold);">Open Rate</th>
                                <th style="text-align: center; padding: 12px; color: var(--warm-gold);">Reply Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.templatePerformance.map(t => `
                                <tr style="border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                                    <td style="padding: 12px; color: var(--ivory-light);">${WINGS_OUT_TEMPLATES[t.templateId]?.name || t.templateId}</td>
                                    <td style="padding: 12px; text-align: center; color: rgba(246, 241, 232, 0.8);">${t.sent}</td>
                                    <td style="padding: 12px; text-align: center; color: rgba(246, 241, 232, 0.8);">${t.opened}</td>
                                    <td style="padding: 12px; text-align: center; color: rgba(246, 241, 232, 0.8);">${t.replied}</td>
                                    <td style="padding: 12px; text-align: center; color: var(--sacred-teal); font-weight: 600;">${t.openRate}%</td>
                                    <td style="padding: 12px; text-align: center; color: var(--warm-gold); font-weight: 600;">${t.replyRate}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// ============================================
// SETTINGS
// ============================================

function showWingsOutSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>⚙️ Wings Out Settings</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--warm-gold); margin-bottom: 16px;">Daily Limits</h4>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--ivory-light);">Max emails per day</label>
                        <input type="number" id="wings-max-daily" value="${WINGS_OUT_CONFIG.maxDailyEmails}" min="1" max="100" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--ivory-light);">Minimum minutes between emails</label>
                        <input type="number" id="wings-min-interval" value="${WINGS_OUT_CONFIG.minTimeBetweenEmails}" min="1" max="60" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--warm-gold); margin-bottom: 16px;">Sender Information</h4>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--ivory-light);">From Name</label>
                        <input type="text" id="wings-from-name" value="${WINGS_OUT_CONFIG.fromName}" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--ivory-light);">From Email</label>
                        <input type="email" id="wings-from-email" value="${WINGS_OUT_CONFIG.fromEmail}" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--ivory-light);">Calendar Booking Link</label>
                        <input type="url" id="wings-calendar-link" value="${WINGS_OUT_CONFIG.calendarLink}" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="saveWingsOutSettings(); this.closest('.modal-overlay').remove();">Save Settings</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveWingsOutSettings() {
    WINGS_OUT_CONFIG.maxDailyEmails = parseInt(document.getElementById('wings-max-daily').value) || 20;
    WINGS_OUT_CONFIG.minTimeBetweenEmails = parseInt(document.getElementById('wings-min-interval').value) || 15;
    WINGS_OUT_CONFIG.fromName = document.getElementById('wings-from-name').value || 'Babs Carroll';
    WINGS_OUT_CONFIG.fromEmail = document.getElementById('wings-from-email').value || 'babs@sacredkaleidoscope.community';
    WINGS_OUT_CONFIG.calendarLink = document.getElementById('wings-calendar-link').value || 'https://calendly.com/sacredkaleidoscope/alignment-call';
    
    // Save to localStorage
    localStorage.setItem('wings_out_config', JSON.stringify(WINGS_OUT_CONFIG));
    
    showNotification('Settings saved!', 'success');
}

// Load settings on init
function loadWingsOutSettings() {
    const saved = localStorage.getItem('wings_out_config');
    if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(WINGS_OUT_CONFIG, settings);
    }
}

// ============================================
// NOTIFICATION HELPER
// ============================================

function showNotification(message, type = 'info') {
    // Use the app's notification system if available
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else if (typeof showNotification === 'function' && showNotification !== arguments.callee) {
        showNotification(message, type);
    } else {
        // Simple fallback
        const colors = {
            success: '#4CAF50',
            error: '#e74c3c',
            warning: '#FF9800',
            info: '#3498db'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadWingsOutSettings();
    
    // Initialize queue
    if (!window.wingsOutQueue) {
        window.wingsOutQueue = new WingsOutQueue();
    }
    
    console.log('🦋 Wings Out Outreach System loaded successfully');
});

// ============================================
// EXPORTS FOR COMMAND SUITE
// ============================================

window.WingsOutOutreach = {
    show: showWingsOutOutreach,
    Queue: WingsOutQueue,
    Templates: WINGS_OUT_TEMPLATES,
    Personalizer: WingsOutPersonalizer,
    Analytics: WingsOutAnalytics,
    Config: WINGS_OUT_CONFIG,
    generateQueue: generateWingsOutQueue,
    processFollowUps: processWingsOutFollowUps,
    showComposer: showWingsOutComposer,
    showTemplates: showWingsOutTemplates,
    showQueueManager: showWingsOutQueueManager,
    showAnalytics: showWingsOutAnalytics,
    showSettings: showWingsOutSettings
};

// Expose individual functions for onclick handlers
window.showWingsOutOutreach = showWingsOutOutreach;
window.generateWingsOutQueue = generateWingsOutQueue;
window.processWingsOutFollowUps = processWingsOutFollowUps;
window.showWingsOutComposer = showWingsOutComposer;
window.showWingsOutTemplates = showWingsOutTemplates;
window.showWingsOutQueueManager = showWingsOutQueueManager;
window.showWingsOutAnalytics = showWingsOutAnalytics;
window.showWingsOutSettings = showWingsOutSettings;
window.previewWingsOutEmail = previewWingsOutEmail;
window.sendWingsOutEmail = sendWingsOutEmail;
window.skipWingsOutEmail = skipWingsOutEmail;
window.showWingsOutTemplateDetail = showWingsOutTemplateDetail;
window.loadTemplateIntoComposer = loadTemplateIntoComposer;
window.queueWingsOutEmail = queueWingsOutEmail;

console.log('✅ Wings Out Outreach System ready');