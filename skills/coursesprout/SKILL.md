# CourseSprout Skill

**Complete API wrapper for CourseSprout course management platform.**

**Status:** Production Ready ✅  
**Endpoints:** 21  
**Safety Level:** HIGH (All side-effects gated)

---

## Overview

CourseSprout API provides comprehensive course and membership management capabilities:

- **Courses:** Create, update, list, pricing options
- **Memberships (Pods):** Create, update, list, pricing options  
- **Members:** Advanced filtering, UPSERT, email access, reminders
- **Lessons:** Create and update lessons within courses/pods
- **Gamification:** Goals with points/badges
- **AI Retrieval:** Badges, goals, topics, chapters

**Authentication:** X-API-KEY header (required on all requests)

---

## Quick Start

### Setup

1. Get your API key from CourseSprout dashboard
2. Set environment variable:
   ```powershell
   $env:COURSESPROUT_API_KEY = "your_api_key_here"
   ```

3. Test connection:
   ```powershell
   # In OpenClaw, ask: "Test my CourseSprout API connection"
   ```

---

## API Reference

### Authentication

**Method:** X-API-KEY header  
**Base URL:** `https://api.coursesprout.com/api/ai`

**Environment Variable:** `COURSESPROUT_API_KEY`

---

## Courses

### List Courses
**Get all courses owned by authenticated user.**

```
GET /api/ai/get-course
```

**OpenClaw Command:**
```
"List my CourseSprout courses"
"Show all courses"
```

**Response:**
```json
{
  "success": true,
  "message": "Data found.",
  "data": [
    {"id": 1, "title": "My Course Title"},
    {"id": 2, "title": "Another Course"}
  ]
}
```

---

### List Courses by Pod
**Get all courses associated with a specific membership/pod.**

```
GET /api/ai/get-course-by-pod/:membership_id
```

**Parameters:**
- `membership_id` (integer, required) - Pod ID

**OpenClaw Command:**
```
"List courses in pod 5"
"Show courses for membership 3"
```

---

### Get Course Pricing Options
**Retrieve all pricing options for a specific course.**

```
GET /api/ai/get-course-pricing-option/:course_id
```

**Parameters:**
- `course_id` (integer, required) - Course ID

**OpenClaw Command:**
```
"Get pricing options for course 1"
"Show course 5 pricing"
```

**Response:**
```json
{
  "success": true,
  "data": [{
    "id": 1,
    "course_id": 1,
    "name": "Basic Plan",
    "user_id": 1,
    "is_full_access": 0,
    "default_password": null
  }]
}
```

---

### Create Course
**Create a new course (also auto-creates first lesson, chapter, and default pricing option).**

```
POST /api/ai/create-course
```

**Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "main_color": "#3b82f6"
}
```

**Parameters:**
- `title` (string, required, max 255) - Course title
- `description` (string, optional) - Course description
- `main_color` (string, optional) - Hex color code

**OpenClaw Command:**
```
"Create a CourseSprout course called 'AI Mastery'"
"Create course: title='Marketing 101', description='Learn marketing basics'"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

**Auto-creates:**
- First lesson
- First chapter
- Default pricing option

---

### Update Course
**Update an existing course.**

```
POST /api/ai/update-course
```

**Body:**
```json
{
  "course_id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "main_color": "#10b981"
}
```

**Parameters:**
- `course_id` (integer, required) - Course ID to update
- `title` (string, optional) - New title
- `description` (string, optional) - New description
- `main_color` (string, optional) - New color

**OpenClaw Command:**
```
"Update course 1 title to 'New Title'"
"Change course 5 description to 'Updated content'"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

## Memberships (Pods)

### List Pods
**Get all memberships/pods owned by authenticated user.**

```
GET /api/ai/get-pods
```

**OpenClaw Command:**
```
"List my CourseSprout pods"
"Show all memberships"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "My Pod"},
    {"id": 2, "name": "Another Pod"}
  ]
}
```

---

### Get Pod Pricing Options
**Retrieve all pricing options for a specific pod.**

```
GET /api/ai/get-pod-pricing-option/:course_id
```

**⚠️ NOTE:** Path parameter is named `:course_id` but expects **membership/pod ID**

**Parameters:**
- `pod_id` (integer, required) - Pod ID (mapped to :course_id in URL)

**OpenClaw Command:**
```
"Get pricing options for pod 2"
"Show membership 3 pricing"
```

---

### Create Pod
**Create a new membership/pod (also auto-creates default pricing option).**

```
POST /api/ai/create-pod
```

**Body:**
```json
{
  "name": "Premium Membership",
  "description": "Exclusive content access",
  "main_color": "#8b5cf6"
}
```

**Parameters:**
- `name` (string, required, max 255) - Pod name
- `description` (string, optional) - Pod description
- `main_color` (string, optional) - Hex color code

**OpenClaw Command:**
```
"Create a CourseSprout pod called 'VIP Members'"
"Create membership: name='Elite Pod', description='Premium access'"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

**Auto-creates:**
- Default pricing option

---

### Update Pod
**Update an existing pod.**

```
POST /api/ai/update-pod
```

**Body:**
```json
{
  "membership_id": 2,
  "name": "Updated Pod Name",
  "description": "Updated description",
  "main_color": "#f59e0b"
}
```

**Parameters:**
- `membership_id` (integer, required) - Pod ID to update
- `name` (string, optional) - New name
- `description` (string, optional) - New description
- `main_color` (string, optional) - New color

**OpenClaw Command:**
```
"Update pod 2 name to 'Elite Members'"
"Change membership 3 color to #ff0000"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

## Members

### Get Members (Advanced Filtering)
**Retrieve paginated list of members with powerful filtering.**

```
GET /api/ai/get-members
```

**Query Parameters:**
- `search` (string, optional) - Search by first name, last name, full name, or email
- `type` (string, optional, default: "all") - Filter by type: `all`, `course`, or `membership`
- `course_id` (integer, optional) - Filter by course ID (only effective when `type=course`)
- `pod_id` (integer, optional) - Filter by pod ID (only effective when `type=membership`)
- `pricing_option_id` (integer, optional) - Filter by pricing option ID
- `per_page` (integer, optional, default: 10) - Results per page

**Filtering Logic:**
- `type=all`: Returns all members (default)
- `type=course`: Returns members with course access
- `type=membership`: Returns members with pod access
- `course_id` only works when `type=course`
- `pod_id` only works when `type=membership`
- `pricing_option_id` works with both course and membership types

**OpenClaw Commands:**
```
"List all my CourseSprout members"
"Search members for 'john'"
"Get members of course 5"
"Get members with type course"
"Show members of pod 3"
"Find members by pricing option 12"
"Search 'jane' in membership 3"
```

**Response (Laravel Pagination):**
```json
{
  "success": true,
  "message": "Data fetched.",
  "items": [
    {
      "id": 1,
      "user_id": 10,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "user": {
        "email": "john@example.com",
        "courses": [],
        "memberships": [],
        "pricingOptions": [],
        "extraCourses": []
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total": 15,
    "per_page": 10,
    "last_page": 2
  }
}
```

---

### Add or Update User (UPSERT)
**Add new user or update existing user based on email.**

```
POST /api/ai/add-user
```

**Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "custompass",
  "pricing_option_id": 789
}
```

**Parameters:**
- `first_name` (string, required) - User first name
- `last_name` (string, required) - User last name
- `email` (string, required) - User email (determines create vs update)
- `password` (string, optional) - User password (defaults to pricing option default or 'pass5511')
- `pricing_option_id` (integer, required) - Pricing option ID to grant access

**Behavior:**
- If email **exists**: Updates user and adds pricing option access
- If email **doesn't exist**: Creates new user with access

**Password Defaults:**
1. Provided password (if given)
2. Pricing option's `default_password` (if set)
3. Fallback: `pass5511`

**OpenClaw Command:**
```
"Add user John Doe with email john@test.com to pricing option 789"
"Create member: first_name='Jane', last_name='Smith', email='jane@test.com', pricing_option_id=12"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

**Response (uses 'user' key):**
```json
{
  "success": true,
  "message": "User added successfully.",
  "data": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
}
```

---

### Send Access Email
**Send course access email to a member.**

```
POST /api/ai/send-email
```

**Body:**
```json
{
  "member_id": 123
}
```

**Parameters:**
- `member_id` (integer, required) - Member ID to send email to

**OpenClaw Command:**
```
"Send access email to member 123"
"Email login credentials to member 456"
```

**⚠️ REQUIRES CONFIRMATION** - Email send operation

**Sends:** Course access email with login credentials

---

### Send Reminder Email (BULK)
**Send reminder emails to inactive members of a pricing option.**

```
POST /api/ai/send-reminder-email
```

**Body:**
```json
{
  "pricing_option_id": 456
}
```

**Parameters:**
- `pricing_option_id` (integer, required) - Pricing option ID

**Targeting Logic:**
- Only sends to **inactive** members
- Only sends to **non-archived** members
- **BULK OPERATION** - may send to many users

**OpenClaw Command:**
```
"Send reminder email to pricing option 456"
"Email inactive members of pricing option 12"
```

**⚠️ REQUIRES CONFIRMATION** - Bulk email operation

---

## Lessons

### Create Lesson
**Create a new lesson in a course or pod.**

```
POST /api/ai/create-lesson
```

**Body:**
```json
{
  "course_id": 1,
  "chapter_id": 5,
  "title": "Lesson 1: Introduction",
  "description": "Welcome to the course",
  "type": "video"
}
```

**Parameters:**
- `course_id` (integer, required if no `membership_id`) - Course ID
- `membership_id` (integer, required if no `course_id`) - Pod ID
- `chapter_id` (integer, required) - Chapter ID
- `title` (string, required) - Lesson title
- `description` (string, optional) - Lesson description
- `type` (string, optional, default: "video") - Lesson type

**⚠️ Mutually Exclusive:** Must provide **either** `course_id` **OR** `membership_id` (not both)

**OpenClaw Command:**
```
"Create lesson in course 1, chapter 5: title='Introduction'"
"Add lesson to pod 3, chapter 2: 'Getting Started'"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

### Update Lesson
**Update an existing lesson.**

```
POST /api/ai/update-lesson
```

**Body:**
```json
{
  "lesson_id": 5,
  "title": "Updated Lesson Title",
  "description": "Updated description",
  "type": "text"
}
```

**Parameters:**
- `lesson_id` (integer, required) - Lesson ID to update
- `title` (string, optional) - New title
- `description` (string, optional) - New description
- `type` (string, optional) - New type

**OpenClaw Command:**
```
"Update lesson 5 title to 'Advanced Concepts'"
"Change lesson 10 type to 'video'"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

## Gamification

### Create Goal
**Create a gamification goal for a course.**

```
POST /api/ai/create-goal
```

**Body:**
```json
{
  "course_id": 1,
  "title": "Complete Module 1",
  "description": "Finish all lessons",
  "type": "points",
  "points": 100,
  "is_community": false
}
```

**Parameters:**
- `course_id` (integer, required) - Course ID
- `title` (string, required) - Goal title
- `description` (string, optional) - Goal description
- `type` (string, required) - Goal type: `points`, `badge`, or `none`
- `points` (integer, required if `type=points`) - Points value
- `badge_id` (integer, required if `type=badge`) - Badge ID
- `is_community` (boolean, optional, default: false) - Community goal flag

**Conditional Requirements:**
- If `type=points`: `points` required
- If `type=badge`: `badge_id` required

**OpenClaw Command:**
```
"Create goal for course 1: 'Complete Module 1', type=points, points=100"
"Add badge goal to course 5: 'First Achievement', badge_id=3"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

### Update Goal
**Update an existing gamification goal.**

```
POST /api/ai/update-goal
```

**Body:**
```json
{
  "goal_id": 3,
  "title": "Updated Goal",
  "points": 150,
  "is_community": true
}
```

**Parameters:**
- `goal_id` (integer, required) - Goal ID to update
- `title` (string, optional) - New title
- `description` (string, optional) - New description
- `type` (string, optional) - New type
- `points` (integer, optional) - New points
- `badge_id` (integer, optional) - New badge ID
- `is_community` (boolean, optional) - Community flag

**OpenClaw Command:**
```
"Update goal 3 points to 150"
"Change goal 5 to community goal"
```

**⚠️ REQUIRES CONFIRMATION** - Side-effect operation

---

## AI Retrieval

### Get Badges
**Retrieve all badges for a specific course.**

```
GET /api/ai/get-badges?course_id=X
```

**Parameters:**
- `course_id` (integer, required) - Course ID

**OpenClaw Command:**
```
"Get badges for course 1"
"List badges in course 5"
```

---

### Get Goals
**Retrieve all goals for a specific course.**

```
GET /api/ai/get-goals?course_id=X
```

**Parameters:**
- `course_id` (integer, required) - Course ID

**OpenClaw Command:**
```
"Get goals for course 1"
"Show course 3 goals"
```

---

### Get Community Topics
**Retrieve all community topics for a specific course.**

```
GET /api/ai/get-community-topics?course_id=X
```

**Parameters:**
- `course_id` (integer, required) - Course ID

**OpenClaw Command:**
```
"Get community topics for course 1"
"List topics in course 7"
```

---

### Get Chapters
**Retrieve all chapters for a course or pod.**

```
GET /api/ai/get-chapters
```

**Query Parameters:**
- `course_id` (integer, required if no `membership_id`) - Course ID
- `membership_id` (integer, required if no `course_id`) - Pod ID

**⚠️ Mutually Exclusive:** Must provide **either** `course_id` **OR** `membership_id` (not both)

**OpenClaw Command:**
```
"Get chapters for course 1"
"List chapters in pod 3"
```

---

## Error Handling

### Authentication Errors

**Missing API Key:**
```json
{
  "success": false,
  "error": "API Key is required",
  "code": "AUTH_MISSING"
}
```

**Invalid API Key:**
```json
{
  "success": false,
  "error": "Invalid API Key",
  "code": "AUTH_INVALID"
}
```

---

### Validation Errors

**422 Validation Error:**
```json
{
  "success": false,
  "error": "Validation errors occurred.",
  "code": "VALIDATION_ERROR",
  "validation_errors": {
    "title": ["The title field is required."],
    "email": ["The email must be a valid email address."]
  }
}
```

---

### Not Found Errors

**404 Not Found:**
```json
{
  "success": false,
  "error": "Data not found.",
  "code": "NOT_FOUND"
}
```

---

## Safety Features

### Confirmation Gates
All side-effect operations require explicit confirmation:

**Operations requiring confirmation:**
- Create/Update Course
- Create/Update Pod
- Create/Update Lesson
- Create/Update Goal
- Add/Update User
- Send Email
- Send Reminder Email

**Dry-Run Mode:**
Preview operations without executing:
```
"Preview creating course 'Test Course' (dry-run)"
"Show what happens if I add user john@test.com (don't execute)"
```

---

### Validation

**Enum Validation:**
- `type` (Get Members): `all`, `course`, `membership`
- `type` (Goals): `points`, `badge`, `none`

**Mutually Exclusive Parameters:**
- Create Lesson / Get Chapters: Must provide `course_id` **OR** `membership_id` (not both)

**Dependent Filters:**
- `course_id` only effective when `type=course`
- `pod_id` only effective when `type=membership`

---

## Known Quirks

### 1. Path Parameter Naming Mismatch
**Get Pod Pricing Options** endpoint uses `:course_id` path parameter but expects **membership/pod ID**.

**Wrapper handles this automatically.**

---

### 2. POST for Updates
All update operations use **POST** method instead of PUT/PATCH.

**This is by design in the CourseSprout API.**

---

### 3. Null Response Examples
Many create/update operations show `null` in documentation examples. 

**Wrapper preserves raw response and assumes success envelope.**

---

### 4. Nested Pagination (Get Members)
Uses Laravel pagination with nested `data.data` structure.

**Wrapper normalizes to `{items: [...], pagination: {...}}`.**

---

### 5. User Key Response (Add User)
Returns `user` key instead of `data` key.

**Wrapper normalizes to standard `data` key.**

---

## Implementation Notes

### Response Normalization

**Standard Success:**
```json
{
  "success": true,
  "message": "Data found.",
  "data": [...]
}
```

**Paginated Response:**
```json
{
  "success": true,
  "items": [...],
  "pagination": {
    "current_page": 1,
    "total": 50,
    "per_page": 10,
    "last_page": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

### Password Defaults (Add User)

**Priority order:**
1. Provided `password` parameter
2. Pricing option's `default_password` field
3. Fallback: `pass5511`

**⚠️ Document this clearly to users**

---

### Reminder Email Targeting

**Only sends to:**
- Inactive members
- Non-archived members

**This is a BULK operation** - may send to many users at once.

---

## Testing

### Test API Connection
```
"Test my CourseSprout API connection"
```

Expected: Returns success if API key valid.

---

### Safe Read Tests
```
"List my CourseSprout courses"
"Get members of course 1"
"Show pricing options for pod 2"
```

---

### Dry-Run Tests
```
"Preview creating course 'Test Course' (dry-run)"
"Show what happens if I update pod 3 name (don't execute)"
```

---

## Credentials

**File:** `credentials/coursesprout.txt`

**Format:**
```
API_KEY: your_api_key_here
```

**Environment Variable:** `COURSESPROUT_API_KEY`

---

## Support

**Documentation:** https://api.coursesprout.com/ai-api-docs  
**Ingestion Report:** `coursesprout-api-ingestion.md`

---

**Skill Version:** 2.0  
**Last Updated:** 2026-03-13  
**Ingestion Date:** 2026-03-13  
**Total Endpoints:** 21  
**Safety Level:** HIGH ✅
