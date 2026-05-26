# Global Control CRM API - Summary

## Overview

The Global Control CRM API provides comprehensive programmatic access to contact management, email marketing, workflow automation, and reporting capabilities.

**Base URL:** `https://api.globalcontrol.io/api/ai`

**Authentication:** Custom header `X-API-KEY`

**Version:** 1.0.0

---

## Resource Categories

### 1. Contacts
Manage your contact database with full CRUD operations and advanced filtering.

**Key Features:**
- Create, read, update, delete contacts
- Filter by engagement level (active, inactive, passive, dead, new)
- Track email opens and clicks
- Manage contact tags and custom fields
- View detailed contact history

**Engagement Filtering:**
- Active (open/click in last 30 days)
- Inactive (30-60 days no activity)
- Passive (sent emails, never engaged)
- New (never sent)
- Dead (>60 days no engagement)
- Undeliverable (bounced emails)

---

### 2. Tags & Tag Groups
Organize and segment contacts with tags and tag groups.

**Key Features:**
- Create hierarchical tag structure with groups
- Apply tags individually or in batch
- Track tag status across contacts
- Soft-delete for data integrity
- Tag labels for visual organization

**Use Cases:**
- Customer segmentation
- Lead scoring
- Marketing campaign targeting
- Behavioral triggers

---

### 3. Workflows & Workflow Groups
Build automated email sequences and drip campaigns.

**Key Features:**
- Create multi-step email workflows
- Organize workflows in groups
- Manage individual flows within workflows
- Configure SMTP settings per workflow
- Set workflow goals and tracking
- Release or remove contacts from flows
- Queue management

**Workflow Components:**
- Multiple email flows with delays
- Conditional logic
- SMTP configuration
- Goal tracking
- Contact queue management

---

### 4. Domains
Manage sending domains for email delivery.

**Key Features:**
- Add and verify domains
- Configure SMTP and Mailgun domains
- Domain-level email configuration
- Soft-delete for history preservation

---

### 5. Broadcast Emails
Send one-time email campaigns to segments.

**Key Features:**
- Send to filtered contact segments
- Custom field support
- SMTP configuration
- Preview recipient counts before sending
- Target by engagement level

**Targeting Options:**
- All contacts
- Active contacts (open/click)
- Inactive contacts
- New contacts
- Passive contacts
- Dead contacts

---

### 6. Email Reports
Track email campaign performance.

**Report Types:**
- **Broadcast Reports** - One-time campaign metrics
- **Newsletter Reports** - Regular newsletter performance
- **Workflow Reports** - Automated sequence analytics

**Metrics Include:**
- Sends, Opens, Clicks
- Bounce rates
- Unsubscribes
- Engagement trends

---

### 7. Custom Fields & Groups
Extend contact data with custom fields.

**Key Features:**
- Create custom contact fields
- Organize fields in groups
- Support various field types
- Use in workflows and broadcasts
- Soft-delete for data integrity

---

### 8. Sub-Users
Manage team access to the CRM.

**Key Features:**
- Create sub-user accounts
- Assign permissions
- Track sub-user activity
- Update credentials

---

### 9. Integrations
Connect external services and tools.

**Key Features:**
- View available integrations
- List connected integrations
- Browse integration categories
- Manage integration settings

---

## Authentication

All requests require the `X-API-KEY` header:

```bash
curl -H "X-API-KEY: your_api_key_here" \
     https://api.globalcontrol.io/api/ai/contacts
```

---

## Common Patterns

### Pagination
Most list endpoints support pagination via query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

### Filtering
Many endpoints support filtering:
- Contact lists: by engagement status
- Workflows: by workflow group
- Tags: with contact status counts

### Soft Delete
Most resources use soft-delete:
- Resource marked as deleted
- Data preserved for history
- Can be restored if needed

### Hard Delete
Contacts use hard-delete:
- Permanent removal
- Cannot be undone
- Use with caution

---

## Safety & Best Practices

### Destructive Operations
Always require explicit confirmation for:
- Contact deletion (hard delete)
- Releasing contacts from workflows
- Sending broadcast emails to large lists
- Deleting workflows with active contacts

### Rate Limiting
- API implements rate limiting (exact limits not documented)
- Use exponential backoff on 429 errors
- Batch operations when possible

### Error Handling
- 401: Invalid API key
- 403: Insufficient permissions
- 404: Resource not found
- 409: Resource conflict
- 429: Rate limit exceeded
- 5xx: Server error

---

## Use Cases

### Contact Management
- Import and sync contacts
- Segment by behavior
- Track engagement
- Clean dead contacts

### Email Marketing
- Automated welcome series
- Re-engagement campaigns
- Newsletter management
- Broadcast announcements

### Workflow Automation
- Drip campaigns
- Lead nurturing
- Onboarding sequences
- Event-triggered emails

### Reporting & Analytics
- Campaign performance
- Engagement tracking
- ROI measurement
- List health monitoring

---

## Limitations & Unknowns

**Not Documented:**
- Exact rate limit values
- Maximum payload sizes
- Pagination limits
- Webhook/event support
- Audit log access
- Advanced filtering syntax

**Complex Objects:**
- SMTP configuration requires detailed setup
- Workflow flows require careful construction
- Custom field types and validation rules

---

## Support Resources

- **API Docs:** https://api.globalcontrol.io/ai-api-docs
- **Endpoint Reference:** See `endpoints.md`
- **Skill Commands:** See `README.md`
