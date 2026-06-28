# Database Migration: SQLite to Supabase PostgreSQL

## Problem
The original implementation used SQLite with the database stored at `/tmp/lifecharter.db` on Vercel. Since `/tmp` is ephemeral and gets wiped on every deployment and serverless function invocation, user accounts and assessment data were not persisting.

## Solution
Migrated to **Supabase PostgreSQL** for persistent, scalable database storage.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be provisioned

### 2. Run the Database Setup Script

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a **New Query**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to create all tables and indexes

### 3. Get Your API Credentials

1. Go to **Project Settings** → **API**
2. Copy the **URL** (e.g., `https://abcdefgh12345678.supabase.co`)
3. Go to **Project Settings** → **Data API** → **service_role key** (or create one)
4. Copy the **service_role key** (starts with `eyJ...`)

### 4. Configure Environment Variables

Add these environment variables to your Vercel project:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=production
```

**In Vercel Dashboard:**
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add each variable above
4. Click **Save**
5. Redeploy your project

### 5. Test the Setup

1. Visit your deployed application
2. Create a new user account
3. Complete some assessment questions
4. Log out and log back in
5. Verify your data persists

## Database Schema

### Tables Created

- **users** - User accounts and profiles
- **brain_assessments** - Brain.md assessment answers
- **soul_assessments** - Soul.md assessment answers
- **module_progress** - Module completion tracking
- **ai_agents** - AI agent configurations
- **content_calendar** - Content calendar items
- **user_settings** - User preferences
- **activity_log** - Activity tracking

### Security

- Row Level Security (RLS) is enabled on all tables
- Service role key bypasses RLS (intended for server-side API)
- Each user can only access their own data

## Troubleshooting

### "Database not connected" Error
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set correctly
- Verify the environment variables are deployed (may need to redeploy)

### Tables Not Found
- Run the `supabase-setup.sql` script in the Supabase SQL Editor
- Verify tables were created by checking the Database → Tables section

### Authentication Issues
- Ensure `JWT_SECRET` is set and matches between deployments
- Check that the service role key has the necessary permissions

## Rollback (if needed)

To revert to SQLite (not recommended for production):
1. Restore the original `api/database.js` from git
2. Remove `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` environment variables
3. Redeploy

Note: Data will not be migrated back automatically.