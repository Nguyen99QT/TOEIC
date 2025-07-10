@echo off
REM ==========================================
REM XAMPP phpMyAdmin Quick Fix Guide
REM ==========================================

echo 🔧 XAMPP phpMyAdmin Quick Fix
echo ==========================================

echo.
echo 📊 Current Status Check:
echo ==========================================

echo 🌐 Apache Port 80 Status:
netstat -ano | findstr :80 | findstr LISTENING
if %errorlevel% equ 0 (
    echo ✅ Apache is running on port 80
) else (
    echo ❌ Apache is not running on port 80
)

echo.
echo 🗄️ MySQL Port 3306 Status:
netstat -ano | findstr :3306 | findstr LISTENING
if %errorlevel% equ 0 (
    echo ✅ MySQL is running on port 3306
) else (
    echo ❌ MySQL is not running on port 3306
)

echo.
echo 🌐 Testing Web Server Response:
curl -s -I -m 5 "http://localhost/" 2>nul | findstr "HTTP"
if %errorlevel% equ 0 (
    echo ✅ Web server is responding
) else (
    echo ❌ Web server is not responding properly
)

echo.
echo ==========================================
echo 💡 XAMPP phpMyAdmin Solutions
echo ==========================================

echo.
echo 🎯 IMMEDIATE SOLUTIONS:
echo.
echo 1️⃣ Open XAMPP Control Panel (Run as Administrator)
echo    • Look for "Apache" and "MySQL" status
echo    • Both should show "Running" (green)
echo    • If not running, click "Start" for each

echo.
echo 2️⃣ Force Refresh Browser
echo    • Press Ctrl + F5 several times
echo    • Or try Incognito/Private mode
echo    • Clear browser cache completely

echo.
echo 3️⃣ Try Different URLs:
echo    • http://localhost/phpmyadmin/
echo    • http://127.0.0.1/phpmyadmin/
echo    • http://localhost:80/phpmyadmin/

echo.
echo 4️⃣ Check XAMPP Directory:
echo    • Default: C:\xampp\
echo    • Ensure you have permissions
echo    • Try running XAMPP as Administrator

echo.
echo ==========================================
echo 🔧 ADVANCED TROUBLESHOOTING
echo ==========================================

echo.
echo 🔍 Checking for common XAMPP issues...

REM Check if XAMPP is in default location
if exist "C:\xampp\apache\bin\httpd.exe" (
    echo ✅ XAMPP Apache found in C:\xampp\
) else (
    echo ❌ XAMPP Apache not found in C:\xampp\
    echo    Please check your XAMPP installation path
)

if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo ✅ XAMPP MySQL found in C:\xampp\
) else (
    echo ❌ XAMPP MySQL not found in C:\xampp\
    echo    Please check your XAMPP installation path
)

echo.
echo 🔧 Port Conflict Check:
echo Port 80 processes:
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | findstr "httpd.exe"
if %errorlevel% equ 0 (
    echo ✅ Apache httpd.exe is running
) else (
    echo ❌ Apache httpd.exe not found
)

echo.
echo Port 3306 processes:
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | findstr "mysqld.exe"
if %errorlevel% equ 0 (
    echo ✅ MySQL mysqld.exe is running
) else (
    echo ❌ MySQL mysqld.exe not found
)

echo.
echo ==========================================
echo 🚀 AUTO-LAUNCH SOLUTIONS
echo ==========================================

echo.
echo Would you like to try opening phpMyAdmin automatically?
echo.
echo Press 1 to open http://localhost/phpmyadmin/
echo Press 2 to open http://127.0.0.1/phpmyadmin/
echo Press 3 to open XAMPP Control Panel
echo Press 4 to create database directly via our backend
echo Press any other key to see manual instructions
echo.

choice /c 1234 /n /m "Select option: "

if errorlevel 4 goto :create_database
if errorlevel 3 goto :open_xampp
if errorlevel 2 goto :open_127
if errorlevel 1 goto :open_localhost

:manual_instructions
echo.
echo ==========================================
echo 📝 MANUAL STEPS TO FIX phpMyAdmin
echo ==========================================
echo.
echo STEP 1: Open XAMPP Control Panel
echo   • Find XAMPP in Start Menu or Desktop
echo   • RIGHT-CLICK and "Run as Administrator"
echo.
echo STEP 2: Start Services
echo   • Click "Start" next to Apache (should turn green)
echo   • Click "Start" next to MySQL (should turn green)
echo   • Wait for both to show "Running"
echo.
echo STEP 3: Test phpMyAdmin
echo   • Click "Admin" button next to MySQL
echo   • OR open browser and go to: http://localhost/phpmyadmin/
echo.
echo STEP 4: If still loading forever:
echo   • Close all browser windows
echo   • Restart XAMPP (Stop then Start both services)
echo   • Try again in 30 seconds
echo.
goto :end

:open_localhost
echo 🌐 Opening http://localhost/phpmyadmin/ in default browser...
start http://localhost/phpmyadmin/
goto :end

:open_127
echo 🌐 Opening http://127.0.0.1/phpmyadmin/ in default browser...
start http://127.0.0.1/phpmyadmin/
goto :end

:open_xampp
echo 🎮 Looking for XAMPP Control Panel...
if exist "C:\xampp\xampp-control.exe" (
    echo ✅ Found XAMPP Control Panel, opening...
    start "" "C:\xampp\xampp-control.exe"
) else (
    echo ❌ XAMPP Control Panel not found in C:\xampp\
    echo Please locate and run xampp-control.exe manually
)
goto :end

:create_database
echo 🗄️ Creating database using our Spring Boot backend...
echo This will test if MySQL is accessible and create the database...
echo.
cd /d "%~dp0backend"
if exist "pom.xml" (
    echo 🔧 Attempting to create database via Spring Boot...
    echo This may take a few moments...
    mvn compile exec:java -Dexec.mainClass="com.leenglish.toeic.util.DatabaseCreator" -q
    if %errorlevel% equ 0 (
        echo ✅ Database created successfully!
        echo You can now try accessing phpMyAdmin again
    ) else (
        echo ❌ Database creation failed
        echo MySQL may not be properly configured
    )
) else (
    echo ❌ Backend directory not found
    echo Please run this script from the project root directory
)
goto :end

:end
echo.
echo ==========================================
echo 🎯 SUMMARY & NEXT STEPS
echo ==========================================
echo.
echo If phpMyAdmin is still not working:
echo.
echo ✅ WORKING ALTERNATIVES:
echo   • Use our Spring Boot backend (it connects to MySQL)
echo   • Use MySQL Workbench or HeidiSQL
echo   • Use command line tools
echo.
echo 🔧 STILL NEED phpMyAdmin?
echo   • Restart your computer
echo   • Reinstall XAMPP
echo   • Check Windows Firewall settings
echo   • Check antivirus software
echo.
echo 📞 NEED HELP?
echo   • The Spring Boot backend should work with MySQL
echo   • We can continue development without phpMyAdmin
echo   • Database will be created automatically
echo.
echo Press any key to exit...
pause >nul
