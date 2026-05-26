#!/bin/bash
# Configure trigger tag for LifeCharter Circle workflow

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"

echo "Step 1: Creating tag group for LifeCharter..."
TAG_GROUP=$(curl -s -X POST "$BASE_URL/tag-groups" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"LifeCharter Triggers"}')

echo "Tag Group Response: $TAG_GROUP"
TAG_GROUP_ID=$(echo $TAG_GROUP | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Tag Group ID: $TAG_GROUP_ID"

echo ""
echo "Step 2: Creating snapshot-complete trigger tag..."
TAG=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"snapshot-complete\",
    \"groupId\": \"$TAG_GROUP_ID\"
  }")

echo "Tag Response: $TAG"
TAG_ID=$(echo $TAG | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Trigger Tag ID: $TAG_ID"

echo ""
echo "Step 3: Configuring workflow to trigger on tag..."
# Update workflow with firingTags
UPDATE=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"firingTags\": [\"$TAG_ID\"]
  }")

echo "Workflow Update Response: $UPDATE"

echo ""
echo "Saving configuration..."
echo "TAG_GROUP_ID=$TAG_GROUP_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "TRIGGER_TAG_ID=$TAG_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt

echo ""
echo "✅ TRIGGER CONFIGURED!"
echo "When 'snapshot-complete' tag is applied to a contact, they will enter the workflow."
