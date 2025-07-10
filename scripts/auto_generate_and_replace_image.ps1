# PowerShell script: Tự động tạo file sample.jpg (ảnh trắng 200x200) và ghi đè lên tất cả file image
# Yêu cầu: Đã cài ImageMagick và convert có trong PATH

$imageDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\images"
$sampleJpg = "c:\HK4\toeic3\leenglish-front\scripts\sample.jpg"

# Tạo file sample.jpg trắng nếu chưa có
if (!(Test-Path $sampleJpg)) {
    Write-Host "Đang tạo file sample.jpg trắng..."
    convert -size 200x200 xc:white $sampleJpg
}

# Ghi đè tất cả file .jpg bằng sample.jpg
Get-ChildItem -Path $imageDir -Filter *.jpg | ForEach-Object {
    Copy-Item -Path $sampleJpg -Destination $_.FullName -Force
}

Write-Host "Đã tự động tạo và thay thế tất cả file .jpg bằng file trắng hợp lệ!"
