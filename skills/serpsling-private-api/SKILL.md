---
name: serpsling-private-api
slug: serpsling-private-api
author: OpenClaw Generator
source: https://documenter.getpostman.com/view/328431/2sBXVbJuAG
description: Interact with the Serpsling Private API to manage projects, keywords, and retrieve ranking data. Supports project management, keyword tracking, and SEO rank monitoring.
version: 1.0.0
license: proprietary
allowed-tools:
  - shell
  - message
  - web_fetch
metadata:
  openclaw:
    requires:
      env: ["SERPSLING_API_KEY"]
      bins: ["curl"]
    primaryEnv: "SERPSLING_API_KEY"
    emoji: "📊"
---

# Serpsling Private API Skill

## Overview

Manage SEO projects, track keywords, and retrieve ranking data using the Serpsling Private API.

## Authentication

**API Key Location:** Your Serpsling account → API Settings

**Storage:**
- Store in: `~/.openclaw/workspace/skills/serpsling-private-api/.env`
- Format: `SERPSLING_API_KEY=your_api_key_here`
- **NEVER** commit or share this file

**API Base URL:** `https://api.serpsling.com`

**Headers:**
```
Authorization: Bearer {{ env.SERPSLING_API_KEY }}
Content-Type: application/json
```

## Supported Commands

### Project Management

| Command | Method | Endpoint | Description | Risk |
|---------|--------|----------|-------------|------|
| `/serpsling-list-projects` | GET | /api/v1/projects | List all projects | Read-only |
| `/serpsling-get-project` | GET | /api/v1/projects/{project_id} | Get project details | Read-only |

### Keyword Management

| Command | Method | Endpoint | Description | Risk |
|---------|--------|----------|-------------|------|
| `/serpsling-list-keywords` | GET | /api/v1/projects/{project_id}/keywords | List all keywords for a project | Read-only |
| `/serpsling-add-keyword` | POST | /api/v1/projects/{project_id}/keywords | Add keyword to project | Mutating |
| `/serpsling-delete-keyword` | DELETE | /api/v1/projects/{project_id}/keywords/{keyword_id} | Delete keyword | **DESTRUCTIVE** |

### Ranking Data

| Command | Method | Endpoint | Description | Risk |
|---------|--------|----------|-------------|------|
| `/serpsling-get-ranks` | GET | /api/v1/projects/{project_id}/keywords/{keyword_id}/ranks | Get ranking data for keyword | Read-only |

## Usage Examples

### List All Projects
```
/serpsling-list-projects
```

### Get Project Details
```
/serpsling-get-project project_id=12345
```

### List Keywords for a Project
```
/serpsling-list-keywords project_id=12345
```

### Add a Keyword
```
/serpsling-add-keyword project_id=12345
{
  "keyword": "best seo tools"
}
```

### Delete a Keyword (Requires Confirmation)
```
/serpsling-delete-keyword project_id=12345 keyword_id=67890
```
**Confirmation required:** Type "DELETE" to confirm

### Get Ranking Data
```
/serpsling-get-ranks project_id=12345 keyword_id=67890
```

## First-Run Setup

On first use, if `SERPSLING_API_KEY` is missing:

1. Prompt user: "Please provide your Serpsling API key"
2. Store in: `~/.openclaw/workspace/skills/serpsling-private-api/.env`
3. Validate with test API call to `/api/v1/projects`
4. Confirm: "✅ Serpsling API connected successfully"

## Error Handling

| Error | Response |
|-------|----------|
| 401 Unauthorized | "Invalid API key. Please check your Serpsling API key." |
| 404 Not Found | "Project or keyword not found. Please check the ID." |
| 400 Bad Request | "Invalid request. Please check your parameters." |
| 429 Rate Limited | "Rate limit hit. Please wait and try again." |
| 500 Server Error | "Serpsling API error. Please try again later." |

## Refusal Behavior

For unsupported operations:
> "I only support: listing projects, getting project details, listing keywords for a project, adding a keyword, deleting a keyword, and retrieving ranking data for a keyword via the Serpsling Private API."

## Security Notes

- API key never logged or displayed
- HTTPS only
- Destructive actions require explicit confirmation
- `.env` file excluded from exports

## Export/Share Rules

- ✅ Include: SKILL.md, README.md, references/
- ❌ Exclude: .env file (contains user credentials)
- New users must provide their own API key on first use

## Version History

- 1.0.0 - Initial release with project, keyword, and ranking management
