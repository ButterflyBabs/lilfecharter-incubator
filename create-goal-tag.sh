#!/bin/bash
# Create goal tag to stop workflow when enrolled

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
WORKFLOW_ID="6a0361a07a98f2fec5112d04"

echo "Creating goal tag group..."
GOAL_GROUP=$(curl -s -X POST "$BASE_URL/tag-groups" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"LifeCharter Goals"}')

GOAL_GROUP_ID=$(echo $GOAL_GROUP | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Goal Group ID: $GOAL_GROUP_ID"

echo ""
echo "Creating circle-member goal tag..."
GOAL_TAG=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"circle-member\",\"groupId\":\"$GOAL_GROUP_ID\"}")

GOAL_TAG_ID=$(echo $GOAL_TAG | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Goal Tag ID: $GOAL_TAG_ID"

echo ""
echo "Creating circle-interested tag (for click tracking)..."
INTERESTED_TAG=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"circle-interested\",\"groupId\":\"$GOAL_GROUP_ID\"}")

INTERESTED_TAG_ID=$(echo $INTERESTED_TAG | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Interested Tag ID: $INTERESTED_TAG_ID"

echo ""
echo "Configuring workflow goal settings..."
UPDATE=$(curl -s -X PUT "$BASE_URL/workflows/$WORKFLOW_ID" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"goalSettings\": {
      \"enabled\": true,
      \"label\": \"Enrolled in Circle\",
      \"tagIds\": [\"$GOAL_TAG_ID\"],
      \"moveToWorkflow\": false,
      \"workflowId\": \"\"
    }
  }")

echo "Goal Configuration Response: $UPDATE"

echo ""
echo "Saving goal tag IDs..."
echo "GOAL_GROUP_ID=$GOAL_GROUP_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "GOAL_TAG_ID=$GOAL_TAG_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "INTERESTED_TAG_ID=$INTERESTED_TAG_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt

echo ""
echo "✅ GOAL TAG CONFIGURED!"
echo "Workflow will stop when 'circle-member' tag is applied."
