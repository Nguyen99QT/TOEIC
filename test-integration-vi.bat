@echo off
echo ======================================================
echo Chạy Backend Và Flutter App Để Kiểm Tra
echo ======================================================
echo.

echo Bắt đầu chạy backend server...
start cmd /k "cd backend && mvn spring-boot:run"

echo.
echo Đang đợi backend khởi động...
timeout /t 20 /nobreak

echo.
echo Kiểm tra backend health check...
curl -s http://localhost:8080/api/health
echo.

echo.
echo ======================================================
echo Backend đang chạy. Vui lòng chạy ứng dụng mobile:
echo ======================================================
echo.
echo Chạy một trong các lệnh sau trong terminal mới:
echo 1. cd mobile && flutter run        (chế độ debug)
echo 2. cd mobile && flutter run --release  (chế độ release)
echo.
echo Nhấn phím bất kỳ để dừng backend khi kiểm tra xong.
pause > nul

echo.
echo Đang tắt server...
taskkill /f /im java.exe > nul 2>&1
echo.
echo ======================================================
echo Kiểm tra hoàn tất!
echo ======================================================
