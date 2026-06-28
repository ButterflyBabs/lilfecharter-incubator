-- ============================================
-- OUTREACH COMMAND CENTER DATABASE SETUP
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- WORKSPACES (for multi-client support)
-- ============================================
CREATE TABLE IF NOT EXISTS occ_workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEADS
-- ============================================
CREATE TABLE IF NOT EXISTS occ_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Professional Info
    company TEXT,
    title TEXT,
    industry TEXT,
    company_size TEXT,
    
    -- Online Presence
    website TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    
    -- Pathway & Classification
    pathway TEXT NOT NULL CHECK (pathway IN ('b2b', 'b2c', 'affiliate')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'researching', 'contacted', 'responded', 'converted', 'disqualified', 'nurture')),
    pipeline_stage TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
    
    -- Scoring
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    score_breakdown JSONB DEFAULT '{}',
    
    -- Research Data
    research_data JSONB DEFAULT '{}',
    research_summary TEXT,
    
    -- Tags & Notes
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    
    -- Contact Tracking
    last_contact_at TIMESTAMP WITH TIME ZONE,
    next_follow_up_at TIMESTAMP WITH TIME ZONE,
    contact_count INTEGER DEFAULT 0,
    
    -- Campaign Tracking
    campaign_ids UUID[] DEFAULT '{}',
    
    -- GoHighLevel Sync
    ghl_contact_id TEXT,
    ghl_synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(workspace_id, email)
);

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS occ_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    pathway TEXT NOT NULL CHECK (pathway IN ('b2b', 'b2c', 'affiliate')),
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    
    -- Email Sequence
    email_sequence JSONB DEFAULT '[]',
    
    -- Targeting
    target_lead_ids UUID[] DEFAULT '{}',
    target_filters JSONB DEFAULT '{}',
    
    -- Schedule
    scheduled_start_at TIMESTAMP WITH TIME ZONE,
    scheduled_end_at TIMESTAMP WITH TIME ZONE,
    launched_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Statistics
    stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "replied": 0, "bounced": 0, "converted": 0}',
    
    -- GoHighLevel Sync
    ghl_campaign_id TEXT,
    ghl_synced_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OUTREACH QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS occ_outreach_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- References
    lead_id UUID REFERENCES occ_leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES occ_campaigns(id) ON DELETE SET NULL,
    
    -- Email Content
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    body_html TEXT,
    
    -- Template Reference
    template_id TEXT,
    template_variables JSONB DEFAULT '{}',
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed')),
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    message_id TEXT,
    resend_id TEXT,
    
    -- Engagement Tracking
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS / ACTIVITIES
-- ============================================
CREATE TABLE IF NOT EXISTS occ_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reference
    lead_id UUID REFERENCES occ_leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES occ_campaigns(id) ON DELETE SET NULL,
    queue_item_id UUID REFERENCES occ_outreach_queue(id) ON DELETE SET NULL,
    
    -- Activity Details
    type TEXT NOT NULL CHECK (type IN ('email_sent', 'email_opened', 'email_clicked', 'email_replied', 'email_bounced', 'call_made', 'meeting_scheduled', 'meeting_completed', 'note_added', 'status_changed', 'stage_changed', 'task_created', 'task_completed')),
    
    -- Content
    subject TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Direction
    direction TEXT CHECK (direction IN ('outbound', 'inbound')),
    
    -- Timestamps
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEMPLATES
-- ============================================
CREATE TABLE IF NOT EXISTS occ_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Classification
    pathway TEXT NOT NULL CHECK (pathway IN ('b2b', 'b2c', 'affiliate')),
    category TEXT NOT NULL CHECK (category IN ('Initial Outreach', 'Follow-up', 'Nurture', 'Conversion', 'Re-engagement')),
    
    -- Content
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    body_html TEXT,
    
    -- Variables
    variables TEXT[] DEFAULT '{}',
    
    -- Tone & Style
    tone TEXT,
    
    -- Usage Stats
    usage_count INTEGER DEFAULT 0,
    avg_open_rate DECIMAL(5,2),
    avg_reply_rate DECIMAL(5,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RESEARCH SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS occ_research_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Query Details
    query TEXT NOT NULL,
    pathway TEXT NOT NULL CHECK (pathway IN ('b2b', 'b2c', 'affiliate')),
    industry TEXT,
    location TEXT,
    company_size TEXT,
    
    -- Results
    results JSONB DEFAULT '[]',
    result_count INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    error_message TEXT,
    
    -- AI Processing
    ai_model TEXT,
    ai_prompt TEXT,
    ai_response TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GHL CONNECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS occ_ghl_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Connection Details
    location_id TEXT NOT NULL,
    company_id TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Settings
    sync_leads BOOLEAN DEFAULT TRUE,
    sync_campaigns BOOLEAN DEFAULT TRUE,
    sync_activities BOOLEAN DEFAULT TRUE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_sync_status TEXT,
    last_sync_error TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS occ_user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES occ_workspaces(id) ON DELETE SET NULL,
    
    -- Daily Limits
    max_daily_emails INTEGER DEFAULT 20,
    min_time_between_emails INTEGER DEFAULT 15,
    
    -- Follow-up Schedule
    follow_up_schedule INTEGER[] DEFAULT '{3, 7, 14, 30}',
    
    -- Sender Info
    from_name TEXT DEFAULT 'Babs Carroll',
    from_email TEXT DEFAULT 'babs@sacredkaleidoscope.community',
    reply_to_email TEXT DEFAULT 'babs@sacredkaleidoscope.community',
    
    -- Links
    calendar_link TEXT DEFAULT 'https://calendly.com/sacredkaleidoscope/alignment-call',
    
    -- API Keys (encrypted in production)
    openai_api_key TEXT,
    resend_api_key TEXT,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    daily_digest BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_occ_leads_workspace ON occ_leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_occ_leads_user ON occ_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_occ_leads_pathway ON occ_leads(pathway);
CREATE INDEX IF NOT EXISTS idx_occ_leads_status ON occ_leads(status);
CREATE INDEX IF NOT EXISTS idx_occ_leads_email ON occ_leads(email);
CREATE INDEX IF NOT EXISTS idx_occ_leads_score ON occ_leads(score DESC);

CREATE INDEX IF NOT EXISTS idx_occ_campaigns_workspace ON occ_campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_occ_campaigns_status ON occ_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_occ_campaigns_pathway ON occ_campaigns(pathway);

CREATE INDEX IF NOT EXISTS idx_occ_queue_status ON occ_outreach_queue(status);
CREATE INDEX IF NOT EXISTS idx_occ_queue_scheduled ON occ_outreach_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_occ_queue_lead ON occ_outreach_queue(lead_id);

CREATE INDEX IF NOT EXISTS idx_occ_activities_lead ON occ_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_occ_activities_type ON occ_activities(type);
CREATE INDEX IF NOT EXISTS idx_occ_activities_occurred ON occ_activities(occurred_at);

CREATE INDEX IF NOT EXISTS idx_occ_templates_pathway ON occ_templates(pathway);
CREATE INDEX IF NOT EXISTS idx_occ_templates_category ON occ_templates(category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE occ_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_outreach_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_ghl_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_user_settings ENABLE ROW LEVEL SECURITY;

-- Workspace policies
CREATE POLICY "Users can view own workspaces" ON occ_workspaces
    FOR SELECT USING (owner_id = auth.uid());

-- Leads policies
CREATE POLICY "Users can view own leads" ON occ_leads
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own leads" ON occ_leads
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own leads" ON occ_leads
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own leads" ON occ_leads
    FOR DELETE USING (user_id = auth.uid());

-- Campaign policies
CREATE POLICY "Users can view own campaigns" ON occ_campaigns
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own campaigns" ON occ_campaigns
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own campaigns" ON occ_campaigns
    FOR UPDATE USING (user_id = auth.uid());

-- Queue policies
CREATE POLICY "Users can view own queue" ON occ_outreach_queue
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own queue items" ON occ_outreach_queue
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own queue items" ON occ_outreach_queue
    FOR UPDATE USING (user_id = auth.uid());

-- Activities policies
CREATE POLICY "Users can view own activities" ON occ_activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activities" ON occ_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Templates policies
CREATE POLICY "Users can view templates" ON occ_templates
    FOR SELECT USING (is_system = TRUE OR user_id = auth.uid());

-- Research sessions policies
CREATE POLICY "Users can view own research" ON occ_research_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own research" ON occ_research_sessions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User settings policies
CREATE POLICY "Users can view own settings" ON occ_user_settings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings" ON occ_user_settings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings" ON occ_user_settings
    FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_occ_leads_updated_at BEFORE UPDATE ON occ_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_campaigns_updated_at BEFORE UPDATE ON occ_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_outreach_queue_updated_at BEFORE UPDATE ON occ_outreach_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_templates_updated_at BEFORE UPDATE ON occ_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_research_sessions_updated_at BEFORE UPDATE ON occ_research_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_ghl_connections_updated_at BEFORE UPDATE ON occ_ghl_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occ_user_settings_updated_at BEFORE UPDATE ON occ_user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO occ_activities (user_id, workspace_id, lead_id, type, content, occurred_at)
    VALUES (
        NEW.user_id,
        NEW.workspace_id,
        NEW.lead_id,
        CASE 
            WHEN NEW.status = 'sent' THEN 'email_sent'
            WHEN NEW.status = 'opened' THEN 'email_opened'
            WHEN NEW.status = 'replied' THEN 'email_replied'
            ELSE 'email_sent'
        END,
        jsonb_build_object('subject', NEW.subject, 'status', NEW.status),
        NOW()
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to log queue activity
CREATE TRIGGER log_queue_activity AFTER UPDATE ON occ_outreach_queue
    FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_activity();
