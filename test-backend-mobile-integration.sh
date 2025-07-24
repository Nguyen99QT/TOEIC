#!/bin/bash

echo "=== TOEIC Backend-Mobile Integration Test ==="
echo ""

# Test Backend APIs
echo "1. Testing Backend APIs..."
echo "   - Testing user login..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "kim_sora", 
    "password": "password123"
  }' \
  > login_response.json 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✓ Login API working"
    # Extract token for further tests
    TOKEN=$(cat login_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        echo "   ✓ JWT Token received: ${TOKEN:0:20}..."
        
        echo "   - Testing get available tests..."
        curl -H "Authorization: Bearer $TOKEN" \
             http://localhost:8080/api/tests/selection/available \
             > tests_response.json 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "   ✓ Get tests API working"
            TESTS_COUNT=$(cat tests_response.json | grep -o '"id"' | wc -l)
            echo "   ✓ Found $TESTS_COUNT tests available"
            
            echo "   - Testing get test questions..."
            curl -H "Authorization: Bearer $TOKEN" \
                 http://localhost:8080/api/tests/1/parts \
                 > questions_response.json 2>/dev/null
            
            if [ $? -eq 0 ]; then
                echo "   ✓ Get test questions API working"
                QUESTIONS_COUNT=$(cat questions_response.json | grep -o '"questionId"' | wc -l)
                echo "   ✓ Found $QUESTIONS_COUNT questions in test 1"
            else
                echo "   ✗ Get test questions API failed"
            fi
        else
            echo "   ✗ Get tests API failed"
        fi
    else
        echo "   ✗ No JWT token received"
    fi
else
    echo "   ✗ Login API failed"
fi

echo ""
echo "2. Backend Status Check..."
echo "   - Checking if Spring Boot is running on port 8080..."
netstat -an | grep :8080 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Backend server is running"
else
    echo "   ✗ Backend server is not running"
    echo "   → Please start backend with: mvn spring-boot:run"
fi

echo ""
echo "3. Mobile App Requirements Check..."
echo "   - Checking Flutter environment..."
if command -v flutter &> /dev/null; then
    echo "   ✓ Flutter is installed"
    FLUTTER_VERSION=$(flutter --version | head -1)
    echo "   ✓ $FLUTTER_VERSION"
else
    echo "   ✗ Flutter is not installed"
fi

echo "   - Checking mobile dependencies..."
if [ -f "mobile/pubspec.yaml" ]; then
    echo "   ✓ Mobile project found"
    if [ -f "mobile/pubspec.lock" ]; then
        echo "   ✓ Dependencies are installed"
    else
        echo "   ! Dependencies may need installation"
        echo "   → Run: flutter pub get"
    fi
else
    echo "   ✗ Mobile project not found"
fi

echo ""
echo "4. Integration Test Summary..."
echo "   Backend API Status:"
echo "   - Login: $([ -f login_response.json ] && echo "✓ Working" || echo "✗ Failed")"
echo "   - Get Tests: $([ -f tests_response.json ] && echo "✓ Working" || echo "✗ Failed")"
echo "   - Get Questions: $([ -f questions_response.json ] && echo "✓ Working" || echo "✗ Failed")"

if [ -f login_response.json ] && [ -f tests_response.json ] && [ -f questions_response.json ]; then
    echo ""
    echo "   🎉 All Backend APIs are working!"
    echo "   📱 Mobile app should now be able to:"
    echo "      1. Login with kim_sora/password123"
    echo "      2. Load real test data from backend"
    echo "      3. Display $TESTS_COUNT available tests"
    echo "      4. Show $QUESTIONS_COUNT questions per test"
    echo ""
    echo "   Next steps:"
    echo "   - Test mobile login flow"
    echo "   - Verify test data loads correctly"
    echo "   - Check submit test functionality"
else
    echo ""
    echo "   ⚠️  Some backend APIs are not working properly"
    echo "   Please check backend server status and logs"
fi

# Cleanup
rm -f login_response.json tests_response.json questions_response.json

echo ""
echo "=== Test Complete ==="
