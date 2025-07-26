# Test main features with proper authentication
$loginData = @{
    username = "teacher"
    password = "password"
} | ConvertTo-Json

Write-Host "=== TESTING MAIN FEATURES ===" -ForegroundColor Yellow
Write-Host ""

# Step 1: Login and get token
Write-Host "1. Testing login..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0,50))..." -ForegroundColor Gray
    Write-Host "User: $($loginResponse.username) (Role: $($loginResponse.roles))" -ForegroundColor Gray
    Write-Host ""
    
    $token = $loginResponse.token
    $headers = @{ Authorization = "Bearer $token" }
    
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 2: Test Lessons
Write-Host "2. Testing Lessons API..." -ForegroundColor Cyan
try {
    $lessons = Invoke-RestMethod -Uri "http://localhost:8080/api/lessons/public/all" -Method GET
    Write-Host "✅ Lessons API working!" -ForegroundColor Green
    Write-Host "Found $($lessons.Count) lessons" -ForegroundColor Gray
    if ($lessons.Count -gt 0) {
        Write-Host "First lesson: $($lessons[0].title)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Lessons API failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

# Step 3: Test Exercises  
Write-Host "3. Testing Exercises API..." -ForegroundColor Cyan
try {
    $exercises = Invoke-RestMethod -Uri "http://localhost:8080/api/exercises" -Method GET -Headers $headers
    Write-Host "✅ Exercises API working!" -ForegroundColor Green
    Write-Host "Found $($exercises.Count) exercises" -ForegroundColor Gray
    if ($exercises.Count -gt 0) {
        Write-Host "First exercise: $($exercises[0].title)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Exercises API failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try alternative endpoints
    Write-Host "🔍 Trying exercises-crud endpoint..." -ForegroundColor Yellow
    try {
        $exercisesCrud = Invoke-RestMethod -Uri "http://localhost:8080/api/exercises-crud" -Method GET -Headers $headers
        Write-Host "✅ Exercises-CRUD API working!" -ForegroundColor Green
        Write-Host "Found $($exercisesCrud.data.Count) exercises" -ForegroundColor Gray
        if ($exercisesCrud.data.Count -gt 0) {
            Write-Host "First exercise: $($exercisesCrud.data[0].title)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Exercises-CRUD API also failed:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    Write-Host ""
}

# Step 4: Test Flashcards
Write-Host "4. Testing Flashcards API..." -ForegroundColor Cyan
try {
    $flashcards = Invoke-RestMethod -Uri "http://localhost:8080/api/flashcard-sets/public" -Method GET
    Write-Host "✅ Flashcards API working!" -ForegroundColor Green
    Write-Host "Found $($flashcards.Count) flashcard sets" -ForegroundColor Gray
    if ($flashcards.Count -gt 0) {
        Write-Host "First flashcard set: $($flashcards[0].title)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Flashcards API failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

# Step 5: Test Lesson Exercises
Write-Host "5. Testing Lesson Exercises (Lesson ID 1)..." -ForegroundColor Cyan
try {
    $lessonExercises = Invoke-RestMethod -Uri "http://localhost:8080/api/lessons/1/exercises" -Method GET -Headers $headers
    Write-Host "✅ Lesson Exercises API working!" -ForegroundColor Green
    Write-Host "Found $($lessonExercises.Count) exercises for lesson 1" -ForegroundColor Gray
    if ($lessonExercises.Count -gt 0) {
        Write-Host "First exercise: $($lessonExercises[0].title)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Lesson Exercises API failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== TEST COMPLETED ===" -ForegroundColor Yellow
