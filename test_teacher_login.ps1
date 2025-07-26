# Test login with teacher credentials
$loginData = @{
    username = "teacher"
    password = "password"
} | ConvertTo-Json

Write-Host "Testing login with username: teacher, password: password" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0,50))..." -ForegroundColor Cyan
    Write-Host "User ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Username: $($response.username)" -ForegroundColor Cyan
    Write-Host "Role: $($response.roles)" -ForegroundColor Cyan
    Write-Host "Membership: $($response.membershipType)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response Body: $responseText" -ForegroundColor Red
    }
}
