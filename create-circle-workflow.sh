#!/bin/bash
# Create LifeCharter Circle Email Workflow in Global Control

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"

# Step 1: Create Workflow Group
echo "Creating workflow group..."
WORKFLOW_GROUP=$(curl -s -X POST "$BASE_URL/workflow-groups" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"LifeCharter Sequences"}')

echo "Workflow Group Response: $WORKFLOW_GROUP"
GROUP_ID=$(echo $WORKFLOW_GROUP | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Group ID: $GROUP_ID"

# Step 2: Create the main workflow
echo "Creating workflow..."
WORKFLOW=$(curl -s -X POST "$BASE_URL/workflows" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"LifeCharter Circle Nurture Sequence\",
    \"workflowGroupId\": \"$GROUP_ID\",
    \"status\": \"active\",
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
