---
name: wistia-video
description: Seamlessly manage your entire Wistia video lifecycle, from uploading and organizing content in projects to accessing detailed analytics and customizing player settings. Activate this skill for any task involving video management, performance tracking, or content organization within the Wistia platform.
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["WISTIA_API_TOKEN"],"bins":["curl"]},"primaryEnv":"WISTIA_API_TOKEN","emoji":"🎥"}}
---

# Wistia Video

This skill provides comprehensive control over your Wistia video assets and projects using the Wistia Data API. It enables you to automate video uploads, manage project structures, retrieve detailed analytics, and customize the viewing experience.

## When to activate

This skill should be activated when the user's request involves managing, analyzing, or organizing video content on the Wistia platform.

- **Keywords**: Wistia, video management, video analytics, media upload, project folder, player customization, video stats, embed code, video SEO, audience engagement, Wistia API, video marketing, lead generation, video performance, content library, video chapters.

- **Scenarios**:
    - "Upload our new product demo video to the 'Marketing' project on Wistia."
    - "Can you pull the latest engagement stats for our most-viewed videos from last quarter?"
    - "I need to organize our training videos into a new 'Onboarding' project."
    - "Update the thumbnail for the 'Welcome to Our Platform' video."
    - "Generate a list of all videos that have a call-to-action enabled."
    - "Delete the outdated promo videos from the archive project."
    - "How many times has the new webinar recording been played?"
    - "Find all videos tagged with 'case-study' and add them to the 'Customer Stories' project."
    - "Customize the player color for all videos in the 'Brand Assets' project."
    - "I need to get the embed codes for the latest batch of uploaded videos."
    - "Set up a webhook to notify our CRM when a new lead is captured from a video form."
    - "Can you generate a weekly performance report for our key marketing videos?"

## Required credentials

- `WISTIA_API_TOKEN` — A Wistia API Token with read and write permissions. This can be generated from your Wistia account under **Account > Settings > API Access**.

## Helper script

For common, high-level tasks, the `scripts/wistia_video_api.py` helper script is available. It simplifies interactions with the API for routine operations.

```bash
python scripts/wistia_video_api.py <command> [args]
```

| Command | Description |
|---|---|
| `upload-video --file PATH [--project-id ID]` | Upload a new video to a specified project. |
| `get-video --hashed-id ID` | Retrieve detailed metadata for a specific video. |
| `list-videos [--project-id ID]` | List all videos within a project or across the account. |
| `delete-video --hashed-id ID` | Permanently delete a video from your Wistia account. |
| `list-projects` | List all projects in your Wistia account. |
| `get-video-stats --hashed-id ID` | Fetch detailed analytics and engagement statistics for a video. |

## Workflow

The following workflows outline how to interact with the Wistia Data API using `curl` for various operations.

### 1. List Projects
**Endpoint:** `GET https://api.wistia.com/v1/projects.json`

```bash
curl -X GET https://api.wistia.com/v1/projects.json \
  -u "api:$WISTIA_API_TOKEN"
```

### 2. Upload a Video
**Endpoint:** `POST https://upload.wistia.com/`

```bash
curl -X POST https://upload.wistia.com/ \
  -F "api_password=$WISTIA_API_TOKEN" \
  -F "file=@/path/to/your/video.mp4" \
  -F "project_id=your_project_id"
```

### 3. Search for Media
**Endpoint:** `GET https://api.wistia.com/v1/medias.json`

```bash
# Search by media name
curl -X GET "https://api.wistia.com/v1/medias.json?name=your_video_name" \
  -u "api:$WISTIA_API_TOKEN"

# Search by media type
curl -X GET "https://api.wistia.com/v1/medias.json?type=Video" \
  -u "api:$WISTIA_API_TOKEN"
```

### 4. Get Visitor Analytics
**Endpoint:** `GET https://api.wistia.com/v1/stats/events.json`

```bash
curl -X GET "https://api.wistia.com/v1/stats/events.json?media_id=your_media_id" \
  -u "api:$WISTIA_API_TOKEN"
```

### 5. Customize Player Appearance
**Endpoint:** `PUT https://api.wistia.com/v1/customizations.json`

```bash
curl -X PUT https://api.wistia.com/v1/customizations.json \
  -u "api:$WISTIA_API_TOKEN" \
  -d '{"projectId":"your_project_id","playerColor":"#ff0000"}' \
  -H "Content-Type: application/json"
```

### 6. Add Video to Project
**Endpoint:** `PUT https://api.wistia.com/v1/projects/{project_id}/medias/{media_id}.json`

```bash
curl -X PUT https://api.wistia.com/v1/projects/your_project_id/medias/your_media_id.json \
  -u "api:$WISTIA_API_TOKEN"
```

## Pagination

When listing resources like projects or media, the Wistia API uses pagination. You must handle this to retrieve all results.

- **Parameters**: `page` (integer) and `per_page` (integer, max 100).
- **Response Headers**: Look for the `Link` header, which contains URLs for `next`, `prev`, `first`, and `last` pages.

**Example**: To fetch the second page of videos in a project:
```bash
curl -i -X GET "https://api.wistia.com/v1/projects/your_project_id/medias.json?page=2&per_page=50" \
  -u "api:$WISTIA_API_TOKEN"
```

## Webhook Setup

Wistia does not have direct API-managed webhooks. Webhooks (Postbacks) are configured within the UI under **Account > Settings > Postbacks**. You can guide the user to this section to set up notifications for events like lead capture or video processing completion.

## Multi-step workflows

### 1. New Product Launch Video Rollout
This workflow uploads a new video, customizes its player, and retrieves its embed code for a marketing campaign.
1.  **Upload Video**: Use the `upload-video` helper script command to upload the new product video to a designated 'Launch' project.
2.  **Customize Player**: Use the `curl` command to set the player color and add a call-to-action link via the customizations endpoint.
3.  **Retrieve Embed Code**: Use the `get-video` command to fetch the video's metadata, which includes the standard and SEO embed codes.

### 2. Weekly Video Performance Report
This workflow gathers analytics for key videos and compiles a summary.
1.  **Identify Key Videos**: Use `list-videos` with a specific project ID to get the hashed IDs of all videos in the 'Key Marketing Videos' project.
2.  **Fetch Stats**: Loop through the list of video IDs and call `get-video-stats` for each one to retrieve play count, engagement, and conversion metrics.
3.  **Aggregate Data**: Consolidate the statistics into a structured format (e.g., CSV or JSON) for the final report.

## Real-world use cases

- **Automated Content Ingestion**: Automatically upload new video content from a designated folder to the Wistia platform as part of a CI/CD pipeline for a training portal.
- **Sales Enablement**: Allow sales reps to quickly search for and share relevant customer testimonial videos directly from their CRM.
- **Lead Generation Funnel**: When a viewer fills out a Turnstile form on a video, use a webhook to automatically add them to a marketing automation campaign.
- **A/B Testing Thumbnails**: Programmatically update video thumbnails and monitor changes in play rate to optimize for engagement.
- **Content Audits**: Regularly run a script to list all videos and their last-viewed dates to identify and archive outdated content.
- **Dynamic Video Watermarking**: Use the API to apply a viewer's email address or company logo as a watermark on sensitive internal videos.

## Output format

Responses should be returned in a clear, structured JSON format. Include confirmation messages and relevant identifiers.

**Successful Upload:**
```json
{
  "status": "success",
  "message": "Video 'New Product Demo.mp4' was successfully uploaded.",
  "hashed_id": "a1b2c3d4e5",
  "project_id": "f6g7h8i9j0"
}
```

**Video Stats:**
```json
{
  "status": "success",
  "hashed_id": "a1b2c3d4e5",
  "stats": {
    "plays": 1502,
    "play_rate": 0.68,
    "engagement": 0.82,
    "turnstile_conversions": 123
  }
}
```

## Guardrails

- **Confirm Deletions**: Always require explicit user confirmation before executing a delete operation, as it is irreversible.
- **Check for Duplicates**: Before uploading, perform a search by name or hash to prevent creating duplicate videos.
- **Validate IDs**: Ensure that `project_id` and `hashed_id` are valid and exist before attempting to perform operations on them.
- **Secure API Token**: Never expose the `WISTIA_API_TOKEN` in logs, user-facing messages, or client-side code.
- **Handle Processing Time**: Be aware that newly uploaded videos require time to process. Poll the media status endpoint before attempting to use a new video.
- **Scope Permissions**: When creating an API token, grant only the permissions necessary for the intended tasks (e.g., read-only vs. read-write).
- **Error on Large Uploads**: For very large files, use the resumable upload endpoint to ensure reliability.
- **Inform User of Costs**: Be mindful that video storage and bandwidth may incur costs. Inform the user if their request involves significant resource usage.

## Rate limits

The Wistia Data API has a rate limit of **200 requests per minute** per API key. If you exceed this limit, you will receive a `429 Too Many Requests` error. Implement exponential backoff when making bulk requests to avoid being throttled.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `401 Unauthorized` | The `WISTIA_API_TOKEN` is invalid, expired, or lacks permissions. | Verify the token is correct and has the required scopes in Wistia settings. |
| `404 Not Found` | The specified `hashed_id` or `project_id` does not exist. | Confirm the ID is correct. Use `list-videos` or `list-projects` to verify existence. |
| `422 Unprocessable Entity` | The request body is malformed or missing required parameters. | Check the API documentation and ensure all required fields are correctly formatted in the request. |
| `429 Too Many Requests` | The API rate limit has been exceeded. | Implement a delay and retry the request using an exponential backoff strategy. |
| `500 Internal Server Error` | A generic error on Wistia's end. | Wait a few moments and retry the request. If the issue persists, check the Wistia status page. |
| `Upload Failed` | The video file is corrupt, in an unsupported format, or the upload was interrupted. | Verify the file integrity and format. For large files, use a more robust upload method. |
| `Project Full` | The project has reached its maximum video limit (if on a legacy plan). | Guide the user to create a new project or upgrade their Wistia plan. |
| `Permission Denied` | The API token does not have the necessary permissions for the action. | Check the token's permissions in Wistia and ensure it can perform the requested action (e.g., write, delete). |

## Reference files

- **`references/api-reference.md`** — A comprehensive guide to all Wistia Data API endpoints, parameters, and response formats.
