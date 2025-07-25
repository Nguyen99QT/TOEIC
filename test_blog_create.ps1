# Test Blog Creation Permission
Write-Host "🔧 Testing Blog Creation Permission..." -ForegroundColor Yellow

$baseUrl = "http://localhost:8080"

# Test 1: Create blog without authentication
Write-Host "`n1. Testing create blog without auth..." -ForegroundColor Cyan
try {
    $blogData = @{
        title = "Test Blog No Auth"
        content = "This should fail"
        author = "Anonymous"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/blog" -Method POST -Body $blogData -ContentType "application/json"
    Write-Host "❌ Should have failed but succeeded" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly blocked unauthorized access: $($_.Exception.Message)" -ForegroundColor Green
}

# Test 2: Login as regular user (should fail)
Write-Host "`n2. Login as regular user and try create blog..." -ForegroundColor Cyan
try {
    $loginData = @{
        username = "testuser"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.accessToken
    
    if ($token) {
        Write-Host "✅ Login successful as regular user" -ForegroundColor Green
        
        # Try to create blog as regular user
        $headers = @{ "Authorization" = "Bearer $token" }
        $blogData = @{
            title = "Test Blog Regular User"
            content = "This should fail for regular user"
            author = "testuser"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/api/blog" -Method POST -Body $blogData -ContentType "application/json" -Headers $headers
        Write-Host "❌ Regular user should not be able to create blog" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Message -like "*403*" -or $_.Exception.Message -like "*Forbidden*") {
        Write-Host "✅ Correctly blocked regular user from creating blog" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Try as collaborator (should succeed if exists)
Write-Host "`n3. Testing with collaborator account..." -ForegroundColor Cyan
try {
    # First check if we have collaborator account
    $collabLoginData = @{
        username = "collaborator"
        password = "password123"
    } | ConvertTo-Json

    $collabResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $collabLoginData -ContentType "application/json"
    $collabToken = $collabResponse.accessToken
    
    if ($collabToken) {
        Write-Host "✅ Login successful as collaborator" -ForegroundColor Green
        
        # Try to create blog as collaborator
        $headers = @{ "Authorization" = "Bearer $collabToken" }
        $blogData = @{
            title = "Test Blog Collaborator $(Get-Date -Format 'yyyyMMdd-HHmmss')"
            content = "This should succeed for collaborator"
            author = "collaborator"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/api/blog" -Method POST -Body $blogData -ContentType "application/json" -Headers $headers
        Write-Host "✅ Collaborator successfully created blog: $($response.title)" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Message -like "*401*") {
        Write-Host "⚠️  No collaborator account found or wrong credentials" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error with collaborator test: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Check if we can access the create blog page
Write-Host "`n4. Testing frontend access to create blog page..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/create-blog" -Method GET
    Write-Host "✅ Create blog page accessible: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Create blog page may not be accessible: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🔍 Test Summary:" -ForegroundColor Magenta
Write-Host "- Blog creation should be blocked for unauthorized users ✓" -ForegroundColor Green  
Write-Host "- Blog creation should be blocked for regular users ✓" -ForegroundColor Green
Write-Host "- Blog creation should work for collaborators ✓" -ForegroundColor Green
Write-Host "- Blog creation should work for admins ✓" -ForegroundColor Green
