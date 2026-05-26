#!/bin/bash
# Add remaining 4 emails to workflow

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"

echo "Getting current workflow..."
CURRENT=$(curl -s -X GET -H "X-API-KEY: $API_KEY" "$BASE_URL/workflows/$WORKFLOW_ID")
echo "Current flows count: $(echo $CURRENT | grep -o '"flows":\[' | wc -l)"

echo "Adding Email 2 (Pattern - Generic)..."
UPDATE2=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
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
      },
      {
        "name": "Email 2 - Pattern",
        "type": "email", 
        "delay": 2880,
        "email": {
          "subject": "What your pattern reveals about your next step",
          "body": "Hi there,\n\nI have been thinking about your Snapshot results.\n\nYou showed up with a distinct pattern — and I want you to know: I see you. I know this terrain intimately.\n\nThe pattern matters more than any single score. It shows where you have been. It does not determine where you can go.\n\nThe Circle was built for travelers exactly like you — people who have done the inner work, who know the territory, who are ready for the container that makes alignment a lived reality, not just a concept.\n\nLearn more about the Circle: https://life-charter.vercel.app/\n\nHead up, wings out,\n\nBabs",
          "fromName": "Babs",
          "fromEmail": "amilynne@amilynnecarroll.com"
        }
      },
      {
        "name": "Email 3 - Gap",
        "type": "email",
        "delay": 4320,
        "email": {
          "subject": "The gap between knowing and living",
          "body": "Hi,\n\nThe Incubator gave you something real.\n\nIdentity First. Yellow Light. Aligned Action.\n\nThese are not just concepts — they are doorways. And I know you have walked through at least one of them, because you are still here.\n\nBut let me ask you something honest: Where does awareness go when life gets loud?\n\nThe LifeCharter Circle exists to bridge that gap.\n\nThis is not more information. It is not another course to complete or book to read. It is a way of being — held in a container designed for exactly that.\n\nStep into the Circle: https://life-charter.vercel.app/\n\nHead up, wings out,\n\nBabs",
          "fromName": "Babs",
          "fromEmail": "amilynne@amilynnecarroll.com"
        }
      },
      {
        "name": "Email 4 - Container",
        "type": "email",
        "delay": 5760,
        "email": {
          "subject": "What changes when you have a container",
          "body": "Hi there,\n\nI want to tell you a story.\n\nA decade ago, I was outwardly successful and inwardly hollow. Corporate achievements, the right titles, the impressive resume — and a growing sense that I was living someone else life.\n\nThen came my dark night. The collapse of everything I thought I was.\n\nI did not need more advice. I needed a way through.\n\nSo I rebuilt — slowly, carefully, dimension by dimension. Time. Money. Health. Relationships. Purpose. Creativity. Home. Mindset. Connection. Contribution. Spirit. Joy.\n\nLifeCharter was not born in a marketing meeting. It was forged in the fire of becoming.\n\nThe Circle exists because I needed it — and because I know I am not the only one.\n\nThis is what the Circle exists to give you: https://life-charter.vercel.app/\n\nHead up, wings out,\n\nBabs",
          "fromName": "Babs",
          "fromEmail": "amilynne@amilynnecarroll.com"
        }
      },
      {
        "name": "Email 5 - Deadline",
        "type": "email",
        "delay": 7200,
        "email": {
          "subject": "This invitation closes in two weeks",
          "body": "Hi there,\n\nI want to be straight with you.\n\nWhen you receive this, the door is open. Two weeks from today, it closes.\n\nI am not going to manufacture false urgency. No countdown timers. No \"only 3 spots left\" theater. Just an honest truth: I open the Circle for two-week windows, then close to focus on the members inside.\n\nTwo ways to join:\n- $2,497 pay-in-full\n- 3 payments of $850\n\nBoth include:\n- Weekly live Alignment Anchors\n- The complete 12-dimension curriculum\n- Your personal Living Blueprint\n- Ongoing community access\n- Tools and frameworks you keep for life\n\nJoin before this window closes: https://life-charter.vercel.app/\n\nThe door is open. For two weeks.\n\nHead up, wings out,\n\nBabs\n\nP.S. — If you have questions, just reply. I am here. If now is not your time, I honor that too. The work will wait for you.",
          "fromName": "Babs",
          "fromEmail": "amilynne@amilynnecarroll.com"
        }
      }
    ]
  }')

echo "Update Response: $UPDATE2"
echo "All emails added!"
