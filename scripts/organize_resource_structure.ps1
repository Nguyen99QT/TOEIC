# Script PowerShell: Di chuyển file audio và image vào đúng cấu trúc thư mục mới rõ ràng (lesson, exercise, flashcard, question)
# Đường dẫn thư mục gốc
$audioRoot = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\audio"
$imageRoot = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\images"

# Tạo các thư mục con nếu chưa có
$audioLesson = Join-Path $audioRoot "lesson"
$audioExercise = Join-Path $audioRoot "exercise"
$audioFlashcard = Join-Path $audioRoot "flashcard"
$audioQuestion = Join-Path $audioRoot "question"
$imageLesson = Join-Path $imageRoot "lesson"
$imageExercise = Join-Path $imageRoot "exercise"
$imageFlashcard = Join-Path $imageRoot "flashcard"
$imageQuestion = Join-Path $imageRoot "question"

$folders = @($audioLesson, $audioExercise, $audioFlashcard, $audioQuestion, $imageLesson, $imageExercise, $imageFlashcard, $imageQuestion)
foreach ($f in $folders) { if (!(Test-Path $f)) { New-Item -ItemType Directory -Path $f | Out-Null } }

# Di chuyển file audio
Get-ChildItem -Path $audioRoot -Filter *.mp3 | ForEach-Object {
    $name = $_.Name
    if ($name -match "^lesson[0-9]+\.mp3$") {
        Move-Item $_.FullName (Join-Path $audioLesson $name) -Force
    }
    elseif ($name -match "^exercise[0-9]+\.mp3$") {
        Move-Item $_.FullName (Join-Path $audioExercise $name) -Force
    }
    elseif ($name -match "^question[0-9]+\.mp3$") {
        Move-Item $_.FullName (Join-Path $audioQuestion $name) -Force
    }
    else {
        Move-Item $_.FullName (Join-Path $audioFlashcard $name) -Force
    }
}

# Di chuyển file image
Get-ChildItem -Path $imageRoot -Filter *.jpg | ForEach-Object {
    $name = $_.Name
    if ($name -match "^lesson[0-9]+\.jpg$") {
        Move-Item $_.FullName (Join-Path $imageLesson $name) -Force
    }
    elseif ($name -match "^exercise[0-9]+\.jpg$") {
        Move-Item $_.FullName (Join-Path $imageExercise $name) -Force
    }
    elseif ($name -match "^question[0-9]+\.jpg$") {
        Move-Item $_.FullName (Join-Path $imageQuestion $name) -Force
    }
    else {
        Move-Item $_.FullName (Join-Path $imageFlashcard $name) -Force
    }
}

Write-Host "Đã di chuyển xong file audio và image vào các thư mục lesson, exercise, flashcard, question theo cấu trúc mới!"
Write-Host "Bước tiếp theo: Chạy lệnh SQL update đường dẫn audio_url và image_url trong database cho đúng cấu trúc mới."
