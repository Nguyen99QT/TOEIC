# Test authentication and API
Write-Host "🔧 Testing Authentication and Like/Comment APIs..." -ForegroundColor Yellow

$baseUrl = "http://localhost:8080"

# Test 1: Login to get token
Write-Host "`n1. Testing login..." -ForegroundColor Cyan
try {
    $loginData = @{
        username = "admin"
        password = "admin123"
    }
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json"
    
    if ($loginResponse.accessToken) {
        Write-Host "✅ Login successful" -ForegroundColor Green
        $token = $loginResponse.accessToken
        $userId = $loginResponse.id
        Write-Host "User ID: $userId" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed - no token received" -ForegroundColor Red
        return
    }
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    return
}

# Test 2: Test like API with authentication
Write-Host "`n2. Testing like API with auth..." -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog/9/likes?userId=$userId" -Method POST -Headers $headers
    Write-Host "✅ Like toggle successful: $response likes" -ForegroundColor Green
} catch {
    Write-Host "❌ Like API failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 3: Test comment API
Write-Host "`n3. Testing comment API..." -ForegroundColor Cyan
try {
    $commentData = @{
        content = "Test comment from PowerShell script"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog/9/comments" -Method POST -Body ($commentData | ConvertTo-Json) -Headers $headers
    Write-Host "✅ Comment posted successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Comment API failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 4: Get comments
Write-Host "`n4. Getting comments..." -ForegroundColor Cyan
try {
    $comments = Invoke-RestMethod -Uri "$baseUrl/api/blog/9/comments" -Method GET
    Write-Host "✅ Comments retrieved: $($comments.Count) comments" -ForegroundColor Green
} catch {
    Write-Host "❌ Get comments failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting completed!" -ForegroundColor Green
