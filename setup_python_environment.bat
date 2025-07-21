@echo off
REM Script to set up Python environment for TOEIC Resource Generation
REM Created on July 13, 2025

echo ===================================================================
echo         TOEIC Python Environment Setup
echo ===================================================================
echo.
echo This script will:
echo 1. Check your Python installation
echo 2. Set up pip (Python package manager)
echo 3. Install required packages for resource generation
echo.
echo Requirements:
echo - Python 3.6+ must be installed
echo - Internet connection
echo.

REM Set Python command to use Python launcher (py)
set PYTHON_CMD=py

REM Verify Python version
echo.
echo Checking Python version...
%PYTHON_CMD% --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to execute Python. Please reinstall and add to PATH.
    pause
    exit /b 1
)

REM Check and upgrade pip
echo.
echo Setting up pip (Python package manager)...
%PYTHON_CMD% -m ensurepip --upgrade
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Could not set up pip with ensurepip. Trying alternative method...
    %PYTHON_CMD% -c "import sys; import subprocess; subprocess.check_call([sys.executable, '-m', 'pip', '--version'])"
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to set up pip.
        echo.
        echo Please try manually:
        echo 1. Open Command Prompt as Administrator
        echo 2. Run: %PYTHON_CMD% -m ensurepip --upgrade
        echo 3. Run this script again
        pause
        exit /b 1
    )
)

REM Upgrade pip to latest version
echo.
echo Upgrading pip to latest version...
%PYTHON_CMD% -m pip install --upgrade pip
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to upgrade pip. Continuing with current version...
)

REM Create requirements.txt if it doesn't exist
if not exist requirements.txt (
    echo Creating requirements.txt file...
    echo requests>=2.25.1 > requirements.txt
    echo gtts>=2.2.3 >> requirements.txt
)

REM Install required packages
echo.
echo Installing required Python packages...
echo This may take a few minutes...
%PYTHON_CMD% -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install packages.
    echo.
    echo Please try manually:
    echo %PYTHON_CMD% -m pip install requests gtts
    echo.
    echo After installing packages, run generate_question_resources.bat
    pause
    exit /b 1
)

echo.
echo ===================================================================
echo            Python environment setup complete!
echo ===================================================================
echo.
echo All required packages have been installed successfully.
echo.
echo NEXT STEPS:
echo 1. Run generate_question_resources.bat to create images and audio
echo.
echo Press any key to continue...
pause > nul
