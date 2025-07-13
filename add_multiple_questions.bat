@echo off
REM This batch file provides instructions for adding multiple questions to exercises

echo ======================================================================
echo              Multiple Questions Per Exercise Solution
echo ======================================================================
echo.
echo This solution fixes the issue where some exercises have only one question,
echo which causes problems with progress/point calculation.
echo.
echo The SQL file has already been generated at:
echo   backend/database/migrations/add_multiple_questions_to_exercises.sql
echo.
echo To apply these changes to your database:
echo.
echo Option 1: Using MySQL Command Line
echo   1. Ensure MySQL is in your PATH
echo   2. Run the following command (replace with your credentials):
echo      mysql -u YOUR_USERNAME -p YOUR_PASSWORD YOUR_DATABASE < backend/database/migrations/add_multiple_questions_to_exercises.sql
echo.
echo Option 2: Using MySQL Workbench or phpMyAdmin
echo   1. Open MySQL Workbench or phpMyAdmin
echo   2. Connect to your database
echo   3. Open the SQL file: backend/database/migrations/add_multiple_questions_to_exercises.sql
echo   4. Execute the SQL script
echo.
echo After applying the changes, all exercises will have at least 6 questions each.
echo This ensures consistent progress calculation and improves user experience.
echo.
echo For more information, see MULTIPLE_QUESTIONS_README.md
echo ======================================================================
echo.

pause
