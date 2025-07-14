#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import re
import time
import argparse
from pathlib import Path
from gtts import gTTS
import sys

# Base directories for resources
# Original frontend location
# FRONTEND_DIR = Path('frontend/public')
# AUDIO_DIR = FRONTEND_DIR / 'audio'

# Backend location for resources
BACKEND_DIR = Path('backend/src/main/resources/static')
AUDIO_DIR = BACKEND_DIR / 'audio'

# Define lesson topics
LESSON_TOPICS = {
    1: "greetings",
    2: "numbers",
    3: "colors",
    4: "family",
    5: "food",
    6: "hobbies",
    7: "travel",
    8: "work",
    9: "daily_routine",
    10: "weather",
    11: "sports",
    12: "music",
    13: "movies",
    14: "books",
    15: "technology",
    16: "health",
    17: "education",
    18: "business",
    19: "environment",
    20: "culture"
}

# Ensure directories exist
def ensure_directories():
    print("Creating directory structure...")
    # Create main directories
    os.makedirs(AUDIO_DIR, exist_ok=True)
    
    # Create topic subdirectories
    for topic in LESSON_TOPICS.values():
        topic_audio_dir = AUDIO_DIR / topic
        os.makedirs(topic_audio_dir, exist_ok=True)
        print(f"Created directory for topic: {topic}")

# Generate speech based on question text
def generate_speech(text, filename, lang='en', retries=3):
    for attempt in range(retries):
        try:
            # Create a text-to-speech object
            tts = gTTS(text=text, lang=lang, slow=False)
            
            # Save the audio file
            tts.save(filename)
            
            print(f"Generated audio for: '{text}' to {filename}")
            return True
            
        except Exception as e:
            print(f"Error generating audio for '{text}': {str(e)}")
            if attempt < retries - 1:
                print(f"Retrying... ({attempt + 1}/{retries})")
                time.sleep(1)
            else:
                return False
    
    return False

# Generate audio filename based on lesson, exercise, and question
def get_audio_filename(lesson_id, exercise_id, question_order):
    topic = LESSON_TOPICS.get(lesson_id, "general")
    return f"{topic}/{topic}_ex{exercise_id}_q{question_order}.mp3"

# Parse a SQL file to extract question data
def parse_sql_file(filename):
    questions = []
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all UPDATE statements for questions
        update_pattern = r"UPDATE\s+`questions`\s+SET\s+`question_text`\s*=\s*'([^']+)'.*?`exercise_id`\s*=\s*(\d+)"
        update_matches = re.findall(update_pattern, content, re.DOTALL | re.IGNORECASE)
        
        # Find all INSERT statements for questions
        insert_pattern = r"INSERT\s+INTO\s+`questions`.*?VALUES\s*\([^)]*?'([^']+)'.*?(\d+)\s*\)"
        insert_matches = re.findall(insert_pattern, content, re.DOTALL | re.IGNORECASE)
        
        # Process UPDATE matches
        for question_text, exercise_id in update_matches:
            questions.append({
                'question_text': question_text,
                'exercise_id': int(exercise_id),
                'question_order': 1  # Default order
            })
        
        # Process INSERT matches
        for question_text, exercise_id in insert_matches:
            questions.append({
                'question_text': question_text,
                'exercise_id': int(exercise_id),
                'question_order': 1  # Default order
            })
        
        # Map exercise IDs to lesson IDs (simplified mapping)
        # This assumes exercises are grouped by lesson in order
        for i, q in enumerate(questions):
            # Simple mapping: exercise_id / 3 + 1 = lesson_id (approximate)
            lesson_id = (q['exercise_id'] - 1) // 3 + 1
            if lesson_id > len(LESSON_TOPICS):
                lesson_id = (lesson_id % len(LESSON_TOPICS)) or len(LESSON_TOPICS)
            questions[i]['lesson_id'] = lesson_id
        
        return questions
    
    except Exception as e:
        print(f"Error parsing SQL file: {str(e)}")
        return []

# Generate audio for all questions
def generate_audio(questions, force=False):
    print(f"\nGenerating audio for {len(questions)} questions...")
    count = 0
    
    for q in questions:
        lesson_id = q['lesson_id']
        exercise_id = q['exercise_id']
        question_order = q.get('question_order', 1)
        question_text = q['question_text']
        
        # Generate audio filename
        audio_path = get_audio_filename(lesson_id, exercise_id, question_order)
        audio_filename = AUDIO_DIR / audio_path
        
        # Skip if file exists and not force mode
        if os.path.exists(audio_filename) and not force:
            print(f"Audio already exists: {audio_filename}, skipping...")
            count += 1
            continue
        
        # Generate audio
        if generate_speech(question_text, audio_filename):
            count += 1
        
        # Respect API rate limits
        time.sleep(0.5)
    
    print(f"\nGenerated {count}/{len(questions)} audio files")

# Main function
def main():
    parser = argparse.ArgumentParser(description='Generate audio for TOEIC questions')
    parser.add_argument('--sql', type=str, help='Path to SQL file with question data')
    parser.add_argument('--force', action='store_true', help='Force regeneration of existing files')
    parser.add_argument('--lang', type=str, default='en', help='Language for audio generation (default: en)')
    args = parser.parse_args()
    
    # Ensure directories exist
    ensure_directories()
    
    if args.sql:
        # Parse SQL file to get question data
        questions = parse_sql_file(args.sql)
        
        if questions:
            # Generate audio
            generate_audio(questions, args.force)
            print("\nAudio generation complete.")
        else:
            print("No questions found in the SQL file.")
    else:
        print("Please provide a SQL file with question data using the --sql parameter.")
        print("Example: python generate_audio.py --sql path/to/questions.sql")

if __name__ == "__main__":
    main()
