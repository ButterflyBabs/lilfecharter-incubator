# Control Board API â€” Summary (v2.0.1)

**Base URL:** `https://control.clawlauncher.io`  
**Auth:** `Authorization: Bearer <CONTROLBOARD_API_TOKEN>`  
**Workspace header:** `X-Workspace-Id: <workspaceId>` (required on marked sections)

---

## API Sections

| # | Section | Endpoints | Workspace-Scoped | Commands |
|---|---|---|---|---|
| 1 | User Profile | GET /api/user/me, PATCH /api/user/profile | No | 2 |
| 2 | Settings | GET /api/settings, POST /api/settings | âœ… Yes | 2 |
| 3 | Control Center | GET/POST/PATCH /api/control, POST /api/control/sync-spend | No | 4 |
| 4 | Workspaces | GET/POST/PUT/DELETE /api/workspaces | No | 4 |
| 5 | Workspace Keys | GET /api/workspace-keys | No | 1 |
| 6 | Clips | GET/PATCH /api/clips, GET /api/clips/approved, POST /api/clips/poll, DELETE /api/clips | âœ… Yes | 7 |
| 7 | Videos | GET/POST/PUT/DELETE /api/videos | âœ… Yes | 4 |
| 8 | Video Categories | GET/POST/DELETE /api/video-categories | âœ… Yes | 3 |
| 9 | Articles | GET/PATCH/POST(Ã—7) /api/articles/* | âœ… Yes | 11 |
| 10 | Social Posts | GET/POST/PUT/DELETE /api/social-posts | âœ… Yes | 4 |
| 11 | Publications | GET/POST/PATCH/DELETE /api/publications | No | 4 |
| 12 | Ideas | GET/POST/PUT/DELETE /api/ideas | No | 4 |
| 13 | Bookmarks | GET/POST/PUT/DELETE /api/bookmarks | No | 4 |
| 14 | Businesses | GET/POST(Ã—2)/DELETE /api/businesses | No | 4 |
| 15 | Assets | GET/POST/PUT/DELETE /api/assets | No | 4 |
| 16 | Memory Banks | GET/POST/DELETE /api/memory-banks | No | 3 |
| 17 | Team Board | GET/POST/PUT/DELETE /api/team/projects+tasks | No | 8 |
| 18 | Vault | GET/POST /api/vault/items | No | 2 |
| 19 | Shopping | GET/POST/PUT/DELETE /api/shopping | No | 3 |
| 20 | Commands | GET/POST/PUT/DELETE /api/commands | No | 7 |
| | **Total** | **55 endpoints** | | **85 commands** |

---

## Key Patterns

### Authentication Headers
```
Authorization: Bearer <CONTROLBOARD_API_TOKEN>       â† all endpoints
X-Workspace-Id: <workspaceId>                        â† workspace-scoped only
Content-Type: application/json                       â† all POST/PUT/PATCH
```

### DELETE Patterns (inconsistent â€” do not mix up)
| Resource | Method | How to identify |
|---|---|---|
| Commands | DELETE /api/commands?id=X | Query param |
| Clips | DELETE /api/clips `{ clip_id }` | Body, field is `clip_id` not `id` |
| All others | DELETE /api/<resource> `{ id }` | Body, field is `id` |
| Articles | POST /api/articles/delete `{ id }` | POST verb, not DELETE |
| Shopping | DELETE /api/shopping `{ id }` | Soft delete (archives, not permanent) |

### Control Center Sync
- `POST /api/control` = **full replace** (absent sections cleared)
- `PATCH /api/control` = **partial update** (absent sections untouched)
- API keys use `api_key_raw` field (server auto-generates masked version)

### Command Schema (v2.0.1)
```json
{
  "name": "/command-name",
  "description": "Short description",
  "long_description": "Step 1: ...\nStep 2: ...\nStep 3: ...",
  "category": "Resources | External Software | Titanium",
  "tags": []
}
```
**Removed fields:** `steps[]`, `command_group`, `shortcut`, `sort_order`

### Businesses Update
Both add and update use `POST /api/businesses`:
- Add: `{ "action": "add", "name": "...", "columns": [] }`
- Update: `{ "action": "update", "business": { id, name, columns, cards[], resources[] } }` â€” FULL replace

---

## Article Status Flow
```
draft â†’ approve â†’ published
  â†‘         â†“
  draft â† rejected
```
- `PATCH /api/articles/status` â€” generic status setter
- `POST /api/articles/approve|reject|draft|publish` â€” dedicated action endpoints

## Clip Status Flow
```
pending_review â†’ approved â†’ (publish via PostStream)
              â†’ rejected
```
- `PATCH /api/clips/status { clip_id, status }`

## Social Post Status Flow
```
pending â†’ approved â†’ published
        â†’ rejected
```
- `PUT /api/social-posts { id, action: approve|reject|publish }`

## Video Status Flow
```
pending_review â†’ approved â†’ published
              â†’ rejected
```
- `PUT /api/videos { id, status }`

---

## New in v2.0.1 (vs v1.5.2)

### Added
- Workspaces (GET/POST/PUT/DELETE)
- Workspace Keys (GET)
- Videos (GET/POST/PUT/DELETE)
- Video Categories (GET/POST/DELETE)
- Social Posts (GET/POST/PUT/DELETE)
- Publications as standalone resource (GET/POST/PATCH/DELETE)
- Assets (GET/POST/PUT/DELETE)
- Memory Banks (GET/POST/DELETE)
- `X-Workspace-Id` header requirement on 6 sections
- `POST /api/articles/create` â€” Letterman-integrated article creation
- `POST /api/articles/delete` â€” article deletion via POST
- `PUT /api/commands` â€” command update endpoint

### Removed
- PostBridge endpoints (`/api/postbridge/*`)
- Kanban endpoints (`/api/kanban/*`) â€” replaced by `/api/team/*`
- Bulk clip actions (`/api/reject`, `/api/publish`, `/api/bulk-action`)
- `POST /api/control/sync-spend` â€” still exists âœ… (was mistakenly thought removed)
- Old command fields: `steps[]`, `command_group`, `shortcut`, `sort_order`

### Changed
- `DELETE /api/commands` â†’ now uses query param `?id=` (was body)
- Control Center `apiKeys` field â†’ now `api_key_raw` (not `key_masked`)
- Team tasks â†’ richer schema: `assignee`, `due_date`, `tags[]`, `progress`
- Shopping DELETE â†’ confirmed soft delete (archives only)
