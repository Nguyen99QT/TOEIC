@echo off
REM Script để chạy TOEIC Mobile App trên Windows

echo 🚀 Starting TOEIC Mobile App...

REM Check if Flutter is installed
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Flutter is not installed. Please install Flutter first.
    echo Visit: https://flutter.dev/docs/get-started/install
    pause
    exit /b 1
)

REM Navigate to mobile directory
cd /d "%~dp0"

echo 📦 Installing dependencies...
flutter pub get

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔍 Checking for devices...
flutter devices

echo ▶️ Running the app...
flutter run

echo ✅ App started successfully!
pause
