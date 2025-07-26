# Test login API
$loginUrl = "http://localhost:8080/api/auth/login"

# Test với admin user
$adminLogin = @{
    username = "admin1"
    password = "admin123"
} | ConvertTo-Json

Write-Host "🔑 Testing login with admin credentials..."
try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $adminLogin -ContentType "application/json"
    Write-Host "✅ Login successful:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Login failed:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response Body: $responseText"
    }
}

# Test với teacher user
Write-Host "`n🔑 Testing login with teacher credentials..."
$teacherLogin = @{
    username = "teacher1"
    password = "teacher123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $teacherLogin -ContentType "application/json"
    Write-Host "✅ Teacher login successful:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Teacher login failed:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response Body: $responseText"
    }
}
