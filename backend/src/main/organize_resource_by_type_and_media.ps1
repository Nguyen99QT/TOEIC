# Script PowerShell: Gom và phân loại file audio, image từ cả hai thư mục resource/resources trong backend về đúng cấu trúc chuẩn
# Kiểm tra file hợp lệ trước khi di chuyển

$backendRoot = "c:\HK4\toeic3\leenglish-front\backend\src\main"
$roots = @(
    "$backendRoot\resources",
    "$backendRoot\resource"
)
$targetRoot = "$backendRoot\resources"
$types = @("flashcard", "lesson", "exercise", "question")

# Tạo thư mục con audio/ và image/ cho từng loại trong thư mục chuẩn
foreach ($type in $types) {
    $audioDir = Join-Path $targetRoot "$type/audio"
    $imageDir = Join-Path $targetRoot "$type/image"
    if (!(Test-Path $audioDir)) { New-Item -ItemType Directory -Path $audioDir | Out-Null }
    if (!(Test-Path $imageDir)) { New-Item -ItemType Directory -Path $imageDir | Out-Null }
}

# Kiểm tra file mp3 hợp lệ (header: 49 44 33 hoặc FF FB)
function Is-ValidMp3 {
    param($filePath)
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    return (
        ($bytes[0] -eq 0x49 -and $bytes[1] -eq 0x44 -and $bytes[2] -eq 0x33) -or # ID3
        ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFB) # MPEG
    )
}

# Kiểm tra file jpg hợp lệ (header: FF D8)
function Is-ValidJpg {
    param($filePath)
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    return ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8)
}

# Hàm gom và di chuyển file audio
function Move-AudioFiles {
    param($srcRoot)
    Get-ChildItem -Path $srcRoot -Recurse -Include *.mp3 -File | ForEach-Object {
        $name = $_.Name
        if (-not (Is-ValidMp3 $_.FullName)) {
            Write-Host "[CẢNH BÁO] File mp3 không hợp lệ, đã xóa: $($_.FullName)"
            Remove-Item $_.FullName -Force
            return
        }
        if ($name -match "^lesson[0-9]+\.mp3$") {
            Move-Item $_.FullName (Join-Path $targetRoot "lesson/audio/$name") -Force
        }
        elseif ($name -match "^exercise[0-9]+\.mp3$") {
            Move-Item $_.FullName (Join-Path $targetRoot "exercise/audio/$name") -Force
        }
        elseif ($name -match "^question[0-9]+\.mp3$") {
            Move-Item $_.FullName (Join-Path $targetRoot "question/audio/$name") -Force
        }
        else {
            Move-Item $_.FullName (Join-Path $targetRoot "flashcard/audio/$name") -Force
        }
    }
}

# Hàm gom và di chuyển file image
function Move-ImageFiles {
    param($srcRoot)
    Get-ChildItem -Path $srcRoot -Recurse -Include *.jpg, *.jpeg, *.png -File | ForEach-Object {
        $name = $_.Name
        if ($name -like "*.jpg" -or $name -like "*.jpeg") {
            if (-not (Is-ValidJpg $_.FullName)) {
                Write-Host "[CẢNH BÁO] File jpg không hợp lệ, đã xóa: $($_.FullName)"
                Remove-Item $_.FullName -Force
                return
            }
        }
        if ($name -match "^lesson[0-9]+\.(jpg|jpeg|png)$") {
            Move-Item $_.FullName (Join-Path $targetRoot "lesson/image/$name") -Force
        }
        elseif ($name -match "^exercise[0-9]+\.(jpg|jpeg|png)$") {
            Move-Item $_.FullName (Join-Path $targetRoot "exercise/image/$name") -Force
        }
        elseif ($name -match "^question[0-9]+\.(jpg|jpeg|png)$") {
            Move-Item $_.FullName (Join-Path $targetRoot "question/image/$name") -Force
        }
        else {
            Move-Item $_.FullName (Join-Path $targetRoot "flashcard/image/$name") -Force
        }
    }
}

# Gom file từ cả hai thư mục nguồn (chỉ trong backend)
foreach ($root in $roots) {
    if (Test-Path $root) {
        Move-AudioFiles -srcRoot $root
        Move-ImageFiles -srcRoot $root
    }
}

# Xóa thư mục resource nếu rỗng và khác resources
$redundant = "$backendRoot\resource"
if ((Test-Path $redundant) -and ((Get-ChildItem -Path $redundant -Recurse | Measure-Object).Count -eq 0)) {
    Remove-Item $redundant -Recurse -Force
    Write-Host "Đã xóa thư mục resource thừa: $redundant"
}

Write-Host "Đã gom và phân loại xong file audio, image về đúng cấu trúc chuẩn trong backend!"
