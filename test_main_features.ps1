# Test Exercise, Lesson, and Flashcard features
Write-Host "=== TESTING MAIN FEATURES: EXERCISE, LESSON, FLASHCARD ===" -ForegroundColor Cyan

# 1. Login to get token
Write-Host "`n1. Logging in to get authentication token..." -ForegroundColor Yellow
$loginData = @{
    username = "teacher"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "✅ Login successful! Token obtained." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 2. Test Lessons
Write-Host "`n2. Testing LESSONS..." -ForegroundColor Yellow
try {
    $lessons = Invoke-RestMethod -Uri "http://localhost:8080/api/lessons" -Method GET -Headers $headers
    Write-Host "✅ Lessons API works! Found $($lessons.data.content.Count) lessons" -ForegroundColor Green
    if ($lessons.data.content.Count -gt 0) {
        $lesson = $lessons.data.content[0]
        Write-Host "   - First lesson: '$($lesson.title)' (ID: $($lesson.id))" -ForegroundColor Cyan
        
        # Test get specific lesson
        $lessonDetail = Invoke-RestMethod -Uri "http://localhost:8080/api/lessons/$($lesson.id)" -Method GET -Headers $headers
        Write-Host "   - Lesson details retrieved successfully" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Lessons API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test Exercises
Write-Host "`n3. Testing EXERCISES..." -ForegroundColor Yellow
try {
    $exercises = Invoke-RestMethod -Uri "http://localhost:8080/api/exercises" -Method GET -Headers $headers
    Write-Host "✅ Exercises API works! Found $($exercises.data.content.Count) exercises" -ForegroundColor Green
    if ($exercises.data.content.Count -gt 0) {
        $exercise = $exercises.data.content[0]
        Write-Host "   - First exercise: '$($exercise.title)' (ID: $($exercise.id))" -ForegroundColor Cyan
        
        # Test get specific exercise
        $exerciseDetail = Invoke-RestMethod -Uri "http://localhost:8080/api/exercises/$($exercise.id)" -Method GET -Headers $headers
        Write-Host "   - Exercise details retrieved successfully" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Exercises API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test Flashcards
Write-Host "`n4. Testing FLASHCARDS..." -ForegroundColor Yellow
try {
    # Try different flashcard endpoints
    try {
        $flashcardSets = Invoke-RestMethod -Uri "http://localhost:8080/api/flashcard-sets" -Method GET -Headers $headers
        Write-Host "✅ Flashcard Sets API works! Found $($flashcardSets.data.Count) flashcard sets" -ForegroundColor Green
        if ($flashcardSets.data.Count -gt 0) {
            $flashcardSet = $flashcardSets.data[0]
            Write-Host "   - First flashcard set: '$($flashcardSet.title)' (ID: $($flashcardSet.id))" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   - /api/flashcard-sets endpoint failed, trying alternative..." -ForegroundColor Yellow
        
        # Try public flashcards
        $publicFlashcards = Invoke-RestMethod -Uri "http://localhost:8080/api/flashcard-sets/public" -Method GET
        Write-Host "✅ Public Flashcards API works! Found $($publicFlashcards.data.Count) public flashcard sets" -ForegroundColor Green
        if ($publicFlashcards.data.Count -gt 0) {
            $flashcardSet = $publicFlashcards.data[0]
            Write-Host "   - First public flashcard set: '$($flashcardSet.title)' (ID: $($flashcardSet.id))" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Flashcards API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test Questions (for exercises)
Write-Host "`n5. Testing QUESTIONS..." -ForegroundColor Yellow
try {
    # Try different question endpoints
    try {
        $questions = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/questions" -Method GET -Headers $headers
        Write-Host "✅ Admin Questions API works! Found $($questions.data.content.Count) questions" -ForegroundColor Green
        if ($questions.data.content.Count -gt 0) {
            $question = $questions.data.content[0]
            Write-Host "   - First question: Part $($question.part) - $($question.questionText.Substring(0,50))..." -ForegroundColor Cyan
        }
    } catch {
        Write-Host "   - Admin questions endpoint failed, trying collaborator..." -ForegroundColor Yellow
        $questions = Invoke-RestMethod -Uri "http://localhost:8080/api/collaborator/questions" -Method GET -Headers $headers
        Write-Host "✅ Collaborator Questions API works! Found $($questions.data.content.Count) questions" -ForegroundColor Green
        if ($questions.data.content.Count -gt 0) {
            $question = $questions.data.content[0]
            Write-Host "   - First question: Part $($question.part)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Questions API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Test User Stats/Progress
Write-Host "`n6. Testing USER PROGRESS..." -ForegroundColor Yellow
try {
    # Try different user stats endpoints
    try {
        $userStats = Invoke-RestMethod -Uri "http://localhost:8080/api/users/me" -Method GET -Headers $headers
        Write-Host "✅ User Profile API works!" -ForegroundColor Green
        Write-Host "   - Username: $($userStats.data.username)" -ForegroundColor Cyan
        Write-Host "   - Role: $($userStats.data.role)" -ForegroundColor Cyan
        Write-Host "   - Membership: $($userStats.data.membershipType)" -ForegroundColor Cyan
    } catch {
        Write-Host "   - User profile endpoint failed, trying alternative..." -ForegroundColor Yellow
        $userInfo = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method GET -Headers $headers
        Write-Host "✅ Auth User Info API works!" -ForegroundColor Green
        Write-Host "   - User ID: $($userInfo.data.id)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ User Info API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTING COMPLETED ===" -ForegroundColor Cyan
