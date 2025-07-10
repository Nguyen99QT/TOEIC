@echo off
REM ==========================================
REM TOEIC Platform Auto-Start Script
REM ==========================================

echo 🚀 TOEIC Platform Startup Assistant
echo ==========================================

echo.
echo 1️⃣ Checking MySQL Status...
REM Check if MySQL service is running
sc query mysql80 >nul 2>&1
if %errorlevel% equ 0 (
    sc query mysql80 | findstr "STATE" | findstr "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo ✅ MySQL service is already running
    ) else (
        echo 🔄 MySQL service exists but not running. Starting...
        net start mysql80
        if %errorlevel% equ 0 (
            echo ✅ MySQL service started successfully
        ) else (
            echo ❌ Failed to start MySQL service
            goto :mysql_manual
        )
    )
) else (
    echo ⚠️ MySQL80 service not found. Checking for other MySQL services...
    sc query mysql >nul 2>&1
    if %errorlevel% equ 0 (
        echo 🔄 Starting MySQL service...
        net start mysql
    ) else (
        echo ❌ No MySQL service found
        goto :mysql_manual
    )
)

echo.
echo 2️⃣ Testing MySQL Connection...
REM Test MySQL connection
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MySQL client not found in PATH
    echo 💡 If using XAMPP, please start MySQL from XAMPP Control Panel
    goto :mysql_manual
)

REM Test connection to MySQL server
mysql -u root --password= -h localhost -P 3306 -e "SELECT 'Connection Test' AS status;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL connection successful
) else (
    echo ❌ MySQL connection failed
    echo 💡 Please check:
    echo    - MySQL server is running
    echo    - Port 3306 is not blocked
    echo    - Username/password is correct
    goto :mysql_manual
)

echo.
echo 3️⃣ Creating Database if needed...
mysql -u root --password= -h localhost -P 3306 -e "CREATE DATABASE IF NOT EXISTS toeic8 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database 'toeic8' ready
) else (
    echo ⚠️ Could not create database, but continuing...
)

echo.
echo 4️⃣ Starting Spring Boot Backend...
echo 🔧 Navigating to backend directory...
cd /d "%~dp0backend"
if not exist "pom.xml" (
    echo ❌ pom.xml not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo 🚀 Starting Spring Boot application...
echo 📝 Note: Application will start even if MySQL connection fails
echo ⏱️ This may take 30-60 seconds...
echo.

mvn spring-boot:run
goto :end

:mysql_manual
echo.
echo ==========================================
echo 🔧 Manual MySQL Setup Required
echo ==========================================
echo Please ensure MySQL is running before starting the application:
echo.
echo Option 1 - XAMPP Users:
echo   • Open XAMPP Control Panel
echo   • Click "Start" next to MySQL
echo.
echo Option 2 - Standalone MySQL:
echo   • Run: net start mysql80
echo   • Or start MySQL service from Services.msc
echo.
echo Option 3 - Continue without MySQL:
echo   • Press any key to start Spring Boot anyway
echo   • Health check and some features will not work
echo.
echo Press any key to continue or Ctrl+C to exit...
pause >nul

echo.
echo 🚀 Starting Spring Boot (MySQL may not be available)...
cd /d "%~dp0backend"
mvn spring-boot:run

:end
echo.
echo ==========================================
echo 🏁 Startup script completed
echo ==========================================
pause
