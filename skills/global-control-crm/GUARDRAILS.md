# Global Control CRM API Skill - Guardrails

This document defines safety policies, constraints, and refusal behaviors for the Global Control CRM API skill.

---

## 1. Destructive Operation Policies

### 1.1 Hard Delete Operations (CANNOT BE UNDONE)

**Contact Deletion:**
- ✅ **Always require explicit confirmation**
- Must fetch contact details first
- Display: name, email, tags, workflows, creation date
- Warn: "This is a HARD DELETE and CANNOT be undone"
- Require user to type exactly "yes" to proceed
- Any other response cancels the operation

**Example confirmation flow:**
```
⚠️ DELETE CONFIRMATION REQUIRED

You are about to permanently delete:
👤 John Doe (john@example.com)
• Tags: Newsletter, Premium
• In workflows: Welcome Series
• Created: 30 days ago
• This is a HARD DELETE and CANNOT be undone

Type 'yes' to confirm deletion, or anything else to cancel.
```

### 1.2 Soft Delete Operations (Marked as deleted, recoverable)

**Resources that soft-delete:**
- Tags and tag groups
- Workflows and workflow groups
- Domains
- Custom fields and custom field groups
- Tag labels

**Policy:**
- ⚠️ Still require explicit confirmation
- Display what will be affected
- Show dependent resources (e.g., contacts with this tag)
- Warn that resource will be marked deleted
- Allow cancellation

### 1.3 Sub-User Deletion

**Policy:**
- ⚠️ Require confirmation
- Display sub-user details (name, email, permissions)
- Warn about access removal
- Check if sub-user has active sessions
- Only proceed with exact "yes" confirmation

### 1.4 Workflow Flow Operations

**Releasing contacts from flows:**
- ⚠️ HIGH RISK - affects queued contacts
- Require confirmation
- Display: workflow name, flow name, number of contacts affected
- Warn about impact on automation
- Show affected contact count before proceeding

**Example:**
```
⚠️ RELEASE CONTACTS CONFIRMATION

You are about to release 45 contacts from:
⚙️ Welcome Series → Day 3 Follow-up

These contacts will be removed from the queue and will not receive
subsequent emails in this workflow.

Type 'yes' to confirm, or anything else to cancel.
```

---

## 2. Broadcast Email Safety

### 2.1 Pre-Send Validation

**Before sending any broadcast email:**
1. ✅ **Get recipient count first** using appropriate endpoint:
   - `/broadcast-emails/active-contacts-count`
   - `/broadcast-emails/inactive-contacts-count`
   - `/broadcast-emails/new-contacts-count`
   - `/broadcast-emails/passive-contacts-count`
   - `/broadcast-emails/dead-contacts-count`

2. ✅ **Display confirmation with:**
   - Exact recipient count
   - Target segment description
   - Subject line
   - Message preview (first 100 chars)
   - Warning about real email sending

3. ✅ **Require explicit "yes" confirmation**

### 2.2 Large Broadcast Warnings

**Thresholds:**
- 100+ contacts: ⚠️ Standard warning
- 500+ contacts: ⚠️⚠️ Enhanced warning with double confirmation
- 1000+ contacts: ⚠️⚠️⚠️ Require additional confirmation step

**Example for large broadcasts:**
```
⚠️⚠️⚠️ LARGE BROADCAST EMAIL CONFIRMATION

You are about to send an email to 1,234 contacts.

Subject: Special Offer - 50% Off
Recipients: Active contacts (opened in last 30 days)

This will send 1,234 REAL EMAILS and CANNOT be undone.
This may impact your sending reputation if content is not well-crafted.

Type 'yes' to confirm sending, or anything else to cancel.
```

### 2.3 Broadcast Email Content Validation

**Before sending, verify:**
- Subject line is not empty
- Message content exists
- SMTP config is valid and complete
- From email is configured
- No placeholder text like "{{name}}" remains unsubstituted

### 2.4 Prohibited Actions

**Never:**
- Send broadcasts without explicit user confirmation
- Send to "all contacts" without segment filtering
- Proceed if recipient count fails to load
- Send without valid SMTP configuration
- Send to undeliverable/bounced email list

---

## 3. Workflow Management Rules

### 3.1 Workflow Update Safety

**Before updating workflow flows:**
1. ✅ **MUST fetch current workflow first** - API requirement
2. Modify the flows array
3. Send complete updated workflow back
4. Never partial-update flows without fetching current state

**Rationale:** API requires full workflow object with flows array for updates.

### 3.2 Workflow Deletion Checks

**Before deleting workflow:**
- Check if workflow has contacts in queue
- Display active contact count
- Warn about impact on in-progress automations
- Show workflow group if applicable
- Require confirmation

### 3.3 Flow Management

**When updating/deleting individual flows:**
- Fetch parent workflow first
- Show flow position in sequence
- Display delay settings
- Warn about contacts currently in this flow
- Require confirmation for deletion

---

## 4. Contact Management Policies

### 4.1 Contact Creation

**Validation required:**
- ✅ Email format validation (must be valid email)
- ⚠️ Check for duplicates before creating (optional but recommended)
- Sanitize input fields (firstName, lastName, phone)
- Validate custom field types match schema

### 4.2 Contact Updates

**Safe operations:**
- Update firstName, lastName, phone - no confirmation needed
- Update custom fields - validate types first
- Add tags - no confirmation needed
- Remove from workflows - requires confirmation

### 4.3 Bulk Operations

**If implementing bulk operations:**
- Maximum 100 contacts per batch (safety limit)
- Show progress for operations affecting 10+ contacts
- Allow cancellation mid-operation
- Report success/failure counts

### 4.4 Contact Segmentation Safety

**When working with segments:**
- **Dead contacts (141):** Use caution - these may hurt deliverability
- **Undeliverable contacts (199):** Do NOT send broadcasts to this segment
- **Passive contacts:** May need re-engagement strategy
- **New contacts:** Ensure proper opt-in before emailing

---

## 5. Tag Management Policies

### 5.1 Tag Firing (Applying Tags)

**Safe operations:**
- Fire single tag - no confirmation needed
- Fire multiple tags - no confirmation needed
- Validate tag IDs exist before firing
- Use email address (not contact ID) as required by API

### 5.2 Tag Deletion

**Before deleting tag:**
- Display contacts affected count
- Show tag group
- Warn about impact on segmentation
- Show if tag is used in workflows
- Require confirmation

### 5.3 Tag Group Deletion

**Before deleting tag group:**
- Display all tags in group
- Show total contacts affected
- Warn that all tags in group will be deleted
- Require confirmation

---

## 6. Rate Limiting & Quotas

### 6.1 API Rate Limits

**Status:** Not documented by Global Control API

**Conservative approach:**
- Implement 100 requests/minute client-side limit
- Use exponential backoff on 429 responses: 1s, 2s, 4s, 8s, 16s
- Warn user if approaching limit: "⏸️ Approaching rate limit. Pausing briefly..."

### 6.2 Batch Operation Limits

**Recommended limits:**
- Contact creation: 50 per batch
- Tag firing: 100 contacts per batch
- Workflow enrollment: 50 contacts per batch
- Broadcast emails: No enforced limit, but warn at 500+

### 6.3 Retry Strategy

**For transient failures:**
- Network errors: Retry up to 3 times with exponential backoff
- 5xx errors: Retry up to 2 times
- 429 rate limit: Wait specified time or use exponential backoff
- 4xx errors: Do NOT retry (client error)

---

## 7. Credential & Authentication Safety

### 7.1 API Key Handling

**Storage:**
- ✅ Store in local skill-scoped `.env` file only
- ✅ Protected by `.gitignore`
- ❌ Never log API key
- ❌ Never include in error messages
- ❌ Never export or share

**First-run behavior:**
```
If GLOBAL_CONTROL_API_KEY is missing:
1. Prompt: "Please provide your Global Control API key (GLOBAL_CONTROL_API_KEY)"
2. Store in skills/global-control-crm/.env
3. Confirm: "✅ API key stored securely"
4. Do NOT proceed until provided
```

### 7.2 Invalid Authentication Handling

**On 401 Unauthorized:**
```
❌ Invalid API key. Check your GLOBAL_CONTROL_API_KEY.

Your API key may be:
• Incorrect
• Expired
• Revoked

Please update your API key in skills/global-control-crm/.env
```

**Do NOT:**
- Retry automatically with same key
- Expose key in error message
- Continue operations with invalid auth

---

## 8. Data Validation Requirements

### 8.1 Email Validation

**Required for:**
- Contact creation
- Contact updates (if email changed)
- Tag firing
- Broadcast recipient lists

**Validation rules:**
- Must contain @ symbol
- Must have domain part
- No spaces
- Maximum 254 characters
- Basic RFC 5322 compliance

### 8.2 SMTP Configuration

**When constructing SMTP config:**
- Validate host is not empty
- Validate port is numeric (25, 465, 587, 2525)
- Require username and password
- Validate from email format
- Validate from name is not empty

**Required fields:**
```json
{
  "host": "smtp.example.com",
  "port": 587,
  "username": "user@example.com",
  "password": "***",
  "fromEmail": "noreply@example.com",
  "fromName": "Company Name"
}
```

### 8.3 Workflow Flow Validation

**When creating/updating flows:**
- Validate delay values are positive integers
- Validate email content is not empty
- Validate subject line exists
- Check flow index is within bounds
- Ensure flow type is valid

---

## 9. Refusal Scenarios

### 9.1 Automatic Refusals

**Always refuse:**

1. **Unsupported Operations:**
   ```
   "I only support: contact, tag, tag group, workflow, domain, broadcast email, 
   report, custom field, sub-user, and integration management as documented 
   in the Global Control API."
   ```

2. **Operations without proper authentication:**
   ```
   "Cannot proceed without valid GLOBAL_CONTROL_API_KEY. 
   Please configure your API key first."
   ```

3. **Destructive operations without confirmation:**
   ```
   "This is a destructive operation that requires explicit confirmation. 
   Please confirm by typing 'yes'."
   ```

4. **Broadcasts to undeliverable contacts:**
   ```
   "Cannot send broadcast to undeliverable contacts. This will damage 
   your sender reputation. Please select a different segment."
   ```

5. **Missing required parameters:**
   ```
   "Missing required parameter: {parameter_name}. 
   Cannot proceed without this value."
   ```

### 9.2 Soft Refusals (Warnings)

**Warn but allow if user confirms:**

1. **Large broadcasts (500+):**
   ```
   "⚠️ You are about to send to 500+ contacts. 
   Ensure your content is well-crafted to avoid spam complaints."
   ```

2. **Deleting resources with dependencies:**
   ```
   "⚠️ This tag is used in 3 workflows. 
   Deleting it may affect automation logic."
   ```

3. **Updating live workflows:**
   ```
   "⚠️ This workflow has 34 contacts in queue. 
   Changes will affect in-progress automations."
   ```

---

## 10. Error Recovery Patterns

### 10.1 Network Failures

**On network error:**
```
❌ Network error. Please check your connection and try again.

Error details: {brief_error_message}
```

**Recovery:**
- Suggest retry
- Do not auto-retry more than 3 times
- Preserve user input for retry

### 10.2 API Errors

**400 Bad Request:**
```
❌ Invalid request. {API error message}

Please check your input and try again.
```

**403 Forbidden:**
```
❌ Access forbidden. Check your API key permissions.

Your API key may not have access to this resource.
```

**404 Not Found:**
```
❌ Resource not found. Check the provided ID.

The contact/tag/workflow you're looking for doesn't exist or was deleted.
```

**409 Conflict:**
```
❌ Conflict. {API conflict message}

This may mean the resource already exists or state has changed.
```

**429 Rate Limit:**
```
⏸️ Rate limit exceeded. Waiting 30 seconds before retry...

Your API usage is at its limit. Slowing down requests.
```

**5xx Server Error:**
```
❌ Global Control API error. Try again later.

The API is experiencing issues. This is not a problem with your request.
```

### 10.3 Partial Failures

**For batch operations:**
```
⚠️ Partial success: 45/50 contacts processed

Succeeded: 45
Failed: 5

Failed contacts:
• contact_123: Invalid email format
• contact_456: Duplicate email
...

Would you like to retry failed contacts?
```

---

## 11. Complex Object Handling

### 11.1 SMTP Configuration

**Required before broadcast:**
- Prompt user for all required fields
- Validate each field
- Test configuration if possible (optional)
- Store for reuse (optional)

**Never:**
- Proceed with incomplete SMTP config
- Use hardcoded credentials
- Expose SMTP passwords in logs

### 11.2 Workflow Flows

**When constructing flows:**
- Fetch current workflow first (API requirement)
- Preserve existing flows unless explicitly modifying
- Validate flow structure before sending
- Show preview of flow changes

### 11.3 Custom Fields

**When working with custom fields:**
- Validate field types match expected types
- Check field belongs to correct group
- Ensure field exists before using in operations
- Handle missing custom field groups gracefully

---

## 12. Edge Cases & Special Scenarios

### 12.1 Empty Result Sets

**When lists return 0 items:**
```
📝 No contacts found.

Create your first contact:
/gc-create-contact --email "user@example.com" --firstName "John"
```

### 12.2 Very Large Lists

**When total > 1000:**
- Show pagination controls
- Warn about performance
- Suggest filtering/segmentation
- Limit display to 100 items max

### 12.3 Duplicate Detection

**On contact creation:**
- API may allow duplicates
- Warn if email already exists (if detectable)
- Suggest updating existing contact instead

### 12.4 Concurrent Modifications

**If resource changed since last fetch:**
```
⚠️ Resource was modified by another user/process.

Please fetch the latest version and try again.
```

---

## 13. User Experience Guidelines

### 13.1 Progress Indicators

**For long-running operations:**
- Show progress for 10+ item operations
- Allow cancellation
- Report partial results if cancelled

### 13.2 Success Confirmations

**Always confirm successful operations:**
```
✅ Contact created successfully!

👤 John Doe (john@example.com)
ID: contact_123

Next steps:
• View details: /gc-contact contact_123
• Add tags: /gc-fire-tag tag_456 --email "john@example.com"
```

### 13.3 Error Messages

**Format:**
```
❌ {Operation} failed

{User-friendly explanation}

{Actionable suggestion}
```

**Never:**
- Show raw stack traces
- Expose internal implementation details
- Use technical jargon without explanation

---

## 14. Audit & Logging

### 14.1 What to Log (Internal)

**Log for debugging:**
- Operation type and timestamp
- Resource IDs involved
- Success/failure status
- Error messages (sanitized)

**Never log:**
- API keys or credentials
- Full email addresses (hash or mask)
- SMTP passwords
- User passwords

### 14.2 User-Facing Activity

**Optionally show user:**
```
📊 Recent Operations:

1. Created contact: john@example.com (5 minutes ago)
2. Fired tag "Newsletter" (10 minutes ago)
3. Sent broadcast to 234 contacts (1 hour ago)
```

---

## 15. Summary of Critical Rules

**ALWAYS:**
- ✅ Require confirmation for destructive operations
- ✅ Validate email formats
- ✅ Fetch current state before workflow updates
- ✅ Protect API key (local .env only)
- ✅ Get recipient count before broadcast
- ✅ Show clear warnings for high-risk actions

**NEVER:**
- ❌ Delete without confirmation
- ❌ Send broadcasts without confirmation
- ❌ Expose API keys in logs/errors
- ❌ Auto-retry 4xx errors
- ❌ Send to undeliverable contacts
- ❌ Update workflows without fetching first
- ❌ Proceed with incomplete SMTP config

**ON ERROR:**
- 🔄 Retry network/5xx errors (with backoff)
- ⏸️ Respect 429 rate limits
- 🚫 Stop on 4xx errors (client error)
- 📢 Always provide clear user feedback

---

## Version History

- **v1.0.0** (2026-03-31): Initial guardrails document
  - Destructive operation policies
  - Broadcast email safety
  - Workflow management rules
  - Contact policies
  - Rate limiting guidelines
  - Credential handling
  - Error recovery patterns
