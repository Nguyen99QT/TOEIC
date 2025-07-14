@echo off
REM Master script to set up and update question resources for TOEIC Learning Platform
REM Created on July 10, 2025

echo ===================================================================
echo         TOEIC Learning Platform - Question Resource Setup          
echo ===================================================================
echo.
echo This master script will guide you through the complete process
echo of setting up and updating question resources by topic.
echo.
echo The process involves these steps:
echo 1. Creating folder structure for resources
echo 2. Updating the database with proper resource paths
echo 3. (Optional) Creating sample placeholder resources for testing
echo.
echo For more information, please refer to QUESTION_RESOURCE_MANAGEMENT.md
echo.
set /p CONTINUE=Do you want to continue? (Y/N): 
if /i NOT "%CONTINUE%"=="Y" goto :EOF

echo.
echo Step 1: Creating resource folder structure...
echo.
call create_resource_folders.bat

echo.
echo Step 2: Updating database with proper resource paths...
echo.
call update_question_resources.bat

echo.
echo Step 3: Create sample placeholder resources (optional)
echo.
echo This step is optional and will create sample placeholder files
echo for testing purposes. In a production environment, you should
echo replace these with actual content.
echo.
set /p CREATE_SAMPLES=Do you want to create sample placeholder resources? (Y/N): 
if /i "%CREATE_SAMPLES%"=="Y" (
    call create_sample_resources.bat
)

echo.
echo ===================================================================
echo                        Setup Complete!                            
echo ===================================================================
echo.
echo Please refer to QUESTION_RESOURCE_MANAGEMENT.md for more information
echo on managing and updating question resources.
echo.
echo Press any key to exit...
pause > nul
