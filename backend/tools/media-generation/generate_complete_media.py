#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - Complete Media Generator
Tạo tổng hợp hình ảnh và audio cho lessons, exercises, và flashcards
Sử dụng Pixabay API cho hình ảnh và Google TTS cho audio
"""

import os
import requests
import shutil
import json
import time
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
import sqlite3
from pathlib import Path

# Pixabay API Configuration
PIXABAY_API_KEY = "51145294-dc08e3ca4e59d25222944ece5"
PIXABAY_BASE_URL = "https://pixabay.com/api/"

# Base Directories
BACKEND_BASE = "src/main/resources/static"
AUDIO_BASE = f"{BACKEND_BASE}/audio"
IMAGES_BASE = f"{BACKEND_BASE}/images"

# Organized Directory Structure
DIRECTORIES = {
    # Audio directories
    "audio": {
        "lessons": f"{AUDIO_BASE}/lessons",
        "exercises": f"{AUDIO_BASE}/exercises", 
        "flashcards": f"{AUDIO_BASE}/flashcards"
    },
    # Image directories
    "images": {
        "lessons": f"{IMAGES_BASE}/lessons",
        "exercises": f"{IMAGES_BASE}/exercises",
        "flashcards": f"{IMAGES_BASE}/flashcards"
    }
}

def create_directory_structure():
    """Tạo cấu trúc thư mục hợp lý"""
    print("🗂️  Tạo cấu trúc thư mục...")
    
    for media_type, categories in DIRECTORIES.items():
        for category, path in categories.items():
            os.makedirs(path, exist_ok=True)
            print(f"✅ Tạo thư mục: {path}")

def clean_old_files():
    """Xóa các file cũ không có âm thanh hoặc không hợp lệ"""
    print("\n🧹 Dọn dẹp các file cũ...")
    
    # Clean audio files
    for category_path in DIRECTORIES["audio"].values():
        if os.path.exists(category_path):
            for file in os.listdir(category_path):
                if file.endswith('.mp3'):
                    file_path = os.path.join(category_path, file)
                    # Check if file is very small (likely silent/corrupted)
                    if os.path.getsize(file_path) < 1000:  # Less than 1KB
                        print(f"🗑️  Xóa file audio nhỏ: {file}")
                        os.remove(file_path)
    
    # Clean image files  
    for category_path in DIRECTORIES["images"].values():
        if os.path.exists(category_path):
            for file in os.listdir(category_path):
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    file_path = os.path.join(category_path, file)
                    # Check if file is very small (likely corrupted)
                    if os.path.getsize(file_path) < 5000:  # Less than 5KB
                        print(f"🗑️  Xóa file ảnh nhỏ: {file}")
                        os.remove(file_path)

def download_pixabay_image(query, filename, save_path):
    """Download hình ảnh từ Pixabay API"""
    try:
        # Search for images
        params = {
            "key": PIXABAY_API_KEY,
            "q": query,
            "image_type": "photo",
            "category": "education",
            "min_width": 640,
            "min_height": 480,
            "per_page": 10,
            "safesearch": "true"
        }
        
        response = requests.get(PIXABAY_BASE_URL, params=params, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if data["hits"]:
                # Get the first suitable image
                image_url = data["hits"][0]["webformatURL"]
                
                # Download image
                img_response = requests.get(image_url, timeout=30)
                if img_response.status_code == 200:
                    with open(save_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"✅ Downloaded: {filename}")
                    return True
                    
    except Exception as e:
        print(f"❌ Lỗi download ảnh {filename}: {e}")
    
    # Fallback: Create a simple colored placeholder
    create_placeholder_image(save_path, filename)
    return False

def create_placeholder_image(save_path, title):
    """Tạo hình ảnh placeholder đơn giản"""
    try:
        # Create a colorful image
        img = Image.new('RGB', (800, 600), color=(100, 150, 200))
        draw = ImageDraw.Draw(img)
        
        # Try to use a nice font, fallback to default
        try:
            font = ImageFont.truetype("arial.ttf", 36)
            small_font = ImageFont.truetype("arial.ttf", 24)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        # Draw title
        title_clean = title.replace('.jpg', '').replace('.png', '').replace('_', ' ').title()
        
        # Calculate text position to center it
        bbox = draw.textbbox((0, 0), title_clean, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (800 - text_width) // 2
        y = (600 - text_height) // 2
        
        # Draw text with shadow effect
        draw.text((x+2, y+2), title_clean, fill=(0, 0, 0), font=font)  # Shadow
        draw.text((x, y), title_clean, fill=(255, 255, 255), font=font)  # Main text
        
        # Add subtitle
        subtitle = "LeEnglish TOEIC"
        bbox2 = draw.textbbox((0, 0), subtitle, font=small_font)
        text_width2 = bbox2[2] - bbox2[0]
        x2 = (800 - text_width2) // 2
        draw.text((x2, y + 60), subtitle, fill=(200, 200, 200), font=small_font)
        
        img.save(save_path, 'JPEG', quality=85)
        print(f"📄 Tạo placeholder: {title}")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi tạo placeholder {title}: {e}")
        return False

def create_audio_tts(text, save_path, lang='en'):
    """Tạo file audio từ text sử dụng Google TTS"""
    try:
        # Clean text for TTS
        clean_text = text.strip()
        if not clean_text:
            clean_text = "English lesson audio"
            
        # Create TTS
        tts = gTTS(text=clean_text, lang=lang, slow=False)
        tts.save(save_path)
        print(f"🔊 Tạo audio: {os.path.basename(save_path)}")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi tạo audio {save_path}: {e}")
        return False

# Data from SQL - Lessons
LESSONS_DATA = [
    {"id": 1, "filename": "greeting", "title": "Lesson 1: Greetings", "text": "Hello! Good morning! How are you today? Nice to meet you!", "keywords": "greeting hello handshake business people"},
    {"id": 2, "filename": "numbers", "title": "Lesson 2: Numbers", "text": "Let's learn numbers from one to ten. One, two, three, four, five.", "keywords": "numbers mathematics counting digits"},
    {"id": 3, "filename": "colors", "title": "Lesson 3: Colors", "text": "Colors are everywhere! Red like roses, blue like the sky, green like grass.", "keywords": "colors rainbow colorful paint palette"},
    {"id": 4, "filename": "family", "title": "Lesson 4: Family", "text": "This is my family. My mother, father, sister, and brother.", "keywords": "family parents children happy together"},
    {"id": 5, "filename": "food", "title": "Lesson 5: Food", "text": "I like pizza, burgers, and ice cream. What's your favorite food?", "keywords": "food meal delicious restaurant cooking"},
    {"id": 6, "filename": "hobbies", "title": "Lesson 6: Hobbies", "text": "I enjoy reading books, playing music, and painting pictures.", "keywords": "hobbies leisure activities fun sports"},
    {"id": 7, "filename": "travel", "title": "Lesson 7: Travel", "text": "I have been to Paris, London, and Tokyo. Travel is amazing!", "keywords": "travel vacation tourism landmarks suitcase"},
    {"id": 8, "filename": "work", "title": "Lesson 8: Work", "text": "I am a teacher. What is your job? Do you like your work?", "keywords": "work office business professional career"},
    {"id": 9, "filename": "routine", "title": "Lesson 9: Daily Routine", "text": "I wake up at 7 AM, have breakfast, and go to work every day.", "keywords": "daily routine morning schedule alarm clock"},
    {"id": 10, "filename": "weather", "title": "Lesson 10: Weather", "text": "It is sunny today. Yesterday was rainy. Tomorrow will be cloudy.", "keywords": "weather sunny cloudy rain snow climate"},
    {"id": 11, "filename": "sports", "title": "Lesson 11: Sports", "text": "I play football, tennis, and basketball. Sports are fun and healthy.", "keywords": "sports football tennis basketball exercise fitness"},
    {"id": 12, "filename": "music", "title": "Lesson 12: Music", "text": "I love rock music, classical music, and pop songs. Music is life!", "keywords": "music instruments concert song melody"},
    {"id": 13, "filename": "movies", "title": "Lesson 13: Movies", "text": "My favorite movie is a comedy. I also like action and drama films.", "keywords": "movies cinema film entertainment popcorn"},
    {"id": 14, "filename": "books", "title": "Lesson 14: Books", "text": "I enjoy reading novels, poetry, and science books. Reading is wonderful.", "keywords": "books reading library literature education"},
    {"id": 15, "filename": "art", "title": "Lesson 15: Art", "text": "I like painting, sculpture, and photography. Art is very creative.", "keywords": "art painting creativity museum gallery artist"},
    {"id": 16, "filename": "nature", "title": "Lesson 16: Nature", "text": "I love the mountains, forests, and oceans. Nature is beautiful.", "keywords": "nature mountains forest ocean landscape green"},
    {"id": 17, "filename": "technology", "title": "Lesson 17: Technology", "text": "I use a computer, smartphone, and tablet every day. Technology helps us.", "keywords": "technology computer smartphone digital innovation"},
    {"id": 18, "filename": "health", "title": "Lesson 18: Health", "text": "I go to the gym, eat healthy food, and sleep well. Health is important.", "keywords": "health fitness exercise doctor wellness nutrition"},
    {"id": 19, "filename": "education", "title": "Lesson 19: Education", "text": "I study at university. Education opens doors to the future.", "keywords": "education school university students learning graduation"},
    {"id": 20, "filename": "shopping", "title": "Lesson 20: Shopping", "text": "I need to buy groceries, clothes, and books at the shopping mall.", "keywords": "shopping mall store groceries clothes retail"}
]

# Data from SQL - Exercises (selected examples)
EXERCISES_DATA = [
    {"id": 1, "filename": "ex1", "title": "Greetings Exercise", "text": "Which is a common English greeting? Hello, Goodbye, Thanks, or Please?", "keywords": "exercise question greeting multiple choice"},
    {"id": 4, "filename": "ex4", "title": "Numbers Exercise", "text": "How do you say one in English? Choose the correct answer.", "keywords": "exercise numbers counting mathematics quiz"},
    {"id": 7, "filename": "ex7", "title": "Colors Exercise", "text": "What color is the sky on a clear day? Blue, green, red, or yellow?", "keywords": "exercise colors sky blue nature quiz"},
    {"id": 10, "filename": "ex10", "title": "Family Exercise", "text": "Who is your brother or sister's child? Choose the correct family member.", "keywords": "exercise family relationships cousin quiz"},
    {"id": 13, "filename": "ex13", "title": "Food Exercise", "text": "What is a common breakfast food? Bread, shirt, car, or house?", "keywords": "exercise food breakfast bread nutrition"},
]

# Data from SQL - Flashcards (selected examples)
FLASHCARDS_DATA = [
    {"id": 1, "filename": "apple", "word": "Apple", "text": "Apple. A round fruit with red or green skin. Example: I eat an apple.", "keywords": "apple fruit red green food nutrition"},
    {"id": 2, "filename": "book", "word": "Book", "text": "Book. A set of written pages. Example: This is my book.", "keywords": "book reading education study literature"},
    {"id": 3, "filename": "car", "word": "Car", "text": "Car. A road vehicle with four wheels. Example: The car is red.", "keywords": "car vehicle transportation automobile road"},
    {"id": 4, "filename": "dog", "word": "Dog", "text": "Dog. A common domestic animal. Example: The dog barks.", "keywords": "dog pet animal domestic companion"},
    {"id": 9, "filename": "red", "word": "Red", "text": "Red. The color of blood. Example: The apple is red.", "keywords": "red color blood bright vibrant"},
    {"id": 10, "filename": "blue", "word": "Blue", "text": "Blue. The color of the sky. Example: The sky is blue.", "keywords": "blue color sky ocean peaceful calm"},
    {"id": 21, "filename": "meeting", "word": "Meeting", "text": "Meeting. A gathering of people for discussion. Example: We have a meeting at 9.", "keywords": "meeting business conference discussion office"},
    {"id": 25, "filename": "airport", "word": "Airport", "text": "Airport. A place for airplanes. Example: I am at the airport.", "keywords": "airport travel airplane flight transportation"},
]

def generate_lessons_media():
    """Tạo media cho lessons"""
    print("\n📚 Tạo media cho Lessons...")
    
    audio_dir = DIRECTORIES["audio"]["lessons"]
    images_dir = DIRECTORIES["images"]["lessons"]
    
    for lesson in LESSONS_DATA:
        # Generate audio
        audio_file = f"{lesson['filename']}-intro.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            create_audio_tts(lesson["text"], audio_path)
        
        # Generate image
        image_file = f"{lesson['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            download_pixabay_image(lesson["keywords"], image_file, image_path)
            
        time.sleep(1)  # Rate limiting

def generate_exercises_media():
    """Tạo media cho exercises"""
    print("\n✏️ Tạo media cho Exercises...")
    
    audio_dir = DIRECTORIES["audio"]["exercises"]
    images_dir = DIRECTORIES["images"]["exercises"]
    
    for exercise in EXERCISES_DATA:
        # Generate audio
        audio_file = f"{exercise['filename']}.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            create_audio_tts(exercise["text"], audio_path)
        
        # Generate image
        image_file = f"{exercise['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            download_pixabay_image(exercise["keywords"], image_file, image_path)
            
        time.sleep(1)  # Rate limiting

def generate_flashcards_media():
    """Tạo media cho flashcards"""
    print("\n🎴 Tạo media cho Flashcards...")
    
    audio_dir = DIRECTORIES["audio"]["flashcards"]
    images_dir = DIRECTORIES["images"]["flashcards"]
    
    for flashcard in FLASHCARDS_DATA:
        # Generate audio (word pronunciation)
        audio_file = f"{flashcard['filename']}.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            create_audio_tts(flashcard["word"], audio_path)
        
        # Generate image
        image_file = f"{flashcard['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            download_pixabay_image(flashcard["keywords"], image_file, image_path)
            
        time.sleep(1)  # Rate limiting

def generate_summary_report():
    """Tạo báo cáo tổng kết"""
    print("\n📊 Tạo báo cáo tổng kết...")
    
    report = {
        "generation_time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "directories_created": {},
        "files_generated": {}
    }
    
    # Count files in each directory
    for media_type, categories in DIRECTORIES.items():
        report["directories_created"][media_type] = {}
        report["files_generated"][media_type] = {}
        
        for category, path in categories.items():
            if os.path.exists(path):
                files = os.listdir(path)
                report["directories_created"][media_type][category] = path
                report["files_generated"][media_type][category] = len(files)
    
    # Save report
    with open("media_generation_summary.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n✅ HOÀN THÀNH! Báo cáo được lưu trong media_generation_summary.json")
    print(f"📁 Cấu trúc thư mục:")
    for media_type, categories in report["directories_created"].items():
        print(f"  {media_type.upper()}:")
        for category, path in categories.items():
            file_count = report["files_generated"][media_type][category]
            print(f"    📂 {category}: {file_count} files - {path}")

def main():
    """Hàm chính"""
    print("🚀 LeEnglish TOEIC - Complete Media Generator")
    print("=" * 50)
    
    try:
        # 1. Create directory structure
        create_directory_structure()
        
        # 2. Clean old files
        clean_old_files()
        
        # 3. Generate media for lessons
        generate_lessons_media()
        
        # 4. Generate media for exercises
        generate_exercises_media()
        
        # 5. Generate media for flashcards
        generate_flashcards_media()
        
        # 6. Generate summary report
        generate_summary_report()
        
        print(f"\n🎉 TẤT CẢ ĐÃ HOÀN THÀNH!")
        print(f"📂 Tất cả media files đã được tạo trong: {BACKEND_BASE}")
        
    except KeyboardInterrupt:
        print(f"\n⚠️  Đã dừng bởi người dùng")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")

if __name__ == "__main__":
    main()
