# PowerShell script to test dashboard API
$baseUrl = "http://localhost:8080"

# Function to test login
function Test-Login {
    param(
        [string]$username,
        [string]$password
    )
    
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json
    
    try {
        Write-Host "Testing login for user: $username"
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        Write-Host "Login successful! Token received."
        return $response.token
    }
    catch {
        Write-Host "Login failed: $($_.Exception.Message)"
        Write-Host "Response: $($_.Exception.Response)"
        return $null
    }
}

# Function to test dashboard endpoint
function Test-Dashboard {
    param(
        [string]$token
    )
    
    if (-not $token) {
        Write-Host "No token provided, cannot test dashboard"
        return
    }
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }
    
    try {
        Write-Host "Testing dashboard endpoint..."
        $response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard" -Method Get -Headers $headers
        Write-Host "Dashboard response received:"
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Dashboard request failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error response body: $errorBody"
        }
    }
}

# Function to test debug endpoint
function Test-DashboardDebug {
    param(
        [string]$token
    )
    
    if (-not $token) {
        Write-Host "No token provided, cannot test dashboard debug"
        return
    }
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }
    
    try {
        Write-Host "Testing dashboard debug endpoint..."
        $response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/debug" -Method Get -Headers $headers
        Write-Host "Dashboard debug response received:"
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Dashboard debug request failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error response body: $errorBody"
        }
    }
}

# Test with HANOI user
Write-Host "=== Testing with HANOI user ==="
$token = Test-Login -username "HANOI" -password "password123"
if ($token) {
    Test-DashboardDebug -token $token
    Test-Dashboard -token $token
}

Write-Host "`n=== Testing with admin user ==="
$adminToken = Test-Login -username "admin" -password "admin123"
if ($adminToken) {
    Test-DashboardDebug -token $adminToken
    Test-Dashboard -token $adminToken
}
