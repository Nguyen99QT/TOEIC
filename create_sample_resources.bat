@echo off
REM This script creates sample placeholder audio and image files for testing
REM Created on July 10, 2025

echo ===================================================================
echo       TOEIC Learning Platform - Sample Resource File Generator     
echo ===================================================================
echo.
echo This script will create sample placeholder audio and image files
echo for testing purposes, using the correct naming convention.
echo This is ONLY for testing - you should replace these with real content.
echo.
echo WARNING: This will create many small files in your resource folders.
echo.
set /p CONTINUE=Do you want to continue? (Y/N): 
if /i NOT "%CONTINUE%"=="Y" goto :EOF

set RESOURCE_BASE=frontend\public
set SAMPLE_AUDIO=backend\src\main\resources\sample.mp3
set SAMPLE_IMAGE=backend\src\main\resources\sample.jpg

REM Check if sample files exist, create them if not
if not exist "%SAMPLE_AUDIO%" (
    echo Creating sample audio file...
    echo RIFF > "%SAMPLE_AUDIO%"
)
if not exist "%SAMPLE_IMAGE%" (
    echo Creating sample image file...
    echo JPG > "%SAMPLE_IMAGE%"
)

echo.
echo Creating sample files for lessons...
echo.

REM LESSON 1: GREETINGS
echo Generating sample files for Greetings...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\greetings\greeting_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\greetings\greeting_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 2: NUMBERS
echo Generating sample files for Numbers...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\numbers\number_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\numbers\number_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 3: COLORS
echo Generating sample files for Colors...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\colors\color_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\colors\color_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 4: FAMILY
echo Generating sample files for Family...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\family\family_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\family\family_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 5: FOOD
echo Generating sample files for Food...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\food\food_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\food\food_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 6: BUSINESS
echo Generating sample files for Business...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\business\business_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\business\business_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 7: TRAVEL
echo Generating sample files for Travel...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\travel\travel_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\travel\travel_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 8: OFFICE
echo Generating sample files for Office...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\office\office_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\office\office_q%%j_%%i.jpg" > nul
    )
)

REM LESSON 9: TECHNOLOGY
echo Generating sample files for Technology...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\technology\technology_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\technology\technology_q%%j_%%i.jpg" > nul
    )
)

REM GENERIC
echo Generating sample files for Generic content...
for /L %%i in (1,1,10) do (
    for /L %%j in (1,1,3) do (
        copy "%SAMPLE_AUDIO%" "%RESOURCE_BASE%\audio\generic\generic_q%%j_%%i.mp3" > nul
        copy "%SAMPLE_IMAGE%" "%RESOURCE_BASE%\images\generic\generic_q%%j_%%i.jpg" > nul
    )
)

echo.
echo Sample resource files have been created.
echo Please replace these with actual content before deploying.
echo.
echo Press any key to exit...
pause > nul
