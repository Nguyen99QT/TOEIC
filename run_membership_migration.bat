@echo off
echo ================================================================
echo RUNNING MEMBERSHIP TYPE MIGRATION
echo ================================================================

echo.
echo This script will update the membership_type enum from (BASIC,PREMIUM,VIP) to (FREE,PREMIUM)
echo.

set /p confirm="Are you sure you want to proceed? (y/n): "
if /i "%confirm%" NEQ "y" (
    echo Migration cancelled.
    pause
    exit /b
)

echo.
echo Running migration...

:: Run the migration SQL script
mysql -u root -p -e "source d:\Final Exam\TOEIC\database\migrations\update_membership_type_enum.sql"

if %ERRORLEVEL% == 0 (
    echo.
    echo ================================================================
    echo ✅ MIGRATION COMPLETED SUCCESSFULLY!
    echo ================================================================
    echo.
    echo Changes made:
    echo - Updated membership_type enum to only FREE and PREMIUM
    echo - Converted NULL values to FREE
    echo - Converted BASIC values to FREE
    echo - Kept PREMIUM values as PREMIUM
    echo - Converted VIP values to PREMIUM
    echo.
) else (
    echo.
    echo ================================================================
    echo ❌ MIGRATION FAILED!
    echo ================================================================
    echo Please check the error messages above and try again.
    echo.
)

pause
