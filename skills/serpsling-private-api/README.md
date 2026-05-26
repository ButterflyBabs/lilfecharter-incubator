# Serpsling Private API Skill

## Skill Purpose

Interact with the Serpsling Private API for managing SEO projects, tracking keywords, and retrieving ranking data. This skill provides a complete interface for monitoring search engine rankings and managing keyword tracking campaigns.

## Supported Commands

### Project Management
- **List all projects** - View all your Serpsling projects
- **Get project details** - Retrieve specific project information by ID

### Keyword Management
- **List all keywords for a project** - View tracked keywords in a project
- **Add a keyword to a project** - Start tracking a new keyword
- **Delete a keyword from a project** - Remove keyword tracking (requires explicit confirmation)

### Ranking Data
- **Get ranking data for a keyword** - Retrieve historical ranking information

## Refusal Behavior

For any unsupported operations:
> "I only support: listing projects, getting project details, listing keywords for a project, adding a keyword, deleting a keyword, and retrieving ranking data for a keyword via the Serpsling Private API."

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SERPSLING_API_KEY` | Yes | Your Serpsling API key from your account settings |

## Optional Environment Variables

None confirmed at this time.

## First-Run Authentication Behavior

On first use, if `SERPSLING_API_KEY` is missing:

1. **Prompt user:** "Please provide your Serpsling API key from your account settings"
2. **Store securely:** Save to `~/.openclaw/workspace/skills/serpsling-private-api/.env`
3. **Validate:** Make test API call to `/api/v1/projects`
4. **Confirm success:** Display "✅ Serpsling API connected successfully"

### Storage Security
- API key stored in skill-scoped `.env` file
- File permissions: 600 (owner read/write only)
- Never logged, displayed, or transmitted

## Export/Share Rules

When exporting or sharing this skill:

✅ **Include:**
- SKILL.md
- README.md (this file)
- references/ directory

❌ **Exclude:**
- `.env` file (contains user-specific credentials)

**Note:** New users must provide their own `SERPSLING_API_KEY` on first use. The skill will prompt for it automatically.

## Safety Scan Note

This skill:
- ✅ Only exposes confirmed API operations
- ✅ Non-destructive operations by default
- ⚠️ Destructive actions (delete keyword) require explicit user confirmation

## API Documentation

For full API details, see:
- [Serpsling API Documentation](https://documenter.getpostman.com/view/328431/2sBXVbJuAG)

## Installation

1. Copy skill folder to: `~/.openclaw/workspace/skills/serpsling-private-api/`
2. On first run, provide your API key when prompted
3. Ready to use!

## Usage Examples

### List All Projects
```
User: /serpsling-list-projects

Assistant: Found 3 projects:
1. Project A (ID: 12345) - 25 keywords
2. Project B (ID: 67890) - 50 keywords
3. Project C (ID: 11111) - 12 keywords
```

### Get Project Details
```
User: /serpsling-get-project project_id=12345

Assistant: Project: Project A
ID: 12345
Keywords tracked: 25
Created: 2026-01-15
```

### List Keywords
```
User: /serpsling-list-keywords project_id=12345

Assistant: Keywords for Project A:
1. "best seo tools" (ID: 98765)
2. "rank tracker software" (ID: 98766)
...
```

### Add Keyword
```
User: /serpsling-add-keyword project_id=12345 keyword="serp tracking"

Assistant: ✅ Keyword "serp tracking" added to Project A
```

### Delete Keyword (Requires Confirmation)
```
User: /serpsling-delete-keyword project_id=12345 keyword_id=98765

Assistant: ⚠️ Are you sure you want to delete keyword 98765?
This will stop tracking for this keyword.

Type "DELETE" to confirm.

User: DELETE

Assistant: ✅ Keyword deleted successfully.
```

### Get Ranking Data
```
User: /serpsling-get-ranks project_id=12345 keyword_id=98765

Assistant: Ranking data for "best seo tools":
- Current rank: #3
- Previous rank: #5
- Change: +2 positions
- Date: 2026-04-09
```

## Version

1.0.0 - Initial release
