#!/bin/bash
# Setup Mailgun in Global Control

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
MAILGUN_API_KEY="36af6158e92edf4908efad41fcfa9c24-428c42a0-c2ce3a41"

echo "=== STEP 1: Get Mailgun Integration ID ==="
INTEGRATIONS=$(curl -s -X GET "$BASE_URL/integrations" \
  -H "X-API-KEY: $API_KEY")

# Extract Mailgun integration ID
MAILGUN_ID=$(echo $INTEGRATIONS | grep -i -A5 '"name":"Mailgun"' | grep '"_id":"' | head -1 | cut -d'"' -f4)

if [ -z "$MAILGUN_ID" ]; then
    echo "Trying alternative extraction..."
    MAILGUN_ID=$(echo $INTEGRATIONS | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "Mailgun Integration ID: $MAILGUN_ID"

echo ""
echo "=== STEP 2: Connect Mailgun Account ==="
# Connect Mailgun with API key
CONNECT=$(curl -s -X POST "$BASE_URL/integrations/connect" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"integrationId\": \"$MAILGUN_ID\",
    \"accountName\": \"amilynnecarroll.com\",
    \"apiKey\": \"$MAILGUN_API_KEY\"
  }" 2>&1)

echo "Connect response: $CONNECT"
ACCOUNT_ID=$(echo $CONNECT | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Connected Account ID: $ACCOUNT_ID"

echo ""
echo "=== STEP 3: Add amilynnecarroll.com Domain ==="
if [ ! -z "$ACCOUNT_ID" ]; then
    DOMAIN=$(curl -s -X POST "$BASE_URL/domains" \
      -H "X-API-KEY: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"domain\": \"amilynnecarroll.com\",
        \"integrationId\": \"$MAILGUN_ID\",
        \"accountId\": \"$ACCOUNT_ID\"
      }" 2>&1)
    echo "Domain creation response: $DOMAIN"
    DOMAIN_ID=$(echo $DOMAIN | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Domain ID: $DOMAIN_ID"
else
    echo "No account ID - trying without accountId..."
    DOMAIN=$(curl -s -X POST "$BASE_URL/domains" \
      -H "X-API-KEY: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"domain\": \"amilynnecarroll.com\",
        \"integrationId\": \"$MAILGUN_ID\"
      }" 2>&1)
    echo "Domain creation response: $DOMAIN"
fi

echo ""
echo "=== STEP 4: Verify Domain Setup ==="
DOMAINS_LIST=$(curl -s -X GET "$BASE_URL/domains" \
  -H "X-API-KEY: $API_KEY")
echo "Domains: $DOMAINS_LIST"

echo ""
echo "=== MAILGUN SETUP COMPLETE ==="
