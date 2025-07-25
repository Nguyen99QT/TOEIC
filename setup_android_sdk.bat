@echo off
echo Setting up Android SDK for Flutter development...

REM Set ANDROID_HOME environment variable
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk

REM Add Android tools to PATH
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\cmdline-tools\latest\bin"

echo Android SDK path configured.
echo Please restart your terminal/VS Code and run 'flutter doctor' to verify.

REM Try to accept licenses
echo Attempting to accept Android licenses...
flutter doctor --android-licenses

pause
