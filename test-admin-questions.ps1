# Test My Questions API with existing admin user
Write-Host "=== Testing My Questions API with Admin User ===" -ForegroundColor Cyan

# Test login với admin user có sẵn
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Write-Host "1. Testing login with admin user..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with email instead
    Write-Host "Trying with email format..." -ForegroundColor Yellow
    $loginDataEmail = @{
        email = "admin@leenglish.com"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginDataEmail -ContentType "application/json"
        $token = $loginResponse.token
        Write-Host "✅ Login with email successful! Token: $($token.Substring(0,50))..." -ForegroundColor Green
    } catch {
        Write-Host "❌ Email login also failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
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
        Write-Host "Groups found:" -ForegroundColor Cyan
        for ($i = 0; $i -lt [Math]::Min(3, $groupsResponse.Count); $i++) {
            Write-Host "  - $($groupsResponse[$i].title)" -ForegroundColor White
        }
    } else {
        Write-Host "No question groups found for this user" -ForegroundColor Yellow
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
