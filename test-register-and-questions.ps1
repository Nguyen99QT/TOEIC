# Test Registration and Login
Write-Host "=== Testing Registration and My Questions API ===" -ForegroundColor Cyan

# Test registration first
$registerData = @{
    username = "testuser"
    email = "testuser@test.com"
    password = "password123"
    role = "USER"
} | ConvertTo-Json

Write-Host "1. Testing registration..." -ForegroundColor Yellow
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ Registration successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Registration response: $($_.Exception.Message)" -ForegroundColor Yellow
    # Continue even if user already exists
}

# Test login
$loginData = @{
    email = "testuser@test.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "2. Testing login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test my question groups
Write-Host "3. Testing my question groups..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $groupsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/question-group/my" -Method GET -Headers $headers
    Write-Host "✅ Question groups fetched successfully!" -ForegroundColor Green
    Write-Host "Number of groups: $($groupsResponse.Count)" -ForegroundColor Cyan
    
    if ($groupsResponse.Count -gt 0) {
        Write-Host "First group: $($groupsResponse[0].title)" -ForegroundColor Cyan
    } else {
        Write-Host "No question groups found for this user" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Question groups fetch failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== Test completed ===" -ForegroundColor Cyan
