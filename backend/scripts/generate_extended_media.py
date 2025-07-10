#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - Extended Media Generator
Tạo media cho TẤT CẢ exercises và flashcards từ SQL data
"""

import os
import requests
import time
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont

# Pixabay API Configuration
PIXABAY_API_KEY = "51145294-dc08e3ca4e59d25222944ece5"
PIXABAY_BASE_URL = "https://pixabay.com/api/"

# Base directories
AUDIO_BASE = "src/main/resources/static/audio"
IMAGES_BASE = "src/main/resources/static/images"

def download_pixabay_image(query, save_path):
    """Download hình ảnh từ Pixabay API"""
    try:
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
                image_url = data["hits"][0]["webformatURL"]
                img_response = requests.get(image_url, timeout=30)
                if img_response.status_code == 200:
                    with open(save_path, 'wb') as f:
                        f.write(img_response.content)
                    return True
    except Exception as e:
        print(f"❌ Lỗi download ảnh: {e}")
    
    # Create placeholder if download fails
    create_placeholder_image(save_path, os.path.basename(save_path))
    return False

def create_placeholder_image(save_path, title):
    """Tạo hình ảnh placeholder"""
    try:
        img = Image.new('RGB', (800, 600), color=(100, 150, 200))
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("arial.ttf", 36)
        except:
            font = ImageFont.load_default()
        
        title_clean = title.replace('.jpg', '').replace('_', ' ').title()
        bbox = draw.textbbox((0, 0), title_clean, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (800 - text_width) // 2
        y = (600 - text_height) // 2
        
        draw.text((x+2, y+2), title_clean, fill=(0, 0, 0), font=font)
        draw.text((x, y), title_clean, fill=(255, 255, 255), font=font)
        
        img.save(save_path, 'JPEG', quality=85)
        return True
    except Exception as e:
        print(f"❌ Lỗi tạo placeholder: {e}")
        return False

def create_audio_tts(text, save_path):
    """Tạo file audio từ text"""
    try:
        clean_text = text.strip()
        if not clean_text:
            clean_text = "English lesson audio"
        tts = gTTS(text=clean_text, lang='en', slow=False)
        tts.save(save_path)
        return True
    except Exception as e:
        print(f"❌ Lỗi tạo audio: {e}")
        return False

# ALL EXERCISES DATA từ SQL
ALL_EXERCISES = [
    {"id": 1, "filename": "ex1", "text": "Which is a common English greeting? A. Hello, B. Goodbye, C. Thanks, D. Please", "keywords": "greeting hello handshake"},
    {"id": 2, "filename": "ex2", "text": "Match the greeting with the response. Hello - Good morning", "keywords": "greeting match exercise"},
    {"id": 3, "filename": "ex3", "text": "Fill in the blank: Hello! How are you?", "keywords": "greeting fill blank"},
    {"id": 4, "filename": "ex4", "text": "How do you say one in English? A. One, B. Two, C. Three, D. Four", "keywords": "numbers counting one"},
    {"id": 5, "filename": "ex5", "text": "Match the number with the word: 1 - One, 2 - Two", "keywords": "numbers matching exercise"},
    {"id": 6, "filename": "ex6", "text": "Fill in the blank: I have two apples", "keywords": "numbers fill blank apples"},
    {"id": 7, "filename": "ex7", "text": "What color is the sky on a clear day? A. Blue, B. Green, C. Red, D. Yellow", "keywords": "colors sky blue clear"},
    {"id": 8, "filename": "ex8", "text": "Match the color with the object: Red - Apple, Blue - Sky", "keywords": "colors matching objects"},
    {"id": 9, "filename": "ex9", "text": "Fill in the blank: The grass is green", "keywords": "colors grass green nature"},
    {"id": 10, "filename": "ex10", "text": "Who is your brother or sister's child? A. Niece, B. Nephew, C. Cousin, D. Sibling", "keywords": "family relatives cousin"},
    {"id": 11, "filename": "ex11", "text": "Match the family member: Mother - Female parent, Father - Male parent", "keywords": "family parents matching"},
    {"id": 12, "filename": "ex12", "text": "Fill in the blank: This is my mother", "keywords": "family mother parent"},
    {"id": 13, "filename": "ex13", "text": "What is a common breakfast food? A. Bread, B. Shirt, C. Car, D. House", "keywords": "food breakfast bread"},
    {"id": 14, "filename": "ex14", "text": "Match the food: Apple - Fruit, Carrot - Vegetable", "keywords": "food fruit vegetable"},
    {"id": 15, "filename": "ex15", "text": "Fill in the blank: I like to eat pizza", "keywords": "food pizza eat"},
    {"id": 16, "filename": "ex16", "text": "What is a common indoor hobby? A. Reading, B. Running, C. Swimming, D. Cycling", "keywords": "hobbies reading indoor"},
    {"id": 17, "filename": "ex17", "text": "Match the hobby: Painting - Art, Singing - Music", "keywords": "hobbies art music"},
    {"id": 18, "filename": "ex18", "text": "Fill in the blank: I enjoy jogging on weekends", "keywords": "hobbies jogging weekend"},
    {"id": 19, "filename": "ex19", "text": "Where can you see the Eiffel Tower? A. Paris, B. London, C. New York, D. Tokyo", "keywords": "travel paris eiffel tower"},
    {"id": 20, "filename": "ex20", "text": "Match the destination: Statue of Liberty - New York, Big Ben - London", "keywords": "travel landmarks destinations"},
    {"id": 21, "filename": "ex21", "text": "Fill in the blank: I want to visit Japan", "keywords": "travel japan visit"},
    {"id": 22, "filename": "ex22", "text": "What does a teacher do? A. Teaches, B. Sings, C. Dances, D. Paints", "keywords": "work teacher profession"},
    {"id": 23, "filename": "ex23", "text": "Match the job: Doctor - Heals people, Engineer - Builds things", "keywords": "work jobs profession"},
    {"id": 24, "filename": "ex24", "text": "Fill in the blank: I am a developer", "keywords": "work developer technology"},
    {"id": 25, "filename": "ex25", "text": "What do you do first in the morning? A. Wake up, B. Go to bed, C. Eat dinner, D. Take a shower", "keywords": "routine morning wake up"},
    {"id": 26, "filename": "ex26", "text": "Match the routine: Breakfast - Morning, Lunch - Afternoon", "keywords": "routine meals time"},
    {"id": 27, "filename": "ex27", "text": "Fill in the blank: I usually wake up at 7 AM", "keywords": "routine wake up morning"},
    {"id": 28, "filename": "ex28", "text": "How is the weather when it's raining? A. Wet, B. Dry, C. Hot, D. Cold", "keywords": "weather rain wet"},
    {"id": 29, "filename": "ex29", "text": "Match the weather: Sunny - Beach day, Snowy - Winter activity", "keywords": "weather sunny snowy"},
    {"id": 30, "filename": "ex30", "text": "Fill in the blank: It's raining today, take an umbrella", "keywords": "weather raining umbrella"},
    {"id": 31, "filename": "ex31", "text": "What sport uses a racket and ball? A. Tennis, B. Football, C. Basketball, D. Baseball", "keywords": "sports tennis racket ball"},
    {"id": 32, "filename": "ex32", "text": "Match the sport: Golf - Golf club, Swimming - Pool", "keywords": "sports golf swimming"},
]

# ALL FLASHCARDS DATA từ SQL  
ALL_FLASHCARDS = [
    {"id": 1, "filename": "apple", "word": "Apple", "keywords": "apple fruit red green"},
    {"id": 2, "filename": "book", "word": "Book", "keywords": "book reading education"},
    {"id": 3, "filename": "car", "word": "Car", "keywords": "car vehicle transportation"},
    {"id": 4, "filename": "dog", "word": "Dog", "keywords": "dog pet animal"},
    {"id": 5, "filename": "go", "word": "Go", "keywords": "go move travel"},
    {"id": 6, "filename": "eat", "word": "Eat", "keywords": "eat food consume"},
    {"id": 7, "filename": "read", "word": "Read", "keywords": "read book study"},
    {"id": 8, "filename": "write", "word": "Write", "keywords": "write pen paper"},
    {"id": 9, "filename": "red", "word": "Red", "keywords": "red color bright"},
    {"id": 10, "filename": "blue", "word": "Blue", "keywords": "blue color sky"},
    {"id": 11, "filename": "green", "word": "Green", "keywords": "green color grass"},
    {"id": 12, "filename": "yellow", "word": "Yellow", "keywords": "yellow color sun"},
    {"id": 13, "filename": "banana", "word": "Banana", "keywords": "banana fruit yellow"},
    {"id": 14, "filename": "orange", "word": "Orange", "keywords": "orange fruit citrus"},
    {"id": 15, "filename": "grape", "word": "Grape", "keywords": "grape fruit purple"},
    {"id": 16, "filename": "mango", "word": "Mango", "keywords": "mango fruit tropical"},
    {"id": 17, "filename": "cat", "word": "Cat", "keywords": "cat pet animal"},
    {"id": 18, "filename": "bird", "word": "Bird", "keywords": "bird animal flying"},
    {"id": 19, "filename": "fish", "word": "Fish", "keywords": "fish animal water"},
    {"id": 20, "filename": "horse", "word": "Horse", "keywords": "horse animal riding"},
    {"id": 21, "filename": "meeting", "word": "Meeting", "keywords": "meeting business office"},
    {"id": 22, "filename": "deadline", "word": "Deadline", "keywords": "deadline time business"},
    {"id": 23, "filename": "contract", "word": "Contract", "keywords": "contract legal document"},
    {"id": 24, "filename": "promotion", "word": "Promotion", "keywords": "promotion career business"},
    {"id": 25, "filename": "airport", "word": "Airport", "keywords": "airport travel airplane"},
    {"id": 26, "filename": "passport", "word": "Passport", "keywords": "passport travel document"},
    {"id": 27, "filename": "luggage", "word": "Luggage", "keywords": "luggage travel suitcase"},
    {"id": 28, "filename": "tourist", "word": "Tourist", "keywords": "tourist travel vacation"},
]

def generate_all_exercises():
    """Tạo media cho TẤT CẢ exercises"""
    print(f"✏️ Tạo media cho {len(ALL_EXERCISES)} exercises...")
    
    audio_dir = f"{AUDIO_BASE}/exercises"
    images_dir = f"{IMAGES_BASE}/exercises"
    
    for i, exercise in enumerate(ALL_EXERCISES, 1):
        print(f"  📝 Exercise {i}/{len(ALL_EXERCISES)}: {exercise['filename']}")
        
        # Generate audio
        audio_file = f"{exercise['filename']}.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            if create_audio_tts(exercise["text"], audio_path):
                print(f"    🔊 Audio: ✅")
            else:
                print(f"    🔊 Audio: ❌")
        else:
            print(f"    🔊 Audio: ✅ (đã có)")
        
        # Generate image
        image_file = f"{exercise['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            if download_pixabay_image(exercise["keywords"], image_path):
                print(f"    🖼️  Image: ✅")
            else:
                print(f"    🖼️  Image: ❌")
        else:
            print(f"    🖼️  Image: ✅ (đã có)")
            
        time.sleep(1)  # Rate limiting

def generate_all_flashcards():
    """Tạo media cho TẤT CẢ flashcards"""
    print(f"\n🎴 Tạo media cho {len(ALL_FLASHCARDS)} flashcards...")
    
    audio_dir = f"{AUDIO_BASE}/flashcards"
    images_dir = f"{IMAGES_BASE}/flashcards"
    
    for i, flashcard in enumerate(ALL_FLASHCARDS, 1):
        print(f"  📚 Flashcard {i}/{len(ALL_FLASHCARDS)}: {flashcard['filename']}")
        
        # Generate audio (word pronunciation)
        audio_file = f"{flashcard['filename']}.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            if create_audio_tts(flashcard["word"], audio_path):
                print(f"    🔊 Audio: ✅")
            else:
                print(f"    🔊 Audio: ❌")
        else:
            print(f"    🔊 Audio: ✅ (đã có)")
        
        # Generate image
        image_file = f"{flashcard['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            if download_pixabay_image(flashcard["keywords"], image_path):
                print(f"    🖼️  Image: ✅")
            else:
                print(f"    🖼️  Image: ❌")
        else:
            print(f"    🖼️  Image: ✅ (đã có)")
            
        time.sleep(1)  # Rate limiting

def main():
    """Hàm chính"""
    print("🚀 LeEnglish TOEIC - Extended Media Generator")
    print("=" * 60)
    print("📋 Tạo media cho TẤT CẢ exercises và flashcards từ database")
    print("=" * 60)
    
    try:
        # Generate all exercises
        generate_all_exercises()
        
        # Generate all flashcards  
        generate_all_flashcards()
        
        print(f"\n🎉 HOÀN THÀNH! Đã tạo media cho:")
        print(f"   ✏️  {len(ALL_EXERCISES)} exercises")
        print(f"   🎴 {len(ALL_FLASHCARDS)} flashcards")
        
        # Final count
        exercises_audio = len([f for f in os.listdir(f"{AUDIO_BASE}/exercises") if f.endswith('.mp3')])
        exercises_images = len([f for f in os.listdir(f"{IMAGES_BASE}/exercises") if f.endswith('.jpg')])
        flashcards_audio = len([f for f in os.listdir(f"{AUDIO_BASE}/flashcards") if f.endswith('.mp3')])
        flashcards_images = len([f for f in os.listdir(f"{IMAGES_BASE}/flashcards") if f.endswith('.jpg')])
        
        print(f"\n📊 TỔNG KẾT:")
        print(f"   📂 Exercises: {exercises_audio} audio, {exercises_images} images")
        print(f"   📂 Flashcards: {flashcards_audio} audio, {flashcards_images} images")
        
    except KeyboardInterrupt:
        print(f"\n⚠️  Đã dừng bởi người dùng")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")

if __name__ == "__main__":
    main()
