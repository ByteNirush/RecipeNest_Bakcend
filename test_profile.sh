#!/bin/bash

BASE_URL="http://localhost:8000/api"
EMAIL="testuser_$(date +%s)@example.com"

echo "1. Creating user..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\", \"email\":\"$EMAIL\", \"password\":\"password123\"}")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  echo $RESPONSE
  exit 1
fi

echo "Token received."

echo -e "\n2. GET /profile..."
curl -s -X GET $BASE_URL/profile \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n3. PUT /profile (Valid update)..."
curl -s -X PUT $BASE_URL/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "location": "New York",
    "yearsOfExperience": 5,
    "cuisineSpecialties": ["Italian", "Mexican"],
    "professionalBio": "Experienced chef.",
    "socialMediaLinks": { "twitter": "x.com/chef" }
  }'

echo -e "\n\n4. PUT /profile (Trying to update email)..."
curl -s -X PUT $BASE_URL/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "email": "hacked@example.com" }'

echo ""
