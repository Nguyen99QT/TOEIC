@echo off
REM =======================================================================
REM Script to synchronize the database with the actual audio and image files
REM =======================================================================

echo ===== TOEIC Platform Media Files Synchronization =====
echo.
echo This script will:
echo 1. Verify media files in the database against the file system
echo 2. Generate SQL scripts to update the database
echo 3. Execute the SQL scripts to update the database
echo.

REM Verify Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed or not in the PATH.
    echo Please install Python before running this script.
    exit /b 1
)

REM Verify required Python packages
echo Checking required Python packages...
python -c "import mysql.connector" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing required Python packages...
    pip install mysql-connector-python
)

REM Run verification script
echo.
echo ===== Verifying media files in database =====
python verify_and_update_media_files.py

REM Check if verification was successful
if %ERRORLEVEL% NEQ 0 (
    echo Error: Media file verification failed.
    exit /b 1
)

echo.
echo ===== Checking for MySQL connection =====
REM Prompt for MySQL credentials if needed
set /p DB_USER=Enter MySQL username (default: root): 
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD=Enter MySQL password (leave empty if none): 

set /p DB_NAME=Enter database name (default: toeic8): 
if "%DB_NAME%"=="" set DB_NAME=toeic8

REM Test MySQL connection
echo Testing MySQL connection...
mysql -u%DB_USER% -p%DB_PASSWORD% -e "USE %DB_NAME%" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Could not connect to MySQL database.
    echo Please check your credentials and try again.
    exit /b 1
)

echo MySQL connection successful!

REM Execute SQL scripts
echo.
echo ===== Executing SQL scripts =====
echo.
echo 1. Creating backup of questions table...
mysql -u%DB_USER% -p%DB_PASSWORD% %DB_NAME% -e "CREATE TABLE IF NOT EXISTS questions_backup LIKE questions; INSERT INTO questions_backup SELECT * FROM questions;"

echo 2. Updating questions URLs...
mysql -u%DB_USER% -p%DB_PASSWORD% %DB_NAME% < database\migrations\update_exercise_questions_urls.sql

echo 3. Synchronizing questions with exercises data...
mysql -u%DB_USER% -p%DB_PASSWORD% %DB_NAME% < database\migrations\sync_questions_from_exercises.sql

echo.
echo ===== Verification =====
echo Running final check to ensure all media files are correctly referenced...
python verify_and_update_media_files.py

echo.
echo ===== Process Complete =====
echo.
echo If any issues were found, please check the generated report files:
echo - media_files_verification_report.txt
echo.
echo Thank you for using the TOEIC Platform Media Files Synchronization tool.
echo.
