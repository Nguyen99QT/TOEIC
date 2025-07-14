@echo off
REM This batch script helps run the fixed SQL script to add multiple questions to exercises
REM Created on July 10, 2025

echo ===================================================================
echo             TOEIC Learning Platform - Database Update             
echo             Add Multiple Questions to Exercises (FIXED)
echo ===================================================================
echo.
echo This script will help you run the fixed SQL script to add 3 questions
echo to each exercise with unique audio and image paths.
echo.
echo Options to run the SQL script:
echo.
echo 1. Using phpMyAdmin (recommended for shared hosting)
echo    - Open phpMyAdmin in your browser
echo    - Select your database
echo    - Click on the "SQL" tab
echo    - Open this file: backend\database\migrations\update_exercises_with_topic_questions_fixed.sql
echo    - Copy its contents and paste them into the SQL query box
echo    - Click "Go" to execute the script
echo.
echo 2. Using MySQL command line
echo    - Open MySQL command line
echo    - Connect to your database
echo    - Run: source c:/path/to/backend/database/migrations/update_exercises_with_topic_questions_fixed.sql
echo.
echo 3. Using this batch script (if MySQL is in your PATH)
echo    Enter your MySQL credentials below:
echo.

set /p DB_USER=Enter database username (default: root): 
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD=Enter database password: 

set /p DB_NAME=Enter database name (default: toeic_db): 
if "%DB_NAME%"=="" set DB_NAME=toeic_db

set /p DB_HOST=Enter database host (default: localhost): 
if "%DB_HOST%"=="" set DB_HOST=localhost

echo.
echo Attempting to run the SQL script...
echo.

mysql -u%DB_USER% -p%DB_PASSWORD% -h%DB_HOST% %DB_NAME% < "backend\database\migrations\update_exercises_with_topic_questions_fixed.sql"

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error running the SQL script. Please try one of the manual methods described above.
) else (
    echo.
    echo SQL script executed successfully!
    echo.
    echo Next steps:
    echo 1. Verify that all exercises now have 3 questions
    echo 2. Check that each question has its own unique audio_url and image_url
    echo 3. Create the necessary audio and image files, or ensure the paths are correctly mapped
    echo 4. Test the application to ensure proper functioning
)

echo.
echo Press any key to exit...
pause > nul
