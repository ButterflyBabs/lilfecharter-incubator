# OpenClaw Skills - Complete Command Reference
## All Installed Skills & Commands

---

## ✅ ACTIVE SKILLS (Ready to Use)

### 1. Control Board
**Trigger:** Auto-sync on skill install/config change
**Commands:**
- `/profile` - Get current user profile
- `/update-profile` - Update profile (name, company, phone)
- `/workspaces` - List all workspaces
- `/create-workspace` - Create new workspace
- `/rename-workspace` - Rename workspace
- `/delete-workspace` - Delete workspace (destructive)
- `/workspace-keys` - View workspace key flags
- `/settings` - Get workspace settings
- `/set-setting` - Update workspace setting
- `/control` - Get full Control Center state
- `/sync-control` - Sync bot config to Control Center
- `/update-control` - Partial update Control Center
- `/sync-spend` - Sync spend from AI providers
- `/clips` - List clips (pending/approved/published/rejected/all)
- `/approved-clips` - Get approved clips only
- `/poll-clips` - Poll Vizard for new clips
- `/approve-clip` - Approve a clip
- `/reject-clip` - Reject a clip
- `/delete-clip` - Delete clip (destructive)
- `/videos` - List videos
- `/add-video` - Add video to library
- `/update-video` - Update video metadata
- `/delete-video` - Delete video (destructive)
- `/video-categories` - List video categories
- `/create-video-category` - Create video category
- `/delete-video-category` - Delete category (destructive)
- `/articles` - List articles
- `/add-article` - Add article (draft)
- `/approve-article` - Approve article for publishing
- `/publish-article` - Publish approved article
- `/delete-article` - Delete article (destructive)
- `/social-posts` - List social posts
- `/add-social-post` - Add social post
- `/approve-social-post` - Approve social post
- `/publish-social-post` - Publish social post
- `/delete-social-post` - Delete social post (destructive)
- `/setup-commands` - Force full command re-sync

---

### 2. Cron Scheduler
**Trigger:** `/cron`
**Commands:**
- `/cron` - Interactive cron job creation
  - Creates scheduled reminders
  - Recurring tasks
  - Automated messages
  - Telegram delivery options

---

### 3. Idea Generator
**Trigger:** `/idea generator`
**Commands:**
- `/idea generator` - Generate business/content ideas
  - Business ideas by niche
  - Content ideas by topic
  - Simple offer creation

---

### 4. Memory Bank
**Trigger:** `/memory bank`
**Commands:**
- `/memory bank` - Access persistent knowledge storage
  - Store long-term information
  - Retrieve stored knowledge
  - Update memory entries

---

### 5. Skill Creator (The Godfather)
**Trigger:** `/skill-*`
**Commands:**
- `/skill-create` - Start 12-phase skill creation wizard
- `/skill-quick` - Quick skill from template
- `/skill-from-url` - Create skill from URL documentation
- `/skill-from-template` - Create from 12 templates
- `/skill-api-wizard` - API integration wizard
- `/skill-list` - List all skills
- `/skill-edit` - Edit existing skill
- `/skill-export` - Export skill package
- `/skill-import` - Import skill package
- `/skill-test` - Test skill locally
- `/skill-publish` - Publish skill
- `/skill-clone` - Clone existing skill
- `/skill-delete` - Delete skill (destructive)
- `/skill-validate` - Validate skill structure
- `/skill-docs` - Generate skill documentation
- `/skill-api` - Manage API endpoints
- `/skill-auth` - Configure authentication
- `/skill-deploy` - Deploy skill
- `/skill-logs` - View skill logs
- `/skill-config` - Configure skill settings
- `/skill-env` - Manage environment variables
- `/skill-secrets` - Manage secrets
- `/skill-backup` - Backup skill
- `/skill-restore` - Restore skill
- `/skill-version` - Version management

---

### 6. The Dream Life Goal
**Trigger:** `/dream-life`
**Commands:**
- `/dream-life` - Start Dream Life Income Planner
  - Calculate lifestyle costs
  - Break down income goals
  - Set daily/hourly targets
  - Schedule motivational reminders

---

### 7. Zip + Unzip File Utility
**Trigger:** `/archive`, `/zipfiles`, `/unzipfiles`
**Commands:**
- `/archive` - Create ZIP archive
- `/zipfiles` - Zip specific files/folders
- `/unzipfiles` - Extract ZIP files
  - Safe extraction options
  - Flatten directory structure
  - Exclude patterns

---

---

## 🔧 SKILLS WITH API KEYS CONFIGURED

### 8. Global Control CRM
**Trigger:** `/globalcontrol-*`, `/crm-*`
**Commands:** (73 total commands)
**Contact Management:**
- `/globalcontrol-contacts` - List contacts
- `/globalcontrol-get-contact` - Get contact details
- `/globalcontrol-create-contact` - Create contact
- `/globalcontrol-update-contact` - Update contact
- `/globalcontrol-delete-contact` - Delete contact
- `/globalcontrol-search-contacts` - Search contacts
- `/globalcontrol-merge-contacts` - Merge duplicate contacts
- `/globalcontrol-tag-contact` - Tag contact
- `/globalcontrol-untag-contact` - Remove tag from contact

**Tag Management:**
- `/globalcontrol-tags` - List all tags
- `/globalcontrol-create-tag` - Create tag
- `/globalcontrol-update-tag` - Update tag
- `/globalcontrol-delete-tag` - Delete tag

**Workflow Management:**
- `/globalcontrol-workflows` - List workflows
- `/globalcontrol-get-workflow` - Get workflow
- `/globalcontrol-create-workflow` - Create workflow
- `/globalcontrol-update-workflow` - Update workflow
- `/globalcontrol-delete-workflow` - Delete workflow
- `/globalcontrol-trigger-workflow` - Trigger workflow

**Domain Management:**
- `/globalcontrol-domains` - List domains
- `/globalcontrol-get-domain` - Get domain details
- `/globalcontrol-create-domain` - Add domain
- `/globalcontrol-update-domain` - Update domain
- `/globalcontrol-delete-domain` - Delete domain

**Email Campaigns:**
- `/globalcontrol-campaigns` - List campaigns
- `/globalcontrol-get-campaign` - Get campaign
- `/globalcontrol-create-campaign` - Create campaign
- `/globalcontrol-update-campaign` - Update campaign
- `/globalcontrol-delete-campaign` - Delete campaign
- `/globalcontrol-send-campaign` - Send campaign
- `/globalcontrol-schedule-campaign` - Schedule campaign

**Broadcasts:**
- `/globalcontrol-broadcasts` - List broadcasts
- `/globalcontrol-create-broadcast` - Create broadcast
- `/globalcontrol-send-broadcast` - Send broadcast

**Forms:**
- `/globalcontrol-forms` - List forms
- `/globalcontrol-get-form` - Get form
- `/globalcontrol-create-form` - Create form
- `/globalcontrol-update-form` - Update form
- `/globalcontrol-delete-form` - Delete form

**Surveys:**
- `/globalcontrol-surveys` - List surveys
- `/globalcontrol-get-survey` - Get survey
- `/globalcontrol-create-survey` - Create survey
- `/globalcontrol-update-survey` - Update survey
- `/globalcontrol-delete-survey` - Delete survey

**Calendar:**
- `/globalcontrol-calendar` - View calendar
- `/globalcontrol-create-event` - Create event
- `/globalcontrol-update-event` - Update event
- `/globalcontrol-delete-event` - Delete event

**Tasks:**
- `/globalcontrol-tasks` - List tasks
- `/globalcontrol-create-task` - Create task
- `/globalcontrol-update-task` - Update task
- `/globalcontrol-delete-task` - Delete task
- `/globalcontrol-complete-task` - Complete task

**Notes:**
- `/globalcontrol-notes` - List notes
- `/globalcontrol-create-note` - Create note
- `/globalcontrol-update-note` - Update note
- `/globalcontrol-delete-note` - Delete note

**Opportunities:**
- `/globalcontrol-opportunities` - List opportunities
- `/globalcontrol-create-opportunity` - Create opportunity
- `/globalcontrol-update-opportunity` - Update opportunity
- `/globalcontrol-delete-opportunity` - Delete opportunity

**Reports:**
- `/globalcontrol-reports` - View reports
- `/globalcontrol-analytics` - View analytics
- `/globalcontrol-export-data` - Export data

---

### 9. MintBird
**Trigger:** `/sales offer`, `/sales page`, `/funnel`
**Commands:**
- `/sales offer` ⭐ NEW - Complete sales offer creation
  - Generates product name
  - Creates sales page with AI
  - Creates product in MintBird
  - Links product to page
  - Options: Button or Order Form (One/Two Step)

- `/sales page` - Create sales page with product
  - Order form options (Yes/No)
  - One Step or Two Step
  - Product creation
  - Page-product linking

- `/funnel` - Complete funnel builder
  - Main offer setup
  - Upsell creation (1-3 upsells)
  - Downsell options
  - Funnel container creation
  - All pages linked
  - Payment provider setup

---

### 10. Page Sprout (PopLinks)
**Trigger:** `/poplink`, `/leadstep`, `/bridge page`
**Commands:**
- `/poplink` - Create shortened tracking link
  - Auto-generates slug
  - Uses chadnicely.com domain
  - Returns tracking URL

- `/leadstep` - Create lead capture page
  - Auto-generates URL slug
  - 3-line headline with HTML formatting
  - 5 mechanism-based bullets
  - Thank you page included
  - Returns 2 URLs

- `/bridge page` - Create bridge/pre-sale page
  - Warms up visitors before offer
  - Customizable content
  - CTA to destination

---

### 11. QuizForma
**Trigger:** Conversational + API
**Commands:** (API endpoints - currently needs manual setup)
- Quiz creation via API
- Question management
- Response collection
- Scoring logic
- Result categories
- Lead capture

---

---

## 🎯 CASHFLOW ENGINE SKILLS

### 12. Master Copywriter
**Trigger:** Conversational
**Commands:**
- 8-phase sales copy framework
- PAS (Problem-Agitation-Solution)
- AIDA (Attention-Interest-Desire-Action)
- Long-form sales letters
- VSL scripts
- Webinar scripts

---

### 13. Hero Section Generator
**Trigger:** `/herosection`
**Commands:**
- `/herosection` - Generate hero section
  - 3-part headline structure
  - Pre-headline hook
  - Main headline
  - Post-headline support
  - CTA button

---

### 14. Sales Page Generator
**Trigger:** `/salespage`
**Commands:**
- `/salespage` - Generate complete sales page
  - 2500+ word sales pages
  - Full structure:
    - Headline
    - Story opening
    - Problem agitation
    - Solution introduction
    - Features & benefits
    - Social proof
    - Offer stack
    - Guarantee
    - Urgency/scarcity
    - Close

---

### 15. Email Conversion Engine
**Trigger:** `/email conversion`
**Commands:**
- `/email conversion` - Generate email sequences
  - Welcome sequences
  - Sales sequences
  - Nurture sequences
  - Re-engagement campaigns
  - Subject lines
  - Preview text
  - Full email copy

---

---

## 🌟 10 SPECIAL SKILLS

### 16. AEO Optimizer
**Trigger:** Conversational
**Commands:**
- AI search engine optimization
- ChatGPT/Perplexity optimization
- Entity-rich writing
- Schema markup
- Citation-worthy formatting

---

### 17. Competitive Analyzer
**Trigger:** Conversational
**Commands:**
- Competitor research
- SWOT analysis
- Market gap identification
- Positioning strategy
- Differentiation recommendations

---

### 18. Data Analyst
**Trigger:** Conversational
**Commands:**
- Data analysis & visualization
- Trend identification
- Statistical analysis
- Chart/graph generation
- Insight extraction
- Report creation

---

### 19. Lead Magnet Creator
**Trigger:** Conversational
**Commands:**
- Ebook creation
- Checklist generation
- Guide creation
- Template design
- Worksheet development
- Resource lists

---

### 20. PDF Document Processor
**Trigger:** Conversational
**Commands:**
- PDF text extraction
- OCR (image to text)
- PDF merging
- PDF splitting
- Form field extraction
- Table extraction

---

### 21. Sales Funnel Copywriter
**Trigger:** Conversational
**Commands:**
- Complete funnel copy:
  - Opt-in page
  - Sales page
  - Upsell pages
  - Downsell pages
  - Thank you pages
  - Email sequences
  - Ad copy

---

### 22. SEO Content Writer
**Trigger:** Conversational
**Commands:**
- SEO-optimized articles
- Keyword research
- Content briefs
- Meta descriptions
- Header optimization
- Internal linking strategy

---

### 23. Spreadsheet Automator
**Trigger:** Conversational
**Commands:**
- Spreadsheet automation
- Formula generation
- Data cleaning
- Pivot table creation
- Chart generation
- Template creation

---

### 24. Travel Planner
**Trigger:** Conversational
**Commands:**
- Itinerary creation
- Flight/hotel search
- Activity recommendations
- Budget planning
- Packing lists
- Local tips

---

### 25. Web Scraper Extractor
**Trigger:** Conversational
**Commands:**
- Web scraping
- Data extraction
- Table scraping
- Price monitoring
- Content aggregation
- API data extraction

---

---

## 🔌 SKILLS NEEDING API KEYS

### 26. Cold Outreach Sequencer
**Trigger:** Conversational
**Commands:**
- B2B cold email campaigns
- Hyper-personalization
- Multi-step follow-ups
- Engagement tracking
- Lead pipeline management
**Needs:** SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, OPENAI_API_KEY

---

### 27. Competitor Intelligence Monitor
**Trigger:** Conversational
**Commands:**
- Website monitoring
- Pricing tracking
- Product launch alerts
- Review monitoring
- Social media tracking
- Weekly intelligence reports
**Needs:** OPENAI_API_KEY, SERP_API_KEY

---

### 28. CourseSprout
**Trigger:** 21 API endpoints
**Commands:**
- Course management
- Membership (pods) management
- Member management
- Lesson creation
- Gamification
- AI retrieval
- Progress tracking
**Needs:** COURSESPROUT_API_KEY

---

### 29. ElevenLabs Voice
**Trigger:** Conversational
**Commands:**
- Text-to-speech generation
- Voice cloning
- Voice library management
- Sound effects
- Multi-language support
**Needs:** ELEVENLABS_API_KEY

---

### 30. Google Drive
**Trigger:** Conversational
**Commands:**
- File creation
- File search
- File sharing
- Folder organization
- Document management
- Webhook notifications
**Needs:** GOOGLE_DRIVE_TOKEN

---

### 31. ImageKit Media
**Trigger:** Conversational
**Commands:**
- Image transformations
- Video optimization
- CDN delivery
- Watermarking
- Resizing
- Bulk operations
**Needs:** IMAGEKIT_PRIVATE_KEY

---

### 32. Letterman
**Trigger:** `/local article`, `/story search`
**Commands:**
- `/local article` - Create newsletter article
- `/story search` - Search for stories
- Article management
- SEO optimization
- Publication scheduling
**Needs:** Letterman API Key (JWT token)

---

### 33. Plaid Finance
**Trigger:** Conversational
**Commands:**
- Bank account linking
- Transaction history
- Balance checking
- Identity verification
- Investment data
- Liability tracking
**Needs:** PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV

---

### 34. SerpSling Private API
**Trigger:** `/serpsling-*`
**Commands:**
- `/serpsling-list-projects` - List SEO projects
- `/serpsling-get-project` - Get project details
- `/serpsling-list-keywords` - List tracked keywords
- `/serpsling-add-keyword` - Add keyword to track
- `/serpsling-delete-keyword` - Remove keyword
- `/serpsling-get-ranks` - Get ranking data
**Needs:** SERPSLING_API_KEY

---

### 35. Stripe Setup
**Trigger:** `/stripe_api_setup_with_guardrails`
**Commands:**
- `/stripe_api_setup_with_guardrails` - Secure Stripe setup
  - API key validation
  - Secure storage (AES-256-GCM)
  - Testing procedures
  - Error handling
**Needs:** Stripe API keys (sk_live_/sk_test_, pk_live_/pk_test_)

---

### 36. Stripe Payments
**Trigger:** Conversational + API
**Commands:**
- Customer management
- Charge processing
- Subscription management
- Invoice creation
- Refund processing
- Product management
- Pricing setup
- Billing management
**Needs:** STRIPE_SECRET_KEY

---

### 37. Unsplash Media
**Trigger:** Conversational + API
**Commands:**
- Image search
- High-resolution downloads
- Royalty-free images
- Collection browsing
- Photographer attribution
**Needs:** UNSPLASH_ACCESS_KEY

---

### 38. WhatsApp Business
**Trigger:** Conversational + API
**Commands:**
- Message sending
- Template messages
- Media messages
- Interactive buttons
- Contact management
- Automated responses
**Needs:** WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID

---

### 39. Wistia Video
**Trigger:** Conversational + API
**Commands:**
- Video upload
- Project organization
- Analytics retrieval
- Player customization
- Lead generation tools
**Needs:** WISTIA_API_TOKEN

---

### 40. YouTube Manager
**Trigger:** Conversational
**Commands:**
- Channel management
- Video uploads
- Playlist creation
- Analytics viewing
- Comment management
- SEO optimization
**Needs:** YOUTUBE_API_KEY

---

### 41. YouTube Video
**Trigger:** Conversational
**Commands:**
- Video search
- Video download
- Metadata extraction
- Transcript retrieval
- Thumbnail download
**Needs:** YOUTUBE_API_KEY, YOUTUBE_ACCESS_TOKEN

---

### 42. Office365 Mail
**Trigger:** `/o365-*`
**Commands:**
- `/o365-send` - Send email
- `/o365-inbox` - Check inbox
- `/o365-folders` - List folders
- `/o365-search` - Search emails
- `/o365-draft` - Save draft
- `/o365-calendar` - Calendar access
**Needs:** MS_GRAPH_CLIENT_ID, MS_GRAPH_CLIENT_SECRET, MS_GRAPH_TENANT_ID

---

### 43. Zoom Meetings
**Trigger:** Conversational
**Commands:**
- Meeting creation
- Meeting scheduling
- Participant management
- Recording access
- Webinar setup
**Needs:** ZOOM_ACCESS_TOKEN

---

---

## 📊 COMMAND SUMMARY

| Category | Skills | Total Commands |
|----------|--------|----------------|
| **Active (No API)** | 6 | ~35 |
| **Active (API Configured)** | 5 | ~100+ |
| **Cashflow Engine** | 4 | ~20 |
| **10 Special Skills** | 10 | ~50 |
| **Needs API Keys** | 18 | ~200+ |
| **TOTAL** | **43** | **~400+** |

---

*Generated: May 1, 2026*
*For: AmiLynne "Babs" Carroll - Sacred Kaleidoscope Community*