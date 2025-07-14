@echo off
REM This batch script helps run the SQL script to update all question resources by topic
REM Created on July 10, 2025

echo ===================================================================
echo             TOEIC Learning Platform - Question Resource Update     
echo ===================================================================
echo.
echo This script will help you run the SQL script to update all questions
echo with proper topic-specific audio and image resource paths.
echo.
echo Steps this script will perform:
echo 1. Create resource folders for each topic if they don't exist
echo 2. Run the SQL script to update all questions with proper resource paths
echo.

REM First, create the resource folders
set /p SETUP_RESOURCES=Do you want to set up resource folders? (Y/N): 
if /i "%SETUP_RESOURCES%"=="Y" (
    echo.
    echo Creating resource folder structure...
    call create_resource_folders.bat
    echo.
    echo Resource folders created successfully!
)

echo.
echo Options to run the SQL script:
echo.
echo 1. Using phpMyAdmin (recommended for shared hosting)
echo    - Open phpMyAdmin in your browser
echo    - Select your database
echo    - Click on the "SQL" tab
echo    - Open this file: backend\database\migrations\update_all_question_resources.sql
echo    - Copy its contents and paste them into the SQL query box
echo    - Click "Go" to execute the script
echo.
echo 2. Using MySQL command line
echo    - Open MySQL command line
echo    - Connect to your database
echo    - Run: source c:/path/to/backend/database/migrations/update_all_question_resources.sql
echo.
echo 3. Using this batch script (if MySQL is in your PATH)
echo    Enter your MySQL credentials below:
echo.

set /p RUN_SQL=Do you want to run the SQL script now? (Y/N): 
if /i "%RUN_SQL%"=="Y" (
    set /p DB_USER=Enter database username (default: root): 
    if "%DB_USER%"=="" set DB_USER=root

    set /p DB_PASSWORD=Enter database password: 

    set /p DB_NAME=Enter database name (default: toeic8): 
    if "%DB_NAME%"=="" set DB_NAME=toeic8

    set /p DB_HOST=Enter database host (default: localhost): 
    if "%DB_HOST%"=="" set DB_HOST=localhost

    echo.
    echo Attempting to run the SQL script...
    echo.

    mysql -u%DB_USER% -p%DB_PASSWORD% -h%DB_HOST% %DB_NAME% < "backend\database\migrations\update_all_question_resources.sql"

    if %ERRORLEVEL% neq 0 (
        echo.
        echo Error running the SQL script. Please try one of the manual methods described above.
    ) else (
        echo.
        echo SQL script executed successfully!
        echo.
        echo Next steps:
        echo 1. Verify that all questions now have topic-specific audio_url and image_url paths
        echo 2. Add the actual audio and image files to the resource folders following the naming pattern:
        echo    - Audio files: [topic]/[topic]_q[question_order]_[exercise_id].mp3
        echo    - Image files: [topic]/[topic]_q[question_order]_[exercise_id].jpg
        echo    Example: /audio/greetings/greeting_q1_45.mp3, /images/colors/color_q2_22.jpg
        echo 3. Test the application to ensure proper functioning
    )
)

echo.
echo Press any key to exit...
pause > nul
