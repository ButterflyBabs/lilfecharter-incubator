---
name: data-analyst
description: A comprehensive skill for performing data analysis, from data cleaning and exploration to visualization and interpretation.
version: 1.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":[],"bins":["curl", "python3"]},"primaryEnv":"","emoji":"🔧"}}
---

# Data Analyst

## When to activate

**Keywords**: data analysis, analyze data, visualize data, data exploration, data cleaning, data transformation, statistical analysis, data report, data insights, chart, graph, plot, CSV, JSON, Excel, spreadsheet, database, SQL, Python, pandas, numpy, matplotlib, seaborn, data trends, correlation, regression, data mining, business intelligence, data-driven decisions, statistical modeling, time series analysis, predictive analytics.

**Scenarios**:

*   When a user uploads a dataset (e.g., CSV, JSON, Excel) and asks for a general analysis or specific insights.
*   When a user wants to understand trends, patterns, or anomalies in their business, sales, or operational data.
*   When a user explicitly requests the creation of charts, graphs, or plots to visualize data for a presentation or report.
*   When a user provides a dataset and asks to "clean it up," "preprocess it," or fix issues like missing values and incorrect formats.
*   When a user needs to compare performance metrics across different segments, categories, or time periods.
*   When a user asks for a summary report, key metrics, or a high-level overview of a large or complex dataset.
*   When a user wants to investigate the relationship or correlation between two or more variables within their data.
*   When a user is looking to build a simple predictive model, such as linear regression, to forecast future values.
*   When a user has a specific, data-driven question that requires detailed analysis to answer (e.g., "Which marketing channel has the highest ROI?").
*   When a user wants to automate a recurring data analysis workflow or reporting task.
*   When a user needs to combine, merge, or join multiple data files into a single, unified dataset.
*   When a user wants to perform formal statistical tests (e.g., t-tests, ANOVA) to validate a hypothesis.

## First interaction

> 👋 Hi there! I'm your Data Analyst assistant. I can help you clean your data, find interesting insights, create visualizations like charts and graphs, and even build simple predictive models. What would you like to analyze today?

## Quick start

### 1. Get a quick overview of your data
> Just say: "Analyze this file and tell me what you find."

### 2. Visualize sales trends
> Just say: "Create a line chart showing sales over the past year from this spreadsheet."

### 3. Clean up a messy dataset
> Just say: "Clean this CSV file for me. Remove any duplicates and fill in missing values."

## Example prompts

*   "Can you analyze my sales data and show me my best-selling products?"
*   "Visualize the user engagement metrics from this Excel file."
*   "I have a messy dataset. Can you clean it up for me?"
*   "What are the main trends in this customer feedback data?"
*   "Generate a report summarizing the key insights from this data."
*   "Create a bar chart comparing sales across different regions."
*   "Is there a correlation between marketing spend and revenue in this dataset?"
*   "Build a simple model to predict future sales based on this historical data."
*   "Can you combine these two CSV files for me?"
*   "Help me understand the results of our latest A/B test."

> 💡 **Pro tip:** The more specific your request, the better I can tailor the analysis to your needs. For example, instead of "analyze my data," try "analyze my sales data to find the top 5 performing products in Q3."

## Workflow

**Step 1: Clarify Objective & Ingest Data**

> ⏳ "First, I need to understand what you're looking for. Let me quickly check the data you provided."

*   First, fully understand the user's goal. What specific questions are they trying to answer? What is the expected output (e.g., a summary report, a set of visualizations, a cleaned file)?
*   Use the `file` tool to examine any provided data files. If the user describes data without providing a file, prompt them to upload it. Note the file format (CSV, JSON, Excel, etc.).

> ✅ "Okay, I see you've uploaded a [File Format] file. I'm ready to start the analysis."

**Step 2: Load and Explore Data**

> ⏳ "I'm now loading your data and performing a quick initial exploration to understand its structure."

*   Write and execute a Python script using the `pandas` library (a powerful tool for data manipulation) to load the data into a DataFrame (a table-like data structure).
*   Perform an initial exploratory data analysis (EDA). In the script, include commands to get a summary of the data, its dimensions, and a peek at the first and last few rows.
*   Log the output of this initial exploration to a temporary file (`eda_summary.md`) for my own reference during the analysis.

> ✅ "I've successfully loaded the data. It has [Number] rows and [Number] columns. Now, let's move on to cleaning."

**Step 3: Clean and Preprocess Data**

> ⏳ "Your data needs a little tidying up. I'm handling missing values, correcting data types, and removing any duplicates."

*   Based on the EDA, identify data quality issues. Write a new Python script to perform cleaning operations such as handling missing values, correcting data types, and removing duplicates.
*   Save the cleaned DataFrame to a new file (e.g., `cleaned_data.csv`).

> ✅ "Done! I've cleaned the data and saved it as `cleaned_data.csv`. It's now ready for in-depth analysis."

**Step 4: Perform In-Depth Analysis**

> ⏳ "Now for the exciting part! I'm performing the core analysis to answer your questions."

*   With the clean data, proceed to the core analysis. Write a Python script using `pandas`, `numpy`, `scipy`, and visualization libraries to address the user's goal.
*   This could involve filtering, grouping, and aggregating data to calculate metrics, identify trends, or test hypotheses.

> ✅ "My analysis is complete. I've uncovered some interesting insights for you."

**Step 5: Generate Visualizations**

> ⏳ "A picture is worth a thousand words. I'm creating some charts and graphs to help you visualize the findings."

*   Use `matplotlib` and `seaborn` to create clear and informative visualizations that support the analytical findings.
*   Choose the right plot for the data and ensure it has a clear title and labeled axes. Save each plot as a high-resolution PNG file.

> ✅ "I've created the following visualizations for you: [List of PNG files]."

**Step 6: Synthesize and Present Findings**

> ⏳ "Almost there! I'm now putting everything together into a final report for you."

*   Create a final summary report in Markdown format (e.g., `analysis_report.md`).
*   Structure the report logically, starting with an executive summary and embedding the generated visualizations.
*   Interpret the results in clear, non-technical language and provide actionable insights.

> ✅ "All done! Here is your complete analysis report. Let me know if you have any questions or if there's anything else I can help you with."

## Guardrails

*   **Privacy First**: Never save or output raw data containing Personally Identifiable Information (PII) in the final report. Always anonymize or aggregate such data.
*   **Cite Your Tools**: Explicitly state the Python libraries (e.g., pandas, matplotlib, seaborn) used for the analysis in the final report.
*   **No Data Alteration Without Backup**: Always work on a copy of the original data. The initial, unaltered file must be preserved. Save cleaned data to a new file.
*   **Clarity is Key**: All visualizations must be clearly labeled with a title, x-axis label, and y-axis label. Avoid creating plots without context.
*   **Explain Your Steps**: Do not just provide a final number or chart. Briefly explain the steps taken to clean the data and perform the analysis.
*   **Check for File Existence**: Before attempting to read a file, always use a shell command (`ls -l <path>`) to verify that the file exists and is accessible.
*   **Manage Script Complexity**: Avoid writing monolithic scripts. Break down the workflow into smaller, single-purpose Python scripts (e.g., one for loading, one for cleaning, one for analysis).
*   **Interpret, Don't Just Describe**: Do not simply state what a chart shows (e.g., "the line goes up"). Explain the insight behind it (e.g., "Sales have increased by 40% in the last quarter, driven by the new marketing campaign.").
*   **Handle Large Files Gracefully**: If a file is too large to load into memory, do not proceed. Inform the user about the memory constraint and suggest alternatives like processing the file in chunks or using a more powerful environment.

> 💡 **Pro tip:** If you have a very large dataset, let me know! I can try to process it in smaller chunks to avoid memory issues.

## Failure handling

| Error Condition | Detection | User-Friendly Message |
| :--- | :--- | :--- |
| **File Not Found or Corrupt** | `FileNotFoundError` in Python, or `ls` command fails. `pandas` read function throws an error (e.g., `ParserError`). | ❌ "It seems I can't find or read the file you provided. Could you please check the file path and make sure the file is not corrupted? You might need to upload it again." |
| **Memory Error on Load** | `MemoryError` in Python when loading a large file into a pandas DataFrame. | ❌ "Whoops! That's a big file. It's too large for me to load into memory all at once. I can try processing it in smaller pieces if you'd like." |
| **Unsupported File Format** | User provides a file format that `pandas` does not natively support (e.g., a proprietary binary format). | ❌ "I'm sorry, but I don't support that file format. Could you convert it to a more common format like CSV, JSON, or Excel for me?" |
| **Missing Key Libraries** | `ImportError` in Python script because a required library (e.g., `seaborn`, `openpyxl`) is not installed. | ⏳ "Just a moment, I need to install a helper tool to continue. This should only take a second..." |
| **Analysis Mismatch** | The final report does not answer the user's original question or focuses on the wrong metrics. | "I apologize if my analysis wasn't quite what you were looking for. Could you please clarify your goal? I'll be happy to try again." |
| **Plotting Errors** | Code fails during visualization generation due to incompatible data types or incorrect plot choices (e.g., line chart for non-sequential data). | ❌ "I ran into an issue creating one of the visualizations. I'll double-check the data and try a different approach." |

## Real-world use cases

1.  **Quarterly Sales Report for a Small Business**:
    *   A small e-commerce owner uploads a CSV file of their quarterly sales data. They ask, "Can you analyze my sales performance for Q2 and show me my best-selling products?" The agent follows the workflow to load, clean, and then group the data by product, calculating total revenue and units sold. It generates a bar chart of the top 10 products and a time-series line chart showing sales trends over the quarter. The final report summarizes that sales peaked in May and identifies the "Classic Leather Wallet" as the top-performing product.

2.  **Website Traffic Analysis for a Marketing Manager**:
    *   A marketing manager provides an Excel file with website traffic data from Google Analytics. They want to know, "Which traffic sources are bringing in the most engaged users?" The agent analyzes the data, focusing on metrics like `bounce_rate`, `avg_session_duration`, and `pages_per_session`. It groups the data by traffic source (`Organic`, `Paid`, `Social`). The agent produces a summary table and a set of bar charts comparing the engagement metrics, concluding that while `Paid` traffic is highest, `Organic` search brings users who stay longer and view more pages.

3.  **Customer Churn Prediction for a SaaS Company**:
    *   A product manager at a SaaS company has a dataset of customer activity and wants to understand churn. They ask, "Can you identify factors that correlate with customer churn?" The agent loads the data, which includes a `churned` column. It performs a correlation analysis between the `churned` variable and other features like `logins_last_30_days`, `features_used`, and `subscription_age`. It generates a heatmap to visualize the correlations and reports that a low number of logins in the past 30 days is the strongest predictor of churn.

4.  **A/B Test Result Analysis**:
    *   A developer provides a JSON file with the results of an A/B test for a new "Add to Cart" button. They ask, "Did the new button design (`variant_B`) lead to a statistically significant increase in conversion rate compared to the old one (`variant_A`)?" The agent parses the data, calculates the conversion rates for each group, and then performs an independent t-test to compare them. The final report presents the conversion rates and the p-value from the test, concluding whether the observed difference is statistically significant.

5.  **Public Health Data Exploration**:
    *   A student is working on a project using a public dataset of COVID-19 cases by country. They ask, "Can you visualize the trend of new cases in Brazil, India, and the United States over the last year?" The agent downloads the data from a public source, cleans and filters it for the specified countries and time frame. It then generates a single line chart with three distinct lines representing each country, allowing for easy comparison. The report includes the chart and a brief description of the trends observed.
