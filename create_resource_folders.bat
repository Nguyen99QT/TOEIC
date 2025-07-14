@echo off
REM This script creates folder structure for audio and image resources for TOEIC questions
REM Created on July 10, 2025

echo ===================================================================
echo             TOEIC Learning Platform - Resource Generator           
echo ===================================================================
echo.
echo This script will create the folder structure for audio and image resources
echo for the TOEIC learning platform questions organized by topic.
echo.

set RESOURCE_BASE=frontend\public

REM Create main resource directories
mkdir "%RESOURCE_BASE%\audio\greetings" 2>nul
mkdir "%RESOURCE_BASE%\audio\numbers" 2>nul
mkdir "%RESOURCE_BASE%\audio\colors" 2>nul
mkdir "%RESOURCE_BASE%\audio\family" 2>nul
mkdir "%RESOURCE_BASE%\audio\food" 2>nul
mkdir "%RESOURCE_BASE%\audio\generic" 2>nul
mkdir "%RESOURCE_BASE%\audio\business" 2>nul
mkdir "%RESOURCE_BASE%\audio\travel" 2>nul
mkdir "%RESOURCE_BASE%\audio\office" 2>nul
mkdir "%RESOURCE_BASE%\audio\technology" 2>nul

mkdir "%RESOURCE_BASE%\images\greetings" 2>nul
mkdir "%RESOURCE_BASE%\images\numbers" 2>nul
mkdir "%RESOURCE_BASE%\images\colors" 2>nul
mkdir "%RESOURCE_BASE%\images\family" 2>nul
mkdir "%RESOURCE_BASE%\images\food" 2>nul
mkdir "%RESOURCE_BASE%\images\generic" 2>nul
mkdir "%RESOURCE_BASE%\images\business" 2>nul
mkdir "%RESOURCE_BASE%\images\travel" 2>nul
mkdir "%RESOURCE_BASE%\images\office" 2>nul
mkdir "%RESOURCE_BASE%\images\technology" 2>nul

echo.
echo Resource directory structure has been created at:
echo %CD%\%RESOURCE_BASE%\audio
echo %CD%\%RESOURCE_BASE%\images
echo.
echo Please place your audio and image files in these directories
echo following the naming convention:
echo.
echo Audio files: [topic]/[topic]_q[question_order]_[exercise_id].mp3
echo Image files: [topic]/[topic]_q[question_order]_[exercise_id].jpg
echo.
echo Examples:
echo - greetings/greeting_q1_45.mp3 (First question of exercise 45 in Greetings)
echo - colors/color_q2_22.jpg (Second question of exercise 22 in Colors)
echo - numbers/number_q3_15.mp3 (Third question of exercise 15 in Numbers)
echo.
echo Press any key to exit...
pause > nul
