#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Analyze audio files in the backend resources directory and generate SQL questions based on them.
This script:
1. Scans the audio files in the exercises folder
2. Verifies that each audio file has a corresponding image file
3. Checks if all audio/image files are referenced in the SQL update script
4. Generates SQL statements for new questions if needed
"""

import os
import re
import sys
from pathlib import Path

# Directory paths
BACKEND_PATH = Path(os.path.dirname(os.path.abspath(__file__)))
AUDIO_PATH = BACKEND_PATH / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGES_PATH = BACKEND_PATH / "src" / "main" / "resources" / "static" / "images" / "exercises"
SQL_PATH = BACKEND_PATH / "database" / "migrations" / "update_questions_audio_image.sql"

# Regular expression pattern to extract exercise and question numbers from SQL
SQL_PATTERN = r"WHERE exercise_id = (\d+) AND question_order = (\d+);"

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
    for match in re.finditer(SQL_PATTERN, sql_content):
        exercise_id = int(match.group(1))
        question_order = int(match.group(2))
        
        # Find corresponding audio/image file numbers
        audio_pattern = fr"audio_url = '/files/audio/exercises/ex(\d+)\.mp3'"
        image_pattern = fr"image_url = '/files/images/exercises/ex(\d+)\.jpg'"
        
        # Get context around the match
        start = max(0, match.start() - 200)
        end = min(len(sql_content), match.end() + 200)
        context = sql_content[start:end]
        
        audio_match = re.search(audio_pattern, context)
        image_match = re.search(image_pattern, context)
        
        if audio_match and image_match:
            audio_num = int(audio_match.group(1))
            image_num = int(image_match.group(1))
            mappings[(exercise_id, question_order)] = (audio_num, image_num)
    
    return mappings

def generate_new_question_template(exercise_id, question_order, audio_num):
    """Generate a template for a new question based on the audio file number."""
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
    'What is the correct answer based on the audio?', -- Replace with actual question
    'MULTIPLE_CHOICE',
    'Option A', -- Replace with actual option
    'Option B', -- Replace with actual option
    'Option C', -- Replace with actual option
    'Option D', -- Replace with actual option
    'A', -- Replace with actual correct answer
    'Explanation for the correct answer', -- Replace with actual explanation
    'EASY',
    10,
    {question_order},
    1,
    '/files/audio/exercises/ex{audio_num}.mp3',
    '/files/images/exercises/ex{audio_num}.jpg'
);
"""

def generate_sql_update(exercise_id, question_order, audio_num):
    """Generate SQL UPDATE statement for an existing question."""
    return f"""
UPDATE questions 
SET audio_url = '/files/audio/exercises/ex{audio_num}.mp3',
    image_url = '/files/images/exercises/ex{audio_num}.jpg'
WHERE exercise_id = {exercise_id} AND question_order = {question_order};
"""

def get_next_available_mapping(mappings):
    """Determine the next available exercise_id and question_order."""
    if not mappings:
        return 1, 1
    
    max_exercise_id = max(m[0] for m in mappings.keys())
    questions_in_last_exercise = [q for e, q in mappings.keys() if e == max_exercise_id]
    
    if questions_in_last_exercise:
        max_question_order = max(questions_in_last_exercise)
        if max_question_order < 6:  # Assuming 6 questions per exercise
            return max_exercise_id, max_question_order + 1
    
    return max_exercise_id + 1, 1

def main():
    """Main function to analyze files and generate SQL."""
    audio_files = get_audio_files()
    image_files = get_image_files()
    sql_mappings = get_sql_mappings()
    
    print(f"Found {len(audio_files)} audio files (ex*.mp3)")
    print(f"Found {len(image_files)} image files (ex*.jpg)")
    print(f"Found {len(sql_mappings)} SQL mappings (exercise_id, question_order) -> (audio_num, image_num)")
    
    # Check for mismatches between audio and image files
    audio_nums = [int(re.search(r'ex(\d+)\.mp3', af).group(1)) for af in audio_files]
    image_nums = [int(re.search(r'ex(\d+)\.jpg', imgf).group(1)) for imgf in image_files]
    
    missing_images = [num for num in audio_nums if num not in image_nums]
    missing_audio = [num for num in image_nums if num not in audio_nums]
    
    if missing_images:
        print(f"❌ Missing image files for audio: {missing_images}")
    if missing_audio:
        print(f"❌ Missing audio files for images: {missing_audio}")
    
    # Check which audio files are not referenced in SQL
    referenced_audio = set()
    for _, (audio_num, _) in sql_mappings.items():
        referenced_audio.add(audio_num)
    
    unreferenced_audio = [num for num in audio_nums if num not in referenced_audio]
    
    if unreferenced_audio:
        print(f"⚠️ Found {len(unreferenced_audio)} audio files not referenced in SQL: {unreferenced_audio}")
        
        # Generate SQL for unreferenced audio files
        new_sql_file = BACKEND_PATH / "database" / "migrations" / "new_questions_from_audio.sql"
        with open(new_sql_file, 'w', encoding='utf-8') as f:
            f.write("-- SQL Script to add new questions based on unreferenced audio files\n\n")
            
            for audio_num in sorted(unreferenced_audio):
                # Determine next available exercise_id and question_order
                exercise_id, question_order = get_next_available_mapping(sql_mappings)
                
                # Generate question template
                question_sql = generate_new_question_template(exercise_id, question_order, audio_num)
                f.write(question_sql)
                
                # Update our mappings to account for this new question
                sql_mappings[(exercise_id, question_order)] = (audio_num, audio_num)
        
        print(f"✅ Generated new question templates in: {new_sql_file}")
    else:
        print("✅ All audio files are referenced in SQL")
    
    # Generate a report
    report_file = BACKEND_PATH / "audio_image_analysis_report.md"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("# Audio and Image Files Analysis Report\n\n")
        f.write(f"Generated on: {import datetime; datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- Audio files (ex*.mp3): {len(audio_files)}\n")
        f.write(f"- Image files (ex*.jpg): {len(image_files)}\n")
        f.write(f"- SQL mappings: {len(sql_mappings)}\n")
        f.write(f"- Unreferenced audio files: {len(unreferenced_audio)}\n\n")
        
        f.write("## Exercise to Media Mapping\n\n")
        f.write("| Exercise ID | Question Order | Audio File | Image File |\n")
        f.write("|------------|----------------|------------|------------|\n")
        
        for (exercise_id, question_order), (audio_num, image_num) in sorted(sql_mappings.items()):
            f.write(f"| {exercise_id} | {question_order} | ex{audio_num}.mp3 | ex{image_num}.jpg |\n")
        
        if unreferenced_audio:
            f.write("\n## Unreferenced Audio Files\n\n")
            f.write("| Audio File |\n")
            f.write("|------------|\n")
            for num in sorted(unreferenced_audio):
                f.write(f"| ex{num}.mp3 |\n")
    
    print(f"✅ Generated analysis report: {report_file}")
    
    # Check if SQL update is needed
    update_needed = False
    for (exercise_id, question_order), (audio_num, image_num) in sql_mappings.items():
        if audio_num != image_num:
            update_needed = True
            print(f"⚠️ Mismatch: Exercise {exercise_id}, Question {question_order} -> Audio: ex{audio_num}.mp3, Image: ex{image_num}.jpg")
    
    if update_needed:
        update_file = BACKEND_PATH / "database" / "migrations" / "fix_audio_image_mismatches.sql"
        with open(update_file, 'w', encoding='utf-8') as f:
            f.write("-- SQL Script to fix audio/image file mismatches\n\n")
            
            for (exercise_id, question_order), (audio_num, image_num) in sorted(sql_mappings.items()):
                if audio_num != image_num:
                    f.write(f"-- Fixing mismatch: Exercise {exercise_id}, Question {question_order}\n")
                    f.write(generate_sql_update(exercise_id, question_order, audio_num))
        
        print(f"✅ Generated SQL fixes for mismatches: {update_file}")

if __name__ == "__main__":
    main()
