---
name: workflow-template
description: A template for skills that manage multi-step business processes with human-in-the-loop approvals.
version: 1.0.0
license: MIT
metadata: {"category": "business", "type": "workflow", "stateful": true}
---

### When to Activate

Activate this skill when a user needs to manage a process requiring multiple steps and human approvals, such as expense reports, document sign-offs, or content publishing pipelines. It is ideal for tasks where state needs to be tracked over time.

### First Interaction

The user will typically start a new workflow by providing initial data (e.g., an expense amount and description). The skill should confirm the workflow's initiation and return a unique ID for tracking.

### Dependencies & Setup

This skill is self-contained and stores workflow state in a local JSON file (`.workflow_state.json`). No external dependencies or setup are required. The state file is created automatically on the first run.

### Slash Commands & Workflows

**/start <params>...**
1. Generate a unique ID for the new workflow.
2. Create a new entry in `.workflow_state.json` with status "pending" and initial data.
3. Log the creation event in the workflow's audit trail.
4. Confirm to the user that the workflow has started and provide the ID.

**/status <workflow_id>**
1. Read the `.workflow_state.json` file.
2. Find the workflow associated with the given `<workflow_id>`.
3. Display its current status, details, and full audit trail.

**/approve <workflow_id>**
1. Find the workflow in `.workflow_state.json`.
2. Check if the current user has approval permissions.
3. Update the workflow status to "approved".
4. Add an entry to the audit trail with the approver's details and timestamp.
5. Notify the original requester of the approval.

**/reject <workflow_id> <reason>**
1. Find the workflow in `.workflow_state.json`.
2. Verify the user has authority to reject.
3. Update the status to "rejected".
4. Log the reason and rejector's details in the audit trail.
5. Inform the requester about the rejection and the reason.

### Automation

This skill can be automated to send reminders for pending approvals after a configurable period. A scheduled job could periodically scan the state file for overdue tasks and notify the relevant parties.

### Guardrails & Safety

- State file access is restricted to prevent unauthorized modifications.
- All state changes are logged in an immutable audit trail for traceability.
- Role-based access control should be implemented to ensure only authorized users can approve or reject.
- Input validation is performed on all commands to prevent errors.

### Failure Handling

If the `.workflow_state.json` file is corrupted or unreadable, the skill will enter a safe mode. It will prevent new workflows and notify an administrator. A backup of the state file is created daily to allow for restoration.

### Example Prompts

- "Start a new expense approval for $250 for a client dinner."
- "What is the status of workflow ID 8b1a3c4d?"
- "Approve workflow 8b1a3c4d."
- "Reject workflow 8b1a3c4d because it's over budget."