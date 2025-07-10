@echo off
echo ==========================================
echo 🔍 KIỂM TRA PORT MYSQL VÀ SPRING BOOT
echo ==========================================

echo.
echo 1️⃣ Kiểm tra Port MySQL (3306)...
netstat -an | findstr :3306
if %errorlevel% equ 0 (
    echo ✅ Port 3306 đang được sử dụng
    echo 📋 Chi tiết:
    netstat -ano | findstr :3306
) else (
    echo ❌ Port 3306 không có service nào đang chạy
)

echo.
echo 2️⃣ Kiểm tra Port Spring Boot (8080)...
netstat -an | findstr :8080
if %errorlevel% equ 0 (
    echo ✅ Port 8080 đang được sử dụng
    echo 📋 Chi tiết:
    netstat -ano | findstr :8080
) else (
    echo ❌ Port 8080 không có service nào đang chạy
)

echo.
echo 3️⃣ Kiểm tra XAMPP MySQL Process...
tasklist | findstr /i mysql
if %errorlevel% equ 0 (
    echo ✅ MySQL process từ XAMPP đang chạy
) else (
    echo ❌ Không thấy MySQL process
)

echo.
echo 4️⃣ Kiểm tra Windows MySQL Service...
sc query mysql80 2>nul | findstr "STATE"
if %errorlevel% equ 0 (
    echo ⚠️ Windows MySQL Service cũng có thể đang chạy
    sc query mysql80 | findstr "STATE"
) else (
    echo ✅ Windows MySQL Service không chạy (tốt)
)

echo.
echo 5️⃣ Kiểm tra Java Process (Spring Boot)...
tasklist | findstr /i java
if %errorlevel% equ 0 (
    echo ✅ Java process đang chạy (có thể là Spring Boot)
) else (
    echo ❌ Không thấy Java process
)

echo.
echo ==========================================
echo 💡 KHUYẾN NGHỊ:
echo ==========================================
echo - XAMPP MySQL nên chạy trên port 3306 (mặc định)
echo - Spring Boot nên chạy trên port 8080 (mặc định)
echo - Hai service này KHÔNG xung đột với nhau
echo - Nếu có xung đột port 3306, tắt Windows MySQL Service
echo ==========================================
pause
