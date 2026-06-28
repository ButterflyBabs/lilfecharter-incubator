-- Phase 1: Foundation - Lead Management Tables
-- Sacred Sales System - LifeCharter Command Suite
-- Created: June 24, 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE IDENTITY TABLES
-- ============================================

-- Organizations (companies/entities)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    size TEXT, -- '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
    revenue_range TEXT,
    website TEXT,
    linkedin_url TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'America/Denver',
    description TEXT,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Contacts (individuals)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    job_title TEXT,
    department TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    preferred_contact_method TEXT DEFAULT 'email', -- 'email', 'phone', 'text'
    timezone TEXT DEFAULT 'America/Denver',
    notes TEXT,
    tags TEXT[],
    is_primary_contact BOOLEAN DEFAULT FALSE,
    do_not_contact BOOLEAN DEFAULT FALSE,
    consent_status TEXT DEFAULT 'pending', -- 'pending', 'granted', 'withdrawn'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Contact-Organization Relationships (many-to-many)
CREATE TABLE IF NOT EXISTS contact_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    role TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_id, organization_id)
);

-- ============================================
-- LEAD MANAGEMENT TABLES
-- ============================================

-- Lead Sources (where leads come from)
CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'organic', 'paid', 'referral', 'event', 'partner', 'other'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    cost_per_lead DECIMAL(10,2),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Seed default lead sources
INSERT INTO lead_sources (name, category, description) VALUES
('Website Form', 'organic', 'Organic website form submission'),
('Referral', 'referral', 'Referred by existing client or contact'),
('Social Media', 'organic', 'Inbound from social media channels'),
('LifeCharter Incubator', 'event', 'Attended free workshop'),
('Conversations of Consequence', 'organic', 'Discovered through daily content'),
('Direct Outreach', 'outbound', 'Proactive outreach by team'),
('Partner Referral', 'partner', 'Referred by strategic partner'),
('Paid Advertising', 'paid', 'Facebook, Google, or other paid ads'),
('Speaking/Event', 'event', 'Met at conference or speaking event'),
('Other', 'other', 'Uncategorized or miscellaneous source')
ON CONFLICT DO NOTHING;

-- Leads (potential prospects)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    
    -- Organization Info (denormalized for quick access)
    organization_name TEXT,
    job_title TEXT,
    
    -- Source Tracking
    lead_source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,
    source_detail TEXT, -- Specific campaign, referrer name, etc.
    landing_page TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Status & Ownership
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'nurture', 'disqualified', 'converted'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Scoring
    fit_score INTEGER DEFAULT 0, -- 0-100
    engagement_score INTEGER DEFAULT 0, -- 0-100
    intent_score INTEGER DEFAULT 0, -- 0-100
    total_score INTEGER GENERATED ALWAYS AS (fit_score + engagement_score + intent_score) STORED,
    
    -- Qualification
    budget_status TEXT, -- 'unknown', 'no_budget', 'budget_approved', 'budget_pending'
    authority_status TEXT, -- 'unknown', 'decision_maker', 'influencer', 'recommender'
    need_status TEXT, -- 'unknown', 'no_need', 'pain_identified', 'solution_aware'
    timeline_status TEXT, -- 'unknown', 'no_timeline', 'this_quarter', 'next_quarter', 'this_year'
    
    -- Contact Preferences
    preferred_contact_method TEXT DEFAULT 'email',
    timezone TEXT DEFAULT 'America/Denver',
    do_not_contact BOOLEAN DEFAULT FALSE,
    consent_status TEXT DEFAULT 'pending',
    
    -- Enrichment Data
    linkedin_url TEXT,
    website TEXT,
    industry TEXT,
    company_size TEXT,
    
    -- Research Notes
    trigger_event TEXT,
    fit_rationale TEXT,
    observed_challenge TEXT,
    research_notes TEXT,
    
    -- Conversion Tracking
    converted_to_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    converted_to_opportunity_id UUID, -- Will reference opportunities table in Phase 4
    converted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    first_contact_at TIMESTAMP WITH TIME ZONE,
    last_contact_at TIMESTAMP WITH TIME ZONE,
    next_follow_up_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Lead Scoring History (track score changes over time)
CREATE TABLE IF NOT EXISTS lead_score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    fit_score INTEGER,
    engagement_score INTEGER,
    intent_score INTEGER,
    total_score INTEGER,
    reason TEXT, -- Why the score changed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Activity Log (all interactions)
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'email_sent', 'email_opened', 'email_clicked', 'call_made', 'call_received', 'meeting_scheduled', 'meeting_completed', 'note_added', 'status_changed', 'score_changed'
    direction TEXT, -- 'inbound', 'outbound' (for communications)
    subject TEXT,
    content TEXT,
    outcome TEXT, -- 'no_response', 'replied', 'interested', 'not_interested', 'meeting_booked', etc.
    sentiment TEXT, -- 'positive', 'neutral', 'negative'
    metadata JSONB, -- Flexible storage for additional data
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Tags (many-to-many)
CREATE TABLE IF NOT EXISTS lead_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lead_id, tag)
);

-- Duplicate Detection Candidates
CREATE TABLE IF NOT EXISTS duplicate_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    duplicate_lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    match_reason TEXT NOT NULL, -- 'email', 'phone', 'name_company', 'linkedin'
    match_confidence DECIMAL(3,2), -- 0.00 to 1.00
    status TEXT DEFAULT 'pending', -- 'pending', 'merged', 'dismissed', 'not_duplicate'
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(primary_lead_id, duplicate_lead_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);
CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);

-- Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_do_not_contact ON contacts(do_not_contact) WHERE do_not_contact = TRUE;

-- Contact Organizations
CREATE INDEX IF NOT EXISTS idx_contact_orgs_contact ON contact_organizations(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_orgs_org ON contact_organizations(organization_id);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_converted ON leads(converted_to_contact_id) WHERE converted_to_contact_id IS NOT NULL;

-- Lead Activities
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created ON lead_activities(created_at DESC);

-- Duplicate Candidates
CREATE INDEX IF NOT EXISTS idx_duplicates_primary ON duplicate_candidates(primary_lead_id);
CREATE INDEX IF NOT EXISTS idx_duplicates_status ON duplicate_candidates(status) WHERE status = 'pending';

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_candidates ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can view organizations they own or created
CREATE POLICY "Users can view own organizations" ON organizations
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own organizations" ON organizations
    FOR UPDATE USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Contacts: Users can view contacts they own or created
CREATE POLICY "Users can view own contacts" ON contacts
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert contacts" ON contacts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own contacts" ON contacts
    FOR UPDATE USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Lead Sources: All users can view, only admins can modify
CREATE POLICY "Users can view lead sources" ON lead_sources
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can modify lead sources" ON lead_sources
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Leads: Users can view leads they own or created
CREATE POLICY "Users can view own leads" ON leads
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert leads" ON leads
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own leads" ON leads
    FOR UPDATE USING (
        owner_id = auth.uid() OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Lead Activities: Users can view activities for their leads
CREATE POLICY "Users can view lead activities" ON lead_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = lead_activities.lead_id 
            AND (leads.owner_id = auth.uid() OR leads.created_by = auth.uid())
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert lead activities" ON lead_activities
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Duplicate Candidates: Users can view candidates for their leads
CREATE POLICY "Users can view duplicate candidates" ON duplicate_candidates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = duplicate_candidates.primary_lead_id 
            AND (leads.owner_id = auth.uid() OR leads.created_by = auth.uid())
        ) OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_sources_updated_at BEFORE UPDATE ON lead_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Sample organizations (will be inserted via application)
-- Sample contacts (will be inserted via application)
-- Sample leads (will be inserted via application)

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE organizations IS 'Companies, businesses, or entities that contacts belong to';
COMMENT ON TABLE contacts IS 'Individual people in the system - prospects, clients, partners';
COMMENT ON TABLE leads IS 'Potential prospects who have not yet been qualified or converted';
COMMENT ON TABLE lead_sources IS 'Tracking where leads come from for attribution';
COMMENT ON TABLE lead_activities IS 'All interactions and touchpoints with leads';
COMMENT ON TABLE duplicate_candidates IS 'Potential duplicate leads identified by the system';
