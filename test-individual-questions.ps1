# Test Individual Questions API
Write-Host "=== Testing Individual Questions API ===" -ForegroundColor Green

# Login first
Write-Host "1. Login..." -ForegroundColor Yellow
$loginData = @{
    username = "teacher"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

# Test current individual questions
Write-Host "2. Testing current individual questions..." -ForegroundColor Yellow
try {
    $questionsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/question-bank/my" -Method GET -Headers $headers
    Write-Host "✅ Individual questions fetched successfully!" -ForegroundColor Green
    Write-Host "Number of questions: $($questionsResponse.Count)" -ForegroundColor Cyan
    
    if ($questionsResponse.Count -gt 0) {
        Write-Host "Questions found:" -ForegroundColor Cyan
        foreach ($q in $questionsResponse) {
            Write-Host "  - ID: $($q.questionId), Part: $($q.partNumber), Text: $($q.questionText.Substring(0, [Math]::Min(50, $q.questionText.Length)))..." -ForegroundColor White
        }
    } else {
        Write-Host "No individual questions found for this user" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Individual questions fetch failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
}

# For reference: creating individual questions requires multipart/form-data
Write-Host "3. Note: Creating individual questions requires multipart/form-data format" -ForegroundColor Yellow
Write-Host "   Use the frontend form or test with a proper multipart request" -ForegroundColor Yellow

Write-Host "=== Test completed ===" -ForegroundColor Green
