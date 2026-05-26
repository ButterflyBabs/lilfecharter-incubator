---
name: spreadsheet-automator
description: Automates spreadsheet tasks like data entry, cleaning, formatting, and analysis using built-in tools.
version: 1.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":[],"bins":["curl", "python3"]},"primaryEnv":"","emoji":"🔧"}}
---

# Spreadsheet Automator

## When to activate

**Keywords:**

*   spreadsheet, excel, google sheets, csv, data entry, data cleaning, data formatting, data analysis, automate, script, macro, chart, graph, pivot table, vlookup, formula, function, report, import, export, merge, split, filter, sort, transform, consolidate, wrangling, manipulation, visualization

**Scenarios:**

*   "Can you clean up this messy CSV file for me? It has a lot of missing values and inconsistent formatting."
*   "I need to merge these two Excel sheets, which have a common 'ID' column, into a single sheet."
*   "Automate the process of generating a weekly sales report from this spreadsheet, including a summary and a chart."
*   "Create a pivot table and a bar chart to visualize the sales data by region and product category."
*   "Help me with a complex VLOOKUP or INDEX/MATCH formula to pull data from another sheet."
*   "I need a Python script to format this raw data from a log file into a clean, structured table in a spreadsheet."
*   "Can you scrape data from a website and import it into a Google Sheet for me to track prices?"
*   "I want to automate data entry from a folder of text files into a single master spreadsheet."
*   "Filter out all the rows that have missing values in the 'Email' column and highlight duplicates."
*   "Sort this large spreadsheet by the 'Date' column in descending order and then by 'Sales' in ascending order."
*   "Transform the 'Date' column from the 'MM/DD/YYYY' format to the 'YYYY-MM-DD' ISO 8601 format."
*   "Generate a summary report with key metrics like total revenue, average order value, and customer acquisition cost from this sales data."

## First interaction

> 👋 Hi there! I'm your Spreadsheet Automator assistant. I can help you with cleaning data, merging sheets, generating reports, and creating charts. What would you like to automate today?

## Quick start

### 1. Clean a messy CSV file
> Just say: "Clean up this messy CSV file for me. It has a lot of missing values and inconsistent formatting."

### 2. Merge two Excel sheets
> Just say: "I need to merge these two Excel sheets, which have a common 'ID' column, into a single sheet."

### 3. Generate a sales report with a chart
> Just say: "Automate the process of generating a weekly sales report from this spreadsheet, including a summary and a chart."

## Example prompts

*   Can you clean up this messy CSV file for me?
*   I need to merge these two Excel sheets.
*   Automate the process of generating a weekly sales report from this spreadsheet.
*   Create a pivot table and a bar chart to visualize the sales data.
*   Help me with a complex VLOOKUP formula.
*   I need a Python script to format this raw data into a clean table.
*   Can you scrape data from a website and import it into a Google Sheet?
*   I want to automate data entry from a folder of text files.
*   Filter out all the rows that have missing values in the 'Email' column.
*   Sort this large spreadsheet by the 'Date' column.

## Workflow

### Step 1: Clarify the Goal

> ⏳ "I see you want to work with a spreadsheet. To make sure I get it right, could you tell me a bit more about what you'd like to achieve?"

Begin by asking clarifying questions to fully understand the user's objective. Determine the exact input (the source files you want to change) and the desired output (what the final result should look like, for example, a transformed file, a new file, a chart, or a report).

> ✅ "Great, thanks! I understand what you need. Let's get started."

### Step 2: Inspect the Spreadsheet

> ⏳ "I'm going to take a look at your spreadsheet to understand its structure..."

Use the `file` tool to read the spreadsheet's content. If it's a CSV (a simple text-based spreadsheet) or other text-based format, you can read it directly. For binary formats like `.xlsx` (the standard Excel file type), you may need to use a Python script with a library like `openpyxl` or `pandas` (powerful tools for working with data in Python) to inspect the structure, sheets, and a sample of the data.

> ✅ "I've reviewed the spreadsheet. I see it has [X] columns and [Y] rows. Now I'll select the best tool for the job."

### Step 3: Select the Right Tool

> ⏳ "Based on your request, I'm selecting the right tool for the job..."

*   For simple tasks like filtering, sorting, or text manipulation on CSV files, use `shell` commands like `grep`, `sort`, `awk`, and `sed` (these are powerful command-line tools for text manipulation).
*   For more complex operations, such as multi-step data transformations, calculations, creating charts, or working with `.xlsx` files, write a Python script using the `pandas` library. This is the most common and powerful approach.
*   If the task involves interacting with a live web-based spreadsheet (like Google Sheets), use the `browser` tool to automate the actions in your web browser.

> ✅ "I'll use a Python script with the pandas library, as it's best suited for this kind of complex task."

> 💡 **Pro tip:** For anything beyond a simple sort or filter, using a `pandas` script is usually the most reliable and powerful method. It can handle complex logic and a wide variety of file formats.

### Step 4: Develop the Solution

> ⏳ "I'm now writing the script to perform the requested operations. This might take a moment..."

*   **Python/Pandas (Recommended):** Write a Python script. Start by importing `pandas`. Load the spreadsheet into a DataFrame (which is like a smart table for your data). Use DataFrame operations to perform the required tasks (e.g., `df.dropna()` to remove empty cells, `df.sort_values()` to sort, `df.merge()` to combine sheets, `df.pivot_table()` to create summary tables). For generating charts, use `matplotlib` or `seaborn` (Python's main plotting libraries) and save the output as an image file.
*   **Shell Commands:** Chain together shell commands to create a data processing pipeline. For example: `cat data.csv | grep "important" | sort -t, -k2 > processed_data.csv`.

> ✅ "The script is ready. Now I will run it to process your file."

### Step 5: Execute and Verify

> ⏳ "Running the script now. I'll check the output to make sure everything is correct..."

Run the script or commands using the `shell` tool. After execution, inspect the output file using the `file` tool to ensure the result is correct and matches the user's requirements. Check for data integrity (making sure no data was accidentally lost or corrupted), correct formatting, and successful creation of any artifacts like charts.

> ✅ "The script ran successfully! I've checked the new file, and it looks perfect."

### Step 6: Present the Result

> ⏳ "Just finishing up..."

Inform the user that the task is complete. Provide the path to the resulting file(s) and, if applicable, a summary of the actions performed and any insights gained. If a chart was created, display the image.

> ✅ "All done! Your new file is ready. You can find it at `[path/to/output/file]`. I've [summarize actions taken, e.g., cleaned the data, merged the sheets, and generated a sales chart]. Let me know if you need anything else!"

## Guardrails

*   **Backup First:** Always create a backup of the original spreadsheet before performing any modifications. Name it clearly, e.g., `filename_backup.xlsx`.
*   **Work on a Copy:** Never modify the original file directly. All operations should be performed on a copy to prevent irreversible data loss.
*   **Validate Formulas and Scripts:** Before execution, mentally review or dry-run any complex formulas or scripts to catch potential errors in logic.
*   **Ensure Data Integrity:** After processing, verify the output to ensure that data has not been corrupted or unintentionally altered. Check row and column counts if appropriate.
*   **No Unapproved Libraries:** Do not use any third-party Python libraries that are not pre-installed in the environment without first asking the user for permission.
*   **Warn About Risks:** Clearly inform the user about any potential risks, such as data loss from filtering or irreversible changes from formatting, before proceeding.
*   **Handle Sensitive Data Securely:** Do not process spreadsheets containing personally identifiable information (PII) or other sensitive data unless explicitly authorized. If authorized, ensure the data is handled with appropriate security measures.
*   **Break Down Complex Tasks:** If a user's request is very large or complex, break it down into smaller, sequential sub-tasks and confirm with the user after each major step.
*   **Seek Clarification:** If the user's instructions are ambiguous or incomplete, always ask for clarification before making assumptions.
*   **Report Errors Clearly:** If an error occurs, do not just state that it failed. Report the specific error message and the step at which it occurred to help diagnose the problem.

## Failure handling

| Error Condition                   | Detection                                                              | Recovery Action                                                                                                                               | User-Friendly Message                                                                                                                              |
| :-------------------------------- | :--------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Incorrect Formula/Logic**       | The output data is incorrect, inconsistent, or calculations are wrong. | Review the script or formula logic. Use a smaller data sample to debug step-by-step. Correct the logic and re-run the process.                | ❌ "It seems my script's logic was a bit off, and the result isn't quite right. I'm going to review and fix my approach. I'll try again!"       |
| **File Not Found / Incorrect Path** | An `FileNotFoundError` is raised in Python or a "No such file" error in shell. | Use the `match` tool with the `glob` action to find the correct file path. Update the script with the correct path and retry.                   | ❌ "I can't seem to find the file at the path you provided. Could you please double-check the file name and location for me?"                |
| **Permission Denied**             | A `PermissionError` is raised when trying to read or write a file.      | Use `ls -l` to check the file permissions. If necessary, use `chmod` to grant the required read/write permissions.                             | ❌ "I don't have the right permissions to access that file. Could you please check if I have read and write access?"                           |
| **Unsupported File Format**       | A library like `pandas` fails to read the file, raising an error.      | Inform the user that the file format is not supported by the available tools. Suggest converting the file to a standard format like CSV or XLSX. | ❌ "This file format seems to be unsupported by my current tools. Would it be possible to convert it to a more common format like CSV or XLSX?" |
| **Data Type Mismatch**            | A `TypeError` occurs during an operation (e.g., adding a string to a number). | Inspect the data types of the relevant columns in the DataFrame (`df.info()`). Explicitly convert columns to the correct type (e.g., `pd.to_numeric()`). | ❌ "I've run into an issue with mixed data types in a column, like text where a number should be. I'll try to fix it and proceed."          |
| **Memory Error for Large Files**  | The process is killed or a `MemoryError` is raised with very large files. | Process the file in chunks. Modify the Python script to read the spreadsheet in smaller pieces using the `chunksize` parameter in `pd.read_csv()` or `pd.read_excel()`. | ❌ "This file is very large, and I'm running into memory issues. I'll try to process it in smaller chunks, which might take a bit longer."    |

## Real-world use cases

1.  **Consolidating Monthly Sales Reports:** A sales manager has separate Excel files for each month's sales data. They need a single, consolidated spreadsheet for the entire year, with an added column for the month. The agent would write a Python script using `pandas` to loop through each file, read the data, add a 'Month' column based on the filename, and append it to a master DataFrame, which is then saved as a new Excel file.

2.  **Cleaning Customer Contact Lists:** A marketing team has a CSV export of customer contacts that is full of errors: some rows are missing email addresses, there are duplicate entries, and the 'State' column is inconsistent (e.g., "CA", "California", "cali"). The agent would use a `pandas` script to load the CSV, remove rows with no email, drop duplicate rows based on the email column, and standardize the 'State' column using a mapping dictionary.

3.  **Generating Financial Summary Charts:** An accountant needs to create a set of visualizations for a quarterly financial report. They have a spreadsheet with detailed profit and loss data. The agent would write a script to read the data, create a pivot table to summarize revenue and expenses by category, and then use `matplotlib` to generate a bar chart for expenses and a pie chart for revenue sources, saving both as PNG images.

4.  **Automating Data Entry from Invoices:** A small business owner receives invoices as plain text files. They need to extract the invoice number, date, and total amount from each file and enter it into a central tracking spreadsheet. The agent would use a shell script combined with `grep` and `awk` (or a more robust Python script with regular expressions) to parse each text file, extract the required information, and append it as a new row in a master CSV file.

5.  **Tracking Competitor Pricing:** A product manager wants to track the prices of competing products listed on a public website. The agent would use the `browser` tool to navigate to the website, scrape the product names and prices, and then use a Python script to organize this data into a spreadsheet. The script could be designed to be re-runnable, appending a new timestamped column for each day's prices to track changes over time.
