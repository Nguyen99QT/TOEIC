@echo off
echo ========================================
echo    TOEIC API ENDPOINT TEST
echo ========================================
echo.

echo [1] Testing Backend Health...
curl -s http://localhost:8080/api/health 2>nul
if %errorlevel% == 0 (
    echo ✅ Backend is responding on port 8080
) else (
    echo ❌ Backend is not responding on port 8080
)
echo.

echo [2] Testing Login API Endpoint...
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"password\"}" ^
  http://localhost:8080/api/auth/login 2>nul
if %errorlevel% == 0 (
    echo ✅ Login API endpoint is accessible
) else (
    echo ❌ Login API endpoint is not accessible
)
echo.

echo [3] Testing Different Auth Endpoints...
echo Testing /api/auth/login...
curl -s -o nul -w "%%{http_code}" -X POST -H "Content-Type: application/json" -d "{}" http://localhost:8080/api/auth/login 2>nul
echo.

echo Testing /auth/login...
curl -s -o nul -w "%%{http_code}" -X POST -H "Content-Type: application/json" -d "{}" http://localhost:8080/auth/login 2>nul
echo.

echo Testing /api/login...
curl -s -o nul -w "%%{http_code}" -X POST -H "Content-Type: application/json" -d "{}" http://localhost:8080/api/login 2>nul
echo.

echo Testing /login...
curl -s -o nul -w "%%{http_code}" -X POST -H "Content-Type: application/json" -d "{}" http://localhost:8080/login 2>nul
echo.

echo ========================================
echo Test completed! Check the results above.
echo ✅ = Working, ❌ = Not working
echo HTTP 200 = Success, 404 = Not Found
echo ========================================
pause
