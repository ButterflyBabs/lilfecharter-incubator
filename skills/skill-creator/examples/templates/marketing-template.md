---
name: marketing-template
description: A template for skills that manage marketing campaigns, lead tracking, and funnel analytics via CRM or marketing platform APIs.
version: 0.1.0
license: MIT
metadata: {"skill_type": "marketing", "dependencies": ["curl", "jq"], "platforms": ["HubSpot", "Mailchimp", "Custom CRM"]}
---

### When to Activate

This skill should be activated when a user wants to manage marketing campaigns, track leads, or analyze marketing funnels. It is designed to interact with CRM and marketing automation platforms.

### First Interaction

On first use, the skill should greet the user and check if the required API keys and platform endpoints are configured. It can guide the user through the setup process if needed.

### Dependencies & Setup

This skill requires `curl` for making API requests and `jq` for parsing JSON responses. The user must set the following environment variables:
- `[YOUR-CRM-API-KEY-ENV-VAR]`: Your CRM or marketing platform API key.
- `[YOUR-CRM-ENDPOINT-ENV-VAR]`: The API endpoint URL for your platform.

### Slash Commands & Workflows

#### /create-campaign
Creates a new marketing campaign.
1.  Prompt the user for campaign name, budget, and target audience.
2.  Construct a JSON payload with the campaign details.
3.  Make a POST request to the `/campaigns` endpoint using `curl`.
4.  Confirm campaign creation and return the campaign ID.

#### /add-lead
Adds a new lead to a campaign.
1.  Prompt for lead details (name, email, source) and the campaign ID.
2.  Validate the provided email format.
3.  Make a POST request to the `/leads` endpoint with the lead data.
4.  Return the new lead's ID and status.

#### /funnel-report
Generates a marketing funnel report.
1.  Prompt the user for the campaign ID and date range.
2.  Fetch lead data and conversion events from the CRM API.
3.  Use `jq` to process the data and calculate conversion rates.
4.  Display the funnel report in a Markdown table.

### Automation

This skill can be automated to run daily funnel reports for active campaigns and send a summary to a specified channel or email address.

### Guardrails & Safety

- All API requests must use HTTPS.
- The skill should never log or store sensitive lead information (PII).
- Input from the user should be sanitized to prevent injection attacks.
- Rate limiting should be implemented to avoid overwhelming the CRM API.

### Failure Handling

If an API call fails, the skill will retry up to 3 times with exponential backoff. If it continues to fail, it will notify the user with the error message from the API.

### Example Prompts

- "Create a new marketing campaign for our spring sale."
- "Add 'john.doe@email.com' as a new lead to campaign 'SpringSale2024'."
- "Show me the funnel report for the last 30 days."