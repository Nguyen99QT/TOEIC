# PowerShell script to fix ApiResponse.successWithData calls missing message parameter
$filePath = "backend\src\main\java\com\leenglish\toeic\controller\FlashcardCrudController.java"

# Read file content
$content = Get-Content $filePath -Raw

# Fix successWithData calls to include message parameter
$content = $content -replace 'ApiResponse\.successWithData\(Map\.of\("imageUrl",\s*imageUrl\)\)', 'ApiResponse.successWithData(Map.of("imageUrl", imageUrl), "Image uploaded successfully")'
$content = $content -replace 'ApiResponse\.successWithData\(Map\.of\("audioUrl",\s*audioUrl\)\)', 'ApiResponse.successWithData(Map.of("audioUrl", audioUrl), "Audio uploaded successfully")'

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Fixed ApiResponse.successWithData calls in FlashcardCrudController.java"
