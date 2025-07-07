# Simple test for admin dashboard
$baseUrl = "http://localhost:8080"

# Login as admin
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Logging in as admin..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Admin login successful!"
    
    # Test debug endpoint
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }
    
    Write-Host "`nTesting dashboard debug endpoint..."
    try {
        $debugResponse = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/debug" -Method Get -Headers $headers
        Write-Host "Debug response:"
        $debugResponse | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Debug endpoint failed: $($_.Exception.Message)"
    }
    
    Write-Host "`nTesting main dashboard endpoint..."
    try {
        $dashboardResponse = Invoke-RestMethod -Uri "$baseUrl/api/dashboard" -Method Get -Headers $headers
        Write-Host "Dashboard response:"
        $dashboardResponse | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Dashboard endpoint failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error details: $errorBody"
        }
    }
}
catch {
    Write-Host "Login failed: $($_.Exception.Message)"
}
