# Global Control CRM API - Complete Endpoint Reference

Base URL: `https://api.globalcontrol.io/api/ai`

All endpoints require authentication via `X-API-KEY` header.

---

## Contacts Endpoints (13)

### List All Contacts
```
GET /contacts
```
**Purpose**: List all contacts with pagination and search

**Auth Required**: Yes

**Query Parameters**:
- `page` (optional, number) - Page number
- `limit` (optional, number) - Items per page
- `search` (optional, string) - Search term

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Active Open Contacts
```
GET /contacts/active-open
```
**Purpose**: List contacts who opened emails in last 30 days

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Active Click Contacts
```
GET /contacts/active-click
```
**Purpose**: List contacts who clicked emails in last 30 days

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Inactive Contacts
```
GET /contacts/inactive
```
**Purpose**: List contacts inactive for 30-60 days

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Passive Contacts
```
GET /contacts/passive
```
**Purpose**: List contacts sent emails but never opened/clicked

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List New Contacts
```
GET /contacts/new
```
**Purpose**: List contacts never sent an email

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Undeliverable Contacts
```
GET /contacts/undeliverable
```
**Purpose**: List contacts with undeliverable emails (bounced)

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### List Dead Contacts
```
GET /contacts/dead
```
**Purpose**: List contacts with no engagement for >60 days

**Auth Required**: Yes

**Response**: Array of contact objects

**Risk Level**: Read-only

---

### Get Contact by ID
```
GET /contacts/{contactId}
```
**Purpose**: Get a contact by ID

**Auth Required**: Yes

**Path Parameters**:
- `contactId` (required, string) - Contact ID

**Response**: Contact object

**Risk Level**: Read-only

---

### Get Contact Details
```
GET /contacts/{id}/details
```
**Purpose**: Get detailed contact information (tags, workflows, activities, etc.)

**Auth Required**: Yes

**Path Parameters**:
- `id` (required, string) - Contact ID

**Response**: Detailed contact object with relationships

**Risk Level**: Read-only

---

### Create Contact
```
POST /contacts
```
**Purpose**: Create a new contact

**Auth Required**: Yes

**Body Parameters**:
- `email` (required, string) - Email address
- `firstName` (optional, string) - First name
- `lastName` (optional, string) - Last name
- `phone` (optional, string) - Phone number
- `tagId` (optional, string) - Tag ID to apply
- `customFields` (optional, object) - Custom field values

**Response**: Created contact object

**Risk Level**: Mutating

---

### Update Contact
```
PUT /contacts/{contactId}
```
**Purpose**: Update contact fields

**Auth Required**: Yes

**Path Parameters**:
- `contactId` (required, string) - Contact ID

**Body Parameters**:
- `firstName` (optional, string) - First name
- `lastName` (optional, string) - Last name
- `email` (optional, string) - Email address
- `phone` (optional, string) - Phone number
- `tags` (optional, array) - Array of tag IDs
- `customFields` (optional, object) - Custom field values

**Response**: Updated contact object

**Risk Level**: Mutating

---

### Delete Contact
```
DELETE /contacts/{contactId}
```
**Purpose**: Permanently delete a contact

**Auth Required**: Yes

**Path Parameters**:
- `contactId` (required, string) - Contact ID

**Response**: Deleted contact object

**Risk Level**: Destructive (hard delete, requires confirmation)

---

## Tags Endpoints (11)

### List All Tags
```
GET /tags
```
**Purpose**: List all tags

**Auth Required**: Yes

**Response**: Array of tag objects

**Risk Level**: Read-only

---

### List Tags with Contact Status
```
GET /tags/list-with-contact-status
```
**Purpose**: List tags with contact status counts

**Auth Required**: Yes

**Response**: Array of tag objects with contact counts

**Risk Level**: Read-only

---

### Get Tag by ID
```
GET /tags/{tagId}
```
**Purpose**: Get a tag by ID

**Auth Required**: Yes

**Path Parameters**:
- `tagId` (required, string) - Tag ID

**Response**: Tag object

**Risk Level**: Read-only

---

### Create Tag
```
POST /tags
```
**Purpose**: Create a new tag

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Tag name
- `groupId` (required, string) - Tag group ID

**Response**: Created tag object

**Risk Level**: Mutating

---

### Update Tag
```
PUT /tags/{tagId}
```
**Purpose**: Update a tag

**Auth Required**: Yes

**Path Parameters**:
- `tagId` (required, string) - Tag ID

**Body Parameters**:
- `name` (optional, string) - Tag name
- `groupId` (optional, string) - Tag group ID

**Response**: Updated tag object

**Risk Level**: Mutating

---

### Delete Tag
```
DELETE /tags/{tagId}
```
**Purpose**: Soft-delete a tag

**Auth Required**: Yes

**Path Parameters**:
- `tagId` (required, string) - Tag ID

**Response**: Deleted tag object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

### Fire Tag for Contact
```
POST /tags/fire-tag/{tagId}
```
**Purpose**: Apply a tag to a contact

**Auth Required**: Yes

**Path Parameters**:
- `tagId` (required, string) - Tag ID

**Body Parameters**:
- `email` (required, string) - Contact email address

**Response**: Success message

**Risk Level**: Mutating

---

### Fire Multiple Tags for Contact
```
POST /tags/fire-tags
```
**Purpose**: Apply multiple tags to a contact

**Auth Required**: Yes

**Body Parameters**:
- `email` (required, string) - Contact email address
- `tagIds` (required, array) - Array of tag IDs

**Response**: Success message

**Risk Level**: Mutating

---

## Tag Groups Endpoints (5)

### List All Tag Groups
```
GET /tag-groups
```
**Purpose**: List all tag groups

**Auth Required**: Yes

**Response**: Array of tag group objects

**Risk Level**: Read-only

---

### Get Tag Group by ID
```
GET /tag-groups/{groupId}
```
**Purpose**: Get a tag group by ID

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Tag group ID

**Response**: Tag group object

**Risk Level**: Read-only

---

### Create Tag Group
```
POST /tag-groups
```
**Purpose**: Create a new tag group

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Group name

**Response**: Created tag group object

**Risk Level**: Mutating

---

### Update Tag Group
```
PUT /tag-groups/{groupId}
```
**Purpose**: Update a tag group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Tag group ID

**Body Parameters**:
- `name` (optional, string) - Group name

**Response**: Updated tag group object

**Risk Level**: Mutating

---

### Delete Tag Group
```
DELETE /tag-groups/{groupId}
```
**Purpose**: Soft-delete a tag group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Tag group ID

**Response**: Deleted tag group object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

## Tag Labels Endpoints (5)

### List All Tag Labels
```
GET /tags-labels
```
**Purpose**: List all tag labels

**Auth Required**: Yes

**Response**: Array of tag label objects

**Risk Level**: Read-only

---

### Get Tag Label by ID
```
GET /tags-labels/{labelId}
```
**Purpose**: Get a tag label by ID

**Auth Required**: Yes

**Path Parameters**:
- `labelId` (required, string) - Tag label ID

**Response**: Tag label object

**Risk Level**: Read-only

---

### Create Tag Label
```
POST /tags-labels
```
**Purpose**: Create a new tag label

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Label name
- `color` (required, string) - Label color (hex code)

**Response**: Created tag label object

**Risk Level**: Mutating

---

### Update Tag Label
```
PUT /tags-labels/{labelId}
```
**Purpose**: Update a tag label

**Auth Required**: Yes

**Path Parameters**:
- `labelId` (required, string) - Tag label ID

**Body Parameters**:
- `name` (optional, string) - Label name
- `color` (optional, string) - Label color

**Response**: Updated tag label object

**Risk Level**: Mutating

---

### Delete Tag Label
```
DELETE /tags-labels/{labelId}
```
**Purpose**: Permanently delete a tag label

**Auth Required**: Yes

**Path Parameters**:
- `labelId` (required, string) - Tag label ID

**Response**: Deleted tag label object

**Risk Level**: Destructive (hard delete, requires confirmation)

---

## Workflows Endpoints (9)

### List All Workflows
```
GET /workflows
```
**Purpose**: List all workflows

**Auth Required**: Yes

**Query Parameters**:
- `workflowGroupId` (optional, string) - Filter by workflow group

**Response**: Array of workflow objects

**Risk Level**: Read-only

---

### Get Workflow by ID
```
GET /workflows/{workflowId}
```
**Purpose**: Get a workflow by ID

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID

**Response**: Workflow object with flows

**Risk Level**: Read-only

---

### Create Workflow
```
POST /workflows
```
**Purpose**: Create a new workflow

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Workflow name
- `workflowGroupId` (optional, string) - Workflow group ID
- `emails` (optional, array) - Array of email objects
- `smtpConfig` (optional, object) - SMTP configuration
- `goals` (optional, array) - Workflow goals

**Response**: Created workflow object

**Risk Level**: Mutating

---

### Update Workflow
```
PUT /workflows/{workflowId}
```
**Purpose**: Update workflow metadata, flows, SMTP config, or goals

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID

**Body Parameters**:
- `name` (optional, string) - Workflow name
- `flows` (optional, array) - Array of flow objects
- `smtpConfig` (optional, object) - SMTP configuration
- `goals` (optional, array) - Workflow goals

**Response**: Updated workflow object

**Risk Level**: Mutating

**Note**: Must fetch current workflow first before updating flows

---

### Delete Workflow
```
DELETE /workflows/{workflowId}
```
**Purpose**: Soft-delete a workflow

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID

**Response**: Deleted workflow object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

### Update Workflow Flow
```
PUT /workflows/{workflowId}/{flowId}
```
**Purpose**: Update a single flow within a workflow

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID
- `flowId` (required, string) - Flow ID

**Body Parameters**:
- Flow-specific fields (email content, delay, conditions, etc.)

**Response**: Updated flow object

**Risk Level**: Mutating

---

### Delete Workflow Flow
```
DELETE /workflows/{workflowId}/{flowId}
```
**Purpose**: Delete a single flow from a workflow

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID
- `flowId` (required, string) - Flow ID

**Response**: Success message

**Risk Level**: Destructive (requires confirmation)

---

### Release Contacts from Flow
```
POST /workflows/release/{workflowId}/{flowId}
```
**Purpose**: Release contacts queued/frozen in a specific flow

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID
- `flowId` (required, string) - Flow ID

**Response**: Count of contacts released

**Risk Level**: Destructive (affects queued contacts, requires confirmation)

---

### Remove Contact from Workflow
```
POST /workflows/{workflowId}/delete-contact
```
**Purpose**: Remove a specific contact from workflow queue

**Auth Required**: Yes

**Path Parameters**:
- `workflowId` (required, string) - Workflow ID

**Body Parameters**:
- `email` (required, string) - Contact email address

**Response**: Success message

**Risk Level**: Mutating

---

## Workflow Groups Endpoints (5)

### List All Workflow Groups
```
GET /workflow-groups
```
**Purpose**: List all workflow groups

**Auth Required**: Yes

**Response**: Array of workflow group objects

**Risk Level**: Read-only

---

### Get Workflow Group by ID
```
GET /workflow-groups/{groupId}
```
**Purpose**: Get a workflow group by ID

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Workflow group ID

**Response**: Workflow group object

**Risk Level**: Read-only

---

### Create Workflow Group
```
POST /workflow-groups
```
**Purpose**: Create a new workflow group

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Group name

**Response**: Created workflow group object

**Risk Level**: Mutating

---

### Update Workflow Group
```
PUT /workflow-groups/{groupId}
```
**Purpose**: Update a workflow group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Workflow group ID

**Body Parameters**:
- `name` (optional, string) - Group name

**Response**: Updated workflow group object

**Risk Level**: Mutating

---

### Delete Workflow Group
```
DELETE /workflow-groups/{groupId}
```
**Purpose**: Soft-delete a workflow group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Workflow group ID

**Response**: Deleted workflow group object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

## Domains Endpoints (5)

### List All Domains
```
GET /domains
```
**Purpose**: List all domains

**Auth Required**: Yes

**Response**: Array of domain objects

**Risk Level**: Read-only

---

### Get Domain by ID
```
GET /domains/{domainId}
```
**Purpose**: Get a domain by ID

**Auth Required**: Yes

**Path Parameters**:
- `domainId` (required, string) - Domain ID

**Response**: Domain object

**Risk Level**: Read-only

---

### Create Domain
```
POST /domains
```
**Purpose**: Create a new domain

**Auth Required**: Yes

**Body Parameters**:
- `domain` (required, string) - Domain name
- `integrationId` (required, string) - Integration ID
- `accountId` (required, string) - Account ID

**Response**: Created domain object

**Risk Level**: Mutating

---

### Delete Domain
```
DELETE /domains/{domainId}
```
**Purpose**: Soft-delete a domain

**Auth Required**: Yes

**Path Parameters**:
- `domainId` (required, string) - Domain ID

**Response**: Deleted domain object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

### Get SMTP Domain List
```
POST /domains/smtp-domain-list
```
**Purpose**: Get SMTP domain list for an account

**Auth Required**: Yes

**Body Parameters**:
- `accountId` (required, string) - Account ID

**Response**: Array of SMTP domain objects

**Risk Level**: Read-only

---

### Get Mailgun Domain List
```
POST /domains/mailgun-domain-list
```
**Purpose**: Get Mailgun domain list for an account

**Auth Required**: Yes

**Body Parameters**:
- `accountId` (required, string) - Account ID

**Response**: Array of Mailgun domain objects

**Risk Level**: Read-only

---

## Broadcast Emails Endpoints (8)

### List Broadcast Email Fields
```
GET /broadcast-emails/get-fields
```
**Purpose**: List available broadcast email fields

**Auth Required**: Yes

**Response**: Array of field objects

**Risk Level**: Read-only

---

### Create Broadcast Email Field
```
POST /broadcast-emails/create-field
```
**Purpose**: Create a new broadcast email field

**Auth Required**: Yes

**Body Parameters**:
- `type` (required, string) - Field type
- `label` (required, string) - Field label

**Response**: Created field object

**Risk Level**: Mutating

---

### Get Active Contacts Count
```
POST /broadcast-emails/active-contacts-count
```
**Purpose**: Get count of active contacts (for targeting preview)

**Auth Required**: Yes

**Response**: `{ count: number }`

**Risk Level**: Read-only

---

### Get Inactive Contacts Count
```
POST /broadcast-emails/inactive-contacts-count
```
**Purpose**: Get count of inactive contacts

**Auth Required**: Yes

**Response**: `{ count: number }`

**Risk Level**: Read-only

---

### Get New Contacts Count
```
POST /broadcast-emails/new-contacts-count
```
**Purpose**: Get count of new contacts

**Auth Required**: Yes

**Response**: `{ count: number }`

**Risk Level**: Read-only

---

### Get Passive Contacts Count
```
POST /broadcast-emails/passive-contacts-count
```
**Purpose**: Get count of passive contacts

**Auth Required**: Yes

**Response**: `{ count: number }`

**Risk Level**: Read-only

---

### Get Dead Contacts Count
```
POST /broadcast-emails/dead-contacts-count
```
**Purpose**: Get count of dead contacts

**Auth Required**: Yes

**Response**: `{ count: number }`

**Risk Level**: Read-only

---

### Send Broadcast Email
```
POST /broadcast-emails/send-email
```
**Purpose**: Send a broadcast email to recipients

**Auth Required**: Yes

**Body Parameters**:
- `recipients` (required, array/string) - Array of emails or filter type
- `subject` (required, string) - Email subject
- `message` (required, string) - Email content (HTML)
- `smtpConfig` (required, object) - SMTP configuration

**Response**: Send result with counts

**Risk Level**: Admin/High-risk (sends real emails, requires confirmation)

---

## Email Reports Endpoints (3)

### Get Broadcast Email Report
```
POST /email-reports/broadcast
```
**Purpose**: Get broadcast email report

**Auth Required**: Yes

**Body Parameters**:
- `domainId` (required, string) - Domain ID

**Response**: Broadcast report object

**Risk Level**: Read-only

---

### Get Newsletter Report
```
POST /email-reports/newsletter
```
**Purpose**: Get newsletter report

**Auth Required**: Yes

**Body Parameters**:
- `domainId` (required, string) - Domain ID

**Response**: Newsletter report object

**Risk Level**: Read-only

---

### Get Workflow Report
```
POST /email-reports/workflow
```
**Purpose**: Get workflow email report

**Auth Required**: Yes

**Body Parameters**:
- `domain` (required, string) - Domain name
- `accountId` (required, string) - Account ID
- `workflowId` (optional, string) - Workflow ID (filter)

**Response**: Workflow report object

**Risk Level**: Read-only

---

## Custom Field Groups Endpoints (5)

### List All Custom Field Groups
```
GET /custom-field-groups
```
**Purpose**: List all custom field groups

**Auth Required**: Yes

**Response**: Array of custom field group objects

**Risk Level**: Read-only

---

### Get Custom Field Group by ID
```
GET /custom-field-groups/{groupId}
```
**Purpose**: Get a custom field group by ID

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Custom field group ID

**Response**: Custom field group object

**Risk Level**: Read-only

---

### Create Custom Field Group
```
POST /custom-field-groups
```
**Purpose**: Create a new custom field group

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Group name

**Response**: Created custom field group object

**Risk Level**: Mutating

---

### Update Custom Field Group
```
PUT /custom-field-groups/{groupId}
```
**Purpose**: Update a custom field group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Custom field group ID

**Body Parameters**:
- `name` (optional, string) - Group name

**Response**: Updated custom field group object

**Risk Level**: Mutating

---

### Delete Custom Field Group
```
DELETE /custom-field-groups/{groupId}
```
**Purpose**: Soft-delete a custom field group

**Auth Required**: Yes

**Path Parameters**:
- `groupId` (required, string) - Custom field group ID

**Response**: Deleted custom field group object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

## Custom Fields Endpoints (5)

### List All Custom Fields
```
GET /custom-fields
```
**Purpose**: List all custom fields

**Auth Required**: Yes

**Response**: Array of custom field objects

**Risk Level**: Read-only

---

### Get Custom Field by ID
```
GET /custom-fields/{customFieldId}
```
**Purpose**: Get a custom field by ID

**Auth Required**: Yes

**Path Parameters**:
- `customFieldId` (required, string) - Custom field ID

**Response**: Custom field object

**Risk Level**: Read-only

---

### Create Custom Field
```
POST /custom-fields
```
**Purpose**: Create a new custom field

**Auth Required**: Yes

**Body Parameters**:
- `name` (required, string) - Field name
- `type` (optional, string) - Field type
- `groupId` (optional, string) - Field group ID

**Response**: Created custom field object

**Risk Level**: Mutating

---

### Update Custom Field
```
PUT /custom-fields/{customFieldId}
```
**Purpose**: Update a custom field

**Auth Required**: Yes

**Path Parameters**:
- `customFieldId` (required, string) - Custom field ID

**Body Parameters**:
- `name` (optional, string) - Field name
- `type` (optional, string) - Field type

**Response**: Updated custom field object

**Risk Level**: Mutating

---

### Delete Custom Field
```
DELETE /custom-fields/{customFieldId}
```
**Purpose**: Soft-delete a custom field

**Auth Required**: Yes

**Path Parameters**:
- `customFieldId` (required, string) - Custom field ID

**Response**: Deleted custom field object

**Risk Level**: Destructive (soft delete, requires confirmation)

---

## Sub-Users Endpoints (5)

### List All Sub-Users
```
GET /sub-users
```
**Purpose**: List all sub-users

**Auth Required**: Yes

**Response**: Array of sub-user objects

**Risk Level**: Read-only

---

### Get Sub-User by ID
```
GET /sub-users/{userId}
```
**Purpose**: Get a sub-user by ID

**Auth Required**: Yes

**Path Parameters**:
- `userId` (required, string) - Sub-user ID

**Response**: Sub-user object

**Risk Level**: Read-only

---

### Create Sub-User
```
POST /sub-users
```
**Purpose**: Create a new sub-user

**Auth Required**: Yes

**Body Parameters**:
- `firstName` (required, string) - First name
- `lastName` (required, string) - Last name
- `email` (required, string) - Email address
- `password` (required, string) - Password

**Response**: Created sub-user object

**Risk Level**: Admin/High-risk

---

### Update Sub-User
```
PUT /sub-users/{userId}
```
**Purpose**: Update a sub-user

**Auth Required**: Yes

**Path Parameters**:
- `userId` (required, string) - Sub-user ID

**Body Parameters**:
- `firstName` (optional, string) - First name
- `lastName` (optional, string) - Last name
- `email` (optional, string) - Email address
- `password` (optional, string) - Password

**Response**: Updated sub-user object

**Risk Level**: Mutating

---

### Delete Sub-User
```
DELETE /sub-users/{userId}
```
**Purpose**: Delete a sub-user

**Auth Required**: Yes

**Path Parameters**:
- `userId` (required, string) - Sub-user ID

**Response**: Deleted sub-user object

**Risk Level**: Destructive (requires confirmation)

---

## Integrations Endpoints (3)

### List All Integrations
```
GET /integrations
```
**Purpose**: List all available integrations

**Auth Required**: Yes

**Response**: Array of integration objects

**Risk Level**: Read-only

---

### List Connected Integrations
```
GET /integrations/connected
```
**Purpose**: List connected integrations

**Auth Required**: Yes

**Query Parameters**:
- Various filters (not fully documented)

**Response**: Array of connected integration objects

**Risk Level**: Read-only

---

### List Connected Integration Categories
```
GET /integrations/connected-categories
```
**Purpose**: List connected integration categories

**Auth Required**: Yes

**Response**: Array of category objects

**Risk Level**: Read-only

---

## Summary Statistics

**Total Endpoints:** 89

**By Resource:**
- Contacts: 13
- Tags: 11
- Tag Groups: 5
- Tag Labels: 5
- Workflows: 9
- Workflow Groups: 5
- Domains: 5
- Broadcast Emails: 8
- Email Reports: 3
- Custom Field Groups: 5
- Custom Fields: 5
- Sub-Users: 5
- Integrations: 3

**By Risk Level:**
- Read-only: 43
- Mutating: 28
- Destructive: 15
- Admin/High-risk: 3
