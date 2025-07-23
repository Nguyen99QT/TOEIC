# Test Blog Like API
Write-Host "Testing Blog Like API..." -ForegroundColor Yellow

$baseUrl = "http://localhost:8080"

Write-Host "1. Testing get blog post..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog/9" -Method GET
    Write-Host "Blog post 9 exists: $($response.title)" -ForegroundColor Green
} catch {
    Write-Host "Blog post 9 not found: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "2. Testing get like count..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog/9/likes" -Method GET
    Write-Host "Like count for blog 9: $response" -ForegroundColor Green
} catch {
    Write-Host "Error getting like count: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "3. Testing check like status..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog/9/likes/check?userId=2" -Method GET
    Write-Host "User 2 like status for blog 9: $response" -ForegroundColor Green
} catch {
    Write-Host "Error checking like status: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "API tests completed!" -ForegroundColor Green
