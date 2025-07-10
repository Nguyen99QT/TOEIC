# PowerShell script to create empty .mp3 and .jpg files for each flashcard term
# Usage: Place this script in the root of your workspace and run it in PowerShell

# List of terms (copy from your SQL or update as needed)
$terms = @(
    "Apple", "Book", "Car", "Dog", "Go", "Eat", "Read", "Write",
    "Red", "Blue", "Green", "Yellow", "Banana", "Orange", "Grape", "Mango",
    "Cat", "Bird", "Fish", "Horse", "Meeting", "Deadline", "Contract", "Promotion",
    "Airport", "Passport", "Luggage", "Tourist", "Software", "Hardware", "Network", "Database",
    "Break a leg", "Hit the books", "Piece of cake", "Under the weather",
    "Arise", "Comprehend", "Negotiate", "Accomplish"
)

# Paths to backend resource folders
$audioDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\audio"
$imageDir = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards\images"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

foreach ($term in $terms) {
    # Replace invalid filename characters
    $safeTerm = $term -replace '[\\/:*?"<>|]', '_'
    $audioPath = Join-Path $audioDir ("$safeTerm.mp3")
    $imagePath = Join-Path $imageDir ("$safeTerm.jpg")
    New-Item -ItemType File -Force -Path $audioPath | Out-Null
    New-Item -ItemType File -Force -Path $imagePath | Out-Null
}

Write-Host "Đã tạo xong file .mp3 và .jpg cho tất cả các term trong backend!"
