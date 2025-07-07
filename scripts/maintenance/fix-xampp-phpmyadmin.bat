@echo off
REM ==========================================
REM XAMPP phpMyAdmin Fix Script
REM ==========================================

echo 🔧 XAMPP phpMyAdmin Troubleshooting Tool
echo ==========================================

echo.
echo 1️⃣ Checking XAMPP Services Status...

REM Check Apache status
echo 🌐 Apache Status:
sc query apache2.4 >nul 2>&1
if %errorlevel% equ 0 (
    sc query apache2.4 | findstr "STATE"
) else (
    echo ❌ Apache service not found
)

REM Check MySQL status
echo 🗄️ MySQL Status:
sc query mysql >nul 2>&1
if %errorlevel% equ 0 (
    sc query mysql | findstr "STATE"
) else (
    echo ❌ MySQL service not found
)

echo.
echo 2️⃣ Testing Port Availability...

REM Check if port 80 is available
echo 🔌 Port 80 (Apache):
netstat -ano | findstr :80 | findstr LISTENING
if %errorlevel% equ 0 (
    echo ✅ Port 80 is being used
) else (
    echo ❌ Port 80 is not in use
)

REM Check if port 3306 is available
echo 🔌 Port 3306 (MySQL):
netstat -ano | findstr :3306 | findstr LISTENING
if %errorlevel% equ 0 (
    echo ✅ Port 3306 is being used
) else (
    echo ❌ Port 3306 is not in use
)

echo.
echo 3️⃣ Common phpMyAdmin Issues & Solutions...
echo.

echo 💡 SOLUTION 1: Restart Apache & MySQL
echo    - Stop both services first
echo    - Wait 5 seconds
echo    - Start MySQL first, then Apache

echo.
echo 💡 SOLUTION 2: Clear Browser Cache
echo    - Press Ctrl+F5 to force refresh
echo    - Or try incognito/private mode

echo.
echo 💡 SOLUTION 3: Check XAMPP Directory Permissions
echo    - Ensure XAMPP is in C:\xampp
echo    - Run XAMPP as Administrator

echo.
echo 💡 SOLUTION 4: Alternative Access Methods
echo    - Try: http://localhost:80/phpmyadmin/
echo    - Try: http://127.0.0.1/phpmyadmin/
echo    - Try: http://localhost/phpmyadmin/index.php

echo.
echo 💡 SOLUTION 5: Database Direct Connection Test
echo    - We'll test MySQL connection directly

echo.
echo 4️⃣ Attempting Automatic Fixes...
echo.

echo 🔄 Restarting XAMPP Services...
echo Stopping Apache...
net stop apache2.4 >nul 2>&1
echo Stopping MySQL...
net stop mysql >nul 2>&1

echo ⏳ Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Starting MySQL...
net start mysql
if %errorlevel% equ 0 (
    echo ✅ MySQL started successfully
) else (
    echo ❌ Failed to start MySQL
)

echo Starting Apache...
net start apache2.4
if %errorlevel% equ 0 (
    echo ✅ Apache started successfully
) else (
    echo ❌ Failed to start Apache
)

echo.
echo 5️⃣ Testing phpMyAdmin Access...
echo 🌐 Attempting to access phpMyAdmin...
echo Please wait...

REM Try to access phpMyAdmin
timeout /t 3 /nobreak >nul
curl -s -o nul -w "%%{http_code}" --connect-timeout 10 "http://localhost/phpmyadmin/" >temp_response.txt 2>nul
set /p response_code=<temp_response.txt
del temp_response.txt >nul 2>&1

if "%response_code%"=="200" (
    echo ✅ phpMyAdmin is accessible! HTTP Code: %response_code%
) else (
    echo ❌ phpMyAdmin still not accessible. HTTP Code: %response_code%
)

echo.
echo 6️⃣ Alternative Database Access...
echo.
echo 🔧 Creating Database Connection Test...

REM Test MySQL connection directly
echo Testing MySQL connection...
mysql -u root --password= -h localhost -P 3306 -e "SHOW DATABASES;" >mysql_test.log 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL direct connection successful
    echo 📊 Available databases:
    type mysql_test.log
    del mysql_test.log >nul 2>&1
) else (
    echo ❌ MySQL direct connection failed
    echo 📝 Error details:
    type mysql_test.log
    del mysql_test.log >nul 2>&1
)

echo.
echo ==========================================
echo 🎯 RECOMMENDATIONS:
echo ==========================================
echo.
echo If phpMyAdmin is still not working:
echo.
echo 1. 🌐 Try accessing via browser:
echo    http://localhost/phpmyadmin/
echo    http://127.0.0.1/phpmyadmin/
echo.
echo 2. 🔧 Check XAMPP Control Panel:
echo    - Ensure both Apache and MySQL are green/running
echo    - Click "Admin" next to MySQL to open phpMyAdmin
echo.
echo 3. 🗂️ Alternative Database Tools:
echo    - Use MySQL Workbench
echo    - Use HeidiSQL
echo    - Use command line: mysql -u root -p
echo.
echo 4. 🐛 If still having issues:
echo    - Check Windows Firewall
echo    - Check antivirus software
echo    - Try running XAMPP as Administrator
echo.
echo 5. 🔄 Quick restart command:
echo    Run this script again or restart your computer
echo.

echo ==========================================
echo Press any key to continue...
pause >nul
