---
name: zoom-meetings
description: "Automate Zoom meeting and webinar workflows, including scheduling, participant management, and cloud recording administration. Use this skill to create recurring sales calls, manage user licenses, pull attendance reports for compliance, and analyze meeting engagement metrics."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["ZOOM_ACCESS_TOKEN"],"bins":["curl"]},"primaryEnv":"ZOOM_ACCESS_TOKEN","emoji":"📹"}}
---

# Zoom Meetings

This skill provides comprehensive automation for managing Zoom meetings, webinars, users, and cloud recordings. It enables advanced workflows such as bulk user management, recurring meeting scheduling, and retrieval of detailed engagement analytics, helping to streamline administrative tasks and unlock insights from your communication data.

## When to activate

Activate this skill for any tasks involving the management or automation of Zoom resources. It is particularly useful in business contexts requiring auditable communication trails, sales process automation, and internal training coordination.

- **Keywords**: Zoom, video conference, webinar, schedule meeting, cloud recording, user provisioning, attendance report, meeting analytics, virtual meeting, online training, sales demo, dial-in number, participant list, host key.
- **Scenarios**:
    - "Schedule a weekly project sync for the engineering team and invite all members."
    - "Who attended the All-Hands meeting last Friday? I need a list of participants and their total duration."
    - "Create a new Zoom user account for our new sales hire and assign them a Pro license."
    - "Find all cloud recordings from last month related to 'Project Phoenix' and get me the download links."
    - "Generate a report of our Zoom usage for the last quarter, including total meetings and participant minutes."
    - "Set up a public webinar for our product launch with Q&A enabled."
    - "I need to update the topic for tomorrow's client call and add a new agenda item."
    - "Cancel the recurring marketing stand-up for next week."

## Required credentials

- `ZOOM_ACCESS_TOKEN` — A Server-to-Server OAuth or OAuth 2.0 access token with the appropriate scopes. You can create one from the [Zoom App Marketplace](https://marketplace.zoom.us/develop/create).

For full functionality, the token must have the following scopes: `meeting:write:admin`, `meeting:read:admin`, `webinar:write:admin`, `webinar:read:admin`, `user:write:admin`, `user:read:admin`, `recording:read:admin`, `dashboard:read:admin`.

## Helper script

Use the `scripts/zoom_api.py` script for convenient, high-level operations. This script simplifies common API interactions into single commands.

```bash
python scripts/zoom_api.py <command> [args]
```

| Command | Description |
|---|---|
| `create-meeting` | Create a new Zoom meeting for a user. |
| `list-meetings` | List all meetings for a specific user. |
| `get-meeting` | Retrieve detailed information for a single meeting. |
| `update-meeting` | Update the details of a scheduled meeting. |
| `delete-meeting` | Delete a specific meeting. |
| `list-recordings` | List all cloud recordings for a user within a date range. |
| `get-recording` | Get details for a specific cloud recording. |
| `list-users` | List all users on the account with pagination. |
| `get-user` | Retrieve profile information for a specific user. |
| `create-webinar` | Schedule a new webinar for a user. |
| `list-webinars` | List all webinars for a specific user. |
| `get-webinar-participants` | Get a list of participants for a past webinar. |

## Workflow

All API requests must include the `Authorization: Bearer $ZOOM_ACCESS_TOKEN` header. POST and PATCH requests require a `Content-Type: application/json` header.

### 1. Create a Recurring Meeting

**Endpoint:** `POST /v2/users/{userId}/meetings`

```bash
curl -X POST "https://api.zoom.us/v2/users/me/meetings" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "topic": "Weekly Sales Stand-up",
    "type": 8,
    "start_time": "2024-08-01T09:00:00Z",
    "duration": 30,
    "recurrence": {
      "type": 1,
      "repeat_interval": 1,
      "end_date_time": "2024-12-31T09:00:00Z"
    }
  }'
```

### 2. Get Meeting Participant Report

**Endpoint:** `GET /v2/report/meetings/{meetingId}/participants`

```bash
curl "https://api.zoom.us/v2/report/meetings/987654321/participants?page_size=300" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN"
```

### 3. Get Account-wide Cloud Recordings

**Endpoint:** `GET /v2/accounts/{accountId}/recordings`

```bash
curl "https://api.zoom.us/v2/accounts/me/recordings?from=2024-07-01&to=2024-07-31" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN"
```

### 4. Bulk Add Users to a Group

**Endpoint:** `POST /v2/groups/{groupId}/members`

```bash
curl -X POST "https://api.zoom.us/v2/groups/aBcDeFg/members" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "members": [
      { "email": "user1@example.com" },
      { "id": "xyz789" }
    ]
  }'
```

### 5. Get Meeting Poll Results

**Endpoint:** `GET /v2/report/meetings/{meetingId}/polls`

```bash
curl "https://api.zoom.us/v2/report/meetings/123456789/polls" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN"
```

## Pagination

For endpoints that return a list of resources (e.g., users, meetings, recordings), the API uses pagination. You must handle the `next_page_token` and `page_size` parameters to iterate through all results.

- `page_size`: The number of records returned per page. The default is 30, and the maximum is 300.
- `next_page_token`: A token to retrieve the next page of results. This is returned in the response body of list endpoints.

Example request to get the next page of users:

```bash
curl "https://api.zoom.us/v2/users?page_size=100&next_page_token=REPLACE_WITH_TOKEN" \
  -H "Authorization: Bearer $ZOOM_ACCESS_TOKEN"
```

Always check for the presence of `next_page_token` in the response. If it is empty or null, you have reached the last page.

## Webhook setup

Zoom webhooks can notify your application of events in real-time. To set up a webhook, you must create an Event Subscription in your Zoom App Marketplace configuration.

1.  **Create an Event Subscription**: In your app settings, add a new subscription, specifying your endpoint URL.
2.  **Add Events**: Subscribe to specific events like `meeting.started`, `recording.completed`, or `user.created`.
3.  **Validate Your Endpoint**: Zoom will send a POST request with a `challenge` token to your endpoint. Your endpoint must respond with a JSON object containing the challenge value to validate.

Example validation response:

```json
{
  "plainToken": "received_challenge_token",
  "encryptedToken": "hashed_and_signed_token"
}
```

## Multi-step workflows

### 1. New Employee Onboarding

This workflow automates the provisioning of a Zoom account for a new employee.

1.  **Create User**: `POST /v2/users` with user info and `action: "create"`. Assign a Pro license.
2.  **Add to Group**: `POST /v2/groups/{groupId}/members` to add the new user to the "All Employees" group.
3.  **Send Welcome Email**: Use an external email service to send the new user their Zoom login details.

### 2. Weekly Compliance Reporting

This workflow generates a weekly report of all recorded meetings for compliance auditing.

1.  **List Users**: `GET /v2/users` to get a list of all active users.
2.  **Iterate and Fetch Recordings**: For each user, call `GET /v2/users/{userId}/recordings` for the past week.
3.  **Aggregate and Store**: Collect all recording metadata (topic, start time, download URL) and store it in a CSV file or database for the compliance team.

## Real-world use cases

- **Automated Sales Demos**: Automatically create unique Zoom meetings for every new lead that books a demo via your website, and assign the correct sales representative as the host.
- **Training Session Management**: Schedule a series of training webinars, automatically register attendees from a list, and send them calendar invites with join links.
- **Compliance Auditing**: Generate a monthly report of all meeting participants and their time in-session for mandatory HR training to ensure attendance requirements are met.
- **Resource Optimization**: Analyze user license usage by pulling last login times and meeting counts to de-provision inactive accounts and reduce licensing costs.
- **Content Creation Pipeline**: When a cloud recording for a public webinar is completed, automatically download it, pass it to a transcription service, and create a draft blog post.

## Output format

Responses should be structured JSON, clearly indicating success or failure and providing relevant data.

**Create Meeting Success:**
```json
{
  "ok": true,
  "action": "meeting_created",
  "meeting_id": "9876543210",
  "start_url": "https://zoom.us/s/9876543210?zak=...",
  "join_url": "https://zoom.us/j/9876543210",
  "message": "Successfully created the meeting 'Project Sync'."
}
```

**List Recordings Response:**
```json
{
  "ok": true,
  "from": "2024-07-01",
  "to": "2024-07-31",
  "total_records": 5,
  "meetings": [
    {
      "uuid": "a1b2c3d4==",
      "topic": "Quarterly Review",
      "start_time": "2024-07-15T10:00:00Z",
      "recording_files": [
        { "id": "xyz", "file_type": "MP4", "download_url": "..." }
      ]
    }
  ]
}
```

## Guardrails

- **Never** expose `start_url` for meetings, as it grants host privileges.
- **Always** confirm with the user before deleting any resource (meeting, user, recording).
- **Do not** create users with generic or easily guessable passwords if using password-based auth.
- **Validate** all user-provided IDs (meetingId, userId) against the API to ensure they exist before acting on them.
- **Use** the `me` alias instead of a specific user ID when performing actions on behalf of the authenticated user.
- **Sanitize** all user input used in API calls to prevent injection attacks, especially for meeting topics and agendas.
- **Adhere** to regional data privacy laws (like GDPR) when handling participant data and recordings.
- **Implement** robust error handling for API calls, including retries with exponential backoff for rate limit errors.

## Rate limits

Zoom API rate limits vary by account type and endpoint. For Pro accounts, the general limit is **20 requests/second**. For Business and higher, it is **60 requests/second**. Some intensive endpoints, like reporting, have stricter limits.

- **Rate Limiting**: Exceeding the limit returns an HTTP `429 Too Many Requests` error.
- **Daily Limits**: There are also daily limits for creating resources (e.g., 100 users/day).
- **Best Practice**: Implement a queueing system and exponential backoff to manage API call volume and avoid hitting limits.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| 1001 | `invalid_access_token` | The `ZOOM_ACCESS_TOKEN` is expired, revoked, or malformed. Refresh the token. |
| 1105 | `user_not_exist` | The specified user ID or email does not exist in the account. Verify the user ID. |
| 3001 | `meeting_not_found` | The meeting ID is invalid or the meeting has expired. Check the ID and ensure it's for a valid, non-expired meeting. |
| 200 | `no_permission` | The app does not have the required scopes for this API call. Add the necessary permissions in the App Marketplace. |
| 429 | `rate_limit_exceeded` | Too many requests were sent in a short period. Implement exponential backoff and retry the request. |
| 3003 | `not_a_pro_user` | The user must have a Pro license to perform this action (e.g., use cloud recording). Upgrade the user's license. |
| 2016 | `account_not_support_api` | The account does not have API access enabled. Contact Zoom support to enable it. |
| 3305 | `webinar_license_not_found` | The user does not have a webinar license. Assign a webinar license to the user. |

## Reference files

- **`references/api-reference.md`** — Detailed Zoom API endpoint documentation, including all parameters, response schemas, and error codes.
