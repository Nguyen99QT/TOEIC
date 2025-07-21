@echo off
REM This batch script helps run SQL scripts to fix foreign key constraint errors
REM Created on July 10, 2025

echo ===================================================================
echo             TOEIC Learning Platform - Database Fix                
echo ===================================================================
echo.
echo This script provides solutions for the foreign key constraint error:
echo #1451 - Cannot delete or update a parent row: a foreign key constraint fails
echo.
echo Choose one of the following options:
echo.
echo 1. UPDATE questions only (keeps user answers) - RECOMMENDED
echo    This option updates all questions with topic-specific resources
echo    while maintaining existing user answers.
echo.
echo 2. DELETE and RECREATE all questions (CAUTION!)
echo    This option deletes all questions AND user answers, then 
echo    recreates all questions with consistent topic-specific resources.
echo    WARNING: This will delete all user progress data!
echo.

set /p OPTION=Enter your choice (1 or 2): 
if "%OPTION%"=="1" (
    set "SQL_FILE=update_questions_with_fk_constraints.sql"
    set "SCRIPT_DESCRIPTION=Update questions while keeping user data"
) else if "%OPTION%"=="2" (
    set "SQL_FILE=recreate_all_questions.sql"
    set "SCRIPT_DESCRIPTION=Delete and recreate all questions (CAUTION: Deletes user progress!)"
) else (
    echo Invalid option. Exiting...
    goto :EOF
)

echo.
echo You selected: %SCRIPT_DESCRIPTION%
echo.
set /p CONFIRM=Are you sure you want to proceed? (Y/N): 
if /i NOT "%CONFIRM%"=="Y" goto :EOF

echo.
echo Options to run the SQL script:
echo.
echo 1. Using phpMyAdmin (recommended for shared hosting)
echo    - Open phpMyAdmin in your browser
echo    - Select your database
echo    - Click on the "SQL" tab
echo    - Open this file: backend\database\migrations\%SQL_FILE%
echo    - Copy its contents and paste them into the SQL query box
echo    - Click "Go" to execute the script
echo.
echo 2. Using MySQL command line
echo    - Open MySQL command line
echo    - Connect to your database
echo    - Run: source c:/path/to/backend/database/migrations/%SQL_FILE%
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

    mysql -u%DB_USER% -p%DB_PASSWORD% -h%DB_HOST% %DB_NAME% < "backend\database\migrations\%SQL_FILE%"

    if %ERRORLEVEL% neq 0 (
        echo.
        echo Error running the SQL script. Please try one of the manual methods described above.
    ) else (
        echo.
        echo SQL script executed successfully!
        echo.
        echo Next steps:
        echo 1. Run create_resource_folders.bat to set up the resource folders
        echo 2. Add the actual audio and image files to the resource folders
        echo 3. Test the application to ensure proper functioning
    )
)

echo.
echo After the SQL script is executed, do you want to set up resource folders?
set /p SETUP_RESOURCES=Create resource folders for audio and images? (Y/N): 
if /i "%SETUP_RESOURCES%"=="Y" (
    echo.
    echo Creating resource folder structure...
    call create_resource_folders.bat
)

echo.
echo Press any key to exit...
pause > nul
