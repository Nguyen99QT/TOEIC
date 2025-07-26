# PowerShell script to fix ApiResponse calls in FlashcardCrudController
$filePath = "backend\src\main\java\com\leenglish\toeic\controller\FlashcardCrudController.java"

# Read file content
$content = Get-Content $filePath -Raw

# Replace patterns - carefully handle the different patterns in this file
$content = $content -replace 'ApiResponse\.success\("([^"]+)",\s*([^)]+)\)', 'ApiResponse.successWithData($2, "$1")'
$content = $content -replace 'ApiResponse\.success\(null,\s*"([^"]+)"\)', 'ApiResponse.successMessage("$1")'

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Fixed ApiResponse calls in FlashcardCrudController.java"
