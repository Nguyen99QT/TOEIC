@echo off
REM Script to fix audio and image issues in the TOEIC application
REM This will:
REM 1. Analyze audio files and check for issues
REM 2. Update the database to match audio/image files with questions
REM 3. Generate new questions for any unused audio files

echo ======================================================================
echo TOEIC Audio and Image Fixer
echo ======================================================================
echo.

echo Step 1: Validating audio files...
python validate_audio_files.py
if %ERRORLEVEL% NEQ 0 (
    echo Error validating audio files!
    pause
    exit /b 1
)
echo.

echo Step 2: Analyzing audio files and generating questions...
python analyze_audio_and_generate_questions.py
if %ERRORLEVEL% NEQ 0 (
    echo Error analyzing audio files!
    pause
    exit /b 1
)
echo.

echo Step 3: Generating new exercises from audio...
python generate_new_exercises_from_audio.py
if %ERRORLEVEL% NEQ 0 (
    echo Error generating new exercises!
    pause
    exit /b 1
)
echo.

echo Step 4: Running SQL update for audio/image paths...
echo NOTE: You need to manually run the SQL script in your database:
echo       %~dp0database\migrations\update_questions_audio_image.sql
echo.

echo Step 5: Running SQL for new exercises (if any)...
echo NOTE: You need to manually run the SQL script in your database if it exists:
echo       %~dp0database\migrations\new_exercises_from_audio.sql
echo.

echo ======================================================================
echo Completed! Please check the generated reports for any issues.
echo ======================================================================

pause
