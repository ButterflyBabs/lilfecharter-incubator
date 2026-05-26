---
name: "[YOUR-SKILL-NAME]"
description: "A skill for running scheduled background tasks using OpenClaw's cron support. Includes setup/list/pause/resume commands for managing cron jobs, log files for execution history, and configurable schedules."
version: "1.0.0"
license: "MIT"
metadata: {"skill_type": "automation", "schedule": "daily", "author": "manus"}
---

### When to Activate

Activate this skill when you need to automate recurring tasks that run on a schedule, such as daily data backups, weekly report generation, or periodic system maintenance. It is ideal for tasks that need to run in the background without user intervention.

### First Interaction

The first time you use this skill, you will need to run the `/setup` command to initialize the cron job configuration. This will create the necessary log files and schedule the first run of your automated task.

### Dependencies & Setup

This skill requires no external dependencies. The core functionality relies on OpenClaw's built-in cron support.

1.  Run `/setup` to create the initial cron job schedule and log file.
2.  (Optional) Use the `/config` command to customize the schedule (e.g., changing from daily to weekly).

### Slash Commands & Workflows

**/setup**
1.  Creates a default cron job configuration file at `~/.config/[YOUR-SKILL-NAME]/schedule.cron`.
2.  Initializes an empty log file at `~/logs/[YOUR-SKILL-NAME].log`.
3.  Schedules the first job to run according to the default schedule.

**/list**
1.  Reads the current cron job schedule from the configuration file.
2.  Displays the schedule and the status of the last run.

**/pause**
1.  Comments out the cron job entry in the system's crontab.
2.  Logs the "paused" status to the skill's log file.

**/resume**
1.  Uncomments the cron job entry in the system's crontab.
2.  Logs the "resumed" status to the skill's log file.

### Automation

This skill is designed for automation. Once set up, the cron job will run automatically at the configured interval. The execution history and any output or errors will be recorded in `~/logs/[YOUR-SKILL-NAME].log`. You can configure the schedule by editing `~/.config/[YOUR-SKILL-NAME]/schedule.cron`.

### Guardrails & Safety

- The skill will not execute if the configuration file is missing or corrupted.
- All shell commands are executed with restricted permissions to prevent unintended system modifications.
- The log file has a maximum size limit to prevent disk space issues.

### Failure Handling

If a scheduled task fails, the error will be logged to `~/logs/[YOUR-SKILL-NAME].log` with a timestamp and a detailed error message. The skill will attempt to run the task again at the next scheduled interval. For repeated failures, you will be notified via a system alert.

### Example Prompts

- "Set up a daily backup for my project files."
- "List all the automated tasks that are currently running."
- "Pause the weekly report generation task."
- "Resume the cache cleanup job."
