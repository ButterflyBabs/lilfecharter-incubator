---
name: youtube-video
description: "Seamlessly manage your YouTube presence. This skill empowers you to upload videos, analyze performance with detailed channel and video statistics, manage playlists, and moderate comments, all through the YouTube Data API v3. Activate this skill for any task involving YouTube content management, channel administration, or performance tracking."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["YOUTUBE_API_KEY", "YOUTUBE_ACCESS_TOKEN"],"bins":["curl"]},"primaryEnv":"YOUTUBE_ACCESS_TOKEN","emoji":"🎥"}}
---

# YouTube Video Management

This skill provides comprehensive tools to manage YouTube videos, channels, and playlists using the YouTube Data API v3. It's designed for content creators, marketers, and developers who need to programmatically interact with the YouTube platform.

## When to activate

Activate this skill when the user's request involves managing or analyzing YouTube content.

**Keywords:**
- YouTube, YT, video, channel, playlist
- Upload video, post to YouTube
- Video analytics, channel stats, performance report
- Manage comments, moderate discussion
- Update video, change title, edit description
- Video thumbnail, custom thumbnail
- Search videos, find content
- Playlist management, create playlist, add to playlist
- YouTube API, video automation
- Subscriber count, view count, engagement metrics
- Video monetization, ad revenue
- Content ID, copyright claim
- Live stream, broadcast

**Scenarios:**
- "Schedule and upload our weekly podcast episode to YouTube."
- "Generate a monthly performance report for our main YouTube channel."
- "Find all videos about 'product marketing' on our channel and add them to a new playlist."
- "I need to update the description for our latest product announcement video."
- "Can you pull the top 10 most viewed videos from our competitor's channel?"
- "Automate the process of responding to common questions in our video comments."
- "Check for any new copyright claims on our uploaded videos."
- "Get the subscriber count and total video views for the past quarter."
- "I need to bulk-update the tags on a set of our tutorial videos."
- "Set up a workflow to automatically add new testimonial videos to our 'Customer Stories' playlist."
- "Delete a video that was uploaded by mistake."
- "Fetch the latest comments from our most recent video for sentiment analysis."

## Required credentials

-   `YOUTUBE_API_KEY`: Your application's API key from the Google Cloud Console.
-   `YOUTUBE_ACCESS_TOKEN`: An OAuth 2.0 access token with the necessary scopes for the requested operations.
-   You can obtain these credentials by setting up a project in the [Google Cloud Console](https://console.cloud.google.com/) and enabling the YouTube Data API v3.

## Helper script

This skill includes a Python helper script to simplify common API interactions.

**Usage:**
```bash
python scripts/youtube_video_api.py <command> [args]
```

**Commands:**

| Command | Description |
|---|---|
| `upload-video --file PATH --title T` | Upload a new video to a channel. |
| `get-channel --channel-id ID` | Retrieve detailed information about a specific channel. |
| `list-videos [--channel-id ID]` | List all videos for a given channel. |
| `delete-video --video-id ID` | Delete a video from a channel. |
| `list-playlists [--channel-id ID]` | List all playlists for a given channel. |
| `get-video-stats --video-id ID` | Get detailed statistics for a specific video. |
| `list-comments --video-id ID` | List all comments for a specific video. |

## Workflow

### 1. Get Channel Details
**Endpoint:** `GET https://www.googleapis.com/youtube/v3/channels`

```bash
curl -X GET "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN"
```

### 2. Search for Videos
**Endpoint:** `GET https://www.googleapis.com/youtube/v3/search`

```bash
curl -X GET "https://www.googleapis.com/youtube/v3/search?part=snippet&q=product%20marketing&type=video&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN"
```

### 3. Upload a Video
**Endpoint:** `POST https://www.googleapis.com/upload/youtube/v3/videos`

```bash
curl -X POST "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"snippet": {"title": "New Video", "description": "Uploaded via OpenClaw"}, "status": {"privacyStatus": "private"}}'
```

### 4. Update Video Metadata
**Endpoint:** `PUT https://www.googleapis.com/youtube/v3/videos`

```bash
curl -X PUT "https://www.googleapis.com/youtube/v3/videos?part=snippet,status&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": "VIDEO_ID", "snippet": {"title": "New Title", "description": "New description", "tags": ["new", "tags"], "categoryId": "22"}, "status": {"privacyStatus": "public"}}'
```

### 5. Add a Comment to a Video
**Endpoint:** `POST https://www.googleapis.com/youtube/v3/commentThreads`

```bash
curl -X POST "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"snippet": {"videoId": "VIDEO_ID", "topLevelComment": {"snippet": {"textOriginal": "This is a great video!"}}}}'
```

## Pagination

When retrieving lists of resources like videos, playlists, or comments, the API uses pagination. You must handle the `nextPageToken` from the response to fetch subsequent pages.

-   `pageToken`: The token for the next page of results.
-   `maxResults`: The maximum number of items to return (default is 5, max is 50).

**Example: Paginate through a channel's videos**

```bash
# First request
curl -X GET "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=CHANNEL_ID&maxResults=50&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN"

# In the response, get the nextPageToken value, then use it in the next request
curl -X GET "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=CHANNEL_ID&maxResults=50&pageToken=NEXT_PAGE_TOKEN&key=$YOUTUBE_API_KEY" \
  -H "Authorization: Bearer $YOUTUBE_ACCESS_TOKEN"
```

## Multi-step workflows

### 1. Weekly Video Performance Report
1.  **List recent videos:** Use the `search` endpoint to get videos uploaded in the last 7 days.
2.  **Get video stats:** For each video, call the `videos` endpoint with `part=statistics` to get view counts, likes, and comments.
3.  **Summarize data:** Aggregate the statistics to create a summary report.
4.  **Output report:** Present the data in a structured format (e.g., Markdown table or JSON).

### 2. Bulk-Update Video Tags
1.  **List all videos:** Paginate through the `search` endpoint to get all videos on a channel.
2.  **Filter videos:** Identify the videos that need to be updated based on title, description, or other criteria.
3.  **Update tags:** For each video, use the `videos.update` endpoint to set the new tags.

## Real-world use cases

-   **Automated Content Publishing:** Schedule and automatically upload pre-recorded webinars, tutorials, or marketing videos to your YouTube channel.
-   **Brand Monitoring:** Track mentions of your brand or products in video titles and descriptions across YouTube.
-   **Competitor Analysis:** Analyze the performance of your competitors' channels by tracking their video uploads, view counts, and engagement metrics.
-   **Social Media Management:** Automatically share new YouTube video uploads to other social media platforms.
-   **Customer Support:** Create a workflow to identify and respond to customer questions in your video comments.
-   **Content Curation:** Build playlists of user-generated content or other relevant videos to share with your audience.

## Output format

Always return results in structured JSON. For successful operations, confirm the action taken and include key identifiers.

**Example: Successful video upload**
```json
{
  "status": "success",
  "message": "Video uploaded successfully.",
  "videoId": "VIDEO_ID",
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Example: Channel statistics**
```json
{
  "channelId": "CHANNEL_ID",
  "statistics": {
    "viewCount": "1234567",
    "subscriberCount": "12345",
    "videoCount": "123"
  }
}
```

## Guardrails

-   **Never** upload or delete a video without explicit user confirmation.
-   **Never** expose any YouTube API credentials in output or logs.
-   **Always** verify the target video or channel exists before attempting to interact with it.
-   **Do not** update video metadata without a clear and specific request from the user.
-   **Be mindful** of rate limits to avoid being blocked by the API.
-   **Always** handle pagination correctly to ensure you are working with the complete set of data.
-   **Do not** attempt to upload videos larger than the maximum file size limit (currently 256GB).
-   **Always** use the `mine=true` parameter to interact with the authenticated user's channel, unless a specific channel ID is provided.
-   **Never** modify or delete comments without a clear and justifiable reason.
-   **Always** check the privacy status of a video before making it public.

## Rate limits

The YouTube Data API has a quota system that limits the number of requests you can make. The default quota is 10,000 units per day. Different operations consume different amounts of quota:

-   Read operations (e.g., listing videos): 1 unit
-   Write operations (e.g., uploading a video): 1600 units
-   Search operations: 100 units

Exceeding the quota will result in a `403 Forbidden` error.

## Failure handling

| Error | Cause | Resolution |
|---|---|---|
| `400 Bad Request` | Invalid parameter in the request. | Check the API documentation and correct the invalid parameter. |
| `401 Unauthorized` | Invalid or expired access token. | Refresh the `YOUTUBE_ACCESS_TOKEN` and try again. |
| `403 Forbidden` | Insufficient permissions or rate limit exceeded. | Check the API key and access token scopes. If the rate limit is exceeded, wait and retry. |
| `404 Not Found` | The requested resource (video, channel, etc.) does not exist. | Verify the resource ID and try again. |
| `409 Conflict` | The resource already exists (e.g., creating a playlist with a duplicate title). | Use a different name or update the existing resource. |
| `429 Too Many Requests` | You have sent too many requests in a given amount of time. | Implement exponential backoff and retry the request later. |
| `videoNotFound` | The video you are trying to access could not be found. | Double-check the video ID and ensure it is correct. |
| `playlistNotFound` | The playlist you are trying to access could not be found. | Double-check the playlist ID and ensure it is correct. |
| `uploadRejected` | The uploaded video was rejected for a policy violation. | Review YouTube's community guidelines and terms of service. |
| `commentThreadNotFound` | The comment thread you are trying to access could not be found. | Double-check the comment thread ID and ensure it is correct. |

## Reference files

-   **`references/api-reference.md`** — Full YouTube Data API v3 endpoint reference.
