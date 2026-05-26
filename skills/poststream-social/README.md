# PostStream Social Media Manager

**Version:** 2.0.0  
**Author:** OpenClaw Community  
**Source:** https://github.com/openclaw/skills/poststream-social

Create and schedule social media posts across Instagram, Twitter/X, LinkedIn, YouTube, TikTok, and Bluesky.

## Installation

### Drop-in Installation

1. **Download the skill folder** (or extract from zip)
2. **Drop into your OpenClaw skills directory:**
   ```bash
   cp -r poststream-social /usr/local/lib/node_modules/openclaw/skills/
   ```
3. **Configure your API key** (see Configuration section)
4. **Verify installation:**
   ```bash
   openclaw skills info poststream-social
   ```

That's it! No additional installer steps required.

## Configuration

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `POSTSTREAM_API_KEY` | Your PostStream API key | `pb_abc123...` | ✅ Yes |

### How to Get Your API Key

1. Sign up at https://poststream.io
2. Connect your social media accounts
3. Go to https://app.poststream.io/settings
4. Click "API Keys"
5. Generate a new API key (starts with `pb_`)
6. Copy the key

### Configure in OpenClaw

**Option 1: Environment Variable (recommended)**
```bash
export POSTSTREAM_API_KEY=pb_your_api_key_here
```

**Option 2: OpenClaw Config**
```json
{
  "skills": {
    "entries": {
      "poststream-social": {
        "apiKey": "pb_your_api_key_here"
      }
    }
  }
}
```

**Option 3: Use `gateway config.patch`**
```bash
openclaw gateway config.patch '{
  "skills": {
    "entries": {
      "poststream-social": {
        "apiKey": "pb_your_api_key_here"
      }
    }
  }
}'
```

### Verify Configuration

```bash
# Check if skill recognizes your API key
openclaw skills info poststream-social
```

## Supported Commands

This skill responds to social media posting requests:

### ✅ Supported Intents

- "Post to Instagram/Twitter/LinkedIn/etc."
- "Create a post"
- "Schedule a post for [time]"
- "Create a draft post"
- "Share on social media"
- "Tweet this"
- "Post to all platforms"
- "Publish this now"

### ❌ Out of Scope

- Analytics/metrics retrieval
- Account management (followers, following)
- Direct messages
- Comment moderation
- Story/reel creation (Instagram)
- Live streaming

### Refusal Behavior

If you request something outside this skill's scope, you'll get:

```
⚠️ I only support social media posting operations:
- Create posts
- Schedule posts
- Publish drafts

For [your request], please use a different skill or service.
```

## Supported Platforms

| Platform | Emoji | Media Required? | Max Image | Max Video | Limit |
|----------|-------|----------------|-----------|-----------|-------|
| Instagram | 📸 | ✅ Yes | 8 MB | 100 MB | 2,200 chars |
| Twitter/X | 🐦 | ❌ Optional | 5 MB | 512 MB | 280 chars |
| LinkedIn | 💼 | ❌ Optional | 10 MB | 200 MB | 3,000 chars |
| Bluesky | 🦋 | ❌ Optional | **1 MB** | 50 MB | ~300 chars |
| TikTok | 🎥 | ✅ Yes (video) | N/A | 287 MB | 2,200 chars |
| YouTube | 📺 | ✅ Yes (video) | N/A | 256 GB | 5,000 chars |

**⚠️ Critical Note:** Bluesky has a very strict **1MB image limit**. Always check file size first!

## Usage Examples

### Example 1: Simple Post to Instagram

**User:** "Post this to Instagram: 'Beautiful sunset 🌅'"

**AI Workflow:**
1. Check if Instagram is connected
2. Ask for image (Instagram requires media)
3. User provides image URL or asks to search
4. Create post with caption
5. Publish and wait for status
6. Report success with permalink

### Example 2: Multi-Platform Post

**User:** "Post to all platforms"

**AI Workflow:**
1. List connected platforms
2. Ask for caption and media
3. Validate media against strictest limit (Bluesky 1MB)
4. Create post for all platforms
5. Publish and check status
6. Report platform-by-platform results

### Example 3: Scheduled Post

**User:** "Schedule a post for tomorrow at 10 AM"

**AI Workflow:**
1. Ask for platforms, caption, media
2. Calculate ISO timestamp (user's timezone)
3. Create post with `scheduledAt` field
4. **Do NOT call /publish** (auto-publishes at scheduled time)
5. Confirm scheduled time

## Error Handling

### Missing Configuration

```
⚠️ PostStream API key not configured.

Please set your API key:
1. Get key from: https://app.poststream.io/settings
2. Set environment variable: POSTSTREAM_API_KEY=pb_your_key
3. Or add to OpenClaw config

See README.md for details.
```

### Platform Not Connected

```
❌ Your Instagram account isn't connected to PostStream.

Please connect it:
1. Go to https://app.poststream.io
2. Click "Connect Accounts"
3. Authorize Instagram

Then try again.
```

### File Size Exceeded

```
⚠️ This image is 1.75MB, which exceeds Bluesky's 1MB limit.

Options:
1. Skip Bluesky and post to other platforms
2. Use a smaller/compressed image
3. I can search for an alternative image

What would you prefer?
```

### Partial Publish Failure

```
📊 Final Status Report:

Status: Partially Published (2/4 platforms succeeded)

✅ Successfully posted to:
- Instagram (@username): https://instagram.com/p/xyz
- LinkedIn (Name): https://linkedin.com/feed/update/xyz

❌ Failed on:
- Twitter/X: "Your media IDs are invalid" - Try static image or MP4?
- Bluesky: "blob too big (max 1MB, got 1.75MB)" - File size exceeded

Would you like me to retry failed platforms with different media?
```

## Graceful Degradation

This skill will **NOT**:
- Crash OpenClaw if API key is missing
- Infinite-retry failed requests
- Spam the PostStream API
- Expose secrets in logs or errors

Instead, it will:
- Return clear "missing config" messages
- Retry status checks max 4 times (with delays)
- Stop and ask for user input on errors
- Log errors without exposing sensitive data

## Security & Safety

### No Secrets in Repo

✅ All API keys use placeholder variables: `{{ env.POSTSTREAM_API_KEY }}`  
✅ No hardcoded credentials anywhere  
✅ README examples use fake/placeholder keys  

### External Service Calls

This skill makes HTTP requests to:
- **PostStream API** (api.poststream.io)
  - Purpose: Create/publish social media posts
  - Authentication: User's API key
  - Protocol: HTTPS only

### Shell Commands Used

⚠️ **This skill uses `curl` for HTTP requests**

```bash
# Example (safe - no user input in shell):
curl -X POST "https://api.poststream.io/api/v1/posts" \
  -H "x-api-key: ${POSTSTREAM_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"title":"...", "caption":"..."}'
```

**Safety measures:**
- User input is passed via JSON body (not shell args)
- No `eval` or dynamic code execution
- No `curl | bash` patterns
- API endpoints are hardcoded (not user-controllable)

### Safety Scan Results

✅ **No dangerous patterns detected:**
- ❌ No `eval` / `Function` / dynamic code execution
- ❌ No `exec`/`spawn` with user-controlled args
- ❌ No `curl | bash` installer patterns
- ❌ No large base64 blobs
- ✅ Uses `curl` for legitimate API calls only

## File Structure

```
poststream-social/
├── SKILL.md                    # Main skill documentation (with YAML frontmatter)
├── README.md                   # This file (installation & usage guide)
└── references/
    ├── api-reference.md        # Complete PostStream API reference
    └── platform-guidelines.md  # Platform-specific best practices
```

## Troubleshooting

### "Upload preset not found" (Cloudinary)

If you're uploading images to Cloudinary and see this error:
```bash
# Use API key auth instead of upload preset:
curl -X POST "https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload" \
  -u "API_KEY:API_SECRET" \
  -F "file=@image.jpg"
```

### Facebook CDN URLs Fail

URLs from `fbcdn.net` have authentication restrictions:
- ✅ Instagram can access (both Meta platforms)
- ❌ Twitter, LinkedIn, Bluesky cannot

**Solution:**
1. Download the image locally
2. Upload to public hosting (Cloudinary, Imgur, etc.)
3. Use the new public URL

### API Rate Limits

PostStream may rate-limit excessive requests. If you hit limits:
- Wait 60 seconds before retrying
- Batch posts instead of rapid-fire individual posts
- Check PostStream dashboard for rate limit info

## Support

- **PostStream Docs:** https://api.poststream.io/docs
- **PostStream Support:** https://poststream.io/support
- **OpenClaw Docs:** https://docs.openclaw.ai
- **Skill Issues:** https://github.com/openclaw/skills/issues

## License

MIT License - See LICENSE file for details

## Version History

### 2.0.0 (2026-03-25)
- ✅ Drop-in ready structure
- ✅ Environment variable placeholders
- ✅ Mandatory status checking after publish
- ✅ Media size validation (Bluesky 1MB warning)
- ✅ Platform-by-platform error reporting
- ✅ Graceful failure handling
- ✅ Command scope documentation
- ✅ Security audit notes

### 1.0.0 (Initial)
- Basic PostStream API integration
- Multi-platform posting support
