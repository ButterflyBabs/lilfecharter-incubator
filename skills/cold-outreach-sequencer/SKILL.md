---
name: cold-outreach-sequencer
description: "Drives scalable B2B sales development by automating hyper-personalized cold email campaigns. It researches prospects, crafts unique AI-generated messages, executes multi-step follow-up sequences, tracks engagement analytics, and manages lead pipelines to book more meetings. Use it to replace manual outreach and scale your top-of-funnel operations."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["SMTP_HOST", "SMTP_PORT", "SMTP_USERNAME", "SMTP_PASSWORD", "OPENAI_API_KEY"],"bins":["curl"]},"primaryEnv":"SMTP_USERNAME","emoji":"🎯"}}
---

# Cold Outreach Sequencer

This skill provides a powerful, automated agent for personalized B2B cold email outreach. It handles the entire workflow from lead research and AI-powered email generation to managing multi-day follow-up sequences and tracking engagement.

## When to activate

Activate this skill for any tasks involving cold email outreach, automated sales sequences, lead nurturing, and campaign performance analysis. It is designed to handle complex, multi-step outreach strategies that require personalization and persistence.

- **Keywords:** cold email, outreach automation, sales sequence, lead generation, follow-up campaign, prospect nurturing, email marketing, B2B sales, lead pipeline, engagement tracking, reply management, A/B testing emails, personalized messaging, sales development, automated prospecting, campaign analytics, lead scoring, drip campaign.
- **Scenarios:**
    - "Launch a personalized cold email campaign to 500 new startup CTOs."
    - "Create a 4-step follow-up sequence for leads who attended our webinar."
    - "Track open rates, click-through rates, and reply rates for the Q2 sales campaign."
    - "Automatically stop the sequence for any lead who replies or books a meeting."
    - "Generate a weekly performance report on our outbound prospecting efforts."
    - "Enrich our list of 1,000 conference attendees with personalized icebreakers."
    - "A/B test two different email subject lines for our new feature announcement."
    - "Find all leads in the 'Interested' stage and send them a case study."
    - "Pause all sequences for leads from Acme Corp for the next two weeks."
    - "Export a list of all engaged leads from the last 30 days for our sales team."
    - "Set up a webhook to notify our CRM whenever a lead is marked as 'Meeting Booked'.'''
    - "Draft a new email template focused on our recent Series B funding announcement."

## Required credentials

- `SMTP_HOST` — The hostname of the SMTP server (e.g., `smtp.gmail.com`).
- `SMTP_PORT` — The port of the SMTP server (e.g., `587`).
- `SMTP_USERNAME` — The username for the SMTP server.
- `SMTP_PASSWORD` — The password for the SMTP server.
- `OPENAI_API_KEY` — An OpenAI API key for email personalization.

If any of these environment variables are not set, instruct the user to configure them and stop.

## Helper script

Use `scripts/cold_outreach_api.py` for convenient, high-level operations:

```bash
python scripts/cold_outreach_api.py <command> [args]
```

| Command | Description |
|---|---|
| `import-leads --file-path PATH` | Import leads from a CSV file. |
| `research-lead --lead-id ID` | Research a lead to enrich their profile with AI. |
| `generate-email --lead-id ID --template-id ID` | Generate a personalized email for a lead. |
| `send-email --lead-id ID --email-id ID` | Send a specific email to a lead. |
| `start-sequence --lead-id ID --sequence-id ID` | Start a follow-up sequence for a lead. |
| `check-replies` | Check for replies to ongoing sequences via IMAP/SMTP. |
| `generate-report` | Generate a report on campaign performance. |
| `manage-templates --action [create|list|update|delete]` | Manage email templates for campaigns. |
| `pause-sequence --lead-id ID` | Pause a follow-up sequence for a specific lead. |
| `resume-sequence --lead-id ID` | Resume a paused follow-up sequence for a lead. |
| `export-metrics --format [csv|json]` | Export engagement metrics for analysis. |

## Workflow

This skill orchestrates local data stores, AI models, and email protocols to deliver a comprehensive outreach workflow.

### 1. List and Search Campaigns
**Action:** Search for campaigns by name or status.
```bash
curl -X GET "http://localhost:8000/campaigns?status=active&name=Q3_Product_Launch"
```

### 2. Get Campaign Analytics
**Action:** Retrieve detailed analytics for a specific campaign.
```bash
curl -X GET "http://localhost:8000/campaigns/campaign_789/analytics"
```

### 3. Bulk Update Lead Status
**Action:** Update the status for multiple leads at once.
```bash
curl -X POST "http://localhost:8000/leads/bulk-update" \
  -H "Content-Type: application/json" \
  -d '''{
    "lead_ids": ["lead_123", "lead_456"],
    "status": "Not Interested"
  }'''
```

### 4. A/B Test Email Templates
**Action:** Initiate an A/B test between two email templates for a campaign.
```bash
curl -X POST "http://localhost:8000/campaigns/campaign_789/ab-test" \
  -H "Content-Type: application/json" \
  -d '''{
    "template_a_id": "template_abc",
    "template_b_id": "template_def",
    "split_ratio": 0.5
  }'''
```

## Pagination

For endpoints that return a list of items (e.g., leads, campaigns), use the `page` and `per_page` query parameters to navigate through the results. The `total_pages` and `total_items` fields in the response body provide the necessary metadata for iteration.

**Example: Get the second page of leads, with 50 leads per page**
```bash
curl -X GET "http://localhost:8000/leads?page=2&per_page=50"
```

**Response Body:**
```json
{
  "page": 2,
  "per_page": 50,
  "total_pages": 20,
  "total_items": 1000,
  "items": [
    { "lead_id": "lead_051", "name": "...", ... },
    { "lead_id": "lead_052", "name": "...", ... }
  ]
}
```

## Webhook setup

Automate workflows by receiving notifications on key events. The API supports webhooks for lead replies, unsubscribes, and status changes.

### 1. Create a Webhook
```bash
curl -X POST "http://localhost:8000/webhooks" \
  -H "Content-Type: application/json" \
  -d '''{
    "target_url": "https://my-crm.com/api/lead-event",
    "event": "lead.replied"
  }'''
```

### 2. List Active Webhooks
```bash
curl -X GET "http://localhost:8000/webhooks"
```

### 3. Delete a Webhook
```bash
curl -X DELETE "http://localhost:8000/webhooks/hook_123"
```

## Multi-step workflows

### 1. New Client Onboarding Sequence
This workflow automates the initial onboarding for new clients, ensuring they receive critical information and feel welcomed.
1.  **Trigger:** A new client is added with the `client_onboarding` tag.
2.  **Action 1:** `start-sequence` is called with the client's ID and the onboarding sequence ID.
3.  **Action 2:** The sequence sends a welcome email, followed by emails with setup guides, best practices, and a link to book a training call over 10 days.
4.  **Action 3:** `check-replies` monitors for questions, automatically pausing the sequence and notifying the account manager if a reply is detected.

### 2. Weekly Campaign Performance Reporting
This workflow provides stakeholders with a regular summary of all active outreach campaigns.
1.  **Trigger:** Scheduled task runs every Monday at 9 AM.
2.  **Action 1:** `generate-report --format json` is executed for all active campaigns.
3.  **Action 2:** The script aggregates the JSON outputs, calculating total sends, opens, replies, and meetings booked across all campaigns.
4.  **Action 3:** The aggregated data is formatted into a summary email and sent to the sales leadership team.

## Real-world use cases

- **Startup Scaling Sales:** A SaaS startup uses this skill to contact 1,000 potential customers per week, A/B testing value propositions to find the most effective messaging for different industry verticals.
- **Recruiting Top Talent:** A tech recruiter automates outreach to passive candidates on LinkedIn, using personalized messages that reference their specific skills and project history to achieve a high reply rate.
- **Event Promotion:** A marketing team promotes an upcoming webinar by sending a 3-step email sequence to a list of past attendees, with automated reminders and a final "last chance to register" email.
- **Real Estate Prospecting:** A real estate agent nurtures a list of potential home buyers with automated monthly market updates and new property listings relevant to their stated interests.
- **VC Deal Sourcing:** A venture capital firm automates its deal sourcing by reaching out to founders of interesting companies discovered on tech news sites, personalizing each email with a note about their recent launch or funding round.

## Output format

Responses are structured in JSON to provide clear, machine-readable feedback. For list operations, results are paginated.

**Success Response (Single Item):**
```json
{
  "ok": true,
  "action": "email_sent",
  "lead_id": "lead_123",
  "email_id": "email_456",
  "status": "completed",
  "message": "Email sent successfully to Jane Doe."
}
```

**Success Response (List):**
```json
{
  "ok": true,
  "action": "list_leads",
  "data": {
    "page": 1,
    "per_page": 10,
    "total_items": 150,
    "items": [
      { "lead_id": "lead_123", "name": "Jane Doe", "status": "active_sequence" }
    ]
  }
}
```

## Guardrails

- **Credential Security:** Never expose SMTP or API credentials in logs or outputs. Use environment variables exclusively.
- **Data Privacy:** Do not process or store personally identifiable information (PII) beyond what is necessary for the outreach campaign.
- **CAN-SPAM Compliance:** Always include a clear and functional unsubscribe link in every email.
- **Respect Unsubscribes:** Immediately honor all unsubscribe requests by permanently removing the lead from all mailing lists.
- **Avoid Spam Traps:** Use a reputable email validation service to clean your lead list before importing to reduce bounce rates.
- **Personalization is Key:** Do not send generic, unpersonalized emails. The goal is value-driven communication, not spam.
- **Rate Limit Adherence:** Monitor and respect the sending limits of your SMTP provider to protect your domain reputation.
- **Lead Engagement Rules:** Automatically pause sequences for any lead that replies to an email to allow for manual, human conversation.
- **Throttling:** Implement a gradual ramp-up for new campaigns (e.g., 50 sends/day, then 100, etc.) to warm up your email domain.

## Rate limits

This skill orchestrates multiple services, each with its own rate limits. Adhere to the most restrictive limits to ensure stability.
- **OpenAI API:** Default limits for `gpt-4.1-mini` are typically around 600 requests per minute. Research and personalization calls should be staggered.
- **SMTP Provider:** Limits vary widely (e.g., Gmail allows ~500 emails/day, while a dedicated service like SendGrid may allow 100,000+). Check your provider's specific limits and configure sending velocity accordingly.
- **Internal API:** The local helper script API is not rate-limited, but be mindful of system resources (CPU, memory) during large data operations like bulk imports.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `smtp_authentication_error` | Invalid SMTP credentials. | Verify `SMTP_USERNAME` and `SMTP_PASSWORD` are correct. Check for IP whitelisting rules. |
| `openai_api_error` | Invalid OpenAI API key or service outage. | Confirm the `OPENAI_API_KEY` is valid and check the OpenAI status page. |
| `lead_not_found` | The specified lead ID does not exist. | Verify the lead ID is correct and exists in the database. |
| `template_not_found` | The specified template ID does not exist. | Check the template ID. Use `manage-templates --action list` to see available templates. |
| `invalid_csv_format` | CSV file is missing required columns or has malformed data. | Ensure the CSV has `first_name`, `last_name`, `company_name`, and `email` columns. |
| `smtp_sending_failed` | SMTP provider rejected the email (e.g., due to spam content, invalid recipient). | Check the recipient email address for typos. Review email content against spam filters. |
| `rate_limit_exceeded` | Too many requests sent to an external API (OpenAI, SMTP) in a short period. | Implement exponential backoff and retry logic. Reduce sending velocity. |
| `sequence_already_active` | `start-sequence` was called for a lead already in an active sequence. | Check the lead's status before attempting to start a new sequence. |
| `permission_denied` | Filesystem permissions prevent reading a lead file or writing a report. | Ensure the agent has read/write permissions for the `scripts/` and data directories. |
| `webhook_delivery_failed` | The webhook target URL returned a non-2xx response. | Check that the target URL is correct and the receiving server is online and functioning properly. |

## Reference files

- **`references/api-reference.md`** — Detailed documentation of the internal API endpoints and data models.
- **`references/templates-best-practices.md`** — Guide for writing effective and high-converting email templates.
