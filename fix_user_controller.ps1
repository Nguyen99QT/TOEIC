# PowerShell script to fix ApiResponse calls in UserController
$filePath = "backend\src\main\java\com\leenglish\toeic\controller\UserController.java"

# Read file content
$content = Get-Content $filePath -Raw

# Replace patterns
$content = $content -replace 'ApiResponse\.success\(([^,]+),\s*"([^"]+)"\)', 'ApiResponse.successWithData($1, "$2")'
$content = $content -replace 'ApiResponse\.success\(null,\s*"([^"]+)"\)', 'ApiResponse.successMessage("$1")'

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Fixed ApiResponse calls in UserController.java"
