-- Supabase Database Setup for Sales Command Module
-- Run this in the Supabase SQL Editor to create Sales Command tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SALES COMMAND TABLES
-- ============================================

-- Ideal Client Profile (ICP) table
CREATE TABLE IF NOT EXISTS sales_icp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titles TEXT,
    industries TEXT,
    company_size TEXT,
    revenue_range TEXT,
    pain_points TEXT,
    desired_outcomes TEXT,
    buying_triggers TEXT,
    must_haves TEXT,
    red_flags TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Leads table
CREATE TABLE IF NOT EXISTS sales_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    title TEXT,
    company TEXT,
    company_size TEXT,
    industry TEXT,
    linkedin_url TEXT,
    website TEXT,
    notes TEXT,
    source TEXT DEFAULT 'Manual',
    status TEXT DEFAULT 'New',
    fit_score INTEGER DEFAULT 0,
    match_reasons TEXT,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS sales_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    status TEXT DEFAULT 'Draft',
    target_lead_count INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    replies_received INTEGER DEFAULT 0,
    meetings_booked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    launched_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Campaign Emails (sequence steps) table
CREATE TABLE IF NOT EXISTS sales_campaign_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES sales_campaigns(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    delay_days INTEGER DEFAULT 0,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign to Leads junction table
CREATE TABLE IF NOT EXISTS sales_campaign_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES sales_campaigns(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, lead_id)
);

-- Opportunities (Pipeline) table
CREATE TABLE IF NOT EXISTS sales_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES sales_campaigns(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    value DECIMAL(12,2) DEFAULT 0,
    stage TEXT DEFAULT 'New Lead',
    probability INTEGER DEFAULT 0,
    expected_close_date DATE,
    actual_close_date DATE,
    close_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity Activities table
CREATE TABLE IF NOT EXISTS sales_opportunity_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES sales_opportunities(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inbox/Replies table
CREATE TABLE IF NOT EXISTS sales_inbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES sales_campaigns(id) ON DELETE SET NULL,
    subject TEXT,
    body TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sales_icp_user_id ON sales_icp(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_user_id ON sales_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_fit_score ON sales_leads(fit_score);
CREATE INDEX IF NOT EXISTS idx_sales_campaigns_user_id ON sales_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_campaigns_status ON sales_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sales_campaign_emails_campaign_id ON sales_campaign_emails(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sales_campaign_leads_campaign_id ON sales_campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sales_campaign_leads_lead_id ON sales_campaign_leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_user_id ON sales_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_stage ON sales_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_sales_opportunity_activities_opportunity_id ON sales_opportunity_activities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_sales_inbox_user_id ON sales_inbox(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_inbox_is_read ON sales_inbox(is_read);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all Sales Command tables
ALTER TABLE sales_icp ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_campaign_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunity_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_inbox ENABLE ROW LEVEL SECURITY;

-- ICP policies
CREATE POLICY "Users can view own ICP" ON sales_icp
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ICP" ON sales_icp
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ICP" ON sales_icp
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ICP" ON sales_icp
    FOR DELETE USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can view own leads" ON sales_leads
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON sales_leads
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON sales_leads
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON sales_leads
    FOR DELETE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON sales_campaigns
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON sales_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON sales_campaigns
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON sales_campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- Campaign Emails policies
CREATE POLICY "Users can view campaign emails" ON sales_campaign_emails
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_emails.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert campaign emails" ON sales_campaign_emails
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_emails.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update campaign emails" ON sales_campaign_emails
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_emails.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete campaign emails" ON sales_campaign_emails
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_emails.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );

-- Campaign Leads policies
CREATE POLICY "Users can view campaign leads" ON sales_campaign_leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_leads.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert campaign leads" ON sales_campaign_leads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_leads.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update campaign leads" ON sales_campaign_leads
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_leads.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete campaign leads" ON sales_campaign_leads
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM sales_campaigns 
            WHERE sales_campaigns.id = sales_campaign_leads.campaign_id 
            AND sales_campaigns.user_id = auth.uid()
        )
    );

-- Opportunities policies
CREATE POLICY "Users can view own opportunities" ON sales_opportunities
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own opportunities" ON sales_opportunities
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON sales_opportunities
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON sales_opportunities
    FOR DELETE USING (auth.uid() = user_id);

-- Opportunity Activities policies
CREATE POLICY "Users can view opportunity activities" ON sales_opportunity_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sales_opportunities 
            WHERE sales_opportunities.id = sales_opportunity_activities.opportunity_id 
            AND sales_opportunities.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert opportunity activities" ON sales_opportunity_activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM sales_opportunities 
            WHERE sales_opportunities.id = sales_opportunity_activities.opportunity_id 
            AND sales_opportunities.user_id = auth.uid()
        )
    );

-- Inbox policies
CREATE POLICY "Users can view own inbox" ON sales_inbox
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inbox" ON sales_inbox
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inbox" ON sales_inbox
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inbox" ON sales_inbox
    FOR DELETE USING (auth.uid() = user_id);

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

CREATE TRIGGER update_sales_icp_updated_at BEFORE UPDATE ON sales_icp
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_leads_updated_at BEFORE UPDATE ON sales_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_campaigns_updated_at BEFORE UPDATE ON sales_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_campaign_emails_updated_at BEFORE UPDATE ON sales_campaign_emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_opportunities_updated_at BEFORE UPDATE ON sales_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- REALTIME SUBSCRIPTIONS (optional)
-- ============================================

-- Add tables to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE sales_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE sales_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE sales_inbox;
ALTER PUBLICATION supabase_realtime ADD TABLE sales_campaigns;