#!/bin/bash
# Try to set up tag action to trigger workflow

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"
TRIGGER_TAG_ID="6a0362117a98f2fec5115add"

echo "=== CHECKING TAG ACTIONS ==="
# Try to create a tag action that triggers the workflow
TAG_ACTION=$(curl -s -X POST "$BASE_URL/tags/create-action" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"tagId\": \"$TRIGGER_TAG_ID\",
    \"workflowId\": \"$WORKFLOW_ID\",
    \"action\": \"start_workflow\"
  }" 2>&1)
echo "Tag action response: $TAG_ACTION"

echo ""
echo "=== TRYING ALTERNATIVE: Update tag with actionIds ==="
# Check if tag has tagActionIds field we can update
TAG_UPDATE=$(curl -s -X PUT "$BASE_URL/tags/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"tagActionIds\": [\"start_workflow\"]
  }" 2>&1)
echo "Tag actionIds update: $TAG_UPDATE"

echo ""
echo "=== CHECKING IF THERE'S A WORKFLOW QUEUE ENDPOINT ==="
# Try to manually add contact to workflow queue
QUEUE_ADD=$(curl -s -X POST "$BASE_URL/workflow-queues" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"workflowId\": \"$WORKFLOW_ID\",
    \"email\": \"mariposa@agentmail.to\",
    \"status\": \"active\"
  }" 2>&1)
echo "Queue add response: $QUEUE_ADD"

echo ""
echo "=== VERIFYING TAG STATUS ==="
TAG_STATUS=$(curl -s -X GET "$BASE_URL/tags/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY")
echo "Tag workflows: $(echo $TAG_STATUS | grep -o '"workflows":\[[^]]*\]')"
echo "Tag actions: $(echo $TAG_STATUS | grep -o '"actions":\[[^]]*\]')"

echo ""
echo "=== TESTING: Fire tag again to see if workflow triggers ==="
FIRE_TAG=$(curl -s -X POST "$BASE_URL/tags/fire-tag/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"mariposa@agentmail.to"}')
echo "Fire tag response: $FIRE_TAG"

echo ""
echo "=== CHECKING WORKFLOW QUEUE STATUS ==="
sleep 2
WORKFLOW_STATUS=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")
echo "Queue counts: $(echo $WORKFLOW_STATUS | grep -o '"workflowQueuesCounts":{[^}]*}')"

echo ""
echo "=== COMPLETE ==="
