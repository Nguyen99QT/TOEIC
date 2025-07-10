@echo off
:: GitHub Issues Creator for LeEnglish TOEIC Project
:: Quick setup script for Windows

echo ========================================
echo   LeEnglish GitHub Issues Creator
echo ========================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

:: Check for GitHub token
if "%GITHUB_TOKEN%"=="" (
    echo WARNING: GITHUB_TOKEN environment variable not set
    echo.
    echo To set up GitHub token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Create new token with 'repo' permissions
    echo 3. Run: set GITHUB_TOKEN=your_token_here
    echo 4. Or edit the script to add your repo info
    echo.
)

:: Show current configuration
echo Current Configuration:
echo - GITHUB_TOKEN: %GITHUB_TOKEN:~0,10%...
echo - Repo will be detected from script
echo.

:: Install required packages
echo Installing required packages...
pip install requests

if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Running GitHub Issues Creator
echo ========================================
echo.

:: Run the Python script
python run_github_issues.py

echo.
echo ========================================
echo   Script completed
echo ========================================
echo.

:: Ask if user wants to see the issues
set /p open_browser="Open GitHub issues page in browser? (y/n): "
if /i "%open_browser%"=="y" (
    echo Opening GitHub issues...
    start https://github.com/HUYDUU19/leenglish-toeic-platform/issues
)

pause
