$sqlFilePath = "c:\TOEIC\TOEIC-Group-Huy\backend\database\migrations\update_questions.sql"

# Read the file as a single string to preserve linebreaks
$content = [System.IO.File]::ReadAllText($sqlFilePath)

# Define the regex patterns to find audio_url and image_url assignments
$audioPattern = "(`audio_url`\s*=\s*')[^']*('"
$imagePattern = "(`image_url`\s*=\s*')[^']*('"

# Extract all exercise_id and question_order pairs
$wherePattern = "WHERE\s+`exercise_id`\s*=\s*(\d+)\s+AND\s+`question_order`\s*=\s*(\d+)"
$whereMatches = [regex]::Matches($content, $wherePattern)

# Create a dictionary to map exercise_id and question_order to file numbers
$fileNumberMap = @{}
$fileCounter = 1

foreach ($match in $whereMatches) {
    $exerciseId = $match.Groups[1].Value
    $questionOrder = $match.Groups[2].Value
    $key = "$exerciseId-$questionOrder"
    $fileNumberMap[$key] = $fileCounter
    $fileCounter++
}

# Now process each exercise_id and question_order pair
foreach ($match in $whereMatches) {
    $exerciseId = $match.Groups[1].Value
    $questionOrder = $match.Groups[2].Value
    $key = "$exerciseId-$questionOrder"
    $fileNumber = $fileNumberMap[$key]
    
    # Find the full UPDATE statement for this pair
    $updatePattern = "UPDATE\s+`questions`[^W]+WHERE\s+`exercise_id`\s*=\s*$exerciseId\s+AND\s+`question_order`\s*=\s*$questionOrder"
    $updateMatch = [regex]::Match($content, $updatePattern)
    
    if ($updateMatch.Success) {
        $updateStatement = $updateMatch.Value
        
        # Update audio_url in this statement
        $updatedStatement = [regex]::Replace($updateStatement, $audioPattern, "`$1/files/audio/exercises/ex$fileNumber.mp3`$2")
        
        # Update image_url in the updated statement
        $updatedStatement = [regex]::Replace($updatedStatement, $imagePattern, "`$1/files/images/exercises/ex$fileNumber.jpg`$2")
        
        # Replace the original statement with the updated one
        $content = $content.Replace($updateStatement, $updatedStatement)
    }
}

# Write the updated content back to the file
[System.IO.File]::WriteAllText($sqlFilePath, $content)

Write-Host "Updated file paths for $($fileCounter-1) questions."
