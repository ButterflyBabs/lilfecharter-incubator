# Control Board API Skill

Interact with the Control Board API to manage your workspace resources: user profile, settings, AI control center, clips (Vizard), videos, articles (Letterman), social posts, publications, ideas, bookmarks, businesses, assets, memory banks, team board, vault, shopping list, and command shortcuts.

## Version 2.0.1

**Author:** OpenClaw Skill Generator  
**Source:** https://control.clawlauncher.io  
**API Version:** 2.0.0  
**Last Updated:** 2026-04-06

---

## What's New in v2.0.0

- **Workspace support** â€” all content is now workspace-scoped via `X-Workspace-Id` header
- **New resources:** Videos, Video Categories, Social Posts, Publications, Assets, Memory Banks, Workspaces
- **New command schema** â€” `long_description` (newline-separated steps) replaces `steps[]` array
- **Removed:** PostBridge endpoints, kanban endpoints (replaced by `/api/team/*`)
- **85 total commands** (up from 62)

---

## Quick Start

### 1. Get Your API Token
Go to https://control.clawlauncher.io â†’ Settings â†’ copy your API token.

### 2. Connect the Skill
Paste your token when prompted. The skill will automatically:
- Verify your token via `GET /api/user/me`
- Fetch your workspace ID from `GET /api/workspaces`
- Sync your bot config to the Control Center dashboard
- Scan all installed skills and register their commands
- Optionally set up automation cron jobs

### 3. Use Commands
```
/profile          â€” View your profile
/workspaces       â€” List your workspaces
/control          â€” View bot config dashboard
/clips            â€” View Vizard clips
/articles         â€” View article queue
/social-posts     â€” View social post queue
/ideas            â€” View ideas board
/commands         â€” View all registered commands
```

---

## Authentication

All API calls require:
```
Authorization: Bearer <CONTROLBOARD_API_TOKEN>
```

Workspace-scoped endpoints (Settings, Clips, Videos, Video Categories, Articles, Social Posts) also require:
```
X-Workspace-Id: <workspaceId>
```

**Token storage:** `~/.openclaw/workspace/.env.personal` as `CONTROLBOARD_API_TOKEN=<value>`  
**Never** use `gateway config.patch` to save this token â€” write directly to `.env.personal`.

---

## Command Naming

Commands use clean, unprefixed names (e.g., `/clips`, `/articles`).  
Fallback prefix if conflicts arise: `/cb-*` (e.g., `/cb-clips`, `/cb-articles`)

---

## Command Categories

| Category | Description |
|---|---|
| `Resources` | Control Board native resources (ideas, bookmarks, vault, etc.) |
| `External Software` | Third-party integrations (Vizard clips, videos) |
| `Titanium` | Titanium suite skills (Letterman, PostStream, Global Control CRM, CourseSprout, Poplinks/MintBird, Quizforma) |

---

## Workspace-Scoped Endpoints

The following require `X-Workspace-Id` header:
- Settings
- Clips
- Videos
- Video Categories
- Articles
- Social Posts

Get your workspace ID: `/workspaces` â†’ copy the `id` field.

---

## Optional API Keys (stored per workspace via `/save-setting`)

| Key | Purpose |
|---|---|
| `vizard_api_key` | Required for `/poll-clips` |
| `vizard_project_id` | Required for `/poll-clips` |
| `letterman_api_key` | Required for `/letterman-publications` and `/create-article` |
| `postbridge_api_key` | For PostBridge integrations |

---

## All Commands (85 total)

### ðŸ‘¤ User Profile
`/profile` `/update-profile`

### âš™ï¸ Settings [X-Workspace-Id]
`/settings` `/save-setting`

### ðŸ–¥ï¸ Control Center
`/control` `/sync-control-full` `/update-control` `/sync-spend`

### ðŸ¢ Workspaces
`/workspaces` `/create-workspace` `/rename-workspace` `/delete-workspace`

### ðŸ”‘ Workspace Keys
`/workspace-keys`

### ðŸŽ¬ Clips [X-Workspace-Id]
`/clips` `/clips-approved` `/poll-clips` `/approve-clip` `/reject-clip` `/update-clip-status` `/delete-clip`

### ðŸŽ¥ Videos [X-Workspace-Id]
`/videos` `/add-video` `/update-video` `/delete-video`

### ðŸ“‚ Video Categories [X-Workspace-Id]
`/video-categories` `/create-video-category` `/delete-video-category`

### ðŸ“° Articles [X-Workspace-Id]
`/articles` `/articles-approved` `/add-article` `/create-article` `/approve-article` `/reject-article` `/draft-article` `/publish-article` `/delete-article` `/update-article-status` `/letterman-publications`

### ðŸ“± Social Posts [X-Workspace-Id]
`/social-posts` `/create-social-post` `/update-social-post` `/delete-social-post`

### ðŸ“¡ Publications
`/publications` `/create-publication` `/toggle-publication` `/delete-publication`

### ðŸ’¡ Ideas
`/ideas` `/create-idea` `/update-idea` `/delete-idea`

### ðŸ“– Bookmarks
`/bookmarks` `/create-bookmark` `/update-bookmark` `/delete-bookmark`

### ðŸ¢ Businesses
`/businesses` `/add-business` `/update-business` `/delete-business`

### ðŸŽ¯ Assets
`/assets` `/create-asset` `/update-asset` `/delete-asset`

### ðŸ§  Memory Banks
`/memory-banks` `/create-memory-bank` `/delete-memory-bank`

### ðŸ“‹ Team Board
`/team-projects` `/create-team-project` `/update-team-project` `/delete-team-project`
`/team-tasks` `/create-team-task` `/update-team-task` `/delete-team-task`

### âŒ¨ï¸ Commands
`/commands` `/create-command` `/update-command` `/delete-command`
`/setup-commands` `/sync-all-commands` `/sync-skill-commands`

### ðŸ—„ï¸ Vault
`/vault` `/create-vault-item`

### ðŸ›’ Shopping
`/shopping` `/add-shopping-item` `/update-shopping-item`

---

## Integration Patterns

### Clips (Vizard â†’ PostStream)
1. Bot polls Vizard every 6h â†’ `/poll-clips`
2. Human approves clips in dashboard â†’ `/approve-clip`
3. Bot publishes hourly â†’ `/clips-approved` â†’ PostStream â†’ `/update-clip-status`

### Articles (Letterman)
1. Bot adds drafts â†’ `/add-article`
2. Human approves â†’ `/approve-article`
3. Bot publishes hourly â†’ `/articles-approved` â†’ Letterman â†’ `/publish-article`

---

## Safety

âš ï¸ Operations requiring explicit **"yes"** confirmation:
All DELETE operations, `POST /api/articles/delete`

âš ï¸ Shopping DELETE is **soft delete** (archives item, does NOT remove from database)

For complete endpoint reference see `references/endpoints.md`.
