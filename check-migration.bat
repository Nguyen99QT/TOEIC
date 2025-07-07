@echo off
echo ======================================================
echo Kiểm Tra Cấu Trúc Backend Sau Khi Gộp
echo ======================================================
echo.

echo Kiểm tra cấu trúc thư mục toeic...
dir /s /b "backend\src\main\java\com\leenglish\toeic" > toeic_structure.txt
echo Đã lưu cấu trúc vào toeic_structure.txt

echo.
echo Kiểm tra cấu trúc thư mục api...
dir /s /b "backend\src\main\java\com\leenglish\api" > api_structure.txt
echo Đã lưu cấu trúc vào api_structure.txt

echo.
echo Kiểm tra các file trùng lặp...
findstr /G:api_structure.txt toeic_structure.txt > duplicate_files.txt
echo Đã lưu danh sách file trùng lặp vào duplicate_files.txt

echo.
echo Kiểm tra các file đã di chuyển...
echo Checking if all security classes were migrated to toeic...
if exist "backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java" (
    echo [PASSED] JwtRequestFilter.java đã được di chuyển thành công.
) else (
    echo [FAILED] JwtRequestFilter.java chưa được di chuyển.
)

if exist "backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java" (
    echo [PASSED] WebSecurityConfig.java đã được di chuyển thành công.
) else (
    echo [FAILED] WebSecurityConfig.java chưa được di chuyển.
)

if exist "backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java" (
    echo [PASSED] CorsConfig.java đã được di chuyển thành công.
) else (
    echo [FAILED] CorsConfig.java chưa được di chuyển.
)

echo.
echo Kiểm tra imports trong các file đã di chuyển...
powershell -Command "$files = Get-ChildItem -Path 'backend\src\main\java\com\leenglish\toeic' -Recurse -Filter *.java; foreach ($file in $files) { $content = Get-Content $file.FullName; if ($content -match 'import com.leenglish.api') { Write-Output \"[WARNING] $($file.Name) vẫn còn chứa imports từ package com.leenglish.api.\" } }" > import_warnings.txt
echo Đã lưu danh sách cảnh báo import vào import_warnings.txt

echo.
echo Kiểm tra lỗi biên dịch...
cd backend
call mvn clean compile > compile_results.txt
cd ..

echo.
echo ======================================================
echo Đã hoàn thành kiểm tra! Các file kết quả:
echo ======================================================
echo - toeic_structure.txt: Cấu trúc thư mục toeic
echo - api_structure.txt: Cấu trúc thư mục api
echo - duplicate_files.txt: Danh sách file trùng lặp
echo - import_warnings.txt: Cảnh báo về imports chưa được cập nhật
echo - backend\compile_results.txt: Kết quả biên dịch
echo.
echo Các bước tiếp theo:
echo 1. Kiểm tra toeic_structure.txt để xác nhận cấu trúc thư mục mới
echo 2. Kiểm tra duplicate_files.txt để tìm file trùng lặp còn sót
echo 3. Kiểm tra import_warnings.txt để tìm imports chưa được cập nhật
echo 4. Kiểm tra compile_results.txt để xem lỗi biên dịch
echo 5. Chạy backend-refactor.bat để sửa các vấn đề còn lại
echo.
