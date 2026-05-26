#!/bin/bash
# Fix workflow trigger and run comprehensive test

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"
TRIGGER_TAG_ID="6a0362117a98f2fec5115add"

echo "=== CHECKING CURRENT WORKFLOW STATUS ==="
WORKFLOW=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")

echo "Workflow Name: $(echo $WORKFLOW | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)"
echo "Status: $(echo $WORKFLOW | grep -o '"status":[^,}]*' | head -1)"
echo "Firing Tags: $(echo $WORKFLOW | grep -o '"firingTags":\[[^]]*\]')"
echo "Number of Flows: $(echo $WORKFLOW | grep -o '"flows":\[' | wc -l)"

echo ""
echo "=== CHECKING IF TRIGGER TAG EXISTS ==="
TAG=$(curl -s -X GET "$BASE_URL/tags/$TRIGGER_TAG_ID" \
  -H "X-API-KEY: $API_KEY")
echo "Tag: $TAG"

echo ""
echo "=== LISTING ALL TAGS ==="
ALL_TAGS=$(curl -s -X GET "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY")
echo "Available tags: $(echo $ALL_TAGS | grep -o '"name":"[^"]*"' | head -10)"

echo ""
echo "=== CHECKING TEST CONTACT ==="
TEST_CONTACT=$(curl -s -X GET "$BASE_URL/contacts" \
  -H "X-API-KEY: $API_KEY" | grep -o '"email":"mariposa@agentmail.to"[^}]*')
echo "Test contact: $TEST_CONTACT"

echo ""
echo "=== ATTEMPTING TO MANUALLY TRIGGER WORKFLOW ==="
# Try to add contact to workflow queue directly
ADD_TO_WORKFLOW=$(curl -s -X POST "$BASE_URL/workflows/$WORKFLOW_ID/add-contact" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"mariposa@agentmail.to"}')
echo "Add to workflow response: $ADD_TO_WORKFLOW"

echo ""
echo "=== CHECKING WORKFLOW QUEUE ==="
WORKFLOW_QUEUE=$(curl -s -X GET "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY")
echo "Queue counts: $(echo $WORKFLOW_QUEUE | grep -o '"workflowQueuesCounts":{[^}]*}')"

echo ""
echo "=== TEST COMPLETE ==="
echo "If the workflow queue shows contacts in queue, emails should start sending."
echo "If not, the workflow may need to be activated in the Global Control dashboard."
