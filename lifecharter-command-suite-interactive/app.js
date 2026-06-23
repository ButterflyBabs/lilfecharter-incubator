// LifeCharter Command Suite - Main Application JavaScript

// Global error handler
window.onerror = function(msg, url, line, col, error) {
    alert('JavaScript Error: ' + msg + '\nLine: ' + line);
    console.error('Global error:', msg, url, line, col, error);
    return false;
};

// DEMO MODE - No backend required
const DEMO_MODE = true;

// Supabase Configuration
const SUPABASE_URL = 'https://evvudpnqbpjuyeqaapaa.supabase.co';
let supabaseClient = null;

/*
REQUIRED SUPABASE TABLES for Brain.md and Soul.md Assessments:

1. brain_assessments
   - id: uuid (primary key)
   - user_id: uuid (references auth.users)
   - status: text ('not_started', 'in_progress', 'completed')
   - progress_percentage: integer (0-100)
   - answers: jsonb
   - started_at: timestamptz
   - completed_at: timestamptz
   - last_saved: timestamptz
   - created_at: timestamptz
   - updated_at: timestamptz

2. soul_assessments
   - id: uuid (primary key)
   - user_id: uuid (references auth.users)
   - status: text ('not_started', 'in_progress', 'completed')
   - progress_percentage: integer (0-100)
   - answers: jsonb
   - started_at: timestamptz
   - completed_at: timestamptz
   - last_saved: timestamptz
   - created_at: timestamptz
   - updated_at: timestamptz

IFRAME COMMUNICATION PROTOCOL:
- Parent (Command Suite) listens for postMessage from iframe
- Message types from iframe:
  - 'brainmd:save' / 'soulmd:save' - Save progress
  - 'brainmd:complete' / 'soulmd:complete' - Assessment completed
  - 'brainmd:progress' / 'soulmd:progress' - Progress update
- Message types to iframe:
  - 'parent:requestSave' - Request iframe to save progress
*/

// Initialize Supabase client
function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, null, {
            auth: {
                autoRefreshToken: true,
                persistSession: true
            }
        });
        console.log('Supabase client initialized');
        return true;
    }
    console.warn('Supabase library not loaded');
    return false;
}

// Get current user ID from auth token
function getCurrentUserId() {
    // Extract user ID from the demo auth token or currentUser
    if (currentUser && currentUser.id) {
        return currentUser.id;
    }
    // Fallback: extract from token
    const token = localStorage.getItem('lccs_token');
    if (token && token.startsWith('demo_token_')) {
        // Use stored email to find user
        const email = localStorage.getItem('lccs_demo_current_email');
        if (email) {
            const user = demoUsers.find(u => u.email === email);
            if (user) return user.id;
        }
    }
    return null;
}

// Sales Command Agent State
const salesCommandState = {
    icp: JSON.parse(localStorage.getItem('lccs_icp') || 'null'),
    leads: JSON.parse(localStorage.getItem('lccs_leads') || '[]'),
    campaigns: JSON.parse(localStorage.getItem('lccs_campaigns') || '[]'),
    opportunities: JSON.parse(localStorage.getItem('lccs_opportunities') || '[]'),
    inbox: JSON.parse(localStorage.getItem('lccs_inbox') || '[]'),
    pipeline: JSON.parse(localStorage.getItem('lccs_pipeline') || '[]'),
    analytics: JSON.parse(localStorage.getItem('lccs_analytics') || '{}'),
    aiSettings: JSON.parse(localStorage.getItem('lccs_ai_settings') || '{}'),
    isLoading: false,
    lastSync: null
};

// State Management
let currentUser = null;
let authToken = localStorage.getItem('lccs_token');
let demoUsers = JSON.parse(localStorage.getItem('lccs_demo_users') || '[]');
let userAgents = JSON.parse(localStorage.getItem('lccs_agents') || '[]');
let brainQuestions = null;
let soulQuestions = null;
let brainAnswers = {};
let soulAnswers = {};
let currentBrainSection = 'identity';
let currentSoulSection = 'values';

// API Configuration (for future backend integration)
const API_BASE_URL = '/api';

// ============================================
// SUPABASE DATA LOADING FUNCTIONS
// ============================================

// Load all Sales Command data from Supabase
async function loadSalesDataFromSupabase() {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) {
        console.log('No user ID or Supabase client, using localStorage only');
        return false;
    }
    
    try {
        salesCommandState.isLoading = true;
        
        await Promise.all([
            loadICPFromSupabase(userId),
            loadLeadsFromSupabase(userId),
            loadCampaignsFromSupabase(userId),
            loadOpportunitiesFromSupabase(userId),
            loadInboxFromSupabase(userId)
        ]);
        
        salesCommandState.lastSync = new Date().toISOString();
        console.log('Sales Command data loaded from Supabase');
        return true;
    } catch (err) {
        console.error('Error loading Sales Command data from Supabase:', err);
        return false;
    } finally {
        salesCommandState.isLoading = false;
    }
}

// Load ICP from Supabase
async function loadICPFromSupabase(userId) {
    if (!supabaseClient) return false;
    
    try {
        const { data, error } = await supabaseClient
            .from('sales_icp')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }
        
        if (data) {
            const icp = {
                titles: data.titles,
                industries: data.industries,
                companySize: data.company_size,
                revenue: data.revenue_range,
                painPoints: data.pain_points,
                outcomes: data.desired_outcomes,
                triggers: data.buying_triggers,
                mustHaves: data.must_haves,
                redFlags: data.red_flags,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                supabaseId: data.id
            };
            salesCommandState.icp = icp;
            localStorage.setItem('lccs_icp', JSON.stringify(icp));
        }
        return true;
    } catch (err) {
        console.error('Error loading ICP from Supabase:', err);
        return false;
    }
}

// Load leads from Supabase
async function loadLeadsFromSupabase(userId) {
    if (!supabaseClient) return false;
    
    try {
        const { data, error } = await supabaseClient
            .from('sales_leads')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const leads = data.map(row => ({
                id: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                email: row.email,
                phone: row.phone,
                title: row.title,
                company: row.company,
                companySize: row.company_size,
                industry: row.industry,
                linkedin: row.linkedin_url,
                website: row.website,
                notes: row.notes,
                source: row.source,
                status: row.status,
                fitScore: row.fit_score,
                fitReasons: row.match_reasons ? JSON.parse(row.match_reasons) : [],
                lastActivity: row.last_activity,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                activities: []
            }));
            salesCommandState.leads = leads;
            localStorage.setItem('lccs_leads', JSON.stringify(leads));
        }
        return true;
    } catch (err) {
        console.error('Error loading leads from Supabase:', err);
        return false;
    }
}

// Load campaigns from Supabase
async function loadCampaignsFromSupabase(userId) {
    if (!supabaseClient) return false;
    
    try {
        // Load campaigns
        const { data: campaignsData, error: campaignsError } = await supabaseClient
            .from('sales_campaigns')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (campaignsError) throw campaignsError;
        
        if (campaignsData && campaignsData.length > 0) {
            const campaigns = [];
            
            for (const row of campaignsData) {
                // Load campaign emails
                const { data: emailsData, error: emailsError } = await supabaseClient
                    .from('sales_campaign_emails')
                    .select('*')
                    .eq('campaign_id', row.id)
                    .order('step_number', { ascending: true });
                
                if (emailsError) throw emailsError;
                
                // Load campaign leads
                const { data: campaignLeadsData, error: campaignLeadsError } = await supabaseClient
                    .from('sales_campaign_leads')
                    .select('lead_id')
                    .eq('campaign_id', row.id);
                
                if (campaignLeadsError) throw campaignLeadsError;
                
                const campaign = {
                    id: row.id,
                    name: row.name,
                    goal: row.goal,
                    status: row.status,
                    targetLeads: campaignLeadsData ? campaignLeadsData.map(cl => cl.lead_id) : [],
                    emails: emailsData ? emailsData.map(e => ({
                        id: e.id,
                        subject: e.subject,
                        body: e.body,
                        delay: e.delay_days,
                        isAIGenerated: e.is_ai_generated,
                        stepNumber: e.step_number
                    })) : [],
                    stats: {
                        sent: row.emails_sent,
                        delivered: row.emails_delivered,
                        opened: row.emails_opened,
                        clicked: row.emails_clicked,
                        replies: row.replies_received,
                        meetings: row.meetings_booked
                    },
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                    launchedAt: row.launched_at,
                    completedAt: row.completed_at
                };
                campaigns.push(campaign);
            }
            
            salesCommandState.campaigns = campaigns;
            localStorage.setItem('lccs_campaigns', JSON.stringify(campaigns));
        }
        return true;
    } catch (err) {
        console.error('Error loading campaigns from Supabase:', err);
        return false;
    }
}

// Load opportunities from Supabase
async function loadOpportunitiesFromSupabase(userId) {
    if (!supabaseClient) return false;
    
    try {
        const { data, error } = await supabaseClient
            .from('sales_opportunities')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const opportunities = [];
            
            for (const row of data) {
                // Load opportunity activities
                const { data: activitiesData, error: activitiesError } = await supabaseClient
                    .from('sales_opportunity_activities')
                    .select('*')
                    .eq('opportunity_id', row.id)
                    .order('created_at', { ascending: true });
                
                if (activitiesError) throw activitiesError;
                
                const opp = {
                    id: row.id,
                    leadId: row.lead_id,
                    campaignId: row.campaign_id,
                    name: row.name,
                    value: parseFloat(row.value) || 0,
                    stage: row.stage,
                    probability: row.probability,
                    expectedCloseDate: row.expected_close_date,
                    actualCloseDate: row.actual_close_date,
                    closeReason: row.close_reason,
                    notes: row.notes,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                    lastActivity: row.updated_at,
                    activities: activitiesData ? activitiesData.map(a => ({
                        type: a.activity_type,
                        message: a.description,
                        timestamp: a.created_at
                    })) : []
                };
                opportunities.push(opp);
            }
            
            salesCommandState.opportunities = opportunities;
            localStorage.setItem('lccs_opportunities', JSON.stringify(opportunities));
        }
        return true;
    } catch (err) {
        console.error('Error loading opportunities from Supabase:', err);
        return false;
    }
}

// Load inbox from Supabase
async function loadInboxFromSupabase(userId) {
    if (!supabaseClient) return false;
    
    try {
        const { data, error } = await supabaseClient
            .from('sales_inbox')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            const inbox = data.map(row => ({
                id: row.id,
                leadId: row.lead_id,
                campaignId: row.campaign_id,
                subject: row.subject,
                body: row.body,
                read: row.is_read,
                repliedAt: row.replied_at,
                createdAt: row.created_at
            }));
            salesCommandState.inbox = inbox;
            localStorage.setItem('lccs_inbox', JSON.stringify(inbox));
        }
        return true;
    } catch (err) {
        console.error('Error loading inbox from Supabase:', err);
        return false;
    }
}

// ============================================
// SUPABASE SAVE FUNCTIONS
// ============================================

// Save ICP to Supabase
async function saveICPToSupabase(icp) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const icpData = {
            user_id: userId,
            titles: icp.titles,
            industries: icp.industries,
            company_size: icp.companySize,
            revenue_range: icp.revenue,
            pain_points: icp.painPoints,
            desired_outcomes: icp.outcomes,
            buying_triggers: icp.triggers,
            must_haves: icp.mustHaves,
            red_flags: icp.redFlags,
            updated_at: new Date().toISOString()
        };
        
        // Check if ICP already exists
        const { data: existing } = await supabaseClient
            .from('sales_icp')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        let result;
        if (existing) {
            result = await supabaseClient
                .from('sales_icp')
                .update(icpData)
                .eq('id', existing.id);
        } else {
            icpData.created_at = new Date().toISOString();
            result = await supabaseClient
                .from('sales_icp')
                .insert([icpData]);
        }
        
        if (result.error) throw result.error;
        return true;
    } catch (err) {
        console.error('Error saving ICP to Supabase:', err);
        return false;
    }
}

// Save lead to Supabase
async function saveLeadToSupabase(lead) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const leadData = {
            user_id: userId,
            first_name: lead.firstName,
            last_name: lead.lastName,
            email: lead.email,
            phone: lead.phone,
            title: lead.title,
            company: lead.company,
            company_size: lead.companySize,
            industry: lead.industry,
            linkedin_url: lead.linkedin,
            website: lead.website,
            notes: lead.notes,
            source: lead.source || 'Manual',
            status: lead.status || 'New',
            fit_score: lead.fitScore || 0,
            match_reasons: lead.fitReasons ? JSON.stringify(lead.fitReasons) : null,
            last_activity: lead.lastActivity || new Date().toISOString(),
            created_at: lead.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const { error } = await supabaseClient
            .from('sales_leads')
            .insert([leadData]);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error saving lead to Supabase:', err);
        return false;
    }
}

// Update lead in Supabase
async function updateLeadInSupabase(lead) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient || !lead.id) return false;
    
    try {
        const leadData = {
            first_name: lead.firstName,
            last_name: lead.lastName,
            email: lead.email,
            phone: lead.phone,
            title: lead.title,
            company: lead.company,
            company_size: lead.companySize,
            industry: lead.industry,
            linkedin_url: lead.linkedin,
            website: lead.website,
            notes: lead.notes,
            source: lead.source,
            status: lead.status,
            fit_score: lead.fitScore || 0,
            match_reasons: lead.fitReasons ? JSON.stringify(lead.fitReasons) : null,
            last_activity: lead.lastActivity,
            updated_at: new Date().toISOString()
        };
        
        const { error } = await supabaseClient
            .from('sales_leads')
            .update(leadData)
            .eq('id', lead.id)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating lead in Supabase:', err);
        return false;
    }
}

// Delete lead from Supabase
async function deleteLeadFromSupabase(leadId) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const { error } = await supabaseClient
            .from('sales_leads')
            .delete()
            .eq('id', leadId)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting lead from Supabase:', err);
        return false;
    }
}

// Save campaign to Supabase
async function saveCampaignToSupabase(campaign) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        // Save campaign
        const campaignData = {
            user_id: userId,
            name: campaign.name,
            goal: campaign.goal,
            status: campaign.status || 'Draft',
            target_lead_count: campaign.targetLeads?.length || 0,
            emails_sent: campaign.stats?.sent || 0,
            emails_delivered: campaign.stats?.delivered || 0,
            emails_opened: campaign.stats?.opened || 0,
            emails_clicked: campaign.stats?.clicked || 0,
            replies_received: campaign.stats?.replies || 0,
            meetings_booked: campaign.stats?.meetings || 0,
            created_at: campaign.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            launched_at: campaign.launchedAt,
            completed_at: campaign.completedAt
        };
        
        const { data: savedCampaign, error: campaignError } = await supabaseClient
            .from('sales_campaigns')
            .insert([campaignData])
            .select()
            .single();
        
        if (campaignError) throw campaignError;
        
        // Save campaign emails
        if (campaign.emails && campaign.emails.length > 0) {
            const emailData = campaign.emails.map((email, index) => ({
                campaign_id: savedCampaign.id,
                step_number: index + 1,
                subject: email.subject,
                body: email.body,
                delay_days: email.delay || 0,
                is_ai_generated: email.isAIGenerated || false
            }));
            
            const { error: emailsError } = await supabaseClient
                .from('sales_campaign_emails')
                .insert(emailData);
            
            if (emailsError) throw emailsError;
        }
        
        // Save campaign leads
        if (campaign.targetLeads && campaign.targetLeads.length > 0) {
            const campaignLeadsData = campaign.targetLeads.map(leadId => ({
                campaign_id: savedCampaign.id,
                lead_id: leadId,
                status: 'Pending'
            }));
            
            const { error: campaignLeadsError } = await supabaseClient
                .from('sales_campaign_leads')
                .insert(campaignLeadsData);
            
            if (campaignLeadsError) throw campaignLeadsError;
        }
        
        return savedCampaign.id;
    } catch (err) {
        console.error('Error saving campaign to Supabase:', err);
        return false;
    }
}

// Update campaign in Supabase
async function updateCampaignInSupabase(campaign) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient || !campaign.id) return false;
    
    try {
        // Update campaign
        const campaignData = {
            name: campaign.name,
            goal: campaign.goal,
            status: campaign.status,
            target_lead_count: campaign.targetLeads?.length || 0,
            emails_sent: campaign.stats?.sent || 0,
            emails_delivered: campaign.stats?.delivered || 0,
            emails_opened: campaign.stats?.opened || 0,
            emails_clicked: campaign.stats?.clicked || 0,
            replies_received: campaign.stats?.replies || 0,
            meetings_booked: campaign.stats?.meetings || 0,
            updated_at: new Date().toISOString(),
            launched_at: campaign.launchedAt,
            completed_at: campaign.completedAt
        };
        
        const { error: campaignError } = await supabaseClient
            .from('sales_campaigns')
            .update(campaignData)
            .eq('id', campaign.id)
            .eq('user_id', userId);
        
        if (campaignError) throw campaignError;
        
        // Delete and re-insert emails (simpler than updating)
        await supabaseClient
            .from('sales_campaign_emails')
            .delete()
            .eq('campaign_id', campaign.id);
        
        if (campaign.emails && campaign.emails.length > 0) {
            const emailData = campaign.emails.map((email, index) => ({
                campaign_id: campaign.id,
                step_number: index + 1,
                subject: email.subject,
                body: email.body,
                delay_days: email.delay || 0,
                is_ai_generated: email.isAIGenerated || false
            }));
            
            const { error: emailsError } = await supabaseClient
                .from('sales_campaign_emails')
                .insert(emailData);
            
            if (emailsError) throw emailsError;
        }
        
        // Update campaign leads
        await supabaseClient
            .from('sales_campaign_leads')
            .delete()
            .eq('campaign_id', campaign.id);
        
        if (campaign.targetLeads && campaign.targetLeads.length > 0) {
            const campaignLeadsData = campaign.targetLeads.map(leadId => ({
                campaign_id: campaign.id,
                lead_id: leadId,
                status: 'Pending'
            }));
            
            const { error: campaignLeadsError } = await supabaseClient
                .from('sales_campaign_leads')
                .insert(campaignLeadsData);
            
            if (campaignLeadsError) throw campaignLeadsError;
        }
        
        return true;
    } catch (err) {
        console.error('Error updating campaign in Supabase:', err);
        return false;
    }
}

// Delete campaign from Supabase
async function deleteCampaignFromSupabase(campaignId) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const { error } = await supabaseClient
            .from('sales_campaigns')
            .delete()
            .eq('id', campaignId)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting campaign from Supabase:', err);
        return false;
    }
}

// Save opportunity to Supabase
async function saveOpportunityToSupabase(opportunity) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const oppData = {
            user_id: userId,
            lead_id: opportunity.leadId,
            campaign_id: opportunity.campaignId,
            name: opportunity.name || 'New Opportunity',
            value: opportunity.value || 0,
            stage: opportunity.stage || 'New Lead',
            probability: opportunity.probability || 0,
            expected_close_date: opportunity.expectedCloseDate,
            actual_close_date: opportunity.actualCloseDate,
            close_reason: opportunity.closeReason,
            notes: opportunity.notes,
            created_at: opportunity.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const { data: savedOpp, error: oppError } = await supabaseClient
            .from('sales_opportunities')
            .insert([oppData])
            .select()
            .single();
        
        if (oppError) throw oppError;
        
        // Save activities
        if (opportunity.activities && opportunity.activities.length > 0) {
            const activityData = opportunity.activities.map(a => ({
                opportunity_id: savedOpp.id,
                activity_type: a.type,
                description: a.message,
                created_at: a.timestamp
            }));
            
            const { error: activitiesError } = await supabaseClient
                .from('sales_opportunity_activities')
                .insert(activityData);
            
            if (activitiesError) throw activitiesError;
        }
        
        return savedOpp.id;
    } catch (err) {
        console.error('Error saving opportunity to Supabase:', err);
        return false;
    }
}

// Update opportunity in Supabase
async function updateOpportunityInSupabase(opportunity) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient || !opportunity.id) return false;
    
    try {
        const oppData = {
            lead_id: opportunity.leadId,
            campaign_id: opportunity.campaignId,
            name: opportunity.name,
            value: opportunity.value || 0,
            stage: opportunity.stage,
            probability: opportunity.probability,
            expected_close_date: opportunity.expectedCloseDate,
            actual_close_date: opportunity.actualCloseDate,
            close_reason: opportunity.closeReason,
            notes: opportunity.notes,
            updated_at: new Date().toISOString()
        };
        
        const { error } = await supabaseClient
            .from('sales_opportunities')
            .update(oppData)
            .eq('id', opportunity.id)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating opportunity in Supabase:', err);
        return false;
    }
}

// Update opportunity stage in Supabase
async function updateOpportunityStageInSupabase(oppId, stage) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const { error } = await supabaseClient
            .from('sales_opportunities')
            .update({
                stage: stage,
                updated_at: new Date().toISOString()
            })
            .eq('id', oppId)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error updating opportunity stage in Supabase:', err);
        return false;
    }
}

// Delete opportunity from Supabase
async function deleteOpportunityFromSupabase(oppId) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const { error } = await supabaseClient
            .from('sales_opportunities')
            .delete()
            .eq('id', oppId)
            .eq('user_id', userId);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting opportunity from Supabase:', err);
        return false;
    }
}

// Add opportunity activity to Supabase
async function addOpportunityActivityToSupabase(oppId, activity) {
    if (!supabaseClient) return false;
    
    try {
        const activityData = {
            opportunity_id: oppId,
            activity_type: activity.type,
            description: activity.message,
            created_at: activity.timestamp
        };
        
        const { error } = await supabaseClient
            .from('sales_opportunity_activities')
            .insert([activityData]);
        
        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error adding opportunity activity to Supabase:', err);
        return false;
    }
}

// Module Progress Tracking
const moduleProgress = {
    brain: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    soul: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    business: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    competitive: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    value: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    offer: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    journey: { status: 'not_started', progress: 0, startedAt: null, completedAt: null },
    brand: { status: 'not_started', progress: 0, startedAt: null, completedAt: null }
};

// Get module status badge
function getModuleStatusBadge(moduleId) {
    const module = moduleProgress[moduleId];
    if (!module) return 'New';
    
    if (module.status === 'completed') {
        return 'Complete';
    } else if (module.status === 'in_progress') {
        return `${module.progress}%`;
    } else {
        // All modules unlocked - no sequential locking
        return 'New';
    }
}

// Get status class for styling
function getModuleStatusClass(moduleId) {
    const module = moduleProgress[moduleId];
    if (!module) return 'status-locked';
    
    if (module.status === 'completed') {
        return 'status-complete';
    } else if (module.status === 'in_progress') {
        return 'status-progress';
    } else {
        // All modules unlocked - show as available
        return 'status-locked';
    }
}

// Update module progress
function updateModuleProgress(moduleId, progress) {
    if (!moduleProgress[moduleId]) return;
    
    moduleProgress[moduleId].progress = progress;
    
    if (progress === 0) {
        moduleProgress[moduleId].status = 'not_started';
    } else if (progress >= 100) {
        moduleProgress[moduleId].status = 'completed';
        moduleProgress[moduleId].completedAt = new Date().toISOString();
    } else {
        moduleProgress[moduleId].status = 'in_progress';
        if (!moduleProgress[moduleId].startedAt) {
            moduleProgress[moduleId].startedAt = new Date().toISOString();
        }
    }
    
    localStorage.setItem('lccs_module_progress', JSON.stringify(moduleProgress));
    updateModuleBadges();
}

// Update all module badges in the UI
function updateModuleBadges() {
    const modules = ['brain', 'soul', 'business', 'competitive', 'value', 'offer', 'journey', 'brand'];
    
    modules.forEach(moduleId => {
        const dot = document.getElementById(`${moduleId}-dot`);
        if (dot) {
            const module = moduleProgress[moduleId];
            dot.className = 'progress-dot';
            if (module.status === 'completed') {
                dot.classList.add('complete');
            } else if (module.status === 'in_progress') {
                dot.classList.add('in-progress');
            } else {
                dot.classList.add('not-started');
            }
        }
    });
}

// Load progress from localStorage
function loadModuleProgress() {
    const saved = localStorage.getItem('lccs_module_progress');
    if (saved) {
        const savedProgress = JSON.parse(saved);
        Object.keys(savedProgress).forEach(key => {
            if (moduleProgress[key]) {
                moduleProgress[key] = savedProgress[key];
            }
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check Authentication
function checkAuth() {
    // Always start by showing login page (security first)
    showLoginPage();
    
    // Then check if we have valid auth
    if (!authToken) {
        return;
    }

    // Demo mode: restore user from storage
    const storedEmail = localStorage.getItem('lccs_demo_current_email');
    if (storedEmail) {
        const user = demoUsers.find(u => u.email === storedEmail);
        if (user) {
            currentUser = user;
            showApp();
            loadDashboard();
        }
    } else {
        // Invalid auth state - clear it
        localStorage.removeItem('lccs_token');
        localStorage.removeItem('lccs_demo_current_email');
        authToken = null;
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
        if (dropdown && userMenu && !userMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    console.log('Login attempt');
    
    const btn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('login-error');
    
    btn.classList.add('loading');
    errorDiv.classList.remove('show');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Demo mode login - accept any credentials and create user if not exists
    let user = demoUsers.find(u => u.email === email);
    
    if (!user) {
        // Auto-create user for demo mode
        user = {
            id: 'user_' + Date.now(),
            firstName: email.split('@')[0],
            lastName: 'User',
            email: email,
            businessName: 'My Business',
            password: password,
            createdAt: new Date().toISOString()
        };
        demoUsers.push(user);
        localStorage.setItem('lccs_demo_users', JSON.stringify(demoUsers));
    }
    
    // Accept any password in demo mode
    authToken = 'demo_token_' + Date.now();
    localStorage.setItem('lccs_token', authToken);
    localStorage.setItem('lccs_demo_current_email', user.email);
    currentUser = user;
    
    console.log('Login successful, calling showApp...');
    try {
        showApp();
        console.log('showApp completed');
        loadDashboard();
        console.log('loadDashboard completed');
    } catch (err) {
        console.error('Error during login:', err);
        alert('Login error: ' + err.message);
    }
    
    btn.classList.remove('loading');
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();
    console.log('Signup attempt');
    
    const btn = document.getElementById('signup-btn');
    const errorDiv = document.getElementById('signup-error');
    
    btn.classList.add('loading');
    errorDiv.classList.remove('show');

    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const businessName = document.getElementById('signup-business').value;
    const password = document.getElementById('signup-password').value;

    // Check if user exists
    if (demoUsers.find(u => u.email === email)) {
        errorDiv.textContent = 'Email already registered';
        errorDiv.classList.add('show');
        btn.classList.remove('loading');
        return;
    }

    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        firstName,
        lastName,
        email,
        businessName,
        password,
        createdAt: new Date().toISOString()
    };
    
    demoUsers.push(newUser);
    localStorage.setItem('lccs_demo_users', JSON.stringify(demoUsers));
    
    // Auto login
    authToken = 'demo_token_' + Date.now();
    localStorage.setItem('lccs_token', authToken);
    localStorage.setItem('lccs_demo_current_email', newUser.email);
    currentUser = newUser;
    showApp();
    loadDashboard();
    btn.classList.remove('loading');
}

// Quick demo login
function quickDemoLogin() {
    console.log('Quick demo login');
    
    let user = demoUsers.find(u => u.email === 'demo@lifecharter.com');
    
    if (!user) {
        user = {
            id: 'user_demo',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@lifecharter.com',
            businessName: 'LifeCharter Demo',
            password: 'demo',
            createdAt: new Date().toISOString()
        };
        demoUsers.push(user);
        localStorage.setItem('lccs_demo_users', JSON.stringify(demoUsers));
    }
    
    authToken = 'demo_token_' + Date.now();
    localStorage.setItem('lccs_token', authToken);
    localStorage.setItem('lccs_demo_current_email', user.email);
    currentUser = user;
    showApp();
    loadDashboard();
}

// Logout
function logout() {
    localStorage.removeItem('lccs_token');
    localStorage.removeItem('lccs_demo_current_email');
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
    
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.firstName || currentUser.email.split('@')[0];
        document.getElementById('user-avatar').textContent = (currentUser.firstName?.[0] || currentUser.email[0]).toUpperCase();
    }
}

// Toggle User Dropdown
function toggleUserDropdown() {
    document.getElementById('user-dropdown').classList.toggle('show');
}

// Accordion Toggle Function
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(id + '-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

// Load Dashboard Data
async function loadDashboard() {
    // Initialize notifications
    initNotifications();
    
    // DEMO MODE: Skip API calls, use local data
    if (DEMO_MODE) {
        console.log('Demo mode: Loading dashboard from localStorage');
        loadModuleProgress();
        updateModuleBadges();
        return;
    }
    
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
    // Legacy function - redirects to Command Center
    showCommandCenter();
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
    // Remove active from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.accordion-header').forEach(header => header.classList.remove('active'));
    
    // Activate the appropriate nav link
    const navMap = {
        'command-center': 'nav-command-center',
        'roadmap': 'nav-roadmap',
        'brain': 'nav-brain',
        'soul': 'nav-soul',
        'value-proposition': 'nav-vp',
        'sales-command': 'nav-sales',
        'operations-command': 'nav-ops',
        'marketing-command': 'nav-marketing',
        'finance-command': 'nav-finance',
        'content-command': 'nav-content',
        'ai-tools': 'nav-ai-tools',
        'library': 'nav-library',
        'profile': 'nav-profile',
        'settings': 'nav-settings'
    };
    
    const navId = navMap[page];
    if (navId) {
        const navElement = document.getElementById(navId);
        if (navElement) {
            navElement.classList.add('active');
            
            // If this is inside an accordion, expand it
            const parentAccordion = navElement.closest('.accordion-content');
            if (parentAccordion) {
                parentAccordion.classList.add('open');
                const accordionId = parentAccordion.id.replace('content-', '');
                const header = document.getElementById('accordion-' + accordionId);
                const icon = document.getElementById('icon-' + accordionId);
                if (header) header.classList.add('active');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// ============================================
// NEW NAVIGATION FUNCTIONS (Phase 1 UX Redesign)
// ============================================

function showCommandCenter() {
    setActiveNav('command-center');
    loadDashboard();
}

function showMyRoadmap() {
    setActiveNav('roadmap');
    // For now, show a placeholder - this will be implemented in Phase 2
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">🗺️ My Roadmap</h1>
            <p class="welcome-subtitle">Your personalized journey through the Command Suite.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">🚧</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                The My Roadmap feature is being built to show your personalized path through all modules based on your assessment results.
            </p>
        </div>
    `;
}

function toggleAccordion(accordionId) {
    const content = document.getElementById('content-' + accordionId);
    const header = document.getElementById('accordion-' + accordionId);
    const icon = document.getElementById('icon-' + accordionId);
    
    if (content && header) {
        const isOpen = content.classList.contains('open');
        
        if (isOpen) {
            content.classList.remove('open');
            header.classList.remove('active');
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            content.classList.add('open');
            header.classList.add('active');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

// Notification System
let notifications = JSON.parse(localStorage.getItem('lccs_notifications') || '[]');
let unreadCount = notifications.filter(n => !n.read).length;

function toggleNotifications() {
    const panel = document.getElementById('notifications-panel');
    const supportPanel = document.getElementById('support-panel');
    
    // Close support panel if open
    if (supportPanel) supportPanel.style.display = 'none';
    
    if (panel) {
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            renderNotifications();
        }
    }
}

function renderNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;
    
    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read).slice(0, 5);
    
    let html = `
        <div style="padding: 20px; border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin: 0;">Notifications</h3>
                ${unreadNotifications.length > 0 ? `<button onclick="markAllNotificationsRead()" style="background: none; border: none; color: var(--sacred-teal); font-size: 12px; cursor: pointer;">Mark all read</button>` : ''}
            </div>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    if (unreadNotifications.length === 0 && readNotifications.length === 0) {
        html += `
            <div style="padding: 40px; text-align: center; color: rgba(246, 241, 232, 0.5);">
                <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
                <p>No notifications yet</p>
            </div>
        `;
    } else {
        // Unread notifications
        unreadNotifications.forEach(n => {
            html += `
                <div onclick="handleNotificationClick('${n.id}')" style="padding: 16px 20px; border-bottom: 1px solid rgba(212, 175, 99, 0.1); cursor: pointer; background: rgba(46, 124, 131, 0.1); transition: background 0.2s;">
                    <div style="display: flex; gap: 12px;">
                        <span style="font-size: 20px;">${n.icon || '📢'}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; color: var(--ivory-light); font-weight: 500;">${n.title}</div>
                            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">${n.message}</div>
                            <div style="font-size: 11px; color: rgba(246, 241, 232, 0.4); margin-top: 8px;">${formatTimeAgo(n.timestamp)}</div>
                        </div>
                        <div style="width: 8px; height: 8px; background: var(--sacred-teal); border-radius: 50%; margin-top: 4px;"></div>
                    </div>
                </div>
            `;
        });
        
        // Read notifications
        readNotifications.forEach(n => {
            html += `
                <div onclick="handleNotificationClick('${n.id}')" style="padding: 16px 20px; border-bottom: 1px solid rgba(212, 175, 99, 0.1); cursor: pointer; opacity: 0.7; transition: background 0.2s;">
                    <div style="display: flex; gap: 12px;">
                        <span style="font-size: 20px;">${n.icon || '📢'}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; color: var(--ivory-light);">${n.title}</div>
                            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6); margin-top: 4px;">${n.message}</div>
                            <div style="font-size: 11px; color: rgba(246, 241, 232, 0.4); margin-top: 8px;">${formatTimeAgo(n.timestamp)}</div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    panel.innerHTML = html;
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
}

function markAllNotificationsRead() {
    notifications.forEach(n => n.read = true);
    localStorage.setItem('lccs_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
    renderNotifications();
}

function handleNotificationClick(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem('lccs_notifications', JSON.stringify(notifications));
        updateNotificationBadge();
        
        // Handle navigation based on notification type
        if (notification.action === 'module') {
            const moduleMap = {
                'brain': showBrainOverview,
                'soul': showSoulOverview,
                'value-proposition': showValueProposition,
                'sales-command': showSalesCommand
            };
            if (moduleMap[notification.moduleId]) {
                moduleMap[notification.moduleId]();
            }
        }
        
        toggleNotifications(); // Close panel
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function addNotification(title, message, options = {}) {
    const notification = {
        id: Date.now().toString(),
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        icon: options.icon || '📢',
        action: options.action || null,
        moduleId: options.moduleId || null
    };
    
    notifications.unshift(notification);
    // Keep only last 50 notifications
    notifications = notifications.slice(0, 50);
    localStorage.setItem('lccs_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

// Support Panel
function toggleSupportPanel() {
    const panel = document.getElementById('support-panel');
    const notificationsPanel = document.getElementById('notifications-panel');
    
    // Close notifications panel if open
    if (notificationsPanel) notificationsPanel.style.display = 'none';
    
    if (panel) {
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            renderSupportPanel();
        }
    }
}

function renderSupportPanel() {
    const panel = document.getElementById('support-panel');
    if (!panel) return;
    
    panel.innerHTML = `
        <div style="padding: 20px; border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin: 0;">Help & Support</h3>
        </div>
        <div style="padding: 20px;">
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: rgba(246, 241, 232, 0.5); margin-bottom: 12px;">Quick Help</h4>
                <button onclick="showGettingStarted()" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.1); border-radius: 10px; color: var(--ivory-light); cursor: pointer; margin-bottom: 8px; text-align: left;">
                    <span>🚀</span>
                    <span>Getting Started Guide</span>
                </button>
                <button onclick="showFAQ()" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.1); border-radius: 10px; color: var(--ivory-light); cursor: pointer; margin-bottom: 8px; text-align: left;">
                    <span>❓</span>
                    <span>FAQ</span>
                </button>
                <button onclick="showVideoTutorials()" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.1); border-radius: 10px; color: var(--ivory-light); cursor: pointer; text-align: left;">
                    <span>🎥</span>
                    <span>Video Tutorials</span>
                </button>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: rgba(246, 241, 232, 0.5); margin-bottom: 12px;">Contact</h4>
                <button onclick="showContactSupport()" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px; background: rgba(46, 124, 131, 0.1); border: 1px solid rgba(46, 124, 131, 0.3); border-radius: 10px; color: var(--sacred-teal); cursor: pointer; text-align: left;">
                    <span>💬</span>
                    <span>Contact Support</span>
                </button>
            </div>
            
            <div>
                <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: rgba(246, 241, 232, 0.5); margin-bottom: 12px;">Keyboard Shortcuts</h4>
                <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                        <span>Search</span>
                        <code style="background: rgba(246, 241, 232, 0.1); padding: 2px 8px; border-radius: 4px;">⌘ K</code>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                        <span>Command Center</span>
                        <code style="background: rgba(246, 241, 232, 0.1); padding: 2px 8px; border-radius: 4px;">⌘ 1</code>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span>Notifications</span>
                        <code style="background: rgba(246, 241, 232, 0.1); padding: 2px 8px; border-radius: 4px;">⌘ N</code>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Placeholder functions for support panel
function showGettingStarted() {
    alert('Getting Started guide coming soon!');
}

function showFAQ() {
    alert('FAQ coming soon!');
}

function showVideoTutorials() {
    alert('Video tutorials coming soon!');
}

function showContactSupport() {
    alert('Contact support form coming soon!');
}

// Library placeholder
function showLibrary() {
    setActiveNav('library');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📚 Library</h1>
            <p class="welcome-subtitle">Your resource hub for templates, guides, and assets.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                The Library will contain all your templates, worksheets, guides, and downloadable resources in one organized place.
            </p>
        </div>
    `;
}

// Business Command Module Placeholders
function showOperationsCommand() {
    setActiveNav('operations-command');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">⚡ Operations Command</h1>
            <p class="welcome-subtitle">Streamline your business operations and workflows.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">⚡</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                Operations Command will help you build SOPs, automate workflows, and manage your team's tasks efficiently.
            </p>
        </div>
    `;
}

function showMarketingCommand() {
    setActiveNav('marketing-command');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📢 Marketing Command</h1>
            <p class="welcome-subtitle">Plan, execute, and track your marketing campaigns.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">📢</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                Marketing Command will include campaign planning, content calendars, social media management, and analytics tracking.
            </p>
        </div>
    `;
}

function showFinanceCommand() {
    setActiveNav('finance-command');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">💰 Finance Command</h1>
            <p class="welcome-subtitle">Track revenue, expenses, and financial health.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">💰</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                Finance Command will help you track revenue streams, manage expenses, forecast cash flow, and prepare for tax season.
            </p>
        </div>
    `;
}

function showContentCommand() {
    setActiveNav('content-command');
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📝 Content Command</h1>
            <p class="welcome-subtitle">Manage your content creation and distribution.</p>
        </div>
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">📝</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 16px;">Coming Soon</h3>
            <p style="color: rgba(246, 241, 232, 0.7); max-width: 500px; margin: 0 auto;">
                Content Command will include editorial calendars, content pipelines, repurposing workflows, and publishing schedules.
            </p>
        </div>
    `;
}

// Initialize notification badge on load
function initNotifications() {
    updateNotificationBadge();
}

function getDashboardHTML() {
    // Load saved progress
    loadModuleProgress();
    
    // Calculate stats
    const completedModules = Object.values(moduleProgress).filter(m => m.status === 'completed').length;
    const inProgressModules = Object.values(moduleProgress).filter(m => m.status === 'in_progress').length;
    const totalModules = Object.keys(moduleProgress).length;
    
    return `
        <div class="welcome-section">
            <h1 class="welcome-title">Build Your Command Suite</h1>
            <p class="welcome-subtitle">Create the systems, workflows, and assets that will run your business while you transform lives.</p>
        </div>

        <div class="progress-overview">
            <div class="progress-card">
                <div class="progress-number" id="stat-modules">${completedModules}/${totalModules}</div>
                <div class="progress-label">Modules Complete</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-active">${inProgressModules}</div>
                <div class="progress-label">In Progress</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-progress">${Math.round((completedModules / totalModules) * 100)}%</div>
                <div class="progress-label">Overall Progress</div>
            </div>
            <div class="progress-card">
                <div class="progress-number" id="stat-agents">${userAgents?.length || 0}</div>
                <div class="progress-label">AI Agents</div>
            </div>
        </div>

        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 16px;">📊 Foundation Modules Overview</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">🧠</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Brain.md</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">55 Qs • 60 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">✨</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Soul.md</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">27 Qs • 35 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">📊</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Business Audit</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">80 Qs • 75 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">🏆</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Competitive</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">35 Qs • 50 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">💎</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Value Prop</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">30 Qs • 45 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">🎯</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Offer Arch</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">40 Qs • 60 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">🗺️</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Client Journey</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">30 Qs • 40 min</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.05); border-radius: 10px;">
                    <span style="font-size: 20px;">🎨</span>
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--ivory-light);">Brand Voice</div>
                        <div style="font-size: 11px; color: rgba(246, 241, 232, 0.5);">30 Qs • 45 min</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">📋 Foundation Modules</h2>
        </div>
        
        <div class="workspace-grid">
            <div class="workspace-card" onclick="showBrainAssessment()" style="${getModuleStatusClass('brain') === 'status-progress' ? 'border: 2px solid rgba(212, 175, 99, 0.4);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.2);">🧠</div>
                    <span class="card-status ${getModuleStatusClass('brain')}">${getModuleStatusBadge('brain')}</span>
                </div>
                <h3 class="card-title">Brain.md Assessment</h3>
                <p class="card-description">Define your business identity, model, revenue streams, and strategic foundation.</p>
            </div>
            <div class="workspace-card" onclick="showSoulAssessment()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(205, 190, 214, 0.2);">✨</div>
                    <span class="card-status ${getModuleStatusClass('soul')}">${getModuleStatusBadge('soul')}</span>
                </div>
                <h3 class="card-title">Soul.md Assessment</h3>
                <p class="card-description">Connect with your personal values, life vision, and alignment patterns.</p>
            </div>
            <div class="workspace-card" onclick="showBusinessAssessment()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(212, 175, 99, 0.2);">📊</div>
                    <span class="card-status ${getModuleStatusClass('business')}">${getModuleStatusBadge('business')}</span>
                </div>
                <h3 class="card-title">Business Command Audit</h3>
                <p class="card-description">Comprehensive 8-dimension business assessment with AI-powered analysis and action plan.</p>
            </div>
            <div class="workspace-card" onclick="showCompetitivePositioning()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.3);">🏆</div>
                    <span class="card-status ${getModuleStatusClass('competitive')}">${getModuleStatusBadge('competitive')}</span>
                </div>
                <h3 class="card-title">Competitive Positioning Strategy</h3>
                <p class="card-description">Analyze your market, differentiate from competitors, and claim your unique position.</p>
            </div>
            <div class="workspace-card" onclick="showValueProposition()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.3);">💎</div>
                    <span class="card-status ${getModuleStatusClass('value')}">${getModuleStatusBadge('value')}</span>
                </div>
                <h3 class="card-title">Value Proposition Refinement</h3>
                <p class="card-description">Clarify your unique value, differentiate from competitors, and craft compelling messaging that resonates.</p>
            </div>
            <div class="workspace-card" onclick="showOfferArchitecture()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(94, 59, 108, 0.3);">🎯</div>
                    <span class="card-status ${getModuleStatusClass('offer')}">${getModuleStatusBadge('offer')}</span>
                </div>
                <h3 class="card-title">Offer Architecture & Positioning</h3>
                <p class="card-description">Design, price, and position your offers for maximum impact and profitability.</p>
            </div>
            <div class="workspace-card" onclick="showClientJourney()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(212, 175, 99, 0.2);">🗺️</div>
                    <span class="card-status ${getModuleStatusClass('journey')}">${getModuleStatusBadge('journey')}</span>
                </div>
                <h3 class="card-title">Client Journey Map</h3>
                <p class="card-description">Map your client's complete experience from first discovery to loyal advocacy. 30 questions across 6 journey stages.</p>
            </div>
            <div class="workspace-card" onclick="showBrandVoice()">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(205, 190, 214, 0.4);">🎨</div>
                    <span class="card-status ${getModuleStatusClass('brand')}">${getModuleStatusBadge('brand')}</span>
                </div>
                <h3 class="card-title">Brand Voice & Messaging</h3>
                <p class="card-description">Define your unique brand voice and create consistent messaging across all channels.</p>
            </div>
        </div>
    `;
}

// Brain Assessment
// Brain.md Assessment State with iframe integration
let brainAssessmentState = {
    progress: null, // { status: 'not_started'|'in_progress'|'completed', progress: 0-100, startedAt, completedAt, lastSaved }
    assessments: [], // Array of completed assessments
    currentView: 'overview' // 'overview', 'iframe', 'results'
};

async function showBrainAssessment() {
    setActiveNav('assessments');
    
    // Load saved progress from Supabase
    await loadBrainAssessmentState();
    
    // Determine which view to show
    if (brainAssessmentState.currentView === 'iframe') {
        renderBrainIframe();
    } else if (brainAssessmentState.currentView === 'results') {
        renderBrainResults();
    } else {
        renderBrainOverview();
    }
}

async function loadBrainAssessmentState() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        // Load progress from Supabase
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('brain_assessments')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                brainAssessmentState.assessments = data;
                const latest = data[0];
                brainAssessmentState.progress = {
                    status: latest.status,
                    progress: latest.progress_percentage || 0,
                    startedAt: latest.started_at,
                    completedAt: latest.completed_at,
                    lastSaved: latest.last_saved
                };
            }
        }
    } catch (err) {
        console.error('Error loading brain assessment state:', err);
    }
}

function renderBrainOverview() {
    const hasProgress = brainAssessmentState.progress !== null;
    const isCompleted = hasProgress && brainAssessmentState.progress.status === 'completed';
    const isInProgress = hasProgress && brainAssessmentState.progress.status === 'in_progress';
    const progressPercent = hasProgress ? brainAssessmentState.progress.progress : 0;
    const completedCount = brainAssessmentState.assessments.filter(a => a.status === 'completed').length;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🧠 Brain.md Assessment</h1>
            <p class="welcome-subtitle">Define your business identity, model, revenue streams, and strategic foundation.</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Status Card -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: ${isCompleted ? 'rgba(76, 175, 80, 0.3)' : isInProgress ? 'rgba(212, 175, 99, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                        ${isCompleted ? '✅' : isInProgress ? '📝' : '🧠'}
                    </div>
                    <div>
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 4px;">
                            ${isCompleted ? 'Assessment Complete!' : isInProgress ? 'Assessment in Progress' : 'Start Your Assessment'}
                        </h3>
                        <p style="color: rgba(246, 241, 232, 0.7);">
                            ${isCompleted ? `You've completed ${completedCount} assessment${completedCount !== 1 ? 's' : ''}.` : isInProgress ? `You're ${progressPercent}% through the assessment.` : '55 questions • Approximately 60 minutes'}
                        </p>
                    </div>
                </div>
                
                ${isInProgress ? `
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: rgba(246, 241, 232, 0.7);">Progress</span>
                        <span style="color: var(--warm-gold); font-weight: 600;">${progressPercent}%</span>
                    </div>
                    <div style="background: rgba(31, 49, 91, 0.5); border-radius: 10px; height: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${isInProgress ? `
                        <button class="btn btn-primary" onclick="startBrainAssessment('resume')" style="flex: 1; min-width: 200px;">
                            ▶️ Resume Where You Left Off
                        </button>
                    ` : ''}
                    <button class="btn btn-${isInProgress ? 'secondary' : 'primary'}" onclick="startBrainAssessment('new')" style="flex: 1; min-width: 200px;">
                        ${isCompleted ? '🔄 Start New Assessment' : isInProgress ? '🔄 Start Over' : '🚀 Start Assessment'}
                    </button>
                    ${isCompleted ? `
                        <button class="btn btn-secondary" onclick="viewBrainResults()" style="flex: 1; min-width: 200px;">
                            📊 View Results
                        </button>
                    ` : ''}
                </div>
            </div>
            
            ${isCompleted ? renderBrainPreviousAssessments() : ''}
            
            <!-- Info Card -->
            <div style="background: rgba(46, 124, 131, 0.1); border: 1px solid rgba(46, 124, 99, 0.2); border-radius: 16px; padding: 24px;">
                <h4 style="color: var(--sacred-teal); margin-bottom: 12px; font-size: 16px;">💡 What to Expect</h4>
                <ul style="color: rgba(246, 241, 232, 0.7); font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>55 questions across 6 key business dimensions</li>
                    <li>Your progress saves automatically as you go</li>
                    <li>You can pause and resume anytime</li>
                    <li>Complete multiple assessments to track your evolution</li>
                    <li>Results help personalize your AI agents and recommendations</li>
                </ul>
            </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function renderBrainPreviousAssessments() {
    const completedAssessments = brainAssessmentState.assessments.filter(a => a.status === 'completed');
    if (completedAssessments.length === 0) return '';
    
    return `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--warm-gold); margin-bottom: 20px;">📋 Previous Assessments</h3>
            <div style="display: grid; gap: 12px;">
                ${completedAssessments.slice(0, 5).map((assessment, index) => `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(31, 49, 91, 0.5); border-radius: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(76, 175, 80, 0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">✅</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500; color: var(--ivory-light);">Assessment #${completedAssessments.length - index}</div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">Completed ${new Date(assessment.completed_at).toLocaleDateString()}</div>
                        </div>
                        <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 12px;" onclick="viewBrainAssessmentResult('${assessment.id}')">View</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function startBrainAssessment(mode) {
    brainAssessmentState.currentView = 'iframe';
    if (mode === 'new') {
        // Reset progress for new assessment
        brainAssessmentState.progress = null;
    }
    renderBrainIframe();
}

function renderBrainIframe() {
    const userId = getCurrentUserId();
    const email = currentUser?.email || '';
    const resumeParam = brainAssessmentState.progress?.status === 'in_progress' ? '&resume=true' : '';
    const iframeUrl = `https://brain-md-questionnaire.vercel.app/?userId=${userId}&email=${encodeURIComponent(email)}${resumeParam}`;
    
    // Setup message listener for iframe communication
    setupBrainMessageListener();
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🧠 Brain.md Assessment</h1>
            <p class="welcome-subtitle">Your progress saves automatically. You can return anytime.</p>
        </div>
        
        <div style="max-width: 1000px; margin: 0 auto;">
            <!-- Iframe Container -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 20px;">
                <iframe 
                    id="brain-assessment-iframe"
                    src="${iframeUrl}" 
                    style="width: 100%; height: 800px; border: none; border-radius: 12px; background: var(--ivory-light);"
                    allow="fullscreen"
                ></iframe>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: center;">
                <button class="btn btn-secondary" onclick="exitBrainAssessment()">← Exit Assessment</button>
                <button class="btn btn-primary" onclick="saveBrainProgress()">💾 Save & Continue Later</button>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function setupBrainMessageListener() {
    // Remove any existing listener to avoid duplicates
    window.removeEventListener('message', handleBrainMessage);
    window.addEventListener('message', handleBrainMessage);
}

async function handleBrainMessage(event) {
    // Verify origin
    if (event.origin !== 'https://brain-md-questionnaire.vercel.app') return;
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'brainmd:save':
            await saveBrainProgressToSupabase(data);
            break;
        case 'brainmd:complete':
            await completeBrainAssessment(data);
            break;
        case 'brainmd:progress':
            updateBrainProgressUI(data);
            break;
    }
}

async function saveBrainProgressToSupabase(data) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return;
    
    try {
        const progressData = {
            user_id: userId,
            status: 'in_progress',
            progress_percentage: data.progress,
            answers: data.answers,
            last_saved: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Check for existing in-progress assessment
        const { data: existing } = await supabaseClient
            .from('brain_assessments')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();
        
        if (existing) {
            await supabaseClient
                .from('brain_assessments')
                .update(progressData)
                .eq('id', existing.id);
        } else {
            progressData.created_at = new Date().toISOString();
            progressData.started_at = new Date().toISOString();
            await supabaseClient
                .from('brain_assessments')
                .insert([progressData]);
        }
        
        // Update local state
        brainAssessmentState.progress = {
            status: 'in_progress',
            progress: data.progress,
            lastSaved: progressData.last_saved
        };
        
        // Update module progress
        updateModuleProgress('brain', data.progress);
        
    } catch (err) {
        console.error('Error saving brain progress:', err);
    }
}

async function completeBrainAssessment(data) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return;
    
    try {
        const completionData = {
            user_id: userId,
            status: 'completed',
            progress_percentage: 100,
            answers: data.answers,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Check for existing in-progress assessment to update
        const { data: existing } = await supabaseClient
            .from('brain_assessments')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();
        
        if (existing) {
            await supabaseClient
                .from('brain_assessments')
                .update(completionData)
                .eq('id', existing.id);
        } else {
            completionData.created_at = new Date().toISOString();
            completionData.started_at = new Date().toISOString();
            await supabaseClient
                .from('brain_assessments')
                .insert([completionData]);
        }
        
        // Update local state
        brainAssessmentState.progress = {
            status: 'completed',
            progress: 100,
            completedAt: completionData.completed_at
        };
        
        // Update module progress
        updateModuleProgress('brain', 100);
        
        // Show completion message and redirect to results
        alert('🎉 Congratulations! You\'ve completed the Brain.md Assessment!');
        brainAssessmentState.currentView = 'results';
        await loadBrainAssessmentState();
        renderBrainResults();
        
    } catch (err) {
        console.error('Error completing brain assessment:', err);
    }
}

function updateBrainProgressUI(data) {
    // Update any UI elements showing progress
    brainAssessmentState.progress = {
        ...brainAssessmentState.progress,
        progress: data.progress
    };
}

function saveBrainProgress() {
    // Send message to iframe to trigger save
    const iframe = document.getElementById('brain-assessment-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'parent:requestSave' }, 'https://brain-md-questionnaire.vercel.app');
    }
    alert('💾 Progress saved! You can return anytime to continue.');
}

function exitBrainAssessment() {
    if (confirm('Are you sure you want to exit? Your progress has been saved.')) {
        brainAssessmentState.currentView = 'overview';
        window.removeEventListener('message', handleBrainMessage);
        showBrainAssessment();
    }
}

function viewBrainResults() {
    brainAssessmentState.currentView = 'results';
    renderBrainResults();
}

function renderBrainResults() {
    const latestAssessment = brainAssessmentState.assessments[0];
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🧠 Brain.md Assessment Results</h1>
            <p class="welcome-subtitle">Your business identity and strategic foundation.</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; color: var(--warm-gold); margin-bottom: 12px;">Assessment Complete!</h3>
                <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 24px;">
                    Completed on ${latestAssessment ? new Date(latestAssessment.completed_at).toLocaleDateString() : 'N/A'}
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="startBrainAssessment('new')">🔄 Take Again</button>
                    <button class="btn btn-secondary" onclick="brainAssessmentState.currentView = 'overview'; showBrainAssessment()">← Back to Overview</button>
                </div>
            </div>
            
            <!-- Results Summary -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 20px;">📊 Your Business Profile</h3>
                <p style="color: rgba(246, 241, 232, 0.7); line-height: 1.8;">
                    Your Brain.md assessment has been saved. Your AI agents and recommendations will now be personalized based on your responses.
                </p>
                <div style="margin-top: 20px; padding: 20px; background: rgba(46, 124, 131, 0.1); border-radius: 12px;">
                    <p style="color: var(--sacred-teal); margin: 0;">
                        💡 <strong>Next Step:</strong> Complete the Soul.md Assessment to further personalize your experience.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function viewBrainAssessmentResult(assessmentId) {
    const assessment = brainAssessmentState.assessments.find(a => a.id === assessmentId);
    if (!assessment) return;
    
    // Show specific assessment results
    alert(`Viewing assessment from ${new Date(assessment.completed_at).toLocaleDateString()}`);
}

// Legacy inline assessment functions - kept for reference but no longer used
function renderBrainAssessment() {
    // Redirect to new iframe-based assessment
    renderBrainOverview();
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

// Soul.md Assessment State with iframe integration
let soulAssessmentState = {
    progress: null, // { status: 'not_started'|'in_progress'|'completed', progress: 0-100, startedAt, completedAt, lastSaved }
    assessments: [], // Array of completed assessments
    currentView: 'overview' // 'overview', 'iframe', 'results'
};

async function showSoulAssessment() {
    setActiveNav('assessments');
    
    // Load saved progress from Supabase
    await loadSoulAssessmentState();
    
    // Determine which view to show
    if (soulAssessmentState.currentView === 'iframe') {
        renderSoulIframe();
    } else if (soulAssessmentState.currentView === 'results') {
        renderSoulResults();
    } else {
        renderSoulOverview();
    }
}

async function loadSoulAssessmentState() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        // Load progress from Supabase
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('soul_assessments')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                soulAssessmentState.assessments = data;
                const latest = data[0];
                soulAssessmentState.progress = {
                    status: latest.status,
                    progress: latest.progress_percentage || 0,
                    startedAt: latest.started_at,
                    completedAt: latest.completed_at,
                    lastSaved: latest.last_saved
                };
            }
        }
    } catch (err) {
        console.error('Error loading soul assessment state:', err);
    }
}

function renderSoulOverview() {
    const hasProgress = soulAssessmentState.progress !== null;
    const isCompleted = hasProgress && soulAssessmentState.progress.status === 'completed';
    const isInProgress = hasProgress && soulAssessmentState.progress.status === 'in_progress';
    const progressPercent = hasProgress ? soulAssessmentState.progress.progress : 0;
    const completedCount = soulAssessmentState.assessments.filter(a => a.status === 'completed').length;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">✨ Soul.md Assessment</h1>
            <p class="welcome-subtitle">Connect with your personal values, life vision, and alignment patterns.</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Status Card -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: ${isCompleted ? 'rgba(76, 175, 80, 0.3)' : isInProgress ? 'rgba(205, 190, 214, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                        ${isCompleted ? '✅' : isInProgress ? '📝' : '✨'}
                    </div>
                    <div>
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 4px;">
                            ${isCompleted ? 'Assessment Complete!' : isInProgress ? 'Assessment in Progress' : 'Start Your Assessment'}
                        </h3>
                        <p style="color: rgba(246, 241, 232, 0.7);">
                            ${isCompleted ? `You've completed ${completedCount} assessment${completedCount !== 1 ? 's' : ''}.` : isInProgress ? `You're ${progressPercent}% through the assessment.` : '27 questions • Approximately 35 minutes'}
                        </p>
                    </div>
                </div>
                
                ${isInProgress ? `
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: rgba(246, 241, 232, 0.7);">Progress</span>
                        <span style="color: var(--warm-gold); font-weight: 600;">${progressPercent}%</span>
                    </div>
                    <div style="background: rgba(31, 49, 91, 0.5); border-radius: 10px; height: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, var(--royal-plum), var(--soft-lavender)); height: 100%; width: ${progressPercent}%; border-radius: 10px; transition: width 0.3s;"></div>
                    </div>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${isInProgress ? `
                        <button class="btn btn-primary" onclick="startSoulAssessment('resume')" style="flex: 1; min-width: 200px;">
                            ▶️ Resume Where You Left Off
                        </button>
                    ` : ''}
                    <button class="btn btn-${isInProgress ? 'secondary' : 'primary'}" onclick="startSoulAssessment('new')" style="flex: 1; min-width: 200px;">
                        ${isCompleted ? '🔄 Start New Assessment' : isInProgress ? '🔄 Start Over' : '🚀 Start Assessment'}
                    </button>
                    ${isCompleted ? `
                        <button class="btn btn-secondary" onclick="viewSoulResults()" style="flex: 1; min-width: 200px;">
                            📊 View Results
                        </button>
                    ` : ''}
                </div>
            </div>
            
            ${isCompleted ? renderSoulPreviousAssessments() : ''}
            
            <!-- Info Card -->
            <div style="background: rgba(94, 59, 108, 0.1); border: 1px solid rgba(94, 59, 108, 0.2); border-radius: 16px; padding: 24px;">
                <h4 style="color: var(--soft-lavender); margin-bottom: 12px; font-size: 16px;">💡 What to Expect</h4>
                <ul style="color: rgba(246, 241, 232, 0.7); font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>27 questions exploring your values, vision, and alignment</li>
                    <li>Your progress saves automatically as you go</li>
                    <li>You can pause and resume anytime</li>
                    <li>Complete multiple assessments to track your evolution</li>
                    <li>Results help personalize your LifeCharter experience</li>
                </ul>
            </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function renderSoulPreviousAssessments() {
    const completedAssessments = soulAssessmentState.assessments.filter(a => a.status === 'completed');
    if (completedAssessments.length === 0) return '';
    
    return `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--warm-gold); margin-bottom: 20px;">📋 Previous Assessments</h3>
            <div style="display: grid; gap: 12px;">
                ${completedAssessments.slice(0, 5).map((assessment, index) => `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(31, 49, 91, 0.5); border-radius: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(76, 175, 80, 0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">✅</div>
                        <div style="flex: 1;">
                            <div style="font-weight: 500; color: var(--ivory-light);">Assessment #${completedAssessments.length - index}</div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">Completed ${new Date(assessment.completed_at).toLocaleDateString()}</div>
                        </div>
                        <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 12px;" onclick="viewSoulAssessmentResult('${assessment.id}')">View</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function startSoulAssessment(mode) {
    soulAssessmentState.currentView = 'iframe';
    if (mode === 'new') {
        // Reset progress for new assessment
        soulAssessmentState.progress = null;
    }
    renderSoulIframe();
}

function renderSoulIframe() {
    const userId = getCurrentUserId();
    const email = currentUser?.email || '';
    const resumeParam = soulAssessmentState.progress?.status === 'in_progress' ? '&resume=true' : '';
    const iframeUrl = `https://soul-md-questionnaire.vercel.app/?userId=${userId}&email=${encodeURIComponent(email)}${resumeParam}`;
    
    // Setup message listener for iframe communication
    setupSoulMessageListener();
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">✨ Soul.md Assessment</h1>
            <p class="welcome-subtitle">Your progress saves automatically. You can return anytime.</p>
        </div>
        
        <div style="max-width: 1000px; margin: 0 auto;">
            <!-- Iframe Container -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 20px;">
                <iframe 
                    id="soul-assessment-iframe"
                    src="${iframeUrl}" 
                    style="width: 100%; height: 800px; border: none; border-radius: 12px; background: var(--ivory-light);"
                    allow="fullscreen"
                ></iframe>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: center;">
                <button class="btn btn-secondary" onclick="exitSoulAssessment()">← Exit Assessment</button>
                <button class="btn btn-primary" onclick="saveSoulProgress()">💾 Save & Continue Later</button>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function setupSoulMessageListener() {
    // Remove any existing listener to avoid duplicates
    window.removeEventListener('message', handleSoulMessage);
    window.addEventListener('message', handleSoulMessage);
}

async function handleSoulMessage(event) {
    // Verify origin
    if (event.origin !== 'https://soul-md-questionnaire.vercel.app') return;
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'soulmd:save':
            await saveSoulProgressToSupabase(data);
            break;
        case 'soulmd:complete':
            await completeSoulAssessment(data);
            break;
        case 'soulmd:progress':
            updateSoulProgressUI(data);
            break;
    }
}

async function saveSoulProgressToSupabase(data) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return;
    
    try {
        const progressData = {
            user_id: userId,
            status: 'in_progress',
            progress_percentage: data.progress,
            answers: data.answers,
            last_saved: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Check for existing in-progress assessment
        const { data: existing } = await supabaseClient
            .from('soul_assessments')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();
        
        if (existing) {
            await supabaseClient
                .from('soul_assessments')
                .update(progressData)
                .eq('id', existing.id);
        } else {
            progressData.created_at = new Date().toISOString();
            progressData.started_at = new Date().toISOString();
            await supabaseClient
                .from('soul_assessments')
                .insert([progressData]);
        }
        
        // Update local state
        soulAssessmentState.progress = {
            status: 'in_progress',
            progress: data.progress,
            lastSaved: progressData.last_saved
        };
        
        // Update module progress
        updateModuleProgress('soul', data.progress);
        
    } catch (err) {
        console.error('Error saving soul progress:', err);
    }
}

async function completeSoulAssessment(data) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return;
    
    try {
        const completionData = {
            user_id: userId,
            status: 'completed',
            progress_percentage: 100,
            answers: data.answers,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Check for existing in-progress assessment to update
        const { data: existing } = await supabaseClient
            .from('soul_assessments')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'in_progress')
            .single();
        
        if (existing) {
            await supabaseClient
                .from('soul_assessments')
                .update(completionData)
                .eq('id', existing.id);
        } else {
            completionData.created_at = new Date().toISOString();
            completionData.started_at = new Date().toISOString();
            await supabaseClient
                .from('soul_assessments')
                .insert([completionData]);
        }
        
        // Update local state
        soulAssessmentState.progress = {
            status: 'completed',
            progress: 100,
            completedAt: completionData.completed_at
        };
        
        // Update module progress
        updateModuleProgress('soul', 100);
        
        // Show completion message and redirect to results
        alert('🎉 Congratulations! You\'ve completed the Soul.md Assessment!');
        soulAssessmentState.currentView = 'results';
        await loadSoulAssessmentState();
        renderSoulResults();
        
    } catch (err) {
        console.error('Error completing soul assessment:', err);
    }
}

function updateSoulProgressUI(data) {
    // Update any UI elements showing progress
    soulAssessmentState.progress = {
        ...soulAssessmentState.progress,
        progress: data.progress
    };
}

function saveSoulProgress() {
    // Send message to iframe to trigger save
    const iframe = document.getElementById('soul-assessment-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'parent:requestSave' }, 'https://soul-md-questionnaire.vercel.app');
    }
    alert('💾 Progress saved! You can return anytime to continue.');
}

function exitSoulAssessment() {
    if (confirm('Are you sure you want to exit? Your progress has been saved.')) {
        soulAssessmentState.currentView = 'overview';
        window.removeEventListener('message', handleSoulMessage);
        showSoulAssessment();
    }
}

function viewSoulResults() {
    soulAssessmentState.currentView = 'results';
    renderSoulResults();
}

function renderSoulResults() {
    const latestAssessment = soulAssessmentState.assessments[0];
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">✨ Soul.md Assessment Results</h1>
            <p class="welcome-subtitle">Your personal values, life vision, and alignment patterns.</p>
        </div>
        
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; color: var(--warm-gold); margin-bottom: 12px;">Assessment Complete!</h3>
                <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 24px;">
                    Completed on ${latestAssessment ? new Date(latestAssessment.completed_at).toLocaleDateString() : 'N/A'}
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="startSoulAssessment('new')">🔄 Take Again</button>
                    <button class="btn btn-secondary" onclick="soulAssessmentState.currentView = 'overview'; showSoulAssessment()">← Back to Overview</button>
                </div>
            </div>
            
            <!-- Results Summary -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 20px;">📊 Your Soul Profile</h3>
                <p style="color: rgba(246, 241, 232, 0.7); line-height: 1.8;">
                    Your Soul.md assessment has been saved. Your LifeCharter experience will now be personalized based on your values and vision.
                </p>
                <div style="margin-top: 20px; padding: 20px; background: rgba(94, 59, 108, 0.1); border-radius: 12px;">
                    <p style="color: var(--soft-lavender); margin: 0;">
                        💡 <strong>Next Step:</strong> Explore the Business Command Audit to align your business with your values.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function viewSoulAssessmentResult(assessmentId) {
    const assessment = soulAssessmentState.assessments.find(a => a.id === assessmentId);
    if (!assessment) return;
    
    // Show specific assessment results
    alert(`Viewing assessment from ${new Date(assessment.completed_at).toLocaleDateString()}`);
}

// Legacy inline assessment functions - kept for reference but no longer used
function renderSoulAssessment() {
    // Redirect to new iframe-based assessment
    renderSoulOverview();
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
// AI Agents - Full Implementation
let agents = JSON.parse(localStorage.getItem('lccs_agents') || '[]');
let currentAgent = null;
let wizardData = {};

// Main AI Agents Page
async function showAIAgents() {
    setActiveNav('ai-tools');
    
    // Load agents from storage
    agents = JSON.parse(localStorage.getItem('lccs_agents') || '[]');
    
    const activeAgents = agents.filter(a => a.status === 'active');
    const deployedAgents = agents.filter(a => a.clawDeployed);
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🤖 My AI Agents</h1>
            <p class="welcome-subtitle">Build, deploy, and manage your custom AI agent fleet.</p>
        </div>

        <div class="progress-overview">
            <div class="progress-card">
                <div class="progress-number">${activeAgents.length}</div>
                <div class="progress-label">Active Agents</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${agents.length}</div>
                <div class="progress-label">Total Created</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${deployedAgents.length}</div>
                <div class="progress-label">Deployed</div>
            </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 30px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="showCreateAgentWizard()" style="display: flex; align-items: center; gap: 10px;">
                <span>🤖</span>
                <span>Create New Agent</span>
            </button>
            <button class="btn btn-secondary" onclick="showAgentTemplates()" style="display: flex; align-items: center; gap: 10px;">
                <span>📋</span>
                <span>Browse Templates</span>
            </button>
        </div>

        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">🤖 Your Agent Fleet</h2>
        </div>
    `;

    if (agents.length === 0) {
        html += `
            <div style="text-align: center; padding: 60px 40px; background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px;">
                <div style="font-size: 64px; margin-bottom: 24px;">🤖</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 12px;">No Agents Yet</h3>
                <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 30px; max-width: 500px; margin-left: auto; margin-right: auto;">Create your first AI agent to automate tasks, handle conversations, or support your business operations.</p>
                <button class="btn btn-primary" onclick="showCreateAgentWizard()">Create Your First Agent →</button>
            </div>
        `;
    } else {
        html += `<div class="workspace-grid">`;
        
        agents.forEach(agent => {
            html += `
                <div class="workspace-card" style="position: relative;">
                    <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 8px;">
                        <button onclick="event.stopPropagation(); editAgent('${agent.id}')" style="background: rgba(31, 49, 91, 0.6); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 6px; padding: 6px 10px; color: var(--ivory-light); cursor: pointer; font-size: 12px;">✏️ Edit</button>
                        <button onclick="event.stopPropagation(); deleteAgent('${agent.id}')" style="background: rgba(31, 49, 91, 0.6); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 6px; padding: 6px 10px; color: var(--ivory-light); cursor: pointer; font-size: 12px;">🗑️</button>
                    </div>
                    <div class="card-header" style="padding-right: 80px;">
                        <div class="card-icon" style="background: ${getAgentTypeColor(agent.type)}; font-size: 28px;">${agent.icon || '🤖'}</div>
                        <span class="card-status ${agent.status === 'active' ? 'status-progress' : 'status-locked'}">${agent.status === 'active' ? 'Active' : 'Draft'}</span>
                    </div>
                    <h3 class="card-title">${agent.name}</h3>
                    <p class="card-description">${agent.description || 'No description provided.'}</p>
                    <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
                        <span style="background: rgba(31, 49, 91, 0.5); padding: 4px 10px; border-radius: 20px; font-size: 11px; color: rgba(246, 241, 232, 0.7);">${agent.type || 'General'}</span>
                        <span style="background: rgba(31, 49, 91, 0.5); padding: 4px 10px; border-radius: 20px; font-size: 11px; color: rgba(246, 241, 232, 0.7);">v${agent.version || '1.0'}</span>
                    </div>
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(212, 175, 99, 0.1); display: flex; gap: 10px;">
                        <button class="btn btn-primary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="event.stopPropagation(); ${agent.status === 'active' ? 'pauseAgent' : 'activateAgent'}('${agent.id}')">${agent.status === 'active' ? '⏸️ Pause' : '▶️ Activate'}</button>
                        <button class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="event.stopPropagation(); testAgent('${agent.id}')">🧪 Test</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }

    document.getElementById('main-content').innerHTML = html;
}

function getAgentTypeColor(type) {
    const colors = {
        'support': 'rgba(46, 124, 131, 0.3)',
        'sales': 'rgba(212, 175, 99, 0.3)',
        'content': 'rgba(205, 190, 214, 0.3)',
        'research': 'rgba(94, 59, 108, 0.3)',
        'automation': 'rgba(46, 124, 131, 0.2)',
        'general': 'rgba(31, 49, 91, 0.5)'
    };
    return colors[type] || colors['general'];
}

// Create Agent Wizard
function showCreateAgentWizard() {
    currentAgent = null;
    wizardData = {};
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">Create New Agent</h1>
            <p class="welcome-subtitle">Step-by-step wizard to build your custom AI agent.</p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 8px;">Agent Basics</h3>
                <p style="color: rgba(246, 241, 232, 0.6); margin-bottom: 30px;">Let's start with the fundamentals of your new agent.</p>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Agent Name *</label>
                    <input type="text" id="agent-name" placeholder="e.g., Mariposa Support Bot" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Agent Type</label>
                    <select id="agent-type" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                        <option value="general">General Purpose</option>
                        <option value="support">Customer Support</option>
                        <option value="sales">Sales & Lead Qualification</option>
                        <option value="content">Content Creation</option>
                        <option value="research">Research & Analysis</option>
                        <option value="automation">Task Automation</option>
                    </select>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Description</label>
                    <textarea id="agent-description" rows="3" placeholder="What does this agent do? What problems does it solve?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 500; color: var(--ivory-light);">Choose an Icon</label>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        ${['🤖', '💬', '📝', '🔍', '💡', '🎯', '💼', '🌟', '🦋', '✨'].map(icon => `
                            <button type="button" class="agent-icon-btn" data-icon="${icon}" onclick="selectAgentIcon(this, '${icon}')" style="width: 50px; height: 50px; font-size: 24px; background: rgba(246, 241, 232, 0.05); border: 2px solid rgba(212, 175, 99, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.2s;">${icon}</button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="agent-icon" value="🤖">
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">System Prompt / Instructions *</label>
                    <textarea id="agent-prompt" rows="6" placeholder="Enter detailed instructions for your agent. This defines its behavior, knowledge boundaries, and how it should respond to users." style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Greeting Message</label>
                    <input type="text" id="agent-greeting" placeholder="Hello! How can I help you today?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showAIAgents()">← Cancel</button>
                <button class="btn btn-primary" onclick="createAgentFromWizard()">✨ Create Agent</button>
            </div>
        </div>
    `;
}

function selectAgentIcon(btn, icon) {
    document.querySelectorAll('.agent-icon-btn').forEach(b => {
        b.style.background = 'rgba(246, 241, 232, 0.05)';
        b.style.borderColor = 'rgba(212, 175, 99, 0.2)';
    });
    btn.style.background = 'rgba(212, 175, 99, 0.2)';
    btn.style.borderColor = 'var(--warm-gold)';
    document.getElementById('agent-icon').value = icon;
}

function createAgentFromWizard() {
    const name = document.getElementById('agent-name').value;
    const type = document.getElementById('agent-type').value;
    const description = document.getElementById('agent-description').value;
    const icon = document.getElementById('agent-icon').value;
    const prompt = document.getElementById('agent-prompt').value;
    const greeting = document.getElementById('agent-greeting').value;
    
    if (!name || !prompt) {
        alert('Please fill in all required fields (Name and System Prompt)');
        return;
    }
    
    const newAgent = {
        id: 'agent_' + Date.now(),
        name: name,
        type: type,
        description: description,
        icon: icon,
        prompt: prompt,
        greeting: greeting,
        status: 'draft',
        version: '1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    agents.push(newAgent);
    localStorage.setItem('lccs_agents', JSON.stringify(agents));
    
    alert(`✅ Agent "${newAgent.name}" created successfully!`);
    showAIAgents();
}

// Agent Management Functions
function editAgent(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    currentAgent = agent;
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">✏️ Edit Agent</h1>
            <p class="welcome-subtitle">Update ${agent.name}'s configuration.</p>
        </div>

        <div style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Agent Name</label>
                    <input type="text" id="edit-agent-name" value="${agent.name}" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Description</label>
                    <textarea id="edit-agent-description" rows="2" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${agent.description || ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">System Prompt</label>
                    <textarea id="edit-agent-prompt" rows="6" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${agent.prompt || ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Greeting Message</label>
                    <input type="text" id="edit-agent-greeting" value="${agent.greeting || ''}" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showAIAgents()">← Cancel</button>
                <button class="btn btn-primary" onclick="saveAgentEdits('${agent.id}')">💾 Save Changes</button>
            </div>
        </div>
    `;
}

function saveAgentEdits(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    agent.name = document.getElementById('edit-agent-name').value;
    agent.description = document.getElementById('edit-agent-description').value;
    agent.prompt = document.getElementById('edit-agent-prompt').value;
    agent.greeting = document.getElementById('edit-agent-greeting').value;
    agent.updatedAt = new Date().toISOString();
    
    localStorage.setItem('lccs_agents', JSON.stringify(agents));
    alert('✅ Agent updated successfully!');
    showAIAgents();
}

function deleteAgent(agentId) {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) return;
    
    agents = agents.filter(a => a.id !== agentId);
    localStorage.setItem('lccs_agents', JSON.stringify(agents));
    alert('🗑️ Agent deleted');
    showAIAgents();
}

function activateAgent(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
        agent.status = 'active';
        agent.updatedAt = new Date().toISOString();
        localStorage.setItem('lccs_agents', JSON.stringify(agents));
        showAIAgents();
    }
}

function pauseAgent(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
        agent.status = 'paused';
        agent.updatedAt = new Date().toISOString();
        localStorage.setItem('lccs_agents', JSON.stringify(agents));
        showAIAgents();
    }
}

function testAgent(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">🧪 Test Agent: ${agent.name}</h1>
            <p class="welcome-subtitle">Try out your agent before deploying it.</p>
        </div>

        <div style="max-width: 700px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; height: 500px; display: flex; flex-direction: column;">
                <div style="flex: 1; overflow-y: auto; margin-bottom: 20px; padding: 20px; background: rgba(246, 241, 232, 0.03); border-radius: 12px;" id="test-chat-messages">
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: ${getAgentTypeColor(agent.type)}; display: flex; align-items: center; justify-content: center; font-size: 18px;">${agent.icon}</div>
                        <div style="background: rgba(31, 49, 91, 0.5); padding: 12px 16px; border-radius: 12px; border-top-left-radius: 4px; max-width: 80%;">
                            <div style="color: var(--ivory-light);">${agent.greeting || 'Hello! How can I help you today?'}</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <input type="text" id="test-message-input" placeholder="Type a message to test..." style="flex: 1; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;" onkeypress="if(event.key==='Enter')sendTestMessage('${agentId}')">
                    <button class="btn btn-primary" onclick="sendTestMessage('${agentId}')">Send</button>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-secondary" onclick="showAIAgents()">← Back to Agents</button>
            </div>
        </div>
    `;
}

function sendTestMessage(agentId) {
    const input = document.getElementById('test-message-input');
    const message = input.value.trim();
    if (!message) return;
    
    const chatContainer = document.getElementById('test-chat-messages');
    const agent = agents.find(a => a.id === agentId);
    
    // Add user message
    chatContainer.innerHTML += `
        <div style="display: flex; gap: 12px; margin-bottom: 16px; justify-content: flex-end;">
            <div style="background: rgba(46, 124, 131, 0.3); padding: 12px 16px; border-radius: 12px; border-top-right-radius: 4px; max-width: 80%;">
                <div style="color: var(--ivory-light);">${message}</div>
            </div>
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(212, 175, 99, 0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">👤</div>
        </div>
    `;
    
    input.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Simulate agent response
    setTimeout(() => {
        chatContainer.innerHTML += `
            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${getAgentTypeColor(agent.type)}; display: flex; align-items: center; justify-content: center; font-size: 18px;">${agent.icon}</div>
                <div style="background: rgba(31, 49, 91, 0.5); padding: 12px 16px; border-radius: 12px; border-top-left-radius: 4px; max-width: 80%;">
                    <div style="color: var(--ivory-light);">[This is a test response. In production, this would connect to your AI backend for real responses based on your agent's configuration.]</div>
                </div>
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
}

// Agent Templates
function showAgentTemplates() {
    const templates = [
        { name: 'Customer Support Bot', type: 'support', icon: '💬', description: 'Handles common customer inquiries and support tickets.' },
        { name: 'Sales Qualifier', type: 'sales', icon: '💼', description: 'Qualifies leads and guides prospects through initial conversations.' },
        { name: 'Content Assistant', type: 'content', icon: '📝', description: 'Helps create, edit, and optimize content across platforms.' },
        { name: 'Research Analyst', type: 'research', icon: '🔍', description: 'Conducts research and summarizes findings on any topic.' },
        { name: 'Task Automator', type: 'automation', icon: '⚡', description: 'Automates repetitive tasks and workflows.' }
    ];
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📋 Agent Templates</h1>
            <p class="welcome-subtitle">Start with a pre-built agent and customize it for your needs.</p>
        </div>

        <div class="workspace-grid">
    `;
    
    templates.forEach(template => {
        html += `
            <div class="workspace-card" style="cursor: pointer;" onclick="createFromTemplate('${template.name}', '${template.type}', '${template.icon}', '${template.description}')">
                <div class="card-header">
                    <div class="card-icon" style="background: ${getAgentTypeColor(template.type)}; font-size: 28px;">${template.icon}</div>
                    <span class="card-status status-locked">Template</span>
                </div>
                <h3 class="card-title">${template.name}</h3>
                <p class="card-description">${template.description}</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;">Use Template →</button>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-secondary" onclick="showAIAgents()">← Back to My Agents</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function createFromTemplate(name, type, icon, description) {
    const newAgent = {
        id: 'agent_' + Date.now(),
        name: name,
        type: type,
        description: description,
        icon: icon,
        prompt: `You are a ${type} agent named ${name}. ${description}\n\nYour goal is to be helpful, professional, and effective in your role. Always maintain a friendly and supportive tone.`,
        greeting: `Hello! I'm ${name}, your ${type} assistant. How can I help you today?`,
        status: 'draft',
        version: '1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    agents.push(newAgent);
    localStorage.setItem('lccs_agents', JSON.stringify(agents));
    
    alert(`✅ Agent "${newAgent.name}" created from template!`);
    showAIAgents();
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

// Content & Marketing placeholders
function show90DayContentSystem() {
    alert('90-Day Content Calendar System - Coming soon!');
}

function showEmailNurtureSequences() {
    alert('Email Nurture Sequences - Coming soon!');
}

function showWeeklyArticleSystem() {
    alert('Weekly Article Writing System - Coming soon!');
}

function showSocialMediaSystem() {
    alert('Social Media Content System - Coming soon!');
}

function showLeadMagnets() {
    alert('Lead Magnet Creation Framework - Coming soon!');
}

function showContentRepurposing() {
    alert('Content Repurposing Workflows - Coming soon!');
}

// Sales & Delivery placeholders
function showSalesScripts() {
    alert('Sales Call Scripts & Frameworks - Coming soon!');
}

function showProposals() {
    alert('Proposals & Contract Systems - Coming soon!');
}

function showDeliveryFrameworks() {
    alert('Session & Delivery Frameworks - Coming soon!');
}

function showObjectionHandling() {
    alert('Objection Handling Guide - Coming soon!');
}

function showClientOnboarding() {
    alert('Client Onboarding System - Coming soon!');
}

function showProgressTracking() {
    alert('Client Progress Tracking Tools - Coming soon!');
}

// Operations & Systems State
const ceoDashboardState = {
    metrics: [],
    activities: [],
    todos: []
};

const teamCommsState = {
    messages: [],
    channels: []
};

const meetingAgendasState = {
    meetings: [],
    templates: []
};

const sopLibraryState = {
    sops: [],
    categories: []
};

const techStackState = {
    tools: [],
    categories: []
};

const documentVaultState = {
    documents: [],
    folders: []
};

// ============================================
// 1. CEO DASHBOARD
// ============================================
function showCEODashboard() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 CEO Dashboard</h1>
            <p class="welcome-subtitle">Overview of your business metrics and priorities.</p>
        </div>
        
        <div id="ceo-container" style="padding: 20px;">
            <!-- Quick Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="stat-card" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
                    <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">$0</div>
                    <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Monthly Revenue</div>
                </div>
                <div class="stat-card" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 8px;">👥</div>
                    <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">0</div>
                    <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Active Clients</div>
                </div>
                <div class="stat-card" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
                    <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">0</div>
                    <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Active Projects</div>
                </div>
                <div class="stat-card" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <div style="font-size: 32px; margin-bottom: 8px;">👤</div>
                    <div style="font-size: 28px; font-weight: 600; color: var(--warm-gold);">1</div>
                    <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Team Members</div>
                </div>
            </div>
            
            <!-- Action Items -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: var(--warm-gold); margin: 0;">🎯 Action Items</h3>
                    <button class="btn btn-primary" id="btn-add-todo" data-action="add-todo" style="font-size: 13px;">+ Add</button>
                </div>
                <div id="todos-list">
                    <p style="color: rgba(246, 241, 232, 0.5);">No action items yet. Add your first priority task.</p>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                <h3 style="color: var(--warm-gold); margin-bottom: 16px;">📈 Recent Activity</h3>
                <div id="activity-list">
                    <p style="color: rgba(246, 241, 232, 0.5);">No recent activity to display.</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('ceo-container').addEventListener('click', function(e) {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            handleCEOAction(action, btn.dataset.id);
        }
    });
}

function handleCEOAction(action, id) {
    switch(action) {
        case 'add-todo':
            const todo = prompt('Enter action item:');
            if (todo) {
                ceoDashboardState.todos.push({
                    id: Date.now(),
                    text: todo,
                    completed: false,
                    createdAt: new Date().toISOString()
                });
                alert('Action item added: ' + todo);
            }
            break;
        case 'complete-todo':
            const todoItem = ceoDashboardState.todos.find(t => t.id == id);
            if (todoItem) {
                todoItem.completed = !todoItem.completed;
                showCEODashboard();
            }
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// ============================================
// 2. TEAM COMMUNICATIONS
// ============================================
function showTeamCommunications() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">💬 Team Communications</h1>
            <p class="welcome-subtitle">Stay connected with your team.</p>
        </div>
        
        <div id="comms-container" style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 250px 1fr; gap: 20px; height: 600px;">
                <!-- Channels Sidebar -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--warm-gold); margin-bottom: 16px; font-size: 16px;">Channels</h3>
                    <div id="channels-list">
                        <div class="channel-item" data-channel="general" style="padding: 10px; border-radius: 8px; cursor: pointer; background: rgba(212, 175, 99, 0.2); color: var(--warm-gold); margin-bottom: 8px;">
                            # general
                        </div>
                        <div class="channel-item" data-channel="sales" style="padding: 10px; border-radius: 8px; cursor: pointer; color: rgba(246, 241, 232, 0.7); margin-bottom: 8px;">
                            # sales
                        </div>
                        <div class="channel-item" data-channel="operations" style="padding: 10px; border-radius: 8px; cursor: pointer; color: rgba(246, 241, 232, 0.7); margin-bottom: 8px;">
                            # operations
                        </div>
                    </div>
                    <button class="btn btn-secondary" id="btn-add-channel" data-action="add-channel" style="width: 100%; margin-top: 16px; font-size: 13px;">+ New Channel</button>
                </div>
                
                <!-- Message Area -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px; display: flex; flex-direction: column;">
                    <div style="border-bottom: 1px solid rgba(212, 175, 99, 0.15); padding-bottom: 16px; margin-bottom: 16px;">
                        <h3 style="color: var(--ivory-light); margin: 0;"># general</h3>
                    </div>
                    <div id="messages-list" style="flex: 1; overflow-y: auto; margin-bottom: 16px;">
                        <p style="color: rgba(246, 241, 232, 0.5);">No messages yet. Start the conversation!</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <input type="text" id="message-input" placeholder="Type a message..." style="flex: 1; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 8px; color: var(--ivory-light);">
                        <button class="btn btn-primary" id="btn-send-message" data-action="send-message">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('comms-container').addEventListener('click', function(e) {
        const channel = e.target.closest('.channel-item');
        if (channel) {
            const channelName = channel.dataset.channel;
            loadChannelMessages(channelName);
        }
        
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            handleCommsAction(action);
        }
    });
}

function handleCommsAction(action) {
    switch(action) {
        case 'add-channel':
            const channelName = prompt('Enter channel name:');
            if (channelName) {
                alert('Channel created: #' + channelName);
            }
            break;
        case 'send-message':
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            if (message) {
                teamCommsState.messages.push({
                    id: Date.now(),
                    text: message,
                    author: 'You',
                    timestamp: new Date().toISOString()
                });
                input.value = '';
                alert('Message sent: ' + message);
            }
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function loadChannelMessages(channelName) {
    console.log('Loading messages for channel:', channelName);
}

// ============================================
// 3. MEETING AGENDAS
// ============================================
function showMeetingAgendas() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📅 Meeting Agendas</h1>
            <p class="welcome-subtitle">Plan and track your meetings.</p>
        </div>
        
        <div id="meetings-container" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h3 style="color: var(--warm-gold); margin: 0;">Upcoming Meetings</h3>
                <button class="btn btn-primary" id="btn-schedule-meeting" data-action="schedule-meeting">+ Schedule Meeting</button>
            </div>
            
            <div id="meetings-list">
                <div class="meeting-card" data-meeting-id="1" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="color: var(--ivory-light); margin: 0 0 8px 0;">Weekly Team Standup</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 14px;">Monday, 9:00 AM • 30 min</p>
                        </div>
                        <span style="background: rgba(46, 124, 131, 0.3); color: var(--sacred-teal); padding: 4px 12px; border-radius: 20px; font-size: 12px;">Upcoming</span>
                    </div>
                </div>
                
                <div class="meeting-card" data-meeting-id="2" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="color: var(--ivory-light); margin: 0 0 8px 0;">Client Review</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 14px;">Wednesday, 2:00 PM • 1 hour</p>
                        </div>
                        <span style="background: rgba(46, 124, 131, 0.3); color: var(--sacred-teal); padding: 4px 12px; border-radius: 20px; font-size: 12px;">Upcoming</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px;">
                <h3 style="color: var(--warm-gold); margin-bottom: 16px;">Templates</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div class="template-card" data-template="standup" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; cursor: pointer;">
                        <h4 style="color: var(--ivory-light); margin: 0 0 8px 0;">Daily Standup</h4>
                        <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 13px;">Quick team sync template</p>
                    </div>
                    <div class="template-card" data-template="review" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 20px; cursor: pointer;">
                        <h4 style="color: var(--ivory-light); margin: 0 0 8px 0;">Quarterly Review</h4>
                        <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 13px;">Strategic planning template</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('meetings-container').addEventListener('click', function(e) {
        const meetingCard = e.target.closest('.meeting-card');
        if (meetingCard) {
            const meetingId = meetingCard.dataset.meetingId;
            viewMeeting(meetingId);
        }
        
        const templateCard = e.target.closest('.template-card');
        if (templateCard) {
            const templateName = templateCard.dataset.template;
            useTemplate(templateName);
        }
        
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            handleMeetingAction(action);
        }
    });
}

function handleMeetingAction(action) {
    switch(action) {
        case 'schedule-meeting':
            const meetingName = prompt('Enter meeting name:');
            if (meetingName) {
                alert('Meeting scheduled: ' + meetingName);
            }
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function viewMeeting(meetingId) {
    alert('Viewing meeting: ' + meetingId);
}

function useTemplate(templateName) {
    alert('Using template: ' + templateName);
}

// ============================================
// 4. SOP LIBRARY
// ============================================
function showSOPLibrary() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📚 SOP Library</h1>
            <p class="welcome-subtitle">Standard Operating Procedures for your business.</p>
        </div>
        
        <div id="sop-container" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary active" data-filter="all">All</button>
                    <button class="btn btn-secondary" data-filter="sales">Sales</button>
                    <button class="btn btn-secondary" data-filter="operations">Operations</button>
                    <button class="btn btn-secondary" data-filter="marketing">Marketing</button>
                </div>
                <button class="btn btn-primary" id="btn-add-sop" data-action="add-sop">+ Add SOP</button>
            </div>
            
            <div id="sop-list">
                <div class="sop-card" data-sop-id="1" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <span style="background: rgba(46, 124, 131, 0.2); color: var(--sacred-teal); padding: 4px 12px; border-radius: 20px; font-size: 11px; margin-bottom: 8px; display: inline-block;">Sales</span>
                            <h4 style="color: var(--ivory-light); margin: 8px 0;">Discovery Call Process</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 14px;">Step-by-step guide for conducting discovery calls</p>
                        </div>
                    </div>
                </div>
                
                <div class="sop-card" data-sop-id="2" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <span style="background: rgba(212, 175, 99, 0.2); color: var(--warm-gold); padding: 4px 12px; border-radius: 20px; font-size: 11px; margin-bottom: 8px; display: inline-block;">Operations</span>
                            <h4 style="color: var(--ivory-light); margin: 8px 0;">Client Onboarding</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 0; font-size: 14px;">Standard process for onboarding new clients</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('sop-container').addEventListener('click', function(e) {
        const sopCard = e.target.closest('.sop-card');
        if (sopCard) {
            const sopId = sopCard.dataset.sopId;
            viewSOP(sopId);
        }
        
        const filterBtn = e.target.closest('[data-filter]');
        if (filterBtn) {
            const filter = filterBtn.dataset.filter;
            filterSOPs(filter);
        }
        
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            handleSOPAction(action);
        }
    });
}

function handleSOPAction(action) {
    switch(action) {
        case 'add-sop':
            const sopName = prompt('Enter SOP name:');
            if (sopName) {
                alert('SOP created: ' + sopName);
            }
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function viewSOP(sopId) {
    alert('Viewing SOP: ' + sopId);
}

function filterSOPs(filter) {
    console.log('Filtering SOPs by:', filter);
}

// ============================================
// 5. TECH STACK MANAGER
// ============================================
function showTechStackManager() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🛠️ Tech Stack Manager</h1>
            <p class="welcome-subtitle">Manage your tools and subscriptions.</p>
        </div>
        
        <div id="tech-container" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h3 style="color: var(--warm-gold); margin: 0;">Your Tools</h3>
                <button class="btn btn-primary" id="btn-add-tool" data-action="add-tool">+ Add Tool</button>
            </div>
            
            <div id="tools-list">
                <div class="tool-card" data-tool-id="1" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(46, 124, 131, 0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📧</div>
                            <div>
                                <h4 style="color: var(--ivory-light); margin: 0;">ConvertKit</h4>
                                <p style="color: rgba(246, 241, 232, 0.6); margin: 4px 0 0 0; font-size: 14px;">Email Marketing • $29/month</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary" data-action="edit-tool" data-tool-id="1" style="font-size: 12px;">Edit</button>
                            <button class="btn btn-secondary" data-action="renew-tool" data-tool-id="1" style="font-size: 12px;">Renew</button>
                        </div>
                    </div>
                </div>
                
                <div class="tool-card" data-tool-id="2" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: rgba(94, 59, 108, 0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📊</div>
                            <div>
                                <h4 style="color: var(--ivory-light); margin: 0;">HubSpot CRM</h4>
                                <p style="color: rgba(246, 241, 232, 0.6); margin: 4px 0 0 0; font-size: 14px;">CRM • $45/month • Renews in 15 days</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary" data-action="edit-tool" data-tool-id="2" style="font-size: 12px;">Edit</button>
                            <button class="btn btn-secondary" data-action="renew-tool" data-tool-id="2" style="font-size: 12px;">Renew</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(46, 124, 131, 0.1); border: 1px solid rgba(46, 124, 131, 0.3); border-radius: 12px; padding: 20px; margin-top: 30px;">
                <h4 style="color: var(--sacred-teal); margin: 0 0 8px 0;">💡 Monthly Spend</h4>
                <p style="color: var(--ivory-light); font-size: 24px; font-weight: 600; margin: 0;">$74/month</p>
                <p style="color: rgba(246, 241, 232, 0.6); margin: 8px 0 0 0; font-size: 14px;">Across 2 active subscriptions</p>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('tech-container').addEventListener('click', function(e) {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            const toolId = btn.dataset.toolId;
            handleTechAction(action, toolId);
        }
    });
}

function handleTechAction(action, toolId) {
    switch(action) {
        case 'add-tool':
            const toolName = prompt('Enter tool name:');
            if (toolName) {
                alert('Tool added: ' + toolName);
            }
            break;
        case 'edit-tool':
            alert('Editing tool: ' + toolId);
            break;
        case 'renew-tool':
            alert('Renewing tool: ' + toolId);
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// ============================================
// 6. DOCUMENT VAULT
// ============================================
function showDocumentVault() {
    setActiveNav('operations-systems');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📁 Document Vault</h1>
            <p class="welcome-subtitle">Secure storage for your important documents.</p>
        </div>
        
        <div id="vault-container" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary active" data-folder="all">All Files</button>
                    <button class="btn btn-secondary" data-folder="contracts">Contracts</button>
                    <button class="btn btn-secondary" data-folder="financial">Financial</button>
                    <button class="btn btn-secondary" data-folder="legal">Legal</button>
                </div>
                <button class="btn btn-primary" id="btn-upload-doc" data-action="upload-doc">+ Upload</button>
            </div>
            
            <div id="documents-list">
                <div class="doc-row" data-doc-id="1" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 16px 24px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 24px;">📄</span>
                        <div>
                            <h4 style="color: var(--ivory-light); margin: 0; font-size: 16px;">Service Agreement Template.pdf</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 4px 0 0 0; font-size: 13px;">Contracts • 245 KB • Uploaded Jan 15, 2026</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary" data-action="download-doc" data-doc-id="1" style="font-size: 12px;">Download</button>
                        <button class="btn btn-secondary" data-action="delete-doc" data-doc-id="1" style="font-size: 12px;">Delete</button>
                    </div>
                </div>
                
                <div class="doc-row" data-doc-id="2" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 12px; padding: 16px 24px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 24px;">📊</span>
                        <div>
                            <h4 style="color: var(--ivory-light); margin: 0; font-size: 16px;">Q4 Financial Report.xlsx</h4>
                            <p style="color: rgba(246, 241, 232, 0.6); margin: 4px 0 0 0; font-size: 13px;">Financial • 1.2 MB • Uploaded Jan 10, 2026</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary" data-action="download-doc" data-doc-id="2" style="font-size: 12px;">Download</button>
                        <button class="btn btn-secondary" data-action="delete-doc" data-doc-id="2" style="font-size: 12px;">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation
    document.getElementById('vault-container').addEventListener('click', function(e) {
        const folderBtn = e.target.closest('[data-folder]');
        if (folderBtn) {
            const folder = folderBtn.dataset.folder;
            filterDocuments(folder);
        }
        
        const btn = e.target.closest('[data-action]');
        if (btn) {
            const action = btn.dataset.action;
            const docId = btn.dataset.docId;
            handleVaultAction(action, docId);
        }
    });
}

function handleVaultAction(action, docId) {
    switch(action) {
        case 'upload-doc':
            const fileName = prompt('Enter document name:');
            if (fileName) {
                alert('Document uploaded: ' + fileName);
            }
            break;
        case 'download-doc':
            alert('Downloading document: ' + docId);
            break;
        case 'delete-doc':
            if (confirm('Are you sure you want to delete this document?')) {
                alert('Document deleted: ' + docId);
            }
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function filterDocuments(folder) {
    console.log('Filtering documents by folder:', folder);
}

// Stub functions for features not yet implemented
function editContent(contentId) {
    alert('Edit content coming soon!');
}

// Assessment placeholder functions
function showBusinessAssessment() {
    setActiveNav('business');
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Business Command Audit</h1>
            <p class="welcome-subtitle">Comprehensive assessment of your business strategy, model, and growth potential.</p>
        </div>

        <div class="workspace-grid" style="margin-bottom: 40px;">
            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(46, 124, 131, 0.3);">🎯</div>
                    <span class="card-status status-progress">Active</span>
                </div>
                <h3 class="card-title">Business Model Canvas</h3>
                <p class="card-description">Define your value proposition, customer segments, revenue streams, and key partnerships.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showBusinessModelCanvas()">Start Assessment →</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(212, 175, 99, 0.3);">💎</div>
                    <span class="card-status status-progress">Active</span>
                </div>
                <h3 class="card-title">Value Proposition</h3>
                <p class="card-description">Clarify your unique value, understand customer pain points, and craft compelling messaging.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showValueProposition()">Start Assessment →</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(94, 59, 108, 0.3);">📈</div>
                    <span class="card-status status-progress">Active</span>
                </div>
                <h3 class="card-title">Growth Strategy Audit</h3>
                <p class="card-description">Analyze your current growth channels, conversion rates, and scaling opportunities.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showGrowthStrategyAudit()">Start Assessment →</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(31, 49, 91, 0.5);">⚙️</div>
                    <span class="card-status status-progress" id="operations-status-badge">Active</span>
                </div>
                <h3 class="card-title">Operations Audit</h3>
                <p class="card-description">Evaluate your systems, processes, team structure, and operational efficiency.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showOperationsAudit()">Start Assessment →</button>
                </div>
            </div>
        </div>

        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 12px;">Complete Business Audit</h3>
            <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">Work through all four assessment areas to get a complete picture of your business health and identify priority areas for improvement.</p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="showBusinessModelCanvas()">Start with Business Model →</button>
                <button class="btn btn-secondary" onclick="loadDashboard()">← Back to Dashboard</button>
            </div>
        </div>
    `;
}

function showBusinessModelCanvas() {
    setActiveNav('business');
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">🎯 Business Model Canvas</h1>
            <p class="welcome-subtitle">Define the key components of your business model.</p>
        </div>

        <div style="max-width: 1000px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                
                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Value Proposition</label>
                    <textarea id="bmc-value" rows="3" placeholder="What value do you deliver to your customers? What problem are you solving?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Customer Segments</label>
                    <textarea id="bmc-customers" rows="3" placeholder="Who are your most important customers? What segments do you serve?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Revenue Streams</label>
                        <textarea id="bmc-revenue" rows="3" placeholder="How do you make money? What are your pricing models?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Cost Structure</label>
                        <textarea id="bmc-costs" rows="3" placeholder="What are your major costs? Fixed vs variable expenses?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Key Activities</label>
                        <textarea id="bmc-activities" rows="3" placeholder="What key activities does your business require?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Key Resources</label>
                        <textarea id="bmc-resources" rows="3" placeholder="What key resources does your business require?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                    </div>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Key Partnerships</label>
                    <textarea id="bmc-partnerships" rows="3" placeholder="Who are your key partners and suppliers?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Channels</label>
                    <textarea id="bmc-channels" rows="3" placeholder="How do you reach your customers? What channels do you use?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Customer Relationships</label>
                    <textarea id="bmc-relationships" rows="3" placeholder="What type of relationship do you have with customers?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;"></textarea>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showBusinessAssessment()">← Back to Audit</button>
                <button class="btn btn-primary" onclick="saveBusinessModelCanvas()">💾 Save Canvas</button>
            </div>
        </div>
    `;
}

function saveBusinessModelCanvas() {
    const canvas = {
        valueProposition: document.getElementById('bmc-value').value,
        customerSegments: document.getElementById('bmc-customers').value,
        revenueStreams: document.getElementById('bmc-revenue').value,
        costStructure: document.getElementById('bmc-costs').value,
        keyActivities: document.getElementById('bmc-activities').value,
        keyResources: document.getElementById('bmc-resources').value,
        keyPartnerships: document.getElementById('bmc-partnerships').value,
        channels: document.getElementById('bmc-channels').value,
        customerRelationships: document.getElementById('bmc-relationships').value,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('lccs_business_canvas', JSON.stringify(canvas));
    
    // Update module progress
    updateModuleProgress('business', 25);
    
    alert('✅ Business Model Canvas saved!');
    showBusinessAssessment();
}

function showCompetitivePositioning() {
    window.open('https://lifecharter-competitive-positioning.vercel.app', '_blank');
}

// ============================================
// VALUE PROPOSITION MODULE - FULL IMPLEMENTATION
// ============================================

// Value Proposition State
let valuePropositionState = {
    currentSection: 1,
    totalSections: 5,
    data: {},
    savedProgress: null,
    isLoading: false
};

// Section configurations
const vpSections = [
    {
        id: 1,
        title: 'Current State Analysis',
        icon: '📍',
        description: 'Document what you currently offer and who you serve'
    },
    {
        id: 2,
        title: 'Customer Pain Points',
        icon: '🔍',
        description: 'Understand the problems your customers face'
    },
    {
        id: 3,
        title: 'Your Unique Solution',
        icon: '💡',
        description: 'Define how you solve problems differently'
    },
    {
        id: 4,
        title: 'Value Articulation',
        icon: '✍️',
        description: 'Craft your value proposition statement'
    },
    {
        id: 5,
        title: 'Validation & Testing',
        icon: '🧪',
        description: 'Plan how to test and validate your value prop'
    }
];

// Load Value Proposition data from Supabase
async function loadValuePropositionFromSupabase() {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return null;
    
    try {
        const { data, error } = await supabaseClient
            .from('business_value_proposition')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (data) {
            valuePropositionState.savedProgress = data;
            valuePropositionState.data = data.section_data || {};
            valuePropositionState.currentSection = data.current_section || 1;
            return data;
        }
        return null;
    } catch (err) {
        console.error('Error loading value proposition from Supabase:', err);
        return null;
    }
}

// Save Value Proposition data to Supabase
async function saveValuePropositionToSupabase(sectionData, progressPercent, status = 'in_progress', currentSection = null) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const saveData = {
            user_id: userId,
            section_data: { ...valuePropositionState.data, ...sectionData },
            progress_percent: progressPercent,
            status: status,
            current_section: currentSection || valuePropositionState.currentSection,
            updated_at: new Date().toISOString()
        };
        
        // Check if record exists
        const { data: existing } = await supabaseClient
            .from('business_value_proposition')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        let result;
        if (existing) {
            result = await supabaseClient
                .from('business_value_proposition')
                .update(saveData)
                .eq('id', existing.id);
        } else {
            saveData.created_at = new Date().toISOString();
            result = await supabaseClient
                .from('business_value_proposition')
                .insert([saveData]);
        }
        
        if (result.error) throw result.error;
        
        // Update local state
        valuePropositionState.data = saveData.section_data;
        
        return true;
    } catch (err) {
        console.error('Error saving value proposition to Supabase:', err);
        return false;
    }
}

// Main function to show Value Proposition module
async function showValueProposition() {
    setActiveNav('business');
    
    // Load saved progress
    valuePropositionState.isLoading = true;
    await loadValuePropositionFromSupabase();
    valuePropositionState.isLoading = false;
    
    renderValueProposition();
}

// Render the Value Proposition module
function renderValueProposition() {
    const saved = valuePropositionState.savedProgress;
    const hasProgress = saved && saved.progress_percent > 0;
    const progressPercent = saved?.progress_percent || 0;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">💎 Value Proposition Refinement</h1>
            <p class="welcome-subtitle">Clarify your unique value, understand customer pain points, and craft compelling messaging.</p>
        </div>
    `;
    
    // Show resume banner if there's saved progress
    if (hasProgress && saved.status !== 'completed') {
        html += `
            <div style="background: rgba(46, 124, 131, 0.2); border: 1px solid rgba(46, 124, 131, 0.4); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 32px;">💾</div>
                    <div>
                        <div style="font-weight: 600; color: var(--ivory-light);">Resume where you left off</div>
                        <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">You're ${progressPercent}% complete • Last saved ${new Date(saved.updated_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="goToVPSection(${saved.current_section || 1})">Resume →</button>
            </div>
        `;
    }
    
    // Progress overview
    html += `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="color: rgba(246, 241, 232, 0.7);">Overall Progress</span>
                <span style="color: var(--warm-gold); font-weight: 600;">${progressPercent}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 10px; height: 12px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 10px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    // Section cards
    html += `<div class="workspace-grid" style="margin-bottom: 30px;">`;
    
    vpSections.forEach(section => {
        const isCompleted = progressPercent >= (section.id * 20);
        const isCurrent = valuePropositionState.currentSection === section.id;
        const sectionData = valuePropositionState.data || {};
        const hasSectionData = sectionData[`section${section.id}`] && Object.keys(sectionData[`section${section.id}`]).length > 0;
        
        html += `
            <div class="workspace-card" style="${isCurrent ? 'border: 2px solid rgba(212, 175, 99, 0.4);' : ''} ${isCompleted ? 'border: 2px solid rgba(76, 175, 80, 0.3);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${isCompleted ? 'rgba(76, 175, 80, 0.3)' : isCurrent ? 'rgba(212, 175, 99, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">${section.icon}</div>
                    <span class="card-status ${isCompleted ? 'status-complete' : hasSectionData ? 'status-progress' : 'status-locked'}">${isCompleted ? 'Complete' : hasSectionData ? 'In Progress' : 'Not Started'}</span>
                </div>
                <h3 class="card-title">${section.id}. ${section.title}</h3>
                <p class="card-description">${section.description}</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="goToVPSection(${section.id})">${hasSectionData ? 'Continue →' : 'Start →'}</button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Bottom actions
    html += `
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="showBusinessAssessment()">← Back to Business Audit</button>
            ${saved?.status === 'completed' ? `
                <button class="btn btn-primary" onclick="reviewVPResults()">📊 Review Results</button>
                <button class="btn btn-secondary" onclick="resetValueProposition()">🔄 Start Over</button>
            ` : ''}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// Navigate to a specific section
function goToVPSection(sectionId) {
    valuePropositionState.currentSection = sectionId;
    renderVPSection(sectionId);
}

// Render individual section
function renderVPSection(sectionId) {
    const section = vpSections.find(s => s.id === sectionId);
    if (!section) return;
    
    const sectionData = valuePropositionState.data?.[`section${sectionId}`] || {};
    const progressPercent = (sectionId / valuePropositionState.totalSections) * 100;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">${section.icon} ${section.title}</h1>
            <p class="welcome-subtitle">${section.description}</p>
        </div>
        
        <!-- Progress Bar -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="color: rgba(246, 241, 232, 0.7); font-size: 14px;">Section ${sectionId} of ${valuePropositionState.totalSections}</span>
                <span style="color: var(--warm-gold); font-weight: 600; font-size: 14px;">${Math.round(progressPercent)}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 8px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 8px; transition: width 0.3s;"></div>
            </div>
        </div>
        
        <!-- Section Content -->
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                ${getVPSectionContent(sectionId, sectionData)}
            </div>
            
            <!-- Navigation -->
            <div style="display: flex; justify-content: space-between; margin-top: 30px; align-items: center;">
                <button class="btn btn-secondary" onclick="${sectionId > 1 ? `goToVPSection(${sectionId - 1})` : 'renderValueProposition()'}">
                    ← ${sectionId > 1 ? 'Previous Section' : 'Back to Overview'}
                </button>
                
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="saveVPProgressAndExit()">💾 Save & Exit</button>
                    <button class="btn btn-primary" onclick="saveVPSectionAndContinue(${sectionId})">
                        ${sectionId === valuePropositionState.totalSections ? '✅ Complete Assessment' : 'Save & Continue →'}
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Auto-save indicator -->
        <div id="vp-autosave-indicator" style="position: fixed; bottom: 20px; right: 20px; background: rgba(46, 124, 131, 0.9); color: white; padding: 10px 16px; border-radius: 8px; font-size: 13px; display: none; align-items: center; gap: 8px; z-index: 100;">
            <span>💾</span> Auto-saved
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get content for each section
function getVPSectionContent(sectionId, sectionData) {
    switch (sectionId) {
        case 1:
            return getVPCurrentStateContent(sectionData);
        case 2:
            return getVPPainPointsContent(sectionData);
        case 3:
            return getVPUniqueSolutionContent(sectionData);
        case 4:
            return getVPValueArticulationContent(sectionData);
        case 5:
            return getVPValidationContent(sectionData);
        default:
            return '';
    }
}

// Section 1: Current State Analysis
function getVPCurrentStateContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📍 Current State Analysis</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Document what you currently offer and who you serve. This establishes your baseline.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                What do you currently offer?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Describe your main products, services, or offers</span>
            </label>
            <textarea id="vp-current-offer" rows="4" placeholder="e.g., I offer 1:1 coaching sessions, group programs, and digital courses on business strategy..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.currentOffer || ''}</textarea>
            <div style="text-align: right; font-size: 12px; color: rgba(246, 241, 232, 0.4); margin-top: 6px;"><span id="vp-current-offer-count">${(data.currentOffer || '').length}</span> characters</div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Who do you serve?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Describe your target audience or ideal client</span>
            </label>
            <textarea id="vp-target-audience" rows="4" placeholder="e.g., Service-based entrepreneurs, coaches, and consultants who are 2-5 years into their business..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.targetAudience || ''}</textarea>
            <div style="text-align: right; font-size: 12px; color: rgba(246, 241, 232, 0.4); margin-top: 6px;"><span id="vp-target-audience-count">${(data.targetAudience || '').length}</span> characters</div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                What do they pay you for?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What outcomes or transformations do clients get?</span>
            </label>
            <textarea id="vp-paid-for" rows="4" placeholder="e.g., They pay for clarity on their business model, a clear growth strategy, and accountability to execute..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.paidFor || ''}</textarea>
            <div style="text-align: right; font-size: 12px; color: rgba(246, 241, 232, 0.4); margin-top: 6px;"><span id="vp-paid-for-count">${(data.paidFor || '').length}</span> characters</div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Current pricing/packages
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">List your current offers and price points</span>
            </label>
            <textarea id="vp-pricing" rows="4" placeholder="e.g.,\n• 1:1 Coaching: $500/month\n• Group Program: $2,000\n• Digital Course: $297" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.pricing || ''}</textarea>
        </div>
    `;
}

// Section 2: Customer Pain Points
function getVPPainPointsContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">🔍 Customer Pain Points</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Understand the problems your customers face. The deeper you understand their pain, the better you can position your solution.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Problem #1: What's the biggest pain point?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">The #1 problem that keeps them up at night</span>
            </label>
            <textarea id="vp-problem-1" rows="4" placeholder="e.g., They feel overwhelmed by all the things they 'should' be doing in their business and don't know what to focus on first..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.problem1 || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Problem #2: What else frustrates them?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">A secondary pain point they experience</span>
            </label>
            <textarea id="vp-problem-2" rows="4" placeholder="e.g., They've tried various marketing tactics but nothing seems to consistently bring in qualified leads..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.problem2 || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Problem #3: What do they wish was easier?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">A workflow or process they struggle with</span>
            </label>
            <textarea id="vp-problem-3" rows="4" placeholder="e.g., They spend hours creating content but aren't sure if it's actually moving the needle in their business..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.problem3 || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                What have they tried before?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Previous solutions or approaches they've attempted</span>
            </label>
            <textarea id="vp-tried-before" rows="4" placeholder="e.g., They've taken online courses, hired VAs, tried different software tools, and followed various marketing 'gurus'..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.triedBefore || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Why did those solutions fail?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What was missing or why didn't they work?</span>
            </label>
            <textarea id="vp-why-failed" rows="4" placeholder="e.g., The courses gave information but no implementation support. The VAs needed too much direction. The tools didn't integrate well..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.whyFailed || ''}</textarea>
        </div>
    `;
}

// Section 3: Your Unique Solution
function getVPUniqueSolutionContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">💡 Your Unique Solution</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Define how you solve their problems differently. This is where you differentiate from competitors.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                How do you solve their #1 problem?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Your approach to solving their biggest pain point</span>
            </label>
            <textarea id="vp-solve-problem-1" rows="4" placeholder="e.g., I help them create a simple, prioritized action plan based on their specific business stage and goals, not generic advice..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.solveProblem1 || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                What makes your approach different?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Your unique methodology, framework, or perspective</span>
            </label>
            <textarea id="vp-different-approach" rows="4" placeholder="e.g., Instead of teaching more tactics, I help them simplify and focus on the 3 things that actually move revenue. I use the LifeCharter framework..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.differentApproach || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Why do customers choose you?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">The main reasons clients decide to work with you</span>
            </label>
            <textarea id="vp-why-choose" rows="4" placeholder="e.g., They say they choose me because I 'get it' - I've been where they are. They appreciate my no-fluff, practical approach and that I customize everything..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.whyChoose || ''}</textarea>
        </div>
    `;
}

// Section 4: Value Articulation
function getVPValueArticulationContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">✍️ Value Articulation</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Craft your value proposition statement and supporting messages.</p>
        
        <div style="background: rgba(46, 124, 131, 0.1); border: 1px solid rgba(46, 124, 131, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <div style="font-size: 13px; color: var(--sacred-teal); margin-bottom: 8px;">💡 Template</div>
            <div style="font-size: 14px; color: rgba(246, 241, 232, 0.8); font-style: italic;">
                "I help [target audience] who [specific problem] to [desired outcome] through [your unique approach]."
            </div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Draft Value Proposition Statement
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Your main value proposition in one clear sentence</span>
            </label>
            <textarea id="vp-value-statement" rows="4" placeholder="e.g., I help overwhelmed service-based business owners who are stuck at 6-figures create clear, prioritized growth plans that actually get implemented..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.valueStatement || ''}</textarea>
            <div style="text-align: right; font-size: 12px; color: rgba(246, 241, 232, 0.4); margin-top: 6px;"><span id="vp-value-statement-count">${(data.valueStatement || '').length}</span> characters</div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Supporting Proof Points
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Evidence that supports your claims (results, credentials, testimonials)</span>
            </label>
            <textarea id="vp-proof-points" rows="4" placeholder="e.g.,\n• 10+ years building successful businesses\n• Helped 200+ clients double their revenue\n• Featured in Forbes, Inc, and Entrepreneur\n• 95% client satisfaction rate" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.proofPoints || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Objection Handlers
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Common objections and how you address them</span>
            </label>
            <textarea id="vp-objections" rows="4" placeholder="e.g.,\n• 'I can't afford it' → We offer payment plans and most clients make their investment back within 60 days\n• 'I don't have time' → Our program is designed for busy people with just 3 hours/week commitment" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.objections || ''}</textarea>
        </div>
    `;
}

// Section 5: Validation & Testing
function getVPValidationContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">🧪 Validation & Testing</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Plan how you'll test and validate your value proposition with real customers.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                How will you test this value prop?
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Specific methods to validate your messaging</span>
            </label>
            <textarea id="vp-test-method" rows="4" placeholder="e.g., I'll test 3 different value proposition statements in my LinkedIn posts and measure engagement. I'll also ask 5 current clients which version resonates most..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.testMethod || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Success Metrics
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How will you know if your value prop is working?</span>
            </label>
            <textarea id="vp-success-metrics" rows="4" placeholder="e.g.,\n• 20%+ increase in discovery call bookings\n• Higher quality leads who specifically mention my messaging\n• 50%+ improvement in sales call close rate\n• More referrals from ideal clients" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.successMetrics || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Customer Feedback Notes
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Space to record feedback as you test</span>
            </label>
            <textarea id="vp-feedback-notes" rows="4" placeholder="Record actual customer feedback here as you test your value proposition..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.feedbackNotes || ''}</textarea>
        </div>
        
        <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.2); border-radius: 12px; padding: 20px; margin-top: 32px;">
            <div style="font-size: 20px; margin-bottom: 8px;">🎉</div>
            <div style="font-weight: 600; color: var(--ivory-light); margin-bottom: 4px;">Almost Complete!</div>
            <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Save this section to complete your Value Proposition assessment.</div>
        </div>
    `;
}

// Save section and continue
async function saveVPSectionAndContinue(sectionId) {
    const sectionData = collectVPSectionData(sectionId);
    const nextSection = sectionId + 1;
    const progressPercent = sectionId === valuePropositionState.totalSections ? 100 : Math.round((sectionId / valuePropositionState.totalSections) * 100);
    const status = sectionId === valuePropositionState.totalSections ? 'completed' : 'in_progress';
    
    // Show saving indicator
    showVPAutoSaveIndicator();
    
    // Save to state
    valuePropositionState.data[`section${sectionId}`] = sectionData;
    
    // Save to Supabase
    const saved = await saveValuePropositionToSupabase(
        { [`section${sectionId}`]: sectionData },
        progressPercent,
        status,
        nextSection <= valuePropositionState.totalSections ? nextSection : sectionId
    );
    
    if (saved) {
        valuePropositionState.savedProgress = {
            ...valuePropositionState.savedProgress,
            progress_percent: progressPercent,
            status: status,
            current_section: nextSection <= valuePropositionState.totalSections ? nextSection : sectionId
        };
    }
    
    if (sectionId === valuePropositionState.totalSections) {
        // Completed
        updateModuleProgress('value', 100);
        alert('🎉 Congratulations! You\'ve completed the Value Proposition assessment!');
        renderValueProposition();
    } else {
        // Continue to next section
        goToVPSection(nextSection);
    }
}

// Collect data from current section
function collectVPSectionData(sectionId) {
    const data = {};
    
    switch (sectionId) {
        case 1:
            data.currentOffer = document.getElementById('vp-current-offer')?.value || '';
            data.targetAudience = document.getElementById('vp-target-audience')?.value || '';
            data.paidFor = document.getElementById('vp-paid-for')?.value || '';
            data.pricing = document.getElementById('vp-pricing')?.value || '';
            break;
        case 2:
            data.problem1 = document.getElementById('vp-problem-1')?.value || '';
            data.problem2 = document.getElementById('vp-problem-2')?.value || '';
            data.problem3 = document.getElementById('vp-problem-3')?.value || '';
            data.triedBefore = document.getElementById('vp-tried-before')?.value || '';
            data.whyFailed = document.getElementById('vp-why-failed')?.value || '';
            break;
        case 3:
            data.solveProblem1 = document.getElementById('vp-solve-problem-1')?.value || '';
            data.differentApproach = document.getElementById('vp-different-approach')?.value || '';
            data.whyChoose = document.getElementById('vp-why-choose')?.value || '';
            break;
        case 4:
            data.valueStatement = document.getElementById('vp-value-statement')?.value || '';
            data.proofPoints = document.getElementById('vp-proof-points')?.value || '';
            data.objections = document.getElementById('vp-objections')?.value || '';
            break;
        case 5:
            data.testMethod = document.getElementById('vp-test-method')?.value || '';
            data.successMetrics = document.getElementById('vp-success-metrics')?.value || '';
            data.feedbackNotes = document.getElementById('vp-feedback-notes')?.value || '';
            break;
    }
    
    return data;
}

// Save progress and exit
async function saveVPProgressAndExit() {
    const sectionData = collectVPSectionData(valuePropositionState.currentSection);
    const progressPercent = Math.round(((valuePropositionState.currentSection - 1) / valuePropositionState.totalSections) * 100);
    
    // Show saving indicator
    showVPAutoSaveIndicator();
    
    // Save to state
    valuePropositionState.data[`section${valuePropositionState.currentSection}`] = sectionData;
    
    // Save to Supabase
    await saveValuePropositionToSupabase(
        { [`section${valuePropositionState.currentSection}`]: sectionData },
        progressPercent,
        'in_progress',
        valuePropositionState.currentSection
    );
    
    alert('💾 Progress saved! You can return anytime to continue.');
    renderValueProposition();
}

// Show auto-save indicator
function showVPAutoSaveIndicator() {
    const indicator = document.getElementById('vp-autosave-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    }
}

// Review results
function reviewVPResults() {
    const data = valuePropositionState.data;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Value Proposition Results</h1>
            <p class="welcome-subtitle">Your complete value proposition framework.</p>
        </div>
        
        <div style="max-width: 900px; margin: 0 auto;">
            <!-- Value Statement Card -->
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.3); border-radius: 20px; padding: 40px; margin-bottom: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">💎</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 20px;">Your Value Proposition</h3>
                <div style="background: rgba(246, 241, 232, 0.05); border-radius: 12px; padding: 24px; font-size: 18px; line-height: 1.6; color: var(--ivory-light); font-style: italic;">
                    "${data?.section4?.valueStatement || 'Complete Section 4 to see your value proposition here.'}"
                </div>
            </div>
            
            <!-- Summary Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 12px;">🎯 What You Offer</h4>
                    <p style="color: rgba(246, 241, 232, 0.7); font-size: 14px; line-height: 1.6;">${data?.section1?.currentOffer || 'Not completed'}</p>
                </div>
                
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 12px;">👥 Who You Serve</h4>
                    <p style="color: rgba(246, 241, 232, 0.7); font-size: 14px; line-height: 1.6;">${data?.section1?.targetAudience || 'Not completed'}</p>
                </div>
                
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 12px;">🔍 Top Pain Point</h4>
                    <p style="color: rgba(246, 241, 232, 0.7); font-size: 14px; line-height: 1.6;">${data?.section2?.problem1 || 'Not completed'}</p>
                </div>
                
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 12px;">💡 Your Solution</h4>
                    <p style="color: rgba(246, 241, 232, 0.7); font-size: 14px; line-height: 1.6;">${data?.section3?.solveProblem1 || 'Not completed'}</p>
                </div>
            </div>
            
            <!-- Actions -->
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="renderValueProposition()">← Back to Overview</button>
                <button class="btn btn-primary" onclick="goToVPSection(1)">✏️ Edit Assessment</button>
                <button class="btn btn-secondary" onclick="exportVPResults()">📥 Export Results</button>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// Reset value proposition
async function resetValueProposition() {
    if (!confirm('Are you sure you want to start over? All your progress will be reset.')) return;
    
    const userId = getCurrentUserId();
    if (userId && supabaseClient) {
        try {
            await supabaseClient
                .from('business_value_proposition')
                .delete()
                .eq('user_id', userId);
        } catch (err) {
            console.error('Error resetting value proposition:', err);
        }
    }
    
    valuePropositionState = {
        currentSection: 1,
        totalSections: 5,
        data: {},
        savedProgress: null,
        isLoading: false
    };
    
    updateModuleProgress('value', 0);
    alert('🔄 Value Proposition assessment reset. Starting fresh!');
    renderValueProposition();
}

// Export results
function exportVPResults() {
    const data = valuePropositionState.data;
    let exportText = `# Value Proposition Assessment Results\n\n`;
    exportText += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    exportText += `## Value Proposition Statement\n`;
    exportText += `${data?.section4?.valueStatement || 'Not completed'}\n\n`;
    
    exportText += `## Current State\n`;
    exportText += `**What you offer:** ${data?.section1?.currentOffer || 'Not completed'}\n\n`;
    exportText += `**Who you serve:** ${data?.section1?.targetAudience || 'Not completed'}\n\n`;
    exportText += `**What they pay for:** ${data?.section1?.paidFor || 'Not completed'}\n\n`;
    exportText += `**Pricing:** ${data?.section1?.pricing || 'Not completed'}\n\n`;
    
    exportText += `## Customer Pain Points\n`;
    exportText += `**Problem 1:** ${data?.section2?.problem1 || 'Not completed'}\n\n`;
    exportText += `**Problem 2:** ${data?.section2?.problem2 || 'Not completed'}\n\n`;
    exportText += `**Problem 3:** ${data?.section2?.problem3 || 'Not completed'}\n\n`;
    
    exportText += `## Your Unique Solution\n`;
    exportText += `**How you solve it:** ${data?.section3?.solveProblem1 || 'Not completed'}\n\n`;
    exportText += `**What makes you different:** ${data?.section3?.differentApproach || 'Not completed'}\n\n`;
    exportText += `**Why they choose you:** ${data?.section3?.whyChoose || 'Not completed'}\n\n`;
    
    exportText += `## Proof Points\n`;
    exportText += `${data?.section4?.proofPoints || 'Not completed'}\n\n`;
    
    exportText += `## Objection Handlers\n`;
    exportText += `${data?.section4?.objections || 'Not completed'}\n\n`;
    
    exportText += `## Validation Plan\n`;
    exportText += `**Testing method:** ${data?.section5?.testMethod || 'Not completed'}\n\n`;
    exportText += `**Success metrics:** ${data?.section5?.successMetrics || 'Not completed'}\n\n`;
    
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `value-proposition-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// OPERATIONS AUDIT MODULE - FULL IMPLEMENTATION
// ============================================

// Operations Audit State
let operationsAuditState = {
    currentSection: 1,
    totalSections: 5,
    data: {},
    savedProgress: null,
    isLoading: false
};

// Section configurations
const operationsSections = [
    {
        id: 1,
        title: 'Systems & Processes',
        icon: '⚙️',
        description: 'Inventory your current systems and document processes'
    },
    {
        id: 2,
        title: 'Team & Resources',
        icon: '👥',
        description: 'Assess your team structure, roles, and resource needs'
    },
    {
        id: 3,
        title: 'Technology Stack',
        icon: '💻',
        description: 'Evaluate your tools, integrations, and tech effectiveness'
    },
    {
        id: 4,
        title: 'Financial Operations',
        icon: '💰',
        description: 'Review your financial systems and cash flow management'
    },
    {
        id: 5,
        title: 'Operational Efficiency Plan',
        icon: '📋',
        description: 'Create your action plan for operational improvements'
    }
];

// Load Operations Audit data from Supabase
async function loadOperationsAuditFromSupabase() {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return null;
    
    try {
        const { data, error } = await supabaseClient
            .from('business_operations_audit')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (data) {
            operationsAuditState.savedProgress = data;
            operationsAuditState.data = data.section_data || {};
            operationsAuditState.currentSection = data.current_section || 1;
            return data;
        }
        return null;
    } catch (err) {
        console.error('Error loading operations audit from Supabase:', err);
        return null;
    }
}

// Save Operations Audit data to Supabase
async function saveOperationsAuditToSupabase(sectionData, progressPercent, status = 'in_progress', currentSection = null) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const saveData = {
            user_id: userId,
            section_data: { ...operationsAuditState.data, ...sectionData },
            progress_percent: progressPercent,
            status: status,
            current_section: currentSection || operationsAuditState.currentSection,
            updated_at: new Date().toISOString()
        };
        
        // Check if record exists
        const { data: existing } = await supabaseClient
            .from('business_operations_audit')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        let result;
        if (existing) {
            result = await supabaseClient
                .from('business_operations_audit')
                .update(saveData)
                .eq('id', existing.id);
        } else {
            saveData.created_at = new Date().toISOString();
            result = await supabaseClient
                .from('business_operations_audit')
                .insert([saveData]);
        }
        
        if (result.error) throw result.error;
        
        // Update local state
        operationsAuditState.data = saveData.section_data;
        
        return true;
    } catch (err) {
        console.error('Error saving operations audit to Supabase:', err);
        return false;
    }
}

// Main function to show Operations Audit module
async function showOperationsAudit() {
    setActiveNav('business');
    
    // Load saved progress
    operationsAuditState.isLoading = true;
    await loadOperationsAuditFromSupabase();
    operationsAuditState.isLoading = false;
    
    renderOperationsAudit();
}

// Render the Operations Audit module
function renderOperationsAudit() {
    const saved = operationsAuditState.savedProgress;
    const hasProgress = saved && saved.progress_percent > 0;
    const progressPercent = saved?.progress_percent || 0;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">⚙️ Operations Audit</h1>
            <p class="welcome-subtitle">Evaluate your systems, processes, team structure, and operational efficiency.</p>
        </div>
    `;
    
    // Show resume banner if there's saved progress
    if (hasProgress && saved.status !== 'completed') {
        html += `
            <div style="background: rgba(46, 124, 131, 0.2); border: 1px solid rgba(46, 124, 131, 0.4); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 32px;">💾</div>
                    <div>
                        <div style="font-weight: 600; color: var(--ivory-light);">Resume where you left off</div>
                        <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">You're ${progressPercent}% complete • Last saved ${new Date(saved.updated_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="goToOperationsSection(${saved.current_section || 1})">Resume →</button>
            </div>
        `;
    }
    
    // Progress overview
    html += `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="color: rgba(246, 241, 232, 0.7);">Overall Progress</span>
                <span style="color: var(--warm-gold); font-weight: 600;">${progressPercent}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 10px; height: 12px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 10px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    // Section cards
    html += `<div class="workspace-grid" style="margin-bottom: 30px;">`;
    
    operationsSections.forEach(section => {
        const isCompleted = progressPercent >= (section.id * 20);
        const isCurrent = operationsAuditState.currentSection === section.id;
        const sectionData = operationsAuditState.data || {};
        const hasSectionData = sectionData[`section${section.id}`] && Object.keys(sectionData[`section${section.id}`]).length > 0;
        
        html += `
            <div class="workspace-card" style="${isCurrent ? 'border: 2px solid rgba(212, 175, 99, 0.4);' : ''} ${isCompleted ? 'border: 2px solid rgba(76, 175, 80, 0.3);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${isCompleted ? 'rgba(76, 175, 80, 0.3)' : isCurrent ? 'rgba(212, 175, 99, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">${section.icon}</div>
                    <span class="card-status ${isCompleted ? 'status-complete' : hasSectionData ? 'status-progress' : 'status-locked'}">${isCompleted ? 'Complete' : hasSectionData ? 'In Progress' : 'Not Started'}</span>
                </div>
                <h3 class="card-title">${section.id}. ${section.title}</h3>
                <p class="card-description">${section.description}</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="goToOperationsSection(${section.id})">${hasSectionData ? 'Continue →' : 'Start →'}</button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Bottom actions
    html += `
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="showBusinessAssessment()">← Back to Business Audit</button>
            ${saved?.status === 'completed' ? `
                <button class="btn btn-primary" onclick="reviewOperationsResults()">📊 Review Results</button>
                <button class="btn btn-secondary" onclick="resetOperationsAudit()">🔄 Start Over</button>
            ` : ''}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// Navigate to a specific section
function goToOperationsSection(sectionId) {
    operationsAuditState.currentSection = sectionId;
    renderOperationsSection(sectionId);
}

// Render individual section
function renderOperationsSection(sectionId) {
    const section = operationsSections.find(s => s.id === sectionId);
    if (!section) return;
    
    const sectionData = operationsAuditState.data?.[`section${sectionId}`] || {};
    const progressPercent = (sectionId / operationsAuditState.totalSections) * 100;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">${section.icon} ${section.title}</h1>
            <p class="welcome-subtitle">${section.description}</p>
        </div>
        
        <!-- Progress Bar -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="color: rgba(246, 241, 232, 0.7); font-size: 14px;">Section ${sectionId} of ${operationsAuditState.totalSections}</span>
                <span style="color: var(--warm-gold); font-weight: 600; font-size: 14px;">${Math.round(progressPercent)}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 8px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 8px; transition: width 0.3s;"></div>
            </div>
        </div>
        
        <!-- Section Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 30px; overflow-x: auto; padding-bottom: 8px;">
            ${operationsSections.map(s => `
                <button onclick="${s.id === sectionId ? '' : `goToOperationsSection(${s.id})`}" 
                    style="padding: 10px 16px; border-radius: 20px; border: 1px solid ${s.id === sectionId ? 'var(--warm-gold)' : 'rgba(212, 175, 99, 0.2)'}; 
                    background: ${s.id === sectionId ? 'rgba(212, 175, 99, 0.2)' : 'rgba(31, 49, 91, 0.3)'}; 
                    color: ${s.id === sectionId ? 'var(--warm-gold)' : 'rgba(246, 241, 232, 0.7)'}; 
                    cursor: ${s.id === sectionId ? 'default' : 'pointer'}; font-size: 13px; white-space: nowrap;">
                    ${s.id}. ${s.title}
                </button>
            `).join('')}
        </div>
        
        <!-- Section Content -->
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                ${getOperationsSectionContent(sectionId, sectionData)}
            </div>
            
            <!-- Navigation -->
            <div style="display: flex; justify-content: space-between; margin-top: 30px; align-items: center;">
                <button class="btn btn-secondary" onclick="${sectionId > 1 ? `goToOperationsSection(${sectionId - 1})` : 'renderOperationsAudit()'}">
                    ← ${sectionId > 1 ? 'Previous Section' : 'Back to Overview'}
                </button>
                
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="saveOperationsProgressAndExit()">💾 Save & Exit</button>
                    <button class="btn btn-primary" onclick="saveOperationsSectionAndContinue(${sectionId})">
                        ${sectionId === operationsAuditState.totalSections ? '✅ Complete Assessment' : 'Save & Continue →'}
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Auto-save indicator -->
        <div id="operations-autosave-indicator" style="position: fixed; bottom: 20px; right: 20px; background: rgba(46, 124, 131, 0.9); color: white; padding: 10px 16px; border-radius: 8px; font-size: 13px; display: none; align-items: center; gap: 8px; z-index: 100;">
            <span>💾</span> Auto-saved
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get content for each section
function getOperationsSectionContent(sectionId, sectionData) {
    switch (sectionId) {
        case 1:
            return getOperationsSystemsContent(sectionData);
        case 2:
            return getOperationsTeamContent(sectionData);
        case 3:
            return getOperationsTechContent(sectionData);
        case 4:
            return getOperationsFinancialContent(sectionData);
        case 5:
            return getOperationsPlanContent(sectionData);
        default:
            return '';
    }
}

// Section 1: Systems & Processes
function getOperationsSystemsContent(data) {
    const processTypes = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Customer Support', 'Product Delivery'];
    const docQuality = data.documentationQuality || '';
    
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">⚙️ Systems & Processes</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Document your current systems inventory and process documentation status.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Current Systems Inventory
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">List all the systems and platforms you currently use to run your business</span>
            </label>
            <textarea id="ops-systems-inventory" rows="5" placeholder="e.g.,\n• CRM: HubSpot\n• Email: ConvertKit\n• Project Management: Asana\n• Accounting: QuickBooks\n• Communication: Slack" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.systemsInventory || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 12px; font-weight: 500; color: var(--ivory-light);">
                Documented Processes
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Check all areas where you have documented processes</span>
            </label>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                ${processTypes.map(type => `
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(246, 241, 232, 0.03); border-radius: 10px; cursor: pointer;">
                        <input type="checkbox" id="ops-process-${type.toLowerCase().replace(/\s+/g, '-')}" ${data.processes?.includes(type) ? 'checked' : ''} 
                            style="width: 18px; height: 18px; accent-color: var(--sacred-teal);">
                        <span style="color: var(--ivory-light); font-size: 14px;">${type}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Process Documentation Quality
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How would you rate your current process documentation?</span>
            </label>
            <select id="ops-doc-quality" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                <option value="">Select quality level...</option>
                <option value="None" ${docQuality === 'None' ? 'selected' : ''}>None - No documentation exists</option>
                <option value="Ad-hoc" ${docQuality === 'Ad-hoc' ? 'selected' : ''}>Ad-hoc - Some notes scattered around</option>
                <option value="Documented" ${docQuality === 'Documented' ? 'selected' : ''}>Documented - Most processes written down</option>
                <option value="Optimized" ${docQuality === 'Optimized' ? 'selected' : ''}>Optimized - Documented and regularly reviewed</option>
                <option value="Automated" ${docQuality === 'Automated' ? 'selected' : ''}>Automated - Documented with automation where possible</option>
            </select>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Bottlenecks in Current Workflows
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Where do things get stuck or slow down in your business?</span>
            </label>
            <textarea id="ops-bottlenecks" rows="4" placeholder="e.g.,\n• Client onboarding takes 3-4 days because it's all manual\n• Invoicing is delayed because it requires my personal approval\n• Content creation bottleneck - everything goes through me" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.bottlenecks || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Repetitive Manual Tasks
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What tasks do you or your team do repeatedly that could potentially be automated?</span>
            </label>
            <textarea id="ops-manual-tasks" rows="4" placeholder="e.g.,\n• Sending welcome emails to new clients\n• Data entry from forms to CRM\n• Creating weekly reports manually\n• Scheduling social media posts one by one" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.manualTasks || ''}</textarea>
        </div>
    `;
}

// Section 2: Team & Resources
function getOperationsTeamContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">👥 Team & Resources</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Assess your current team structure and identify resource needs.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Team Size
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Total number of people working in your business (including you)</span>
            </label>
            <input type="number" id="ops-team-size" value="${data.teamSize || ''}" placeholder="e.g., 5" min="1"
                style="width: 200px; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Roles and Responsibilities
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">List current team members and their primary responsibilities</span>
            </label>
            <textarea id="ops-roles" rows="5" placeholder="e.g.,\n• Me (Founder): Strategy, sales, content creation\n• Aira (VA): Email management, scheduling, basic admin\n• Contractor (Web Dev): Website maintenance, technical issues" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.roles || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Skill Gaps
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What skills or expertise are you missing on your current team?</span>
            </label>
            <textarea id="ops-skill-gaps" rows="4" placeholder="e.g.,\n• Technical/development skills for automation\n• Graphic design for marketing materials\n• Copywriting for sales pages\n• Bookkeeping/accounting expertise" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.skillGaps || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Outsourcing Needs
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What tasks or functions should you consider outsourcing?</span>
            </label>
            <textarea id="ops-outsourcing" rows="4" placeholder="e.g.,\n• Bookkeeping and accounting\n• Social media management\n• Video editing\n• Customer support tickets" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.outsourcing || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Hiring Priorities
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">If you could hire 2-3 people right now, what roles would they fill?</span>
            </label>
            <textarea id="ops-hiring" rows="4" placeholder="e.g.,\n1. Operations Manager - to handle day-to-day and free me up for strategy\n2. Marketing Assistant - to execute content and campaign plans\n3. Customer Success - to improve retention and reduce churn" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.hiring || ''}</textarea>
        </div>
    `;
}

// Section 3: Technology Stack
function getOperationsTechContent(data) {
    const categories = [
        { key: 'crm', label: 'CRM & Customer Management' },
        { key: 'project', label: 'Project Management' },
        { key: 'communication', label: 'Communication' },
        { key: 'finance', label: 'Finance & Accounting' },
        { key: 'marketing', label: 'Marketing' },
        { key: 'sales', label: 'Sales' }
    ];
    
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">💻 Technology Stack</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Evaluate your current tools and identify gaps in your technology.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Current Tools Inventory
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">List your tools by category</span>
            </label>
            <textarea id="ops-tech-inventory" rows="6" placeholder="e.g.,\nCRM: HubSpot\nProject Management: Asana, Notion\nCommunication: Slack, Zoom\nFinance: QuickBooks, Stripe\nMarketing: ConvertKit, Canva, Later\nSales: Calendly, Proposify" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.techInventory || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 16px; font-weight: 500; color: var(--ivory-light);">
                Tool Effectiveness Rating
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Rate how well your current tools serve each function (1-10)</span>
            </label>
            <div style="display: grid; gap: 16px;">
                ${categories.map(cat => `
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(246, 241, 232, 0.03); border-radius: 12px;">
                        <span style="flex: 1; color: var(--ivory-light); font-size: 14px;">${cat.label}</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="range" id="ops-rating-${cat.key}" min="1" max="10" value="${data.ratings?.[cat.key] || 5}" 
                                oninput="document.getElementById('ops-rating-${cat.key}-value').textContent = this.value"
                                style="width: 150px; accent-color: var(--sacred-teal);">
                            <span id="ops-rating-${cat.key}-value" style="width: 30px; text-align: center; color: var(--warm-gold); font-weight: 600;">${data.ratings?.[cat.key] || 5}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Integration Gaps
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Where do your tools not talk to each other? What manual workarounds do you need?</span>
            </label>
            <textarea id="ops-integration-gaps" rows="4" placeholder="e.g.,\n• CRM doesn't integrate with email marketing - have to export/import lists manually\n• No connection between project management and time tracking\n• Accounting software doesn't sync with payment processor" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.integrationGaps || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Redundant or Unused Tools
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Are you paying for tools you don't use or have duplicates of?</span>
            </label>
            <textarea id="ops-redundant-tools" rows="4" placeholder="e.g.,\n• Paying for both Asana and Trello but only using Asana\n• Adobe Creative Suite subscription but only use Canva\n• Multiple video conferencing tools (Zoom, Teams, Meet)" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.redundantTools || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Technology Wishlist
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What tools or capabilities do you wish you had?</span>
            </label>
            <textarea id="ops-tech-wishlist" rows="4" placeholder="e.g.,\n• Marketing automation that connects all channels\n• Better reporting dashboard across all tools\n• AI-powered customer support chatbot\n• Automated onboarding sequence" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.techWishlist || ''}</textarea>
        </div>
    `;
}

// Section 4: Financial Operations
function getOperationsFinancialContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">💰 Financial Operations</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Review your financial health and reporting processes.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Monthly Recurring Revenue (MRR)
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Your predictable monthly revenue</span>
            </label>
            <input type="number" id="ops-mrr" value="${data.mrr || ''}" placeholder="e.g., 15000" min="0"
                style="width: 200px; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Monthly Operating Expenses
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Total monthly costs to run the business</span>
            </label>
            <input type="number" id="ops-expenses" value="${data.expenses || ''}" placeholder="e.g., 8000" min="0"
                style="width: 200px; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Profit Margin %
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Net profit as percentage of revenue</span>
            </label>
            <input type="number" id="ops-profit-margin" value="${data.profitMargin || ''}" placeholder="e.g., 25" min="0" max="100"
                style="width: 200px; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Cash Flow Management
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How well do you manage cash flow?</span>
            </label>
            <select id="ops-cash-flow" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                <option value="">Select rating...</option>
                <option value="Excellent" ${data.cashFlow === 'Excellent' ? 'selected' : ''}>Excellent - Always have 6+ months runway</option>
                <option value="Good" ${data.cashFlow === 'Good' ? 'selected' : ''}>Good - 3-6 months runway, predictable</option>
                <option value="Adequate" ${data.cashFlow === 'Adequate' ? 'selected' : ''}>Adequate - 1-3 months, some variability</option>
                <option value="Poor" ${data.cashFlow === 'Poor' ? 'selected' : ''}>Poor - Often tight, unpredictable</option>
                <option value="Critical" ${data.cashFlow === 'Critical' ? 'selected' : ''}>Critical - Frequently struggling to pay bills</option>
            </select>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Financial Reporting Frequency
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How often do you review financial reports?</span>
            </label>
            <select id="ops-reporting-freq" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                <option value="">Select frequency...</option>
                <option value="Real-time" ${data.reportingFreq === 'Real-time' ? 'selected' : ''}>Real-time - Dashboard always available</option>
                <option value="Weekly" ${data.reportingFreq === 'Weekly' ? 'selected' : ''}>Weekly</option>
                <option value="Monthly" ${data.reportingFreq === 'Monthly' ? 'selected' : ''}>Monthly</option>
                <option value="Quarterly" ${data.reportingFreq === 'Quarterly' ? 'selected' : ''}>Quarterly</option>
                <option value="Annually" ${data.reportingFreq === 'Annually' ? 'selected' : ''}>Annually</option>
                <option value="Never" ${data.reportingFreq === 'Never' ? 'selected' : ''}>Never - Don't review finances regularly</option>
            </select>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Budget Planning Process
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How do you plan and manage your budget?</span>
            </label>
            <textarea id="ops-budget-process" rows="4" placeholder="e.g.,\n• Annual budget set in December\n• Monthly review of actual vs budgeted expenses\n• Quarterly adjustments based on performance\n• No formal budget - spend as needed" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.budgetProcess || ''}</textarea>
        </div>
    `;
}

// Section 5: Operational Efficiency Plan
function getOperationsPlanContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📋 Operational Efficiency Plan</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Create your action plan for improving operational efficiency.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Top 3 Operational Priorities
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What are the most critical areas to improve?</span>
            </label>
            <textarea id="ops-priorities" rows="5" placeholder="e.g.,\n1. Automate client onboarding to reduce time from 3 days to 1 day\n2. Document all core processes so team can work independently\n3. Implement better project management to reduce missed deadlines" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.priorities || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Quick Wins
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What can you implement in the next 30 days with minimal effort?</span>
            </label>
            <textarea id="ops-quick-wins" rows="4" placeholder="e.g.,\n• Set up email templates for common responses\n• Create a standard onboarding checklist\n• Cancel unused software subscriptions\n• Set up automated invoice reminders" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.quickWins || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Long-term Improvements
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What larger initiatives will you tackle over the next 6-12 months?</span>
            </label>
            <textarea id="ops-long-term" rows="4" placeholder="e.g.,\n• Implement full CRM with automation\n• Hire operations manager\n• Build out full documentation library\n• Migrate to integrated tech stack" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.longTerm || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Resource Requirements
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What budget, tools, or people will you need?</span>
            </label>
            <textarea id="ops-resources" rows="4" placeholder="e.g.,\n• Budget: $5,000 for new tools and training\n• Tools: Project management software, automation platform\n• People: Part-time VA to handle admin tasks\n• Time: 10 hours/week for process documentation" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.resources || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Success Metrics
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How will you measure success?</span>
            </label>
            <textarea id="ops-success-metrics" rows="4" placeholder="e.g.,\n• Reduce manual task time by 50%\n• Cut client onboarding from 3 days to 1 day\n• Increase team productivity by 30%\n• Reduce operational costs by 20%" 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.successMetrics || ''}</textarea>
        </div>
    `;
}

// Collect data from current section
function collectOperationsSectionData(sectionId) {
    const data = {};
    
    switch (sectionId) {
        case 1:
            data.systemsInventory = document.getElementById('ops-systems-inventory')?.value || '';
            const processes = [];
            ['sales', 'marketing', 'operations', 'finance', 'hr', 'customer-support', 'product-delivery'].forEach(type => {
                const cb = document.getElementById(`ops-process-${type}`);
                if (cb?.checked) {
                    processes.push(type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
                }
            });
            data.processes = processes;
            data.documentationQuality = document.getElementById('ops-doc-quality')?.value || '';
            data.bottlenecks = document.getElementById('ops-bottlenecks')?.value || '';
            data.manualTasks = document.getElementById('ops-manual-tasks')?.value || '';
            break;
        case 2:
            data.teamSize = document.getElementById('ops-team-size')?.value || '';
            data.roles = document.getElementById('ops-roles')?.value || '';
            data.skillGaps = document.getElementById('ops-skill-gaps')?.value || '';
            data.outsourcingNeeds = document.getElementById('ops-outsourcing')?.value || '';
            data.hiringPriorities = document.getElementById('ops-hiring')?.value || '';
            break;
        case 3:
            data.techInventory = document.getElementById('ops-tech-inventory')?.value || '';
            data.ratings = {};
            ['crm', 'project', 'communication', 'finance', 'marketing', 'sales'].forEach(key => {
                const slider = document.getElementById(`ops-rating-${key}`);
                if (slider) data.ratings[key] = parseInt(slider.value);
            });
            data.integrationGaps = document.getElementById('ops-integration-gaps')?.value || '';
            data.redundantTools = document.getElementById('ops-redundant-tools')?.value || '';
            data.techWishlist = document.getElementById('ops-tech-wishlist')?.value || '';
            break;
        case 4:
            data.mrr = document.getElementById('ops-mrr')?.value || '';
            data.expenses = document.getElementById('ops-expenses')?.value || '';
            data.profitMargin = document.getElementById('ops-profit-margin')?.value || '';
            data.cashFlow = document.getElementById('ops-cash-flow')?.value || '';
            data.reportingFreq = document.getElementById('ops-reporting-freq')?.value || '';
            data.budgetProcess = document.getElementById('ops-budget-process')?.value || '';
            break;
        case 5:
            data.priorities = document.getElementById('ops-priorities')?.value || '';
            data.quickWins = document.getElementById('ops-quick-wins')?.value || '';
            data.longTerm = document.getElementById('ops-long-term')?.value || '';
            data.resources = document.getElementById('ops-resources')?.value || '';
            data.successMetrics = document.getElementById('ops-success-metrics')?.value || '';
            break;
    }
    
    return data;
}

// Save section and continue
async function saveOperationsSectionAndContinue(sectionId) {
    const sectionData = collectOperationsSectionData(sectionId);
    
    // Merge with existing data
    operationsAuditState.data[`section${sectionId}`] = sectionData;
    
    // Calculate progress
    const completedSections = Object.keys(operationsAuditState.data).filter(k => k.startsWith('section')).length;
    const progressPercent = Math.round((completedSections / operationsAuditState.totalSections) * 100);
    
    // Show auto-save indicator
    const indicator = document.getElementById('operations-autosave-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        setTimeout(() => indicator.style.display = 'none', 2000);
    }
    
    // Save to Supabase
    const isComplete = sectionId === operationsAuditState.totalSections;
    const status = isComplete ? 'completed' : 'in_progress';
    const nextSection = isComplete ? sectionId : sectionId + 1;
    
    const saved = await saveOperationsAuditToSupabase(
        operationsAuditState.data,
        progressPercent,
        status,
        nextSection
    );
    
    if (saved) {
        if (isComplete) {
            alert('🎉 Congratulations! You\'ve completed the Operations Audit!');
            renderOperationsResults();
        } else {
            goToOperationsSection(nextSection);
        }
    } else {
        // Still navigate even if Supabase fails
        if (!isComplete) {
            goToOperationsSection(nextSection);
        }
    }
}

// Save progress and exit
async function saveOperationsProgressAndExit() {
    const sectionId = operationsAuditState.currentSection;
    const sectionData = collectOperationsSectionData(sectionId);
    
    operationsAuditState.data[`section${sectionId}`] = sectionData;
    
    const completedSections = Object.keys(operationsAuditState.data).filter(k => k.startsWith('section')).length;
    const progressPercent = Math.round((completedSections / operationsAuditState.totalSections) * 100);
    
    await saveOperationsAuditToSupabase(
        operationsAuditState.data,
        progressPercent,
        'in_progress',
        sectionId
    );
    
    renderOperationsAudit();
}

// Render results page
function renderOperationsResults() {
    const data = operationsAuditState.data;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Operations Audit Results</h1>
            <p class="welcome-subtitle">Your operational efficiency assessment is complete.</p>
        </div>
        
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 20px;">Summary</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">⚙️</div>
                        <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Systems</div>
                        <div style="font-size: 13px; color: var(--sacred-teal); margin-top: 4px;">${data.section1?.documentationQuality || 'Not rated'}</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">👥</div>
                        <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Team Size</div>
                        <div style="font-size: 13px; color: var(--sacred-teal); margin-top: 4px;">${data.section2?.teamSize || 'N/A'} people</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
                        <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">MRR</div>
                        <div style="font-size: 13px; color: var(--sacred-teal); margin-top: 4px;">$${data.section4?.mrr || 'N/A'}</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">💻</div>
                        <div style="font-size: 14px; color: rgba(246, 241, 232, 0.7);">Tech Stack</div>
                        <div style="font-size: 13px; color: var(--sacred-teal); margin-top: 4px;">Reviewed</div>
                    </div>
                </div>
                
                <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: var(--warm-gold); margin-bottom: 12px;">Top Priorities</h4>
                    <p style="color: rgba(246, 241, 232, 0.8); white-space: pre-line;">${data.section5?.priorities || 'No priorities set'}</p>
                </div>
                
                <div style="background: rgba(46, 124, 131, 0.1); border-radius: 12px; padding: 20px;">
                    <h4 style="color: var(--warm-gold); margin-bottom: 12px;">Quick Wins</h4>
                    <p style="color: rgba(246, 241, 232, 0.8); white-space: pre-line;">${data.section5?.quickWins || 'No quick wins identified'}</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-secondary" onclick="renderOperationsAudit()">← Back to Overview</button>
                <button class="btn btn-primary" onclick="exportOperationsResults()">📥 Export Results</button>
                <button class="btn btn-secondary" onclick="resetOperationsAudit()">🔄 Start New Audit</button>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export results
function exportOperationsResults() {
    const data = operationsAuditState.data;
    
    let exportText = '# Operations Audit Results\n\n';
    exportText += '===========================\n\n';
    
    exportText += '## Section 1: Systems & Processes\n';
    exportText += `Systems Inventory:\n${data.section1?.systemsInventory || 'N/A'}\n\n`;
    exportText += `Documented Processes: ${data.section1?.processes?.join(', ') || 'None'}\n`;
    exportText += `Documentation Quality: ${data.section1?.documentationQuality || 'N/A'}\n\n`;
    exportText += `Bottlenecks:\n${data.section1?.bottlenecks || 'N/A'}\n\n`;
    exportText += `Manual Tasks:\n${data.section1?.manualTasks || 'N/A'}\n\n`;
    
    exportText += '## Section 2: Team & Resources\n';
    exportText += `Team Size: ${data.section2?.teamSize || 'N/A'}\n\n`;
    exportText += `Roles:\n${data.section2?.roles || 'N/A'}\n\n`;
    exportText += `Skill Gaps:\n${data.section2?.skillGaps || 'N/A'}\n\n`;
    exportText += `Outsourcing Needs:\n${data.section2?.outsourcingNeeds || 'N/A'}\n\n`;
    exportText += `Hiring Priorities:\n${data.section2?.hiringPriorities || 'N/A'}\n\n`;
    
    exportText += '## Section 3: Technology Stack\n';
    exportText += `Tools Inventory:\n${data.section3?.techInventory || 'N/A'}\n\n`;
    exportText += `Integration Gaps:\n${data.section3?.integrationGaps || 'N/A'}\n\n`;
    exportText += `Redundant Tools:\n${data.section3?.redundantTools || 'N/A'}\n\n`;
    exportText += `Technology Wishlist:\n${data.section3?.techWishlist || 'N/A'}\n\n`;
    
    exportText += '## Section 4: Financial Operations\n';
    exportText += `Monthly Recurring Revenue: $${data.section4?.mrr || 'N/A'}\n`;
    exportText += `Monthly Expenses: $${data.section4?.expenses || 'N/A'}\n`;
    exportText += `Profit Margin: ${data.section4?.profitMargin || 'N/A'}%\n`;
    exportText += `Cash Flow: ${data.section4?.cashFlow || 'N/A'}\n`;
    exportText += `Reporting Frequency: ${data.section4?.reportingFreq || 'N/A'}\n\n`;
    exportText += `Budget Process:\n${data.section4?.budgetProcess || 'N/A'}\n\n`;
    
    exportText += '## Section 5: Operational Efficiency Plan\n';
    exportText += `Top Priorities:\n${data.section5?.priorities || 'N/A'}\n\n`;
    exportText += `Quick Wins:\n${data.section5?.quickWins || 'N/A'}\n\n`;
    exportText += `Long-term Improvements:\n${data.section5?.longTerm || 'N/A'}\n\n`;
    exportText += `Resource Requirements:\n${data.section5?.resources || 'N/A'}\n\n`;
    exportText += `Success Metrics:\n${data.section5?.successMetrics || 'N/A'}\n\n`;
    
    exportText += '===========================\n';
    exportText += `Generated: ${new Date().toLocaleDateString()}\n`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'operations-audit.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showClientJourney() {
    alert('Client Journey Map - Coming soon!');
}

function showBrandVoice() {
    window.open('https://lifecharter-brand-voice.vercel.app', '_blank');
}

// ============================================
// SALES COMMAND AGENT - PHASE 1 MVP
// ============================================

// Main Sales Command Dashboard
function showSalesCommand() {
    setActiveNav('sales-command');
    
    const hasICP = salesCommandState.icp !== null;
    const leadCount = salesCommandState.leads.length;
    const campaignCount = salesCommandState.campaigns.length;
    const opportunityCount = salesCommandState.opportunities.length;
    const unreadReplies = salesCommandState.inbox.filter(r => !r.read).length;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🎯 Sales Command Agent</h1>
            <p class="welcome-subtitle">AI-powered sales automation for coaches, consultants, and service-based founders.</p>
        </div>

        <!-- Stats Overview -->
        <div class="progress-overview">
            <div class="progress-card">
                <div class="progress-number">${leadCount}</div>
                <div class="progress-label">Total Leads</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${opportunityCount}</div>
                <div class="progress-label">Opportunities</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${campaignCount}</div>
                <div class="progress-label">Campaigns</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${unreadReplies}</div>
                <div class="progress-label">Unread Replies</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div style="display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap;">
            ${!hasICP ? `
                <button class="btn btn-primary" onclick="showICPBuilder()" style="display: flex; align-items: center; gap: 10px;">
                    <span>👤</span>
                    <span>Create Ideal Client Profile</span>
                </button>
            ` : `
                <button class="btn btn-primary" onclick="showLeadDatabase()" style="display: flex; align-items: center; gap: 10px;">
                    <span>👥</span>
                    <span>Add Leads</span>
                </button>
                <button class="btn btn-secondary" onclick="showCampaignBuilder()" style="display: flex; align-items: center; gap: 10px;">
                    <span>📧</span>
                    <span>Create Campaign</span>
                </button>
            `}
            <button class="btn btn-secondary" onclick="showSalesInbox()" style="display: flex; align-items: center; gap: 10px;">
                <span>📨</span>
                <span>Inbox ${unreadReplies > 0 ? `(${unreadReplies})` : ''}</span>
            </button>
            <button class="btn btn-secondary" onclick="showSalesPipeline()" style="display: flex; align-items: center; gap: 10px;">
                <span>📊</span>
                <span>Pipeline</span>
            </button>
        </div>

        <!-- Setup Progress -->
        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">Setup Progress</h2>
        </div>
        
        <div class="workspace-grid" style="margin-bottom: 40px;">
            <div class="workspace-card" style="${hasICP ? 'border: 2px solid var(--sacred-teal);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${hasICP ? 'rgba(46, 124, 131, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">👤</div>
                    <span class="card-status ${hasICP ? 'status-progress' : 'status-locked'}">${hasICP ? 'Complete' : 'Required'}</span>
                </div>
                <h3 class="card-title">1. Ideal Client Profile</h3>
                <p class="card-description">Define who your perfect client is so AI can find and qualify the right leads.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showICPBuilder()">${hasICP ? 'Edit ICP' : 'Create ICP →'}</button>
                </div>
            </div>

            <div class="workspace-card" style="${leadCount > 0 ? 'border: 2px solid var(--sacred-teal);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${leadCount > 0 ? 'rgba(46, 124, 131, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">👥</div>
                    <span class="card-status ${leadCount > 0 ? 'status-progress' : 'status-locked'}">${leadCount > 0 ? `${leadCount} Added` : 'Pending'}</span>
                </div>
                <h3 class="card-title">2. Lead Database</h3>
                <p class="card-description">Upload or import your target prospects. AI will score each lead for fit.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showLeadDatabase()" ${!hasICP ? 'disabled' : ''}>${leadCount > 0 ? 'Add More Leads' : 'Add Leads →'}</button>
                </div>
            </div>

            <div class="workspace-card" style="${campaignCount > 0 ? 'border: 2px solid var(--sacred-teal);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${campaignCount > 0 ? 'rgba(46, 124, 131, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">📧</div>
                    <span class="card-status ${campaignCount > 0 ? 'status-progress' : 'status-locked'}">${campaignCount > 0 ? `${campaignCount} Active` : 'Pending'}</span>
                </div>
                <h3 class="card-title">3. Outreach Campaign</h3>
                <p class="card-description">Create personalized email sequences. AI generates copy, you approve before sending.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="showCampaignBuilder()" ${leadCount === 0 ? 'disabled' : ''}>${campaignCount > 0 ? 'Manage Campaigns' : 'Create Campaign →'}</button>
                </div>
            </div>

            <div class="workspace-card">
                <div class="card-header">
                    <div class="card-icon" style="font-size: 28px;">📊</div>
                    <span class="card-status status-locked">Track</span>
                </div>
                <h3 class="card-title">4. Pipeline & Analytics</h3>
                <p class="card-description">Track opportunities, booked calls, and campaign performance in real-time.</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-secondary" style="width: 100%;" onclick="showSalesPipeline()">View Pipeline →</button>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-header" style="margin-bottom: 20px;">
            <h2 class="section-title">Recent Activity</h2>
        </div>
        
        <div class="activity-section">
            ${salesCommandState.leads.length === 0 && salesCommandState.campaigns.length === 0 ? `
                <div style="text-align: center; padding: 60px 40px; background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px;">
                    <div style="font-size: 64px; margin-bottom: 24px;">🎯</div>
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 12px;">Welcome to Sales Command</h3>
                    <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 30px; max-width: 500px; margin-left: auto; margin-right: auto;">Start by creating your Ideal Client Profile. This helps AI understand who to target and how to qualify leads.</p>
                    <button class="btn btn-primary" onclick="showICPBuilder()">Create Your ICP →</button>
                </div>
            ` : `
                <div style="display: grid; gap: 16px;">
                    ${salesCommandState.leads.slice(0, 5).map(lead => `
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(31, 49, 91, 0.3); border-radius: 12px; border: 1px solid rgba(212, 175, 99, 0.1);">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${getLeadScoreColor(lead.fitScore)}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--deep-indigo);">${lead.fitScore || '?'}</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--ivory-light);">${lead.name}</div>
                                <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">${lead.title} at ${lead.company}</div>
                            </div>
                            <span style="background: rgba(31, 49, 91, 0.5); padding: 4px 12px; border-radius: 20px; font-size: 12px; color: rgba(246, 241, 232, 0.7);">${lead.status || 'New'}</span>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function getLeadScoreColor(score) {
    if (!score) return 'rgba(212, 175, 99, 0.3)';
    if (score >= 80) return 'rgba(76, 175, 80, 0.5)';
    if (score >= 60) return 'rgba(255, 152, 0, 0.5)';
    return 'rgba(244, 67, 54, 0.3)';
}

// ICP Builder
function showICPBuilder() {
    setActiveNav('sales-command');
    
    const icp = salesCommandState.icp || {};
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">👤 Ideal Client Profile Builder</h1>
            <p class="welcome-subtitle">Define your perfect client so AI can find and qualify the right leads.</p>
        </div>

        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">Demographics</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Job Titles</label>
                        <textarea id="icp-titles" rows="3" placeholder="e.g., CEO, Founder, Marketing Director" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.titles || ''}</textarea>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Industries</label>
                        <textarea id="icp-industries" rows="3" placeholder="e.g., SaaS, Consulting, E-commerce" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.industries || ''}</textarea>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Company Size</label>
                        <select id="icp-company-size" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                            <option value="">Select range...</option>
                            <option value="1-10" ${icp.companySize === '1-10' ? 'selected' : ''}>1-10 employees</option>
                            <option value="11-50" ${icp.companySize === '11-50' ? 'selected' : ''}>11-50 employees</option>
                            <option value="51-200" ${icp.companySize === '51-200' ? 'selected' : ''}>51-200 employees</option>
                            <option value="201-500" ${icp.companySize === '201-500' ? 'selected' : ''}>201-500 employees</option>
                            <option value="500+" ${icp.companySize === '500+' ? 'selected' : ''}>500+ employees</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Revenue Range</label>
                        <select id="icp-revenue" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                            <option value="">Select range...</option>
                            <option value="0-1M" ${icp.revenue === '0-1M' ? 'selected' : ''}>$0 - $1M</option>
                            <option value="1M-10M" ${icp.revenue === '1M-10M' ? 'selected' : ''}>$1M - $10M</option>
                            <option value="10M-50M" ${icp.revenue === '10M-50M' ? 'selected' : ''}>$10M - $50M</option>
                            <option value="50M+" ${icp.revenue === '50M+' ? 'selected' : ''}>$50M+</option>
                        </select>
                    </div>
                </div>

                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px; margin-top: 40px;">Psychographics</h3>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Biggest Pain Points</label>
                    <textarea id="icp-pain-points" rows="4" placeholder="What keeps them up at night? What problems do they need solved?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.painPoints || ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Desired Outcomes</label>
                    <textarea id="icp-outcomes" rows="4" placeholder="What does success look like for them? What do they want to achieve?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.outcomes || ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Buying Triggers</label>
                    <textarea id="icp-triggers" rows="3" placeholder="What events or situations cause them to seek solutions?" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.triggers || ''}</textarea>
                </div>

                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px; margin-top: 40px;">Qualification Criteria</h3>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Must-Have Attributes</label>
                    <textarea id="icp-must-haves" rows="3" placeholder="What makes a lead a perfect fit? e.g., Has budget, decision maker, urgent need" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.mustHaves || ''}</textarea>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Red Flags (Deal Breakers)</label>
                    <textarea id="icp-red-flags" rows="3" placeholder="What disqualifies a lead? e.g., No budget, wrong industry, too small" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${icp.redFlags || ''}</textarea>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showSalesCommand()">← Cancel</button>
                <button class="btn btn-primary" onclick="saveICP()">💾 Save Ideal Client Profile</button>
            </div>
        </div>
    `;
}

async function saveICP() {
    const icp = {
        titles: document.getElementById('icp-titles').value,
        industries: document.getElementById('icp-industries').value,
        companySize: document.getElementById('icp-company-size').value,
        revenue: document.getElementById('icp-revenue').value,
        painPoints: document.getElementById('icp-pain-points').value,
        outcomes: document.getElementById('icp-outcomes').value,
        triggers: document.getElementById('icp-triggers').value,
        mustHaves: document.getElementById('icp-must-haves').value,
        redFlags: document.getElementById('icp-red-flags').value,
        createdAt: salesCommandState.icp?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage first (always)
    salesCommandState.icp = icp;
    localStorage.setItem('lccs_icp', JSON.stringify(icp));
    
    // Also save to Supabase if available
    if (supabaseClient) {
        try {
            const saved = await saveICPToSupabase(icp);
            if (saved) {
                console.log('ICP saved to Supabase');
            } else {
                console.warn('Failed to save ICP to Supabase, but localStorage is up to date');
            }
        } catch (err) {
            console.error('Error saving ICP to Supabase:', err);
        }
    }
    
    alert('✅ Ideal Client Profile saved! You can now add leads.');
    showSalesCommand();
}

// ============================================
// LEAD DATABASE - FULL IMPLEMENTATION
// ============================================

// ============================================
// LEAD DATABASE - SIMPLIFIED
// ============================================

function showLeadDatabase() {
    setActiveNav('sales-command');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">👥 Lead Database</h1>
            <p class="welcome-subtitle">Manage your sales leads.</p>
        </div>
        
        <div style="text-align: center; padding: 60px;">
            <button class="btn btn-primary" onclick="addNewLead()">Add New Lead</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showSalesCommand()">← Back to Sales Command</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function addNewLead() {
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">➕ Add New Lead</h1>
        </div>
        
        <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
            <div style="margin-bottom: 20px;">
                <label>First Name</label>
                <input type="text" id="lead-firstname" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(212, 175, 99, 0.3); background: rgba(246, 241, 232, 0.05); color: var(--ivory-light);">
            </div>
            <div style="margin-bottom: 20px;">
                <label>Last Name</label>
                <input type="text" id="lead-lastname" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(212, 175, 99, 0.3); background: rgba(246, 241, 232, 0.05); color: var(--ivory-light);">
            </div>
            <div style="margin-bottom: 20px;">
                <label>Email</label>
                <input type="email" id="lead-email" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(212, 175, 99, 0.3); background: rgba(246, 241, 232, 0.05); color: var(--ivory-light);">
            </div>
            <button class="btn btn-primary" onclick="saveLead()">Save Lead</button>
            <button class="btn btn-secondary" onclick="showLeadDatabase()">Cancel</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function saveLead() {
    const firstName = document.getElementById('lead-firstname').value;
    const lastName = document.getElementById('lead-lastname').value;
    const email = document.getElementById('lead-email').value;
    
    if (!firstName || !lastName) {
        alert('Please enter first and last name');
        return;
    }
    
    const lead = {
        id: 'lead_' + Date.now(),
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
    };
    
    // Save to state
    if (!salesCommandState.leads) salesCommandState.leads = [];
    salesCommandState.leads.push(lead);
    localStorage.setItem('lccs_leads', JSON.stringify(salesCommandState.leads));
    
    alert('Lead saved!');
    showLeadDatabase();
}

// ============================================
// CAMPAIGN BUILDER - SIMPLIFIED
// ============================================

function showCampaignBuilder() {
    setActiveNav('sales-command');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📧 Campaign Builder</h1>
            <p class="welcome-subtitle">Create email campaigns.</p>
        </div>
        
        <div style="text-align: center; padding: 60px;">
            <button class="btn btn-primary" onclick="createNewCampaign()">Create New Campaign</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showSalesCommand()">← Back to Sales Command</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function createNewCampaign() {
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📧 New Campaign</h1>
        </div>
        
        <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
            <div style="margin-bottom: 20px;">
                <label>Campaign Name</label>
                <input type="text" id="campaign-name" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(212, 175, 99, 0.3); background: rgba(246, 241, 232, 0.05); color: var(--ivory-light);">
            </div>
            <button class="btn btn-primary" onclick="saveCampaign()">Save Campaign</button>
            <button class="btn btn-secondary" onclick="showCampaignBuilder()">Cancel</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function saveCampaign() {
    const name = document.getElementById('campaign-name').value;
    
    if (!name) {
        alert('Please enter a campaign name');
        return;
    }
    
    const campaign = {
        id: 'camp_' + Date.now(),
        name,
        status: 'Draft',
        createdAt: new Date().toISOString()
    };
    
    // Save to state
    if (!salesCommandState.campaigns) salesCommandState.campaigns = [];
    salesCommandState.campaigns.push(campaign);
    localStorage.setItem('lccs_campaigns', JSON.stringify(salesCommandState.campaigns));
    
    alert('Campaign saved!');
    showCampaignBuilder();
}

function showSalesInbox() {
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📨 Sales Inbox</h1>
            <p class="welcome-subtitle">Manage replies and track conversations with prospects.</p>
        </div>
        <div style="text-align: center; padding: 60px;">
            <div style="font-size: 64px; margin-bottom: 24px;">📨</div>
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--warm-gold); margin-bottom: 12px;">Sales Inbox</h3>
            <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 30px;">Coming soon: Reply management, conversation tracking, and opportunity creation.</p>
            <button class="btn btn-secondary" onclick="showSalesCommand()">← Back</button>
        </div>
    `;
}

// SALES PIPELINE
// ============================================

// Pipeline State
const pipelineState = {
    draggedOpportunity: null,
    filter: 'all'
};

// Pipeline Stages Configuration
const PIPELINE_STAGES = [
    { id: 'new', name: 'New Lead', color: '#2E7C83' },
    { id: 'contacted', name: 'Contacted', color: '#D4AF63' },
    { id: 'qualified', name: 'Qualified', color: '#CDBED6' },
    { id: 'proposal', name: 'Proposal Sent', color: '#5E3B6C' },
    { id: 'closed', name: 'Closed Won/Lost', color: '#4CAF50' }
];

// Main Pipeline View
function showSalesPipeline() {
    setActiveNav('sales-command');
    renderPipeline();
}

function renderPipeline() {
    const opportunities = getFilteredOpportunities();
    const stats = calculatePipelineStats();
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Sales Pipeline</h1>
            <p class="welcome-subtitle">Track opportunities from first contact to closed deal.</p>
        </div>

        <!-- Pipeline Analytics -->
        <div class="progress-overview" style="margin-bottom: 30px;">
            <div class="progress-card">
                <div class="progress-number">$${formatCurrency(stats.totalValue)}</div>
                <div class="progress-label">Pipeline Value</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.totalDeals}</div>
                <div class="progress-label">Total Deals</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">${stats.winRate}%</div>
                <div class="progress-label">Win Rate</div>
            </div>
            <div class="progress-card">
                <div class="progress-number">$${formatCurrency(stats.avgDealSize)}</div>
                <div class="progress-label">Avg Deal Size</div>
            </div>
        </div>

        <!-- Action Bar -->
        <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
            <button class="btn btn-primary" onclick="showCreateOpportunityForm()" style="display: flex; align-items: center; gap: 10px;">
                <span>➕</span>
                <span>Add Opportunity</span>
            </button>
            <div style="flex: 1;"></div>
            <select onchange="filterPipeline(this.value)" style="padding: 12px 16px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px;">
                <option value="all">All Opportunities</option>
                <option value="high">High Value ($10k+)</option>
                <option value="medium">Medium Value ($1k-$10k)</option>
                <option value="low">Low Value (&lt;$1k)</option>
            </select>
        </div>

        <!-- Kanban Board -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; overflow-x: auto; padding-bottom: 20px;">
            ${PIPELINE_STAGES.map(stage => renderPipelineColumn(stage, opportunities)).join('')}
        </div>

        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showSalesCommand()">← Back to Sales Command</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

function renderPipelineColumn(stage, opportunities) {
    const stageOpps = opportunities.filter(o => o.stage === stage.id);
    const stageValue = stageOpps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0);
    
    return `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; min-width: 240px;">
            <!-- Column Header -->
            <div style="padding: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.15); display: flex; align-items: center; gap: 10px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${stage.color};"></div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--ivory-light);">${stage.name}</div>
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5);">${stageOpps.length} deals · $${formatCurrency(stageValue)}</div>
                </div>
            </div>
            
            <!-- Column Content -->
            <div style="padding: 12px; min-height: 200px;"
                ondragover="event.preventDefault(); this.style.background='rgba(212, 175, 99, 0.1)';"
                ondragleave="this.style.background='transparent';"
                ondrop="handlePipelineDrop(event, '${stage.id}')">
                ${stageOpps.map(opp => renderOpportunityCard(opp)).join('')}
                ${stageOpps.length === 0 ? `<div style="text-align: center; padding: 40px 20px; color: rgba(246, 241, 232, 0.3); font-size: 13px;">Drop opportunities here</div>` : ''}
            </div>
        </div>
    `;
}

function renderOpportunityCard(opp) {
    const lead = salesCommandState.leads.find(l => l.id === opp.leadId);
    if (!lead) return '';
    
    const probabilityColor = opp.probability >= 70 ? '#4CAF50' : opp.probability >= 40 ? '#FFC107' : '#F44336';
    const daysSinceActivity = Math.floor((Date.now() - new Date(opp.lastActivity)) / (1000 * 60 * 60 * 24));
    
    return `
        <div draggable="true" ondragstart="handlePipelineDrag(event, '${opp.id}')"
            style="background: rgba(31, 49, 91, 0.5); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: grab; transition: all 0.2s;"
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';"
            onmouseout="this.style.transform=''; this.style.boxShadow='';"
            onclick="viewOpportunityDetail('${opp.id}')">
            
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${getLeadAvatarColor(lead.firstName)}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--deep-indigo); font-size: 12px;">
                    ${getLeadInitials(lead)}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; color: var(--ivory-light); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.firstName} ${lead.lastName}</div>
                    <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.company || 'No company'}</div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-size: 18px; font-weight: 600; color: var(--warm-gold);">$${formatCurrency(opp.value)}</div>
                <div style="background: ${probabilityColor}20; color: ${probabilityColor}; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${opp.probability}%</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(246, 241, 232, 0.5);">
                <span>${opp.activities?.length || 0} activities</span>
                <span>${daysSinceActivity === 0 ? 'Today' : daysSinceActivity + 'd ago'}</span>
            </div>
        </div>
    `;
}

function handlePipelineDrag(event, opportunityId) {
    pipelineState.draggedOpportunity = opportunityId;
    event.dataTransfer.effectAllowed = 'move';
}

function handlePipelineDrop(event, stageId) {
    event.preventDefault();
    event.currentTarget.style.background = 'transparent';
    
    const oppId = pipelineState.draggedOpportunity;
    if (!oppId) return;
    
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    const oldStage = opp.stage;
    opp.stage = stageId;
    opp.lastActivity = new Date().toISOString();
    
    if (!opp.activities) opp.activities = [];
    opp.activities.push({
        type: 'stage_change',
        message: `Moved from "${getStageName(oldStage)}" to "${getStageName(stageId)}"`,
        timestamp: new Date().toISOString()
    });
    
    saveOpportunitiesToStorage();
    renderPipeline();
}

function getStageName(stageId) {
    const stage = PIPELINE_STAGES.find(s => s.id === stageId);
    return stage ? stage.name : stageId;
}

function showCreateOpportunityForm(oppId = null) {
    const opp = oppId ? salesCommandState.opportunities.find(o => o.id === oppId) : null;
    const isEdit = !!opp;
    
    // Get leads that don't have opportunities yet (for new opp)
    const availableLeads = salesCommandState.leads.filter(l => 
        isEdit || !salesCommandState.opportunities.some(o => o.leadId === l.id && o.stage !== 'closed')
    );
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">${isEdit ? '✏️ Edit Opportunity' : '➕ Add Opportunity'}</h1>
            <p class="welcome-subtitle">${isEdit ? 'Update opportunity details.' : 'Create a new sales opportunity.'}</p>
        </div>

        <div style="max-width: 600px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                
                ${!isEdit ? `
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Select Lead *</label>
                    <select id="opp-lead" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                        <option value="">Choose a lead...</option>
                        ${availableLeads.map(l => `<option value="${l.id}">${l.firstName} ${l.lastName} - ${l.company || 'No company'}</option>`).join('')}
                    </select>
                </div>
                ` : `<input type="hidden" id="opp-lead" value="${opp.leadId}">`}
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Deal Value ($) *</label>
                        <input type="number" id="opp-value" value="${opp?.value || ''}" placeholder="5000"
                            style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Probability (%)</label>
                        <input type="number" id="opp-probability" value="${opp?.probability || '50'}" min="0" max="100"
                            style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Stage</label>
                        <select id="opp-stage" style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                            ${PIPELINE_STAGES.map(s => `<option value="${s.id}" ${opp?.stage === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Expected Close Date</label>
                        <input type="date" id="opp-close-date" value="${opp?.expectedCloseDate || ''}"
                            style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
                    </div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--ivory-light);">Notes</label>
                    <textarea id="opp-notes" rows="4" placeholder="Add notes about this opportunity..." style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${opp?.notes || ''}</textarea>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button class="btn btn-secondary" onclick="showSalesPipeline()">← Cancel</button>
                <button class="btn btn-primary" onclick="${isEdit ? `saveOpportunityEdit('${opp.id}')` : 'saveNewOpportunity()'}">${isEdit ? '💾 Save Changes' : '➕ Add Opportunity'}</button>
            </div>
        </div>
    `;
}

function saveNewOpportunity() {
    const leadId = document.getElementById('opp-lead').value;
    const value = parseFloat(document.getElementById('opp-value').value) || 0;
    const probability = parseInt(document.getElementById('opp-probability').value) || 50;
    const stage = document.getElementById('opp-stage').value;
    const expectedCloseDate = document.getElementById('opp-close-date').value;
    const notes = document.getElementById('opp-notes').value.trim();
    
    if (!leadId) {
        alert('Please select a lead');
        return;
    }
    
    if (value <= 0) {
        alert('Please enter a deal value');
        return;
    }
    
    const opp = {
        id: 'opp_' + Date.now(),
        leadId: leadId,
        value: value,
        probability: probability,
        stage: stage,
        expectedCloseDate: expectedCloseDate,
        notes: notes,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        activities: [{
            type: 'created',
            message: 'Opportunity created',
            timestamp: new Date().toISOString()
        }]
    };
    
    salesCommandState.opportunities.push(opp);
    saveOpportunitiesToStorage();
    
    alert('✅ Opportunity added successfully!');
    showSalesPipeline();
}

function saveOpportunityEdit(oppId) {
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    const oldStage = opp.stage;
    
    opp.value = parseFloat(document.getElementById('opp-value').value) || 0;
    opp.probability = parseInt(document.getElementById('opp-probability').value) || 50;
    opp.stage = document.getElementById('opp-stage').value;
    opp.expectedCloseDate = document.getElementById('opp-close-date').value;
    opp.notes = document.getElementById('opp-notes').value.trim();
    opp.lastActivity = new Date().toISOString();
    
    if (!opp.activities) opp.activities = [];
    
    if (oldStage !== opp.stage) {
        opp.activities.push({
            type: 'stage_change',
            message: `Stage changed from "${getStageName(oldStage)}" to "${getStageName(opp.stage)}"`,
            timestamp: new Date().toISOString()
        });
    }
    
    opp.activities.push({
        type: 'updated',
        message: 'Opportunity updated',
        timestamp: new Date().toISOString()
    });
    
    saveOpportunitiesToStorage();
    alert('✅ Opportunity updated!');
    showSalesPipeline();
}

function viewOpportunityDetail(oppId) {
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    const lead = salesCommandState.leads.find(l => l.id === opp.leadId);
    if (!lead) return;
    
    const stage = PIPELINE_STAGES.find(s => s.id === opp.stage);
    const campaign = salesCommandState.campaigns.find(c => c.targetLeads.includes(lead.id));
    
    document.getElementById('main-content').innerHTML = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Opportunity Details</h1>
            <p class="welcome-subtitle">${lead.firstName} ${lead.lastName} - ${lead.company || 'No company'}</p>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
            <!-- Main Content -->
            <div>
                <!-- Deal Info Card -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                        <div>
                            <div style="font-size: 14px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">Deal Value</div>
                            <div style="font-size: 36px; font-weight: 600; color: var(--warm-gold);">$${formatCurrency(opp.value)}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 14px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">Probability</div>
                            <div style="font-size: 24px; font-weight: 600; color: ${opp.probability >= 70 ? '#4CAF50' : opp.probability >= 40 ? '#FFC107' : '#F44336'};">${opp.probability}%</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 99, 0.15);">
                        <div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Current Stage</div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 10px; height: 10px; border-radius: 50%; background: ${stage?.color || '#8F8875'};"></div>
                                <span style="color: var(--ivory-light);">${stage?.name || opp.stage}</span>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 4px;">Expected Close</div>
                            <div style="color: var(--ivory-light);">${opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString() : 'Not set'}</div>
                        </div>
                    </div>
                </div>

                <!-- Activity History -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 20px;">📋 Activity History</h3>
                    
                    ${!opp.activities || opp.activities.length === 0 ? `
                        <p style="color: rgba(246, 241, 232, 0.5);">No activities recorded yet.</p>
                    ` : `
                        <div style="display: grid; gap: 16px;">
                            ${opp.activities.slice().reverse().map(activity => `
                                <div style="display: flex; gap: 16px; padding: 16px; background: rgba(246, 241, 232, 0.03); border-radius: 12px; border-left: 3px solid var(--sacred-teal);">
                                    <div style="font-size: 20px;">${getActivityIcon(activity.type)}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 500; color: var(--ivory-light);">${activity.message}</div>
                                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-top: 4px;">${formatDate(activity.timestamp)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                    
                    <div style="margin-top: 20px;">
                        <button class="btn btn-secondary" onclick="addOpportunityActivity('${opp.id}')">➕ Add Activity</button>
                    </div>
                </div>

                <!-- Notes -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 20px;">📝 Notes</h3>
                    <textarea id="opp-detail-notes" rows="4" placeholder="Add notes..." style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical; margin-bottom: 16px;">${opp.notes || ''}</textarea>
                    <button class="btn btn-primary" onclick="saveOpportunityNotes('${opp.id}')">💾 Save Notes</button>
                </div>
            </div>

            <!-- Sidebar -->
            <div>
                <!-- Lead Info -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 20px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 16px;">Lead Information</h4>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: ${getLeadAvatarColor(lead.firstName)}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--deep-indigo); font-size: 16px;">
                            ${getLeadInitials(lead)}
                        </div>
                        <div>
                            <div style="font-weight: 500; color: var(--ivory-light);">${lead.firstName} ${lead.lastName}</div>
                            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">${lead.title || 'No title'}</div>
                        </div>
                    </div>
                    
                    ${lead.email ? `<div style="margin-bottom: 8px; font-size: 13px;"><a href="mailto:${lead.email}" style="color: var(--sacred-teal);">${lead.email}</a></div>` : ''}
                    ${lead.phone ? `<div style="margin-bottom: 8px; font-size: 13px;"><a href="tel:${lead.phone}" style="color: var(--sacred-teal);">${lead.phone}</a></div>` : ''}
                    ${lead.linkedin ? `<div style="font-size: 13px;"><a href="${lead.linkedin}" target="_blank" style="color: var(--sacred-teal);">LinkedIn Profile</a></div>` : ''}
                </div>

                <!-- Campaign Info -->
                ${campaign ? `
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px; margin-bottom: 20px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 16px;">📧 Campaign</h4>
                    <div style="font-weight: 500; color: var(--ivory-light); margin-bottom: 4px;">${campaign.name}</div>
                    <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">Status: ${campaign.status}</div>
                </div>
                ` : ''}

                <!-- Quick Actions -->
                <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 24px;">
                    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 16px;">Quick Actions</h4>
                    <div style="display: grid; gap: 10px;">
                        <button class="btn btn-secondary" onclick="moveOpportunityStage('${opp.id}', 'next')" style="font-size: 14px;">→ Move to Next Stage</button>
                        <button class="btn btn-secondary" onclick="moveOpportunityStage('${opp.id}', 'won')" style="font-size: 14px;">✅ Mark as Won</button>
                        <button class="btn btn-secondary" onclick="moveOpportunityStage('${opp.id}', 'lost')" style="font-size: 14px;">❌ Mark as Lost</button>
                        <button class="btn btn-secondary" onclick="deleteOpportunity('${opp.id}')" style="font-size: 14px; color: #F44336;">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: 30px; display: flex; gap: 12px;">
            <button class="btn btn-secondary" onclick="showSalesPipeline()">← Back to Pipeline</button>
            <button class="btn btn-primary" onclick="showCreateOpportunityForm('${opp.id}')">✏️ Edit Opportunity</button>
        </div>
    `;
}

function addOpportunityActivity(oppId) {
    const message = prompt('Enter activity description:');
    if (!message) return;
    
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    if (!opp.activities) opp.activities = [];
    opp.activities.push({
        type: 'note',
        message: message,
        timestamp: new Date().toISOString()
    });
    
    opp.lastActivity = new Date().toISOString();
    saveOpportunitiesToStorage();
    viewOpportunityDetail(oppId);
}

function saveOpportunityNotes(oppId) {
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    opp.notes = document.getElementById('opp-detail-notes').value;
    opp.lastActivity = new Date().toISOString();
    
    if (!opp.activities) opp.activities = [];
    opp.activities.push({
        type: 'note',
        message: 'Notes updated',
        timestamp: new Date().toISOString()
    });
    
    saveOpportunitiesToStorage();
    alert('✅ Notes saved!');
}

function moveOpportunityStage(oppId, direction) {
    const opp = salesCommandState.opportunities.find(o => o.id === oppId);
    if (!opp) return;
    
    const stageOrder = ['new', 'contacted', 'qualified', 'proposal', 'closed'];
    const currentIndex = stageOrder.indexOf(opp.stage);
    
    let newStage;
    if (direction === 'next' && currentIndex < stageOrder.length - 1) {
        newStage = stageOrder[currentIndex + 1];
    } else if (direction === 'won') {
        newStage = 'closed';
        opp.probability = 100;
    } else if (direction === 'lost') {
        newStage = 'closed';
        opp.probability = 0;
    } else {
        return;
    }
    
    const oldStage = opp.stage;
    opp.stage = newStage;
    opp.lastActivity = new Date().toISOString();
    
    if (!opp.activities) opp.activities = [];
    opp.activities.push({
        type: 'stage_change',
        message: direction === 'won' ? 'Deal marked as WON' : direction === 'lost' ? 'Deal marked as LOST' : `Moved from "${getStageName(oldStage)}" to "${getStageName(newStage)}"`,
        timestamp: new Date().toISOString()
    });
    
    saveOpportunitiesToStorage();
    viewOpportunityDetail(oppId);
}

function deleteOpportunity(oppId) {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    
    salesCommandState.opportunities = salesCommandState.opportunities.filter(o => o.id !== oppId);
    saveOpportunitiesToStorage();
    showSalesPipeline();
}

function getFilteredOpportunities() {
    let opps = salesCommandState.opportunities;
    
    if (pipelineState.filter === 'high') {
        opps = opps.filter(o => o.value >= 10000);
    } else if (pipelineState.filter === 'medium') {
        opps = opps.filter(o => o.value >= 1000 && o.value < 10000);
    } else if (pipelineState.filter === 'low') {
        opps = opps.filter(o => o.value < 1000);
    }
    
    return opps.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
}

function filterPipeline(filter) {
    pipelineState.filter = filter;
    renderPipeline();
}

function calculatePipelineStats() {
    const opps = salesCommandState.opportunities;
    const totalValue = opps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0);
    const totalDeals = opps.length;
    
    const closedOpps = opps.filter(o => o.stage === 'closed');
    const wonOpps = closedOpps.filter(o => o.probability === 100);
    const winRate = closedOpps.length > 0 ? Math.round((wonOpps.length / closedOpps.length) * 100) : 0;
    
    const avgDealSize = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
    
    return {
        totalValue,
        totalDeals,
        winRate,
        avgDealSize
    };
}

function saveOpportunitiesToStorage() {
    localStorage.setItem('lccs_opportunities', JSON.stringify(salesCommandState.opportunities));
}

function formatCurrency(value) {
    if (!value || isNaN(value)) return '0';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toString();
}

// ============================================
// GROWTH STRATEGY AUDIT MODULE - FULL IMPLEMENTATION
// ============================================

// Growth Strategy State
let growthStrategyState = {
    currentSection: 1,
    totalSections: 5,
    data: {},
    savedProgress: null,
    isLoading: false
};

// Section configurations
const gsSections = [
    {
        id: 1,
        title: 'Current Growth Analysis',
        icon: '📊',
        description: 'Document your current revenue, growth rate, and key metrics'
    },
    {
        id: 2,
        title: 'Growth Channel Assessment',
        icon: '📢',
        description: 'Rate your marketing channels and identify top performers'
    },
    {
        id: 3,
        title: 'Scaling Opportunities',
        icon: '🚀',
        description: 'Explore untapped channels, markets, and expansion ideas'
    },
    {
        id: 4,
        title: 'Growth Constraints',
        icon: '🔧',
        description: 'Identify bottlenecks, limitations, and challenges'
    },
    {
        id: 5,
        title: 'Growth Plan',
        icon: '📋',
        description: 'Define your 90-day goals, metrics, and action items'
    }
];

// Growth channel options
const growthChannels = [
    { id: 'organic', label: 'Organic/SEO', icon: '🔍' },
    { id: 'paid', label: 'Paid Ads', icon: '💰' },
    { id: 'referrals', label: 'Referrals', icon: '👥' },
    { id: 'partnerships', label: 'Partnerships', icon: '🤝' },
    { id: 'content', label: 'Content Marketing', icon: '📝' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'email', label: 'Email Marketing', icon: '📧' },
    { id: 'events', label: 'Events/Webinars', icon: '🎤' }
];

// Load Growth Strategy data from Supabase
async function loadGrowthStrategyFromSupabase() {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return null;
    
    try {
        const { data, error } = await supabaseClient
            .from('business_growth_strategy')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        if (data) {
            growthStrategyState.savedProgress = data;
            growthStrategyState.data = data.section_data || {};
            growthStrategyState.currentSection = data.current_section || 1;
            return data;
        }
        return null;
    } catch (err) {
        console.error('Error loading growth strategy from Supabase:', err);
        return null;
    }
}

// Save Growth Strategy data to Supabase
async function saveGrowthStrategyToSupabase(sectionData, progressPercent, status = 'in_progress', currentSection = null) {
    const userId = getCurrentUserId();
    if (!userId || !supabaseClient) return false;
    
    try {
        const saveData = {
            user_id: userId,
            section_data: { ...growthStrategyState.data, ...sectionData },
            progress_percent: progressPercent,
            status: status,
            current_section: currentSection || growthStrategyState.currentSection,
            updated_at: new Date().toISOString()
        };
        
        // Check if record exists
        const { data: existing } = await supabaseClient
            .from('business_growth_strategy')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        let result;
        if (existing) {
            result = await supabaseClient
                .from('business_growth_strategy')
                .update(saveData)
                .eq('id', existing.id);
        } else {
            saveData.created_at = new Date().toISOString();
            result = await supabaseClient
                .from('business_growth_strategy')
                .insert([saveData]);
        }
        
        if (result.error) throw result.error;
        
        // Update local state
        growthStrategyState.data = saveData.section_data;
        
        return true;
    } catch (err) {
        console.error('Error saving growth strategy to Supabase:', err);
        return false;
    }
}

// Main function to show Growth Strategy Audit
async function showGrowthStrategyAudit() {
    setActiveNav('business');
    
    // Load saved progress
    growthStrategyState.isLoading = true;
    await loadGrowthStrategyFromSupabase();
    growthStrategyState.isLoading = false;
    
    renderGrowthStrategy();
}

// Render the Growth Strategy overview
function renderGrowthStrategy() {
    const saved = growthStrategyState.savedProgress;
    const hasProgress = saved && saved.progress_percent > 0;
    const progressPercent = saved?.progress_percent || 0;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📈 Growth Strategy Audit</h1>
            <p class="welcome-subtitle">Analyze your current growth channels, conversion rates, and scaling opportunities.</p>
        </div>
    `;
    
    // Show resume banner if there's saved progress
    if (hasProgress && saved.status !== 'completed') {
        html += `
            <div style="background: rgba(46, 124, 131, 0.2); border: 1px solid rgba(46, 124, 131, 0.4); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 32px;">💾</div>
                    <div>
                        <div style="font-weight: 600; color: var(--ivory-light);">Resume where you left off</div>
                        <div style="font-size: 13px; color: rgba(246, 241, 232, 0.6);">You're ${progressPercent}% complete • Last saved ${new Date(saved.updated_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="goToGSSection(${saved.current_section || 1})">Resume →</button>
            </div>
        `;
    }
    
    // Progress overview
    html += `
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="color: rgba(246, 241, 232, 0.7);">Overall Progress</span>
                <span style="color: var(--warm-gold); font-weight: 600;">${progressPercent}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 10px; height: 12px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 10px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    // Section cards
    html += `<div class="workspace-grid" style="margin-bottom: 30px;">`;
    
    gsSections.forEach(section => {
        const isCompleted = progressPercent >= (section.id * 20);
        const isCurrent = growthStrategyState.currentSection === section.id;
        const sectionData = growthStrategyState.data || {};
        const hasSectionData = sectionData[`section${section.id}`] && Object.keys(sectionData[`section${section.id}`]).length > 0;
        
        html += `
            <div class="workspace-card" style="${isCurrent ? 'border: 2px solid rgba(212, 175, 99, 0.4);' : ''} ${isCompleted ? 'border: 2px solid rgba(76, 175, 80, 0.3);' : ''}">
                <div class="card-header">
                    <div class="card-icon" style="background: ${isCompleted ? 'rgba(76, 175, 80, 0.3)' : isCurrent ? 'rgba(212, 175, 99, 0.3)' : 'rgba(31, 49, 91, 0.5)'}; font-size: 28px;">${section.icon}</div>
                    <span class="card-status ${isCompleted ? 'status-complete' : hasSectionData ? 'status-progress' : 'status-locked'}">${isCompleted ? 'Complete' : hasSectionData ? 'In Progress' : 'Not Started'}</span>
                </div>
                <h3 class="card-title">${section.id}. ${section.title}</h3>
                <p class="card-description">${section.description}</p>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="goToGSSection(${section.id})">${hasSectionData ? 'Continue →' : 'Start →'}</button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Bottom actions
    html += `
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="showBusinessAssessment()">← Back to Business Audit</button>
            ${saved?.status === 'completed' ? `
                <button class="btn btn-primary" onclick="reviewGSResults()">📊 Review Results</button>
                <button class="btn btn-secondary" onclick="resetGrowthStrategy()">🔄 Start Over</button>
            ` : ''}
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
}

// Navigate to a specific section
function goToGSSection(sectionId) {
    growthStrategyState.currentSection = sectionId;
    renderGSSection(sectionId);
}

// Render individual section
function renderGSSection(sectionId) {
    const section = gsSections.find(s => s.id === sectionId);
    if (!section) return;
    
    const sectionData = growthStrategyState.data?.[`section${sectionId}`] || {};
    const progressPercent = (sectionId / growthStrategyState.totalSections) * 100;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">${section.icon} ${section.title}</h1>
            <p class="welcome-subtitle">${section.description}</p>
        </div>
        
        <!-- Progress Bar -->
        <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 20px 24px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="color: rgba(246, 241, 232, 0.7); font-size: 14px;">Section ${sectionId} of ${growthStrategyState.totalSections}</span>
                <span style="color: var(--warm-gold); font-weight: 600; font-size: 14px;">${Math.round(progressPercent)}%</span>
            </div>
            <div style="background: rgba(31, 49, 91, 0.5); border-radius: 8px; height: 8px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--sacred-teal), var(--warm-gold)); height: 100%; width: ${progressPercent}%; border-radius: 8px; transition: width 0.3s;"></div>
            </div>
        </div>
        
        <!-- Section Content -->
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px;">
                ${getGSSectionContent(sectionId, sectionData)}
            </div>
            
            <!-- Navigation -->
            <div style="display: flex; justify-content: space-between; margin-top: 30px; align-items: center;">
                <button class="btn btn-secondary" onclick="${sectionId > 1 ? `goToGSSection(${sectionId - 1})` : 'renderGrowthStrategy()'}">
                    ← ${sectionId > 1 ? 'Previous Section' : 'Back to Overview'}
                </button>
                
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="saveGSProgressAndExit()">💾 Save & Exit</button>
                    <button class="btn btn-primary" onclick="saveGSSectionAndContinue(${sectionId})">
                        ${sectionId === growthStrategyState.totalSections ? '✅ Complete Assessment' : 'Save & Continue →'}
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Auto-save indicator -->
        <div id="gs-autosave-indicator" style="position: fixed; bottom: 20px; right: 20px; background: rgba(46, 124, 131, 0.9); color: white; padding: 10px 16px; border-radius: 8px; font-size: 13px; display: none; align-items: center; gap: 8px; z-index: 100;">
            <span>💾</span> Auto-saved
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get content for each section
function getGSSectionContent(sectionId, sectionData) {
    switch (sectionId) {
        case 1:
            return getGSCurrentGrowthContent(sectionData);
        case 2:
            return getGSChannelAssessmentContent(sectionData);
        case 3:
            return getGSScalingOpportunitiesContent(sectionData);
        case 4:
            return getGSConstraintsContent(sectionData);
        case 5:
            return getGSGrowthPlanContent(sectionData);
        default:
            return '';
    }
}

// Section 1: Current Growth Analysis
function getGSCurrentGrowthContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📊 Current Growth Analysis</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Document your current revenue, growth metrics, and key performance indicators. This establishes your growth baseline.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Current Monthly/Annual Revenue
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Your approximate current revenue (monthly or annual)</span>
            </label>
            <input type="number" id="gs-current-revenue" placeholder="e.g., 10000" value="${data.currentRevenue || ''}"
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
            <div style="display: flex; gap: 12px; margin-top: 8px;">
                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.6); cursor: pointer;">
                    <input type="radio" name="revenue-period" value="monthly" ${data.revenuePeriod === 'monthly' ? 'checked' : 'checked'}> Monthly
                </label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.6); cursor: pointer;">
                    <input type="radio" name="revenue-period" value="annual" ${data.revenuePeriod === 'annual' ? 'checked' : ''}> Annual
                </label>
            </div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Revenue Growth Rate (%)
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Year-over-year or month-over-month growth percentage</span>
            </label>
            <input type="number" id="gs-growth-rate" placeholder="e.g., 25" value="${data.growthRate || ''}"
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 12px; font-weight: 500; color: var(--ivory-light);">
                Primary Growth Channels
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Select all channels currently driving growth for your business</span>
            </label>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${growthChannels.map(channel => `
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(46, 124, 131, 0.1)'" onmouseout="this.style.background='rgba(246, 241, 232, 0.05)'">
                        <input type="checkbox" id="gs-channel-${channel.id}" value="${channel.id}" ${data.channels && data.channels.includes(channel.id) ? 'checked' : ''}>
                        <span style="font-size: 18px;">${channel.icon}</span>
                        <span style="color: var(--ivory-light); font-size: 14px;">${channel.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
            <div>
                <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                    Customer Acquisition Cost (CAC)
                    <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Average cost to acquire one customer</span>
                </label>
                <input type="number" id="gs-cac" placeholder="e.g., 150" value="${data.cac || ''}"
                    style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                    Customer Lifetime Value (LTV)
                    <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Total revenue expected from one customer</span>
                </label>
                <input type="number" id="gs-ltv" placeholder="e.g., 1200" value="${data.ltv || ''}"
                    style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
            <div>
                <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                    Monthly New Customers
                    <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Average new customers per month</span>
                </label>
                <input type="number" id="gs-new-customers" placeholder="e.g., 50" value="${data.newCustomers || ''}"
                    style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                    Churn Rate (%)
                    <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Percentage of customers lost per period</span>
                </label>
                <input type="number" id="gs-churn-rate" placeholder="e.g., 5" value="${data.churnRate || ''}"
                    style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px;">
            </div>
        </div>
        
        <div style="background: rgba(46, 124, 131, 0.1); border-left: 4px solid var(--sacred-teal); padding: 16px 20px; border-radius: 0 12px 12px 0;">
            <div style="font-weight: 500; color: var(--ivory-light); margin-bottom: 6px;">💡 Tip</div>
            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.7);">If you don't know exact numbers, provide your best estimate. The goal is to establish a baseline for tracking improvement.</div>
        </div>
    `;
}

// Section 2: Growth Channel Assessment
function getGSChannelAssessmentContent(data) {
    const ratings = data.channelRatings || {};
    
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📢 Growth Channel Assessment</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Rate the effectiveness of each growth channel on a scale of 1-10. This helps identify your strongest and weakest channels.</p>
        
        <div style="margin-bottom: 32px;">
            <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold); margin-bottom: 20px;">Channel Effectiveness Ratings (1-10)</h4>
            
            ${growthChannels.map(channel => `
                <div style="margin-bottom: 20px; padding: 16px; background: rgba(246, 241, 232, 0.03); border-radius: 12px; border: 1px solid rgba(212, 175, 99, 0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">${channel.icon}</span>
                            <span style="font-weight: 500; color: var(--ivory-light);">${channel.label}</span>
                        </div>
                        <span id="gs-rating-value-${channel.id}" style="font-weight: 600; color: var(--warm-gold); font-size: 18px;">${ratings[channel.id] || 5}</span>
                    </div>
                    <input type="range" id="gs-rating-${channel.id}" min="1" max="10" value="${ratings[channel.id] || 5}"
                        style="width: 100%; height: 8px; border-radius: 4px; background: rgba(31, 49, 91, 0.5); outline: none; -webkit-appearance: none; cursor: pointer;"
                        oninput="document.getElementById('gs-rating-value-${channel.id}').textContent = this.value">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(246, 241, 232, 0.4); margin-top: 6px;">
                        <span>Not Effective</span>
                        <span>Highly Effective</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Top 3 Performing Channels
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Which channels drive the most results? Why?</span>
            </label>
            <textarea id="gs-top-channels" rows="4" placeholder="1. Referrals - Our best clients come from word-of-mouth...\n2. Content Marketing - Blog posts drive consistent organic traffic...\n3. Email Marketing - Highest conversion rate from our list..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.topChannels || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Underperforming Channels
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Which channels aren't delivering? What might be the issue?</span>
            </label>
            <textarea id="gs-underperforming" rows="4" placeholder="Paid Ads - High cost, low conversion. Need better targeting...\nSocial Media - Lots of engagement but few conversions..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.underperforming || ''}</textarea>
        </div>
    `;
}

// Section 3: Scaling Opportunities
function getGSScalingOpportunitiesContent(data) {
    const untapped = data.untappedChannels || [];
    
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">🚀 Scaling Opportunities</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Explore untapped channels, new markets, and expansion opportunities for your business.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 12px; font-weight: 500; color: var(--ivory-light);">
                Untapped Channels to Explore
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Select channels you're not currently using but want to explore</span>
            </label>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${growthChannels.map(channel => `
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(94, 59, 108, 0.15)'" onmouseout="this.style.background='rgba(246, 241, 232, 0.05)'">
                        <input type="checkbox" id="gs-untapped-${channel.id}" value="${channel.id}" ${untapped.includes(channel.id) ? 'checked' : ''}>
                        <span style="font-size: 18px;">${channel.icon}</span>
                        <span style="color: var(--ivory-light); font-size: 14px;">${channel.label}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Market Expansion Opportunities
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">New markets, geographies, or industries you could expand into</span>
            </label>
            <textarea id="gs-market-expansion" rows="4" placeholder="e.g.,\n• Expand to serve enterprise clients (currently focused on SMB)\n• Launch in European market\n• Target adjacent industry verticals..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.marketExpansion || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                New Customer Segments
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Different types of customers you could serve</span>
            </label>
            <textarea id="gs-new-segments" rows="4" placeholder="e.g.,\n• Corporate teams (currently serving individuals)\n• Beginners in our field (currently serving intermediate)\n• Different demographic or psychographic profiles..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.newSegments || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Partnership Opportunities
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Potential partners who could help you reach new audiences</span>
            </label>
            <textarea id="gs-partnerships" rows="4" placeholder="e.g.,\n• Strategic partnerships with complementary businesses\n• Affiliate partnerships with influencers in our space\n• Integration partnerships with software platforms..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.partnerships || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Product/Service Expansion Ideas
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">New offers, tiers, or product lines you could develop</span>
            </label>
            <textarea id="gs-product-expansion" rows="4" placeholder="e.g.,\n• Lower-tier entry product to reduce barrier to entry\n• Premium high-touch service tier\n• Digital product or course version of our service..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.productExpansion || ''}</textarea>
        </div>
    `;
}

// Section 4: Growth Constraints
function getGSConstraintsContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">🔧 Growth Constraints</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Identify the bottlenecks, limitations, and challenges that are holding back your growth.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Current Bottlenecks
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Where does your growth get stuck? What slows things down?</span>
            </label>
            <textarea id="gs-bottlenecks" rows="4" placeholder="e.g.,\n• Lead generation is inconsistent - feast or famine cycles\n• Sales process takes too long from first contact to close\n• Onboarding new clients is time-intensive and limits capacity..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.bottlenecks || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Resource Limitations
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What resources are you lacking? (time, money, people, etc.)</span>
            </label>
            <textarea id="gs-resources" rows="4" placeholder="e.g.,\n• Limited marketing budget for paid acquisition\n• Not enough team members to handle increased volume\n• My time is maxed out - can't take on more without systems..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.resourceLimitations || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Skill Gaps
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What skills or expertise are you missing to grow effectively?</span>
            </label>
            <textarea id="gs-skill-gaps" rows="4" placeholder="e.g.,\n• Need better copywriting skills for conversion optimization\n• Don't have expertise in paid advertising\n• Lack experience with sales team management..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.skillGaps || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Technology Needs
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What tools, systems, or tech would help you scale?</span>
            </label>
            <textarea id="gs-tech-needs" rows="4" placeholder="e.g.,\n• CRM system to better track leads and follow-ups\n• Marketing automation to nurture leads at scale\n• Better analytics to understand what's working..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.techNeeds || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Biggest Growth Challenge
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">If you could only solve one problem, what would have the biggest impact?</span>
            </label>
            <textarea id="gs-biggest-challenge" rows="4" placeholder="e.g., Our biggest challenge is consistent lead generation. We rely too heavily on referrals which are unpredictable..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.biggestChallenge || ''}</textarea>
        </div>
    `;
}

// Section 5: Growth Plan
function getGSGrowthPlanContent(data) {
    return `
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📋 Growth Plan</h3>
        <p style="color: rgba(246, 241, 232, 0.7); margin-bottom: 32px; line-height: 1.6;">Define your 90-day growth goals, key metrics, and action items to move from planning to execution.</p>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                90-Day Growth Goals
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What specific outcomes do you want to achieve in the next 90 days?</span>
            </label>
            <textarea id="gs-goals" rows="5" placeholder="e.g.,\n• Increase monthly revenue from $10k to $15k\n• Grow email list from 500 to 1,000 subscribers\n• Launch new referral program and get 10 referrals\n• Reduce customer churn from 10% to 5%..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.goals || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Key Metrics to Track
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What numbers will you monitor weekly/monthly to measure progress?</span>
            </label>
            <textarea id="gs-metrics" rows="4" placeholder="e.g.,\n• Monthly Recurring Revenue (MRR)\n• New customer acquisition rate\n• Customer Lifetime Value (LTV)\n• Conversion rate from lead to customer\n• Website traffic and email open rates..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.metrics || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Required Investments
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">What will you need to invest? (time, money, resources)</span>
            </label>
            <textarea id="gs-investments" rows="4" placeholder="e.g.,\n• $2,000 for paid advertising test\n• 10 hours/week for content creation\n• Hire part-time VA for $500/month\n• Investment in CRM software ($100/month)..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.investments || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Action Items (Next 30 Days)
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">Specific actions you'll take in the next 30 days</span>
            </label>
            <textarea id="gs-actions" rows="5" placeholder="e.g.,\n1. Set up tracking dashboard for key metrics\n2. Create content calendar for next 30 days\n3. Reach out to 5 potential partners\n4. Audit and optimize top-performing landing page\n5. Set up automated email nurture sequence..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.actions || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 28px;">
            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: var(--ivory-light);">
                Success Indicators
                <span style="font-size: 12px; color: rgba(246, 241, 232, 0.5); font-weight: 400; display: block; margin-top: 4px;">How will you know your growth strategy is working?</span>
            </label>
            <textarea id="gs-success" rows="4" placeholder="e.g.,\n• Month-over-month revenue growth of 10%+\n• Consistent lead flow (no more feast/famine)\n• Improved conversion rates across all channels\n• Positive customer feedback and referrals increasing..." 
                style="width: 100%; padding: 14px 18px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 12px; color: var(--ivory-light); font-family: inherit; font-size: 15px; resize: vertical;">${data.success || ''}</textarea>
        </div>
        
        <div style="background: rgba(212, 175, 99, 0.1); border-left: 4px solid var(--warm-gold); padding: 16px 20px; border-radius: 0 12px 12px 0;">
            <div style="font-weight: 500; color: var(--ivory-light); margin-bottom: 6px;">🎯 Final Step</div>
            <div style="font-size: 13px; color: rgba(246, 241, 232, 0.7);">Review your growth plan and commit to your first 30-day actions. Growth happens through consistent execution, not perfect planning.</div>
        </div>
    `;
}

// Collect data from current section
function collectGSSectionData(sectionId) {
    const data = {};
    
    switch (sectionId) {
        case 1:
            data.currentRevenue = document.getElementById('gs-current-revenue')?.value || '';
            data.revenuePeriod = document.querySelector('input[name="revenue-period"]:checked')?.value || 'monthly';
            data.growthRate = document.getElementById('gs-growth-rate')?.value || '';
            data.channels = Array.from(document.querySelectorAll('input[id^="gs-channel-"]:checked')).map(cb => cb.value);
            data.cac = document.getElementById('gs-cac')?.value || '';
            data.ltv = document.getElementById('gs-ltv')?.value || '';
            data.newCustomers = document.getElementById('gs-new-customers')?.value || '';
            data.churnRate = document.getElementById('gs-churn-rate')?.value || '';
            break;
        case 2:
            data.channelRatings = {};
            growthChannels.forEach(channel => {
                const rating = document.getElementById(`gs-rating-${channel.id}`)?.value;
                if (rating) data.channelRatings[channel.id] = parseInt(rating);
            });
            data.topChannels = document.getElementById('gs-top-channels')?.value || '';
            data.underperforming = document.getElementById('gs-underperforming')?.value || '';
            break;
        case 3:
            data.untappedChannels = Array.from(document.querySelectorAll('input[id^="gs-untapped-"]:checked')).map(cb => cb.value);
            data.marketExpansion = document.getElementById('gs-market-expansion')?.value || '';
            data.newSegments = document.getElementById('gs-new-segments')?.value || '';
            data.partnerships = document.getElementById('gs-partnerships')?.value || '';
            data.productExpansion = document.getElementById('gs-product-expansion')?.value || '';
            break;
        case 4:
            data.bottlenecks = document.getElementById('gs-bottlenecks')?.value || '';
            data.resourceLimitations = document.getElementById('gs-resources')?.value || '';
            data.skillGaps = document.getElementById('gs-skill-gaps')?.value || '';
            data.techNeeds = document.getElementById('gs-tech-needs')?.value || '';
            data.biggestChallenge = document.getElementById('gs-biggest-challenge')?.value || '';
            break;
        case 5:
            data.goals = document.getElementById('gs-goals')?.value || '';
            data.metrics = document.getElementById('gs-metrics')?.value || '';
            data.investments = document.getElementById('gs-investments')?.value || '';
            data.actions = document.getElementById('gs-actions')?.value || '';
            data.success = document.getElementById('gs-success')?.value || '';
            break;
    }
    
    return data;
}

// Save section and continue
async function saveGSSectionAndContinue(sectionId) {
    const sectionData = collectGSSectionData(sectionId);
    const progressPercent = Math.round((sectionId / growthStrategyState.totalSections) * 100);
    const isComplete = sectionId === growthStrategyState.totalSections;
    const status = isComplete ? 'completed' : 'in_progress';
    const nextSection = isComplete ? sectionId : sectionId + 1;
    
    // Save to Supabase
    const saveData = { [`section${sectionId}`]: sectionData };
    const saved = await saveGrowthStrategyToSupabase(saveData, progressPercent, status, nextSection);
    
    if (saved) {
        // Show auto-save indicator
        const indicator = document.getElementById('gs-autosave-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            setTimeout(() => { indicator.style.display = 'none'; }, 2000);
        }
        
        if (isComplete) {
            // Assessment complete
            alert('✅ Growth Strategy Audit complete! Your growth plan has been saved.');
            renderGrowthStrategy();
        } else {
            // Move to next section
            goToGSSection(nextSection);
        }
    } else {
        // Fallback to localStorage
        growthStrategyState.data = { ...growthStrategyState.data, ...saveData };
        localStorage.setItem('lccs_growth_strategy', JSON.stringify({
            data: growthStrategyState.data,
            currentSection: nextSection,
            progressPercent,
            status
        }));
        
        if (isComplete) {
            alert('✅ Growth Strategy Audit complete! (Saved locally)');
            renderGrowthStrategy();
        } else {
            goToGSSection(nextSection);
        }
    }
}

// Save progress and exit
async function saveGSProgressAndExit() {
    const sectionData = collectGSSectionData(growthStrategyState.currentSection);
    const progressPercent = Math.round((growthStrategyState.currentSection / growthStrategyState.totalSections) * 100);
    
    const saveData = { [`section${growthStrategyState.currentSection}`]: sectionData };
    await saveGrowthStrategyToSupabase(saveData, progressPercent, 'in_progress', growthStrategyState.currentSection);
    
    // Also save to localStorage as backup
    growthStrategyState.data = { ...growthStrategyState.data, ...saveData };
    localStorage.setItem('lccs_growth_strategy', JSON.stringify({
        data: growthStrategyState.data,
        currentSection: growthStrategyState.currentSection,
        progressPercent,
        status: 'in_progress'
    }));
    
    renderGrowthStrategy();
}

// Review results
function reviewGSResults() {
    const data = growthStrategyState.data;
    
    let html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Growth Strategy Results</h1>
            <p class="welcome-subtitle">Review your complete growth strategy audit.</p>
        </div>
        
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 20px; padding: 40px; margin-bottom: 30px;">
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin-bottom: 24px;">📊 Current Metrics</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                    <div style="background: rgba(46, 124, 131, 0.1); padding: 16px; border-radius: 12px;">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">Current Revenue</div>
                        <div style="font-size: 20px; font-weight: 600; color: var(--ivory-light);">${data.section1?.currentRevenue ? '$' + parseInt(data.section1.currentRevenue).toLocaleString() : 'Not set'} ${data.section1?.revenuePeriod || ''}</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); padding: 16px; border-radius: 12px;">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">Growth Rate</div>
                        <div style="font-size: 20px; font-weight: 600; color: var(--ivory-light);">${data.section1?.growthRate ? data.section1.growthRate + '%' : 'Not set'}</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); padding: 16px; border-radius: 12px;">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">CAC</div>
                        <div style="font-size: 20px; font-weight: 600; color: var(--ivory-light);">${data.section1?.cac ? '$' + parseInt(data.section1.cac).toLocaleString() : 'Not set'}</div>
                    </div>
                    <div style="background: rgba(46, 124, 131, 0.1); padding: 16px; border-radius: 12px;">
                        <div style="font-size: 12px; color: rgba(246, 241, 232, 0.6); margin-bottom: 4px;">LTV</div>
                        <div style="font-size: 20px; font-weight: 600; color: var(--ivory-light);">${data.section1?.ltv ? '$' + parseInt(data.section1.ltv).toLocaleString() : 'Not set'}</div>
                    </div>
                </div>
                
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--warm-gold); margin: 32px 0 24px;">🚀 Growth Plan Summary</h3>
                <div style="background: rgba(94, 59, 108, 0.15); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                    <div style="font-weight: 500; color: var(--ivory-light); margin-bottom: 8px;">90-Day Goals</div>
                    <div style="color: rgba(246, 241, 232, 0.8); white-space: pre-line;">${data.section5?.goals || 'Not defined yet'}</div>
                </div>
                
                <div style="background: rgba(94, 59, 108, 0.15); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                    <div style="font-weight: 500; color: var(--ivory-light); margin-bottom: 8px;">Next 30 Days Action Items</div>
                    <div style="color: rgba(246, 241, 232, 0.8); white-space: pre-line;">${data.section5?.actions || 'Not defined yet'}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="renderGrowthStrategy()">← Back to Overview</button>
                <button class="btn btn-primary" onclick="exportGSResults()">📥 Export Results</button>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export results
function exportGSResults() {
    const data = growthStrategyState.data;
    let exportText = 'GROWTH STRATEGY AUDIT RESULTS\n';
    exportText += '===========================\n\n';
    
    exportText += 'SECTION 1: CURRENT GROWTH ANALYSIS\n';
    exportText += '----------------------------------\n';
    exportText += `Current Revenue: $${data.section1?.currentRevenue || 'N/A'} (${data.section1?.revenuePeriod || 'monthly'})\n`;
    exportText += `Growth Rate: ${data.section1?.growthRate || 'N/A'}%\n`;
    exportText += `Channels: ${data.section1?.channels?.join(', ') || 'N/A'}\n`;
    exportText += `CAC: $${data.section1?.cac || 'N/A'}\n`;
    exportText += `LTV: $${data.section1?.ltv || 'N/A'}\n`;
    exportText += `New Customers/Month: ${data.section1?.newCustomers || 'N/A'}\n`;
    exportText += `Churn Rate: ${data.section1?.churnRate || 'N/A'}%\n\n`;
    
    exportText += 'SECTION 2: CHANNEL ASSESSMENT\n';
    exportText += '-----------------------------\n';
    if (data.section2?.channelRatings) {
        Object.entries(data.section2.channelRatings).forEach(([channel, rating]) => {
            const channelInfo = growthChannels.find(c => c.id === channel);
            exportText += `${channelInfo?.label || channel}: ${rating}/10\n`;
        });
    }
    exportText += `\nTop Channels:\n${data.section2?.topChannels || 'N/A'}\n\n`;
    exportText += `Underperforming:\n${data.section2?.underperforming || 'N/A'}\n\n`;
    
    exportText += 'SECTION 5: GROWTH PLAN\n';
    exportText += '----------------------\n';
    exportText += `90-Day Goals:\n${data.section5?.goals || 'N/A'}\n\n`;
    exportText += `Key Metrics:\n${data.section5?.metrics || 'N/A'}\n\n`;
    exportText += `Action Items:\n${data.section5?.actions || 'N/A'}\n\n`;
    exportText += `Success Indicators:\n${data.section5?.success || 'N/A'}\n\n`;
    
    exportText += '===========================\n';
    exportText += `Generated: ${new Date().toLocaleDateString()}\n`;
    
    // Download as file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'growth-strategy-audit.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Reset growth strategy
async function resetGrowthStrategy() {
    if (!confirm('Are you sure you want to reset your Growth Strategy Audit? All data will be cleared.')) {
        return;
    }
    
    const userId = getCurrentUserId();
    if (userId && supabaseClient) {
        try {
            await supabaseClient
                .from('business_growth_strategy')
                .delete()
                .eq('user_id', userId);
        } catch (err) {
            console.error('Error deleting growth strategy:', err);
        }
    }
    
    // Clear local state
    growthStrategyState = {
        currentSection: 1,
        totalSections: 5,
        data: {},
        savedProgress: null,
        isLoading: false
    };
    localStorage.removeItem('lccs_growth_strategy');
    
    renderGrowthStrategy();
}

// Complete the reset operations audit function
async function resetOperationsAudit() {
    if (!confirm('Are you sure you want to reset your Operations Audit? All data will be cleared.')) {
        return;
    }
    
    const userId = getCurrentUserId();
    if (userId && supabaseClient) {
        try {
            await supabaseClient
                .from('business_operations_audit')
                .delete()
                .eq('user_id', userId);
        } catch (err) {
            console.error('Error deleting operations audit:', err);
        }
    }
    
    // Clear local state
    operationsAuditState = {
        currentSection: 1,
        totalSections: 5,
        data: {},
        savedProgress: null,
        isLoading: false
    };
    localStorage.removeItem('lccs_operations_audit');
    
    renderOperationsAudit();
}

// ============================================
// SALES & DELIVERY MODULES - EVENT DELEGATION PATTERN
// ============================================

// 1. SALES CALL SCRIPTS
function showSalesCallScripts() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📞 Sales Call Scripts</h1>
            <p class="welcome-subtitle">Script templates for effective sales conversations.</p>
        </div>
        
        <div id="scripts-container" style="padding: 20px;">
            <div class="script-card" data-script-id="discovery" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Discovery Call Script</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Initial qualification and needs assessment</p>
            </div>
            
            <div class="script-card" data-script-id="demo" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Demo Call Script</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Presenting your solution effectively</p>
            </div>
            
            <div class="script-card" data-script-id="close" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Closing Call Script</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Moving to decision and handling final objections</p>
            </div>
            
            <button class="btn btn-primary" id="btn-add-script" style="margin-top: 20px;">+ Add Custom Script</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    // Event delegation - attach ONE listener to container
    document.getElementById('scripts-container').addEventListener('click', function(e) {
        const card = e.target.closest('.script-card');
        if (card) {
            const scriptId = card.dataset.scriptId;
            viewScript(scriptId);
        }
        
        if (e.target.id === 'btn-add-script') {
            addCustomScript();
        }
    });
}

// 2. PROPOSALS & CONTRACTS
function showProposalsContracts() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📄 Proposals & Contracts</h1>
            <p class="welcome-subtitle">Templates and documents for closing deals.</p>
        </div>
        
        <div id="proposals-container" style="padding: 20px;">
            <div class="doc-card" data-doc-id="proposal" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Service Proposal Template</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Professional proposal for your services</p>
            </div>
            
            <div class="doc-card" data-doc-id="contract" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Service Agreement Contract</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Standard terms and conditions template</p>
            </div>
            
            <button class="btn btn-primary" id="btn-create-proposal" style="margin-top: 20px;">+ Create New Proposal</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    document.getElementById('proposals-container').addEventListener('click', function(e) {
        const card = e.target.closest('.doc-card');
        if (card) {
            viewDocument(card.dataset.docId);
        }
        
        if (e.target.id === 'btn-create-proposal') {
            createNewProposal();
        }
    });
}

// 3. DELIVERY FRAMEWORKS
function showDeliveryFrameworks() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🎯 Delivery Frameworks</h1>
            <p class="welcome-subtitle">Structured approaches to delivering your services.</p>
        </div>
        
        <div id="frameworks-container" style="padding: 20px;">
            <div class="framework-card" data-framework-id="onboarding" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Client Onboarding Framework</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Step-by-step process for new client intake</p>
            </div>
            
            <div class="framework-card" data-framework-id="delivery" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Service Delivery Framework</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Standard delivery process and milestones</p>
            </div>
            
            <button class="btn btn-primary" id="btn-add-framework" style="margin-top: 20px;">+ Add Framework</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    document.getElementById('frameworks-container').addEventListener('click', function(e) {
        const card = e.target.closest('.framework-card');
        if (card) {
            viewFramework(card.dataset.frameworkId);
        }
        
        if (e.target.id === 'btn-add-framework') {
            addFramework();
        }
    });
}

// 4. OBJECTION HANDLING
function showObjectionHandling() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🛡️ Objection Handling</h1>
            <p class="welcome-subtitle">Responses to common sales objections.</p>
        </div>
        
        <div id="objections-container" style="padding: 20px;">
            <div class="objection-card" data-objection="price" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">"It's too expensive"</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Value-based response frameworks</p>
            </div>
            
            <div class="objection-card" data-objection="time" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px; cursor: pointer;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">"I need to think about it"</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Urgency and commitment responses</p>
            </div>
            
            <button class="btn btn-primary" id="btn-add-objection" style="margin-top: 20px;">+ Add Objection Response</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    document.getElementById('objections-container').addEventListener('click', function(e) {
        const card = e.target.closest('.objection-card');
        if (card) {
            viewObjectionResponse(card.dataset.objection);
        }
        
        if (e.target.id === 'btn-add-objection') {
            addObjectionResponse();
        }
    });
}

// 5. CLIENT ONBOARDING
function showClientOnboarding() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">🚀 Client Onboarding</h1>
            <p class="welcome-subtitle">Welcome and integrate new clients.</p>
        </div>
        
        <div id="onboarding-container" style="padding: 20px;">
            <div class="step-card" data-step="1" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Step 1: Welcome Package</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Send welcome email and resources</p>
                <button class="btn btn-secondary btn-complete-step" data-step="1" style="margin-top: 10px;">Mark Complete</button>
            </div>
            
            <div class="step-card" data-step="2" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                <h3 style="color: var(--warm-gold); margin-bottom: 8px;">Step 2: Kickoff Call</h3>
                <p style="color: rgba(246, 241, 232, 0.7);">Schedule and conduct initial meeting</p>
                <button class="btn btn-secondary btn-complete-step" data-step="2" style="margin-top: 10px;">Mark Complete</button>
            </div>
            
            <button class="btn btn-primary" id="btn-add-step" style="margin-top: 20px;">+ Add Onboarding Step</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    document.getElementById('onboarding-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-complete-step')) {
            const step = e.target.dataset.step;
            e.target.textContent = '✓ Completed';
            e.target.disabled = true;
            completeOnboardingStep(step);
        }
        
        if (e.target.id === 'btn-add-step') {
            addOnboardingStep();
        }
    });
}

// 6. PROGRESS TRACKING
function showProgressTracking() {
    setActiveNav('sales-delivery');
    
    const html = `
        <div class="welcome-section">
            <h1 class="welcome-title">📊 Progress Tracking</h1>
            <p class="welcome-subtitle">Monitor client progress and milestones.</p>
        </div>
        
        <div id="progress-container" style="padding: 20px;">
            <div class="progress-card" style="background: rgba(31, 49, 91, 0.3); border: 1px solid rgba(212, 175, 99, 0.15); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                <h3 style="color: var(--warm-gold); margin-bottom: 16px;">Active Clients</h3>
                <div id="active-clients-list">
                    <p style="color: rgba(246, 241, 232, 0.7);">No active clients tracked yet.</p>
                </div>
            </div>
            
            <button class="btn btn-primary" id="btn-add-client-progress" style="margin-top: 20px;">+ Track New Client</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="showDashboard()">← Back to Dashboard</button>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = html;
    
    document.getElementById('progress-container').addEventListener('click', function(e) {
        if (e.target.id === 'btn-add-client-progress') {
            addClientProgress();
        }
    });
}

// HELPER FUNCTIONS
function viewScript(scriptId) {
    alert('Viewing script: ' + scriptId);
    // Load from Supabase and display
}

function addCustomScript() {
    alert('Add custom script form');
    // Show form to add new script
}

function viewDocument(docId) {
    alert('Viewing document: ' + docId);
}

function createNewProposal() {
    alert('Create new proposal form');
}

function viewFramework(frameworkId) {
    alert('Viewing framework: ' + frameworkId);
}

function addFramework() {
    alert('Add framework form');
}

function viewObjectionResponse(objection) {
    alert('Viewing objection response: ' + objection);
}

function addObjectionResponse() {
    alert('Add objection response form');
}

function completeOnboardingStep(step) {
    alert('Completed step: ' + step);
}

function addOnboardingStep() {
    alert('Add onboarding step form');
}

function addClientProgress() {
    alert('Add client progress tracking');
}

// ============================================
// NOTIFICATIONS SYSTEM
// ============================================

const notificationsState = {
    notifications: [],
    unreadCount: 0,
    isOpen: false
};

// Initialize notifications from localStorage
function initNotifications() {
    const saved = localStorage.getItem('lccs_notifications');
    if (saved) {
        notificationsState.notifications = JSON.parse(saved);
        updateNotificationBadge();
    } else {
        // Add some demo notifications
        addNotification('Welcome to LifeCharter Command Suite', 'Get started by completing your Brain.md assessment.', 'system', false);
        addNotification('New Lead Added', 'A new lead has been added to your database.', 'lead', true);
        addNotification('Task Reminder', 'Don\'t forget to review your weekly goals.', 'task', true);
    }
}

function toggleNotifications() {
    notificationsState.isOpen = !notificationsState.isOpen;
    const panel = document.getElementById('notifications-panel');
    if (panel) {
        panel.style.display = notificationsState.isOpen ? 'block' : 'none';
    }
    if (notificationsState.isOpen) {
        renderNotificationsPanel();
    }
}

function showNotificationsPanel() {
    notificationsState.isOpen = true;
    renderNotificationsPanel();
}

function renderNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;

    const unreadCount = notificationsState.notifications.filter(n => !n.read).length;
    
    let html = `
        <div style="padding: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.2); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold);">Notifications</h3>
            ${unreadCount > 0 ? `<button onclick="markAllNotificationsRead()" style="background: none; border: none; color: var(--sacred-teal); cursor: pointer; font-size: 12px;">Mark all read</button>` : ''}
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
    `;

    if (notificationsState.notifications.length === 0) {
        html += `
            <div style="padding: 40px 20px; text-align: center; color: rgba(246, 241, 232, 0.5);">
                <div style="font-size: 32px; margin-bottom: 12px;">🔔</div>
                <p>No notifications yet</p>
            </div>
        `;
    } else {
        html += notificationsState.notifications.slice(0, 10).map(notif => `
            <div onclick="markNotificationRead('${notif.id}')" style="padding: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.1); cursor: pointer; transition: background 0.2s; ${!notif.read ? 'background: rgba(46, 124, 131, 0.1);' : ''}" onmouseover="this.style.background='rgba(212, 175, 99, 0.05)'" onmouseout="this.style.background='${!notif.read ? 'rgba(46, 124, 131, 0.1)' : 'transparent'}'">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="font-size: 20px;">${getNotificationIcon(notif.type)}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--ivory-light); font-size: 14px; margin-bottom: 4px;">${notif.title}</div>
                        <div style="color: rgba(246, 241, 232, 0.7); font-size: 13px; line-height: 1.4;">${notif.message}</div>
                        <div style="color: rgba(246, 241, 232, 0.5); font-size: 11px; margin-top: 6px;">${formatTime(notif.timestamp)}</div>
                    </div>
                    ${!notif.read ? '<div style="width: 8px; height: 8px; background: var(--sacred-teal); border-radius: 50%; margin-top: 4px;"></div>' : ''}
                </div>
            </div>
        `).join('');
    }

    html += `</div>`;
    
    if (notificationsState.notifications.length > 10) {
        html += `
            <div style="padding: 12px; text-align: center; border-top: 1px solid rgba(212, 175, 99, 0.2);">
                <button onclick="viewAllNotifications()" style="background: none; border: none; color: var(--sacred-teal); cursor: pointer; font-size: 13px;">View all notifications</button>
            </div>
        `;
    }

    panel.innerHTML = html;
}

function getNotificationIcon(type) {
    const icons = {
        'email': '📧',
        'warning': '⚠️',
        'success': '✅',
        'analytics': '📊',
        'lead': '👥',
        'task': '📋',
        'system': '🔔',
        'campaign': '📧',
        'opportunity': '💰'
    };
    return icons[type] || '🔔';
}

function addNotification(title, message, type = 'system', showBadge = true) {
    const notification = {
        id: 'notif_' + Date.now(),
        title,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    notificationsState.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notificationsState.notifications.length > 50) {
        notificationsState.notifications = notificationsState.notifications.slice(0, 50);
    }
    
    localStorage.setItem('lccs_notifications', JSON.stringify(notificationsState.notifications));
    updateNotificationBadge();
    
    if (notificationsState.isOpen) {
        renderNotificationsPanel();
    }
}

function markNotificationRead(id) {
    const notif = notificationsState.notifications.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        localStorage.setItem('lccs_notifications', JSON.stringify(notificationsState.notifications));
        updateNotificationBadge();
        renderNotificationsPanel();
    }
}

function markAllNotificationsRead() {
    notificationsState.notifications.forEach(n => n.read = true);
    localStorage.setItem('lccs_notifications', JSON.stringify(notificationsState.notifications));
    updateNotificationBadge();
    renderNotificationsPanel();
}

function updateNotificationBadge() {
    const unreadCount = notificationsState.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function viewAllNotifications() {
    alert('Full notifications page coming soon!');
}

// ============================================
// FAQ / SUPPORT SYSTEM
// ============================================

const supportState = {
    isOpen: false,
    activeTab: 'faq',
    searchQuery: ''
};

const faqData = {
    'getting-started': [
        {
            question: 'How do I complete my first business audit?',
            answer: 'Navigate to the Business Command Audit section from the sidebar. Start with the Business Model Canvas to document your current state. Work through each section at your own pace - your progress is saved automatically.'
        },
        {
            question: 'What is the LifeCharter methodology?',
            answer: 'LifeCharter is a lifestyle design and alignment system that helps you clarify who you are, what you value, what you want, and how to build a life that reflects your true identity. It consists of 12 dimensions covering all areas of life.'
        },
        {
            question: 'How do I invite team members?',
            answer: 'Go to Settings > Team Management to invite team members. You can assign different roles and permissions to each team member based on their responsibilities.'
        }
    ],
    'account': [
        {
            question: 'How do I update my profile?',
            answer: 'Click on your avatar in the top right corner and select "Profile" from the dropdown menu. You can update your name, business information, and other profile details there.'
        },
        {
            question: 'Can I change my email address?',
            answer: 'Email addresses cannot be changed directly for security reasons. Please contact support if you need to update your email address.'
        },
        {
            question: 'How do I reset my password?',
            answer: 'On the login page, click "Forgot Password" and follow the instructions sent to your email. If you don\'t receive the email, check your spam folder.'
        }
    ],
    'billing': [
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For annual plans, we also offer invoice payment options for business accounts.'
        },
        {
            question: 'How do I upgrade my plan?',
            answer: 'Go to Settings > Billing to view available plans and upgrade. Your new features will be available immediately after payment processing.'
        },
        {
            question: 'Where can I view my invoices?',
            answer: 'All invoices are available in Settings > Billing > Invoice History. You can download PDF copies of any past invoice for your records.'
        }
    ],
    'technical': [
        {
            question: 'The page won\'t load, what should I do?',
            answer: 'Try refreshing the page first. If that doesn\'t work, clear your browser cache and cookies. Make sure you\'re using a supported browser (Chrome, Firefox, Safari, or Edge). If issues persist, contact support.'
        },
        {
            question: 'How do I export my data?',
            answer: 'Go to Settings > Data & Privacy > Export Data. You can export your assessments, leads, and other data in CSV or JSON format.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and regular security audits. Your data is never sold or shared with third parties.'
        }
    ],
    'data-privacy': [
        {
            question: 'How is my data used?',
            answer: 'Your data is used solely to provide and improve the LifeCharter Command Suite services. We analyze usage patterns to improve features but never share personal information with third parties.'
        },
        {
            question: 'Can I delete my account?',
            answer: 'Yes, you can request account deletion in Settings > Data & Privacy. This will permanently delete all your data from our systems within 30 days.'
        },
        {
            question: 'How do I download my data?',
            answer: 'You can request a full data export in Settings > Data & Privacy > Download My Data. We\'ll compile all your information and send you a download link within 24 hours.'
        }
    ]
};

function toggleSupportPanel() {
    supportState.isOpen = !supportState.isOpen;
    const panel = document.getElementById('support-panel');
    if (panel) {
        panel.style.display = supportState.isOpen ? 'block' : 'none';
    }
    if (supportState.isOpen) {
        renderSupportPanel();
    }
}

function showSupportPanel() {
    supportState.isOpen = true;
    renderSupportPanel();
}

function renderSupportPanel() {
    const panel = document.getElementById('support-panel');
    if (!panel) return;

    let html = `
        <div style="padding: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
            <h3 style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--warm-gold);">Help & Support</h3>
        </div>
        
        <!-- Tabs -->
        <div style="display: flex; border-bottom: 1px solid rgba(212, 175, 99, 0.2);">
            <button onclick="switchSupportTab('faq')" style="flex: 1; padding: 12px; background: ${supportState.activeTab === 'faq' ? 'rgba(212, 175, 99, 0.1)' : 'transparent'}; border: none; border-bottom: 2px solid ${supportState.activeTab === 'faq' ? 'var(--warm-gold)' : 'transparent'}; color: ${supportState.activeTab === 'faq' ? 'var(--warm-gold)' : 'rgba(246, 241, 232, 0.7)'}; cursor: pointer; font-size: 14px;">Quick Help</button>
            <button onclick="switchSupportTab('contact')" style="flex: 1; padding: 12px; background: ${supportState.activeTab === 'contact' ? 'rgba(212, 175, 99, 0.1)' : 'transparent'}; border: none; border-bottom: 2px solid ${supportState.activeTab === 'contact' ? 'var(--warm-gold)' : 'transparent'}; color: ${supportState.activeTab === 'contact' ? 'var(--warm-gold)' : 'rgba(246, 241, 232, 0.7)'}; cursor: pointer; font-size: 14px;">Contact Support</button>
        </div>
        
        <div style="max-height: 500px; overflow-y: auto;">
    `;

    if (supportState.activeTab === 'faq') {
        html += renderFAQContent();
    } else {
        html += renderContactForm();
    }

    html += `</div>`;
    panel.innerHTML = html;
}

function renderFAQContent() {
    const categories = {
        'getting-started': { label: 'Getting Started', icon: '🚀' },
        'account': { label: 'Account Settings', icon: '👤' },
        'billing': { label: 'Billing & Payments', icon: '💳' },
        'technical': { label: 'Technical Issues', icon: '🔧' },
        'data-privacy': { label: 'Data & Privacy', icon: '🔒' }
    };

    let html = `
        <!-- Search -->
        <div style="padding: 16px; border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
            <input type="text" id="faq-search" placeholder="Search FAQ..." oninput="searchFAQ(this.value)" 
                style="width: 100%; padding: 12px 16px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px;">
        </div>
    `;

    const searchQuery = supportState.searchQuery.toLowerCase();

    for (const [key, category] of Object.entries(categories)) {
        const faqs = faqData[key] || [];
        const filteredFaqs = searchQuery 
            ? faqs.filter(f => f.question.toLowerCase().includes(searchQuery) || f.answer.toLowerCase().includes(searchQuery))
            : faqs;

        if (filteredFaqs.length === 0 && searchQuery) continue;

        html += `
            <div style="border-bottom: 1px solid rgba(212, 175, 99, 0.1);">
                <div onclick="toggleFAQCategory('${key}')" style="padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; background: rgba(31, 49, 91, 0.3);" onmouseover="this.style.background='rgba(212, 175, 99, 0.05)'" onmouseout="this.style.background='rgba(31, 49, 91, 0.3)'">
                    <span style="font-size: 18px;">${category.icon}</span>
                    <span style="flex: 1; font-weight: 500; color: var(--ivory-light);">${category.label}</span>
                    <span id="faq-icon-${key}">▼</span>
                </div>
                <div id="faq-content-${key}" style="display: none;">
        `;

        filteredFaqs.forEach((faq, index) => {
            html += `
                <div style="padding: 16px; border-top: 1px solid rgba(212, 175, 99, 0.05);">
                    <div onclick="toggleFAQAnswer('${key}-${index}')" style="cursor: pointer; color: var(--sacred-teal); font-weight: 500; font-size: 14px; margin-bottom: 8px;">
                        ${faq.question}
                    </div>
                    <div id="faq-answer-${key}-${index}" style="display: none; color: rgba(246, 241, 232, 0.8); font-size: 13px; line-height: 1.5; padding-left: 12px; border-left: 2px solid rgba(212, 175, 99, 0.3);">
                        ${faq.answer}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    return html;
}

function toggleFAQCategory(key) {
    const content = document.getElementById(`faq-content-${key}`);
    const icon = document.getElementById(`faq-icon-${key}`);
    if (content) {
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        if (icon) icon.textContent = isOpen ? '▼' : '▲';
    }
}

function toggleFAQAnswer(id) {
    const answer = document.getElementById(`faq-answer-${id}`);
    if (answer) {
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    }
}

function searchFAQ(query) {
    supportState.searchQuery = query;
    renderSupportPanel();
}

function renderContactForm() {
    return `
        <div style="padding: 20px;">
            <form id="support-ticket-form" onsubmit="event.preventDefault(); submitSupportTicket();">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.8);">Subject</label>
                    <select id="ticket-subject" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px;">
                        <option value="">Select a topic...</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing Question</option>
                        <option value="feature">Feature Request</option>
                        <option value="account">Account Help</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.8);">Priority</label>
                    <select id="ticket-priority" style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px;">
                        <option value="low">Low - General question</option>
                        <option value="medium" selected>Medium - Need help soon</option>
                        <option value="high">High - Important issue</option>
                        <option value="urgent">Urgent - Critical problem</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.8);">Message</label>
                    <textarea id="ticket-message" rows="5" placeholder="Describe your issue or question in detail..." 
                        style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px solid rgba(212, 175, 99, 0.2); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px; resize: vertical;"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: rgba(246, 241, 232, 0.8);">Attach Screenshot (optional)</label>
                    <input type="file" id="ticket-attachment" accept="image/*" 
                        style="width: 100%; padding: 12px; background: rgba(246, 241, 232, 0.05); border: 1px dashed rgba(212, 175, 99, 0.3); border-radius: 10px; color: var(--ivory-light); font-family: inherit; font-size: 14px;">
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Ticket</button>
            </form>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 99, 0.1); text-align: center;">
                <p style="font-size: 12px; color: rgba(246, 241, 232, 0.5); margin-bottom: 8px;">Or email us directly:</p>
                <a href="mailto:amilynne@amilynnecarroll.com" style="color: var(--sacred-teal); font-size: 14px; text-decoration: none;">amilynne@amilynnecarroll.com</a>
            </div>
        </div>
    `;
}

function switchSupportTab(tab) {
    supportState.activeTab = tab;
    renderSupportPanel();
}

function submitSupportTicket() {
    const subject = document.getElementById('ticket-subject').value;
    const priority = document.getElementById('ticket-priority').value;
    const message = document.getElementById('ticket-message').value;
    const attachment = document.getElementById('ticket-attachment').files[0];
    
    if (!subject || !message) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In demo mode, send email via mailto link
    const emailSubject = `[${priority.toUpperCase()}] ${subject} - LifeCharter Support`;
    const emailBody = `Priority: ${priority}\n\nMessage:\n${message}`;
    
    // Create mailto link
    const mailtoLink = `mailto:amilynne@amilynnecarroll.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Show success message
    showTicketSuccess();
    
    // Open email client
    setTimeout(() => {
        window.open(mailtoLink, '_blank');
    }, 500);
}

function showTicketSuccess() {
    const panel = document.getElementById('support-panel');
    if (panel) {
        panel.innerHTML = `
            <div style="padding: 40px 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--warm-gold); margin-bottom: 12px;">Ticket Submitted!</h3>
                <p style="color: rgba(246, 241, 232, 0.7); font-size: 14px; margin-bottom: 20px;">We'll get back to you as soon as possible.</p>
                <button onclick="switchSupportTab('contact'); renderSupportPanel();" class="btn btn-secondary">Submit Another</button>
            </div>
        `;
    }
    
    // Add notification
    addNotification('Support Ticket Submitted', 'Your support request has been sent. We\'ll respond shortly.', 'system', true);
}

// Close panels when clicking outside
document.addEventListener('click', function(e) {
    const notifPanel = document.getElementById('notifications-panel');
    const notifBtn = document.getElementById('notifications-btn');
    const supportPanel = document.getElementById('support-panel');
    const supportBtn = document.getElementById('support-btn');
    
    if (notificationsState.isOpen && notifPanel && !notifPanel.contains(e.target) && !notifBtn?.contains(e.target)) {
        notificationsState.isOpen = false;
        notifPanel.style.display = 'none';
    }
    
    if (supportState.isOpen && supportPanel && !supportPanel.contains(e.target) && !supportBtn?.contains(e.target)) {
        supportState.isOpen = false;
        supportPanel.style.display = 'none';
    }
});

// Initialize notifications on load
document.addEventListener('DOMContentLoaded', initNotifications);

// Expose critical functions to global scope for onclick handlers
window.showLeadDatabase = showLeadDatabase;
window.addNewLead = addNewLead;
window.saveLead = saveLead;
window.showCampaignBuilder = showCampaignBuilder;
window.createNewCampaign = createNewCampaign;
window.saveCampaign = saveCampaign;
window.showSalesPipeline = showSalesPipeline;
window.showSalesCommand = showSalesCommand;
window.showSalesInbox = showSalesInbox;

// Expose Sales & Delivery modules
window.showSalesCallScripts = showSalesCallScripts;
window.showProposalsContracts = showProposalsContracts;
window.showDeliveryFrameworks = showDeliveryFrameworks;
window.showObjectionHandling = showObjectionHandling;
window.showClientOnboarding = showClientOnboarding;
window.showProgressTracking = showProgressTracking;

// Expose Operations & Systems modules
window.showCEODashboard = showCEODashboard;
window.showTeamCommunications = showTeamCommunications;
window.showMeetingAgendas = showMeetingAgendas;
window.showSOPLibrary = showSOPLibrary;
window.showTechStackManager = showTechStackManager;
window.showDocumentVault = showDocumentVault;

// Expose Notifications & Support functions
window.toggleNotifications = toggleNotifications;
window.toggleSupportPanel = toggleSupportPanel;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.submitSupportTicket = submitSupportTicket;
window.searchFAQ = searchFAQ;
window.switchSupportTab = switchSupportTab;
window.toggleFAQCategory = toggleFAQCategory;
window.toggleFAQAnswer = toggleFAQAnswer;

