@echo off
echo ======================================
echo  Restarting TOEIC Application Services
echo ======================================
echo.

echo 1. Stopping any running services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im java.exe >nul 2>&1

timeout /t 2 >nul

echo 2. Starting backend server...
start cmd /c "cd backend && mvn spring-boot:run"

echo 3. Waiting for backend to initialize (15 seconds)...
timeout /t 15 >nul

echo 4. Starting frontend development server...
start cmd /c "cd frontend && npm run dev"

echo.
echo ======================================
echo  Services restarted successfully!
echo ======================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8080
echo.
echo Press any key to exit...
pause >nul
