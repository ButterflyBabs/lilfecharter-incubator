---
name: office365-mail
slug: office365-mail
author: OpenClaw Generator
source: https://docs.microsoft.com/en-us/graph/api/resources/mail-api-overview
description: Read, send, and manage Office 365 emails through Microsoft Graph API. Check inbox, read messages, send replies, manage folders, and handle calendar events. Perfect for email automation and inbox management.
version: 1.0.0
license: proprietary
allowed-tools:
  - shell
  - message
  - web_fetch
metadata:
  openclaw:
    requires:
      env: ["MS_GRAPH_CLIENT_ID", "MS_GRAPH_CLIENT_SECRET", "MS_GRAPH_TENANT_ID"]
      bins: ["curl"]
    primaryEnv: "MS_GRAPH_CLIENT_ID"
    emoji: "📧"
---

# Office 365 Mail Skill

## Overview

Manage Office 365 emails and calendar through Microsoft Graph API. Read inbox, send emails, manage folders, and handle calendar events.

## Authentication

**Microsoft Graph API Setup:**
1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory
2. App registrations → New registration
3. Name: "OpenClaw Office 365 Mail"
4. Supported account types: Accounts in this organizational directory only
5. Redirect URI: Web → `http://localhost`
6. Click Register

**Required API Permissions:**
- Microsoft Graph → Delegated permissions:
  - `Mail.Read` - Read user mail
  - `Mail.ReadWrite` - Read and write access to mail
  - `Mail.Send` - Send mail as a user
  - `Calendars.Read` - Read user calendars
  - `Calendars.ReadWrite` - Read and write user calendars
  - `User.Read` - Sign in and read user profile

**Get Credentials:**
- **Client ID:** Overview → Application (client) ID
- **Tenant ID:** Overview → Directory (tenant) ID
- **Client Secret:** Certificates & secrets → New client secret → Copy the value immediately

**Storage:**
- Store in: `~/.openclaw/workspace/skills/office365-mail/.env`
- Format:
  ```
  MS_GRAPH_CLIENT_ID=your_client_id_here
  MS_GRAPH_CLIENT_SECRET=your_client_secret_here
  MS_GRAPH_TENANT_ID=your_tenant_id_here
  ```
- **NEVER** commit or share this file

**API Base URL:** `https://graph.microsoft.com/v1.0`

## Supported Commands

### Email Operations

| Command | Method | Endpoint | Description | Risk |
|---------|--------|----------|-------------|------|
| `/o365-inbox` | GET | /me/messages | List inbox messages | Read-only |
| `/o365-read` | GET | /me/messages/{id} | Read specific email | Read-only |
| `/o365-send` | POST | /me/sendMail | Send new email | Mutating |
| `/o365-reply` | POST | /me/messages/{id}/createReply | Reply to email | Mutating |
| `/o365-delete` | DELETE | /me/messages/{id} | Delete email | **DESTRUCTIVE** |
| `/o365-folders` | GET | /me/mailFolders | List mail folders | Read-only |
| `/o365-search` | GET | /me/messages?$search | Search emails | Read-only |
| `/o365-unread` | GET | /me/messages?$filter | Get unread count | Read-only |

### Calendar Operations

| Command | Method | Endpoint | Description | Risk |
|---------|--------|----------|-------------|------|
| `/o365-calendar` | GET | /me/calendar/events | List calendar events | Read-only |
| `/o365-events-today` | GET | /me/calendar/events | Today's events | Read-only |
| `/o365-create-event` | POST | /me/calendar/events | Create calendar event | Mutating |

## Usage Examples

### Check Inbox
```
/o365-inbox
```

### Read Specific Email
```
/o365-read message_id=AQMkADAwATM0MDAAMS0xNj...
```

### Send Email
```
/o365-send
{
  "to": "recipient@example.com",
  "subject": "Meeting Tomorrow",
  "body": "Hi, just confirming our meeting tomorrow at 2pm."
}
```

### Reply to Email
```
/o365-reply message_id=AQMkADAwATM0MDAAMS0xNj...
{
  "body": "Thanks for the update! I'll review and get back to you."
}
```

### Search Emails
```
/o365-search query=from:boss@company.com subject:urgent
```

### Get Unread Count
```
/o365-unread
```

### List Mail Folders
```
/o365-folders
```

### Delete Email (Requires Confirmation)
```
/o365-delete message_id=AQMkADAwATM0MDAAMS0xNj...
```
**Confirmation required:** Type "DELETE" to confirm

### View Calendar Events
```
/o365-calendar
```

### Today's Events
```
/o365-events-today
```

### Create Calendar Event
```
/o365-create-event
{
  "subject": "Team Meeting",
  "start": "2026-04-30T14:00:00",
  "end": "2026-04-30T15:00:00",
  "attendees": ["colleague@company.com"]
}
```

## First-Run Setup

On first use, if credentials are missing:

1. Prompt user: "Please provide your Microsoft Graph API credentials"
2. Guide through Azure AD app registration
3. Store in: `~/.openclaw/workspace/skills/office365-mail/.env`
4. Test with: `GET /me/messages?$top=1`
5. Confirm: "✅ Office 365 Mail connected successfully"

## API Authentication Flow

### Step 1: Get Access Token
```bash
curl -X POST "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=$MS_GRAPH_CLIENT_ID" \
  -d "client_secret=$MS_GRAPH_CLIENT_SECRET" \
  -d "scope=https://graph.microsoft.com/.default" \
  -d "grant_type=client_credentials"
```

### Step 2: Use Token in Requests
```bash
curl -X GET "https://graph.microsoft.com/v1.0/me/messages?$top=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Error Handling

| Error | Response |
|-------|----------|
| 401 Unauthorized | "Invalid credentials. Please check your Azure AD app registration and permissions." |
| 403 Forbidden | "Insufficient permissions. Ensure Mail.Read, Mail.Send, and Calendars.ReadWrite are granted." |
| 404 Not Found | "Message or event not found. Please check the ID." |
| 400 Bad Request | "Invalid request format. Please check your parameters." |
| 429 Rate Limited | "Microsoft Graph rate limit hit. Please wait and try again." |
| 500 Server Error | "Microsoft Graph API error. Please try again later." |

## Common Microsoft Graph Endpoints

### Email
- `GET /me/messages` - List messages
- `GET /me/messages/{id}` - Get message
- `POST /me/sendMail` - Send message
- `POST /me/messages/{id}/createReply` - Create reply draft
- `POST /me/messages/{id}/send` - Send draft
- `DELETE /me/messages/{id}` - Delete message
- `GET /me/mailFolders` - List folders

### Calendar
- `GET /me/calendar/events` - List events
- `GET /me/calendarview?startDateTime=...&endDateTime=...` - Calendar view
- `POST /me/calendar/events` - Create event
- `PATCH /me/calendar/events/{id}` - Update event
- `DELETE /me/calendar/events/{id}` - Delete event

## Refusal Behavior

For unsupported operations:
> "I only support: reading inbox, reading specific emails, sending emails, replying to emails, deleting emails, searching emails, listing mail folders, and calendar operations via the Office 365 Mail skill."

## Security Notes

- Client credentials never logged or displayed
- HTTPS only
- Destructive actions (delete) require explicit confirmation
- `.env` file excluded from exports
- Token refresh handled automatically

## Export/Share Rules

- ✅ Include: SKILL.md, README.md, references/
- ❌ Exclude: .env file (contains user credentials)
- New users must provide their own credentials on first use

## Version History

- 1.0.0 - Initial release with email and calendar management
