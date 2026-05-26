# PostStream API Reference

Complete API documentation for PostStream social media management.

## Base Configuration

**Base URL:** `https://api.poststream.io`  
**Authentication:** `x-api-key` header with API key

## Endpoints

### Workspaces

#### GET /api/v1/workspaces

List all workspaces for the authenticated account.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "workspace-id",
      "name": "My Workspace",
      "slug": "my-workspace",
      "description": "",
      "createdAt": "2026-03-24T18:26:16.485Z",
      "updatedAt": "2026-03-24T18:26:16.485Z"
    }
  ]
}
```

---

### Accounts

#### GET /api/v1/accounts

List all connected social media accounts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "account-id",
      "platform": "instagram",
      "username": "username",
      "workspaceId": "workspace-id",
      "avatarUrl": "https://...",
      "connected": true,
      "followersCount": 100,
      "externalAccountId": "platform-account-id",
      "tokenExpiresAt": "2026-05-23T18:28:56.888Z",
      "createdAt": "2026-03-24T18:28:56.889Z",
      "updatedAt": "2026-03-24T18:28:56.889Z"
    }
  ]
}
```

**Platform values:**
- `instagram`
- `twitter` (X)
- `linkedin`
- `facebook`
- `tiktok`
- `bluesky`

---

### Posts

#### GET /api/v1/posts

List all posts with optional filtering.

**Query Parameters:**
- `page` (number): Page number, default 1
- `limit` (number): Results per page, default 10
- `status` (string): Filter by status (`draft`, `scheduled`, `published`, `failed`)
- `platform` (string): Filter by platform

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post-id",
      "workspaceId": "workspace-id",
      "title": "Post content",
      "caption": "",
      "platforms": ["instagram"],
      "status": "published",
      "mediaType": "image",
      "mediaUrls": ["https://..."],
      "tags": [],
      "scheduledAt": null,
      "publishedAt": "2026-03-24T18:41:02.419Z",
      "publishResult": {
        "instagram": {
          "success": true,
          "platformPostId": "18140022196505634"
        }
      },
      "createdAt": "2026-03-24T18:40:49.542Z",
      "updatedAt": "2026-03-24T18:41:02.419Z"
    }
  ]
}
```

---

#### POST /api/v1/posts

Create a new post.

**Request Body:**
```json
{
  "title": "Post content with caption",
  "platforms": ["instagram", "twitter"],
  "mediaType": "image",
  "mediaUrls": ["https://example.com/image.jpg"],
  "scheduledAt": "2026-03-25T10:00:00Z",
  "tags": ["marketing", "launch"]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Post content/caption (all platforms) |
| `platforms` | array | ✅ Yes | Target platforms (at least 1) |
| `mediaType` | string | ⚠️ Conditional | Required for Instagram/TikTok: `"image"` or `"video"` |
| `mediaUrls` | array | ⚠️ Conditional | Required for Instagram/TikTok. Array of media URLs |
| `scheduledAt` | string | ❌ No | ISO 8601 timestamp for scheduled posts |
| `tags` | array | ❌ No | Array of tags for organization |
| `caption` | string | ❌ No | Alternative caption (legacy, use `title` instead) |

**Platform-Specific Requirements:**

| Platform | mediaType | mediaUrls | Notes |
|----------|-----------|-----------|-------|
| Instagram | ✅ Required | ✅ Required | Must be `"image"` or `"video"` |
| TikTok | ✅ Required | ✅ Required | Must be `"video"` |
| Twitter/X | ❌ Optional | ❌ Optional | Up to 4 images or 1 video |
| LinkedIn | ❌ Optional | ❌ Optional | Supports images, videos, documents |
| Facebook | ❌ Optional | ❌ Optional | Various media types |
| Bluesky | ❌ Optional | ❌ Optional | Similar to Twitter |

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "post-id",
    "workspaceId": "workspace-id",
    "title": "Post content",
    "platforms": ["instagram"],
    "status": "draft",
    "mediaType": "image",
    "mediaUrls": ["https://..."],
    "createdAt": "2026-03-24T18:40:49.542Z",
    "updatedAt": "2026-03-24T18:40:49.542Z"
  },
  "message": "Post created successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "Bad Request",
    "message": [
      "mediaType is required for Instagram publishing",
      "platforms must contain at least 1 elements"
    ]
  }
}
```

---

#### GET /api/v1/posts/{id}

Get details for a specific post.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post-id",
    "workspaceId": "workspace-id",
    "title": "Post content",
    "platforms": ["instagram"],
    "status": "published",
    "mediaType": "image",
    "mediaUrls": ["https://..."],
    "scheduledAt": null,
    "publishedAt": "2026-03-24T18:41:02.419Z",
    "publishResult": {
      "instagram": {
        "success": true,
        "platformPostId": "18140022196505634"
      }
    },
    "createdAt": "2026-03-24T18:40:49.542Z",
    "updatedAt": "2026-03-24T18:41:02.419Z"
  }
}
```

**Status Values:**
- `draft` - Post created but not published
- `publishing` - Post is being published (in progress)
- `published` - Post successfully published
- `scheduled` - Post scheduled for future
- `failed` - Publishing failed (check `publishResult`)

**publishResult Structure:**
```json
{
  "platform-name": {
    "success": true/false,
    "platformPostId": "id-on-platform",
    "error": "error message if failed"
  }
}
```

---

#### POST /api/v1/posts/{id}/publish

Publish a draft post immediately.

**Request:** No body required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post-id",
    "status": "publishing",
    "updatedAt": "2026-03-24T18:40:52.750Z"
  },
  "message": "Post published successfully"
}
```

**Note:** Status will be `publishing` initially. Poll GET /posts/{id} to check final status.

---

#### PATCH /api/v1/posts/{id}

Update a draft post. Only works for posts with status `draft`.

**Request Body (partial update):**
```json
{
  "title": "Updated post content",
  "scheduledAt": "2026-03-26T12:00:00Z",
  "mediaUrls": ["https://example.com/new-image.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post-id",
    "title": "Updated post content",
    "updatedAt": "2026-03-24T19:00:00.000Z"
  }
}
```

---

#### DELETE /api/v1/posts/{id}

Delete a draft or scheduled post. Cannot delete published posts.

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Error Codes

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| 400 | Bad Request | Invalid request body or missing required fields |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found (post ID, account, etc.) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## Rate Limits

PostStream API has rate limiting. Specific limits are not publicly documented, but expect:
- Typical limit: ~60-100 requests per minute
- Burst allowance for short spikes
- 429 status code when exceeded with `Retry-After` header

**Best Practice:** Batch operations when possible and implement exponential backoff for retries.

## Common Patterns

### Pattern 1: Create and Publish in One Flow

```bash
# 1. Create post
POST_ID=$(curl -X POST "https://api.poststream.io/api/v1/posts" \
  -H "x-api-key: ${API_KEY}" \
  -d '{"title":"Content","platforms":["instagram"],"mediaType":"image","mediaUrls":["..."]}' \
  | jq -r '.data.id')

# 2. Publish immediately
curl -X POST "https://api.poststream.io/api/v1/posts/${POST_ID}/publish" \
  -H "x-api-key: ${API_KEY}"

# 3. Check status
curl -X GET "https://api.poststream.io/api/v1/posts/${POST_ID}" \
  -H "x-api-key: ${API_KEY}"
```

### Pattern 2: Schedule for Later

```bash
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -H "x-api-key: ${API_KEY}" \
  -d '{
    "title": "Scheduled content",
    "platforms": ["twitter", "linkedin"],
    "scheduledAt": "2026-03-25T10:00:00Z"
  }'
```

No need to call `/publish` - scheduled posts publish automatically.

### Pattern 3: Multi-Platform with Different Content

For different content per platform, create separate posts:

```bash
# Instagram post (requires media)
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -d '{"title":"Visual content 📸","platforms":["instagram"],"mediaType":"image","mediaUrls":["..."]}'

# Twitter post (text-focused)
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -d '{"title":"Short punchy tweet","platforms":["twitter"]}'

# LinkedIn post (professional tone)
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -d '{"title":"Detailed professional insight...","platforms":["linkedin"]}'
```

### Pattern 4: Draft → Review → Publish

```bash
# 1. Create draft
POST_ID=$(curl -X POST "..." | jq -r '.data.id')

# 2. User reviews in PostStream dashboard

# 3. Update if needed
curl -X PATCH "https://api.poststream.io/api/v1/posts/${POST_ID}" \
  -d '{"title":"Updated content"}'

# 4. Publish when ready
curl -X POST "https://api.poststream.io/api/v1/posts/${POST_ID}/publish"
```

## Webhooks

PostStream may support webhooks for post publish events. Check official documentation for current webhook support and setup instructions.

## SDK / Libraries

PostStream does not currently provide official SDKs. Use standard HTTP clients:
- **Bash**: `curl`
- **Python**: `requests`
- **JavaScript**: `fetch` / `axios`
- **Node.js**: `node-fetch` / `axios`

## Troubleshooting

### Issue: "mediaType is required for Instagram publishing"

**Cause:** Instagram requires `mediaType` field  
**Solution:** Add `"mediaType": "image"` or `"mediaType": "video"`

### Issue: Post status stuck on "publishing"

**Cause:** Platform API delays or network issues  
**Solution:** Wait 10-30 seconds, then check status again. If still stuck after 2 minutes, check `publishResult` for errors.

### Issue: "Account not found"

**Cause:** Target platform not connected in PostStream  
**Solution:** Connect account in PostStream dashboard (poststream.io)

### Issue: Empty response or timeout

**Cause:** Network issues or API downtime  
**Solution:** Retry with exponential backoff. Check PostStream status page.

## Security Best Practices

1. **Never log or expose API keys** in error messages or responses
2. **Store keys securely** in environment variables or config files
3. **Use HTTPS only** - Never send API key over HTTP
4. **Rotate keys periodically** for security
5. **Validate user input** before sending to API
6. **Handle errors gracefully** without exposing internal details to end users

## Support

- **Official Docs:** https://api.poststream.io/docs
- **Dashboard:** https://poststream.io
- **Support:** Contact through PostStream dashboard
