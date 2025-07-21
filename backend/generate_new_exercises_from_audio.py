#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Generate new exercises and questions for any unreferenced audio files.
This script:
1. Identifies audio files not referenced in the SQL
2. Creates new exercises as needed (each with 6 questions)
3. Generates SQL to insert these new exercises and questions
"""

import os
import re
import sys
from pathlib import Path
import datetime

# Directory paths
BACKEND_PATH = Path(os.path.dirname(os.path.abspath(__file__)))
AUDIO_PATH = BACKEND_PATH / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGES_PATH = BACKEND_PATH / "src" / "main" / "resources" / "static" / "images" / "exercises"
SQL_PATH = BACKEND_PATH / "database" / "migrations" / "update_questions_audio_image.sql"
OUTPUT_SQL_PATH = BACKEND_PATH / "database" / "migrations" / "new_exercises_from_audio.sql"

# Exercise categories/topics to cycle through for new exercises
EXERCISE_TOPICS = [
    "Vocabulary Practice",
    "Listening Comprehension",
    "Grammar Review",
    "Business English",
    "Travel English",
    "Daily Conversation",
    "Office Communication",
    "TOEIC Test Prep",
    "Professional English",
    "Academic English",
]

# Question types
QUESTION_TYPES = ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"]

# Difficulty levels
DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"]

def get_audio_files():
    """Get all ex*.mp3 files from the audio directory."""
    audio_files = []
    if not AUDIO_PATH.exists():
        print(f"❌ Audio directory not found: {AUDIO_PATH}")
        return []
    
    for file in AUDIO_PATH.glob("ex*.mp3"):
        audio_files.append(file.name)
    
    return sorted(audio_files, key=lambda x: int(re.search(r'ex(\d+)\.mp3', x).group(1)))

def get_image_files():
    """Get all ex*.jpg files from the images directory."""
    image_files = []
    if not IMAGES_PATH.exists():
        print(f"❌ Images directory not found: {IMAGES_PATH}")
        return []
    
    for file in IMAGES_PATH.glob("ex*.jpg"):
        image_files.append(file.name)
    
    return sorted(image_files, key=lambda x: int(re.search(r'ex(\d+)\.jpg', x).group(1)))

def get_sql_mappings():
    """Extract exercise_id and question_order mappings from SQL file."""
    if not SQL_PATH.exists():
        print(f"❌ SQL file not found: {SQL_PATH}")
        return {}
    
    with open(SQL_PATH, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    mappings = {}
    for match in re.finditer(r"WHERE exercise_id = (\d+) AND question_order = (\d+);", sql_content):
        exercise_id = int(match.group(1))
        question_order = int(match.group(2))
        
        # Find corresponding audio/image file numbers
        audio_pattern = fr"audio_url = '/files/audio/exercises/ex(\d+)\.mp3'"
        
        # Get context around the match
        start = max(0, match.start() - 200)
        end = min(len(sql_content), match.end() + 200)
        context = sql_content[start:end]
        
        audio_match = re.search(audio_pattern, context)
        
        if audio_match:
            audio_num = int(audio_match.group(1))
            mappings[(exercise_id, question_order)] = audio_num
    
    return mappings

def get_max_exercise_id(mappings):
    """Get the maximum exercise_id from the mappings."""
    if not mappings:
        return 0
    return max(ex_id for ex_id, _ in mappings.keys())

def generate_exercise_sql(exercise_id, title, description, difficulty):
    """Generate SQL to insert a new exercise."""
    return f"""
-- New exercise {exercise_id}: {title}
INSERT INTO exercises (
    id,
    title,
    description,
    category,
    difficulty_level,
    time_limit_minutes,
    pass_score,
    is_active,
    created_at,
    updated_at
) VALUES (
    {exercise_id},
    '{title}',
    '{description}',
    'VOCABULARY',
    '{difficulty}',
    10,
    70,
    1,
    NOW(),
    NOW()
);
"""

def generate_question_sql(exercise_id, question_order, audio_num, question_type, difficulty):
    """Generate SQL to insert a new question."""
    return f"""
-- New question for Exercise {exercise_id}, Question {question_order} (ex{audio_num}.mp3)
INSERT INTO questions (
    exercise_id, 
    question_text, 
    question_type, 
    option_a, 
    option_b, 
    option_c, 
    option_d, 
    correct_answer, 
    explanation, 
    difficulty_level, 
    points, 
    question_order, 
    is_active,
    audio_url,
    image_url
) VALUES (
    {exercise_id},
    'Listen to the audio and choose the correct answer:', -- Replace with actual question
    '{question_type}',
    'Option A', -- Replace with actual option
    'Option B', -- Replace with actual option
    'Option C', -- Replace with actual option
    'Option D', -- Replace with actual option
    'A', -- Replace with actual correct answer
    'Explanation for the correct answer', -- Replace with actual explanation
    '{difficulty}',
    10,
    {question_order},
    1,
    '/files/audio/exercises/ex{audio_num}.mp3',
    '/files/images/exercises/ex{audio_num}.jpg'
);
"""

def main():
    """Main function to generate SQL for new exercises and questions."""
    audio_files = get_audio_files()
    image_files = get_image_files()
    sql_mappings = get_sql_mappings()
    
    print(f"Found {len(audio_files)} audio files (ex*.mp3)")
    print(f"Found {len(image_files)} image files (ex*.jpg)")
    
    # Extract file numbers
    audio_nums = [int(re.search(r'ex(\d+)\.mp3', af).group(1)) for af in audio_files]
    image_nums = [int(re.search(r'ex(\d+)\.jpg', imgf).group(1)) for imgf in image_files]
    
    # Find files with both audio and image
    valid_nums = sorted(set(audio_nums).intersection(set(image_nums)))
    
    # Check which audio files are not referenced in SQL
    referenced_audio = set()
    for _, audio_num in sql_mappings.items():
        referenced_audio.add(audio_num)
    
    unreferenced_audio = [num for num in valid_nums if num not in referenced_audio]
    
    if not unreferenced_audio:
        print("✅ All audio files are already referenced in SQL")
        return
    
    print(f"⚠️ Found {len(unreferenced_audio)} audio files not referenced in SQL")
    
    # Get the maximum exercise_id from the existing mappings
    max_exercise_id = get_max_exercise_id(sql_mappings)
    
    # Group unreferenced audio files into exercises (6 questions per exercise)
    new_exercises = []
    current_exercise = []
    
    for audio_num in sorted(unreferenced_audio):
        current_exercise.append(audio_num)
        
        if len(current_exercise) == 6:
            new_exercises.append(current_exercise)
            current_exercise = []
    
    # Add any remaining questions as a partial exercise
    if current_exercise:
        new_exercises.append(current_exercise)
    
    # Generate SQL for new exercises and questions
    with open(OUTPUT_SQL_PATH, 'w', encoding='utf-8') as f:
        f.write("-- SQL Script to create new exercises and questions from unreferenced audio files\n")
        f.write(f"-- Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        for i, exercise_questions in enumerate(new_exercises):
            exercise_id = max_exercise_id + i + 1
            topic_index = i % len(EXERCISE_TOPICS)
            title = f"{EXERCISE_TOPICS[topic_index]} {exercise_id}"
            description = f"Practice your {EXERCISE_TOPICS[topic_index].lower()} skills with these questions."
            difficulty = DIFFICULTY_LEVELS[i % len(DIFFICULTY_LEVELS)]
            
            # Generate exercise SQL
            f.write(generate_exercise_sql(exercise_id, title, description, difficulty))
            
            # Generate question SQL for each audio file in this exercise
            for question_order, audio_num in enumerate(exercise_questions, 1):
                question_type = QUESTION_TYPES[question_order % len(QUESTION_TYPES)]
                question_difficulty = DIFFICULTY_LEVELS[(question_order + i) % len(DIFFICULTY_LEVELS)]
                f.write(generate_question_sql(exercise_id, question_order, audio_num, question_type, question_difficulty))
            
            f.write("\n")
    
    print(f"✅ Generated SQL for {len(new_exercises)} new exercises with {len(unreferenced_audio)} questions")
    print(f"✅ SQL file saved to: {OUTPUT_SQL_PATH}")
    print(f"⚠️ Remember to review and customize the generated SQL before executing it")

if __name__ == "__main__":
    main()
