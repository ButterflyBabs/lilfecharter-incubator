---
name: finance-template
description: A template for skills that handle invoicing, expense tracking, and budget management.
version: 1.0.0
license: MIT
metadata: {"category": "finance", "author": "OpenClaw", "storage": "local_json"}
---

### When to Activate

This skill should be activated when the user wants to perform financial tasks such as creating invoices, tracking expenses, or generating budget reports. It is suitable for freelancers, small teams, or personal finance management.

### First Interaction

When activated for the first time, the skill should create a hidden directory `~/.openclaw-finance/` to store all financial data in JSON files (e.g., `invoices.json`, `expenses.json`). It should then inform the user that the setup is complete and provide a brief overview of the available commands.

### Dependencies & Setup

This skill requires `jq` to be installed for JSON manipulation. The setup process involves checking for `jq` and creating the necessary data directory and files.

1.  **Check for `jq`:** Run `command -v jq`. If not found, prompt the user to install it.
2.  **Create Data Directory:** Run `mkdir -p ~/.openclaw-finance`.
3.  **Initialize Data Files:** Run `touch ~/.openclaw-finance/expenses.json ~/.openclaw-finance/invoices.json`.

### Slash Commands & Workflows

**/add-expense**
Adds a new expense to the tracker.

1.  Prompt the user for the amount, category (e.g., travel, food), and a brief description.
2.  Read `~/.openclaw-finance/expenses.json`.
3.  Use `jq` to append a new JSON object with the expense details and a timestamp.
4.  Write the updated content back to `expenses.json`.
5.  Confirm to the user that the expense has been added.

**/create-invoice**
Generates a new invoice.

1.  Prompt for client name, itemized list of services/products with rates, and due date.
2.  Generate a unique invoice ID and append the details to `~/.openclaw-finance/invoices.json`.
3.  (Optional) Generate a simple text-based invoice file and save it.
4.  Notify the user with the invoice ID and total amount.

**/budget-report**
Generates and displays a summary of expenses and income.

1.  Prompt the user for the reporting period (e.g., this month, last month).
2.  Read `expenses.json` and `invoices.json`.
3.  Use `jq` to filter entries for the specified period and calculate totals.
4.  Display a formatted summary in the chat.

### Guardrails & Safety

-   All financial data is stored locally on the user's machine, ensuring privacy.
-   The skill should validate user inputs for amounts and dates to prevent errors.
-   Backup of the `~/.openclaw-finance/` directory is recommended; the skill can include a `/backup` command.

### Failure Handling

If `jq` is not found, the skill should guide the user on how to install it. If data files are corrupted, the skill should attempt to recover from a backup if available, or notify the user about the corruption.

### Example Prompts

-   "Add a new expense of $55.75 for a client dinner."
-   "Create an invoice for ClientCorp for 10 hours of consulting at $100/hour."
-   "Show me my budget report for last month."