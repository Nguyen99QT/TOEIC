# Test My Questions API
Write-Host "=== Testing My Questions API ===" -ForegroundColor Cyan

# Test login first
$loginData = @{
    email = "admin@test.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "1. Testing login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test my question groups
Write-Host "2. Testing my question groups..." -ForegroundColor Yellow
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
    }
} catch {
    Write-Host "❌ Question groups fetch failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test my individual questions
Write-Host "3. Testing my individual questions..." -ForegroundColor Yellow
try {
    $questionsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/question-bank/my" -Method GET -Headers $headers
    Write-Host "✅ Individual questions fetched successfully!" -ForegroundColor Green
    Write-Host "Number of questions: $($questionsResponse.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Individual questions fetch failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== Test completed ===" -ForegroundColor Cyan
