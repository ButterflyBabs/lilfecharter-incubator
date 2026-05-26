---
name: Control Board API Skill
slug: control-board
author: OpenClaw Skill Generator
source: https://control.clawlauncher.io/ai-api-docs
description: Unified operational dashboard for bot config, commands, and content workflows. Manages clips (Vizard), articles (Letterman), videos, social posts, publications, and full bot state via event-driven integration. Workspace-scoped data requires X-Workspace-Id header.
version: 2.0.1
---

# Control Board API Skill

## Ã¢Å¡Â Ã¯Â¸Â CRITICAL Ã¢â‚¬â€ READ BEFORE DOING ANYTHING ELSE

When the user provides a Control Board API token:
- **DO NOT** use `gateway config.patch`
- **DO NOT** trigger a gateway restart
- **DO NOT** skip Step 2 and jump to Step 3
- **ONLY** write to `~/.openclaw/workspace/.env.personal` as `CONTROLBOARD_API_TOKEN=<value>`
- Then **immediately** run Step 2 → 3 → 4 continuously

**Required order: Step 1 → 2 → 3 → 4**

Do not stop between steps. Run all four steps in sequence automatically after token verification.

---

## Section 3: API Base URL + Authentication

**Base URL:** `https://control.clawlauncher.io`

**Authentication:** All requests require:
```
Authorization: Bearer <CONTROLBOARD_API_TOKEN>
```

**Token Storage:**
- Store in: `~/.openclaw/workspace/.env.personal`
- Format: `CONTROLBOARD_API_TOKEN=<your_token_here>`
- To read: open the file, extract the value after `CONTROLBOARD_API_TOKEN=`
- **NEVER** use `gateway config.patch` for this token Ã¢â‚¬â€ it goes only in `.env.personal`

**Workspace-Scoped Header:**
The following endpoints require an additional header:
```
X-Workspace-Id: <workspaceId>
```

Workspace-scoped endpoints: **Settings, Clips, Videos, Video Categories, Articles, Social Posts**

To get the workspace ID:
1. Call `GET /api/workspaces`
2. Take the first workspace `id` (or let the user choose if multiple exist)
3. Store it for the duration of the session

**Optional API Keys (stored per workspace via POST /api/settings):**
- `vizard_api_key` Ã¢â‚¬â€ required for Vizard clip polling
- `vizard_project_id` Ã¢â‚¬â€ required for Vizard clip polling
- `letterman_api_key` Ã¢â‚¬â€ required for article publication lookups
- `postbridge_api_key` Ã¢â‚¬â€ required for PostBridge integrations

---

## Section 4: Auto-Sync Features

Control Board keeps your dashboard in sync with your bot at all times.

### What Gets Synced

- **All slash commands** from every installed skill Ã¢â‚¬â€ visible in the dashboard command registry
- **Bot configuration** Ã¢â‚¬â€ API keys, models, cron jobs, connected channels
- **Content queues** Ã¢â‚¬â€ clips from Vizard, articles, videos, social posts
- **Integration status** Ã¢â‚¬â€ which external services are connected

### Sync Triggers

| Event | What Happens |
|---|---|
| Skill Installation | Commands auto-detected from commands.json or SKILL.md and synced to /api/commands |
| Config Changes | Control Center updated via PATCH /api/control |
| Custom Commands | Auto-registered in dashboard command registry |
| Cron Job Changes | Updated in Control Center cronJobs section |

---

## Section 5: Recommended Integration Patterns

### Clips Workflow (Vizard + PostStream)

**Full human-in-the-loop clip pipeline:**

1. **BOT (every 6 hours):** `POST /api/clips/poll` Ã¢â€ â€™ Vizard fetches new clips Ã¢â€ â€™ saved as `pending_review`
2. **HUMAN:** Reviews clips in dashboard Ã¢â€ â€™ clicks Approve Ã¢â€ â€™ `PATCH /api/clips/status` Ã¢â€ â€™ `approved`
3. **BOT (every hour):** `GET /api/clips/approved` Ã¢â€ â€™ take oldest clip Ã¢â€ â€™ publish via PostStream skill Ã¢â€ â€™ `PATCH /api/clips/status` to `published`

**Cron job setup:**
```
# Poll Vizard for new clips every 6 hours
0 */6 * * *   Ã¢â€ â€™ POST /api/clips/poll

# Publish one approved clip per hour (oldest first)
0 * * * *     Ã¢â€ â€™ GET /api/clips/approved Ã¢â€ â€™ take [0] Ã¢â€ â€™ PostStream publish Ã¢â€ â€™ PATCH status=published
```

### Articles Workflow (Letterman)

**Full human-in-the-loop article pipeline:**

1. **BOT (on discovery):** `POST /api/articles/add` with title, url, imageUrl Ã¢â€ â€™ status: `draft`
2. **HUMAN:** Reviews article in dashboard Ã¢â€ â€™ clicks Approve Ã¢â€ â€™ `POST /api/articles/approve`
3. **BOT (every hour):** `GET /api/articles/approved?sort=oldest_first` Ã¢â€ â€™ take first Ã¢â€ â€™ publish via Letterman skill Ã¢â€ â€™ `POST /api/articles/publish`

**Cron job setup:**
```
# Publish one approved article per hour (oldest first)
0 * * * *     Ã¢â€ â€™ GET /api/articles/approved?sort=oldest_first Ã¢â€ â€™ take [0] Ã¢â€ â€™ Letterman publish Ã¢â€ â€™ POST /api/articles/publish

# Daily config refresh at midnight
0 0 * * *     Ã¢â€ â€™ POST /api/control with full config snapshot

# Daily spend sync at 1AM
0 1 * * *     Ã¢â€ â€™ POST /api/control/sync-spend
```

---

## Section 6: Post-Install Initialization (6 Steps)

Run all four steps automatically and in order immediately after this skill is loaded for the first time, or when the user asks to set up Control Board.

---

### Step 1: Get & Verify Token

1. Read `~/.openclaw/workspace/.env.personal`
2. Check if `CONTROLBOARD_API_TOKEN=` is present and has a non-empty value
3. **If missing or empty**, say:

   > "To connect Control Board, I need your API token. Find it at https://control.clawlauncher.io Ã¢â€ â€™ Settings. Please paste it here:"

4. **When the user pastes the token:**
   - Append `CONTROLBOARD_API_TOKEN=<value>` to `.env.personal` (do NOT use `gateway config.patch`)
   - Call `GET /api/user/me` with the token in the Authorization header

5. **If response is 200:**
   - Also call `GET /api/workspaces`
   - Store the first workspace `id` as the session workspace ID for all subsequent X-Workspace-Id headers
   - Say: "Ã¢Å“â€¦ Token verified! Connected to workspace: [workspace name]. Setting up your dashboard now..."
   - **Immediately proceed to Step 2 without waiting for user input**

6. **If response is 401:**
   - Say: "That token didn't work. Please check and paste it again."

---

### Step 2: Sync Bot Config to Control Center Ã¢â‚¬â€ DO IT NOW BEFORE STEP 3

Say: "Ã¢Å“â€¦ Token verified! Syncing your bot configuration to the dashboard..."

**2a: Check current Control Center state**
- `GET /api/control`
- If all sections (apiKeys, models, cronJobs, tasks, channels, integrations, features) are empty arrays Ã¢â€ â€™ use `POST /api/control`
- If any section has existing data Ã¢â€ â€™ use `PATCH /api/control`

**2b: Read `~/.openclaw/openclaw.json` (read-only Ã¢â‚¬â€ NEVER write to this file)**

Extract the following:

- **apiKeys** Ã¢â‚¬â€ from `models.providers`:
  ```json
  {
    "name": "<provider>",
    "provider": "<provider>",
    "api_key_raw": "<first 4 chars>...<last 4 chars of apiKey>",
    "status": "connected"
  }
  ```

- **models** Ã¢â‚¬â€ from `models.providers.<name>.models` array:
  ```json
  {
    "name": "<model.name>",
    "provider": "<provider>",
    "status": "available"
  }
  ```

- **channels** Ã¢â‚¬â€ from `plugins.entries` or channels section:
  ```json
  {
    "name": "<channel>",
    "platform": "<channel>",
    "status": "connected"
  }
  ```

- **cronJobs** Ã¢â‚¬â€ use the cron list tool to get current cron jobs:
  ```json
  {
    "name": "<job name>",
    "schedule": "<cron expression>",
    "status": "active"
  }
  ```

**2c:** Call `POST /api/control` or `PATCH /api/control` with all extracted data

**2d:** Say: "Ã¢Å“â€¦ Dashboard synced Ã¢â‚¬â€ X API keys, Y models, Z channels now visible at https://control.clawlauncher.io"

**Only after saying this confirmation, proceed to Step 3.**

---

### Step 3: Scan All Installed Skills & Register Commands Ã¢â‚¬â€ DO IT NOW

Say: "Scanning your installed skills and adding commands to the dashboard..."

1. `GET /api/commands` Ã¢â€ â€™ store the list of existing command names to avoid posting duplicates

2. List all directories under `~/.openclaw/workspace/skills/`

3. **For each skill directory:**
   - If `commands.json` exists in the directory Ã¢â€ â€™ read it and parse command entries
   - Otherwise Ã¢â€ â€™ read `SKILL.md` and extract lines starting with `- /` (slash command lines)

4. **For each command NOT already in the dashboard:**

   **Ã¢Å¡Â Ã¯Â¸Â GATE CHECK Ã¢â‚¬â€ generate `long_description` before posting:**
   - Must have at least 3 lines of `long_description`
   - Generate based on command name and purpose
   - Format: `"Step 1: [action]\nStep 2: [action]\nStep 3: [confirm/report]"`
   - Empty `long_description` = **invalid**. Stop and generate it first.

   **How to generate `long_description` by command type:**

   - **List commands** (`/clips`, `/articles`, `/ideas`, `/bookmarks`, `/videos`, etc.):
     ```
     Step 1: Call GET /api/<resource> with Bearer token
     Step 2: Format results showing id, title, status
     Step 3: Display to user with count and filter options
     ```

   - **Create commands** (`/add-idea`, `/add-bookmark`, `/create-video`, etc.):
     ```
     Step 1: Ask user for required fields
     Step 2: Validate all required fields are provided
     Step 3: POST to /api/<resource> with data and Bearer token
     Step 4: Confirm creation and show new item id
     ```

   - **Approve/Status commands** (`/approve-article`, `/approve-clip`, etc.):
     ```
     Step 1: Ask for or confirm the item id
     Step 2: Fetch current item details
     Step 3: POST to action endpoint with item id
     Step 4: Confirm status updated
     ```

   - **Publish commands** (`/publish-article`, `/publish-clip`, etc.):
     ```
     Step 1: GET /api/<resource>/approved?sort=oldest_first
     Step 2: Take first (oldest) approved item
     Step 3: Publish via Letterman or PostStream skill
     Step 4: Mark as published on success
     ```

   - **Delete commands** (`/delete-idea`, `/delete-video`, etc.):
     ```
     Step 1: Fetch and display item details
     Step 2: Ask for explicit yes confirmation
     Step 3: DELETE /api/<resource> with correct id field
     Step 4: Confirm deletion successful
     ```

   **Ã¢Å¡Â Ã¯Â¸Â CATEGORY RULE Ã¢â‚¬â€ assign the correct category:**
   - Skills: `letterman`, `poststream`, `global-control-crm`, `coursesprout`, `poplinks-mintbird`, `quizforma` Ã¢â€ â€™ `"Titanium"`
   - External APIs: `vizard`, and other non-Titanium external APIs Ã¢â€ â€™ `"External Software"`
   - Everything else Ã¢â€ â€™ `"Resources"`

5. **POST each new command:**
   ```json
   POST /api/commands
   {
     "name": "/cmd",
     "description": "Short description always visible",
     "long_description": "Step 1: ...\nStep 2: ...\nStep 3: ...",
     "category": "Resources",
     "tags": []
   }
   ```

6. Say: "Ã¢Å“â€¦ Synced X commands from Y skills. View at https://control.clawlauncher.io/commands"

---

### Step 4: Final Report

Display this summary to the user:

`
âœ… Control Board is fully set up!

ðŸŒ Dashboard: https://control.clawlauncher.io
ðŸ“Š Config synced: [X] API keys, [Y] channels, [Z] models
âŒ¨ï¸  Commands synced: [N] commands across [M] skills

Going forward:
â€¢ Install any skill â†’ commands auto-added to dashboard
â€¢ Change any config â†’ dashboard auto-updated
â€¢ Create a command â†’ auto-registered

Run /setup-commands anytime to force a full re-sync.
`

---

## Section 7: Universal Skill Integration

Whenever any new skill is installed (via any method Ã¢â‚¬â€ CLI, drag-and-drop, skill marketplace, manual copy):

1. List `~/.openclaw/workspace/skills/` to detect the new directory
2. In the new skill directory:
   - Read `commands.json` if it exists
   - Otherwise read `SKILL.md` and extract lines starting with `- /`
3. Call `GET /api/commands` Ã¢â€ â€™ store existing command names
4. For each new command not already in the dashboard:
   - Generate `long_description` with at least 3 newline-separated steps (see Step 3 templates)
   - Set `category`: `Titanium` | `External Software` | `Resources` (see category rule above)
5. `POST` each new command to `/api/commands`
6. Tell user: "Ã¢Å“â€¦ Added X commands from [skill name] to your Control Board dashboard"

**When bot config changes:**
- Read `openclaw.json` (read only Ã¢â‚¬â€ never write)
- `PATCH /api/control` with only the changed section
- Confirm silently (no user notification needed unless an error occurs)

---

## Section 8: Slash Commands Reference

All commands are organized by resource. Commands marked Ã¢Å¡Â Ã¯Â¸Â are destructive and require explicit "yes" confirmation. Commands marked Ã°Å¸â€â€™ require the `X-Workspace-Id` header.

---

### User Profile

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/profile` | GET /api/user/me | Returns current user profile |
| `/update-profile` | PATCH /api/user/profile | Body: { name?, company?, phone? } |

---

### Settings Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/settings` | GET /api/settings | Returns flat key/value map. Requires X-Workspace-Id |
| `/set-setting` | POST /api/settings | Body: { key, value }. Requires X-Workspace-Id |

---

### Control Center

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/control` | GET /api/control | Returns full Control Center state |
| `/sync-control` | POST /api/control | Full replace. Body: { apiKeys, models, cronJobs, tasks, channels, integrations, features } |
| `/update-control` | PATCH /api/control | Partial update of Control Center |
| `/sync-spend` | POST /api/control/sync-spend | Syncs spend from OpenAI/Anthropic/Mistral billing APIs |

---

### Workspaces

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/workspaces` | GET /api/workspaces | Lists all workspaces |
| `/create-workspace` | POST /api/workspaces | Body: { name }. First workspace migrates existing data |
| `/rename-workspace` | PUT /api/workspaces | Body: { id, name } |
| `/delete-workspace` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/workspaces | Body: { id }. Cannot delete last workspace |

---

### Workspace Keys

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/workspace-keys` | GET /api/workspace-keys | Returns boolean flags per workspace |

---

### Clips Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/clips` | GET /api/clips | Params: filter=pending\|approved\|published\|rejected\|all; sortBy=viral_score\|duration\|date_asc\|date_desc. Requires X-Workspace-Id |
| `/approved-clips` | GET /api/clips/approved | Returns approved clips only. Requires X-Workspace-Id |
| `/poll-clips` | POST /api/clips/poll | Requires vizard_api_key + vizard_project_id in settings. Requires X-Workspace-Id |
| `/approve-clip` | PATCH /api/clips/status | Body: { clip_id, status: "approved" }. Requires X-Workspace-Id |
| `/reject-clip` | PATCH /api/clips/status | Body: { clip_id, status: "rejected" }. Requires X-Workspace-Id |
| `/delete-clip` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/clips | Body: { clip_id } Ã¢â€ Â NOTE: uses clip_id, NOT id. Requires X-Workspace-Id |

---

### Videos Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/videos` | GET /api/videos | Params: filter=all, category=all, sortBy=date_desc. Requires X-Workspace-Id |
| `/add-video` | POST /api/videos | Body: { name*, url*, description?, source?, category?, category_emoji?, status? }. Requires X-Workspace-Id |
| `/update-video` | PUT /api/videos | Body: { id*, status?, category?, category_emoji? }. Requires X-Workspace-Id |
| `/delete-video` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/videos | Body: { id }. Requires X-Workspace-Id |

---

### Video Categories Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/video-categories` | GET /api/video-categories | Lists all video categories. Requires X-Workspace-Id |
| `/create-video-category` | POST /api/video-categories | Body: { name*, emoji? }. Duplicates return 409. Requires X-Workspace-Id |
| `/delete-video-category` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/video-categories | Body: { id }. Requires X-Workspace-Id |

---

### Articles Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/articles` | GET /api/articles | Returns all articles. Requires X-Workspace-Id |
| `/approved-articles` | GET /api/articles/approved | Params: sort=newest_first\|oldest_first, search=. Requires X-Workspace-Id |
| `/article-status` | PATCH /api/articles/status | Body: { id, status: draft\|approve\|rejected\|published }. Requires X-Workspace-Id |
| `/add-article` | POST /api/articles/add | Body: { title*, url*, imageUrl*, description?, storageId?, publicationName? }. Requires X-Workspace-Id |
| `/create-article` | POST /api/articles/create | Letterman-integrated. Body: { publicationId*, publicationName*, url*, keywords?, imageBase64? }. Requires X-Workspace-Id |
| `/approve-article` | POST /api/articles/approve | Body: { id }. Requires X-Workspace-Id |
| `/reject-article` | POST /api/articles/reject | Body: { id }. Requires X-Workspace-Id |
| `/draft-article` | POST /api/articles/draft | Body: { id }. Requires X-Workspace-Id |
| `/publish-article` | POST /api/articles/publish | Body: { id }. Article must be in "approve" status first. Requires X-Workspace-Id |
| `/delete-article` Ã¢Å¡Â Ã¯Â¸Â | POST /api/articles/delete | Body: { id }. NOTE: uses POST, not DELETE. Requires X-Workspace-Id |
| `/article-publications` | GET /api/articles/publications | Requires letterman_api_key in settings. Requires X-Workspace-Id |

---

### Social Posts Ã°Å¸â€â€™

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/social-posts` | GET /api/social-posts | Param: status=all\|pending\|approved\|scheduled\|published\|rejected. Requires X-Workspace-Id |
| `/create-social-post` | POST /api/social-posts | Body: { title*, description?, image_url?, caption?, platforms?: [instagram\|youtube\|tiktok\|x\|bluesky\|linkedin], format?: image\|video\|text\|carousel }. Requires X-Workspace-Id |
| `/update-social-post` | PUT /api/social-posts | Body: { id*, action: approve\|reject\|publish }. Requires X-Workspace-Id |
| `/delete-social-post` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/social-posts | Body: { id }. Requires X-Workspace-Id |

---

### Publications

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/publications` | GET /api/publications | Lists all publications |
| `/create-publication` | POST /api/publications | Body: { name*, description?, city?, state?, letterman_publication_id?, letterman_url? } |
| `/update-publication` | PATCH /api/publications | Body: { id*, action: activate\|deactivate } |
| `/delete-publication` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/publications | Body: { id } |

---

### Ideas

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/ideas` | GET /api/ideas | Lists all ideas |
| `/add-idea` | POST /api/ideas | Body: { title*, description?, category?, status?: active\|archived, priority?: low\|medium\|high, tags?: [] } |
| `/update-idea` | PUT /api/ideas | Body: { id*, ...any create fields } |
| `/delete-idea` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/ideas | Body: { id } |

---

### Bookmarks

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/bookmarks` | GET /api/bookmarks | Lists all bookmarks |
| `/add-bookmark` | POST /api/bookmarks | Body: { title*, url?, description?, category?, status?: read-later\|read\|archived, tags?: [] } |
| `/update-bookmark` | PUT /api/bookmarks | Body: { id*, ...any create fields } |
| `/delete-bookmark` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/bookmarks | Body: { id } |

---

### Businesses

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/businesses` | GET /api/businesses | Lists all businesses |
| `/add-business` | POST /api/businesses | Body: { action: "add", name*, columns?: [] } |
| `/update-business` | POST /api/businesses | Body: { action: "update", business: { id*, name, columns, cards[], resources[] } }. Full document replace |
| `/delete-business` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/businesses | Body: { id } |

---

### Assets

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/assets` | GET /api/assets | Lists all assets |
| `/add-asset` | POST /api/assets | Body: { title*, description?, category?, status?: active\|planning\|completed, tags?: [] } |
| `/update-asset` | PUT /api/assets | Body: { id*, title?, description?, category?, status?, tags? } |
| `/delete-asset` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/assets | Body: { id } |

---

### Memory Banks

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/memory-banks` | GET /api/memory-banks | Lists all memory banks |
| `/create-memory-bank` | POST /api/memory-banks | Body: { name*, description? } |
| `/delete-memory-bank` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/memory-banks | Body: { id } |

---

### Team Board

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/team-projects` | GET /api/team/projects | Lists all team projects |
| `/create-team-project` | POST /api/team/projects | Body: { name*, color?: hex } |
| `/update-team-project` | PUT /api/team/projects | Body: { id*, name?, color? } |
| `/delete-team-project` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/team/projects | Body: { id } |
| `/team-tasks` | GET /api/team/tasks | Param: project_id=. Lists tasks |
| `/create-team-task` | POST /api/team/tasks | Body: { title*, description?, status?: inbox\|assigned\|in_progress\|review\|done, priority?: low\|medium\|high, project_id?, assignee?, due_date?, tags?: [], progress?: 0-100 } |
| `/update-team-task` | PUT /api/team/tasks | Body: { id*, ...any create fields } |
| `/delete-team-task` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/team/tasks | Body: { id } |

---

### Vault

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/vault` | GET /api/vault/items | Lists all vault items |
| `/add-vault-item` | POST /api/vault/items | Body: { title*, category?, type?: Image\|File\|Screenshot\|PPT\|URL\|Video\|Text\|Design Link, url?, notes?, tags?: [] } |

---

### Shopping

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/shopping` | GET /api/shopping | Lists all shopping items |
| `/add-shopping-item` | POST /api/shopping | Body: { title*, url?, price?, image?, description?, category?, status?: to-buy\|watching\|archived, tags?: [] } |
| `/update-shopping-item` | PUT /api/shopping | Body: { id*, ...any create fields } |
| `/archive-shopping-item` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/shopping | Body: { id }. **SOFT DELETE ONLY** Ã¢â‚¬â€ archives item, does NOT remove from DB. Warn user. |

---

### Commands

| Command | Method + Endpoint | Notes |
|---|---|---|
| `/commands` | GET /api/commands | Lists all registered commands |
| `/create-command` | POST /api/commands | Body: { name*, description*, long_description?, category?: Resources\|External Software\|Titanium, tags?: [] } |
| `/update-command` | PUT /api/commands | Body: { id*, name?, description?, long_description?, category?, tags? } |
| `/delete-command` Ã¢Å¡Â Ã¯Â¸Â | DELETE /api/commands?id=<commandId> | **QUERY PARAM Ã¢â‚¬â€ NOT a JSON body**. No request body needed. |

---

## Section 9: Event Hooks & Automation

### Auto-Installed Event Hooks

**1. Skill Installation Detection**
- Watch: `~/.openclaw/workspace/skills/` (fs.watch or equivalent)
- Trigger: New directory appears
- Action:
  1. List new directory contents
  2. Read `commands.json` if present, OR parse `SKILL.md` for lines starting with `- /`
  3. `GET /api/commands` Ã¢â€ â€™ check for existing names
  4. For each new command: generate `long_description` (3+ steps), set correct `category`
  5. `POST /api/commands` for each new command
  6. Report: "Ã¢Å“â€¦ Added X commands from [skill] to your Control Board dashboard"

**2. Config Change Detection**
- Trigger: `config:changed` event fires in OpenClaw runtime
- Action:
  1. Read `~/.openclaw/openclaw.json` (read only Ã¢â‚¬â€ never write)
  2. Extract the changed section (apiKeys, models, channels, cronJobs, etc.)
  3. `PATCH /api/control` with only the changed section
  4. Confirm silently (no user message needed)

**3. Custom Command Creation**
- Trigger: `command:created` event fires
- Action:
  1. Receive the new command name and description
  2. Generate `long_description` from the command description (minimum 3 steps)
  3. `POST /api/commands` with name, description, long_description, category, tags
  4. Confirm: "Ã¢Å“â€¦ Command registered in Control Board dashboard"

---

### Periodic Cron Jobs

| Job | Schedule | Action |
|---|---|---|
| Poll Vizard clips | `0 */6 * * *` (every 6h) | POST /api/clips/poll |
| Publish approved clip | `0 * * * *` (every hour) | GET /api/clips/approved Ã¢â€ â€™ take oldest Ã¢â€ â€™ PostStream publish Ã¢â€ â€™ PATCH status=published |
| Publish approved article | `0 * * * *` (every hour) | GET /api/articles/approved?sort=oldest_first Ã¢â€ â€™ take first Ã¢â€ â€™ Letterman publish Ã¢â€ â€™ POST /api/articles/publish |
| Full config refresh | `0 0 * * *` (daily midnight) | POST /api/control with full config snapshot |
| Sync API spend | `0 1 * * *` (daily 1AM) | POST /api/control/sync-spend |

**Note:** Clip and article publish jobs process one item at a time (oldest first) to maintain human review pacing.

---

## Section 10: Environment Variables

**Primary storage:** `~/.openclaw/workspace/.env.personal`

**Required variable:**
```
CONTROLBOARD_API_TOKEN=<your_token_here>
```

**How to read the token:**
1. Open `~/.openclaw/workspace/.env.personal` with the `read` tool
2. Find the line starting with `CONTROLBOARD_API_TOKEN=`
3. Extract the value after the `=` sign
4. Use it in all API calls as `Authorization: Bearer <token>`

**Optional variables stored per-workspace via `POST /api/settings`** (not in .env.personal):

| Key | Purpose |
|---|---|
| `vizard_api_key` | Enables Vizard clip polling via POST /api/clips/poll |
| `vizard_project_id` | Scopes Vizard polling to a specific project |
| `letterman_api_key` | Enables article publication lookups via GET /api/articles/publications |
| `postbridge_api_key` | Enables PostBridge integrations |

These are stored server-side per workspace Ã¢â‚¬â€ do NOT store them in `.env.personal`.

---

## Section 11: /setup-commands Reference

The `/setup-commands` command manually re-syncs all installed skill commands to the Control Board dashboard. Run this anytime to force a full re-sync, or after installing multiple skills at once.

**Steps executed by `/setup-commands`:**

1. **Scan all skill directories**
   - List every directory under `~/.openclaw/workspace/skills/`
   - For each: read `commands.json` if present, otherwise parse `SKILL.md` for `- /` lines

2. **Check existing commands**
   - `GET /api/commands`
   - Store all existing command names to avoid duplicates

3. **Post only new commands**
   - For each command not already in the dashboard:
     - Generate `long_description` with at least 3 steps (see Step 3 templates)
     - Set correct `category` (Titanium / External Software / Resources)
     - `POST /api/commands` with full command object

4. **Report results**
   ```
   Ã¢Å“â€¦ Synced X new commands. Total: Y. View at: https://control.clawlauncher.io/commands
   ```

---

## Section 12: Safety Notes

### Ã¢Å¡Â Ã¯Â¸Â DELETE Inconsistency Ã¢â‚¬â€ Two Patterns

Always check which pattern applies before issuing a delete request. Using the wrong pattern will result in a 400 or 404 error.

**Pattern A Ã¢â‚¬â€ Query parameter (no request body):**
| Resource | Request |
|---|---|
| Commands | `DELETE /api/commands?id=<commandId>` |

**Pattern B Ã¢â‚¬â€ JSON body:**
| Resource | Request Body | Notes |
|---|---|---|
| Clips | `DELETE /api/clips` | `{ "clip_id": "..." }` Ã¢â€ Â uses `clip_id`, NOT `id` |
| Videos | `DELETE /api/videos` | `{ "id": "..." }` |
| Video Categories | `DELETE /api/video-categories` | `{ "id": "..." }` |
| Ideas | `DELETE /api/ideas` | `{ "id": "..." }` |
| Bookmarks | `DELETE /api/bookmarks` | `{ "id": "..." }` |
| Businesses | `DELETE /api/businesses` | `{ "id": "..." }` |
| Assets | `DELETE /api/assets` | `{ "id": "..." }` |
| Memory Banks | `DELETE /api/memory-banks` | `{ "id": "..." }` |
| Team Projects | `DELETE /api/team/projects` | `{ "id": "..." }` |
| Team Tasks | `DELETE /api/team/tasks` | `{ "id": "..." }` |
| Workspaces | `DELETE /api/workspaces` | `{ "id": "..." }` |
| Publications | `DELETE /api/publications` | `{ "id": "..." }` |
| Social Posts | `DELETE /api/social-posts` | `{ "id": "..." }` |

**Pattern C Ã¢â‚¬â€ POST as delete:**
| Resource | Request |
|---|---|
| Articles | `POST /api/articles/delete` with body `{ "id": "..." }` |

**Pattern D Ã¢â‚¬â€ Soft delete only (does NOT remove from database):**
| Resource | Behavior |
|---|---|
| Shopping | `DELETE /api/shopping` sets `status` to `archived`. Item remains in DB. Always warn user: "This will archive the item, not permanently delete it." |

---

### Destructive Operations Ã¢â‚¬â€ Require Explicit "Yes" Confirmation

Before executing any of the following, display the item details and ask: **"Are you sure? Type 'yes' to confirm."** Do not proceed unless the user replies with an explicit "yes".

- Delete clip
- Delete video
- Delete video category
- Delete idea
- Delete bookmark
- Delete business
- Delete asset
- Delete memory bank
- Delete team project
- Delete team task
- Delete workspace
- Delete publication
- Delete social post
- Delete article (`POST /api/articles/delete`)
- Delete command

---

## Section 13: API Call Construction

All API calls must include the `Authorization` header. Workspace-scoped endpoints additionally require `X-Workspace-Id`.

---

### Example: Get Profile
```bash
curl -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     https://control.clawlauncher.io/api/user/me
```

---

### Example: Get Clips (workspace-scoped)
```bash
curl -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     -H "X-Workspace-Id: ${WORKSPACE_ID}" \
     https://control.clawlauncher.io/api/clips
```

---

### Example: Create Command
```bash
curl -X POST \
     -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "/morning",
       "description": "Run morning content review",
       "long_description": "Step 1: Check approved clips\nStep 2: Check approved articles\nStep 3: Review new ideas",
       "category": "Resources",
       "tags": ["daily", "content"]
     }' \
     https://control.clawlauncher.io/api/commands
```

---

### Example: Approve Clip (workspace-scoped)
```bash
curl -X PATCH \
     -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     -H "X-Workspace-Id: ${WORKSPACE_ID}" \
     -H "Content-Type: application/json" \
     -d '{"clip_id": "vizard_abc123", "status": "approved"}' \
     https://control.clawlauncher.io/api/clips/status
```

---

### Example: Sync Control Center (partial update)
```bash
curl -X PATCH \
     -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "apiKeys": [
         { "name": "anthropic", "provider": "anthropic", "api_key_raw": "sk-a...xyz1", "status": "connected" }
       ]
     }' \
     https://control.clawlauncher.io/api/control
```

---

### Example: Delete Command (query param Ã¢â‚¬â€ no body)
```bash
curl -X DELETE \
     -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     "https://control.clawlauncher.io/api/commands?id=cmd_abc123"
```

---

### Example: Add Article (workspace-scoped)
```bash
curl -X POST \
     -H "Authorization: Bearer ${CONTROLBOARD_API_TOKEN}" \
     -H "X-Workspace-Id: ${WORKSPACE_ID}" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Breaking: AI News Today",
       "url": "https://example.com/article",
       "imageUrl": "https://example.com/image.jpg",
       "description": "Summary of today'\''s AI news"
     }' \
     https://control.clawlauncher.io/api/articles/add
```

---

## Section 14: Error Handling

Handle all API error responses using the following messages:

| Status Code | Message |
|---|---|
| `401` | Ã¢ÂÅ’ Invalid or expired token. Check your CONTROLBOARD_API_TOKEN. |
| `403` | Ã¢ÂÅ’ Access forbidden. Check your API permissions. |
| `404` | Ã¢ÂÅ’ Resource not found. Check the provided ID. |
| `409` | Ã¢ÂÅ’ Conflict. Resource already exists (e.g. duplicate video category name). |
| `400` | Ã¢ÂÅ’ Invalid request. {include error details from response body} |
| `422` | Ã¢ÂÅ’ Validation error. {include error details from response body} |
| `429` | Ã¢ÂÂ¸Ã¯Â¸Â Rate limit exceeded. Wait a moment and try again. |
| `5xx` | Ã¢ÂÅ’ Control Board API error. Try again later. |

**For 401 errors specifically:**
- Check if the token has expired (JWTs expire)
- If so: "Your token may have expired. Please get a fresh token from https://control.clawlauncher.io Ã¢â€ â€™ Settings and paste it here."
- Update `.env.personal` with the new token and re-verify with `GET /api/user/me`

---

## Section 15: Response Formatting

**For list responses** (arrays of items):
- Show total count at the top: "Found X items"
- For each item show: `id`, `title` (or `name`), `status`
- Show additional relevant fields (e.g., `url` for bookmarks, `priority` for ideas)
- Offer filter options if applicable

**For single resource responses:**
- Show all relevant fields returned by the API
- Format dates in a human-readable way
- Highlight key status fields

**For mutation responses** (create, update, delete):
- Confirm success clearly: "Ã¢Å“â€¦ [Resource] [action] successfully."
- Show the new/updated item's `id` for creates and updates
- Suggest logical next steps (e.g., "You can now approve it with `/approve-article`")

---

## Section 16: Refusal Behavior

This skill **only supports documented Control Board API operations** as listed in this SKILL.md.

For requests outside the documented API:
> "I only support Control Board operations as documented. For other features, use https://control.clawlauncher.io"

Do not attempt to:
- Access undocumented endpoints
- Reverse-engineer API behavior
- Perform operations not listed in this skill

---

## Section 17: Implementation Notes

**Token management:**
- Always read `CONTROLBOARD_API_TOKEN` from `~/.openclaw/workspace/.env.personal` before making any API call
- If the variable is missing, follow Step 1 (token collection flow)
- Never hardcode tokens in tool calls, logs, or output
- Never store the token anywhere other than `.env.personal`

**Workspace ID management:**
- For workspace-scoped endpoints (Settings, Clips, Videos, Video Categories, Articles, Social Posts), always include `X-Workspace-Id` header
- Get workspace ID via `GET /api/workspaces` on first use in a session
- Store for the session Ã¢â‚¬â€ do not re-fetch on every call unless the user switches workspaces
- If the user has multiple workspaces, show them the list and let them choose

**Shopping DELETE behavior:**
- Always warn the user before calling `DELETE /api/shopping`: "This will archive the item, not delete it permanently. It will still appear in your database with status 'archived'."

**JWT expiry:**
- If `GET /api/user/me` returns 401 at any time after initial setup, the token may have expired
- Guide user: "Your Control Board token may have expired. Please get a fresh token from https://control.clawlauncher.io Ã¢â€ â€™ Settings."

**Command posts Ã¢â‚¬â€ long_description requirement:**
- Always include `long_description` with at least 3 newline-separated steps
- Never post a command with an empty or single-line `long_description`
- Generate based on command type using the templates in Step 3

**Article publish prerequisite:**
- `POST /api/articles/publish` requires the article to be in `approve` status first
- If the user tries to publish a `draft` article, say: "This article needs to be approved first. Use `/approve-article` with id [id], then try publishing again."

**Businesses update is a full replace:**
- `POST /api/businesses` with `action: "update"` replaces the entire business document
- Always fetch the current business first (`GET /api/businesses`), then merge changes before posting

---

## Section 18: Version & Footer

**Version:** 2.0.1
**Last Updated:** 2026-04-06
**Source:** https://control.clawlauncher.io/ai-api-docs
**Skill slug:** `control-board`
