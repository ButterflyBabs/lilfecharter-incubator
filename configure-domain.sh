#!/bin/bash
# Configure amilynnecarroll.com domain in Global Control

API_KEY="57653380648b8ae0aeff5416a5422f81a1d0bd89e75d760de0f482abe5e8858d"
BASE_URL="https://api.globalcontrol.io/api/ai"
MAILGUN_API_KEY="36af6158e92edf4908efad41fcfa9c24-428c42a0-c2ce3a41"

echo "Step 1: Getting integrations list to find Mailgun..."
INTEGRATIONS=$(curl -s -X GET "$BASE_URL/integrations" \
  -H "X-API-KEY: $API_KEY")

echo "Integrations: $INTEGRATIONS"
MAILGUN_ID=$(echo $INTEGRATIONS | grep -o '"_id":"[^"]*".*"name":"Mailgun"' | head -1 | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$MAILGUN_ID" ]; then
  echo "Mailgun integration ID not found, trying alternative search..."
  MAILGUN_ID=$(echo $INTEGRATIONS | grep -i "mailgun" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "Mailgun Integration ID: $MAILGUN_ID"

echo ""
echo "Step 2: Getting connected integrations..."
CONNECTED=$(curl -s -X GET "$BASE_URL/connected-integrations" \
  -H "X-API-KEY: $API_KEY")

echo "Connected integrations: $CONNECTED"

echo ""
echo "Step 3: Creating domain with Mailgun..."
# Try to create domain with Mailgun integration
DOMAIN=$(curl -s -X POST "$BASE_URL/domains" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"domain\": \"amilynnecarroll.com\",
    \"integrationId\": \"$MAILGUN_ID\",
    \"accountId\": \"mailgun\"
  }")

echo "Domain creation response: $DOMAIN"
DOMAIN_ID=$(echo $DOMAIN | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Domain ID: $DOMAIN_ID"

echo ""
echo "Step 4: Getting SMTP domains..."
SMTP_DOMAINS=$(curl -s -X GET "$BASE_URL/smtp-domains?accountId=mailgun" \
  -H "X-API-KEY: $API_KEY")

echo "SMTP Domains: $SMTP_DOMAINS"

echo ""
echo "Saving domain configuration..."
echo "DOMAIN_ID=$DOMAIN_ID" >> /root/.openclaw/workspace/circle-workflow-ids.txt

echo ""
echo "✅ DOMAIN CONFIGURATION COMPLETE!"
echo "Domain: amilynnecarroll.com"
echo "Domain ID: $DOMAIN_ID"
echo ""
echo "NEXT: DNS records need to be added to your domain registrar."
echo "Global Control will provide these after domain verification starts."
