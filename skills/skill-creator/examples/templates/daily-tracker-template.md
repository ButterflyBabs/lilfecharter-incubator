---
name: daily-tracker
description: A template for skills that log daily activities, habits, or metrics to local JSON files.
version: 1.0.0
license: MIT
metadata: {"category": "Productivity", "tags": ["logging", "tracking", "local-storage"]}
---

### When to Activate
This skill should be activated when the user expresses a desire to track a daily activity, habit, or metric. It is ideal for prompts like "log my water intake," "track my daily reading," or "record my mood today."

### First Interaction
Upon first activation, the skill should introduce itself and clarify its function. It should prompt the user to specify what they want to track and, if applicable, the unit of measurement. For example: "I can help you log daily activities. What would you like to track? (e.g., 'water intake in glasses', 'pages read', 'mood on a scale of 1-10')."

### Dependencies & Setup
This skill is self-contained and has zero external dependencies. All data is stored in a dedicated directory `~/.openclaw-[YOUR-SKILL-NAME]/` in JSON format. The skill will automatically create this directory and the necessary files on first use, requiring no manual setup.

### Slash Commands & Workflows

**/add [value] [notes]**
Adds a new entry for the current day.
1. The skill retrieves the current date to use as the timestamp.
2. It reads the corresponding JSON data file from the local storage.
3. A new entry is appended, including the value and any optional notes.
4. The updated data is written back to the file, and a confirmation is sent to the user.

**/list [period]**
Lists all entries within a specified time frame (e.g., `7d`, `30d`, `this-month`).
1. The skill parses the period argument, defaulting to the last 7 days if not provided.
2. It reads the data file and filters entries based on the requested date range.
3. The matching entries are displayed to the user in a clean, readable format.

**/summary**
Provides a summary of the tracked activity.
1. The skill reads the entire data file for the tracked item.
2. It calculates key metrics such as the current streak, longest streak, and overall average.
3. The summary statistics are presented to the user to show their progress.

**/export [format]**
Exports all historical data in a specified format (e.g., `csv`, `json`).
1. The skill reads the complete data file.
2. It converts the data into the requested format.
3. The skill provides the user with the exported data, either as a file download or displayed directly.

### Automation
This skill can be configured to send a daily reminder to the user at a specific time, helping them maintain consistency. This can be set up via a user preference or a simple command like `/remind me at 8pm`.

### Guardrails & Safety
- All user data is stored locally, ensuring complete privacy and user control.
- Input is validated to ensure that only well-formed data is written to the log files.
- File I/O operations include error handling to prevent data corruption in case of unexpected failures.

### Failure Handling
If the data file is not found or is corrupted, the skill will notify the user and offer to create a new file or restore from a backup if available. Invalid commands will trigger a help message showing correct usage.

### Example Prompts
- "Track my daily meditation in minutes."
- "/add 20 today I felt very focused"
- "/summary of my meditation habit"
- "/list last 30 days"
- "/export as csv"