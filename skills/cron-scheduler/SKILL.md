---
name: cron-scheduler
description: Interactively create, list, update, or remove scheduled cron jobs via conversational prompts. Use when the user wants to schedule a reminder, recurring task, automated message, or one-time event. Triggers on phrases like "remind me", "schedule", "every day at", "set a cron", "send me a message at", "run this weekly", "cancel that reminder", or any request to automate something on a time basis. Also triggers on the /cron command.
---

# Cron Scheduler Skill

Guide the user through setting up a cron job interactively. Gather all required fields conversationally before creating.

## Command Entry

This skill is also triggered via `/cron` command. When invoked via `/cron`:
- If arguments are provided (e.g., `/remind drink water in 2 hours`), parse them and skip asking for what/when if clear
- If invoked with no arguments, start the interactive flow from the beginning

## Interaction Flow

1. **Determine intent** — are they creating, listing, updating, or removing a job?
2. **Gather fields** — ask for missing required fields one logical group at a time (don't dump all questions at once)
3. **Confirm** — summarize what will be scheduled before creating
4. **Create** — call the `cron` tool and confirm success

## Required Fields to Gather

**What:** What should happen? (message text, task description)
**When:** Schedule type — ask in plain language, then map to the right schedule kind:
  - "at X time" → `at`
  - "every N minutes/hours" → `every`
  - "every Monday at 9am" / complex recurrence → `cron`

**Where to send:** Ask where the reminder/message should be delivered. Options depend on which channel the request came from:

  **If request is from Telegram (DM or group):**
  - "Here" → send back to this Telegram chat (use sender's chat ID — no need to ask)
  - "Control UI" → deliver as `systemEvent` in main session only
  - "Both" → Telegram chat + systemEvent
  - Default: "Here" (Telegram) — most natural choice when already in Telegram

  **If request is from webchat/Control UI:**
  - "Here" → deliver as `systemEvent` in main session
  - "Telegram" → send to user's Telegram (ask which chat if ambiguous, or use known ID from memory)
  - "Both" → systemEvent + Telegram

  **Sender ID resolution (critical):** Never hardcode a Telegram user or group ID.
  - In a Telegram DM: `target` = the sender's Telegram user ID from current conversation context
  - In a Telegram group: `target` = the group's chat ID from current conversation context
  - Always use the ID from the inbound message context — never assume or hardcode.

  **Delivery context must be embedded in the payload at scheduling time:**
  When the cron fires, it runs as a `systemEvent` in the main OpenClaw session — the original channel context (Telegram chat ID, group ID, etc.) is no longer available.

  - **"Here" from Control UI** → `systemEvent` firing in the main session IS the delivery. It shows up in the Control UI chat automatically. No extra routing needed.
  - **"Here" from Telegram** → need to push back to Telegram. Embed the chat ID in the payload at scheduling time.
  - **"Telegram" from Control UI** → same, embed the chat ID.
  - **"Both"** → systemEvent (for Control UI) + embed chat ID for Telegram push.

  When Telegram delivery is needed, format the systemEvent text like this:
  ```
  [deliver:telegram:<chatId>] <reminder message>
  ```
  Example:
  ```
  [deliver:telegram:583553343] Reminder: drink some water! 💧
  ```

  When the systemEvent fires and you see a `[deliver:telegram:<chatId>]` prefix, parse out the chat ID and send via `message(action="send", channel="telegram", target="<chatId>", message="<reminder text>")`, then strip the prefix before displaying/responding in the main session.

**Payload type:** Usually inferred from the request:
  - Reminder/message to user → `systemEvent`
  - Automated task / research / background job → `agentTurn`

**Name (optional):** Short label for the job (for listing/management later)

## Field Reference

See `references/cron-fields.md` for schedule formats, millisecond values, cron expressions, payload schemas, and session target options. Load it when you need exact syntax.

## Key Rules

- **Always confirm before creating** — summarize schedule + action in plain language
- **Time zones:** User is in `America/Chicago`. Convert any local times to UTC for `at` schedules, or pass `tz: "America/Chicago"` for `cron` schedules
- **One-shot vs recurring:** Clarify this if ambiguous — "just this once" vs "every week"
- **systemEvent text:** Write it as a readable reminder that makes sense when it fires (e.g., "Reminder: take a break!" not just "break")
- **agentTurn message:** Write a clear prompt for the sub-agent to act on
- **Naming jobs:** Always set a `name` so jobs are identifiable in the list

## Listing & Managing Jobs

To list: `cron(action="list")` — show job name, schedule, next run
To remove: `cron(action="remove", jobId="<id>")`
To update: `cron(action="update", jobId="<id>", patch={...})`
To run immediately: `cron(action="run", jobId="<id>")`

## Example Conversation Patterns

**Simple reminder:**
> User: "Remind me to drink water every 2 hours"
> → ask: "Where should I send it — here, Telegram, or both?"
> → payload: systemEvent "Reminder: drink some water! 💧"
> → schedule: every 7200000ms
> → if Telegram: send via message tool using sender's chat ID from current conversation context

**Scheduled message:**
> User: "Send me a message tomorrow at 9am saying good morning"
> → ask: "Where — here, Telegram, or both?"
> → payload: systemEvent + optional Telegram send using sender's chat ID
> → schedule: at (tomorrow 9am Chicago → UTC)

**Recurring task:**
> User: "Every Monday morning, summarize the top tech news"
> → payload: agentTurn "Search for and summarize the top 5 technology news stories from the past week."
> → schedule: cron `0 9 * * 1` tz: America/Chicago
> → delivery: announce (default for agentTurn)
