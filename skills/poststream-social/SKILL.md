---
name: PostStream Social Media Manager
slug: poststream-social
author: OpenClaw Community
source: https://github.com/openclaw/skills/poststream-social
description: Create and schedule social media posts across multiple platforms using the PostStream API. Supports Instagram, Twitter/X, LinkedIn, YouTube, TikTok, and Bluesky.
version: 2.0.0
---

# PostStream Social Media Manager

Create, schedule, and publish social media posts across multiple platforms with proper status checking and error handling.

## Supported Platforms

📸 Instagram | 🐦 Twitter/X | 💼 LinkedIn | 🦋 Bluesky | 🎥 TikTok | 📺 YouTube

## Quick Start

### Prerequisites

1. PostStream account: https://poststream.io
2. API key from: https://app.poststream.io/settings (API Keys section)
3. Social media accounts connected in PostStream dashboard
4. API key configured as environment variable

### Configuration

**Required Environment Variables:**

```bash
POSTSTREAM_API_KEY=pb_your_api_key_here
```

**How to get your API key:**
1. Go to https://app.poststream.io/settings
2. Click "API Keys"
3. Generate a new API key (starts with `pb_`)
4. Set as environment variable or in OpenClaw config

**OpenClaw Config:**

```json
{
  "skills": {
    "entries": {
      "poststream-social": {
        "apiKey": "{{ env.POSTSTREAM_API_KEY }}"
      }
    }
  }
}
```

## Supported Commands

This skill responds to:

- ✅ "Post to [platform]"
- ✅ "Create a post"
- ✅ "Schedule a post for [time]"
- ✅ "Create a draft"
- ✅ "Share on social media"
- ✅ "Tweet this" / "Post to Instagram"

**Refusal behavior:**
- Will not post without user confirmation on caption/media
- Will not post to platforms the user hasn't connected
- Will refuse commands outside social media posting scope

## Workflow

### Step 0: Configuration Check

**Before any operation, verify API key is configured:**

```bash
# Check if API key exists
if [ -z "$POSTSTREAM_API_KEY" ]; then
  echo "ERROR: POSTSTREAM_API_KEY not configured"
  exit 1
fi
```

If missing, return clear message:
```
⚠️ PostStream API key not configured.

Please set your API key:
1. Get key from: https://app.poststream.io/settings
2. Set environment variable: POSTSTREAM_API_KEY=pb_your_key
3. Or add to OpenClaw config under skills.entries.poststream-social.apiKey

See README.md for details.
```

### Step 1: Check Connected Accounts

List connected accounts to verify platform availability:

```bash
curl -X GET "https://api.poststream.io/api/v1/accounts" \
  -H "x-api-key: {{ env.POSTSTREAM_API_KEY }}"
```

**Graceful failure:**
- If 401 Unauthorized → "Invalid API key. Please check your credentials."
- If 500 Server Error → "PostStream API is currently unavailable. Try again later."
- If network error → "Cannot connect to PostStream. Check your internet connection."

### Step 2: Gather Content & Validate Media

**Platform media requirements:**

| Platform | Media Required? | Max Image Size | Max Video Size |
|----------|----------------|----------------|----------------|
| Instagram | ✅ Required | 8 MB | 100 MB |
| TikTok | ✅ Required (video only) | N/A | 287 MB |
| YouTube | ✅ Required (video only) | N/A | 256 GB |
| Twitter/X | ❌ Optional | 5 MB | 512 MB |
| LinkedIn | ❌ Optional | 10 MB | 200 MB |
| Bluesky | ❌ Optional | **1 MB** ⚠️ | 50 MB |

**⚠️ Critical: Bluesky has a strict 1MB image limit!**

**Media validation checklist:**
1. Check file size before posting
2. Warn if exceeds platform limits
3. Suggest alternatives (smaller images, compression)
4. If posting to multiple platforms, validate against strictest limit

**Facebook CDN URLs will fail:**
- URLs from `fbcdn.net` have authentication restrictions
- Twitter, LinkedIn, Bluesky cannot access them
- Instagram can (both Meta platforms)
- **Solution:** Download and reupload to public hosting (Cloudinary, Imgur, etc.)

### Step 3: Create Post

```bash
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -H "x-api-key: {{ env.POSTSTREAM_API_KEY }}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Short Title",
    "caption": "Full post caption with hashtags",
    "platforms": ["instagram", "x", "linkedin"],
    "mediaType": "image",
    "mediaUrls": ["https://example.com/image.jpg"]
  }'
```

**Platform names (use exactly as shown):**
- `instagram`
- `x` (for Twitter/X)
- `linkedin`
- `bluesky`
- `tiktok`
- `youtube`

### Step 4: Publish & Status Check (MANDATORY)

**After calling `/publish`, you MUST wait for final status:**

```bash
# Publish
curl -X POST "https://api.poststream.io/api/v1/posts/{postId}/publish" \
  -H "x-api-key: {{ env.POSTSTREAM_API_KEY }}"

# Wait and check status (retry up to 4 times)
sleep 3
curl -X GET "https://api.poststream.io/api/v1/posts/{postId}" \
  -H "x-api-key: {{ env.POSTSTREAM_API_KEY }}"

# If still "publishing", wait longer
sleep 5
curl -X GET "https://api.poststream.io/api/v1/posts/{postId}" \
  -H "x-api-key: {{ env.POSTSTREAM_API_KEY }}"

# Continue checking with increasing delays (8s, 10s)
```

**Total retry time: ~26 seconds**

### Step 5: Report Results

**Always provide platform-by-platform status:**

```
📊 Final Status Report:

Status: Published / Partially Published / Failed

✅ Successfully posted to:
- Instagram (@username): [permalink]
- LinkedIn (Name): [permalink]

❌ Failed on:
- Twitter/X: [error message] - [suggested fix]
- Bluesky: [error message] - [suggested fix]

Would you like me to retry the failed platforms?
```

## Common Errors & Solutions

### 1. Missing API Key
```
Error: API key not configured
Fix: Set POSTSTREAM_API_KEY environment variable
```

### 2. Platform Not Connected
```
Error: Account not found for platform
Fix: Connect account at https://app.poststream.io
```

### 3. Bluesky File Size Error
```
Error: "blob too big (maximum 1000000, got 1754089)"
Translation: File is 1.75MB, Bluesky max is 1MB
Fix: Use smaller image or compress
```

### 4. Twitter Media ID Invalid
```
Error: "Your media IDs are invalid"
Translation: Twitter failed to process media (often GIFs)
Fix: Try static image or MP4 video instead
```

### 5. Facebook CDN Fetch Failed
```
Error: "fetch failed"
Translation: Platform cannot access Facebook CDN URL
Fix: Download image and upload to public hosting
```

## Platform Requirements Reference

| Platform | Emoji | Media | Character Limit |
|----------|-------|-------|----------------|
| Instagram | 📸 | Required (image/video) | 2,200 |
| TikTok | 🎥 | Required (video only) | 2,200 |
| YouTube | 📺 | Required (video only) | 5,000 (title: 100) |
| Twitter/X | 🐦 | Optional | 280 (25k Premium) |
| LinkedIn | 💼 | Optional | 3,000 |
| Bluesky | 🦋 | Optional | ~300 (Twitter-like) |

## API Endpoints

**Base URL:** `https://api.poststream.io`  
**Auth Header:** `x-api-key: {{ env.POSTSTREAM_API_KEY }}`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/accounts` | GET | List connected accounts |
| `/api/v1/posts` | POST | Create new post |
| `/api/v1/posts/{id}` | GET | Get post status |
| `/api/v1/posts/{id}/publish` | POST | Publish draft |
| `/api/v1/posts/{id}` | DELETE | Delete draft/scheduled |
| `/api/v1/workspaces` | GET | List workspaces |

## Best Practices

1. ✅ **Always check API key before operations**
2. ✅ **Validate media size against platform limits**
3. ✅ **Wait for final publish status (mandatory)**
4. ✅ **Report platform-by-platform results**
5. ✅ **Provide actionable error messages**
6. ✅ **Warn about Bluesky 1MB limit upfront**
7. ✅ **Download Facebook CDN images before posting**
8. ✅ **Offer retry options on partial failures**

## Additional Resources

- **Platform Guidelines**: See `references/platform-guidelines.md`
- **API Reference**: See `references/api-reference.md`
- **PostStream Docs**: https://api.poststream.io/docs

## Safety Notes

⚠️ **This skill uses `curl` for HTTP requests** (API calls only, no shell injection risk)

**External services called:**
- PostStream API (api.poststream.io) - authenticated with user's API key
- No other external services

**No secrets in this repo** - API keys must be configured via environment variables.

## Version History

- **2.0.0** - Drop-in ready, env var placeholders, mandatory status checking, media validation
- **1.0.0** - Initial release
