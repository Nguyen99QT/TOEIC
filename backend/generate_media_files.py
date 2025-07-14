import os
import re
import shutil
from pathlib import Path

# Base directories for media files
AUDIO_DIR = "src/main/resources/static/audio/exercises"
IMAGE_DIR = "src/main/resources/static/images/exercises"

# Ensure directories exist
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Read the SQL file to extract file paths
with open("database/migrations/update_questions.sql", "r", encoding="utf-8") as f:
    sql_content = f.read()

# Extract all audio_url values
audio_pattern = r"`audio_url` = '(/files/audio/exercises/([^']+)\.mp3)'"
audio_files = re.findall(audio_pattern, sql_content)

# Extract all image_url values
image_pattern = r"`image_url` = '(/files/images/exercises/([^']+)\.jpg)'"
image_files = re.findall(image_pattern, sql_content)

print(f"Found {len(audio_files)} audio files and {len(image_files)} image files in SQL")

# Create mapping between old and new filenames
audio_mapping = {}
image_mapping = {}

# Process audio files
for i, (path, filename) in enumerate(audio_files):
    old_filename = f"ex{i+1}.mp3"
    new_filename = f"{filename}.mp3"
    audio_mapping[old_filename] = new_filename
    
    # Copy existing file to new name if it exists
    old_path = os.path.join(AUDIO_DIR, old_filename)
    new_path = os.path.join(AUDIO_DIR, new_filename)
    
    if os.path.exists(old_path):
        print(f"Copying {old_path} to {new_path}")
        shutil.copy2(old_path, new_path)
    else:
        print(f"Warning: {old_path} does not exist")

# Process image files
for i, (path, filename) in enumerate(image_files):
    old_filename = f"ex{i+1}.jpg"
    new_filename = f"{filename}.jpg"
    image_mapping[old_filename] = new_filename
    
    # Copy existing file to new name if it exists
    old_path = os.path.join(IMAGE_DIR, old_filename)
    new_path = os.path.join(IMAGE_DIR, new_filename)
    
    if os.path.exists(old_path):
        print(f"Copying {old_path} to {new_path}")
        shutil.copy2(old_path, new_path)
    else:
        print(f"Warning: {old_path} does not exist")

print("\nAudio file mapping:")
for old, new in audio_mapping.items():
    print(f"{old} -> {new}")

print("\nImage file mapping:")
for old, new in image_mapping.items():
    print(f"{old} -> {new}")

print("\nDone! All files have been renamed according to the SQL file.")
