---
name: whatsapp-business
description: "Automate customer communication and manage workflows on the WhatsApp Business Cloud API. Use this skill to send transactional messages, marketing notifications, and interactive customer service responses. It's ideal for lead nurturing, appointment reminders, order confirmations, and providing real-time support."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["WHATSAPP_ACCESS_TOKEN","WHATSAPP_PHONE_NUMBER_ID"],"bins":["curl"]},"primaryEnv":"WHATSAPP_ACCESS_TOKEN","emoji":"📱"}}
---

# WhatsApp Business

Manage WhatsApp Business communications through the WhatsApp Cloud API — send messages, manage templates, send media, interactive messages, and manage contacts.

## When to activate

Use this skill when the user mentions any of the following keywords or scenarios:

- **Keywords:** WhatsApp, WA Business, WhatsApp API, Meta API, send WhatsApp, WhatsApp notification, WhatsApp alert, WhatsApp broadcast, message template, interactive message, customer support chat, lead follow-up, appointment reminder, order status, shipping update, delivery notification, customer feedback, WhatsApp marketing, contact sync.
- **Scenarios:**
    - Sending an order confirmation or shipping notification to a customer.
    - Broadcasting a promotional message to a list of opted-in users.
    - Following up with a new lead who filled out a form on the website.
    - Reminding a client about an upcoming appointment or consultation.
    - Providing real-time customer support via interactive messages.
    - Collecting customer feedback or reviews after a purchase.
    - Sending a one-time password (OTP) for verification.
    - Notifying users about a new product launch or feature update.
    - Checking the status of a previously sent message.
    - Onboarding a new customer with a series of welcome messages.
    - Managing and syncing customer contact information with WhatsApp.

## Required credentials

- `WHATSAPP_ACCESS_TOKEN` — A permanent or temporary access token from the [Meta for Developers](https://developers.facebook.com/) dashboard. Navigate to your WhatsApp Business app settings to generate a token.
- `WHATSAPP_PHONE_NUMBER_ID` — The Phone Number ID associated with your WhatsApp Business Account. Found in the WhatsApp section of your Meta app dashboard.

Optional:
- `WHATSAPP_BUSINESS_ACCOUNT_ID` — The WhatsApp Business Account ID (needed for template management).

If `WHATSAPP_ACCESS_TOKEN` or `WHATSAPP_PHONE_NUMBER_ID` is not set, instruct the user to configure them and stop.

## Helper script

Use `scripts/whatsapp_api.py` for common operations without writing boilerplate:

```bash
python scripts/whatsapp_api.py <command> [args]
```

| Command | Description |
|---|---|
| `send-text --to PHONE --body TEXT` | Send a text message |
| `send-template --to PHONE --template NAME --language CODE` | Send a template message |
| `send-image --to PHONE --image-url URL [--caption TEXT]` | Send an image |
| `send-document --to PHONE --document-url URL --filename NAME` | Send a document |
| `send-video --to PHONE --video-url URL [--caption TEXT]` | Send a video |
| `send-buttons --to PHONE --body TEXT --buttons B1,B2,B3` | Send interactive buttons |
| `send-list --to PHONE --body TEXT --sections-file FILE` | Send an interactive list |
| `mark-read --message-id MID` | Mark a message as read |
| `get-templates [--limit N]` | List message templates |
| `create-template --name NAME --category CAT --language CODE --body TEXT` | Create a template |
| `upload-media --file PATH --type MIME` | Upload media |

## Workflow

### 1. Send a text message

**Endpoint:** `POST https://graph.facebook.com/v21.0/{phone-number-id}/messages`

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "15551234567",
    "type": "text",
    "text": {
      "preview_url": false,
      "body": "Hello from OpenClaw!"
    }
  }'
```

### 2. Send a template message

**Endpoint:** `POST https://graph.facebook.com/v21.0/{phone-number-id}/messages`

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "15551234567",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {"code": "en_US"}
    }
  }'
```

### 3. Send an image by link

**Endpoint:** `POST https://graph.facebook.com/v21.0/{phone-number-id}/messages`

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "15551234567",
    "type": "image",
    "image": {
      "link": "https://example.com/image.jpg",
      "caption": "Check out this image"
    }
  }'
```

### 4. Send interactive buttons

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "15551234567",
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {"text": "Would you like to proceed?"},
      "action": {
        "buttons": [
          {"type": "reply", "reply": {"id": "yes-proceed", "title": "Yes"}},
          {"type": "reply", "reply": {"id": "no-cancel", "title": "No"}}
        ]
      }
    }
  }'
```

### 5. Mark message as read

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "status": "read",
    "message_id": "wamid.XXXXX"
  }'
```

### 6. Upload media

**Endpoint:** `POST https://graph.facebook.com/v21.0/{phone-number-id}/media`

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/media" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -F "messaging_product=whatsapp" \
  -F "file=@/path/to/file.jpg" \
  -F "type=image/jpeg"
```

### 7. List message templates

**Endpoint:** `GET https://graph.facebook.com/v21.0/{waba-id}/message_templates`

```bash
curl -X GET "https://graph.facebook.com/v21.0/$WHATSAPP_BUSINESS_ACCOUNT_ID/message_templates?limit=100" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"
```

### 8. Delete a message template

**Endpoint:** `DELETE https://graph.facebook.com/v21.0/{waba-id}/message_templates`

```bash
curl -X DELETE "https://graph.facebook.com/v21.0/$WHATSAPP_BUSINESS_ACCOUNT_ID/message_templates?name=order_confirmation" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"
```

### 9. Get Business Profile

**Endpoint:** `GET https://graph.facebook.com/v21.0/{phone-number-id}/whatsapp_business_profile`

```bash
curl -X GET "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"
```

### 10. Update Business Profile

**Endpoint:** `POST https://graph.facebook.com/v21.0/{phone-number-id}/whatsapp_business_profile`

```bash
curl -X POST "https://graph.facebook.com/v21.0/$WHATSAPP_PHONE_NUMBER_ID/whatsapp_business_profile" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "about": "Delivering happiness, one box at a time.",
    "address": "1 Hacker Way, Menlo Park, CA 94025",
    "email": "support@example.com"
  }'
```

## Pagination

When listing resources like message templates, the API uses cursor-based pagination. The response will include a `paging` object with `cursors` and a `next` URL.

- **`limit`**: Specifies the number of items to return per page (e.g., `limit=25`). Default is 10, max is 100.
- **`after`**: The cursor that points to the next page of results.

To get the next page, make a GET request to the `next` URL provided in the response.

```bash
# Initial request
curl -X GET "https://graph.facebook.com/v21.0/$WHATSAPP_BUSINESS_ACCOUNT_ID/message_templates?limit=2" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"

# The response will contain a 'next' URL like:
# "https://graph.facebook.com/.../message_templates?limit=2&after=CURSOR_TOKEN"

# Make a request to the 'next' URL to get the next page
curl -X GET "<PASTE_THE_NEXT_URL_HERE>" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"
```

## Webhook setup

To receive real-time notifications for events like incoming messages or status updates, you must configure a webhook.

1.  **Create a Webhook Endpoint:** Set up a public HTTPS endpoint on your server that can accept POST requests from Meta.
2.  **Configure in App Dashboard:** In your Meta App Dashboard, go to the WhatsApp section, click "Configuration", and set the "Callback URL".
3.  **Provide a Verify Token:** Create a secret string and provide it as the "Verify Token". Meta will use this to verify your endpoint.
4.  **Subscribe to Fields:** Select the events you want to be notified about (e.g., `messages`, `message_template_status_update`).

When an event occurs, Meta will send a POST request to your callback URL with a JSON payload.

## Multi-step workflows

### Customer Support Inquiry Flow

1.  **Receive Incoming Message:** A user sends a message to your WhatsApp number. Your webhook receives the notification.
2.  **Send Auto-Reply:** Send an interactive message with buttons for common issues (e.g., "Track Order", "Billing Issue", "Speak to Agent").
3.  **Handle User Reply:** Based on the button clicked, provide automated information (like an order status) or escalate to a human agent.

### Appointment Reminder Flow

1.  **Schedule Reminder:** A user books an appointment in your system.
2.  **Send Template Message:** 24 hours before the appointment, send an approved template message to remind the user.
3.  **Request Confirmation:** Include interactive buttons ("Confirm", "Reschedule").
4.  **Update System:** When the user replies, your webhook receives the response, and you can update the appointment status in your backend.

## Real-world use cases

- **E-commerce:** Send order confirmations, shipping updates, and delivery notifications. Use interactive messages to handle returns and exchanges.
- **Healthcare:** Send appointment reminders, lab result notifications, and prescription refill alerts.
- **Financial Services:** Provide account balance updates, fraud alerts, and payment reminders.
- **Travel & Hospitality:** Send booking confirmations, flight delay notifications, and check-in instructions.
- **Education:** Notify students about class schedules, assignment deadlines, and grade releases.
- **Marketing Agencies:** Run promotional campaigns, nurture leads with drip messages, and conduct customer surveys.

## Output format

Always return results in structured JSON. For successful message sends, confirm the action and include the message ID:

```json
{
  "action": "message_sent",
  "to": "15551234567",
  "message_id": "wamid.XXXXX",
  "type": "text",
  "summary": "Text message sent successfully to +1 (555) 123-4567"
}
```

For a list of templates:

```json
{
  "action": "list_templates",
  "count": 2,
  "templates": [
    {"name": "order_confirmation", "status": "APPROVED", "category": "UTILITY"},
    {"name": "shipping_update", "status": "PENDING", "category": "UTILITY"}
  ]
}
```

## Guardrails

- **Never** send messages to users without getting their explicit opt-in first.
- **Never** expose the `WHATSAPP_ACCESS_TOKEN` in output, logs, or client-side code.
- **Never** send marketing messages outside the 24-hour customer service window unless using an approved template.
- **Never** create or modify message templates without user approval of the content.
- **Always** use the international phone number format without the `+` prefix.
- **Always** include `"messaging_product": "whatsapp"` in every request body.
- **Always** verify template approval status before sending template messages.
- **Always** provide a clear way for users to opt-out of receiving messages.
- **Always** handle webhook events idempotently to avoid duplicate processing.
- **Do not** send messages that violate WhatsApp's Commerce Policy.

## Rate limits

The API has both rate limits (requests per second) and messaging limits (unique contacts per day).

**Messaging Tiers:**

| Tier | Unique Contacts / 24h | Requirement |
|---|---|---|
| Unverified | 250 | New business accounts |
| Tier 1 | 1,000 | Verified business, not flagged for low quality |
| Tier 2 | 10,000 | Sent messages to 2x the number of contacts in Tier 1 within 7 days |
| Tier 3 | 100,000 | Sent messages to 2x the number of contacts in Tier 2 within 7 days |
| Tier 4 | Unlimited | High-volume senders with sustained high quality |

**API Rate Limit:** 80 messages per second per phone number.

## Failure handling

| HTTP Status | Error Code | Cause | Resolution |
|---|---|---|---|
| `400` | `131000` | Something is wrong with the request. | Check request parameters, e.g., phone number format, message structure. |
| `400` | `131009` | Parameter is invalid. | Verify the data type and value of the specified parameter. |
| `400` | `131026` | Message is too long or invalid. | Ensure message content adheres to size limits and formatting rules. |
| `400` | `131030` | Recipient is not on WhatsApp. | Verify the phone number is registered on WhatsApp before sending. |
| `400` | `131047` | Re-engagement message outside 24h window. | Use an approved template message to re-initiate the conversation. |
| `400` | `131051` | Template not approved or does not exist. | Wait for template approval or use a different, approved template. |
| `401` | `130410` | Invalid or expired access token. | Refresh the access token from the Meta Developer Dashboard. |
| `403` | `130412` | App does not have permission. | Check app permissions and ensure the business account is verified. |
| `404` | `131008` | Resource not found (e.g., Phone Number ID). | Verify the `WHATSAPP_PHONE_NUMBER_ID` is correct. |
| `429` | `80007` | Rate limited. | Wait and retry with exponential backoff. Monitor usage against tier limits. |

## Reference files

Read these only when detailed parameter info is needed:

- **`references/api-reference.md`** — Full WhatsApp Cloud API endpoint reference with parameters, response schemas, and template management.
