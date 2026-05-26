# LifeCharter Circle Email Sequence - Global Control Implementation Plan

## Overview
This document outlines the complete implementation plan for the 5-email nurture sequence with 7 pattern-specific variations in Global Control CRM.

## Email Sequence Structure

### TRIGGER
**Tag:** `snapshot-complete`
- Applied when contact completes the LifeCharter Alignment Snapshot
- Starts the workflow automation

### EMAIL 1 - Immediate (0 min delay)
**Subject:** Your Alignment Snapshot is ready
**Preview Text:** Welcome, fellow traveler. Your results are here.

**Content:** Welcome email with snapshot results attached, warm invitation to Circle
**CTA:** [View Your Full Results] → https://life-charter.vercel.app/

---

### EMAIL 2 - Day 2 (48 hours after Email 1)
**Subject:** What your pattern reveals about your next step
**Preview Text:** Pattern-specific preview

**7 VERSIONS based on pattern tag:**

1. **pattern-overextended-giver** → Overextended Giver version
2. **pattern-sacred-drifter** → Sacred Drifter version
3. **pattern-quiet-achiever** → Quiet Achiever version
4. **pattern-survival-strategist** → Survival Strategist version
5. **pattern-disconnected-visionary** → Disconnected Visionary version
6. **pattern-relationship-tethered** → Relationship-Tethered Traveler version
7. **pattern-purpose-ready** → Purpose-Ready Butterfly version

**Fallback:** Generic version if no pattern tag

**CTA:** [Learn more about the Circle →] → https://life-charter.vercel.app/

---

### EMAIL 3 - Day 5 (72 hours after Email 2)
**Subject:** The gap between knowing and living
**Preview Text:** You already have the awareness. What you need is the container.

**Content:** Bridge from awareness to container, introduces Circle as the solution
**CTA:** [Step Into the Circle →] → https://life-charter.vercel.app/

---

### EMAIL 4 - Day 9 (96 hours after Email 3)
**Subject:** What changes when you have a container
**Preview Text:** I stopped collecting information and started living from alignment. Here's what happened.

**Content:** Babs' transformation story, testimonial quote
**CTA:** [This Is What Circle Exists to Give You →] → https://life-charter.vercel.app/

---

### EMAIL 5 - Day 14 (120 hours after Email 4)
**Subject:** This invitation closes in two weeks
**Preview Text:** When you receive this, the door is open. Two weeks from today, it closes.

**Content:** Evergreen deadline explanation, pricing, final invitation
**Pricing:** $2,497 pay-in-full OR 3 payments of $850
**CTA:** [Join before this window closes →] → https://life-charter.vercel.app/

---

## Tags Required

### Trigger Tags
- `snapshot-complete` - Triggers the workflow

### Pattern Tags (for Email 2 segmentation)
- `pattern-overextended-giver`
- `pattern-sacred-drifter`
- `pattern-quiet-achiever`
- `pattern-survival-strategist`
- `pattern-disconnected-visionary`
- `pattern-relationship-tethered`
- `pattern-purpose-ready`

### Completion/Interest Tags
- `circle-sequence-complete` - Applied after Email 5
- `circle-interested` - Applied when contact clicks Circle link
- `circle-member` - Stop sequence if enrolled

## Workflow Logic

```
TRIGGER: Tag "snapshot-complete" applied

┌─────────────────────────────────────────────────────────────┐
│ START                                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ EMAIL 1: Immediate                                          │
│ Subject: Your Alignment Snapshot is ready                   │
│ Delay: 0 minutes                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ WAIT: 48 hours (2 days)                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ CHECK: Has pattern tag?                                     │
│ IF pattern-overextended-giver → Send Email 2A               │
│ IF pattern-sacred-drifter → Send Email 2B                   │
│ IF pattern-quiet-achiever → Send Email 2C                   │
│ IF pattern-survival-strategist → Send Email 2D              │
│ IF pattern-disconnected-visionary → Send Email 2E           │
│ IF pattern-relationship-tethered → Send Email 2F            │
│ IF pattern-purpose-ready → Send Email 2G                    │
│ ELSE → Send Email 2 (Generic)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ WAIT: 72 hours (3 days)                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ EMAIL 3: Day 5                                              │
│ Subject: The gap between knowing and living                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ WAIT: 96 hours (4 days)                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ EMAIL 4: Day 9                                              │
│ Subject: What changes when you have a container             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ WAIT: 120 hours (5 days)                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ EMAIL 5: Day 14                                             │
│ Subject: This invitation closes in two weeks                │
│ Tag: circle-sequence-complete                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ END                                                         │
└─────────────────────────────────────────────────────────────┘
```

## Stop Conditions

The workflow should STOP if any of these occur:
1. Contact receives tag `circle-member` (enrolled in Circle)
2. Contact unsubscribes
3. Contact email bounces

## Click Tracking

All CTA links should:
1. Link to: https://life-charter.vercel.app/
2. Apply tag `circle-interested` when clicked
3. Be tracked for analytics

## Merge Fields

All emails should use:
- `[First Name]` - Contact's first name

## Implementation Steps

### Step 1: Create Tags
1. Create tag group "LifeCharter Patterns" (if doesn't exist)
2. Create all 7 pattern tags
3. Create tag group "LifeCharter Sequences" (if doesn't exist)
4. Create tags: `snapshot-complete`, `circle-sequence-complete`, `circle-interested`, `circle-member`

### Step 2: Create Workflow Group
Create workflow group: "LifeCharter Circle Sequence"

### Step 3: Create Workflow
Create workflow: "LifeCharter Circle Email Sequence"
- Trigger: Tag `snapshot-complete` applied
- Configure all 5 emails with proper delays
- Set up conditional logic for Email 2

### Step 4: Configure Email Content
Load all email content from `lifecharter-circle-emails-final.md`
- Replace [First Name] with merge field
- Replace CTA links with https://life-charter.vercel.app/
- Add click tracking

### Step 5: Set Up Goals/Stop Conditions
- Add goal: Tag `circle-member` → Remove from workflow
- Add click goal: Link click → Tag `circle-interested`

### Step 6: Test
1. Create test contact with email: mariposa@agentmail.to
2. Apply `snapshot-complete` tag
3. Verify Email 1 sends immediately
4. Manually advance through sequence to verify all emails
5. Test pattern-specific Email 2 variations

## API Implementation Notes

### Create Workflow
```bash
POST https://api.globalcontrol.io/api/ai/workflows
Headers:
  X-API-KEY: {GLOBAL_CONTROL_API_KEY}
  Content-Type: application/json

Body:
{
  "name": "LifeCharter Circle Email Sequence",
  "workflowGroupId": "{group_id}",
  "flows": [
    {
      "name": "Email 1 - Welcome",
      "delay": 0,
      "email": {
        "subject": "Your Alignment Snapshot is ready",
        "body": "...",
        "fromName": "Babs",
        "fromEmail": "amilynne@amilynnecarroll.com"
      }
    },
    {
      "name": "Email 2 - Pattern Specific",
      "delay": 2880, // 48 hours in minutes
      "conditions": [
        // Pattern-based conditions
      ]
    },
    // ... more flows
  ],
  "goals": [
    {
      "type": "tag",
      "tagId": "{circle-member-tag-id}",
      "action": "remove_from_workflow"
    }
  ]
}
```

### Update Flow
```bash
PUT https://api.globalcontrol.io/api/ai/workflows/{workflowId}/{flowId}
Headers:
  X-API-KEY: {GLOBAL_CONTROL_API_KEY}
  Content-Type: application/json

Body:
{
  "email": {
    "subject": "...",
    "body": "..."
  },
  "delay": 2880
}
```

## Deliverables

1. ✅ Global Control workflow ID
2. ✅ All 7 pattern branches configured
3. ✅ Test email sent to mariposa@agentmail.to
4. ✅ Confirmation document with workflow details

## Status

- [ ] Step 1: Create Tags
- [ ] Step 2: Create Workflow Group
- [ ] Step 3: Create Workflow
- [ ] Step 4: Configure Email Content
- [ ] Step 5: Set Up Goals
- [ ] Step 6: Test
- [ ] Step 7: Document Workflow ID
