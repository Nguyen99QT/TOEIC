# PowerShell script: Tự động tạo file sample.mp3 silent (1 giây) và ghi đè lên tất cả file audio
# Yêu cầu: Đã cài ffmpeg và ffmpeg có trong PATH

$audioDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\audio"
$sampleMp3 = "c:\HK4\toeic3\leenglish-front\scripts\sample.mp3"

# Tạo file sample.mp3 silent nếu chưa có
if (!(Test-Path $sampleMp3)) {
    Write-Host "Đang tạo file sample.mp3 silent..."
    ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame $sampleMp3
}

# Ghi đè tất cả file .mp3 bằng sample.mp3
Get-ChildItem -Path $audioDir -Filter *.mp3 | ForEach-Object {
    Copy-Item -Path $sampleMp3 -Destination $_.FullName -Force
}

Write-Host "Đã tự động tạo và thay thế tất cả file .mp3 bằng file silent hợp lệ!"
