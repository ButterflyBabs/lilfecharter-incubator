---
name: social-media-template
description: A template for skills that manage social media posting and analytics via platform APIs.
version: 1.0.0
license: MIT
metadata: {"author":"Manus","tags":["social-media","api","automation"],"platforms":["twitter","instagram","linkedin"]}
---

### When to Activate

This skill should be activated when the user wants to perform actions related to social media management, such as posting content, scheduling posts, or retrieving analytics. It is designed to interact with platforms like Twitter/X, Instagram, and LinkedIn.

### First Interaction

On first use, the skill should guide the user through the authentication process for their desired social media platforms. It will prompt for API keys and store them securely as environment variables.

### Dependencies & Setup

This skill requires `curl` for making API requests and `jq` for parsing JSON responses.

1.  **Install Dependencies:**
    ```shell
    sudo apt-get update && sudo apt-get install -y curl jq
    ```
2.  **Configure API Keys:**
    ```shell
    export [YOUR-API-KEY-ENV-VAR]="your-api-key"
    ```
    *Replace `[YOUR-API-KEY-ENV-VAR]` with the specific environment variable for the platform (e.g., `TWITTER_API_KEY`).*

### Slash Commands & Workflows

**/post**
- **Description:** Posts content to a specified social media platform.
- **Workflow:**
    1.  Prompt the user for the platform and the content to post.
    2.  Use `curl` to send a POST request to the platform's API endpoint.
    3.  Confirm that the post was successful and provide the user with a link.

**/schedule**
- **Description:** Schedules a post for a future date and time.
- **Workflow:**
    1.  Prompt for the platform, content, and desired publication time.
    2.  Validate the date/time format.
    3.  Use the platform's scheduling API to create the post.
    4.  Confirm the scheduled time with the user.

**/analytics**
- **Description:** Retrieves engagement metrics for a specific post or account.
- **Workflow:**
    1.  Ask the user for the platform and the post/account identifier.
    2.  Fetch data from the analytics API endpoint.
    3.  Use `jq` to parse key metrics (likes, shares, comments).
    4.  Present the analytics to the user in a clear, readable format.

### Automation

This skill can be automated to post content from a pre-defined content calendar (e.g., a CSV file) or to generate weekly analytics reports.

### Guardrails & Safety

-   The skill will never store user credentials directly. It will only use environment variables for API keys.
-   Rate limiting will be implemented to avoid exceeding API quotas.
-   All user-provided content will be treated as sensitive data.

### Failure Handling

If an API request fails, the skill will parse the error message from the platform and provide a clear explanation to the user. It will suggest common solutions, such as checking API key validity or network connectivity.

### Example Prompts

-   "Post 'Hello World!' to my Twitter account."
-   "Schedule a post for next Monday at 9 AM on LinkedIn."
-   "Show me the analytics for my latest Instagram post."
