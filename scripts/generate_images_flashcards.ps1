# PowerShell script: Tự động tạo file sample.jpg (ảnh trắng 200x200) và ghi đè lên tất cả file image chưa có
# Yêu cầu: Đã có file sample.jpg hợp lệ trong thư mục scripts

$imageDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\images"
$sampleJpg = "c:\HK4\toeic3\leenglish-front\scripts\sample.jpg"

# Lấy danh sách tên file ảnh cần có (ví dụ lấy từ danh sách từ vựng)
$words = @(
    "Apple", "Book", "Car", "Dog", "Go", "Eat", "Read", "Write", "Red", "Blue", "Green", "Yellow", "Banana", "Orange", "Grape", "Mango", "Cat", "Bird", "Fish", "Horse", "Meeting", "Deadline", "Contract", "Promotion", "Airport", "Passport", "Luggage", "Tourist", "Software", "Hardware", "Network", "Database", "Break a leg", "Hit the books", "Piece of cake", "Under the weather", "Arise", "Comprehend", "Negotiate", "Accomplish"
)

foreach ($word in $words) {
    # Sanitize word: replace non-alphanumeric characters with underscores
    $sanitizedWord = ($word -replace '[^a-zA-Z0-9]', '_')
    $fileName = "$sanitizedWord.jpg"
    $filePath = Join-Path $imageDir $fileName
    if (!(Test-Path $filePath)) {
        Copy-Item -Path $sampleJpg -Destination $filePath -Force
        Write-Host "Đã tạo ảnh trắng cho: $fileName"
    }
}

Write-Host "Đã tự động tạo ảnh trắng cho tất cả từ chưa có file ảnh!"
