#!/bin/bash
# Update workflow with email flows

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"

echo "Updating workflow with Email 1..."

UPDATE=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "flows": [
      {
        "name": "Email 1 - Welcome",
        "type": "email",
        "delay": 0,
        "email": {
          "subject": "Your Alignment Snapshot is ready",
          "body": "Hello,\n\nWelcome. I am so glad you are here.\n\nFirst, let me say this: it takes real courage to look honestly at one life. To pause the doing long enough to ask, \"How am I really?\" — that is not small. That is the faithful step that changes everything.\n\nYour Alignment Snapshot results are attached. As you read through them, know this: whatever pattern emerged, it is not a verdict. It is information. A compass point, not a destination.\n\nYou might see yourself clearly in these results. You might feel seen in a way that surprises you. Or you might notice a gap between where you are and where you sense you could be. All of it is welcome here.\n\nThe Snapshot gives you a map. But maps do not walk themselves.\n\nWhen you are ready for the container that holds this work — the weekly practices, the living tools, the community of fellow travelers walking the same road — the LifeCharter Circle is here. No pressure, no rush. Just an open door when the time feels right.\n\nFor now, sit with what you have discovered. Let it land. And know that you are not alone on this journey.\n\nHead up, wings out,\n\nBabs\nLifeCharter Founder\n\nP.S. — If something in your results sparks a question, just hit reply. I read every email.",
          "fromName": "Babs",
          "fromEmail": "amilynne@amilynnecarroll.com"
        }
      }
    ]
  }')

echo "Update Response: $UPDATE"
