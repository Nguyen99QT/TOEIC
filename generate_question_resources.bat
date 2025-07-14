@echo off
REM Script to generate images and audio for TOEIC questions
REM Created on July 10, 2025

echo ===================================================================
echo         TOEIC Resource Generator for Questions
echo ===================================================================
echo.
echo This script will:
echo 1. Install required Python packages
echo 2. Generate images for questions using Pixabay API
echo 3. Generate audio for questions using Google Text-to-Speech
echo.
echo Requirements:
echo - Python 3.6+ must be installed
echo - Internet connection for downloading images and packages
echo.

REM Set Python command to use Python launcher (py)
set PYTHON_CMD=py

REM Verify Python version
%PYTHON_CMD% --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to execute Python. Please reinstall and add to PATH.
    goto :EOF
)

REM Check if requirements.txt exists, if not create it
if not exist requirements.txt (
    echo Creating requirements.txt file...
    echo requests>=2.25.1 > requirements.txt
    echo gtts>=2.2.3 >> requirements.txt
)

REM Install required packages
echo.
echo Installing required Python packages...
echo This may take a few minutes...
%PYTHON_CMD% -m pip install requests gtts
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to install packages using pip module. Trying alternative methods...
    
    REM Try using pip directly if it exists
    WHERE pip >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Using pip directly...
        pip install requests gtts
    ) else (
        WHERE pip3 >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo Using pip3 directly...
            pip3 install requests gtts
        ) else (
            echo Trying Python subprocess approach...
            %PYTHON_CMD% -c "import sys; import subprocess; subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', 'gtts'])"
            
            if %ERRORLEVEL% NEQ 0 (
                echo Trying to bootstrap pip...
                %PYTHON_CMD% -c "import ensurepip; ensurepip._bootstrap(); import pip; pip._internal.main(['install', 'requests', 'gtts'])"
                
                if %ERRORLEVEL% NEQ 0 (
                    echo ERROR: All attempts to install packages failed.
                    echo.
                    echo Please try installing the packages manually:
                    echo 1. Open a new command prompt as administrator
                    echo 2. Run: %PYTHON_CMD% -m ensurepip --upgrade
                    echo 3. Run: %PYTHON_CMD% -m pip install requests gtts
                    echo 4. Then run this script again
                    echo.
                    echo If problems persist, you may need to check your Python installation.
                    goto :EOF
                )
            )
        )
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

echo.
echo ===================================================================
echo               Resource generation complete!
echo ===================================================================
echo.
echo Resource files have been created in:
echo - Audio: backend\src\main\resources\static\audio\[topic]
echo - Images: backend\src\main\resources\static\images\[topic]
echo.
echo You may need to adjust file paths in your database to match
echo the generated structure.
echo.
echo NEXT STEPS:
echo 1. Run the SQL script to update database paths:
echo    backend\database\migrations\update_question_resource_paths.sql
echo 2. Check the resources in your web application
echo.
echo Press any key to exit...
pause > nul
