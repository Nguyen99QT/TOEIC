@echo off
echo ======================================================
echo Xóa Các File Cũ Sau Khi Gộp Thành Công
echo ======================================================
echo.

setlocal enabledelayedexpansion

echo Đã tạo bản sao lưu?
if not exist "backend\backup\api" (
    echo [CẢNH BÁO] Bản sao lưu chưa được tạo. Vui lòng chạy backend-refactor.bat trước.
    echo Bạn có muốn tiếp tục xóa không? (Y/N)
    set /p confirm=
    if /i not "!confirm!"=="Y" (
        echo Đã hủy xóa.
        exit /b 1
    )
) else (
    echo [OK] Đã tìm thấy bản sao lưu.
)

echo.
echo Kiểm tra lỗi biên dịch...
cd backend
call mvn clean compile > cleanup_compile_results.txt
cd ..

findstr /i "error" backend\cleanup_compile_results.txt > nul
if %errorlevel% equ 0 (
    echo [CẢNH BÁO] Có lỗi biên dịch. Không an toàn để xóa các file cũ.
    echo Bạn có muốn tiếp tục xóa không? (Y/N)
    set /p confirm=
    if /i not "!confirm!"=="Y" (
        echo Đã hủy xóa.
        exit /b 1
    )
) else (
    echo [OK] Biên dịch thành công, an toàn để xóa các file cũ.
)

echo.
echo Bắt đầu xóa các file cũ...
echo.
echo Xóa com.leenglish.api.security...
if exist "backend\src\main\java\com\leenglish\api\security" (
    rd /s /q "backend\src\main\java\com\leenglish\api\security"
    echo [OK] Đã xóa thư mục security.
) else (
    echo [WARNING] Thư mục security không tồn tại.
)

echo Xóa com.leenglish.api.services...
if exist "backend\src\main\java\com\leenglish\api\services" (
    rd /s /q "backend\src\main\java\com\leenglish\api\services"
    echo [OK] Đã xóa thư mục services.
) else (
    echo [WARNING] Thư mục services không tồn tại.
)

echo Xóa com.leenglish.api.utils...
if exist "backend\src\main\java\com\leenglish\api\utils" (
    rd /s /q "backend\src\main\java\com\leenglish\api\utils"
    echo [OK] Đã xóa thư mục utils.
) else (
    echo [WARNING] Thư mục utils không tồn tại.
)

echo Xóa com.leenglish.api.controllers...
if exist "backend\src\main\java\com\leenglish\api\controllers" (
    rd /s /q "backend\src\main\java\com\leenglish\api\controllers"
    echo [OK] Đã xóa thư mục controllers.
) else (
    echo [WARNING] Thư mục controllers không tồn tại.
)

echo.
echo ======================================================
echo Đã hoàn thành xóa các file cũ!
echo ======================================================
echo.
echo Các bước tiếp theo:
echo 1. Chạy check-migration.bat để kiểm tra cấu trúc sau khi xóa
echo 2. Chạy mvn spring-boot:run để kiểm tra ứng dụng
echo.
