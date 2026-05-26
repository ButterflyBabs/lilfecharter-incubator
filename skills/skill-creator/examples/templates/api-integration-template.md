---
name: [your-skill-name]
description: "Integrate with [API-NAME] API. Use when the user wants to [primary action] via [API-NAME]."
version: 1.0.0
license: MIT
metadata: {"openclaw":{"requires":{"env":["[YOUR_API_KEY_ENV]"],"bins":["curl","jq"]},"primaryEnv":"[YOUR_API_KEY_ENV]","emoji":"🔌"}}
---

# [API-NAME] Integration

Connect to the [API-NAME] REST API to [primary purpose]. This skill handles authentication, request construction, response parsing, and error handling.

## When to Activate

Activate when the user mentions [API-NAME], or wants to [action-1], [action-2], or [action-3].

**Activation Keywords:**
- [api-name], [action-1], [action-2], [action-3]
- connect to [api-name], use [api-name], query [api-name]
- fetch from [api-name], send to [api-name], update [api-name]

## First Interaction

> **[API-NAME] Integration Ready 🔌**
> I can help you interact with [API-NAME]. Make sure your `[YOUR_API_KEY_ENV]` is set.
> Try: `/[skill-name] list` or `/[skill-name] create [item]`

## Dependencies & Setup

- **API Key:** `[YOUR_API_KEY_ENV]` — Get it at [https://api-provider.com/settings/keys]
- **Base URL:** `https://api.provider.com/v1`
- **Auth Method:** Bearer token in Authorization header
- **Rate Limits:** [X] requests per minute
- **Required Tools:** `curl`, `jq`

## Slash Commands & Workflows

### `/[skill-name] list` — List All Items
**Workflow:**
1. Execute: `curl -s -H "Authorization: Bearer $[YOUR_API_KEY_ENV]" "https://api.provider.com/v1/items" | jq '.data'`
2. If HTTP status is not 200, report the error code and message body.
3. Parse the JSON response and display items in a formatted table.
4. Show total count at the bottom.

### `/[skill-name] create [params]` — Create a New Item
**Workflow:**
1. Parse user-provided parameters into a JSON body.
2. Execute: `curl -s -X POST -H "Authorization: Bearer $[YOUR_API_KEY_ENV]" -H "Content-Type: application/json" -d '{"name":"[param]"}' "https://api.provider.com/v1/items" | jq '.'`
3. If HTTP 201, confirm creation and display the new item ID.
4. If HTTP 400, show validation errors from the response.
5. If HTTP 429, inform user of rate limit and suggest waiting.

### `/[skill-name] get [id]` — Get Item Details
**Workflow:**
1. Execute: `curl -s -H "Authorization: Bearer $[YOUR_API_KEY_ENV]" "https://api.provider.com/v1/items/[id]" | jq '.'`
2. If HTTP 404, inform user the item was not found.
3. Display all item fields in a readable format.

### `/[skill-name] delete [id]` — Delete an Item
**Workflow:**
1. Ask user for confirmation: "Are you sure you want to delete item [id]?"
2. Only proceed if user confirms.
3. Execute: `curl -s -X DELETE -H "Authorization: Bearer $[YOUR_API_KEY_ENV]" "https://api.provider.com/v1/items/[id]"`
4. If HTTP 204, confirm deletion.
5. If HTTP 404, inform user the item does not exist.

## Guardrails & Safety

- **NEVER** expose the API key in output or logs.
- **NEVER** delete items without explicit user confirmation.
- **ALWAYS** check HTTP status codes before parsing response bodies.
- **ALWAYS** respect rate limits — if 429 received, wait and retry once.
- **NEVER** send more than 10 requests in a single command execution.

## Failure Handling

- If `[YOUR_API_KEY_ENV]` is not set, instruct the user to set it and stop.
- If `curl` is not installed, instruct the user to install it.
- If the API returns 401, tell the user their API key is invalid or expired.
- If the API returns 500, inform user of a server-side issue and suggest retrying later.
- If network timeout occurs, retry once after 3 seconds, then report failure.

## Example Prompts

- "List all my [items] from [API-NAME]"
- "Create a new [item] called [name]"
- "/[skill-name] get abc123"
- "/[skill-name] delete xyz789"
- "Show me the details of [item] [id]"
- "How many [items] do I have?"
