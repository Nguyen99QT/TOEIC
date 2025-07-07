@echo off
echo 🩺 Quick Health Check for TOEIC Platform
echo ==========================================

echo.
echo 1. Checking MySQL Service...
sc query mysql80 | findstr "STATE" 2>nul
if %errorlevel% equ 0 (
    echo ✅ MySQL service found
) else (
    echo ❌ MySQL service not found
)

echo.
echo 2. Testing MySQL Connection...
mysql -u root --password= -h localhost -P 3306 -e "SELECT 'OK' AS status;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ MySQL connection OK
) else (
    echo ❌ MySQL connection failed
)

echo.
echo 3. Testing Spring Boot Health Endpoint...
curl -s http://localhost:8080/api/health 2>nul | findstr "status" >nul
if %errorlevel% equ 0 (
    echo ✅ Spring Boot health endpoint responding
) else (
    echo ❌ Spring Boot not responding or not started
)

echo.
echo 4. Testing Frontend Development Server...
curl -s http://localhost:3000 2>nul >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend server responding
) else (
    echo ❌ Frontend server not responding
)

echo.
echo ==========================================
echo Health check completed!
echo ==========================================
pause
