#!/bin/bash
# Create pattern tags for Email 2 branching

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"

echo "Creating pattern tag group..."
PATTERN_GROUP=$(curl -s -X POST "$BASE_URL/tag-groups" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"LifeCharter Patterns"}')

PATTERN_GROUP_ID=$(echo $PATTERN_GROUP | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Pattern Group ID: $PATTERN_GROUP_ID"

echo ""
echo "Creating 7 pattern tags..."

# Pattern 1: Overextended Giver
P1=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-overextended-giver\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P1_ID=$(echo $P1 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "1. Overextended Giver: $P1_ID"

# Pattern 2: Sacred Drifter
P2=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-sacred-drifter\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P2_ID=$(echo $P2 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "2. Sacred Drifter: $P2_ID"

# Pattern 3: Quiet Achiever
P3=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-quiet-achiever\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P3_ID=$(echo $P3 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "3. Quiet Achiever: $P3_ID"

# Pattern 4: Survival Strategist
P4=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-survival-strategist\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P4_ID=$(echo $P4 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "4. Survival Strategist: $P4_ID"

# Pattern 5: Disconnected Visionary
P5=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-disconnected-visionary\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P5_ID=$(echo $P5 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "5. Disconnected Visionary: $P5_ID"

# Pattern 6: Relationship-Tethered
P6=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-relationship-tethered\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P6_ID=$(echo $P6 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "6. Relationship-Tethered: $P6_ID"

# Pattern 7: Purpose-Ready
P7=$(curl -s -X POST "$BASE_URL/tags" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"pattern-purpose-ready\",\"groupId\":\"$PATTERN_GROUP_ID\"}")
P7_ID=$(echo $P7 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "7. Purpose-Ready: $P7_ID"

echo ""
echo "Saving pattern tag IDs..."
echo "PATTERN_GROUP_ID=$PATTERN_GROUP_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_1_ID=$P1_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_2_ID=$P2_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_3_ID=$P3_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_4_ID=$P4_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_5_ID=$P5_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_6_ID=$P6_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt
echo "PATTERN_7_ID=$P7_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt

echo ""
echo "✅ ALL 7 PATTERN TAGS CREATED!"
