@echo off
echo Running SQL update script to synchronize questions with exercises...
echo This will:
echo 1. Add audio_url and image_url columns to questions table
echo 2. Update questions to be relevant to their exercises
echo 3. Add audio_url and image_url values for all questions

set MYSQL_USER=root
set MYSQL_PASSWORD=
set DATABASE_NAME=leenglish

mysql -u %MYSQL_USER% -p%MYSQL_PASSWORD% %DATABASE_NAME% < backend\database\migrations\update_questions.sql

echo Done!
pause
