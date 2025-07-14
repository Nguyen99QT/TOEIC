import os
import re
import mysql.connector
from mysql.connector import Error

def verify_media_files_with_database():
    """
    Verify if all media files referenced in the database exist in the file system.
    Generate a report of missing files and suggest solutions.
    """
    # Configuration
    db_config = {
        'host': 'localhost',
        'database': 'toeic8', # Change to your actual database name
        'user': 'root', # Change to your actual database user
        'password': '' # Change to your actual database password
    }
    
    # Paths to static resources
    audio_base_path = 'src/main/resources/static/audio'
    image_base_path = 'src/main/resources/static/images'
    
    # Output report file
    report_file = 'media_files_verification_report.txt'
    
    # Connect to database
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Query to get all audio and image URLs from questions table
        cursor.execute("""
            SELECT id, exercise_id, question_order, audio_url, image_url 
            FROM questions 
            WHERE audio_url IS NOT NULL OR image_url IS NOT NULL
        """)
        questions = cursor.fetchall()
        
        # Query to get all audio and image URLs from exercises table
        cursor.execute("""
            SELECT id, audio_url, image_url 
            FROM exercises 
            WHERE audio_url IS NOT NULL OR image_url IS NOT NULL
        """)
        exercises = cursor.fetchall()
        
        # Close database connection
        cursor.close()
        conn.close()
        
        # Lists to store missing files
        missing_audio_files = []
        missing_image_files = []
        
        # Check question media files
        for question in questions:
            # Check audio file
            if question['audio_url']:
                # Extract file path
                file_path = question['audio_url'].replace('/files/audio/', '')
                # Check if file exists
                full_path = os.path.join(audio_base_path, file_path)
                if not os.path.exists(full_path):
                    missing_audio_files.append({
                        'id': question['id'],
                        'exercise_id': question['exercise_id'],
                        'question_order': question['question_order'],
                        'audio_url': question['audio_url'],
                        'file_path': full_path
                    })
            
            # Check image file
            if question['image_url']:
                # Extract file path
                file_path = question['image_url'].replace('/files/images/', '')
                # Check if file exists
                full_path = os.path.join(image_base_path, file_path)
                if not os.path.exists(full_path):
                    missing_image_files.append({
                        'id': question['id'],
                        'exercise_id': question['exercise_id'],
                        'question_order': question['question_order'],
                        'image_url': question['image_url'],
                        'file_path': full_path
                    })
        
        # Check exercise media files
        for exercise in exercises:
            # Check audio file
            if exercise['audio_url']:
                # Extract file path (considering it might be stored with or without /files/ prefix)
                file_path = exercise['audio_url']
                if file_path.startswith('/files/audio/'):
                    file_path = file_path.replace('/files/audio/', '')
                
                # Check if file exists
                full_path = os.path.join(audio_base_path, file_path)
                if not os.path.exists(full_path):
                    missing_audio_files.append({
                        'id': f"exercise_{exercise['id']}",
                        'exercise_id': exercise['id'],
                        'question_order': None,
                        'audio_url': exercise['audio_url'],
                        'file_path': full_path
                    })
            
            # Check image file
            if exercise['image_url']:
                # Extract file path
                file_path = exercise['image_url']
                if file_path.startswith('/files/images/'):
                    file_path = file_path.replace('/files/images/', '')
                
                # Check if file exists
                full_path = os.path.join(image_base_path, file_path)
                if not os.path.exists(full_path):
                    missing_image_files.append({
                        'id': f"exercise_{exercise['id']}",
                        'exercise_id': exercise['id'],
                        'question_order': None,
                        'image_url': exercise['image_url'],
                        'file_path': full_path
                    })
        
        # Generate report
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("=== MEDIA FILES VERIFICATION REPORT ===\n\n")
            
            # Summary
            f.write(f"Total questions checked: {len(questions)}\n")
            f.write(f"Total exercises checked: {len(exercises)}\n")
            f.write(f"Missing audio files: {len(missing_audio_files)}\n")
            f.write(f"Missing image files: {len(missing_image_files)}\n\n")
            
            # Missing audio files
            f.write("=== MISSING AUDIO FILES ===\n\n")
            if missing_audio_files:
                for item in missing_audio_files:
                    f.write(f"ID: {item['id']}\n")
                    f.write(f"Exercise ID: {item['exercise_id']}\n")
                    if item['question_order']:
                        f.write(f"Question Order: {item['question_order']}\n")
                    f.write(f"Audio URL: {item['audio_url']}\n")
                    f.write(f"File Path: {item['file_path']}\n\n")
            else:
                f.write("No missing audio files found.\n\n")
            
            # Missing image files
            f.write("=== MISSING IMAGE FILES ===\n\n")
            if missing_image_files:
                for item in missing_image_files:
                    f.write(f"ID: {item['id']}\n")
                    f.write(f"Exercise ID: {item['exercise_id']}\n")
                    if item['question_order']:
                        f.write(f"Question Order: {item['question_order']}\n")
                    f.write(f"Image URL: {item['image_url']}\n")
                    f.write(f"File Path: {item['file_path']}\n\n")
            else:
                f.write("No missing image files found.\n\n")
            
            # Recommendations
            f.write("=== RECOMMENDATIONS ===\n\n")
            if missing_audio_files or missing_image_files:
                f.write("1. Check the file paths in the database and make sure they match the actual file locations.\n")
                f.write("2. Generate missing media files using the appropriate scripts.\n")
                f.write("3. Update the database with the correct file paths.\n")
                f.write("4. Consider standardizing file naming conventions (e.g., ex1.mp3, ex1.jpg).\n")
                
                # Generate SQL to fix file paths
                f.write("\n=== SQL TO FIX FILE PATHS ===\n\n")
                f.write("-- Run this SQL to update all audio URLs to match the standard format\n")
                f.write("UPDATE questions\n")
                f.write("SET audio_url = CONCAT('/files/audio/exercises/ex', exercise_id, '_', question_order, '.mp3')\n")
                f.write("WHERE audio_url IS NOT NULL;\n\n")
                
                f.write("-- Run this SQL to update all image URLs to match the standard format\n")
                f.write("UPDATE questions\n")
                f.write("SET image_url = CONCAT('/files/images/exercises/ex', exercise_id, '_', question_order, '.jpg')\n")
                f.write("WHERE image_url IS NOT NULL;\n\n")
                
                # Generate SQL to fix exercise paths
                f.write("-- Run this SQL to update all exercise audio URLs to match the standard format\n")
                f.write("UPDATE exercises\n")
                f.write("SET audio_url = CONCAT('exercises/ex', id, '.mp3')\n")
                f.write("WHERE audio_url IS NOT NULL;\n\n")
                
                f.write("-- Run this SQL to update all exercise image URLs to match the standard format\n")
                f.write("UPDATE exercises\n")
                f.write("SET image_url = CONCAT('exercises/ex', id, '.jpg')\n")
                f.write("WHERE image_url IS NOT NULL;\n\n")
            else:
                f.write("All media files are present and accounted for. No action needed.\n")
        
        print(f"Report generated at {report_file}")
        
        # Return results
        return {
            'total_questions': len(questions),
            'total_exercises': len(exercises),
            'missing_audio_files': len(missing_audio_files),
            'missing_image_files': len(missing_image_files)
        }
    
    except Error as e:
        print(f"Database error: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def update_exercise_questions_url_mapping():
    """
    Create a SQL script to ensure the audio and image URLs in the questions table
    match the actual file paths in the backend static directories.
    """
    # Output SQL file
    sql_file = 'database/migrations/update_exercise_questions_urls.sql'
    
    # Scan the audio and image directories
    audio_path = 'src/main/resources/static/audio/exercises'
    image_path = 'src/main/resources/static/images/exercises'
    
    # Check if directories exist
    if not os.path.exists(audio_path) or not os.path.exists(image_path):
        print(f"Error: Could not find static resource directories.")
        return
    
    # Get list of audio and image files
    audio_files = [f for f in os.listdir(audio_path) if f.endswith('.mp3') and f.startswith('ex')]
    image_files = [f for f in os.listdir(image_path) if f.endswith('.jpg') and f.startswith('ex')]
    
    # Sort files to ensure proper order
    audio_files.sort(key=lambda x: int(re.search(r'ex(\d+)\.mp3', x).group(1)) if re.search(r'ex(\d+)\.mp3', x) else 0)
    image_files.sort(key=lambda x: int(re.search(r'ex(\d+)\.jpg', x).group(1)) if re.search(r'ex(\d+)\.jpg', x) else 0)
    
    # Generate SQL script
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("-- SQL Script to update questions with the correct audio and image URLs\n")
        f.write("-- Generated on July 10, 2025\n\n")
        
        f.write("-- First, create a backup of the questions table (recommended)\n")
        f.write("-- CREATE TABLE questions_backup AS SELECT * FROM questions;\n\n")
        
        # Map audio files to questions based on a mapping approach
        f.write("-- Update all questions with the corresponding audio and image files\n\n")
        
        # Using the exercise_id and question_order as a key
        counter = 1
        for audio_file in audio_files:
            if counter <= len(image_files):
                image_file = image_files[counter-1]
                
                # Extract the number from the filename
                audio_num = re.search(r'ex(\d+)\.mp3', audio_file)
                image_num = re.search(r'ex(\d+)\.jpg', image_file)
                
                if audio_num and image_num:
                    audio_num = int(audio_num.group(1))
                    image_num = int(image_num.group(1))
                    
                    # Calculate the exercise_id and question_order
                    # For example, exercise_id = (audio_num - 1) // 6 + 1
                    # and question_order = (audio_num - 1) % 6 + 1
                    # Adjust this calculation based on your database structure
                    exercise_id = (counter - 1) // 6 + 1
                    question_order = (counter - 1) % 6 + 1
                    
                    f.write(f"-- Update question for exercise {exercise_id}, question {question_order}\n")
                    f.write(f"UPDATE questions\n")
                    f.write(f"SET audio_url = '/files/audio/exercises/{audio_file}',\n")
                    f.write(f"    image_url = '/files/images/exercises/{image_file}'\n")
                    f.write(f"WHERE exercise_id = {exercise_id} AND question_order = {question_order};\n\n")
            
            counter += 1
        
        # Also update exercises table to match the files
        f.write("-- Update exercises table to match the correct audio and image files\n\n")
        
        for i in range(1, 16):  # Assuming there are 15 exercises
            if (i-1)*6+1 <= len(audio_files) and (i-1)*6+1 <= len(image_files):
                audio_file = audio_files[(i-1)*6]  # First audio file for this exercise
                image_file = image_files[(i-1)*6]  # First image file for this exercise
                
                f.write(f"-- Update exercise {i}\n")
                f.write(f"UPDATE exercises\n")
                f.write(f"SET audio_url = 'exercises/{audio_file}',\n")
                f.write(f"    image_url = 'exercises/{image_file}'\n")
                f.write(f"WHERE id = {i};\n\n")
    
    print(f"SQL script generated at {sql_file}")

if __name__ == "__main__":
    print("Starting media files verification...")
    verify_media_files_with_database()
    
    print("\nGenerating SQL to update URL mappings...")
    update_exercise_questions_url_mapping()
    
    print("\nAll tasks completed!")
