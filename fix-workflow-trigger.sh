#!/bin/bash
# Fix workflow trigger configuration

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"
TRIGGER_TAG_ID="6a0362117a98f2fec5115add"

echo "Checking current workflow state..."
CURRENT=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")

echo "Current firingTags:"
echo "$CURRENT" | grep -o '"firingTags":\[[^]]*\]'

echo ""
echo "Updating workflow with firing tag..."
UPDATE=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"firingTags\": [\"$TRIGGER_TAG_ID\"]
  }")

echo "Update response: $UPDATE"

echo ""
echo "Verifying update..."
VERIFY=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")

echo "New firingTags:"
echo "$VERIFY" | grep -o '"firingTags":\[[^]]*\]'

echo ""
echo "✅ TRIGGER TAG RECONFIGURED!"
