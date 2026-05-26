---
name: youtube-manager
description: "Provides comprehensive YouTube channel and video management. Use it to search for videos, manage playlists and subscriptions, upload content, and retrieve detailed channel and video analytics. Ideal for social media managers, content creators, and marketing analysts."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["YOUTUBE_API_KEY"],"bins":["curl"]},"primaryEnv":"YOUTUBE_API_KEY","emoji":"📺"}}
---

# YouTube Manager

This skill provides a robust interface for managing YouTube channels, videos, playlists, and analytics through the YouTube Data API v3. It supports a wide range of operations from content discovery and management to performance analysis, making it an essential tool for anyone working with YouTube content.

## When to activate

This skill should be activated for any tasks involving the management or analysis of YouTube content. Below are specific keywords and scenarios that should trigger its use.

- **Keywords:** YouTube, YT, video, channel, playlist, upload, search, subscribe, unsubscribe, comment, analytics, statistics, views, likes, dislikes, streaming, broadcast, social media report.

- **Scenarios:**
    - "Find the top 5 most viewed videos about 'product marketing'."
    - "Create a new playlist for our '2024 Webinars' and add these three videos to it."
    - "Upload this video file as a private video to our channel."
    - "How many subscribers did our channel gain last month?"
    - "Get the view count and like/dislike ratio for this specific video."
    - "List all comments on our latest product announcement video."
    - "Generate a weekly performance report for our YouTube channel."
    - "Check if we are subscribed to the 'Google Developers' channel."
    - "Remove a video from our 'Archived Content' playlist."
    - "Update the description for our most recent video upload."
    - "Export a list of all videos in the 'Customer Testimonials' playlist."
    - "Schedule a video to be published next Monday at 9 AM."

## Required credentials

- `YOUTUBE_API_KEY` — A YouTube Data API v3 key or an OAuth 2.0 access token. For read-only operations, an API key is sufficient. For operations that modify data (e.g., uploading, creating playlists, commenting), an OAuth 2.0 token with the appropriate scopes is required. You can obtain credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Helper script

For simplified interaction with the API, the `scripts/youtube_api.py` helper script is available. It abstracts the complexity of direct API calls into straightforward commands.

```bash
python scripts/youtube_api.py <command> [args]
```

| Command | Description |
|---|---|
| `search-videos --query QUERY [--max-results N]` | Search for videos matching a query. |
| `list-playlists --channel-id CHANNEL_ID` | List all playlists for a given channel. |
| `create-playlist --title TITLE --description DESC` | Create a new playlist (requires OAuth). |
| `add-video-to-playlist --playlist-id ID --video-id ID` | Add a video to a specific playlist (requires OAuth). |
| `list-channel-details --id CHANNEL_ID` | Retrieve detailed information and statistics for a channel. |
| `list-video-comments --video-id VIDEO_ID` | List all top-level comments for a specific video. |
| `get-video-statistics --video-id VIDEO_ID` | Retrieve statistics (views, likes, etc.) for a video. |
| `subscribe-to-channel --channel-id CHANNEL_ID` | Subscribe to a channel (requires OAuth). |
| `upload-video --file PATH --title TITLE --desc DESC` | Upload a new video to the channel (requires OAuth). |
| `list-subscriptions` | List all channels the authenticated user is subscribed to. |

## Workflow

Workflows are executed via `curl` commands to the YouTube Data API v3 endpoints. Read-only operations can use an API key, while write operations require an OAuth 2.0 Bearer token.

### 1. Search Videos

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/search`

```bash
cURL "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=AI+in+2024&maxResults=10&key=$YOUTUBE_API_KEY"
```

### 2. Get Video Details

Retrieve comprehensive details for a specific video, including snippet and statistics.

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/videos`

```bash
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID&key=$YOUTUBE_API_KEY"
```

### 3. Update Video Details (OAuth required)

Modify a video's metadata, such as its title, description, or tags.

**Endpoint:** `PUT https://www.googleapis.com/youtube/v3/videos`

```bash
curl -X PUT "https://www.googleapis.com/youtube/v3/videos?part=snippet,status" \
  -H "Authorization: Bearer $OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "VIDEO_ID",
    "snippet": {
      "title": "New Updated Title",
      "description": "New updated description.",
      "tags": ["updated", "tags"],
      "categoryId": "22"
    },
    "status": {
      "privacyStatus": "private"
    }
  }'
```

### 4. Delete a Video (OAuth required)

Permanently delete a video. This action is irreversible.

**Endpoint:** `DELETE https://www.googleapis.com/youtube/v3/videos`

```bash
curl -X DELETE "https://www.googleapis.com/youtube/v3/videos?id=VIDEO_ID" \
  -H "Authorization: Bearer $OAUTH_TOKEN"
```

### 5. List Channel Subscriptions (OAuth required)

Retrieve a list of channels that the authenticated user is subscribed to.

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/subscriptions`

```bash
curl "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=25&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $OAUTH_TOKEN"
```

### 6. Check Subscription Status

Check if the authenticated user is subscribed to a specific channel.

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/subscriptions`

```bash
curl "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=TARGET_CHANNEL_ID&mine=true&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $OAUTH_TOKEN"
```

## Pagination

Many API responses that return a list of items are paginated. To retrieve all items, you must make a series of requests. The response body of a paginated query includes a `nextPageToken` field. To fetch the next page of results, pass this token's value in the `pageToken` query parameter of your subsequent request. Continue this process until the `nextPageToken` is no longer present in the response.

**Example: Paginated Video Search**

```bash
# First request
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=python&maxResults=50&key=$YOUTUBE_API_KEY"

# In the response, find "nextPageToken": "CAoQAA"

# Second request
curl "https://www.googleapis.com/youtube/v3/search?part=snippet&q=python&maxResults=50&pageToken=CAoQAA&key=$YOUTUBE_API_KEY"
```

## Webhook setup

The YouTube Data API allows you to subscribe to push notifications (webhooks) for channel activity via the PubSubHubbub protocol. This enables your application to receive near real-time updates instead of polling.

1.  **Subscribe:** Send a POST request to `https://pubsubhubbub.appspot.com/subscribe` with the channel's topic URL and your callback URL.
2.  **Receive Notifications:** Your callback URL will receive Atom-formatted notifications when the channel uploads new videos.

**Example Subscription Request:**

```bash
curl -X POST "https://pubsubhubbub.appspot.com/subscribe" \
  -d "hub.callback=https://your-callback-url.com/notify" \
  -d "hub.topic=https://www.youtube.com/xml/feeds/videos.xml?channel_id=CHANNEL_ID" \
  -d "hub.mode=subscribe" \
  -d "hub.verify=async"
```

## Multi-step workflows

### 1. Full Video Content Cycle

This workflow covers uploading a video, adding it to a playlist, and then verifying its statistics after a day.

1.  **Upload Video:** Use the `upload-video` helper script command.
2.  **Create Playlist:** If needed, use `create-playlist` to make a new playlist.
3.  **Add to Playlist:** Use `add-video-to-playlist` to organize the new video.
4.  **Check Stats:** After 24 hours, use `get-video-statistics` to check initial performance.

### 2. Channel Audit and Cleanup

This workflow involves reviewing all videos on a channel, archiving old ones, and updating metadata on others.

1.  **List all videos:** Paginate through the `search` endpoint for the channel.
2.  **Review metadata and stats:** For each video, use `get-video-details`.
3.  **Update or Delete:** Based on review, use `update-video-details` or `delete-video`.

## Real-world use cases

- **Social Media Campaign Tracking:** A marketing team uploads a series of promotional videos and adds them to a campaign-specific playlist. They then use the skill to monitor views, likes, and comments daily to gauge audience engagement.
- **Content Creator Workflow Automation:** A YouTuber automates their publishing process by having the skill upload a video, set its title and description from a template, and add it to their 'New Uploads' playlist.
- **Competitive Analysis:** A market analyst searches for videos from competitor channels containing specific keywords, retrieves their performance statistics, and generates a report to identify content trends.
- **Brand Safety Monitoring:** A brand manager regularly lists comments on their company's videos to check for spam or inappropriate content, using the API to flag or delete comments as needed.
- **Digital Asset Management:** A media company uses the skill to audit their back catalog of videos, updating metadata for SEO, and deleting outdated or irrelevant content in bulk.
- **Influencer Marketing Vetting:** Before collaborating with an influencer, a company uses the skill to retrieve statistics for the influencer's channel and recent videos to assess their reach and engagement rates.

## Output format

Responses should be in a structured JSON format. The `ok` field indicates success or failure.

**Success: Video Found**
```json
{
  "ok": true,
  "action": "video_search",
  "videos": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Example Video Title",
      "channelTitle": "Example Channel",
      "publishedAt": "2023-10-27T10:00:00Z"
    }
  ]
}
```

**Success: Video Uploaded**
```json
{
  "ok": true,
  "action": "video_uploaded",
  "video_id": "AbCdEfGhIjK",
  "message": "Video 'My Awesome Video' was uploaded successfully and is now processing."
}
```

**Error: Not Found**
```json
{
  "ok": false,
  "error_code": "notFound",
  "message": "The requested video with ID 'INVALID_ID' could not be found."
}
```

## Guardrails

- **Confirm Destructive Actions:** Always require explicit user confirmation before deleting videos, playlists, or comments.
- **Sensitive Data:** Never expose API keys, OAuth tokens, or personally identifiable information in outputs.
- **Scope Limitation:** When requesting OAuth tokens, only ask for the scopes necessary for the intended actions.
- **Content Policy:** Adhere strictly to YouTube's [Community Guidelines](https://www.youtube.com/howyoutubeworks/policies/community-guidelines/) when uploading or modifying content.
- **Attribution:** When displaying data or content from YouTube, provide proper attribution as required by the Terms of Service.
- **Do Not Impersonate:** Do not perform actions that would mislead users into thinking the agent is a human user.
- **Error Propagation:** Clearly communicate API errors back to the user with actionable advice.
- **Avoid Spam:** Do not use the API to post repetitive or unwanted comments, messages, or other content.
- **Check Privacy Status:** Before sharing a link to a video, verify its privacy status (public, private, unlisted).

## Rate limits

The YouTube Data API v3 uses a quota system to ensure fair usage. Each project is granted a default quota of 10,000 units per day. Different operations consume different amounts of quota:

- **Read operations** (e.g., search, list videos): ~1 unit per request.
- **Write operations** (e.g., update playlist): ~50 units per request.
- **Video uploads:** ~1600 units per upload.

A search request (`search.list`) costs 100 units. Exceeding the quota will result in an HTTP `403 Forbidden` error with the reason `quotaExceeded`. Implement exponential backoff for retries.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `quotaExceeded` | The daily API quota has been reached. | Inform the user to wait until the quota resets (usually at midnight Pacific Time) or request a quota increase in the Google Cloud Console. |
| `accessNotConfigured` | The YouTube Data API v3 is not enabled for the project. | Guide the user to enable the API in their Google Cloud project's dashboard. |
| `invalidCredentials` | The API key is invalid or the OAuth token is expired/revoked. | Instruct the user to verify their API key or re-authenticate to obtain a new OAuth token. |
| `forbidden` | The credentials lack the necessary permissions for the action. | Verify the OAuth token was created with the correct scopes (e.g., `youtube.upload` for uploading videos). |
| `notFound` | The requested resource (video, playlist, channel) does not exist. | Double-check the provided ID for typos or confirm the resource has not been deleted. |
| `badRequest` | A required parameter was missing or a parameter value was invalid. | Consult the API documentation for the specific endpoint and correct the request parameters. |
| `videoNotFound` | The video specified in the request could not be found. | Verify the video ID is correct and the video has not been deleted or made private by its owner. |
| `playlistItemsNotAccessible` | The items in the playlist cannot be accessed. | This can happen if the playlist is private and the credentials do not have permission to view it. |
| `uploadRejected` | The uploaded video was rejected for violating YouTube policies. | Check the video content against YouTube's Community Guidelines. The user may need to appeal the rejection in their YouTube Studio. |
| `duplicate` | The video could not be created because it is a duplicate of a video that has already been uploaded. | Confirm that the video has not been uploaded previously. YouTube prevents identical video files from being uploaded twice. |

## Reference files

- **`references/api-reference.md`** — Detailed YouTube Data API v3 endpoint documentation, including all parameters, response schemas, and error codes.
