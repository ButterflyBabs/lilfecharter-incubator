#!/bin/bash
# Cron-triggered PostStream Publisher
# Usage: ./cron-publish-post.sh <post_id> <date>

POST_ID=$1
DATE=$2
API_KEY="pb_7ae7bf67525a867f7a43bd757f5722b8fb7d63b7"
TELEGRAM_CHAT="7860568213"

if [ -z "$POST_ID" ] || [ -z "$DATE" ]; then
    echo "Usage: $0 <post_id> <date>"
    exit 1
fi

# Publish the post
echo "Publishing post $POST_ID for $DATE..."

response=$(curl -s -X POST "https://api.poststream.io/api/v1/posts/$POST_ID/publish" \
    -H "x-api-key: $API_KEY")

if echo "$response" | grep -q '"success":true'; then
    echo "✅ Publish initiated for $DATE"
    
    # Wait for publishing to complete
    sleep 15
    
    # Check final status
    status_response=$(curl -s -X GET "https://api.poststream.io/api/v1/posts/$POST_ID" \
        -H "x-api-key: $API_KEY")
    
    status=$(echo "$status_response" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('data',{}).get('status','unknown'))")
    
    # Get platform results
    ig_result=$(echo "$status_response" | python3 -c "import json,sys; d=json.load(sys.stdin); pr=d.get('data',{}).get('publishResult',{}); ig=pr.get('instagram',{}); print('✅' if ig.get('success') else '❌')")
    li_result=$(echo "$status_response" | python3 -c "import json,sys; d=json.load(sys.stdin); pr=d.get('data',{}).get('publishResult',{}); li=pr.get('linkedin',{}); print('✅' if li.get('success') else '❌')")
    
    # Send Telegram notification
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT" \
        -d "text=📱 May $DATE Post Published%0A%0AInstagram: $ig_result%0ALinkedIn: $li_result%0A%0AStatus: $status"
    
    echo "✅ Notification sent for $DATE"
else
    echo "❌ Failed to publish post for $DATE"
    
    # Send failure notification
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT" \
        -d "text=⚠️ May $DATE Post Failed to Publish%0A%0APlease check PostStream dashboard manually."
fi
