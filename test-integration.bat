@echo off
echo ======================================================
echo TOEIC Platform Integration Test
echo ======================================================
echo.

echo Starting backend server...
start cmd /k "cd backend && mvn spring-boot:run"

echo.
echo Waiting for backend to start...
timeout /t 20 /nobreak

echo.
echo Testing backend health check...
curl -s http://localhost:8080/api/health
echo.

echo.
echo ======================================================
echo Backend is running. Please run the mobile app now:
echo ======================================================
echo.
echo Run one of the following commands in a new terminal:
echo 1. cd mobile && flutter run        (for debug mode)
echo 2. cd mobile && flutter run --release  (for release mode)
echo.
echo Press any key to stop the backend server when testing is complete.
pause > nul

echo.
echo Shutting down servers...
taskkill /f /im java.exe > nul 2>&1
echo.
echo ======================================================
echo Testing complete!
echo ======================================================
