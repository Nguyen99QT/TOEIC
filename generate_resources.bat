@echo off
REM Script to generate images and audio for TOEIC questions
REM Created on July 10, 2025
REM Updated to handle pip issues

echo ===================================================================
echo         TOEIC Resource Generator for Questions
echo ===================================================================
echo.
echo This script will:
echo 1. Create necessary folder structure
echo 2. Install required Python packages
echo 3. Generate images for questions using Pixabay API
echo 4. Generate audio for questions using Google Text-to-Speech
echo.
echo Requirements:
echo - Python 3.6+ must be installed
echo - Internet connection for downloading images and packages
echo.

REM Check if Python is installed
echo Checking for Python installation...
WHERE python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    WHERE python3 >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        WHERE py >nul 2>&1
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Python is not installed or not in PATH.
            echo Please install Python 3.6+ from https://www.python.org/downloads/
            echo.
            echo After installation, make sure to:
            echo 1. Check "Add Python to PATH" during installation
            echo 2. Restart your command prompt
            goto :EOF
        ) else (
            echo Found Python as 'py'
            set PYTHON_CMD=py
        )
    ) else (
        echo Found Python as 'python3'
        set PYTHON_CMD=python3
    )
) else (
    echo Found Python as 'python'
    set PYTHON_CMD=python
)

REM Verify Python version
%PYTHON_CMD% --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to execute Python. Please reinstall and add to PATH.
    goto :EOF
)

REM Create directory structure first
echo.
echo Creating directory structure for resources...
mkdir frontend\public\audio 2>nul
mkdir frontend\public\images 2>nul

REM Create subdirectories for each topic
for %%t in (greetings numbers colors family food hobbies travel work daily_routine weather sports music movies books technology health education business environment culture) do (
    mkdir frontend\public\audio\%%t 2>nul
    mkdir frontend\public\images\%%t 2>nul
    echo Created directories for topic: %%t
)

REM Install required packages
echo.
echo Installing required Python packages...
echo This may take a few minutes...
%PYTHON_CMD% -m pip install requests gtts
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to install packages using pip module. Trying alternative method...
    %PYTHON_CMD% -c "import sys; import subprocess; subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', 'gtts'])"
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install required packages.
        echo.
        echo Please try to install them manually by running:
        echo %PYTHON_CMD% -m pip install requests gtts
        echo.
        set /p CONTINUE=Do you want to continue anyway? (Y/N): 
        if /i NOT "%CONTINUE%"=="Y" goto :EOF
    )
)

REM Ask for SQL file path
echo.
set /p SQL_FILE=Enter path to SQL file with question data [backend\src\main\resources\question_full.sql]: 
if "%SQL_FILE%"=="" set SQL_FILE=backend\src\main\resources\question_full.sql

REM Check if SQL file exists
if not exist "%SQL_FILE%" (
    echo ERROR: SQL file %SQL_FILE% does not exist.
    goto :EOF
)

REM Ask if user wants to force regeneration
echo.
set /p FORCE=Force regeneration of existing files? (Y/N) [N]: 
if /i "%FORCE%"=="Y" (
    set FORCE_FLAG=--force
) else (
    set FORCE_FLAG=
)

REM Generate images
echo.
echo Generating images from Pixabay...
%PYTHON_CMD% generate_images.py --sql "%SQL_FILE%" %FORCE_FLAG%
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Image generation had some errors. Continuing with audio generation...
) else (
    echo Images generated successfully!
)

REM Generate audio
echo.
echo Generating audio files...
%PYTHON_CMD% generate_audio.py --sql "%SQL_FILE%" %FORCE_FLAG%
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Audio generation had some errors.
) else (
    echo Audio files generated successfully!
)

REM Run database update script
echo.
echo Would you like to update the database with the new resource paths?
set /p UPDATE_DB=Run the database update SQL script? (Y/N) [N]: 
if /i "%UPDATE_DB%"=="Y" (
    echo.
    echo Please choose how to run the SQL script:
    echo 1. Open phpMyAdmin in browser
    echo 2. Run with MySQL CLI (if installed)
    echo 3. Skip for now
    echo.
    set /p DB_CHOICE=Enter your choice (1-3): 
    
    if "%DB_CHOICE%"=="1" (
        echo Opening phpMyAdmin...
        start http://localhost/phpmyadmin/
        echo.
        echo Please import this SQL file:
        echo backend\database\migrations\update_question_resource_paths.sql
    ) else if "%DB_CHOICE%"=="2" (
        echo.
        set /p DB_USER=Enter database username [root]: 
        if "%DB_USER%"=="" set DB_USER=root
        
        set /p DB_PASSWORD=Enter database password: 
        
        set /p DB_NAME=Enter database name: 
        
        echo Running SQL script...
        mysql -u%DB_USER% -p%DB_PASSWORD% %DB_NAME% < backend\database\migrations\update_question_resource_paths.sql
        
        if %ERRORLEVEL% NEQ 0 (
            echo Error running SQL script. Please run it manually.
        ) else (
            echo Database updated successfully!
        )
    ) else (
        echo Skipping database update.
    )
)

echo.
echo ===================================================================
echo               Resource generation complete!
echo ===================================================================
echo.
echo Resource files have been created in:
echo - Audio: frontend\public\audio\[topic]
echo - Images: frontend\public\images\[topic]
echo.
echo NEXT STEPS:
echo 1. If you haven't updated the database yet, run this SQL script:
echo    backend\database\migrations\update_question_resource_paths.sql
echo 2. Check the resources in your web application
echo.
echo Press any key to exit...
pause > nul
