# Control Board API Skill â€” Guardrails & Safety

**Version:** 2.0.1  
**Last Updated:** 2026-04-06  
**Total Commands:** 85

---

## Overview

This document defines safety guardrails, risk classification, and confirmation requirements for the Control Board API skill v2.0.0.

---

## Critical Rules (Never Violate)

1. **Never use `gateway config.patch`** to save the API token â€” write directly to `.env.personal`
2. **Never write to `~/.openclaw/openclaw.json`** â€” read only, never modify
3. **Never trigger a gateway restart** as part of this skill's setup flow
4. **Never skip Step 2** (Control Center sync) and jump straight to Step 3 (commands)
5. **Always include `X-Workspace-Id` header** on workspace-scoped endpoints (Settings, Clips, Videos, Video Categories, Articles, Social Posts)

---

## Risk Classification

### ðŸ”´ High Risk â€” Require Explicit "yes" Confirmation

These operations are **irreversible** or delete significant data:

| Command | Endpoint | Risk |
|---|---|---|
| `/delete-workspace` | DELETE /api/workspaces | Deletes entire workspace and all scoped data |
| `/delete-business` | DELETE /api/businesses | Deletes business + all cards and resources |
| `/delete-memory-bank` | DELETE /api/memory-banks | Deletes bank + all content |
| `/delete-team-project` | DELETE /api/team/projects | Deletes project |
| `/delete-article` | POST /api/articles/delete | Permanent |
| `/delete-clip` | DELETE /api/clips | Permanent |
| `/delete-video` | DELETE /api/videos | Permanent |
| `/delete-video-category` | DELETE /api/video-categories | Permanent |
| `/delete-social-post` | DELETE /api/social-posts | Permanent |
| `/delete-publication` | DELETE /api/publications | Permanent |
| `/delete-idea` | DELETE /api/ideas | Permanent |
| `/delete-bookmark` | DELETE /api/bookmarks | Permanent |
| `/delete-asset` | DELETE /api/assets | Permanent |
| `/delete-team-task` | DELETE /api/team/tasks | Permanent |
| `/delete-command` | DELETE /api/commands?id= | Permanent |
| `/delete-memory-bank` | DELETE /api/memory-banks | Permanent |

**Confirmation flow:**
1. Fetch and display item details to user
2. State what will be deleted
3. Ask: "Are you sure? Type **yes** to confirm."
4. Only proceed on exact "yes" â€” anything else aborts

### ðŸŸ¡ Medium Risk â€” Mutating (No Confirmation Required)

These modify data but are reversible or low-impact:

- All create operations (POST new items)
- All update operations (PUT/PATCH existing items)
- `/approve-clip`, `/reject-clip`, `/update-clip-status`
- `/approve-article`, `/reject-article`, `/draft-article`, `/publish-article`, `/update-article-status`
- `/update-social-post` (approve/reject/publish)
- `/toggle-publication` (activate/deactivate)
- `/sync-control-full`, `/update-control`, `/sync-spend`
- `/poll-clips`
- `/setup-commands`, `/sync-all-commands`, `/sync-skill-commands`

### ðŸŸ¢ Low Risk â€” Read Only

- All GET operations
- `/profile`, `/settings`, `/control`, `/workspaces`, `/workspace-keys`
- All list commands: `/clips`, `/articles`, `/videos`, `/ideas`, `/bookmarks`, etc.

---

## Shopping DELETE â€” Special Case

`DELETE /api/shopping` is a **soft delete** â€” it sets the item's status to `archived` and does NOT remove it from the database. The item remains visible under the Archived filter.

When a user asks to delete a shopping item, clarify:
> "This will archive the item (not permanently delete it). It will remain visible under the Archived filter. Proceed?"

---

## DELETE Endpoint Inconsistencies

Two different patterns â€” do not mix them up:

**Query param (no body):**
- Commands â†’ `DELETE /api/commands?id=<commandId>`

**JSON body:**
- Clips â†’ `DELETE /api/clips` `{ "clip_id": "..." }` â† uses `clip_id` not `id`
- All others â†’ `DELETE /api/<resource>` `{ "id": "..." }`

**POST as delete:**
- Articles â†’ `POST /api/articles/delete` `{ "id": "..." }`

---

## Workspace Scope Rules

Always include `X-Workspace-Id` header on:
- `GET /api/settings`
- `POST /api/settings`
- `GET /api/clips` and all clip endpoints
- `POST /api/clips/poll`
- `PATCH /api/clips/status`
- `DELETE /api/clips`
- `GET /api/videos` and all video endpoints
- `GET /api/video-categories` and all video category endpoints
- `GET /api/articles` and all article endpoints
- `GET /api/social-posts` and all social post endpoints

Missing this header on workspace-scoped endpoints will return data from the wrong scope or an error.

---

## Token Security

- Store token in `~/.openclaw/workspace/.env.personal` as `CONTROLBOARD_API_TOKEN=<value>`
- Read by: opening the file and extracting value after `CONTROLBOARD_API_TOKEN=`
- API keys in Control Center are masked for display (`sk-...abc`) â€” never expose raw keys in dashboard responses
- When syncing API keys to Control Center, use the `api_key_raw` field â€” the server handles masking

---

## Command Schema Safety

When registering commands via `POST /api/commands`:

âœ… Valid schema:
```json
{
  "name": "/command-name",
  "description": "Short description",
  "long_description": "Step 1: ...\nStep 2: ...\nStep 3: ...",
  "category": "Resources",
  "tags": []
}
```

âŒ Invalid (do not use â€” old schema):
```json
{
  "steps": [],
  "command_group": "...",
  "shortcut": "...",
  "sort_order": 0
}
```

- `long_description` must have at least 3 newline-separated steps
- `category` must be exactly: `Resources` | `External Software` | `Titanium`
- Commands DELETE uses query param `?id=` â€” not a JSON body

---

## Businesses â€” Update Pattern

Business update uses the same `POST /api/businesses` endpoint as create, distinguished by the `action` field:

```json
// Create
{ "action": "add", "name": "Acme Corp", "columns": ["Marketing", "Sales"] }

// Update (FULL document replace â€” include ALL cards and resources)
{ "action": "update", "business": { "id": "...", "name": "...", "columns": [...], "cards": [...], "resources": [...] } }
```

âš ï¸ The update is a **full replace** of the business document. Always fetch the current state first, then merge changes before posting back.

---

## Workspace Deletion

`DELETE /api/workspaces` will **fail** if the user tries to delete their last remaining workspace. Always check workspace count first and warn the user if they only have one.

---

## Error Handling Reference

| Code | Meaning | Action |
|---|---|---|
| 401 | Invalid/expired token | Guide user to refresh token at https://control.clawlauncher.io â†’ Settings |
| 403 | Forbidden | Check API permissions |
| 404 | Not found | Verify the ID is correct |
| 409 | Conflict | Resource already exists (e.g. duplicate video category name) |
| 400 | Bad request | Show error details to user |
| 422 | Validation error | Show field-level errors |
| 429 | Rate limited | Wait and retry |
| 5xx | Server error | Retry later |
