# Multiple Questions Per Exercise

This solution addresses the issue where some exercises in the TOEIC learning platform have only one question, which causes issues with progress/point calculation.

## Problem

- Some exercises have only one question in the `questions` table, which can lead to inconsistent progress calculation
- This affects user experience and score tracking
- The point/progress calculation logic is designed for multiple questions per exercise

## Solution

The provided scripts automatically add multiple questions for exercises that currently have only one question:

1. **Identification**: The script identifies exercises with only one question
2. **Generation**: It generates 5 additional questions for each exercise, with variations of the original question
3. **Consistency**: The new questions maintain consistency with the exercise data (options, correct answer, etc.)

## Implementation Details

### SQL Approach

The generated SQL:

1. Creates a backup of the `questions` table
2. Identifies exercises with only one question
3. Generates 5 additional questions with variations:
   - Slight variation of the original question
   - Reversed form of the question
   - Reworded question
   - Question based on the explanation
   - Practice question
4. Sets proper question_order values for all questions
5. Verifies the results

### Files Included

1. `generate_additional_questions.py` - Python script to generate the SQL
2. `add_multiple_questions.bat` - Batch file to run the Python script
3. `database/migrations/add_multiple_questions_to_exercises.sql` - Generated SQL file (after running the script)

## How to Use

### Option 1: Using the Batch File

1. Run `add_multiple_questions.bat`
2. Follow the instructions in the command prompt to apply the SQL to your database

### Option 2: Manual Process

1. Run the Python script: `cd backend && python generate_additional_questions.py`
2. The SQL file will be generated at `backend/database/migrations/add_multiple_questions_to_exercises.sql`
3. Apply the SQL to your database using MySQL Workbench, phpMyAdmin, or command line

## Benefits

- Ensures consistent progress calculation for all exercises
- Improves user experience by providing multiple questions per exercise
- Maintains consistency with the existing data structure
- Preserves all references between exercises and questions

## Verification

After applying the SQL, you can verify the results with this query:

```sql
SELECT exercise_id, COUNT(*) as question_count
FROM questions
GROUP BY exercise_id
ORDER BY question_count;
```

All exercises should now have at least 6 questions.
