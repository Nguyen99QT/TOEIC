@echo off
echo ======================================================
echo Xoa Folder api sau khi gop thanh cong
echo ======================================================
echo.

echo Kiem tra bien dich...
cd backend
call mvn clean compile > compile_check.txt

findstr "BUILD SUCCESS" compile_check.txt > nul
if %errorlevel% neq 0 (
    echo [CANH BAO] Bien dich chua thanh cong! Khong an toan de xoa folder api.
    echo Kiem tra file compile_check.txt de biet them chi tiet.
    exit /b 1
)

echo [OK] Bien dich thanh cong, an toan de xoa folder api.
echo.

echo Dang xoa folder api...
if exist "src\main\java\com\leenglish\api" (
    rmdir /s /q "src\main\java\com\leenglish\api"
    echo [OK] Da xoa folder api.
) else (
    echo [THONG BAO] Folder api khong ton tai hoac da duoc xoa.
)

echo.
echo ======================================================
echo Da hoan thanh viec xoa folder api!
echo ======================================================
echo.
echo Cac buoc tiep theo:
echo 1. Chay 'mvn spring-boot:run' de kiem tra ung dung hoat dong tot
echo 2. Kiem tra logs de dam bao khong co loi
echo.

cd ..
