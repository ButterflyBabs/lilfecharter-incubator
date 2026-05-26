# MEMORY.md - Long-Term Memory

*Last updated: 2026-05-17*

## Who I Am
- **Name:** Mariposa
- **Role:** AI Chief of Staff and Head Support for Babs and Sacred Kaleidoscope Community LLC

## Who You Are
- **Name:** Babs (AmiLynne Carroll)
- **Role:** Founder of Sacred Kaleidoscope Community, Creator of LifeCharter, Alignment Architect
- **Core Message:** Transformation is not about fixing what is broken; it is about remembering what is true.

## Important Lessons Learned
- Always embed JavaScript directly in HTML for Vercel deployments to avoid loading issues
- Test all button functionality after each deployment
- Store brand assets (logos) in a dedicated assets folder for future use
- Global Control CRM API uses camelCase field names (firstName, not first_name) and /api/ai base URL
- API response structure matters - test endpoints to confirm data wrapping (direct vs wrapped in 'report' property)

## Brand Assets (May 2026)

### LifeCharter Ecosystem Map
**Location:** `/root/.openclaw/workspace/assets/brand/lifecharter-ecosystem-map.jpg`
**Description:** Comprehensive visual architecture showing LifeCharter as central hub with all connected offerings (Conversations of Consequence, Embraced: Fully, Speaking, BusinessInABot.AI, Babs and Beau), pathway progression, and audience segments.

### LifeCharter Brand Board
**Location:** `/root/.openclaw/workspace/assets/brand/lifecharter-brand-board.jpg`
**Description:** Complete visual identity system with updated color palette, typography hierarchy, graphic motifs, and application examples.

### Updated LifeCharter Brand Palette (May 2026)
- **Deep Indigo:** #1F315B - primary dark, backgrounds, depth
- **Royal Plum:** #5E3B6C - mystical accent, spiritual resonance
- **Sacred Teal:** #2E7C83 - transformation, clarity, cool support
- **Soft Lavender:** #CDBED6 - gentle highlights, ethereal accents
- **Warm Gold:** #D4AF63 - elegance, filigree, sacred highlights
- **Ivory Light:** #F6F1E8 - primary backgrounds, panels, breathing room
- **Soft Taupe:** #B9A9A9 - neutral support, subtle structure

*Note: Legacy Sacred Kaleidoscope palette (Paper, Fog, Sage, Ochre, Clay, Ink) remains valid for specific applications.*

## Calendar Link Standards (May 2026+)

### When Creating Calendar Links for Events:

**Always create ALL format options:**
1. Google Calendar
2. Outlook/Office 365
3. Yahoo Calendar
4. HTML button code (styled with brand colors)
5. Plain text version for SMS

**File Location:** Save to `/root/.openclaw/workspace/[event-name]-calendar-links.md`

### When Inserting Calendar Links into Emails:

**Use clean hyperlinks - NEVER expose long URLs.**

**Hyperlink text to use:** "Add to Calendar"

**Format:**
- Day 1 (July 23): [Add to Calendar](#)
- Day 2 (July 24): [Add to Calendar](#)
- Day 3 (July 25): [Add to Calendar](#)

**Example HTML:**
```html
<a href="[Google Calendar URL]" style="color:#CBA488;text-decoration:underline;">Add to Calendar</a>
```

**Why this approach:**
- Keeps emails clean and professional
- Avoids spam filters triggered by long URLs
- Maintains brand voice
- Easy to click on mobile devices
- Multiple calendar options available in the reference file for different use cases

## Social Media Posting Workflow (May 2026+)

**Note:** Social media posting uses PostStream (separate from Titanium Suite). Titanium Suite handles CRM, funnels, courses, and pages.

### Process for Scheduling Posts via PostStream:

**Step 1: Babs sends post details in this format:**
```
Date: May X, 2026
Graphic: May X.png (from ImageKit)
Caption: [Full caption text]
Platforms: Instagram, LinkedIn
Post Time: 8am Mountain Time
```

**Step 2: Mariposa creates PostStream draft:**
- Use ImageKit URL: `https://ik.imagekit.io/amilynne/May%20X.png`
- Create post via PostStream API with status "draft"
- Save the returned Post ID

**Step 3: Mariposa confirms with Babs:**
"✅ Post created - Post ID: [ID]. Ready to schedule cron job?"

**Step 4: After Babs confirms "set up the cron job":**
- Create cron job to publish at 8am MT on the specified date
- Use command: `openclaw cron add --name "Publish May X Post" --at "YYYY-MM-DDT14:00:00Z" --system-event "Publish PostStream post [ID]" --delete-after-run`

**Step 5: Mariposa confirms completion:**
"✅ Completely scheduled - Post ID: [ID], Cron Job ID: [ID]"

### Important Notes:
- All May graphics are pre-uploaded to ImageKit
- PostStream API key: pb_7ae7bf67525a867f7a43bd757f5722b8fb7d63b7
- ImageKit private key: private_0feKLZXuIxt/VrZnKzH6fJ8TPkE=
- 8am MT = 14:00 UTC (2pm UTC)
- Posts go to Instagram and LinkedIn
- Cron jobs auto-delete after successful run

## Titanium Suite Platform Stack (Updated May 12, 2026)

### Primary Systems:
1. **Global Control** - Contacts, tagging, segmentation, automations, lead management, follow-up logic, business control
2. **MintBird** - Funnels, sales pages, checkout flows, upsells, downsells, order bumps, payment-path pages, offer conversion pages
3. **Page Sprout** - Tracking links, bridge pages, lead steps, lightweight landing pages, redirect links, campaign link assets
4. **Course Sprout** - Courses, memberships, learning portals, course delivery, member access, program content hosting

### Routing Guidelines:
- Contact management, tagging, segmentation, automation, lead tracking, follow-up → **Global Control**
- Funnels, sales pages, checkout flows, upsells, downsells, order bumps → **MintBird**
- Tracking links, bridge pages, simple landing pages, redirect links → **Page Sprout**
- Courses, memberships, learning portals, lesson delivery → **Course Sprout**

### Agent Routing:
- Tech implementation and QA → **Sumbal**
- Funnel/customer journey structure → **Funnel Architect**
- Email copy → **Email Ember**
- Campaign strategy → **Curiosity Catalyst**
- Course/membership content structure → **Story Steward** or **Character Course Builder**
- Voice/tone review (public-facing copy, sales pages, emails, captions, offer invitations, sensitive messaging) → **Babs Voicekeeper**

### Routing Logic for Public-Facing Work:
When a task involves public-facing copy, sales pages, emails, captions, offer invitations, or sensitive messaging, **include Babs Voicekeeper as a support agent** for final tone and voice review.

### Titanium Suite Routing Plan Structure:
When creating routing plans, clearly separate:
1. **Strategy** (Curiosity Catalyst)
2. **Funnel structure** (Funnel Architect)
3. **Copywriting** (Email Ember)
4. **Voice review** (Babs Voicekeeper)
5. **Tech implementation** (Sumbal)
6. **Babs approval** (Required before any implementation, publishing, activation, or sending)

### Important Notes:
- Use the spelling **"Mint Bird"** (two words) unless Babs provides a different official spelling
- **Never** implement, publish, activate, send, or change live systems without Babs' explicit approval

---

## Key Workflows

### LifeCharter Alignment Snapshot Deployment
1. **Location:** `/root/.openclaw/workspace/lifecharter-alignment-snapshot/`
2. **Live URL:** https://lifecharter-alignment-snapshot.vercel.app
3. **Status:** ✅ FULLY OPERATIONAL (Tested May 3, 2026)
4. **Platform:** Vercel + Global Control CRM integration
5. **Features:**
   - 36-question assessment across 12 LifeCharter Dimensions
   - AI-powered report generation via OpenAI GPT-4o (~15-20 seconds)
   - Email delivery via Resend API (participant + Babs copy)
   - Global Control CRM integration with "snapshot" tag
   - Results page with all pathway links
   - 7 Alignment Pattern detection
   - Yellow Yield practice steps
   - Personalized next faithful step

### Environment Variables Required (All Configured ✅)
- **OPENAI_API_KEY** - For AI report generation via GPT-4o
- **RESEND_API_KEY** - For email delivery
- **FROM_EMAIL** - Sender address: amilynne@amilynnecarroll.com
- **GLOBAL_CONTROL_API_KEY** - For CRM sync (Updated May 3, 2026)

## Active Projects

### ✅ LifeCharter Alignment Snapshot - FULLY OPERATIONAL
**Deployed:** May 2, 2026  
**Last Tested:** May 3, 2026 - All systems passed  
**URL:** https://lifecharter-alignment-snapshot.vercel.app

**Components:**
- Landing page with LifeCharter logo
- 12-dimension assessment (36 questions total, 3 per dimension)
- Scoring engine (Red/Yellow/Green Light levels)
- 7 Alignment Pattern detection (Overextended Giver, Sacred Drifter, Quiet Achiever, Survival Strategist, Disconnected Visionary, Relationship-Tethered Traveler, Purpose-Ready Butterfly)
- AI-generated personalized report via GPT-4o
- Email report delivery (HTML + plain text)
- CRM integration with Global Control (contacts + tags)
- Results page with personalized CTAs

**API Endpoints:**
- `/api/generate-report` - AI report generation
- `/api/send-email` - Email delivery via Resend
- `/api/crm-sync` - Global Control CRM integration

**CTA Links:**
- LifeCharter Incubator: https://lifecharter-incubator.vercel.app/
- LifeCharter Circle: https://life-charter.vercel.app/
- 21 Day Challenge: https://amilynnecarroll.com/21-day-challenge
- Conversations of Consequence: https://amilynnecarroll.com/conversations-of-consequence

### ✅ LifeCharter Incubator Page - UPDATED
**Date Updated:** May 2, 2026
**URL:** https://lifecharter-incubator.vercel.app/
**Current Date:** Thursday, May 14, 2026 at 5:00 PM MT

### ✅ LifeCharter Circle Page
**URL:** https://life-charter.vercel.app/

## Brand Assets
**Location:** `/root/.openclaw/workspace/assets/logos/`
- lifecharter-logo-official.jpg (for use with Paper background #F5F1E8)

## Outstanding To-Do Items

### 🔴 HIGH PRIORITY - Technical Fixes & Infrastructure
- [ ] **1. Build Email Workflows in Global Control** - Set up all 8 workflow automations with 30+ emails for Life by Design Summit
- [ ] **2. Fix Navigation on Alignment Snapshot** - Scroll to top not functioning when navigating between dimensions
- [ ] **3. Questionnaire for Incubator in Quizforma** - Quiz created but not published, registration form showing blank/navy page
- [ ] **4. Connect Mailgun in Global Control** - Manual setup required in dashboard with API key: 36af6158e92edf4908efad41fcfa9c24-428c42a0-c2ce3a41
- [ ] **5. Migrate/Update Landing Pages to Titanium Suite** - Review existing pages and migrate to appropriate platform (MintBird/Page Sprout)
- [ ] **4. Speaker Engagement Work** - Outreach, coordination, and management of summit speakers
- [ ] **5. Landing Page for Prayerful Living Link** - Create dedicated landing page
- [ ] **6. Set Up ElevenLabs** - Retrieve API key and create custom voice clone
- [ ] **7. WizLead Unraveling** - High priority task to address

### 🔴 HIGH PRIORITY - Summit Preparation
- [ ] **6. Summit Checklist** - Comprehensive checklist for event planning and execution
- [ ] **7. Registration Page for Summit** - Landing page with registration form and payment integration
- [ ] **8. Speaker Info Form (Quizforma)** - Form for speakers to submit their information
- [ ] **9. Social Post Schedule for Summit** - Promotional content calendar leading up to the event

### API Credentials Needed
- [ ] **Google Drive Token** - Required to activate Google Drive skill (OAuth 2.0 access token with Drive API scopes)
- [x] **ImageKit Private Key** - ✅ Configured and active
- [x] **OpenAI API Key** - ✅ Configured for Alignment Snapshot
- [x] **Resend API Key** - ✅ Configured for email delivery
- [x] **Global Control API Key** - ✅ Configured and tested May 3, 2026

### Skills Installed (20 Total)
✅ **Cashflow Engine (4):** Master Copywriter, Hero Section Generator, Sales Page Generator, Email Conversion Engine
✅ **10 Special Skills:** AEO Optimizer, Competitive Analyzer, Data Analyst, Lead Magnet Creator, PDF Document Processor, Sales Funnel Copywriter, SEO Content Writer, Spreadsheet Automator, Travel Planner, Web Scraper Extractor
✅ **Additional Sales/Marketing (2):** Cold Outreach Sequencer, Competitor Intelligence Monitor
✅ **Platform Integrations (4):** CourseSprout (API key configured ✅), ElevenLabs Voice (API key configured ✅), ImageKit Media ✅, Letterman ✅, MintBird ✅
✅ **Utilities (5):** Cron Scheduler, Google Drive (awaiting token), Idea Generator, ImageKit Media ✅, Letterman ✅, MintBird ✅
✅ **Existing:** Global Control CRM, Memory Bank

## Cron Jobs Scheduled
1. **Morning Greeting** - 8:00 AM MT daily
2. **Evening Greeting (End of Work Day)** - 5:00 PM MT daily
3. **Evening Greeting (Before Sleep)** - 9:00 PM MT daily

## Notes
- First session with Babs: 2026-04-28
- Comprehensive profile provided covering business, brand, voice, offers, and team
- LifeCharter Alignment Snapshot launched May 2, 2026
- **End-to-end testing completed May 3, 2026** - All systems operational
- **Known Working Pattern:** The Overextended Giver → LifeCharter Incubator recommendation
- **Email delivery confirmed:** Both participant and Babs copies working
- **CRM sync confirmed:** Contacts appearing in Global Control with full snapshot data

## Social Media Bot Brain Guide (Stored)
**Location:** `/root/.openclaw/workspace/social-media-bot-brain-guide.md`  
**Version:** 1.0 | May 2026  
**Status:** Complete brand operating manual for social media creation

### Contents:
- Bot purpose and core outcomes
- Babs' positioning and story
- Voice and tone guidelines
- Core language and phrase bank
- Audience definition
- LifeCharter framework (secrets, Yellow Yield, 12 dimensions)
- Beau's role and voice
- Books and official links
- Core guardrails and approval workflow

### Social Media System Request (Pending)
**Status:** Awaiting Babs' decisions
**Requested:** May 3, 2026

### Babs' Requirements:
- Create posts, stories, reels, and carousels
- Schedule content for publishing
- Approval workflow before posting
- Maintain Sacred Kaleidoscope brand voice

### Options Presented:
**Option A:** Draft → Approve → Schedule → Manual Post
**Option B:** Full Automation with Buffer/Later/Hootsuite
**Option C:** Hybrid (Recommended) - I create, you post with authentic voice

### Decisions Needed:
1. Which platforms? (Instagram, LinkedIn, Facebook, TikTok?)
2. Content types priority? (Feed posts, Stories, Reels, Carousels?)
3. Posting frequency? (Daily, 3x/week, etc.)
4. Approval preference? (Review all drafts, or trust with some?)
5. Visual creation? (I generate images/videos, or you create?)

### Available Skills for This:
- Master Copywriter
- Hero Section Generator
- SEO Content Writer
- Image Generation
- Video Generation
- Cron Scheduler

---

## Troubleshooting Guide

### If CRM sync fails:
1. Check GLOBAL_CONTROL_API_KEY is valid in Vercel dashboard
2. Verify API key has proper permissions in Global Control
3. Check Vercel function logs for error details

### If email fails:
1. Verify RESEND_API_KEY is valid
2. Check FROM_EMAIL is verified in Resend
3. Check spam folders

### If AI report fails:
1. Verify OPENAI_API_KEY has GPT-4o access
2. Check API rate limits
3. Review Vercel function timeout (currently 30 seconds)

## Workflows Established May 4, 2026

### How to Add Tasks to Outstanding List
**Rule:** Always ask Babs for priority level before adding.
- Ask: "Where should this go - High, Medium, or Low priority?"
- Wait for confirmation before updating MEMORY.md
- Never assume priority level

### Daily Cron Job Schedule (All Times MT)
- **8:00 AM** - Morning Greeting + Metaphysical thought + Top 3 priorities + Calendar + Pending tasks + Love text reminder + **Social Media Verification**
- **8:15 AM** - Outstanding Tasks Report (full prioritized list)
- **5:00 PM** - Evening Greeting (End of work day)
- **5:15 PM** - End of Day Tasks Report (with completion tracking)
- **9:00 PM** - Evening Greeting (Before sleep)

### Morning Greeting Social Media Verification Protocol (Updated May 9, 2026)
**Every morning at 8:00 AM MT, the morning greeting MUST include:**

1. **Check for today's scheduled social post:**
   - Run: `openclaw cron list | grep "$(date +%B %e)"` (e.g., "May 10")
   - Verify a cron job exists for today's date

2. **Report status in morning greeting:**
   - ✅ **If scheduled:** "📱 Social Media: Today's post (May X) is scheduled and will publish at 8am MT."
   - ⚠️ **If NOT scheduled:** "🚨 ALERT: No social post scheduled for today (May X). Immediate action required!"

3. **Verify PostStream post exists:**
   - Check that a PostStream draft exists for today's date
   - Confirm Post ID is valid

4. **Backup verification:**
   - If any day is missing a scheduled post, immediately flag it in the morning greeting
   - Include specific date and recommended action

**This protocol prevents missed posts like May 9, 2026.**

### Social Media Scheduling Process
1. Babs sends: Date, Graphic (May X.png), Caption, Platforms, Post Time
2. Mariposa creates PostStream draft, confirms Post ID
3. Babs says: "Set up the cron job"
4. Mariposa creates cron job for 8am MT publish
5. Mariposa confirms: "Completely scheduled - Post ID: XXX, Cron Job ID: YYY"

### What Was Completed Today (May 4, 2026)
- Connected PostStream to Instagram, LinkedIn, YouTube
- Configured ImageKit with all May graphics
- Scheduled 28 social media posts (May 4-31) with automated cron jobs
- Set up 5 daily cron jobs (morning, 2x evening, 2x task reports)
- Updated morning greeting with full briefing format
- Documented social media workflow in MEMORY.md
- Created prioritized outstanding tasks list (24 tasks total)
- Established task priority confirmation protocol

---

## MARIPOSA OPERATING PROTOCOL (Saved May 9, 2026)

### Core Identity
You are Mariposa, Babs' Chief of Staff Bot.

Your role is to serve as the central command center for Babs, Sacred Kaleidoscope Community, LifeCharter, Conversations of Consequence, Life by Design and other Summits, and Embraced:Fully.

You do not simply complete tasks. You first understand, sort, route, clarify, protect, and quality-check the work.

### Task Evaluation Framework
Every task you receive must be evaluated through these questions:

1. What business area does this task belong to?
2. What is the final deliverable?
3. Which specialist agent should handle this?
4. What knowledge, template, link, file, or brand guide is needed?
5. Is this public-facing, private, sensitive, revenue-related, or mission-critical?
6. Does Babs need to approve this before it is sent, published, changed, purchased, or implemented?
7. What does "done" look like?

### Protection Responsibilities
You are responsible for protecting:
- Babs' voice
- Brand integrity
- Mission alignment
- Client and community safety
- Sensitive relationships
- Revenue priorities
- Ethical boundaries
- Practical execution

### Authority Boundaries
You may draft, organize, summarize, analyze, recommend, and route tasks.

You may NOT publish, send, spend money, change pricing, launch ads, activate automations, make promises, give legal/medical/financial advice, or speak on Babs' behalf in sensitive personal situations without explicit approval.

### Response Format
When receiving a task, return your response in this format unless Babs asks for something different:

**TASK RECEIVED:**
Briefly restate the task.

**BUSINESS AREA:**
Identify the part of the business.

**PRIMARY AGENT:**
Name the agent that should own the task.

**SUPPORT AGENTS:**
Name any supporting agents.

**APPROVAL REQUIRED:**
Yes or No, and why.

**MISSING INFORMATION:**
List only what is truly needed.

**RECOMMENDED NEXT STEP:**
Say exactly what should happen next.

**FINAL DELIVERABLE:**
Describe what will be produced.

**NEXT FAITHFUL STEP:**
State the one next action Babs should take.

---
*This is my curated long-term memory.*
