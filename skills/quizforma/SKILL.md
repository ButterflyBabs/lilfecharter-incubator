# Quizforma API Skill

**Base URL:** `https://api.quizforma.com/api/ai`
**Authentication:** API Key in header (`X-API-KEY` or `Authorization: Bearer`)

## Authentication

All endpoints require an API key passed in the header:
```
X-API-KEY: {{apiKey}}
```

**Get API Key:**
1. Login to https://app.quizforma.com
2. Settings → API Access
3. Generate/copy token

---

## Endpoints

### Quizzes

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| List all | GET | `/quiz/get` | Paginated, returns quiz array |
| Get one | GET | `/quiz/get/{id}` | Single quiz details |
| Create | POST | `/quiz/create` | Body: `{name, description?, settings?}` |
| Update | PUT | `/quiz/update/{id}` | Body: quiz fields |
| Delete | DELETE | `/quiz/delete/{id}` | Removes quiz and associated data |

#### List Quizzes Response
```json
{
  "status": true,
  "message": "success.",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "My First Quiz",
        "created_at": "2024-03-20T10:00:00.000000Z"
      }
    ],
    "total": 2,
    "per_page": 15
  }
}
```

### Questions

| Action | Method | Endpoint |
|--------|--------|----------|
| List questions | GET | `/quiz/{quizId}/questions` |
| Add question | POST | `/quiz/{quizId}/questions` |
| Update question | PUT | `/questions/{id}` |
| Delete question | DELETE | `/questions/{id}` |

### Responses/Submissions

| Action | Method | Endpoint |
|--------|--------|----------|
| Get responses | GET | `/quiz/{quizId}/responses` |
| Get response details | GET | `/responses/{id}` |
| Submit response | POST | `/quiz/{quizId}/submit` |

### Applications (if applicable)

| Action | Method | Endpoint |
|--------|--------|----------|
| List applications | GET | `/applications` |
| Get application | GET | `/applications/{id}` |

---

## Quick PowerShell Examples

```powershell
$headers = @{
    "X-API-KEY" = "your_api_key_here"
    "Content-Type" = "application/json"
}

# List all quizzes
Invoke-RestMethod -Uri "https://api.quizforma.com/api/ai/quiz/get" -Headers $headers

# Get specific quiz
Invoke-RestMethod -Uri "https://api.quizforma.com/api/ai/quiz/get/123" -Headers $headers

# Create quiz
$body = @{
    name = "New Lead Quiz"
    description = "Qualification quiz for new leads"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.quizforma.com/api/ai/quiz/create" -Method POST -Headers $headers -Body $body
```

---

## Common Use Cases

### Lead Qualification Flow
1. Create quiz with qualifying questions
2. Embed on landing page via iframe or API
3. Collect responses → fire tags in Global Control
4. Route qualified leads to different funnels

### Application Processing
1. Build multi-step application
2. Conditional logic based on answers
3. Auto-approve/reject based on scoring
4. Export approved applications to CRM

---

## Notes

- **Part of Titanium Suite** — shares login with MintBird, PopLinks, Course Sprout, Global Control, Letterman
- **Response format:** Always `{status: boolean, message: string, data: object}`
- **Pagination:** Standard Laravel-style pagination on list endpoints
- **Rate limits:** Unknown — implement exponential backoff

---

## To Do / Verify

- [ ] Confirm exact header name (X-API-KEY vs Authorization: Bearer)
- [ ] Get full endpoint list from dashboard or API discovery
- [ ] Document question types (multiple choice, text, scoring, etc.)
- [ ] Verify webhook capabilities for real-time responses
- [ ] Test conditional logic and scoring endpoints

**Last updated:** 2026-02-16
**Status:** Structure documented — needs API key for full endpoint discovery
