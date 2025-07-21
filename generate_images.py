#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import requests
import json
import time
import re
from pathlib import Path
import argparse
import sys

# Pixabay API key
API_KEY = '51145294-dc08e3ca4e59d25222944ece5'

# Base directories for resources
# Original frontend location
# FRONTEND_DIR = Path('frontend/public')
# AUDIO_DIR = FRONTEND_DIR / 'audio'
# IMAGES_DIR = FRONTEND_DIR / 'images'

# Backend location for resources
BACKEND_DIR = Path('backend/src/main/resources/static')
AUDIO_DIR = BACKEND_DIR / 'audio'
IMAGES_DIR = BACKEND_DIR / 'images'

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
    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    # Create topic subdirectories
    for topic in LESSON_TOPICS.values():
        topic_audio_dir = AUDIO_DIR / topic
        topic_images_dir = IMAGES_DIR / topic
        
        os.makedirs(topic_audio_dir, exist_ok=True)
        os.makedirs(topic_images_dir, exist_ok=True)
        print(f"Created directories for topic: {topic}")

# Fetch images from Pixabay for a given search term
def fetch_pixabay_image(search_term, filename, retries=3):
    url = f"https://pixabay.com/api/?key={API_KEY}&q={search_term}&image_type=photo&pretty=true&safesearch=true"
    
    for attempt in range(retries):
        try:
            response = requests.get(url)
            data = response.json()
            
            if data["totalHits"] > 0:
                # Get the first image
                image_url = data["hits"][0]["largeImageURL"]
                
                # Download the image
                img_response = requests.get(image_url)
                
                # Save to file
                with open(filename, 'wb') as f:
                    f.write(img_response.content)
                    
                print(f"Downloaded image for '{search_term}' to {filename}")
                return True
            else:
                # Try a simpler search term
                simplified_term = ' '.join(search_term.split()[:1])
                if simplified_term != search_term and attempt < retries - 1:
                    print(f"No images found for '{search_term}', trying '{simplified_term}'")
                    search_term = simplified_term
                    continue
                else:
                    print(f"No images found for '{search_term}'")
                    return False
                
        except Exception as e:
            print(f"Error fetching image for '{search_term}': {str(e)}")
            if attempt < retries - 1:
                print(f"Retrying... ({attempt + 1}/{retries})")
                time.sleep(1)
            else:
                return False
    
    return False

# Generate search terms based on question content
def get_search_term(lesson_id, exercise_id, question_text, question_order):
    topic = LESSON_TOPICS.get(lesson_id, "general")
    
    # Extract keywords from question text
    words = re.findall(r'"([^"]+)"', question_text)  # Get text in quotes first
    if not words:
        words = question_text.split()[:3]  # Get first three words if no quotes
    
    keywords = ' '.join(words)
    
    # For specific lesson types, add more context
    if lesson_id == 1:  # Greetings
        if "morning" in question_text.lower():
            return "good morning greeting"
        elif "goodbye" in question_text.lower():
            return "goodbye farewell"
        else:
            return f"{topic} {keywords}"
    
    elif lesson_id == 2:  # Numbers
        if "one" in question_text.lower() or "1" in question_text:
            return "number one 1"
        else:
            return f"{topic} {keywords}"
    
    elif lesson_id == 3:  # Colors
        for color in ["blue", "red", "green", "yellow", "orange", "purple", "black", "white"]:
            if color in question_text.lower():
                return f"{color} color"
        return f"{topic} {keywords}"
    
    # Default case
    return f"{topic} {keywords}"

# Generate image filename based on lesson, exercise, and question
def get_image_filename(lesson_id, exercise_id, question_order):
    topic = LESSON_TOPICS.get(lesson_id, "general")
    return f"{topic}/{topic}_ex{exercise_id}_q{question_order}.jpg"

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

# Generate images for all questions
def generate_images(questions, force=False):
    print(f"\nGenerating images for {len(questions)} questions...")
    count = 0
    
    for q in questions:
        lesson_id = q['lesson_id']
        exercise_id = q['exercise_id']
        question_order = q.get('question_order', 1)
        question_text = q['question_text']
        
        # Generate image filename
        image_path = get_image_filename(lesson_id, exercise_id, question_order)
        image_filename = IMAGES_DIR / image_path
        
        # Skip if file exists and not force mode
        if os.path.exists(image_filename) and not force:
            print(f"Image already exists: {image_filename}, skipping...")
            count += 1
            continue
        
        # Generate search term
        search_term = get_search_term(lesson_id, exercise_id, question_text, question_order)
        
        # Download image
        if fetch_pixabay_image(search_term, image_filename):
            count += 1
        
        # Respect API rate limits
        time.sleep(0.5)
    
    print(f"\nGenerated {count}/{len(questions)} images")

# Main function
def main():
    parser = argparse.ArgumentParser(description='Generate resources for TOEIC questions')
    parser.add_argument('--sql', type=str, help='Path to SQL file with question data')
    parser.add_argument('--force', action='store_true', help='Force regeneration of existing files')
    args = parser.parse_args()
    
    # Ensure directories exist
    ensure_directories()
    
    if args.sql:
        # Parse SQL file to get question data
        questions = parse_sql_file(args.sql)
        
        if questions:
            # Generate images
            generate_images(questions, args.force)
            print("\nImage generation complete.")
            print("NOTE: Audio files need to be generated separately using the generate_audio.py script.")
        else:
            print("No questions found in the SQL file.")
    else:
        print("Please provide a SQL file with question data using the --sql parameter.")
        print("Example: python generate_images.py --sql path/to/questions.sql")

if __name__ == "__main__":
    main()
