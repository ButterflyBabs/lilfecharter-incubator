---
name: google-drive
description: "Automate file management in Google Drive. This skill enables creating, searching, sharing, and organizing documents, spreadsheets, and folders to streamline collaboration and backup workflows. Activate for any task involving cloud storage or document handling in a user's Google Drive account."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["GOOGLE_DRIVE_TOKEN"],"bins":["curl"]},"primaryEnv":"GOOGLE_DRIVE_TOKEN","emoji":"📁"}}
---

# Google Drive

This skill provides comprehensive automation for Google Drive, allowing for advanced file and folder manipulation, sharing, and organization. It is designed to handle everything from simple file uploads to complex, multi-step business workflows involving documents, spreadsheets, and collaborative spaces.

## When to activate

This skill should be activated when a user's request involves managing or interacting with files, folders, or documents within their Google Drive. Look for the following keywords and scenarios:

- **Keywords**: Google Drive, GDrive, cloud storage, file upload, download file, share document, create folder, Google Docs, Google Sheets, Google Slides, find file, search drive, file permissions, collaboration, backup, version history, team drive.

- **Scenarios**:
    - "Upload the quarterly sales report to the 'Reports' folder in my Drive."
    - "Find the presentation named 'Project Phoenix' and share it with my team."
    - "Create a new Google Doc for meeting notes and share it with marketing@example.com."
    - "What are the recent changes to the 'Q3 Financials' spreadsheet?"
    - "Download all invoices from the 'Client Invoices' folder from last month."
    - "Revoke access for former-employee@example.com from all shared files."
    - "List all spreadsheets I own that were modified in the last week."
    - "Create a shared folder for the new marketing campaign."

## Required credentials

- `GOOGLE_DRIVE_TOKEN` — An OAuth 2.0 access token with the necessary Google Drive API scopes. The required scopes depend on the desired actions (e.g., `https://www.googleapis.com/auth/drive` for full access). The token can be obtained through a standard OAuth 2.0 consent flow or by using a service account for server-to-server interactions. For more details, refer to the [Google Drive API authentication documentation](https://developers.google.com/drive/api/guides/about-auth).

## Helper script

The `scripts/google_drive_api.py` script provides a convenient way to perform common Google Drive operations. It simplifies the underlying API calls into straightforward commands.

```bash
python scripts/google_drive_api.py <command> [args]
```

| Command | Description |
|---|---|
| `upload-file` | Upload a file to a specified Drive folder. |
| `download-file` | Download a file from Drive to the local filesystem. |
| `create-shared-link` | Generate a publicly accessible link for a file. |
| `list-folder-contents` | List the files and folders within a specific Drive folder. |
| `search-files` | Search for files and folders in Drive using a query. |
| `create-folder` | Create a new folder in Google Drive. |
| `delete-file` | Permanently delete a file or folder. |
| `update-file-metadata` | Modify the metadata of a file, such as its name or parent folder. |
| `get-file-metadata` | Retrieve detailed metadata for a specific file. |

## Workflow

The Google Drive API is a RESTful service that uses bearer token authentication and JSON-based request/response bodies.

### 1. Search for Files

**Endpoint:** `GET https://www.googleapis.com/drive/v3/files`

```bash
curl "https://www.googleapis.com/drive/v3/files?q=name contains 'report' and mimeType='application/vnd.google-apps.spreadsheet'" \
  -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN"
```

### 2. Export a Google Doc as PDF

**Endpoint:** `GET https://www.googleapis.com/drive/v3/files/{fileId}/export`

```bash
curl "https://www.googleapis.com/drive/v3/files/FILE_ID/export?mimeType=application/pdf" \
  -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN" -o "exported-document.pdf"
```

### 3. Add a Comment to a File

**Endpoint:** `POST https://www.googleapis.com/drive/v3/files/{fileId}/comments`

```bash
curl -X POST "https://www.googleapis.com/drive/v3/files/FILE_ID/comments?fields=*" \
  -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a new comment."}'
```

## Pagination

When listing files or other resources, the API returns a `nextPageToken` in the response body if more results are available. To retrieve the next page, include this token in the subsequent request as the `pageToken` query parameter.

```bash
# Initial request
curl "https://www.googleapis.com/drive/v3/files?pageSize=100" -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN"

# In the response:
# {
#   "nextPageToken": "a-long-token-string",
#   "files": [...]
# }

# Subsequent request for the next page
curl "https://www.googleapis.com/drive/v3/files?pageSize=100&pageToken=a-long-token-string" -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN"
```

## Webhook setup

Google Drive API supports push notifications (webhooks) to monitor changes to files. To set up a webhook, you need to register a notification channel.

### 1. Create a Notification Channel

**Endpoint:** `POST https://www.googleapis.com/drive/v3/files/{fileId}/watch`

```bash
curl -X POST "https://www.googleapis.com/drive/v3/files/FILE_ID/watch" \
  -H "Authorization: Bearer $GOOGLE_DRIVE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "unique-channel-id",
    "type": "web_hook",
    "address": "https://your-webhook-receiver.com/notifications"
  }'
```

## Multi-step workflows

### 1. Customer Onboarding Document Flow

This workflow automates the creation and sharing of a welcome packet for new customers.

1.  **Create a new folder** for the customer, named with their company name.
2.  **Copy a template** welcome document into the new folder.
3.  **Update the document** with the customer's name and other details.
4.  **Share the folder** with the customer's primary contact, giving them editor access.

### 2. Weekly Sales Report Generation

This workflow automates the aggregation and distribution of a weekly sales report.

1.  **Search for all new sales spreadsheets** created in the past week.
2.  **Download the data** from each spreadsheet.
3.  **Aggregate the data** into a summary report.
4.  **Upload the summary report** to a "Weekly Reports" folder.
5.  **Share the report** with the sales team.

## Real-world use cases

- **Automated Backups**: Regularly back up critical files from other systems to a designated Google Drive folder.
- **Collaborative Project Management**: Create a new folder structure for each new project, with subfolders for documents, designs, and meeting notes, and automatically share it with the project team.
- **Content Publishing Pipeline**: Use Google Docs to draft blog posts, then use the skill to export the finished documents to a format suitable for a content management system.
- **Financial Auditing**: Search for and download all invoices and expense reports from a specific time period for auditing purposes.
- **HR Onboarding**: When a new employee is hired, automatically create a personalized onboarding folder with all necessary documents and share it with them.

## Output format

Responses should be in a structured JSON format, clearly indicating the outcome of the operation.

**Success Response:**
```json
{
  "ok": true,
  "action": "file_created",
  "file_id": "1a2B3cD4EfG5hIjKlMnOpQ",
  "file_name": "New Customer Welcome Packet.gdoc",
  "message": "File created and shared successfully."
}
```

**Error Response:**
```json
{
  "ok": false,
  "error_code": "fileNotFound",
  "message": "The requested file could not be found."
}
```

## Guardrails

- **Confirm deletions**: Always require explicit user confirmation before deleting any files or folders.
- **Validate sharing permissions**: Before sharing a file, verify the recipient's email address and the requested role (`reader`, `writer`, `commenter`).
- **Sensitive data handling**: Avoid exposing file contents or metadata in logs. Redact sensitive information.
- **Scope limitations**: Use the least permissive OAuth scopes necessary for the task.
- **Error on ambiguity**: If a user's request is ambiguous (e.g., "delete the report"), ask for clarification instead of guessing.
- **Rate limit awareness**: Be mindful of API rate limits and implement backoff strategies.

## Rate limits

The Google Drive API has usage limits to ensure service reliability. These limits are complex and can vary, but generally include:

- **Per-user rate limit**: A limit on the number of requests per user per 100 seconds.
- **Project-level rate limit**: A daily limit on the total number of requests for a Google Cloud project.

Exceeding these limits will result in a `403 Forbidden` error with a `userRateLimitExceeded` or `rateLimitExceeded` reason. It is crucial to implement exponential backoff when these errors are encountered.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `401 Unauthorized` | Invalid or expired `GOOGLE_DRIVE_TOKEN`. | Refresh the OAuth 2.0 token. |
| `403 Forbidden` | The token does not have the required permissions for the operation. | Request the necessary scopes from the user. |
| `404 Not Found` | The requested file or folder does not exist. | Verify the file ID and inform the user. |
| `429 Too Many Requests` | The rate limit has been exceeded. | Implement exponential backoff and retry the request. |
| `500 Internal Server Error` | A generic server error occurred on Google's end. | Retry the request after a short delay. |
| `invalidSharingRequest` | The sharing request was malformed or invalid. | Check the email address and role, then correct the request. |

## Reference files

- **`references/api-reference.md`**: A comprehensive guide to the Google Drive API, including detailed endpoint descriptions, request/response examples, and error codes.
