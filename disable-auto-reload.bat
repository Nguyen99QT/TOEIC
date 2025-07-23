@echo off
echo ======================================
echo DISABLE AUTO-RELOAD SCRIPT
echo ======================================
echo.

echo 1. Stopping any running Spring Boot applications...
taskkill /F /IM java.exe /FI "WINDOWTITLE eq *spring-boot*" 2>nul
echo.

echo 2. Clearing Maven cache that might cause auto-reload...
if exist "%USERPROFILE%\.m2\repository\org\springframework\boot\spring-boot-devtools" (
    rmdir /S /Q "%USERPROFILE%\.m2\repository\org\springframework\boot\spring-boot-devtools"
    echo ✅ DevTools cache cleared
) else (
    echo ℹ️ No DevTools cache found
)
echo.

echo 3. Setting environment variables to disable auto-reload...
setx SPRING_DEVTOOLS_RESTART_ENABLED false /M 2>nul
setx SPRING_DEVTOOLS_LIVERELOAD_ENABLED false /M 2>nul
echo ✅ Environment variables set
echo.

echo 4. Checking current backend process...
echo Looking for Spring Boot backend...
netstat -ano | findstr ":8080" > temp_port.txt
if exist temp_port.txt (
    for /f "tokens=5" %%a in (temp_port.txt) do (
        if not "%%a"=="0" (
            echo Found process on port 8080: %%a
            echo You may need to manually restart backend after changes
        )
    )
    del temp_port.txt
) else (
    echo ℹ️ No process found on port 8080
)
echo.

echo ======================================
echo AUTO-RELOAD DISABLED SUCCESSFULLY!
echo ======================================
echo.
echo ⚠️  IMPORTANT NOTES:
echo - Backend will NOT auto-restart on file changes
echo - You must manually stop/start backend for changes
echo - Use Ctrl+C in backend terminal, then restart task
echo - DevTools has been disabled in pom.xml and properties
echo.
echo ✅ Configuration files updated:
echo - backend/pom.xml (DevTools commented out)
echo - backend/src/main/resources/application.properties (DevTools disabled)
echo - .vscode/settings.json (Auto-build disabled)
echo - .vscode/tasks.json (Hot reload task disabled)
echo.
pause
