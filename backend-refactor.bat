@echo off
echo ======================================================
echo Backend Refactoring and Migration Script
echo ======================================================
echo.

echo Checking for Maven...
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven not found. Please install Maven and add it to your PATH.
    exit /b 1
)

echo Creating backup of current state...
if not exist "backend\backup" mkdir backend\backup
xcopy /s /y "backend\src\main\java\com\leenglish\api" "backend\backup\api\"
echo Backup created in backend\backup\api\

REM Enable delayed expansion for using variables inside loops
setlocal enabledelayedexpansion

echo ======================================================
echo Step 1: Creating necessary target directories
echo ======================================================
if not exist "backend\src\main\java\com\leenglish\toeic\security" mkdir "backend\src\main\java\com\leenglish\toeic\security"
if not exist "backend\src\main\java\com\leenglish\toeic\service" mkdir "backend\src\main\java\com\leenglish\toeic\service"
if not exist "backend\src\main\java\com\leenglish\toeic\utils" mkdir "backend\src\main\java\com\leenglish\toeic\utils"
if not exist "backend\src\main\java\com\leenglish\toeic\controller" mkdir "backend\src\main\java\com\leenglish\toeic\controller"
if not exist "backend\src\main\java\com\leenglish\toeic\config" mkdir "backend\src\main\java\com\leenglish\toeic\config"

echo ======================================================
echo Step 2: Migrating security classes from api to toeic
echo ======================================================
echo Moving JwtRequestFilter...
copy /Y "backend\src\main\java\com\leenglish\api\security\JwtRequestFilter.java" "backend\src\main\java\com\leenglish\toeic\security\"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java') -replace 'package com.leenglish.api.security;', 'package com.leenglish.toeic.security;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java') -replace 'import com.leenglish.api.services', 'import com.leenglish.toeic.service' | Set-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java') -replace 'import com.leenglish.api.utils', 'import com.leenglish.toeic.utils' | Set-Content 'backend\src\main\java\com\leenglish\toeic\security\JwtRequestFilter.java'"

echo Moving WebSecurityConfig...
copy /Y "backend\src\main\java\com\leenglish\api\security\WebSecurityConfig.java" "backend\src\main\java\com\leenglish\toeic\config\"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java') -replace 'package com.leenglish.api.security;', 'package com.leenglish.toeic.config;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java'"

echo Moving CorsConfig...
copy /Y "backend\src\main\java\com\leenglish\api\security\CorsConfig.java" "backend\src\main\java\com\leenglish\toeic\config\"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java') -replace 'package com.leenglish.api.security;', 'package com.leenglish.toeic.config;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java') -replace '@Configuration', '@Configuration`n@Primary' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java'"

echo ======================================================
echo Step 3: Migrating service classes from api to toeic
echo ======================================================
echo Moving TokenBlacklistService...
copy /Y "backend\src\main\java\com\leenglish\api\services\TokenBlacklistService.java" "backend\src\main\java\com\leenglish\toeic\service\"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java') -replace 'package com.leenglish.api.services;', 'package com.leenglish.toeic.service;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java'"

echo ======================================================
echo Step 4: Migrating utils classes from api to toeic
echo ======================================================
echo Moving JwtUtils...
copy /Y "backend\src\main\java\com\leenglish\api\utils\JwtUtils.java" "backend\src\main\java\com\leenglish\toeic\utils\"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java') -replace 'package com.leenglish.api.utils;', 'package com.leenglish.toeic.utils;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java'"

echo ======================================================
echo Step 5: Migrating controller classes from api to toeic
echo ======================================================
for /r "backend\src\main\java\com\leenglish\api\controllers" %%f in (*.java) do (
    set "filename=%%~nxf"
    echo Moving controller: !filename!
    copy /Y "%%f" "backend\src\main\java\com\leenglish\toeic\controller\"
    powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\controller\!filename!') -replace 'package com.leenglish.api.controllers;', 'package com.leenglish.toeic.controller;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\controller\!filename!'"
    powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\controller\!filename!') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content 'backend\src\main\java\com\leenglish\toeic\controller\!filename!'"
)

echo ======================================================
echo Step 6: Updating Security Configuration
echo ======================================================
echo Updating JwtRequestFilter references in SecurityConfig...
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java') -replace 'JwtAuthenticationFilter', 'JwtRequestFilter' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java') -replace 'import com.leenglish.toeic.security.JwtAuthenticationFilter;', 'import com.leenglish.toeic.security.JwtRequestFilter;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java'"

echo ======================================================
echo Step 7: Updating ComponentScan in main application
echo ======================================================
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\ToeicBackendApplication.java') -replace '@SpringBootApplication', '@SpringBootApplication`n@ComponentScan(basePackages = {\"com.leenglish.toeic\", \"com.leenglish.api\"})' | Set-Content 'backend\src\main\java\com\leenglish\toeic\ToeicBackendApplication.java'"

echo ======================================================
echo Step 8: Update all imports across toeic packages
echo ======================================================
echo Updating imports in all toeic classes...
for /r "backend\src\main\java\com\leenglish\toeic" %%f in (*.java) do (
    powershell -Command "(Get-Content '%%f') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content '%%f'"
)

echo ======================================================
echo Step 9: Cleaning and compiling backend
echo ======================================================
cd backend
call mvn clean compile

if %errorlevel% neq 0 (
    echo.
    echo ======================================================
    echo Compilation failed! Please check the logs above.
    echo ======================================================
    echo.
    echo Possible issues:
    echo 1. Duplicate bean definitions
    echo 2. Incorrect package imports
    echo 3. Class path issues
    echo.
    echo Try running the script again after fixing the errors.
    exit /b 1
)

echo.
echo ======================================================
echo Migration successful! The backend has been refactored.
echo ======================================================
echo.
echo Next steps:
echo 1. Run 'mvn spring-boot:run' to start the backend
echo 2. Test the backend with the mobile app
echo 3. Check for any remaining issues
echo.

cd ..
