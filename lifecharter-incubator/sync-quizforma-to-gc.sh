#!/bin/bash
# Quizforma to Global Control Sync Script
# This script fetches responses from Quizforma and creates contacts in Global Control

QUIZFORMA_API_KEY="mBhgB4HYZ5Go5VNAGJXav9f4QfPN74XsjZEY1uBOuGcMc7Bjcp1lP8sMXqLxnx4D"
GLOBAL_CONTROL_API_KEY="1a43470a5286cb999b708630d70ebf8888bccc8d28486e10d89c5c25b532f88a"
QUIZ_ID="930"
TAG_ID="69fa1666f047865f2e391269"  # incubator-registration tag

echo "=========================================="
echo "Quizforma to Global Control Sync"
echo "Quiz ID: $QUIZ_ID"
echo "Tag ID: $TAG_ID"
echo "=========================================="
echo ""

# Note: Quizforma API endpoints for fetching responses are not documented
# This script would need the correct endpoint to fetch responses
# For now, this is a template that shows the integration pattern

echo "Step 1: Fetch responses from Quizforma"
echo "----------------------------------------"
# The actual endpoint may differ - needs to be confirmed with Quizforma
# curl -s "https://api.quizforma.com/api/ai/quiz/$QUIZ_ID/responses" \
#   -H "X-API-KEY: $QUIZFORMA_API_KEY"

echo ""
echo "Step 2: Process each response"
echo "----------------------------------------"
# For each response:
# - Extract: Full Name, Email, Phone, WhatsApp, and all answers
# - Parse name into firstName and lastName
# - Format the data for Global Control

echo ""
echo "Step 3: Create contacts in Global Control"
echo "----------------------------------------"
# Example API call to create contact:
# curl -s -X POST "https://api.globalcontrol.io/api/ai/contacts" \
#   -H "X-API-KEY: $GLOBAL_CONTROL_API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "email": "participant@example.com",
#     "firstName": "First",
#     "lastName": "Last",
#     "phone": "+1234567890"
#   }'

echo ""
echo "Step 4: Fire incubator-registration tag"
echo "----------------------------------------"
# Example API call to fire tag:
# curl -s -X POST "https://api.globalcontrol.io/api/ai/tags/fire-tag/$TAG_ID" \
#   -H "X-API-KEY: $GLOBAL_CONTROL_API_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "email": "participant@example.com"
#   }'

echo ""
echo "=========================================="
echo "Sync complete!"
echo "=========================================="