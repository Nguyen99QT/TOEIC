# Script PowerShell: Sync audio and image files from resource 1 (resources) to resource 2 (resource) for all types
# Applies to: flashcard, lesson, exercise, question

$types = @("flashcard", "lesson", "exercise", "question")

foreach ($type in $types) {
    $audioRoot1 = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\$type\audio"
    $imageRoot1 = "c:\HK4\toeic3\leenglish-front\backend\src\main\resources\$type\image"
    $audioRoot2 = "c:\HK4\toeic3\leenglish-front\backend\src\main\resource\$type\audio"
    $imageRoot2 = "c:\HK4\toeic3\leenglish-front\backend\src\main\resource\$type\image"

    # Create destination folders if not exist
    if (!(Test-Path $audioRoot2)) { New-Item -ItemType Directory -Path $audioRoot2 -Force | Out-Null }
    if (!(Test-Path $imageRoot2)) { New-Item -ItemType Directory -Path $imageRoot2 -Force | Out-Null }

    # Sync audio files from resource 1 to resource 2
    if (Test-Path $audioRoot1) {
        Get-ChildItem -Path $audioRoot1 -Recurse -Filter *.mp3 | ForEach-Object {
            $dest = Join-Path $audioRoot2 $_.Name
            if (!(Test-Path $dest)) {
                Copy-Item $_.FullName $dest
            }
        }
    }

    # Sync image files from resource 1 to resource 2
    if (Test-Path $imageRoot1) {
        Get-ChildItem -Path $imageRoot1 -Recurse -Include *.jpg, *.jpeg, *.png -File | ForEach-Object {
            $dest = Join-Path $imageRoot2 $_.Name
            if (!(Test-Path $dest)) {
                Copy-Item $_.FullName $dest
            }
        }
    }
}

Write-Host "Sync audio and image files from resources to resource completed for all types!"
