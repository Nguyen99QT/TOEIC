@echo off
echo Starting Android Emulator in read-only mode...

REM Navigate to Android SDK emulator directory
cd /d "%LOCALAPPDATA%\Android\Sdk\emulator"

REM Start emulator with read-only flag
emulator.exe -avd Pixel_6 -read-only

pause
