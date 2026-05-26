# Global Control CRM API Skill

Programmatic access to Global Control CRM for managing contacts, tags, workflows, domains, broadcast emails, and reporting.

## Purpose

This skill enables secure, programmatic access to the Global Control CRM API for:
- Managing contacts and segmentation
- Creating and organizing tags and tag groups
- Building and managing workflows
- Configuring domains
- Sending broadcast emails
- Retrieving comprehensive reports
- Managing custom fields and sub-users
- Viewing integrations

## Command Naming

Commands use clean, unprefixed names (e.g., `/contacts`, `/tags`). If a command conflicts with another skill, use the prefixed fallback version (e.g., `/gc-contacts`, `/gc-tags`).

## Supported Commands

### Contacts (13 commands)
- `/contacts` - List all contacts
- `/contacts-active-open` - Contacts who opened emails (last 30 days)
- `/contacts-active-click` - Contacts who clicked emails (last 30 days)
- `/contacts-inactive` - Inactive contacts (30-60 days)
- `/contacts-passive` - Sent emails but never engaged
- `/contacts-new` - Never sent an email
- `/contacts-undeliverable` - Bounced/undeliverable emails
- `/contacts-dead` - No engagement >60 days
- `/contact <contactId>` - Get contact by ID
- `/contact-details <contactId>` - Get detailed contact info
- `/create-contact --email "..." [--firstName "..."]` - Create contact
- `/update-contact <contactId> --field value` - Update contact
- `/delete-contact <contactId>` - Delete contact (requires confirmation)

### Tags & Tag Groups (14 commands)
- `/tags` - List all tags
- `/tags-with-status` - List tags with contact counts
- `/tag <tagId>` - Get tag details
- `/create-tag --name "..." --groupId <id>` - Create tag
- `/update-tag <tagId> --field value` - Update tag
- `/delete-tag <tagId>` - Delete tag (soft-delete, requires confirmation)
- `/fire-tag <tagId> --email "..."` - Apply tag to contact
- `/fire-tags --email "..." --tagIds "id1,id2"` - Apply multiple tags
- `/tag-groups` - List all tag groups
- `/tag-group <groupId>` - Get tag group details
- `/create-tag-group --name "..."` - Create tag group
- `/update-tag-group <groupId> --field value` - Update tag group
- `/delete-tag-group <groupId>` - Delete group (requires confirmation)
- `/tag-labels` - List all tag labels

### Workflows & Workflow Groups (13 commands)
- `/workflows [--groupId <id>]` - List workflows
- `/workflow <workflowId>` - Get workflow details
- `/create-workflow --name "..."` - Create workflow
- `/update-workflow <workflowId> --field value` - Update workflow
- `/delete-workflow <workflowId>` - Delete workflow (requires confirmation)
- `/update-flow <workflowId> <flowId> --field value` - Update flow
- `/delete-flow <workflowId> <flowId>` - Delete flow (requires confirmation)
- `/release-contacts <workflowId> <flowId>` - Release queued contacts (requires confirmation)
- `/remove-contact-from-workflow <workflowId> --contactEmail "..."` - Remove from queue
- `/workflow-groups` - List workflow groups
- `/workflow-group <groupId>` - Get group details
- `/create-workflow-group --name "..."` - Create group
- `/delete-workflow-group <groupId>` - Delete group (requires confirmation)

### Domains (5 commands)
- `/domains` - List all domains
- `/domain <domainId>` - Get domain details
- `/create-domain --domain "..." --integrationId <id> --accountId <id>` - Create domain
- `/delete-domain <domainId>` - Delete domain (requires confirmation)
- `/smtp-domains --accountId <id>` - Get SMTP domain list

### Broadcast Emails (7 commands)
- `/broadcast-fields` - List broadcast email fields
- `/create-broadcast-field --type "..." --label "..."` - Create field
- `/send-broadcast --recipients "..." --subject "..." --message "..."` - Send email (requires confirmation)
- `/broadcast-active-count` - Get active contacts count
- `/broadcast-inactive-count` - Get inactive contacts count
- `/broadcast-new-count` - Get new contacts count
- `/broadcast-dead-count` - Get dead contacts count

### Email Reports (3 commands)
- `/broadcast-report --domainId <id>` - Get broadcast email report
- `/newsletter-report --domainId <id>` - Get newsletter report
- `/workflow-report --domain "..." --accountId <id>` - Get workflow report

### Custom Fields (10 commands)
- `/custom-fields` - List all custom fields
- `/custom-field <fieldId>` - Get field details
- `/create-custom-field --name "..."` - Create custom field
- `/update-custom-field <fieldId> --field value` - Update field
- `/delete-custom-field <fieldId>` - Delete field (requires confirmation)
- `/custom-field-groups` - List field groups
- `/custom-field-group <groupId>` - Get group details
- `/create-custom-field-group --name "..."` - Create group
- `/update-custom-field-group <groupId> --field value` - Update group
- `/delete-custom-field-group <groupId>` - Delete group (requires confirmation)

### Sub-Users (5 commands)
- `/sub-users` - List all sub-users
- `/sub-user <userId>` - Get sub-user details
- `/create-sub-user --firstName "..." --lastName "..." --email "..." --password "..."` - Create sub-user
- `/update-sub-user <userId> --field value` - Update sub-user
- `/delete-sub-user <userId>` - Delete sub-user (requires confirmation)

### Integrations (3 commands)
- `/integrations` - List all integrations
- `/connected-integrations` - List connected integrations
- `/integration-categories` - List integration categories

**Total: 73 commands**

## Required Environment Variables

- `GLOBAL_CONTROL_API_KEY` - Your Global Control CRM API key

## First-Run Setup

On first use, if `GLOBAL_CONTROL_API_KEY` is not set:
1. You will be prompted to provide your API key
2. The key will be stored in a local `.env` file (skill-scoped)
3. The `.env` file is git-ignored and never exported

**Get your API key from:** https://api.globalcontrol.io/ai-api-docs

## Authentication

All API requests use custom header authentication:
```
X-API-KEY: YOUR_API_KEY_HERE
```

The skill reads `GLOBAL_CONTROL_API_KEY` from `skills/global-control-crm/.env`.

## Safety Features

### Destructive Operations
Delete commands and high-risk actions require explicit confirmation:
- Contact deletion (HARD DELETE - permanent)
- Tag/tag group deletion (soft delete)
- Workflow/workflow group deletion (soft delete)
- Domain deletion (soft delete)
- Custom field/group deletion (soft delete)
- Sub-user deletion
- Releasing contacts from workflow flows
- Sending broadcast emails to large lists

**You must type "yes" exactly to proceed with destructive actions.**

### Supported Actions Only
The skill refuses unsupported operations with:

> "I only support: contact, tag, tag group, workflow, domain, broadcast email, report, custom field, sub-user, and integration management as documented in the Global Control API."

## Export & Sharing Rules

### ✅ Safe to Share
- `SKILL.md`
- `README.md`
- `references/` directory
- `.env.example` (if created)
- `.gitignore`

### ❌ Never Share
- `.env` file (contains your API key)
- Any files with actual credentials

**When sharing this skill:**
1. Recipients must provide their own `GLOBAL_CONTROL_API_KEY`
2. They will be prompted on first use
3. Their credentials stay local to their machine

## Usage Examples

### Manage Contacts
```bash
# List all contacts
/contacts

# Get active contacts
/contacts-active-open

# Create a contact
/create-contact --email "john@example.com" --firstName "John" --lastName "Doe"

# Get contact details
/contact-details contact_123

# Delete a contact (with confirmation)
/delete-contact contact_123
```

### Manage Tags
```bash
# List all tags
/tags

# Create a tag
/create-tag --name "Newsletter Subscriber" --groupId group_123

# Fire tag for contact
/fire-tag tag_456 --email "john@example.com"

# Fire multiple tags
/fire-tags --email "john@example.com" --tagIds "tag1,tag2,tag3"
```

### Manage Workflows
```bash
# List workflows
/workflows

# Get workflow details
/workflow workflow_123

# Create workflow
/create-workflow --name "Welcome Series"

# Release contacts from a flow (with confirmation)
/release-contacts workflow_123 flow_456
```

### Send Broadcast Email
```bash
# Send broadcast (with confirmation)
/send-broadcast --recipients "active-open" --subject "Special Offer" --message "Your email content here..."
```

### Get Reports
```bash
# Broadcast report
/broadcast-report --domainId domain_123

# Newsletter report
/newsletter-report --domainId domain_123

# Workflow report
/workflow-report --domain "example.com" --accountId account_123
```

## Contact Filtering

The API provides specialized endpoints for contact segmentation:
- **active-open** - Opened emails in last 30 days
- **active-click** - Clicked emails in last 30 days
- **inactive** - Inactive for 30-60 days
- **passive** - Sent emails but never engaged
- **new** - Never sent an email
- **undeliverable** - Bounced/invalid emails
- **dead** - No engagement for >60 days

## Error Handling

The skill provides clear error messages:
- **401 Unauthorized** → Invalid API key
- **403 Forbidden** → Insufficient permissions
- **404 Not Found** → Resource doesn't exist
- **409 Conflict** → Resource conflict
- **429 Rate Limit** → Too many requests
- **5xx Server Error** → API issue, try later

## API Documentation

- **Source:** https://api.globalcontrol.io/ai-api-docs
- **Base URL:** https://api.globalcontrol.io/api/ai
- **Version:** 1.0.0

## Support

For API-specific questions, refer to:
- `references/api-summary.md` - API overview
- `references/endpoints.md` - Detailed endpoint reference
- Official docs: https://api.globalcontrol.io/ai-api-docs

## License

This skill is provided as-is for use with OpenClaw.
