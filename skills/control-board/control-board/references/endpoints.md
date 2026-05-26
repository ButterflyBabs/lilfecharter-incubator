# Control Board API — Endpoint Reference (v2.0.0)

> **Base URL:** `https://control.clawlauncher.io`
> **Auth:** `Authorization: Bearer <token>` required on **all** endpoints
> **Workspace:** `X-Workspace-Id: <id>` required on sections marked **[WS]**

---

## 1. User Profile

### `GET /api/user/me`
Get the authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "user_abc123",
  "name": "Gaurav Subedi",
  "email": "gaurav@example.com",
  "roles": ["admin"],
  "accessLevel": "full",
  "status": "active",
  "lastLogin": "2026-04-06T12:00:00Z"
}
```

---

### `PATCH /api/user/profile`
Update the authenticated user's profile fields.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | optional | Display name |
| `company` | string | optional | Company name |
| `phone` | string | optional | Phone number |

**Response:** Updated user profile object.

---

## 2. Settings [WS]

### `GET /api/settings`
Get all workspace settings as key/value pairs.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Response:**
```json
{
  "settings": {
    "vizard_api_key": "vz_...",
    "vizard_project_id": "proj_...",
    "letterman_api_key": "lm_..."
  }
}
```

---

### `POST /api/settings`
Save or update a single workspace setting.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `key` | string | **required** | Setting key name |
| `value` | string | **required** | Setting value |

**Response:** `{ "success": true }`

---

## 3. Control Center

### `GET /api/control`
Get the current Control Center state including all synced sections.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "apiKeys": [...],
  "models": [...],
  "cronJobs": [...],
  "tasks": [...],
  "channels": [...],
  "integrations": [...],
  "features": [...]
}
```

---

### `POST /api/control`
**Full replace** of the Control Center. Any sections not included in the payload will be cleared.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `apiKeys` | array | optional | Use `api_key_raw` field (not `key_masked`) for actual key values |
| `models` | array | optional | AI model configs |
| `cronJobs` | array | optional | Scheduled job configs |
| `tasks` | array | optional | Task list |
| `channels` | array | optional | Channel configs |
| `integrations` | array | optional | Integration configs |
| `features` | array | optional | Feature flags |

> ⚠️ **Full replace:** Absent sections are cleared. Use `PATCH` for partial updates.

**Response:** `{ "success": true }`

---

### `PATCH /api/control`
**Partial update** of the Control Center. Only provided sections are updated; absent sections remain untouched.

**Headers:** `Authorization: Bearer <token>`

**Body:** Same fields as `POST /api/control` — include only the section(s) to update.

> ✅ **Safe:** Absent sections are not modified.

**Response:** `{ "success": true }`

---

### `POST /api/control/sync-spend`
Fetch and sync API spend data from provider billing APIs (OpenAI, Anthropic, Mistral). Groq is skipped.

**Headers:** `Authorization: Bearer <token>`

**Body:** None

**Response:**
```json
{
  "spend": {
    "openai": 12.34,
    "anthropic": 5.67,
    "mistral": 0.89
  }
}
```

---

## 4. Workspaces

### `GET /api/workspaces`
List all workspaces for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "workspaces": [
    { "id": "ws_abc", "name": "Main", "slug": "main" }
  ]
}
```

---

### `POST /api/workspaces`
Create a new workspace.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Workspace name |

> ⚠️ First workspace creation migrates all existing non-workspace-scoped data.

**Response:** `{ "id": "ws_new123", "name": "New Workspace", "slug": "new-workspace" }`

---

### `PUT /api/workspaces`
Rename an existing workspace.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Workspace ID |
| `name` | string | **required** | New name |

**Response:** `{ "success": true }`

---

### `DELETE /api/workspaces`
Delete a workspace and all its scoped data.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Workspace ID |

> ⚠️ Cannot delete the last remaining workspace.

**Response:** `{ "success": true }`

---

## 5. Workspace Keys

### `GET /api/workspace-keys`
View which API keys are configured for each workspace (returns boolean flags, not key values).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "workspaces": [
    {
      "id": "ws_abc",
      "name": "Main",
      "vizard_api_key": true,
      "letterman_api_key": false,
      "poststream_api_key": true
    }
  ]
}
```

---

## 6. Clips [WS]

### `GET /api/clips`
List video clips with optional filtering and sorting.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Query Params:**
| Param | Type | Notes |
|-------|------|-------|
| `filter` | string | Status filter: `pending_review`, `approved`, `published`, `rejected` |
| `category` | string | Filter by category name |
| `sortBy` | string | Sort field |

**Response:**
```json
{
  "clips": [
    { "clip_id": "cl_abc", "title": "My Clip", "status": "approved", "viral_score": 87, "category": "Tutorial" }
  ],
  "stats": { "total": 10, "pending": 2, "approved": 5, "published": 2, "rejected": 1 },
  "categories": ["Tutorial", "Highlights"]
}
```

---

### `GET /api/clips/approved`
Get all approved clips ready for publishing.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Response:**
```json
{
  "clips": [
    { "clip_id": "cl_abc", "title": "My Clip", "viral_score": 87, "clip_url": "https://..." }
  ],
  "count": 5
}
```

---

### `POST /api/clips/poll`
Poll Vizard API for new clips and import them into the workspace.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:** None (uses `vizard_api_key` and `vizard_project_id` from settings)

**Response:** `{ "added": 3, "total": 15 }`

---

### `PATCH /api/clips/status`
Update the status of a clip.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `clip_id` | string | **required** | Clip identifier |
| `status` | string | **required** | `pending_review` \| `approved` \| `rejected` |

**Response:** `{ "success": true }`

---

### `DELETE /api/clips`
Permanently delete a clip.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `clip_id` | string | **required** | ⚠️ Uses `clip_id` field, NOT `id` |

**Response:** `{ "success": true }`

---

## 7. Videos [WS]

### `GET /api/videos`
List manually-added videos with optional filtering.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Query Params:**
| Param | Type | Notes |
|-------|------|-------|
| `filter` | string | Status filter |
| `category` | string | Filter by category |
| `sortBy` | string | Sort field |

**Response:**
```json
{
  "videos": [
    { "id": "vid_abc", "name": "Tutorial #1", "url": "https://...", "source": "youtube", "status": "approved", "category": "Education" }
  ],
  "stats": { "total": 8, "pending": 1, "approved": 5, "published": 2 }
}
```

---

### `POST /api/videos`
Add a new video to the workspace. Default status is `pending_review`.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Video name |
| `url` | string | **required** | Video URL |
| `source` | string | optional | e.g., `youtube`, `vimeo` |
| `category` | string | optional | Category name |
| `category_emoji` | string | optional | Emoji for category |

**Response:** `{ "id": "vid_new", "status": "pending_review" }`

---

### `PUT /api/videos`
Update a video's status or category.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Video ID |
| `status` | string | optional | `pending_review` \| `approved` \| `published` \| `rejected` |
| `category` | string | optional | Category name |
| `category_emoji` | string | optional | Emoji for category |

**Response:** `{ "success": true }`

---

### `DELETE /api/videos`
Permanently delete a video.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Video ID |

**Response:** `{ "success": true }`

---

## 8. Video Categories [WS]

### `GET /api/video-categories`
List all video categories for the workspace.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Response:**
```json
{
  "categories": [
    { "id": "cat_abc", "name": "Education", "emoji": "📚" }
  ],
  "count": 3
}
```

---

### `POST /api/video-categories`
Create a new video category.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Category name — must be unique (409 on duplicate) |
| `emoji` | string | optional | Emoji icon |

**Response:** `{ "id": "cat_new", "name": "Education", "emoji": "📚" }`

---

### `DELETE /api/video-categories`
Delete a video category.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Category ID |

**Response:** `{ "success": true }`

---

## 9. Articles [WS]

### `GET /api/articles`
List all articles in the workspace.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Response:**
```json
{
  "articles": [
    { "id": "art_abc", "title": "My Article", "status": "draft", "publication": "Daily News", "created_at": "2026-04-01T10:00:00Z" }
  ],
  "count": 12
}
```

---

### `GET /api/articles/approved`
List approved articles ready for publishing.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Query Params:**
| Param | Type | Notes |
|-------|------|-------|
| `sort` | string | `newest_first` \| `oldest_first` \| `title` |
| `search` | string | Search by title keyword |

**Response:** Array of approved articles with `id`, `title`, `publication`.

---

### `PATCH /api/articles/status`
Update article status directly.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Article ID |
| `status` | string | **required** | `draft` \| `approve` \| `rejected` \| `published` |

**Response:** `{ "success": true }`

---

### `POST /api/articles/add`
Manually add an article (saved as draft).

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Article title |
| `url` | string | **required** | Article URL |
| `imageUrl` | string | **required** | Cover image URL |
| `description` | string | optional | Short description |
| `storageId` | string | optional | Letterman publication ID |
| `publicationName` | string | optional | Publication display name |

**Response:** `{ "id": "art_new", "status": "draft" }`

---

### `POST /api/articles/create`
Create article via Letterman API with image upload. Requires `letterman_api_key` in settings.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `publicationId` | string | **required** | Letterman publication ID |
| `publicationName` | string | **required** | Publication display name |
| `url` | string | **required** | Source article URL |
| `keywords` | string[] | optional | SEO keywords |
| `imageBase64` | string | optional | Base64-encoded image for upload |

**Response:** `{ "id": "art_new", "image_url": "https://..." }`

---

### `POST /api/articles/approve`
Approve an article for publishing.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true, "status": "approve" }`

---

### `POST /api/articles/reject`
Reject an article.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true, "status": "rejected" }`

---

### `POST /api/articles/draft`
Move an article back to draft status.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true, "status": "draft" }`

---

### `POST /api/articles/publish`
Mark an article as published. Article must already be in `approve` status.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true, "status": "published" }`

---

### `POST /api/articles/delete`
Permanently delete an article.

> ⚠️ **This is a POST request, not an HTTP DELETE.**

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

### `GET /api/articles/publications`
Fetch available Letterman publications. Requires `letterman_api_key` in settings.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Response:**
```json
{
  "publications": [
    { "id": "pub_abc", "name": "Daily Newsletter" }
  ]
}
```

> Use the returned `id` as `storageId` when calling `/api/articles/add`.

---

## 10. Social Posts [WS]

### `GET /api/social-posts`
List social media posts with optional status filter.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Query Params:**
| Param | Type | Notes |
|-------|------|-------|
| `status` | string | `all` \| `pending` \| `approved` \| `scheduled` \| `published` \| `rejected` |

**Response:**
```json
{
  "posts": [
    { "id": "sp_abc", "title": "My Post", "platforms": ["instagram", "x"], "format": "image", "status": "pending" }
  ],
  "count": 5
}
```

---

### `POST /api/social-posts`
Create a new social media post (starts with `pending` status).

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Post title |
| `description` | string | optional | Post description |
| `image_url` | string | optional | Cover image URL |
| `caption` | string | optional | Post caption/copy |
| `platforms` | string[] | optional | `instagram` \| `youtube` \| `tiktok` \| `x` \| `bluesky` \| `linkedin` |
| `format` | string | optional | `image` \| `video` \| `text` \| `carousel` |

**Response:** `{ "id": "sp_new", "status": "pending" }`

---

### `PUT /api/social-posts`
Approve, reject, or publish a social post.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Post ID |
| `action` | string | **required** | `approve` → `approved` \| `reject` → `rejected` \| `publish` → `published` |

**Response:** `{ "success": true, "status": "approved" }`

---

### `DELETE /api/social-posts`
Permanently delete a social post.

**Headers:** `Authorization: Bearer <token>`, `X-Workspace-Id: <id>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 11. Publications

### `GET /api/publications`
List all publications.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "publications": [
    { "id": "pub_abc", "name": "Daily News", "status": "active", "city": "Austin", "state": "TX" }
  ],
  "count": 3
}
```

---

### `POST /api/publications`
Create a new publication (starts with `active` status).

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Publication name |
| `description` | string | optional | Description |
| `city` | string | optional | City |
| `state` | string | optional | State |
| `letterman_publication_id` | string | optional | Linked Letterman ID |
| `letterman_url` | string | optional | Letterman publication URL |

**Response:** `{ "id": "pub_new", "status": "active" }`

---

### `PATCH /api/publications`
Activate or deactivate a publication.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Publication ID |
| `action` | string | **required** | `activate` \| `deactivate` |

**Response:** `{ "success": true }`

---

### `DELETE /api/publications`
Permanently delete a publication.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 12. Ideas

### `GET /api/ideas`
List all ideas.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "ideas": [
    { "id": "idea_abc", "title": "New Feature", "status": "active", "priority": "high", "category": "Product" }
  ],
  "count": 7
}
```

---

### `POST /api/ideas`
Create a new idea.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Idea title |
| `description` | string | optional | Detailed description |
| `category` | string | optional | Category label |
| `status` | string | optional | `active` \| `archived` |
| `priority` | string | optional | `low` \| `medium` \| `high` |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "idea_new" }`

---

### `PUT /api/ideas`
Update an existing idea.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Idea ID |
| `title` | string | optional | |
| `description` | string | optional | |
| `category` | string | optional | |
| `status` | string | optional | `active` \| `archived` |
| `priority` | string | optional | `low` \| `medium` \| `high` |
| `tags` | string[] | optional | |

**Response:** `{ "success": true }`

---

### `DELETE /api/ideas`
Permanently delete an idea.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 13. Bookmarks

### `GET /api/bookmarks`
List all bookmarks.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "bookmarks": [
    { "id": "bk_abc", "title": "Useful Resource", "url": "https://...", "category": "Dev", "status": "read-later" }
  ],
  "count": 14
}
```

---

### `POST /api/bookmarks`
Create a new bookmark.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Bookmark title |
| `url` | string | optional | URL |
| `description` | string | optional | Notes |
| `category` | string | optional | Category label |
| `status` | string | optional | `read-later` \| `read` \| `archived` |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "bk_new" }`

---

### `PUT /api/bookmarks`
Update an existing bookmark.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Bookmark ID |
| `title` | string | optional | |
| `url` | string | optional | |
| `description` | string | optional | |
| `category` | string | optional | |
| `status` | string | optional | `read-later` \| `read` \| `archived` |
| `tags` | string[] | optional | |

**Response:** `{ "success": true }`

---

### `DELETE /api/bookmarks`
Permanently delete a bookmark.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 14. Businesses

### `GET /api/businesses`
List all business boards.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "businesses": [
    {
      "id": "biz_abc",
      "name": "Acme Corp",
      "columns": ["Marketing", "Follow-up", "Research", "Delivery"],
      "cards": [],
      "resources": []
    }
  ],
  "count": 2
}
```

---

### `POST /api/businesses` (add)
Create a new business board.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `action` | string | **required** | Must be `"add"` |
| `name` | string | **required** | Business name |
| `columns` | string[] | optional | Column names (default: Marketing, Follow-up, Research, Delivery) |

**Response:** `{ "id": "biz_new" }`

---

### `POST /api/businesses` (update)
Update an existing business board. This is a **full document replace** — include the complete business object.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `action` | string | **required** | Must be `"update"` |
| `business` | object | **required** | Full business object (see below) |

**Business object fields:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |
| `name` | string | **required** |
| `columns` | string[] | **required** |
| `cards` | object[] | **required** |
| `resources` | object[] | **required** |

> ⚠️ This is the **same POST endpoint** as add, differentiated by `action: "update"`. Always pass the full business object — partial updates are not supported.

**Response:** `{ "success": true }`

---

### `DELETE /api/businesses`
Permanently delete a business board and all its cards and resources.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 15. Assets

### `GET /api/assets`
List all digital assets.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "assets": [
    { "id": "ast_abc", "title": "Logo Pack", "category": "Branding", "status": "active", "tags": ["logo", "brand"] }
  ],
  "count": 9
}
```

---

### `POST /api/assets`
Create a new asset entry.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Asset title |
| `description` | string | optional | Description |
| `category` | string | optional | Category label |
| `status` | string | optional | `active` \| `planning` \| `completed` |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "ast_new" }`

---

### `PUT /api/assets`
Update an existing asset.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Asset ID |
| `title` | string | optional | |
| `description` | string | optional | |
| `category` | string | optional | |
| `status` | string | optional | `active` \| `planning` \| `completed` |
| `tags` | string[] | optional | |

**Response:** `{ "success": true }`

---

### `DELETE /api/assets`
Permanently delete an asset.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 16. Memory Banks

### `GET /api/memory-banks`
List all memory banks.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "memoryBanks": [
    { "id": "mb_abc", "name": "Brand Voice", "description": "Guidelines for tone and style" }
  ],
  "count": 3
}
```

---

### `POST /api/memory-banks`
Create a new memory bank. Starts with an empty content array.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Memory bank name |
| `description` | string | optional | Description |

**Response:** `{ "id": "mb_new", "content": [] }`

---

### `DELETE /api/memory-banks`
Permanently delete a memory bank and all its content.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 17. Team Board

### `GET /api/team/projects`
List all team projects.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "projects": [
    { "id": "proj_abc", "name": "Q2 Launch", "color": "#4f46e5", "task_count": 12 }
  ],
  "count": 4
}
```

---

### `POST /api/team/projects`
Create a new team project. A project must exist before tasks can be added to it.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Project name |
| `color` | string | optional | Hex color code (e.g. `#4f46e5`) |

**Response:** `{ "id": "proj_new" }`

---

### `PUT /api/team/projects`
Update a team project's name or color.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Project ID |
| `name` | string | optional | New name |
| `color` | string | optional | New hex color |

**Response:** `{ "success": true }`

---

### `DELETE /api/team/projects`
Permanently delete a team project.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

### `GET /api/team/tasks`
List team tasks with optional project filter.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Type | Notes |
|-------|------|-------|
| `project_id` | string | Optional — filter tasks by project |

**Response:**
```json
{
  "tasks": [
    {
      "id": "task_abc",
      "title": "Write blog post",
      "status": "in_progress",
      "priority": "high",
      "assignee": "gaurav",
      "due_date": "2026-04-15",
      "progress": 60
    }
  ],
  "count": 8
}
```

---

### `POST /api/team/tasks`
Create a new team task.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Task title |
| `description` | string | optional | Detailed description |
| `status` | string | optional | `inbox` \| `assigned` \| `in_progress` \| `review` \| `done` |
| `priority` | string | optional | `low` \| `medium` \| `high` |
| `project_id` | string | optional | Associated project ID |
| `assignee` | string | optional | Assignee name or ID |
| `due_date` | string | optional | ISO date string |
| `tags` | string[] | optional | Tags array |
| `progress` | number | optional | 0–100 percent complete |

**Response:** `{ "id": "task_new" }`

---

### `PUT /api/team/tasks`
Update an existing team task.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Task ID |
| `title` | string | optional | |
| `description` | string | optional | |
| `status` | string | optional | `inbox` \| `assigned` \| `in_progress` \| `review` \| `done` |
| `priority` | string | optional | `low` \| `medium` \| `high` |
| `project_id` | string | optional | |
| `assignee` | string | optional | |
| `due_date` | string | optional | |
| `tags` | string[] | optional | |
| `progress` | number | optional | 0–100 |

**Response:** `{ "success": true }`

---

### `DELETE /api/team/tasks`
Permanently delete a team task.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

**Response:** `{ "success": true }`

---

## 18. Vault

### `GET /api/vault/items`
List all vault items.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "items": [
    { "id": "v_abc", "title": "Brand Kit", "type": "Design Link", "category": "Design", "url": "https://..." }
  ],
  "count": 6
}
```

---

### `POST /api/vault/items`
Store a new item in the vault.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Item title |
| `category` | string | optional | Category label |
| `type` | string | optional | `Image` \| `File` \| `Screenshot` \| `PPT` \| `URL` \| `Video` \| `Text` \| `Design Link` |
| `url` | string | optional | Resource URL |
| `notes` | string | optional | Notes or description |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "v_new" }`

---

## 19. Shopping

### `GET /api/shopping`
List all shopping/wish list items.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "items": [
    { "id": "sh_abc", "title": "Mechanical Keyboard", "price": 149.99, "status": "to-buy", "url": "https://..." }
  ],
  "count": 5
}
```

---

### `POST /api/shopping`
Add a new item to the wish list.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **required** | Item title |
| `url` | string | optional | Product URL |
| `price` | number | optional | Price |
| `image` | string | optional | Image URL |
| `description` | string | optional | Description |
| `category` | string | optional | Category label |
| `status` | string | optional | `to-buy` \| `watching` \| `archived` |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "sh_new" }`

---

### `PUT /api/shopping`
Update a shopping list item.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Item ID |
| `title` | string | optional | |
| `url` | string | optional | |
| `price` | number | optional | |
| `image` | string | optional | |
| `description` | string | optional | |
| `category` | string | optional | |
| `status` | string | optional | `to-buy` \| `watching` \| `archived` |
| `tags` | string[] | optional | |

**Response:** `{ "success": true }`

---

### `DELETE /api/shopping`
Soft delete (archives) a shopping item — **not permanent**.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `id` | string | **required** |

> ℹ️ This is a **soft delete**. The item is archived (status set to `archived`), not permanently removed from the database.

**Response:** `{ "success": true }`

---

## 20. Commands

### `GET /api/commands`
List all command shortcuts in the registry.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "commands": [
    {
      "id": "cmd_abc",
      "name": "/profile",
      "description": "Get your Control Board user profile",
      "category": "Resources",
      "tags": []
    }
  ],
  "count": 85
}
```

---

### `POST /api/commands`
Create a new command shortcut.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | **required** | Command name (e.g. `/profile`) |
| `description` | string | **required** | Short description |
| `long_description` | string | optional | Newline-separated step instructions |
| `category` | string | optional | `Resources` \| `External Software` \| `Titanium` |
| `tags` | string[] | optional | Tags array |

**Response:** `{ "id": "cmd_new" }`

---

### `PUT /api/commands`
Update an existing command.

**Headers:** `Authorization: Bearer <token>`

**Body:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | **required** | Command ID |
| `name` | string | optional | |
| `description` | string | optional | |
| `long_description` | string | optional | |
| `category` | string | optional | `Resources` \| `External Software` \| `Titanium` |
| `tags` | string[] | optional | |

**Response:** `{ "success": true }`

---

### `DELETE /api/commands?id=<commandId>`
Delete a command shortcut.

> ⚠️ **Query parameter, not body.** The command ID is passed as a URL query param.

**URL:** `DELETE /api/commands?id=cmd_abc`

**Headers:** `Authorization: Bearer <token>`

**Body:** None

**Response:** `{ "success": true }`
