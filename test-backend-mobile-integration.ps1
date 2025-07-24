# TOEIC Backend-Mobile Integration Test for Windows PowerShell
Write-Host "=== TOEIC Backend-Mobile Integration Test ===" -ForegroundColor Cyan
Write-Host ""

# Initialize variables
$script:allApisWorking = $false
$script:testsCount = 0
$script:questionsCount = 0

# Test Backend APIs
Write-Host "1. Testing Backend APIs..." -ForegroundColor Yellow
Write-Host "   - Testing user login..."

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"username": "kim_sora", "password": "password123"}' `
        -ErrorAction Stop
    
    Write-Host "   ✓ Login API working" -ForegroundColor Green
    
    if ($loginResponse.token) {
        $token = $loginResponse.token
        $tokenPreview = $token.Substring(0, [Math]::Min(20, $token.Length))
        Write-Host "   ✓ JWT Token received: $tokenPreview..." -ForegroundColor Green
        
        # Test get available tests
        Write-Host "   - Testing get available tests..."
        try {
            $headers = @{ "Authorization" = "Bearer $token" }
            $testsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/tests/selection/available" `
                -Method GET `
                -Headers $headers `
                -ErrorAction Stop
            
            Write-Host "   ✓ Get tests API working" -ForegroundColor Green
            $script:testsCount = $testsResponse.Count
            Write-Host "   ✓ Found $($script:testsCount) tests available" -ForegroundColor Green
            
            # Test get test questions
            Write-Host "   - Testing get test questions..."
            try {
                $questionsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/tests/1/parts" `
                    -Method GET `
                    -Headers $headers `
                    -ErrorAction Stop
                
                Write-Host "   ✓ Get test questions API working" -ForegroundColor Green
                $script:questionsCount = 0
                foreach ($part in $questionsResponse) {
                    if ($part.questions) {
                        $script:questionsCount += $part.questions.Count
                    }
                }
                Write-Host "   ✓ Found $($script:questionsCount) questions in test 1" -ForegroundColor Green
                
                $script:allApisWorking = $true
            }
            catch {
                Write-Host "   ✗ Get test questions API failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "   ✗ Get tests API failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "   ✗ No JWT token received" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ✗ Login API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Backend Status Check..." -ForegroundColor Yellow
Write-Host "   - Checking if Spring Boot is running on port 8080..."

try {
    $connection = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "   ✓ Backend server is running" -ForegroundColor Green
    }
    else {
        Write-Host "   ✗ Backend server is not running" -ForegroundColor Red
        Write-Host "   → Please start backend with: mvn spring-boot:run" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   ✗ Cannot check backend server status" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Mobile App Requirements Check..." -ForegroundColor Yellow
Write-Host "   - Checking Flutter environment..."

try {
    $flutterVersion = flutter --version 2>$null | Select-Object -First 1
    if ($flutterVersion) {
        Write-Host "   ✓ Flutter is installed" -ForegroundColor Green
        Write-Host "   ✓ $flutterVersion" -ForegroundColor Green
    }
    else {
        Write-Host "   ✗ Flutter is not installed" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ✗ Flutter is not installed or not in PATH" -ForegroundColor Red
}

Write-Host "   - Checking mobile dependencies..."
if (Test-Path "mobile/pubspec.yaml") {
    Write-Host "   ✓ Mobile project found" -ForegroundColor Green
    if (Test-Path "mobile/pubspec.lock") {
        Write-Host "   ✓ Dependencies are installed" -ForegroundColor Green
    }
    else {
        Write-Host "   ! Dependencies may need installation" -ForegroundColor Yellow
        Write-Host "   → Run: flutter pub get" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   ✗ Mobile project not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Integration Test Summary..." -ForegroundColor Yellow

if ($script:allApisWorking) {
    Write-Host "   🎉 All Backend APIs are working!" -ForegroundColor Green
    Write-Host "   📱 Mobile app should now be able to:" -ForegroundColor Cyan
    Write-Host "      1. Login with kim_sora/password123" -ForegroundColor White
    Write-Host "      2. Load real test data from backend" -ForegroundColor White
    Write-Host "      3. Display $($script:testsCount) available tests" -ForegroundColor White
    Write-Host "      4. Show $($script:questionsCount) questions per test" -ForegroundColor White
    Write-Host ""
    Write-Host "   Next steps:" -ForegroundColor Cyan
    Write-Host "   - Test mobile login flow" -ForegroundColor White
    Write-Host "   - Verify test data loads correctly" -ForegroundColor White
    Write-Host "   - Check submit test functionality" -ForegroundColor White
}
else {
    Write-Host "   ⚠️  Some backend APIs are not working properly" -ForegroundColor Yellow
    Write-Host "   Please check backend server status and logs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
