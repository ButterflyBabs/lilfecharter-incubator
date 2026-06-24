-- Supabase Database Setup for LifeCharter Command Suite
-- Run this in the Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    business_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Brain.md assessment progress
CREATE TABLE IF NOT EXISTS brain_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section, question_id)
);

-- Soul.md assessment progress
CREATE TABLE IF NOT EXISTS soul_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section, question_id)
);

-- Module completion tracking
CREATE TABLE IF NOT EXISTS module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    module_name TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    progress_percent INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- AI Agent configurations
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    prompt_template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content calendar items
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    platform TEXT,
    scheduled_date DATE,
    status TEXT DEFAULT 'draft',
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings/profile
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_digest BOOLEAN DEFAULT TRUE,
    timezone TEXT DEFAULT 'America/Denver',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Value Proposition Assessment
CREATE TABLE IF NOT EXISTS business_value_proposition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_data JSONB DEFAULT '{}',
    progress_percent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    current_section INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brain_assessments_user_id ON brain_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_soul_assessments_user_id ON soul_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_business_value_proposition_user_id ON business_value_proposition(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_value_proposition ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for brain_assessments
CREATE POLICY "Users can view own brain assessments" ON brain_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain assessments" ON brain_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brain assessments" ON brain_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for soul_assessments
CREATE POLICY "Users can view own soul assessments" ON soul_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soul assessments" ON soul_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own soul assessments" ON soul_assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for module_progress
CREATE POLICY "Users can view own module progress" ON module_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress" ON module_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress" ON module_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for ai_agents
CREATE POLICY "Users can view own ai agents" ON ai_agents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai agents" ON ai_agents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai agents" ON ai_agents
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for content_calendar
CREATE POLICY "Users can view own content calendar" ON content_calendar
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content calendar" ON content_calendar
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content calendar" ON content_calendar
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for business_value_proposition
CREATE POLICY "Users can view own value proposition" ON business_value_proposition
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own value proposition" ON business_value_proposition
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own value proposition" ON business_value_proposition
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own value proposition" ON business_value_proposition
    FOR DELETE USING (auth.uid() = user_id);

-- Business Growth Strategy Assessment
CREATE TABLE IF NOT EXISTS business_growth_strategy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_data JSONB DEFAULT '{}',
    progress_percent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    current_section INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for business_growth_strategy
CREATE INDEX IF NOT EXISTS idx_business_growth_strategy_user_id ON business_growth_strategy(user_id);

-- Enable RLS on business_growth_strategy
ALTER TABLE business_growth_strategy ENABLE ROW LEVEL SECURITY;

-- Create policies for business_growth_strategy
CREATE POLICY "Users can view own growth strategy" ON business_growth_strategy
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own growth strategy" ON business_growth_strategy
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own growth strategy" ON business_growth_strategy
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own growth strategy" ON business_growth_strategy
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for activity_log
CREATE POLICY "Users can view own activity" ON activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: Service role key bypasses RLS, which is what we want for the API server