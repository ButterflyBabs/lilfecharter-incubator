#!/bin/bash
# Option 2: Alternative API approaches to fix workflow trigger

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"
TRIGGER_TAG_ID="6a0362117a98f2fec5115add"

echo "=== ATTEMPT 1: Update tag to link to workflow ==="
# Try updating the tag to add workflow reference
TAG_UPDATE=$(curl -s -X PUT "$BASE_URL/tags/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"workflows\": [\"$WORKFLOW_ID\"]
  }")
echo "Tag update response: $TAG_UPDATE"

echo ""
echo "=== ATTEMPT 2: Update workflow with complete firingTags structure ==="
# Try different firingTags format
WORKFLOW_UPDATE=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"firingTags\": [\"$TRIGGER_TAG_ID\"],
    \"status\": true
  }")
echo "Workflow update response: $WORKFLOW_UPDATE"

echo ""
echo "=== ATTEMPT 3: Try workflow actions endpoint ==="
# Check if there's an actions endpoint for workflows
ACTIONS=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID/actions" \
  -H "X-API-KEY: $API_KEY" 2>&1)
echo "Actions response: $ACTIONS"

echo ""
echo "=== ATTEMPT 4: Try to activate workflow via status update ==="
# Try activating with explicit activation call
ACTIVATE=$(curl -s -X POST "$BASE_URL/workflows/$WORKFLOW_ID/activate" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" 2>&1)
echo "Activate response: $ACTIVATE"

echo ""
echo "=== ATTEMPT 5: Check workflow triggers endpoint ==="
TRIGGERS=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID/triggers" \
  -H "X-API-KEY: $API_KEY" 2>&1)
echo "Triggers response: $TRIGGERS"

echo ""
echo "=== VERIFYING WORKFLOW STATUS ==="
VERIFY=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")
echo "Current firingTags: $(echo $VERIFY | grep -o '"firingTags":\[[^]]*\]')"
echo "Current status: $(echo $VERIFY | grep -o '"status":[^,}]*' | head -1)"

echo ""
echo "=== OPTION 2 COMPLETE ==="
