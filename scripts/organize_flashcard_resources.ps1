# Script PowerShell: Sắp xếp lại file audio và image flashcard vào thư mục theo set, xóa file cũ
# Bước 1: Đảm bảo bạn đã backup dữ liệu trước khi chạy!
# Bước 2: Chạy script này để di chuyển file

# Đường dẫn thư mục gốc
$audioRoot = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\audio"
$imageRoot = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\images"

# Danh sách flashcard: tên file và set_id (bạn có thể xuất từ database ra file CSV, ở đây ví dụ cứng)
$flashcards = @(
    @{Name = "Apple"; SetId = 1 },
    @{Name = "Book"; SetId = 1 },
    @{Name = "Go"; SetId = 2 },
    @{Name = "Eat"; SetId = 2 },
    @{Name = "Red"; SetId = 3 },
    @{Name = "Banana"; SetId = 4 },
    @{Name = "Cat"; SetId = 5 },
    @{Name = "Meeting"; SetId = 6 }
    # ... Thêm các flashcard khác ở đây
)

foreach ($fc in $flashcards) {
    $setFolderAudio = Join-Path $audioRoot ("set" + $fc.SetId)
    $setFolderImage = Join-Path $imageRoot ("set" + $fc.SetId)
    if (!(Test-Path $setFolderAudio)) { New-Item -ItemType Directory -Path $setFolderAudio | Out-Null }
    if (!(Test-Path $setFolderImage)) { New-Item -ItemType Directory -Path $setFolderImage | Out-Null }

    $audioFileOld = Join-Path $audioRoot ($fc.Name + ".mp3")
    $audioFileNew = Join-Path $setFolderAudio ($fc.Name + ".mp3")
    if (Test-Path $audioFileOld) {
        Move-Item -Path $audioFileOld -Destination $audioFileNew -Force
        Write-Host "Đã chuyển $($fc.Name).mp3 vào $setFolderAudio"
    }

    $imageFileOld = Join-Path $imageRoot ($fc.Name + ".jpg")
    $imageFileNew = Join-Path $setFolderImage ($fc.Name + ".jpg")
    if (Test-Path $imageFileOld) {
        Move-Item -Path $imageFileOld -Destination $imageFileNew -Force
        Write-Host "Đã chuyển $($fc.Name).jpg vào $setFolderImage"
    }
}

Write-Host "Đã sắp xếp xong file audio và image theo set!"
Write-Host "Bước tiếp theo: Chạy lệnh SQL update đường dẫn audio_url và image_url trong database như hướng dẫn."
