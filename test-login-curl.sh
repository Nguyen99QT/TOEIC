echo "=== Testing Backend API ==="

echo "1. Testing login endpoint..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  --verbose

echo ""
echo "2. Testing with email login..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@leenglish.com","password":"admin123"}' \
  --verbose

echo ""
echo "=== Test completed ==="
