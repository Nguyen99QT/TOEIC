# Test Lessons and Exercises API Endpoints
Write-Host "🧪 Testing Lessons and Exercises APIs..." -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# Test public lessons endpoint
Write-Host "`n1. Testing public lessons endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/lessons/public/all" -Method GET
    Write-Host "✅ Public lessons: $($response.Count) lessons found" -ForegroundColor Green
} catch {
    Write-Host "❌ Public lessons failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test with authentication
$loginData = @{
    username = "teacher"
    password = "password123"
} | ConvertTo-Json

Write-Host "`n2. Testing login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful, token received" -ForegroundColor Green
    
    # Test authenticated lessons endpoint
    Write-Host "`n3. Testing authenticated lessons endpoint..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/lessons" -Method GET -Headers $headers
        Write-Host "✅ Authenticated lessons: $($response.Count) lessons found" -ForegroundColor Green
    } catch {
        Write-Host "❌ Authenticated lessons failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test exercises endpoint
    Write-Host "`n4. Testing exercises endpoint..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/exercises" -Method GET -Headers $headers
        Write-Host "✅ Exercises: $($response.Count) exercises found" -ForegroundColor Green
    } catch {
        Write-Host "❌ Exercises failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 API testing completed!" -ForegroundColor Cyan
