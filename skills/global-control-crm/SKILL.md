---
name: Global Control CRM API Skill
slug: global-control-crm
author: OpenClaw Skill Generator
source: https://api.globalcontrol.io/ai-api-docs
description: Programmatic access to Global Control CRM for managing contacts, tags, workflows, domains, broadcast emails, and reporting.
version: 1.0.0
---

# Global Control CRM API Skill

This skill provides comprehensive access to the Global Control CRM API for managing contacts, tags, workflows, domains, broadcast emails, and reporting.

## API Base URL

All endpoints use: `https://api.globalcontrol.io/api/ai`

## Authentication

All requests require an API key in the `X-API-KEY` header:

```
X-API-KEY: {{ env.GLOBAL_CONTROL_API_KEY }}
```

## Supported Operations

### Contacts
- List all contacts (with filtering by engagement status)
- Get contact details
- Create, update, delete contacts
- Filter by: active-open, active-click, inactive, passive, new, undeliverable, dead

### Tags & Tag Groups
- Full CRUD for tags and tag groups
- Fire tags for contacts (single or multiple)
- List tags with contact status counts
- Tag labels management

### Workflows & Workflow Groups
- Full CRUD for workflows and workflow groups
- Manage individual flows within workflows
- Release contacts from flows
- Remove contacts from workflow queues
- Update SMTP configs and goals

### Domains
- List, create, delete domains
- Get SMTP and Mailgun domain lists

### Broadcast Emails
- Send broadcast emails
- Manage broadcast email fields
- Get contact counts for targeting (active, inactive, new, passive, dead)

### Email Reports
- Broadcast email reports
- Newsletter reports
- Workflow reports

### Custom Fields & Groups
- Full CRUD for custom fields and custom field groups

### Sub-Users
- Full CRUD for sub-users

### Integrations
- List integrations
- List connected integrations and categories

## Environment Variables

Required:
- `GLOBAL_CONTROL_API_KEY` - Your Global Control API key

## Command List

> **Note:** Commands use clean names (e.g., `/contacts`). If a command conflicts with another skill, use the prefixed fallback (e.g., `/gc-contacts`).

### Contacts (13 commands)
- `/contacts` (fallback: `/gc-contacts`) - List all contacts
- `/contacts-active-open` (fallback: `/gc-contacts-active-open`) - List contacts who opened emails in last 30 days
- `/contacts-active-click` (fallback: `/gc-contacts-active-click`) - List contacts who clicked emails in last 30 days
- `/contacts-inactive` (fallback: `/gc-contacts-inactive`) - List contacts inactive for 30-60 days
- `/contacts-passive` (fallback: `/gc-contacts-passive`) - List contacts sent emails but never engaged
- `/contacts-new` (fallback: `/gc-contacts-new`) - List contacts never sent an email
- `/contacts-undeliverable` (fallback: `/gc-contacts-undeliverable`) - List contacts with undeliverable emails
- `/contacts-dead` (fallback: `/gc-contacts-dead`) - List contacts with no engagement >60 days
- `/contact <contactId>` (fallback: `/gc-contact`) - Get contact by ID
- `/contact-details <contactId>` (fallback: `/gc-contact-details`) - Get detailed contact info
- `/create-contact --email "..." [--firstName "..."] [--lastName "..."]` (fallback: `/gc-create-contact`) - Create contact
- `/update-contact <contactId> --field value` (fallback: `/gc-update-contact`) - Update contact
- `/delete-contact <contactId>` (fallback: `/gc-delete-contact`) - Delete contact ⚠️

### Tags & Tag Groups (14 commands)
- `/tags` (fallback: `/gc-tags`) - List all tags
- `/tags-with-status` (fallback: `/gc-tags-with-status`) - List tags with contact status counts
- `/tag <tagId>` (fallback: `/gc-tag`) - Get tag by ID
- `/create-tag --name "..." --groupId <id>` (fallback: `/gc-create-tag`) - Create tag
- `/update-tag <tagId> --field value` (fallback: `/gc-update-tag`) - Update tag
- `/delete-tag <tagId>` (fallback: `/gc-delete-tag`) - Delete tag ⚠️
- `/fire-tag <tagId> --email "..."` (fallback: `/gc-fire-tag`) - Fire tag for contact
- `/fire-tags --email "..." --tagIds "id1,id2"` (fallback: `/gc-fire-tags`) - Fire multiple tags
- `/tag-groups` (fallback: `/gc-tag-groups`) - List all tag groups
- `/tag-group <groupId>` (fallback: `/gc-tag-group`) - Get tag group by ID
- `/create-tag-group --name "..."` (fallback: `/gc-create-tag-group`) - Create tag group
- `/update-tag-group <groupId> --field value` (fallback: `/gc-update-tag-group`) - Update tag group
- `/delete-tag-group <groupId>` (fallback: `/gc-delete-tag-group`) - Delete tag group ⚠️
- `/tag-labels` (fallback: `/gc-tag-labels`) - List all tag labels

### Workflows & Workflow Groups (13 commands)
- `/workflows [--groupId <id>]` (fallback: `/gc-workflows`) - List all workflows
- `/workflow <workflowId>` (fallback: `/gc-workflow`) - Get workflow by ID
- `/create-workflow --name "..."` (fallback: `/gc-create-workflow`) - Create workflow
- `/update-workflow <workflowId> --field value` (fallback: `/gc-update-workflow`) - Update workflow
- `/delete-workflow <workflowId>` (fallback: `/gc-delete-workflow`) - Delete workflow ⚠️
- `/update-flow <workflowId> <flowId> --field value` (fallback: `/gc-update-flow`) - Update workflow flow
- `/delete-flow <workflowId> <flowId>` (fallback: `/gc-delete-flow`) - Delete workflow flow ⚠️
- `/release-contacts <workflowId> <flowId>` (fallback: `/gc-release-contacts`) - Release queued contacts ⚠️
- `/remove-contact-from-workflow <workflowId> --contactEmail "..."` (fallback: `/gc-remove-contact-from-workflow`) - Remove contact from queue
- `/workflow-groups` (fallback: `/gc-workflow-groups`) - List all workflow groups
- `/workflow-group <groupId>` (fallback: `/gc-workflow-group`) - Get workflow group by ID
- `/create-workflow-group --name "..."` (fallback: `/gc-create-workflow-group`) - Create workflow group
- `/delete-workflow-group <groupId>` (fallback: `/gc-delete-workflow-group`) - Delete workflow group ⚠️

### Domains (5 commands)
- `/domains` (fallback: `/gc-domains`) - List all domains
- `/domain <domainId>` (fallback: `/gc-domain`) - Get domain by ID
- `/create-domain --domain "..." --integrationId <id> --accountId <id>` (fallback: `/gc-create-domain`) - Create domain
- `/delete-domain <domainId>` (fallback: `/gc-delete-domain`) - Delete domain ⚠️
- `/smtp-domains --accountId <id>` (fallback: `/gc-smtp-domains`) - Get SMTP domain list

### Broadcast Emails (7 commands)
- `/broadcast-fields` (fallback: `/gc-broadcast-fields`) - List broadcast email fields
- `/create-broadcast-field --type "..." --label "..."` (fallback: `/gc-create-broadcast-field`) - Create field
- `/send-broadcast --recipients "..." --subject "..." --message "..."` (fallback: `/gc-send-broadcast`) - Send email ⚠️
- `/broadcast-active-count` (fallback: `/gc-broadcast-active-count`) - Get active contacts count
- `/broadcast-inactive-count` (fallback: `/gc-broadcast-inactive-count`) - Get inactive contacts count
- `/broadcast-new-count` (fallback: `/gc-broadcast-new-count`) - Get new contacts count
- `/broadcast-dead-count` (fallback: `/gc-broadcast-dead-count`) - Get dead contacts count

### Email Reports (3 commands)
- `/broadcast-report --domainId <id>` (fallback: `/gc-broadcast-report`) - Get broadcast report
- `/newsletter-report --domainId <id>` (fallback: `/gc-newsletter-report`) - Get newsletter report
- `/workflow-report --domain "..." --accountId <id> [--workflowId <id>]` (fallback: `/gc-workflow-report`) - Get workflow report

### Custom Fields (10 commands)
- `/custom-fields` (fallback: `/gc-custom-fields`) - List all custom fields
- `/custom-field <fieldId>` (fallback: `/gc-custom-field`) - Get custom field by ID
- `/create-custom-field --name "..."` (fallback: `/gc-create-custom-field`) - Create custom field
- `/update-custom-field <fieldId> --field value` (fallback: `/gc-update-custom-field`) - Update custom field
- `/delete-custom-field <fieldId>` (fallback: `/gc-delete-custom-field`) - Delete custom field ⚠️
- `/custom-field-groups` (fallback: `/gc-custom-field-groups`) - List all custom field groups
- `/custom-field-group <groupId>` (fallback: `/gc-custom-field-group`) - Get custom field group by ID
- `/create-custom-field-group --name "..."` (fallback: `/gc-create-custom-field-group`) - Create group
- `/update-custom-field-group <groupId> --field value` (fallback: `/gc-update-custom-field-group`) - Update group
- `/delete-custom-field-group <groupId>` (fallback: `/gc-delete-custom-field-group`) - Delete group ⚠️

### Sub-Users (5 commands)
- `/sub-users` (fallback: `/gc-sub-users`) - List all sub-users
- `/sub-user <userId>` (fallback: `/gc-sub-user`) - Get sub-user by ID
- `/create-sub-user --firstName "..." --lastName "..." --email "..." --password "..."` (fallback: `/gc-create-sub-user`) - Create sub-user
- `/update-sub-user <userId> --field value` (fallback: `/gc-update-sub-user`) - Update sub-user
- `/delete-sub-user <userId>` (fallback: `/gc-delete-sub-user`) - Delete sub-user ⚠️

### Integrations (3 commands)
- `/integrations` (fallback: `/gc-integrations`) - List all integrations
- `/connected-integrations` (fallback: `/gc-connected-integrations`) - List connected integrations
- `/integration-categories` (fallback: `/gc-integration-categories`) - List connected integration categories

**Total: 73 commands**

## Implementation Guide

### 1. Parameter Extraction

Commands support direct parameter passing. When required parameters are missing, prompt the user.

### 2. Validation

- Verify IDs exist before operations
- Check required fields for create/update
- Validate email formats
- Confirm destructive operations explicitly

### 3. API Call Construction

```bash
# List contacts
curl -H "X-API-KEY: ${GLOBAL_CONTROL_API_KEY}" \
     https://api.globalcontrol.io/api/ai/contacts

# Create contact
curl -X POST \
     -H "X-API-KEY: ${GLOBAL_CONTROL_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","firstName":"John","lastName":"Doe"}' \
     https://api.globalcontrol.io/api/ai/contacts

# Fire tag for contact
curl -X POST \
     -H "X-API-KEY: ${GLOBAL_CONTROL_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}' \
     https://api.globalcontrol.io/api/ai/tags/fire-tag/{tagId}

# Send broadcast email
curl -X POST \
     -H "X-API-KEY: ${GLOBAL_CONTROL_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{"recipients":["email1","email2"],"subject":"...","message":"...","smtpConfig":{...}}' \
     https://api.globalcontrol.io/api/ai/broadcast-emails/send-email
```

### 4. Destructive Operations

For delete commands and high-risk actions:
1. Fetch resource details
2. Display what will be affected
3. Ask: "Type 'yes' to confirm this action"
4. Only proceed if exact match

**Destructive commands:**
- Contact deletion (hard delete)
- Tag/tag group deletion (soft delete)
- Workflow/workflow group deletion (soft delete)
- Domain deletion (soft delete)
- Custom field/group deletion (soft delete)
- Sub-user deletion
- Releasing contacts from workflow flows
- Sending broadcast emails to large lists

### 5. Response Formatting

**For contacts:**
```
👤 Contacts (250)

1. John Doe
   • ID: contact_123
   • Email: john@example.com
   • Phone: +1234567890
   • Tags: Newsletter, Premium
   • Status: Active

2. Jane Smith
   • ID: contact_456
   • Email: jane@example.com
   • Tags: Lead
   • Status: Inactive
```

**For tags:**
```
🏷️ Tags (45)

1. Newsletter
   • ID: tag_abc
   • Group: Marketing
   • Contacts: 1,234
   • Status: Active

2. Premium Customer
   • ID: tag_def
   • Group: Sales
   • Contacts: 89
   • Status: Active
```

**For workflows:**
```
⚙️ Workflows (12)

1. Welcome Series
   • ID: workflow_xyz
   • Group: Onboarding
   • Flows: 5
   • Status: Active
   • Contacts in queue: 34

2. Re-engagement Campaign
   • ID: workflow_abc
   • Group: Marketing
   • Flows: 3
   • Status: Active
   • Contacts in queue: 156
```

### 6. Error Handling

Map API errors to user-friendly messages:

- **401** → "❌ Invalid API key. Check your GLOBAL_CONTROL_API_KEY."
- **403** → "❌ Access forbidden. Check your API key permissions."
- **404** → "❌ Resource not found. Check the provided ID."
- **400** → "❌ Invalid request. {error details}"
- **409** → "❌ Conflict. {conflict details}"
- **429** → "⏸️ Rate limit exceeded. Wait a moment and try again."
- **5xx** → "❌ Global Control API error. Try again later."

## Implementation Examples

### Example 1: List Contacts
```
User: /contacts (or /gc-contacts if conflict)

Agent:
1. Read GLOBAL_CONTROL_API_KEY from skills/global-control-crm/.env
2. Call: GET https://api.globalcontrol.io/api/ai/contacts
3. Format response:
   👤 Contacts (250)
   
   [Shows formatted contact list with pagination]
```

### Example 2: Create Contact
```
User: /create-contact --email "john@example.com" --firstName "John" --lastName "Doe"

Agent:
1. Validate email format
2. Call: POST /api/ai/contacts
   Body: {
     "email": "john@example.com",
     "firstName": "John",
     "lastName": "Doe"
   }
3. Format response:
   ✅ Contact created!
   
   👤 John Doe
   ID: contact_123
   Email: john@example.com
   
   Next steps:
   • View details: /contact-details contact_123
   • Add tags: /fire-tag <tagId> --email "john@example.com"
```

### Example 3: Delete Contact (Destructive)
```
User: /delete-contact contact_123

Agent:
1. Fetch contact details
2. Display warning:
   ⚠️ DELETE CONFIRMATION REQUIRED
   
   You are about to permanently delete:
   👤 John Doe (john@example.com)
   • Tags: Newsletter, Premium
   • In workflows: Welcome Series
   • This is a HARD DELETE and CANNOT be undone
   
   Type 'yes' to confirm deletion, or anything else to cancel.

3. Wait for user response
4. If user types exactly "yes":
   - Call: DELETE /api/ai/contacts/contact_123
   - Show: ✅ Contact "John Doe" deleted permanently
5. Otherwise:
   - Show: ❌ Deletion cancelled
```

### Example 4: Send Broadcast Email (High-Risk)
```
User: /send-broadcast --recipients "active-open" --subject "Special Offer" --message "..."

Agent:
1. Get recipient count: POST /api/ai/broadcast-emails/active-contacts-count
2. Display warning:
   ⚠️ BROADCAST EMAIL CONFIRMATION
   
   You are about to send an email to approximately 1,234 contacts.
   
   Subject: Special Offer
   Recipients: Active contacts (opened in last 30 days)
   
   This action will send real emails and cannot be undone.
   
   Type 'yes' to confirm sending, or anything else to cancel.

3. Wait for user response
4. If user types exactly "yes":
   - Call: POST /api/ai/broadcast-emails/send-email
   - Show: ✅ Broadcast email sent to 1,234 contacts
5. Otherwise:
   - Show: ❌ Broadcast cancelled
```

## Quick Implementation Reference

### Critical API Patterns

**1. All requests use X-API-KEY header:**
```bash
curl -H "X-API-KEY: your_key_here" ...
```

**2. Contact filtering endpoints:**
- `/contacts` - All contacts
- `/contacts/active-open` - Opened last 30 days
- `/contacts/active-click` - Clicked last 30 days
- `/contacts/inactive` - 30-60 days inactive
- `/contacts/passive` - Sent but never engaged
- `/contacts/new` - Never sent
- `/contacts/undeliverable` - Bounced emails
- `/contacts/dead` - No engagement >60 days

**3. Fire tag requires email, not contact ID:**
```javascript
POST /tags/fire-tag/{tagId}
Body: { "email": "contact@example.com" }
```

**4. Workflow updates must fetch current state first:**
```bash
# 1. Get current workflow
GET /workflows/{id}
# 2. Modify flows array
# 3. Update workflow with modified flows
PUT /workflows/{id}
```

## Refusal Behavior

When user requests unsupported actions:

> "I only support: contact, tag, tag group, workflow, domain, broadcast email, report, custom field, sub-user, and integration management as documented in the Global Control API."

## References

See `references/` directory for:
- `api-summary.md` - API overview
- `endpoints.md` - Complete endpoint inventory
