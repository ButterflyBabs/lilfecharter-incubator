# Control Board â€” Setup Flow (v2.0.0)

## Overview

This document describes the complete post-install initialization flow for the Control Board API skill. The bot must execute all 4 steps automatically when a token is first provided â€” no waiting, no skipping.

---

## Trigger Conditions

Run the full setup flow when:
1. User pastes a `CONTROLBOARD_API_TOKEN`
2. `CONTROLBOARD_API_TOKEN` is not yet in `~/.openclaw/workspace/.env.personal`
3. User explicitly asks to re-run setup (`/setup-commands` triggers Step 3 only)

If token already exists on re-install: skip Step 1 prompt, start from Step 2 and re-sync everything fresh.

---

## Step 1: Get & Verify Token

```
READ ~/.openclaw/workspace/.env.personal
  â†’ Check if CONTROLBOARD_API_TOKEN= exists

IF MISSING:
  â†’ Say: "To connect Control Board, I need your API token.
          Find it at https://control.clawlauncher.io â†’ Settings.
          Please paste it here:"

WHEN USER PASTES TOKEN:
  â†’ APPEND to .env.personal: CONTROLBOARD_API_TOKEN=<value>
  â†’ DO NOT use gateway config.patch
  â†’ DO NOT restart gateway

VERIFY:
  GET https://control.clawlauncher.io/api/user/me
  Authorization: Bearer <token>

  IF 200:
    â†’ GET /api/workspaces
    â†’ Store first workspace id for X-Workspace-Id use
    â†’ Say: "âœ… Token verified! Connected to workspace: [workspace name].
             Setting up your dashboard now..."
    â†’ IMMEDIATELY proceed to Step 2 (no waiting, no asking)

  IF 401:
    â†’ Say: "That token didn't work. Please check and paste it again."
    â†’ Re-prompt
```

---

## Step 2: Sync Bot Config to Control Center

**âš ï¸ MUST complete and confirm Step 2 before touching Step 3**

```
Say: "Syncing your bot configuration to the dashboard..."

2a. CHECK CURRENT STATE:
    GET /api/control
    â†’ If ALL sections are empty arrays â†’ use POST (full replace)
    â†’ If ANY section has data â†’ use PATCH (partial update)

2b. READ BOT CONFIG (read only â€” NEVER write):
    Read ~/.openclaw/openclaw.json

    Extract apiKeys:
      â†’ models.providers keys (openai, anthropic, moonshot, etc.)
      â†’ For each: { name, provider, api_key_raw: "<first4>...<last4>", status: "connected" }

    Extract models:
      â†’ models.providers.<name>.models array
      â†’ For each: { name: model.name, provider: "<provider>", status: "available" }

    Extract channels:
      â†’ channels section or plugins.entries
      â†’ For each messaging platform: { name, platform, status: "connected" }

    Extract cronJobs:
      â†’ Use cron list tool
      â†’ For each: { name, schedule, status: "active" }

2c. SYNC:
    IF empty â†’ POST /api/control with full payload
    IF has data â†’ PATCH /api/control with extracted sections

    Body schema:
    {
      "apiKeys": [{ "name", "provider", "api_key_raw", "status" }],
      "models": [{ "name", "provider", "status" }],
      "cronJobs": [{ "name", "schedule", "status" }],
      "tasks": [],
      "channels": [{ "name", "platform", "status" }],
      "integrations": [],
      "features": []
    }

2d. CONFIRM OUT LOUD:
    Say: "âœ… Dashboard synced â€” X API keys, Y models, Z channels
          now visible at https://control.clawlauncher.io"

    â†’ Only AFTER saying this, proceed to Step 3
```

---

## Step 3: Scan Skills & Register Commands

```
Say: "Scanning your installed skills and adding commands to the dashboard..."

1. GET /api/commands â†’ store existing command names (avoid duplicates)

2. List all directories under ~/.openclaw/workspace/skills/

3. For each skill directory:
   a. If commands.json exists â†’ read it
   b. Else â†’ parse SKILL.md for lines starting with "- /"

4. For each command NOT already in dashboard:

   âš ï¸ GATE CHECK â€” before posting:
   - Generate long_description (min 3 newline-separated steps)
   - Empty or < 3 steps = INVALID. Generate them first.

   Generate long_description by command type:
   - List â†’ "Step 1: Call GET /api/<resource>\nStep 2: Format results\nStep 3: Display with count"
   - Create â†’ "Step 1: Ask for required fields\nStep 2: Validate fields\nStep 3: POST to /api/<resource>\nStep 4: Confirm creation"
   - Approve/Status â†’ "Step 1: Ask for item id\nStep 2: Fetch current details\nStep 3: POST to action endpoint\nStep 4: Confirm status updated"
   - Publish â†’ "Step 1: GET approved items\nStep 2: Take oldest\nStep 3: Publish via external skill\nStep 4: Mark as published"
   - Delete â†’ "Step 1: Fetch item details\nStep 2: Ask for yes confirmation\nStep 3: DELETE with correct id field\nStep 4: Confirm deletion"

   Set category:
   - letterman, poststream, global-control-crm, coursesprout,
     poplinks-mintbird, quizforma â†’ "Titanium"
   - Vizard, external APIs â†’ "External Software"
   - Everything else â†’ "Resources"

   POST /api/commands:
   {
     "name": "/command-name",
     "description": "Short description",
     "long_description": "Step 1: ...\nStep 2: ...\nStep 3: ...",
     "category": "Resources",
     "tags": []
   }

   âŒ Do NOT include: steps[], command_group, shortcut, sort_order

5. Say: "âœ… Synced X commands from Y skills.
         View at https://control.clawlauncher.io/commands"
```

---

## Step 4: Final Report

Display this summary:

`
✅ Control Board is fully set up!

🌐 Dashboard: https://control.clawlauncher.io
📊 Config synced: [X] API keys, [Y] channels, [Z] models
⌨️  Commands synced: [N] commands across [M] skills

Going forward:
• Install any skill → commands auto-added to dashboard
• Change any config → dashboard auto-updated
• Create a command → auto-registered

Run /setup-commands anytime to force a full re-sync.
`

---
## /setup-commands (Manual Re-sync)

Triggers Step 3 only. Use when:
- Auto-sync missed a skill
- Installed a skill manually without triggering auto-detection
- Commands are out of sync with dashboard

Flow:
1. GET /api/commands â†’ store existing names
2. Scan all ~/.openclaw/workspace/skills/ directories
3. Read commands.json or parse SKILL.md per skill
4. POST only NEW commands (skip existing)
5. Report: "âœ… Synced X new commands. Total in dashboard: Y"
