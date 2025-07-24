@echo off
echo Creating post_like table...

REM Run MySQL command to create post_like table
mysql -u root -p leenglish_toeic < "d:\Final Exam\TOEIC\database\create_post_like_table.sql"

if %ERRORLEVEL% EQU 0 (
    echo ✅ post_like table created successfully!
) else (
    echo ❌ Failed to create post_like table
)

pause
