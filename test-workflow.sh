#!/bin/bash
# Test the LifeCharter Circle workflow

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"

echo "Step 1: Creating test contact..."
TEST_CONTACT=$(curl -s -X POST "$BASE_URL/contacts" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mariposa@agentmail.to",
    "firstName": "Test",
    "lastName": "Contact"
  }')

TEST_EMAIL=$(echo $TEST_CONTACT | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Test contact created: $TEST_EMAIL"

echo ""
echo "Step 2: Applying snapshot-complete trigger tag..."
TRIGGER_TAG_ID="6a0362117a98f2fec5115add"

FIRE_TAG=$(curl -s -X POST "$BASE_URL/tags/fire-tag/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}")

echo "Tag fire response: $FIRE_TAG"

echo ""
echo "Step 3: Verifying contact entered workflow..."
sleep 2

CONTACT_CHECK=$(curl -s -X GET "$BASE_URL/contacts" \
  -H "X-API-KEY: $API_KEY")

echo "Checking contact workflows..."
echo "$CONTACT_CHECK" | grep -A5 "mariposa@agentmail.to" | head -20

echo ""
echo "Step 4: Checking workflow queue..."
WORKFLOW_ID="6a0361a07a98f2fec5112d04"

WORKFLOW_STATUS=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")

echo "Workflow queue count:"
echo "$WORKFLOW_STATUS" | grep -o '"total":[0-9]*' | head -1

echo ""
echo "✅ TEST COMPLETE!"
echo "Check mariposa@agentmail.to for Email 1 (should arrive within minutes)"
