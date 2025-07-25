#!/usr/bin/env python
import os
import json
import re
import mysql.connector
from mysql.connector import Error

"""
Script to verify and update audio and image file references in the questions table.
This ensures all questions have valid media files.
"""

def connect_to_database():
    """Connect to MySQL database"""
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",  # Update with your MySQL username
            password="",  # Update with your MySQL password
            database="toeic8"  # Update with your database name
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
    return None

def get_questions_with_media():
    """Get all questions with their media file paths"""
    connection = connect_to_database()
    if connection is None:
        return []
    
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
        SELECT 
            q.id, 
            q.exercise_id, 
            q.question_text, 
            q.audio_url, 
            q.image_url,
            e.audio_url as exercise_audio_url,
            e.image_url as exercise_image_url
        FROM 
            questions q
        JOIN
            exercises e ON q.exercise_id = e.id
        """
        cursor.execute(query)
        return cursor.fetchall()
    except Error as e:
        print(f"Error retrieving questions: {e}")
        return []
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def update_question_media(question_id, audio_url, image_url):
    """Update a question's audio and image URLs"""
    connection = connect_to_database()
    if connection is None:
        return False
    
    cursor = connection.cursor()
    try:
        query = """
        UPDATE questions 
        SET audio_url = %s, image_url = %s 
        WHERE id = %s
        """
        cursor.execute(query, (audio_url, image_url, question_id))
        connection.commit()
        return True
    except Error as e:
        print(f"Error updating question {question_id}: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def verify_and_update_media():
    """Verify and update media paths for all questions"""
    questions = get_questions_with_media()
    if not questions:
        print("No questions found or database connection failed.")
        return
    
    # Base directories for media files
    audio_base_dir = "../src/main/resources/static/audio"
    image_base_dir = "../src/main/resources/static/images"
    
    # If directories don't exist, try alternative paths
    if not os.path.exists(audio_base_dir):
        audio_base_dir = "src/main/resources/static/audio"
    if not os.path.exists(image_base_dir):
        image_base_dir = "src/main/resources/static/images"
    
    # Ensure the directories exist
    os.makedirs(audio_base_dir, exist_ok=True)
    os.makedirs(image_base_dir, exist_ok=True)
    
    updated_questions = 0
    missing_audio = 0
    missing_images = 0
    
    for question in questions:
        question_id = question['id']
        exercise_id = question['exercise_id']
        audio_url = question['audio_url']
        image_url = question['image_url']
        exercise_audio = question['exercise_audio_url']
        exercise_image = question['exercise_image_url']
        
        # Clean up URLs (remove leading /files/ if present)
        if audio_url and audio_url.startswith('/files/'):
            audio_url = audio_url[7:]  # Remove '/files/'
        if image_url and image_url.startswith('/files/'):
            image_url = image_url[7:]  # Remove '/files/'
        
        # If question doesn't have media but exercise does, use exercise media
        if (not audio_url or not os.path.exists(os.path.join(audio_base_dir, audio_url))) and exercise_audio:
            audio_url = exercise_audio
            missing_audio += 1
        
        if (not image_url or not os.path.exists(os.path.join(image_base_dir, image_url))) and exercise_image:
            image_url = exercise_image
            missing_images += 1
        
        # Ensure URLs have the correct format
        audio_url = f"/files/audio/{audio_url}" if audio_url and not audio_url.startswith('/files/') else audio_url
        image_url = f"/files/images/{image_url}" if image_url and not image_url.startswith('/files/') else image_url
        
        # Update the question
        if update_question_media(question_id, audio_url, image_url):
            updated_questions += 1
    
    print(f"Updated {updated_questions} questions")
    print(f"Fixed {missing_audio} missing audio references")
    print(f"Fixed {missing_images} missing image references")

def generate_sql_to_update_media():
    """Generate SQL script to update media paths"""
    questions = get_questions_with_media()
    if not questions:
        print("No questions found or database connection failed.")
        return
    
    sql_file = "database/migrations/update_questions_media_paths.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("""-- SQL Script to update media paths for questions
-- Generated on July 10, 2025

-- First, create a backup of the questions table
CREATE TABLE IF NOT EXISTS questions_media_backup LIKE questions;
INSERT INTO questions_media_backup SELECT * FROM questions;

-- Update questions with missing media
""")
        
        for question in questions:
            question_id = question['id']
            exercise_id = question['exercise_id']
            audio_url = question['audio_url']
            image_url = question['image_url']
            exercise_audio = question['exercise_audio_url']
            exercise_image = question['exercise_image_url']
            
            # Clean up URLs (remove leading /files/ if present)
            if audio_url and audio_url.startswith('/files/'):
                audio_url = audio_url[7:]  # Remove '/files/'
            if image_url and image_url.startswith('/files/'):
                image_url = image_url[7:]  # Remove '/files/'
            
            # If question doesn't have media but exercise does, use exercise media
            if not audio_url and exercise_audio:
                f.write(f"-- Question {question_id} missing audio, using exercise audio\n")
                f.write(f"UPDATE questions SET audio_url = '/files/audio/{exercise_audio}' WHERE id = {question_id};\n\n")
            
            if not image_url and exercise_image:
                f.write(f"-- Question {question_id} missing image, using exercise image\n")
                f.write(f"UPDATE questions SET image_url = '/files/images/{exercise_image}' WHERE id = {question_id};\n\n")
        
        f.write("""
-- Ensure all audio_url values have correct format
UPDATE questions 
SET audio_url = CONCAT('/files/audio/', SUBSTRING(audio_url, LOCATE('audio/', audio_url) + 6))
WHERE audio_url IS NOT NULL AND audio_url NOT LIKE '/files/audio/%' AND audio_url LIKE '%audio/%';

-- Ensure all image_url values have correct format
UPDATE questions 
SET image_url = CONCAT('/files/images/', SUBSTRING(image_url, LOCATE('images/', image_url) + 7))
WHERE image_url IS NOT NULL AND image_url NOT LIKE '/files/images/%' AND image_url LIKE '%images/%';

-- Update any questions still missing media with their exercise's media
UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.audio_url = CONCAT('/files/audio/', e.audio_url)
WHERE (q.audio_url IS NULL OR q.audio_url = '') AND e.audio_url IS NOT NULL;

UPDATE questions q
JOIN exercises e ON q.exercise_id = e.id
SET q.image_url = CONCAT('/files/images/', e.image_url)
WHERE (q.image_url IS NULL OR q.image_url = '') AND e.image_url IS NOT NULL;
""")
    
    print(f"SQL script generated at {sql_file}")

if __name__ == "__main__":
    print("Starting media verification process...")
    
    # Generate SQL script
    generate_sql_to_update_media()
    
    # Uncomment the following line to directly update the database
    # verify_and_update_media()
    
    print("Process complete!")
