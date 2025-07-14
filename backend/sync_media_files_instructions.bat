@echo off
REM =======================================================================
REM Script to synchronize the database with the actual audio and image files
REM =======================================================================

echo ===== TOEIC Platform Media Files Synchronization =====
echo.
echo The following steps should be performed to synchronize media files:
echo.
echo 1. Make sure all audio files (ex1.mp3 through ex90.mp3) exist in:
echo    src/main/resources/static/audio/exercises/
echo.
echo 2. Make sure all image files (ex1.jpg through ex90.jpg) exist in:
echo    src/main/resources/static/images/exercises/
echo.
echo 3. Run the following SQL script in your MySQL database:
echo    database/migrations/update_all_questions_media_urls.sql
echo.
echo 4. This script will:
echo    - Create a backup of your questions table
echo    - Update all audio_url and image_url fields to use the pattern:
echo      - /files/audio/exercises/ex{N}.mp3
echo      - /files/images/exercises/ex{N}.jpg
echo      where N is calculated based on exercise_id and question_order
echo.
echo 5. Restart your Spring Boot application for changes to take effect
echo.
echo ===== Process Complete =====
echo.
echo If you need to manually execute the SQL script, open MySQL and run:
echo mysql -u root -p your_database_name < database/migrations/update_all_questions_media_urls.sql
echo.
echo For more help, please consult the README.md file.
echo.
