#!/bin/bash
# Create LifeCharter Circle Email Workflow in Global Control

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
GROUP_ID="6a0361967a98f2fec5110f17"

# Create the main workflow with correct boolean status
echo "Creating workflow..."
WORKFLOW=$(curl -s -X POST "$BASE_URL/workflows" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"LifeCharter Circle Nurture Sequence\",
    \"workflowGroupId\": \"$GROUP_ID\",
    \"status\": true,
    \"flows\": []
  }")

echo "Workflow Response: $WORKFLOW"
WORKFLOW_ID=$(echo $WORKFLOW | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Workflow ID: $WORKFLOW_ID"

# Save IDs for later
echo "GROUP_ID=$GROUP_ID" > /root/.openclaw/workspace/circle-workflow-ids.txt
echo "WORKFLOW_ID=$WORKFLOW_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt

echo "Workflow created successfully!"
echo "Workflow ID: $WORKFLOW_ID"
