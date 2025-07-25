#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate exercise media files (audio and images) based on SQL content.
This script extracts media file information from SQL and generates the files using APIs.
"""
import re
import requests
import time
import shutil
from pathlib import Path
from typing import List, Dict, Tuple

# API configuration
API_KEY = "your-openai-api-key-here"  # Replace with actual API key
API_URL = "https://api.openai.com/v1/audio/speech"
IMAGE_API_URL = "https://api.openai.com/v1/images/generations"

# Base directories
BASE_DIR = Path(__file__).parent.parent
SQL_FILE = BASE_DIR / "database" / "migrations" / "update_questions.sql"
AUDIO_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGE_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "images" / "exercises"

# Ensure directories exist
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

def update_sql_paths() -> None:
    """Update SQL file paths to use /files/ prefix"""
    print("Updating SQL file paths...")
    
    if not SQL_FILE.exists():
        print(f"❌ SQL file not found: {SQL_FILE}")
        return
    
    with open(SQL_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace audio URLs
    content = re.sub(
        r"`audio_url` = '/audio/([^']+)'",
        r"`audio_url` = '/files/audio/exercises/\1'",
        content
    )
    
    # Replace image URLs
    content = re.sub(
        r"`image_url` = '/images/([^']+)'",
        r"`image_url` = '/files/images/exercises/\1'",
        content
    )
    
    with open(SQL_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("✅ SQL file updated with correct paths.")

def extract_media_info() -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
    """Extract media file info from SQL file"""
    print("Extracting media information from SQL file...")
    
    if not SQL_FILE.exists():
        print(f"❌ SQL file not found: {SQL_FILE}")
        return [], []
    
    with open(SQL_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract audio paths, filenames, and question texts
    audio_pattern = r"`audio_url` = '/files/audio/exercises/([^']+)'\s*,[\s\S]+?`question_text` = '([^']+)'"
    audio_matches = re.findall(audio_pattern, content)
    
    # Extract image paths and filenames
    image_pattern = r"`image_url` = '/files/images/exercises/([^']+)'"
    image_matches = re.findall(image_pattern, content)
    
    # Process audio files
    audio_files: List[Dict[str, str]] = []
    for filename, question_text in audio_matches:
        audio_files.append({
            "filename": filename,
            "text": question_text,
            "path": str(AUDIO_DIR / filename)
        })
    
    # Process image files
    image_files: List[Dict[str, str]] = []
    for filename in image_matches:
        image_files.append({
            "filename": filename,
            "path": str(IMAGE_DIR / filename)
        })
    
    return audio_files, image_files

def generate_audio_file(audio_info: Dict[str, str]) -> bool:
    """Generate audio file using the OpenAI API"""
    print(f"Generating audio file: {audio_info['filename']}")
    
    try:
        # Use OpenAI API to generate speech
        response = requests.post(
            API_URL,
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "tts-1",
                "input": audio_info['text'],
                "voice": "alloy"
            }
        )
        
        if response.status_code == 200:
            with open(audio_info['path'], 'wb') as f:
                f.write(response.content)
            print(f"  ✅ Created {audio_info['path']}")
            return True
        else:
            print(f"  ❌ Failed to generate audio: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error generating audio: {str(e)}")
        return False

def generate_image_file(image_info: Dict[str, str]) -> bool:
    """Generate image file using the OpenAI API"""
    print(f"Generating image file: {image_info['filename']}")
    
    # Extract topic from filename (e.g., greetings_hello.jpg -> "Hello greeting")
    topic = image_info['filename'].replace('.jpg', '').replace('_', ' ')
    prompt = f"A clear educational image representing '{topic}' for language learning, suitable for TOEIC test preparation"
    
    try:
        # Use OpenAI API to generate image
        response = requests.post(
            IMAGE_API_URL,
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            image_url = data['data'][0]['url']
            
            # Download the image
            img_response = requests.get(image_url, stream=True)
            if img_response.status_code == 200:
                with open(image_info['path'], 'wb') as f:
                    img_response.raw.decode_content = True
                    shutil.copyfileobj(img_response.raw, f)
                print(f"  ✅ Created {image_info['path']}")
                return True
            else:
                print(f"  ❌ Failed to download image: {img_response.status_code}")
                return False
        else:
            print(f"  ❌ Failed to generate image: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print(f"  ❌ Error generating image: {str(e)}")
        return False

def map_existing_files(audio_files: List[Dict[str, str]], image_files: List[Dict[str, str]]) -> None:
    """Map existing exN.mp3/jpg files to new names if they exist"""
    print("Mapping existing files to new names...")
    
    # Map audio files
    for i, audio_info in enumerate(audio_files):
        old_filename = f"ex{i+1}.mp3"
        src = AUDIO_DIR / old_filename
        dst = Path(audio_info['path'])
        
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists() and src.exists():
            print(f"Copying {src.name} to {dst.name}")
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                print(f"  ❌ Error copying {src} to {dst}: {e}")
    
    # Map image files
    for i, image_info in enumerate(image_files):
        old_filename = f"ex{i+1}.jpg"
        src = IMAGE_DIR / old_filename
        dst = Path(image_info['path'])
        
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists() and src.exists():
            print(f"Copying {src.name} to {dst.name}")
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                print(f"  ❌ Error copying {src} to {dst}: {e}")

def process_media_files() -> None:
    """Process all media files"""
    print("\n=== PROCESSING MEDIA FILES ===\n")
    
    # Extract media info
    audio_files, image_files = extract_media_info()
    
    print(f"Found {len(audio_files)} audio files and {len(image_files)} image files in SQL")
    
    if not audio_files and not image_files:
        print("❌ No media files found in SQL. Please check the SQL file format.")
        return
    
    # Map old files to new names
    map_existing_files(audio_files, image_files)
    
    # Process audio files
    print("\n--- Processing Audio Files ---\n")
    audio_success = 0
    audio_failed = 0
    
    for audio_info in audio_files:
        # Check if file already exists
        audio_path = Path(audio_info['path'])
        if audio_path.exists():
            print(f"Audio file already exists: {audio_info['filename']}")
            audio_success += 1
        else:
            # Try to generate the file
            if generate_audio_file(audio_info):
                audio_success += 1
            else:
                audio_failed += 1
        
        # Avoid API rate limits
        time.sleep(1)
    
    # Process image files
    print("\n--- Processing Image Files ---\n")
    image_success = 0
    image_failed = 0
    
    for image_info in image_files:
        # Check if file already exists
        image_path = Path(image_info['path'])
        if image_path.exists():
            print(f"Image file already exists: {image_info['filename']}")
            image_success += 1
        else:
            # Try to generate the file
            if generate_image_file(image_info):
                image_success += 1
            else:
                image_failed += 1
        
        # Avoid API rate limits
        time.sleep(2)
    
    # Final report
    print("\n=== GENERATION COMPLETE ===\n")
    print(f"📊 Audio Files:")
    print(f"   ✅ Success: {audio_success}")
    print(f"   ❌ Failed: {audio_failed}")
    print(f"📊 Image Files:")
    print(f"   ✅ Success: {image_success}")
    print(f"   ❌ Failed: {image_failed}")
    
    total_success = audio_success + image_success
    total_failed = audio_failed + image_failed
    print(f"\n🎯 Total: {total_success} successful, {total_failed} failed")

def main() -> None:
    """Main function"""
    print("🎨 Exercise Media Generator")
    print("=" * 50)
    
    # Check API key
    if API_KEY == "your-openai-api-key-here":
        print("⚠️  Warning: Please set your OpenAI API key in the script")
        print("   You can still run this to map existing files")
    
    # Update SQL paths first
    update_sql_paths()
    
    # Process media files
    process_media_files()
    
    print("\n🎉 Done!")

if __name__ == "__main__":
    main()
