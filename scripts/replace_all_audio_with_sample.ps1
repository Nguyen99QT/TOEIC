# PowerShell script: Replace all .mp3 files in the audio folder with a valid sample.mp3
# Place a valid sample.mp3 in the same scripts folder before running this script

$audioDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\audio"
$sampleMp3 = "c:\HK4\toeic3\leenglish-front\scripts\sample.mp3"

if (!(Test-Path $sampleMp3)) {
    Write-Host "Vui lòng đặt một file sample.mp3 hợp lệ vào thư mục scripts trước khi chạy script này!"
    exit 1
}

Get-ChildItem -Path $audioDir -Filter *.mp3 | ForEach-Object {
    Copy-Item -Path $sampleMp3 -Destination $_.FullName -Force
}

Write-Host "Đã thay thế tất cả file .mp3 bằng sample.mp3 hợp lệ!"
