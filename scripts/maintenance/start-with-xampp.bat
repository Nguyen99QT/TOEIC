@echo off
REM ==========================================
REM TOEIC Platform Startup với XAMPP MySQL
REM ==========================================

echo 🚀 TOEIC Platform - XAMPP MySQL Setup
echo ==========================================

echo.
echo 1️⃣ Kiểm tra XAMPP MySQL...

REM Kiểm tra xem XAMPP MySQL có đang chạy không
netstat -an | findstr :3306 >nul
if %errorlevel% equ 0 (
    echo ✅ MySQL đang chạy trên port 3306
    
    REM Kiểm tra có phải XAMPP không
    tasklist | findstr /i mysqld >nul
    if %errorlevel% equ 0 (
        echo ✅ Phát hiện MySQL process (có thể từ XAMPP)
    )
) else (
    echo ❌ MySQL không chạy trên port 3306
    echo 💡 Vui lòng:
    echo    1. Mở XAMPP Control Panel
    echo    2. Click "Start" cho MySQL
    echo    3. Chờ đến khi trạng thái chuyển thành xanh
    echo.
    echo 🔄 Nhấn phím bất kỳ sau khi khởi động MySQL...
    pause >nul
)

echo.
echo 2️⃣ Kiểm tra xung đột Windows MySQL Service...
sc query mysql80 2>nul | findstr "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ⚠️ Phát hiện Windows MySQL Service đang chạy!
    echo 💡 Để tránh xung đột, sẽ tắt Windows MySQL Service...
    net stop mysql80 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Đã tắt Windows MySQL Service
    ) else (
        echo ⚠️ Không thể tắt Windows MySQL Service (có thể cần quyền Admin)
    )
) else (
    echo ✅ Không có xung đột Windows MySQL Service
)

echo.
echo 3️⃣ Test kết nối MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MySQL client không có trong PATH
    echo 💡 Sử dụng MySQL client từ XAMPP...
    set "MYSQL_PATH=C:\xampp\mysql\bin"
    set "PATH=%MYSQL_PATH%;%PATH%"
)

REM Test connection
mysql -u root -h localhost -P 3306 -e "SELECT 'XAMPP MySQL Connection OK' AS status;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Kết nối XAMPP MySQL thành công
) else (
    echo ❌ Không thể kết nối XAMPP MySQL
    echo 💡 Kiểm tra lại:
    echo    - XAMPP MySQL đã khởi động chưa?
    echo    - Username/password có đúng không?
    echo.
    echo 🔄 Nhấn phím bất kỳ để tiếp tục (sẽ thử khởi động Spring Boot)...
    pause >nul
)

echo.
echo 4️⃣ Tạo database nếu chưa có...
mysql -u root -h localhost -P 3306 -e "CREATE DATABASE IF NOT EXISTS toeic8 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database 'toeic8' đã sẵn sàng
) else (
    echo ⚠️ Không thể tạo database (sẽ để Spring Boot tự tạo)
)

echo.
echo 5️⃣ Kiểm tra port Spring Boot (8080)...
netstat -an | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ⚠️ Port 8080 đang được sử dụng
    echo 💡 Có thể có Spring Boot instance khác đang chạy
    
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo 🔍 Process ID sử dụng port 8080: %%a
        tasklist /fi "pid eq %%a" 2>nul
    )
    
    echo.
    echo 🤔 Bạn muốn tiếp tục? (Y/N)
    set /p choice=
    if /i "%choice%" neq "Y" goto :end
) else (
    echo ✅ Port 8080 trống, sẵn sàng cho Spring Boot
)

echo.
echo 6️⃣ Khởi động Spring Boot...
echo 🔧 Đang chuyển đến thư mục backend...
cd /d "%~dp0backend"

if not exist "pom.xml" (
    echo ❌ Không tìm thấy pom.xml
    echo 💡 Vui lòng chạy script này từ thư mục gốc của project
    pause
    exit /b 1
)

echo.
echo 🚀 Đang khởi động Spring Boot với XAMPP MySQL...
echo 📝 Cấu hình:
echo    - MySQL Host: localhost:3306
echo    - Database: toeic8
echo    - Username: root
echo    - Password: (empty)
echo    - Spring Boot Port: 8080
echo.
echo ⏱️ Quá trình này có thể mất 30-60 giây...
echo.

mvn spring-boot:run

:end
echo.
echo ==========================================
echo 🏁 Script hoàn thành
echo ==========================================
pause
