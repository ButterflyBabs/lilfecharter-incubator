---
name: communication-template
description: A template for skills that send messages via email (SMTP/API) or chat webhooks (Slack, Discord).
version: 1.0.0
license: MIT
metadata: {"category": "communication", "author": "OpenClaw", "tags": ["email", "chat", "webhook", "notification"]}
---

### When to Activate

This skill should be activated when the user wants to send notifications, alerts, or messages to external systems like email, Slack, or Discord. It is ideal for tasks involving automated communication, such as team alerts, customer emails, or incident notifications.

### First Interaction

Upon first activation, the skill should greet the user and ask for the essential information required to send a message. This includes the recipient's address or channel, the message content, and the desired communication platform (e.g., email, Slack, Discord). It should also confirm whether the message should be sent immediately or scheduled for a later time.

### Dependencies & Setup

This skill requires the `curl` command-line utility to be available in the environment for making HTTP requests. Before first use, the user must configure the necessary credentials by setting environment variables for the relevant API keys or webhook URLs (e.g., `[YOUR-EMAIL-API-KEY]`, `[YOUR-SLACK-WEBHOOK-URL]`).

### Slash Commands & Workflows

**/send**
Sends a message to a specified recipient or channel.
1. Validate the format and existence of the recipient's address or channel ID.
2. Check the message content against predefined content policies to prevent misuse.
3. Construct and execute a `curl` request to the appropriate API endpoint or webhook URL.
4. Report the status (success or failure) of the message delivery to the user.

**/schedule**
Schedules a message to be sent at a future time.
1. Prompt the user for the recipient, message, channel, and the desired delivery time.
2. Create a new scheduled job or task within the system's scheduler.
3. Securely store the message content and its associated metadata.
4. Confirm the scheduled time and details back to the user.

**/template**
Manages reusable message templates.
1. **list**: Display a list of all available message templates.
2. **use [template-name]**: Pre-fill the message content using a specified template.
3. **create [template-name]**: Save the current message as a new reusable template.

**/history**
Retrieves the history of recently sent messages.
1. Fetch the logs of the most recent messages sent through the skill.
2. Display the status, recipient, and timestamp for the last 10 messages.

### Automation

This skill can be integrated into automated workflows to send recurring reports, alerts, or status updates. For instance, it can be triggered by another skill to send a notification when a long-running data processing job is completed or when a system monitoring tool detects an anomaly.

### Guardrails & Safety

To ensure responsible use, the skill implements rate limiting, allowing a maximum of 10 messages per minute to prevent spam. All user-provided inputs are rigorously validated and sanitized to protect against injection attacks. Sensitive information, such as API keys and message content, is never logged in plain text.

### Failure Handling

If an API call to an external service fails, the skill will automatically retry the request up to three times with an exponential backoff strategy. If a message ultimately fails to send, the user will be notified with specific error details. The skill also provides clear instructions for resolving common issues, such as an invalid API key.

### Example Prompts

- "Send an email to team@example.com with the subject 'Project Update' and body 'We've just deployed the new feature.'"
- "Schedule a Slack message to the #general channel for tomorrow at 9 AM: 'Good morning, team!'"
- "Use the 'incident-report' template to send a Discord message to the on-call channel."