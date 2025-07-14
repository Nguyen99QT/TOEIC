@echo off
REM Script to manually install Python packages for TOEIC Resource Generation
REM This script is a fallback for when pip fails

echo ===================================================================
echo         TOEIC Manual Package Installation
echo ===================================================================
echo.
echo This script will:
echo 1. Attempt to install required packages using Python directly
echo 2. Verify installations
echo.

REM Set Python command to use Python launcher (py)
set PYTHON_CMD=py

REM Create temporary installation script
echo.
echo Creating temporary installation script...
echo import sys > temp_install.py
echo import ensurepip >> temp_install.py
echo ensurepip._bootstrap() >> temp_install.py
echo import importlib.util >> temp_install.py
echo try: >> temp_install.py
echo     import pip >> temp_install.py
echo except ImportError: >> temp_install.py
echo     print("Could not import pip module") >> temp_install.py
echo     sys.exit(1) >> temp_install.py
echo print("Attempting to install requests...") >> temp_install.py
echo try: >> temp_install.py
echo     pip._internal.main(['install', 'requests']) >> temp_install.py
echo     print("Successfully installed requests") >> temp_install.py
echo except Exception as e: >> temp_install.py
echo     print(f"Error installing requests: {e}") >> temp_install.py
echo print("Attempting to install gtts...") >> temp_install.py
echo try: >> temp_install.py
echo     pip._internal.main(['install', 'gtts']) >> temp_install.py
echo     print("Successfully installed gtts") >> temp_install.py
echo except Exception as e: >> temp_install.py
echo     print(f"Error installing gtts: {e}") >> temp_install.py
echo print("Verifying installations...") >> temp_install.py
echo try: >> temp_install.py
echo     import requests >> temp_install.py
echo     print("requests module is available") >> temp_install.py
echo except ImportError: >> temp_install.py
echo     print("requests module is NOT available") >> temp_install.py
echo try: >> temp_install.py
echo     from gtts import gTTS >> temp_install.py
echo     print("gtts module is available") >> temp_install.py
echo except ImportError: >> temp_install.py
echo     print("gtts module is NOT available") >> temp_install.py

REM Run the temporary installation script
echo.
echo Running installation script...
%PYTHON_CMD% temp_install.py
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install packages.
    echo.
    echo Please try a different approach:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: %PYTHON_CMD% -m pip install requests gtts
    echo.
    del temp_install.py
    pause
    exit /b 1
)

REM Clean up
del temp_install.py

echo.
echo ===================================================================
echo            Manual package installation complete!
echo ===================================================================
echo.
echo Now you can run generate_question_resources.bat to create images and audio
echo.
echo Press any key to continue...
pause > nul
