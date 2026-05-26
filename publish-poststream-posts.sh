#!/bin/bash
# PostStream Publishing Script for Sacred Kaleidoscope Community
# This script publishes posts for May 22-31

API_KEY="pb_7ae7bf67525a867f7a43bd757f5722b8fb7d63b7"
TELEGRAM_CHAT="7860568213"

# Array of post IDs and dates
# May 22: 69f91d05e6d36fbfacd0a3d0
# May 23: 69f91d3de6d36fbfacd0a3d5
# May 24: 69f91d72e6d36fbfacd0a3da
# May 25: 69f91da4e6d36fbfacd0a3de
# May 26: 69f91dd2e6d36fbfacd0a3e3
# May 27: 69f91dfde6d36fbfacd0a47a
# May 28: 69f91e31e6d36fbfacd0a47f
# May 29: 69f91e6de6d36fbfacd0a484
# May 30: 69f91e9ae6d36fbfacd0a488
# May 31: 69f91ec9e6d36fbfacd0a48d

POSTS=(
    "2026-05-22:69f91d05e6d36fbfacd0a3d0"
    "2026-05-23:69f91d3de6d36fbfacd0a3d5"
    "2026-05-24:69f91d72e6d36fbfacd0a3da"
    "2026-05-25:69f91da4e6d36fbfacd0a3de"
    "2026-05-26:69f91dd2e6d36fbfacd0a3e3"
    "2026-05-27:69f91dfde6d36fbfacd0a47a"
    "2026-05-28:69f91e31e6d36fbfacd0a47f"
    "2026-05-29:69f91e6de6d36fbfacd0a484"
    "2026-05-30:69f91e9ae6d36fbfacd0a488"
    "2026-05-31:69f91ec9e6d36fbfacd0a48d"
)

# Function to publish a post
publish_post() {
    local post_id=$1
    local date=$2
    
    echo "Publishing post for $date (ID: $post_id)..."
    
    # Call publish API
    response=$(curl -s -X POST "https://api.poststream.io/api/v1/posts/$post_id/publish" \
        -H "x-api-key: $API_KEY")
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ Publish initiated for $date"
        
        # Wait and check status
        sleep 10
        status_response=$(curl -s -X GET "https://api.poststream.io/api/v1/posts/$post_id" \
            -H "x-api-key: $API_KEY")
        
        status=$(echo "$status_response" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ "$status" = "published" ]; then
            echo "✅ Post for $date successfully published!"
        else
            echo "⚠️ Post for $date status: $status (may still be processing)"
        fi
    else
        echo "❌ Failed to publish post for $date"
        echo "Response: $response"
    fi
}

# Main execution
if [ "$1" = "today" ]; then
    # Publish today's post
    TODAY=$(date +%Y-%m-%d)
    for entry in "${POSTS[@]}"; do
        date=$(echo "$entry" | cut -d':' -f1)
        post_id=$(echo "$entry" | cut -d':' -f2)
        if [ "$date" = "$TODAY" ]; then
            publish_post "$post_id" "$date"
            break
        fi
    done
elif [ "$1" = "all" ]; then
    # Publish all remaining posts
    for entry in "${POSTS[@]}"; do
        date=$(echo "$entry" | cut -d':' -f1)
        post_id=$(echo "$entry" | cut -d':' -f2)
        publish_post "$post_id" "$date"
        sleep 5
    done
else
    echo "Usage: $0 [today|all]"
    echo "  today - Publish today's post based on system date"
    echo "  all   - Publish all remaining posts (May 22-31)"
    exit 1
fi
