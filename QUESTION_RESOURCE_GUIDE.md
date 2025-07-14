# TOEIC Question Resource Generation Guide

This guide will help you set up your environment and generate images and audio for TOEIC questions.

## Prerequisites

- Python 3.6 or higher
- Internet connection for downloading images and packages

## Quick Start

1. Run `setup_python_environment.bat` to prepare your Python environment
2. Run `generate_question_resources.bat` to generate images and audio files
3. Run the SQL script `backend/database/migrations/update_question_resource_paths.sql` to update your database

## Detailed Steps

### Step 1: Set Up Python Environment

1. Make sure Python 3.6+ is installed. If not, download it from [python.org](https://www.python.org/downloads/).

   - During installation, check "Add Python to PATH"
   - Restart your computer after installation

2. Run `setup_python_environment.bat` to install required packages:

   - This script will detect your Python installation
   - Install and upgrade pip (package manager)
   - Install required packages (requests, gtts)

3. If you encounter issues, try the alternative `manual_package_install.bat` script.

### Step 2: Generate Resources

1. Run `generate_question_resources.bat` to create images and audio:

   - When prompted, provide the SQL file path (default: `backend\src\main\resources\question_full.sql`)
   - Choose whether to force regeneration of existing files
   - The script will create all necessary folders and download resources

2. Resources will be generated in:
   - Images: `frontend/public/images/[topic]/`
   - Audio: `frontend/public/audio/[topic]/`

### Step 3: Update Database

1. Run the SQL script to update your database with the correct resource paths:

   - Path: `backend/database/migrations/update_question_resource_paths.sql`
   - This will update all questions with the correct audio_url and image_url values

2. Check your application to ensure resources are displaying correctly.

## Troubleshooting

### Python Installation Issues

If you're having trouble with Python:

1. Verify Python is installed by running `python --version` in a command prompt
2. If not found, try `python3 --version` or `py --version`
3. Make sure Python is added to your system PATH
4. Restart your computer after making changes

### Package Installation Issues

If packages fail to install:

1. Try running `manual_package_install.bat`
2. If that fails, open Command Prompt as Administrator and run:
   ```
   python -m ensurepip --upgrade
   python -m pip install requests gtts
   ```
3. Check for firewall or antivirus blocking downloads

### Resource Generation Issues

If resources aren't generating correctly:

1. Check the console output for specific errors
2. Verify internet connection (required for downloading images)
3. Check if destination folders are write-protected
4. Try running with administrator privileges

## Additional Information

- The Pixabay API has a rate limit. If you hit the limit, wait a few minutes before trying again.
- Audio generation might be slower for longer texts.
- If you need to customize the resource generation, edit the Python scripts directly.
