---
name: data-analyzer-template
description: A template for skills that process and analyze CSV or JSON data files.
version: 1.0.0
license: MIT
metadata: {"category": "Data Processing", "author": "Manus", "tags": ["data", "csv", "json", "analysis"]}
---

### When to Activate

Activate this skill when the user needs to perform analysis, filtering, or summarization on structured data files like CSV or JSON. It's ideal for tasks involving log analysis, sales data reporting, or filtering user datasets without modifying the original source.

### First Interaction

1. Acknowledge the user's request to analyze a data file.
2. Ask the user to provide the path to the data file (e.g., `/home/ubuntu/data/sales.csv`).
3. Confirm the file type (CSV or JSON) and the desired analysis or operation.

### Dependencies & Setup

This skill requires `jq` for JSON processing and `awk` for text and data extraction.

1. **Check for dependencies**:
   ```bash
   if ! command -v jq &> /dev/null || ! command -v awk &> /dev/null; then
       echo "Installing dependencies: jq and awk..."
       sudo apt-get update && sudo apt-get install -y jq awk
   else
       echo "Dependencies are already installed."
   fi
   ```

### Slash Commands & Workflows

**/analyze** - Perform a general analysis of the data file.
1. Identify the file type (JSON or CSV).
2. Provide a statistical summary: record count, and for numeric fields, calculate mean, median, min, and max.
3. Display the first 5 rows as a sample.

**/filter** `[COLUMN]` `[VALUE]` - Filter data based on a column value.
1. Prompt the user for the column and the value to filter by if not provided.
2. Use `jq` (for JSON) or `awk` (for CSV) to filter the records.
3. Output the filtered data to a new file named `filtered_results.txt`.
4. Inform the user of the output file location.

**/summarize** `[COLUMN]` - Summarize a specific column.
1. Prompt for the column to summarize if not provided.
2. If the column is numeric, calculate sum, average, and standard deviation.
3. If the column is categorical, count the occurrences of each unique value.
4. Present the summary in a clean, readable format.

### Automation

This skill can be automated to run periodic analyses on data files that are regularly updated. For example, generate a daily sales summary from a `sales.csv` file.

### Guardrails & Safety

- **Read-Only Operations**: The skill MUST never modify the original source data file. All outputs are written to new files.
- **File Validation**: Always verify the existence and readability of the source file before processing.
- **Error on Large Files**: If a file is excessively large (>1GB), notify the user and ask for confirmation before proceeding.

### Failure Handling

- If a file is not found, guide the user to provide the correct path.
- If a file is in an unsupported format, inform the user and list the supported formats (CSV, JSON).
- If a command fails, report the error from the underlying tool (`jq` or `awk`) to help with debugging.

### Example Prompts

- "Analyze the user activity from `/home/ubuntu/logs/app.json`."
- "Filter the sales data in `sales.csv` to show only entries from the 'North' region."
- "Summarize the 'revenue' column in the `quarterly_report.csv` file."