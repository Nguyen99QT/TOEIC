#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - Lesson Media Generator
Tạo hình ảnh từ Pixabay API và audio từ text-to-speech cho lessons
"""

import os
import requests
import shutil
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
import time

# Pixabay API Configuration
PIXABAY_API_KEY = "51145294-dc08e3ca4e59d25222944ece5"
PIXABAY_BASE_URL = "https://pixabay.com/api/"

# Directories
BACKEND_AUDIO_DIR = "src/main/resources/static/audio/lessons"
BACKEND_IMAGES_DIR = "src/main/resources/static/images/lessons"

# Lesson data với keywords cho Pixabay search
LESSONS_DATA = [
    {
        "id": 1,
        "filename": "greeting",
        "title": "Lesson 1: Greetings",
        "text": "Hello! Good morning! How are you today? Nice to meet you!",
        "keywords": "greeting hello handshake business people"
    },
    {
        "id": 2,
        "filename": "numbers",
        "title": "Lesson 2: Numbers",
        "text": "Let's learn numbers from one to ten. One, two, three, four, five.",
        "keywords": "numbers mathematics counting digits"
    },
    {
        "id": 3,
        "filename": "colors",
        "title": "Lesson 3: Colors",
        "text": "Colors are everywhere! Red like roses, blue like the sky, green like grass.",
        "keywords": "colors rainbow colorful paint palette"
    },
    {
        "id": 4,
        "filename": "family",
        "title": "Lesson 4: Family",
        "text": "This is my family. My mother, father, sister, and brother.",
        "keywords": "family parents children happy together"
    },
    {
        "id": 5,
        "filename": "food",
        "title": "Lesson 5: Food",
        "text": "I love eating delicious food. Pizza, hamburger, salad, and fruit.",
        "keywords": "food cooking kitchen restaurant meal"
    },
    {
        "id": 6,
        "filename": "hobbies",
        "title": "Lesson 6: Hobbies",
        "text": "My hobbies include reading books, playing sports, and listening to music.",
        "keywords": "hobbies reading sports music activities"
    },
    {
        "id": 7,
        "filename": "travel",
        "title": "Lesson 7: Travel",
        "text": "I love to travel and explore new places around the world.",
        "keywords": "travel airplane luggage passport vacation"
    },
    {
        "id": 8,
        "filename": "work",
        "title": "Lesson 8: Work",
        "text": "I work in an office. My job is interesting and challenging.",
        "keywords": "office work business computer desk"
    },
    {
        "id": 9,
        "filename": "weather",
        "title": "Lesson 9: Weather",
        "text": "Today is sunny and warm. Yesterday was rainy and cold.",
        "keywords": "weather sun clouds rain temperature"
    },
    {
        "id": 10,
        "filename": "shopping",
        "title": "Lesson 10: Shopping",
        "text": "I need to go shopping for groceries and clothes today.",
        "keywords": "shopping mall store retail clothing"
    }
]

class LessonMediaGenerator:
    def __init__(self):
        self.session = requests.Session()
        self.create_directories()
    
    def create_directories(self):
        """Tạo thư mục cần thiết"""
        os.makedirs(BACKEND_AUDIO_DIR, exist_ok=True)
        os.makedirs(BACKEND_IMAGES_DIR, exist_ok=True)
        print(f"✅ Created directories:")
        print(f"   📁 {BACKEND_AUDIO_DIR}")
        print(f"   📁 {BACKEND_IMAGES_DIR}")
    
    def remove_existing_files(self, filename):
        """Xóa các file cũ nếu trùng tên"""
        audio_file = os.path.join(BACKEND_AUDIO_DIR, f"{filename}-intro.mp3")
        image_file = os.path.join(BACKEND_IMAGES_DIR, f"{filename}.jpg")
        
        for file_path in [audio_file, image_file]:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"🗑️  Removed existing file: {os.path.basename(file_path)}")
    
    def download_image_from_pixabay(self, keywords, filename):
        """Tải hình ảnh từ Pixabay API"""
        try:
            # Tham số API Pixabay
            params = {
                'key': PIXABAY_API_KEY,
                'q': keywords,
                'image_type': 'photo',
                'orientation': 'horizontal',
                'min_width': 640,
                'min_height': 480,
                'category': 'education',
                'safesearch': 'true',
                'per_page': 5
            }
            
            print(f"🔍 Searching Pixabay for: {keywords}")
            response = self.session.get(PIXABAY_BASE_URL, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                if data['hits']:
                    # Lấy hình ảnh đầu tiên
                    image_data = data['hits'][0]
                    image_url = image_data['webformatURL']
                    
                    # Tải hình ảnh
                    img_response = self.session.get(image_url)
                    if img_response.status_code == 200:
                        image_path = os.path.join(BACKEND_IMAGES_DIR, f"{filename}.jpg")
                        
                        with open(image_path, 'wb') as f:
                            f.write(img_response.content)
                        
                        print(f"✅ Downloaded image: {filename}.jpg")
                        return True
                    else:
                        print(f"❌ Failed to download image from: {image_url}")
                else:
                    print(f"⚠️  No images found for keywords: {keywords}")
                    return self.create_fallback_image(filename)
            else:
                print(f"❌ Pixabay API error: {response.status_code}")
                return self.create_fallback_image(filename)
                
        except Exception as e:
            print(f"❌ Error downloading from Pixabay: {e}")
            return self.create_fallback_image(filename)
        
        return False
    
    def create_fallback_image(self, filename):
        """Tạo hình ảnh fallback nếu không tải được từ Pixabay"""
        try:
            # Tạo hình ảnh gradient đơn giản
            img = Image.new('RGB', (640, 480), color=(70, 130, 180))
            draw = ImageDraw.Draw(img)
            
            # Vẽ gradient effect
            for i in range(480):
                color = int(70 + (i / 480) * 50)
                draw.line([(0, i), (640, i)], fill=(color, color + 20, 180))
            
            # Thêm text
            try:
                font = ImageFont.truetype("arial.ttf", 36)
            except:
                font = ImageFont.load_default()
            
            text = filename.replace('_', ' ').title()
            text_width = draw.textlength(text, font=font)
            text_x = (640 - text_width) // 2
            text_y = 200
            
            # Shadow effect
            draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0), font=font)
            draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)
            
            image_path = os.path.join(BACKEND_IMAGES_DIR, f"{filename}.jpg")
            img.save(image_path, 'JPEG', quality=85)
            
            print(f"✅ Created fallback image: {filename}.jpg")
            return True
            
        except Exception as e:
            print(f"❌ Error creating fallback image: {e}")
            return False
    
    def generate_audio(self, text, filename):
        """Tạo file audio từ text-to-speech"""
        try:
            audio_path = os.path.join(BACKEND_AUDIO_DIR, f"{filename}-intro.mp3")
            
            # Tạo TTS
            tts = gTTS(text=text, lang='en', slow=False)
            tts.save(audio_path)
            
            print(f"✅ Generated audio: {filename}-intro.mp3")
            return True
            
        except Exception as e:
            print(f"❌ Error generating audio for {filename}: {e}")
            return False
    
    def generate_all_media(self):
        """Tạo tất cả media files cho lessons"""
        print("🚀 Starting LeEnglish Lesson Media Generation...")
        print(f"📊 Total lessons to process: {len(LESSONS_DATA)}")
        print("-" * 60)
        
        success_count = 0
        total_count = len(LESSONS_DATA)
        
        for lesson in LESSONS_DATA:
            print(f"\n📝 Processing Lesson {lesson['id']}: {lesson['title']}")
            
            # Xóa file cũ nếu có
            self.remove_existing_files(lesson['filename'])
            
            # Tạo hình ảnh
            image_success = self.download_image_from_pixabay(
                lesson['keywords'], 
                lesson['filename']
            )
            
            # Tạo audio
            audio_success = self.generate_audio(
                lesson['text'], 
                lesson['filename']
            )
            
            if image_success and audio_success:
                success_count += 1
                print(f"✅ Lesson {lesson['id']} completed successfully!")
            else:
                print(f"⚠️  Lesson {lesson['id']} completed with errors")
            
            # Delay để tránh rate limiting
            time.sleep(1)
        
        print("\n" + "=" * 60)
        print(f"🎉 Generation Complete!")
        print(f"✅ Successfully processed: {success_count}/{total_count} lessons")
        print(f"📁 Files saved to:")
        print(f"   🖼️  Images: {BACKEND_IMAGES_DIR}")
        print(f"   🔊 Audio: {BACKEND_AUDIO_DIR}")
        
        # Hiển thị danh sách files đã tạo
        self.list_generated_files()
    
    def list_generated_files(self):
        """Liệt kê các files đã tạo"""
        print("\n📋 Generated Files:")
        
        print("\n🖼️  Images:")
        if os.path.exists(BACKEND_IMAGES_DIR):
            for file in sorted(os.listdir(BACKEND_IMAGES_DIR)):
                if file.endswith('.jpg'):
                    print(f"   ✓ {file}")
        
        print("\n🔊 Audio:")
        if os.path.exists(BACKEND_AUDIO_DIR):
            for file in sorted(os.listdir(BACKEND_AUDIO_DIR)):
                if file.endswith('.mp3'):
                    print(f"   ✓ {file}")

def main():
    """Main function"""
    generator = LessonMediaGenerator()
    generator.generate_all_media()

if __name__ == "__main__":
    main()
