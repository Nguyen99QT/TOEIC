# Check users in database
$usersUrl = "http://localhost:8080/api/users"

Write-Host "🔍 Checking users in database..."
try {
    $response = Invoke-RestMethod -Uri $usersUrl -Method GET
    Write-Host "✅ Users found:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed to get users: $($_.Exception.Message)"
}

# Check if server is responding
$healthUrl = "http://localhost:8080/api/auth/validate-token"
Write-Host "`n🏥 Checking server health..."
try {
    $response = Invoke-RestMethod -Uri $healthUrl -Method POST -ErrorAction SilentlyContinue
    Write-Host "✅ Server is responding"
} catch {
    Write-Host "⚠️ Expected auth error (server is running): $($_.Exception.Response.StatusCode)"
}
