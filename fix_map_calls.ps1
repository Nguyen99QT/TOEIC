# PowerShell script to fix Map.of calls in FlashcardCrudController
$filePath = "backend\src\main\java\com\leenglish\toeic\controller\FlashcardCrudController.java"

# Read file content
$content = Get-Content $filePath -Raw

# Fix broken Map.of calls
$content = $content -replace 'Map\.of\("imageUrl",\s*imageUrl,\s*"Image uploaded successfully"\)', 'Map.of("imageUrl", imageUrl)'
$content = $content -replace 'Map\.of\("audioUrl",\s*audioUrl,\s*"Audio uploaded successfully"\)', 'Map.of("audioUrl", audioUrl)'

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "Fixed Map.of calls in FlashcardCrudController.java"
