# Test edit blog API với PowerShell
# Chạy script này để test endpoint PUT /api/blog/3/upload

# Lấy token từ frontend (bạn cần copy token từ localStorage)
# Thay thế YOUR_TOKEN_HERE bằng token thực
$token = "YOUR_TOKEN_HERE"

# Tạo boundary cho multipart form
$boundary = [System.Guid]::NewGuid().ToString()

# Tạo multipart form data
$LF = "`r`n"
$body = "--$boundary$LF"
$body += "Content-Disposition: form-data; name=`"title`"$LF$LF"
$body += "Test Edit Title " + (Get-Date).Ticks + "$LF"
$body += "--$boundary$LF"
$body += "Content-Disposition: form-data; name=`"content`"$LF$LF"
$body += "Test Edit Content " + (Get-Date).Ticks + "$LF"
$body += "--$boundary--$LF"

# Headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    Write-Host "🚀 Sending PUT request to http://localhost:8080/api/blog/3/upload" -ForegroundColor Green
    
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/blog/3/upload" `
                                  -Method PUT `
                                  -Headers $headers `
                                  -Body $body `
                                  -ContentType "multipart/form-data; boundary=$boundary"
    
    Write-Host "✅ Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error response body: $responseBody" -ForegroundColor Red
    }
}
