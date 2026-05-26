---
name: monitor-template
description: A template for skills that watch endpoints or conditions and trigger alerts.
version: 1.0.0
license: MIT
metadata: {"dependencies": ["curl", "jq"], "use_cases": ["website uptime", "stock price alerts", "server health checks"]}
---

### When to Activate

Activate this skill when you need to monitor a URL endpoint, an API response, or any condition that can be checked via a shell command and trigger alerts based on the result. This is ideal for tasks like checking website uptime, tracking a value from a JSON API, or monitoring server health endpoints.

### First Interaction

> **User**: "Monitor the status of `https://api.example.com/health` and alert me if the `status` field is not 'ok'."
> **Manus**: "Understood. I will set up a monitor for `https://api.example.com/health` to check the `status` field. How often should I check (e.g., every 5 minutes, every hour)?"

### Dependencies & Setup

This skill requires `curl` for making HTTP requests and `jq` for parsing JSON responses. A directory is needed to store monitor configurations.

1.  Ensure `curl` and `jq` are installed: `sudo apt-get update && sudo apt-get install -y curl jq`
2.  Create a directory for monitor configurations: `mkdir -p ~/.config/[YOUR-SKILL-NAME]/monitors`
3.  Create a log file for status history: `touch /var/log/[YOUR-SKILL-NAME].log`

### Slash Commands & Workflows

**/add-monitor** `<name> <url> <json_path> <expected_value> <frequency>`
Adds a new endpoint to monitor.
1.  Generate a unique ID and create a config file at `~/.config/[YOUR-SKILL-NAME]/monitors/<name>.json` with the URL, path, and value.
2.  Add a new cron job that runs `/check-monitor <name>` at the specified frequency (e.g., `*/5 * * * *`).
3.  Confirm to the user that the monitor for `<name>` has been successfully created.

**/list-monitors**
Lists all active monitors.
1.  Read all `.json` files from the `~/.config/[YOUR-SKILL-NAME]/monitors/` directory.
2.  Parse each file to extract the monitor's name, URL, and frequency.
3.  Display the details in a formatted table to the user.

**/check-monitor** `<name>`
Manually triggers a check for a specific monitor.
1.  Read the configuration from `~/.config/[YOUR-SKILL-NAME]/monitors/<name>.json`.
2.  Execute `curl -s <url> | jq -r '<json_path>'` to get the current value.
3.  Compare the current value with the `<expected_value>`. If it does not match, trigger an alert.
4.  Append the check result and timestamp to `/var/log/[YOUR-SKILL-NAME].log`.

**/remove-monitor** `<name>`
Removes an existing monitor.
1.  Delete the corresponding config file: `rm ~/.config/[YOUR-SKILL-NAME]/monitors/<name>.json`.
2.  Remove the associated cron job that runs the check.
3.  Confirm to the user that the monitor has been removed.

### Automation

Automation is handled via cron jobs. Each monitor runs on its own schedule, executing the `/check-monitor` command. If a check fails, the skill should be configured to send a notification to the user through a pre-defined channel (e.g., email, chat). Status history is maintained in a log file for auditing.

### Guardrails & Safety

-   Validate URLs to ensure they are well-formed and point to HTTP/HTTPS endpoints.
-   Enforce a minimum check frequency (e.g., 1 minute) to prevent abuse or overwhelming the target service.
-   Sanitize all user inputs, especially the `<name>` parameter, to prevent path traversal or command injection vulnerabilities.
-   Ensure the cron jobs are run with appropriate permissions and cannot modify critical system files.

### Failure Handling

-   If a `curl` command fails due to network issues, log the error and retry up to 3 times before sending an alert.
-   If `jq` fails to parse the response, it may indicate an API change. Log the invalid JSON and notify the user.
-   If a configuration file is malformed or missing, the command should fail gracefully with a clear error message.

### Example Prompts

-   "Set up a monitor to check if `https://my-api.com/v1/status` has a `healthy` field equal to `true`. Check it every 15 minutes."
-   "Show me all the monitors I have running right now."
-   "Please remove the uptime monitor for my blog."
-   "Manually run the check for the 'api-health' monitor."