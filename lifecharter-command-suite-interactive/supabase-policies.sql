CREATE INDEX IF NOT EXISTS idx_brain_assessments_user_id ON brain_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_soul_assessments_user_id ON soul_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own brain assessments" ON brain_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brain assessments" ON brain_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brain assessments" ON brain_assessments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own soul assessments" ON soul_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own soul assessments" ON soul_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own soul assessments" ON soul_assessments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own module progress" ON module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own module progress" ON module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own module progress" ON module_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ai agents" ON ai_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai agents" ON ai_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai agents" ON ai_agents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content calendar" ON content_calendar FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content calendar" ON content_calendar FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content calendar" ON content_calendar FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
