# TOEIC Learning Platform - Question Resource Management

## Overview

This documentation explains how to update and manage question resources (audio and images) for the TOEIC Learning Platform. The scripts provided organize resources by topic (Greetings, Numbers, Colors, etc.) to ensure consistency and better user experience.

## Lesson Topics

The system organizes lessons by the following topics:

1. Lesson 1: Greetings
2. Lesson 2: Numbers
3. Lesson 3: Colors
4. Lesson 4: Family
5. Lesson 5: Food
6. Lesson 6: Business
7. Lesson 7: Travel
8. Lesson 8: Office
9. Lesson 9: Technology
10. Other lessons: Generic

## Resource Organization

Resources are organized using the following naming convention:

- **Audio files**: `/audio/[topic]/[topic]_q[question_order]_[exercise_id].mp3`
- **Image files**: `/images/[topic]/[topic]_q[question_order]_[exercise_id].jpg`

Examples:

- `/audio/greetings/greeting_q1_45.mp3` (First question of exercise 45 in Greetings)
- `/images/colors/color_q2_22.jpg` (Second question of exercise 22 in Colors)
- `/audio/numbers/number_q3_15.mp3` (Third question of exercise 15 in Numbers)

## Setup Process

Follow these steps to properly set up and update question resources:

### Step 1: Create Resource Folders

Run the `create_resource_folders.bat` script to create the necessary folder structure:

```
create_resource_folders.bat
```

This creates folders for each topic under `/frontend/public/audio/` and `/frontend/public/images/`.

### Step 2: Update Question Resource Paths in Database

Run the `update_question_resources.bat` script to update all questions in the database with the correct resource paths:

```
update_question_resources.bat
```

This script will:

1. Ask if you want to create resource folders (if not already done)
2. Provide options for running the SQL script (phpMyAdmin, MySQL CLI, or automatic)
3. If automatic option is chosen, prompt for database credentials
4. Update all questions with proper resource paths based on lesson topics

### Step 3: Create Sample Resources (Optional)

For testing purposes, you can create sample placeholder resources using:

```
create_sample_resources.bat
```

**WARNING**: This creates many small placeholder files. Replace these with actual content before deploying to production.

## Verification

After running the scripts, verify the following:

1. Check that the database has been updated with proper audio_url and image_url paths
2. Ensure resource folders have been created with the right structure
3. Add appropriate audio and image files following the naming convention
4. Test the application to ensure resources load correctly

## Troubleshooting

### Database Update Issues

If you encounter errors running the SQL script, try:

1. **Using phpMyAdmin**:

   - Open phpMyAdmin
   - Select your database
   - Click on the "SQL" tab
   - Open the file `backend/database/migrations/update_all_question_resources.sql`
   - Copy its contents and paste them into the SQL query box
   - Click "Go" to execute

2. **Using MySQL CLI directly**:
   ```
   mysql -u [username] -p [database_name] < backend/database/migrations/update_all_question_resources.sql
   ```

### Resource File Issues

If resources don't appear in the application:

1. Verify that file paths in the database match the actual file locations
2. Check file permissions on the resource folders
3. Ensure the application can access the `/frontend/public/` directory
4. Confirm file names follow the exact convention described above

## Additional Notes

- The SQL script creates a backup of the questions table before making changes
- A log table (`question_update_log`) tracks all updates made
- The script provides statistics on how many questions were updated
