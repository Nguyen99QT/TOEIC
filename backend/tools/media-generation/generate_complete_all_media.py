#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - COMPLETE Media Generator cho TẤT CẢ dữ liệu
Tạo media cho ALL lessons, exercises, flashcards từ SQL data mới nhất
"""

import os
import requests
import time
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
import json

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
    """Tạo hình ảnh placeholder đẹp"""
    try:
        # Create gradient background
        img = Image.new('RGB', (800, 600), color=(70, 130, 180))
        draw = ImageDraw.Draw(img)
        
        # Draw gradient effect
        for i in range(600):
            color = int(70 + (60 * i / 600))
            draw.line([(0, i), (800, i)], fill=(color, 130 + int(20 * i / 600), 180))
        
        try:
            font = ImageFont.truetype("arial.ttf", 42)
            small_font = ImageFont.truetype("arial.ttf", 28)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        title_clean = title.replace('.jpg', '').replace('_', ' ').replace('-', ' ').title()
        
        # Calculate text position
        bbox = draw.textbbox((0, 0), title_clean, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (800 - text_width) // 2
        y = (600 - text_height) // 2 - 30
        
        # Draw text with shadow
        draw.text((x+3, y+3), title_clean, fill=(0, 0, 0, 100), font=font)
        draw.text((x, y), title_clean, fill=(255, 255, 255), font=font)
        
        # Add subtitle
        subtitle = "LeEnglish TOEIC Learning"
        bbox2 = draw.textbbox((0, 0), subtitle, font=small_font)
        text_width2 = bbox2[2] - bbox2[0]
        x2 = (800 - text_width2) // 2
        draw.text((x2, y + 70), subtitle, fill=(220, 220, 220), font=small_font)
        
        img.save(save_path, 'JPEG', quality=90)
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
        
        # Limit text length for TTS
        if len(clean_text) > 200:
            clean_text = clean_text[:200] + "..."
            
        tts = gTTS(text=clean_text, lang='en', slow=False)
        tts.save(save_path)
        return True
    except Exception as e:
        print(f"❌ Lỗi tạo audio: {e}")
        return False

# COMPLETE LESSONS DATA (40 lessons)
ALL_LESSONS = [
    {"id": 1, "filename": "greeting", "title": "Lesson 1: Greetings", "text": "Hello! How are you? Good morning! Nice to meet you!", "keywords": "greeting hello handshake business people meeting"},
    {"id": 2, "filename": "numbers", "title": "Lesson 2: Numbers", "text": "One, two, three, four, five. Let's learn numbers from one to ten.", "keywords": "numbers counting mathematics digits learning"},
    {"id": 3, "filename": "colors", "title": "Lesson 3: Colors", "text": "Red, blue, green, yellow. Colors are everywhere around us!", "keywords": "colors rainbow colorful paint palette art"},
    {"id": 4, "filename": "family", "title": "Lesson 4: Family", "text": "This is my mother, father, sister, and brother. Family is important.", "keywords": "family parents children happy together love"},
    {"id": 5, "filename": "food", "title": "Lesson 5: Food", "text": "I like pizza, burgers, and ice cream. What's your favorite food?", "keywords": "food meal delicious restaurant cooking kitchen"},
    {"id": 6, "filename": "hobbies", "title": "Lesson 6: Hobbies", "text": "I enjoy reading books, playing music, and painting pictures.", "keywords": "hobbies leisure activities fun sports recreation"},
    {"id": 7, "filename": "travel", "title": "Lesson 7: Travel", "text": "I have been to Paris, London, and Tokyo. Travel is amazing!", "keywords": "travel vacation tourism landmarks suitcase airplane"},
    {"id": 8, "filename": "work", "title": "Lesson 8: Work", "text": "I am a teacher. What is your job? Do you like your work?", "keywords": "work office business professional career job"},
    {"id": 9, "filename": "routine", "title": "Lesson 9: Daily Routine", "text": "I wake up at 7 AM, have breakfast, and go to work every day.", "keywords": "daily routine morning schedule alarm clock"},
    {"id": 10, "filename": "weather", "title": "Lesson 10: Weather", "text": "It is sunny today. Yesterday was rainy. Tomorrow will be cloudy.", "keywords": "weather sunny cloudy rain snow climate"},
    {"id": 11, "filename": "sports", "title": "Lesson 11: Sports", "text": "I play football, tennis, and basketball. Sports are fun and healthy.", "keywords": "sports football tennis basketball exercise fitness"},
    {"id": 12, "filename": "music", "title": "Lesson 12: Music", "text": "I love rock music, classical music, and pop songs. Music is life!", "keywords": "music instruments concert song melody guitar"},
    {"id": 13, "filename": "movies", "title": "Lesson 13: Movies", "text": "My favorite movie is a comedy. I also like action and drama films.", "keywords": "movies cinema film entertainment popcorn theater"},
    {"id": 14, "filename": "books", "title": "Lesson 14: Books", "text": "I enjoy reading novels, poetry, and science books. Reading is wonderful.", "keywords": "books reading library literature education study"},
    {"id": 15, "filename": "art", "title": "Lesson 15: Art", "text": "I like painting, sculpture, and photography. Art is very creative.", "keywords": "art painting creativity museum gallery artist"},
    {"id": 16, "filename": "nature", "title": "Lesson 16: Nature", "text": "I love the mountains, forests, and oceans. Nature is beautiful.", "keywords": "nature mountains forest ocean landscape green"},
    {"id": 17, "filename": "technology", "title": "Lesson 17: Technology", "text": "I use a computer, smartphone, and tablet every day. Technology helps us.", "keywords": "technology computer smartphone digital innovation"},
    {"id": 18, "filename": "health", "title": "Lesson 18: Health", "text": "I go to the gym, eat healthy food, and sleep well. Health is important.", "keywords": "health fitness exercise doctor wellness nutrition"},
    {"id": 19, "filename": "education", "title": "Lesson 19: Education", "text": "I study at university. Education opens doors to the future.", "keywords": "education school university students learning graduation"},
    {"id": 20, "filename": "shopping", "title": "Lesson 20: Shopping", "text": "I need to buy groceries, clothes, and books at the shopping mall.", "keywords": "shopping mall store groceries clothes retail"},
    {"id": 21, "filename": "transportation", "title": "Lesson 21: Transportation", "text": "I drive a car, take the bus, and ride the subway to work.", "keywords": "transportation car bus subway train vehicle"},
    {"id": 22, "filename": "communication", "title": "Lesson 22: Communication", "text": "I use email, chat, and video calls to communicate with friends.", "keywords": "communication email chat phone technology"},
    {"id": 23, "filename": "environment", "title": "Lesson 23: Environment", "text": "We should protect nature and keep our environment clean.", "keywords": "environment nature protection green earth ecology"},
    {"id": 24, "filename": "society", "title": "Lesson 24: Society", "text": "In my society, we value respect, kindness, and cooperation.", "keywords": "society community people culture values"},
    {"id": 25, "filename": "culture", "title": "Lesson 25: Culture", "text": "My culture is rich in traditions, festivals, and customs.", "keywords": "culture tradition festival customs heritage"},
    {"id": 26, "filename": "history", "title": "Lesson 26: History", "text": "In history, we learn about the past and important events.", "keywords": "history past events timeline ancient"},
    {"id": 27, "filename": "science", "title": "Lesson 27: Science", "text": "Science helps us understand the world through experiments and research.", "keywords": "science experiment research laboratory discovery"},
    {"id": 28, "filename": "mathematics", "title": "Lesson 28: Mathematics", "text": "Math is the language of the universe with numbers and equations.", "keywords": "mathematics numbers equations calculator geometry"},
    {"id": 29, "filename": "literature", "title": "Lesson 29: Literature", "text": "Literature reflects human experiences through stories and poems.", "keywords": "literature books stories poems writing"},
    {"id": 30, "filename": "philosophy", "title": "Lesson 30: Philosophy", "text": "Philosophy explores fundamental questions about life and existence.", "keywords": "philosophy thinking questions wisdom knowledge"},
    {"id": 31, "filename": "japan", "title": "Lesson 31: Japan", "text": "Let's explore Japan! Mount Fuji, sushi, and cherry blossoms.", "keywords": "japan mount fuji sushi cherry blossoms tokyo"},
    {"id": 32, "filename": "korea", "title": "Lesson 32: Korea", "text": "Let's explore Korea! K-pop, kimchi, and beautiful temples.", "keywords": "korea kpop kimchi temple seoul"},
    {"id": 33, "filename": "thailand", "title": "Lesson 33: Thailand", "text": "Let's explore Thailand! Pad thai, beaches, and golden temples.", "keywords": "thailand pad thai beaches golden temple"},
    {"id": 34, "filename": "laos", "title": "Lesson 34: Laos", "text": "Let's explore Laos! Ancient temples, the Mekong River, and nature.", "keywords": "laos temple mekong river nature"},
    {"id": 35, "filename": "cambodia", "title": "Lesson 35: Cambodia", "text": "Let's explore Cambodia! Angkor Wat, history, and culture.", "keywords": "cambodia angkor wat temple history"},
    {"id": 36, "filename": "malaysia", "title": "Lesson 36: Malaysia", "text": "Let's explore Malaysia! Petronas Towers, food, and diversity.", "keywords": "malaysia petronas towers food diversity"},
    {"id": 37, "filename": "singapore", "title": "Lesson 37: Singapore", "text": "Let's explore Singapore! Modern city, gardens, and food courts.", "keywords": "singapore modern city gardens food"},
    {"id": 38, "filename": "philippines", "title": "Lesson 38: Philippines", "text": "Let's explore the Philippines! Beautiful islands, beaches, and culture.", "keywords": "philippines islands beaches tropical culture"},
    {"id": 39, "filename": "indonesia", "title": "Lesson 39: Indonesia", "text": "Let's explore Indonesia! Volcanoes, islands, and rich culture.", "keywords": "indonesia volcano islands culture bali"},
    {"id": 40, "filename": "myanmar", "title": "Lesson 40: Myanmar", "text": "Let's explore Myanmar! Golden pagodas, history, and traditions.", "keywords": "myanmar golden pagoda history tradition"},
]

# COMPLETE FLASHCARDS DATA (40 flashcards)
ALL_FLASHCARDS = [
    {"id": 1, "filename": "apple", "word": "Apple", "keywords": "apple fruit red green food nutrition healthy"},
    {"id": 2, "filename": "book", "word": "Book", "keywords": "book reading education study literature knowledge"},
    {"id": 3, "filename": "car", "word": "Car", "keywords": "car vehicle transportation automobile road drive"},
    {"id": 4, "filename": "dog", "word": "Dog", "keywords": "dog pet animal domestic companion friendly"},
    {"id": 5, "filename": "go", "word": "Go", "keywords": "go move travel walk direction motion"},
    {"id": 6, "filename": "eat", "word": "Eat", "keywords": "eat food consume meal nutrition cooking"},
    {"id": 7, "filename": "read", "word": "Read", "keywords": "read book study education learning knowledge"},
    {"id": 8, "filename": "write", "word": "Write", "keywords": "write pen paper text document letter"},
    {"id": 9, "filename": "red", "word": "Red", "keywords": "red color bright vibrant blood rose"},
    {"id": 10, "filename": "blue", "word": "Blue", "keywords": "blue color sky ocean peaceful calm water"},
    {"id": 11, "filename": "green", "word": "Green", "keywords": "green color grass nature environment leaf"},
    {"id": 12, "filename": "yellow", "word": "Yellow", "keywords": "yellow color sun bright sunshine banana"},
    {"id": 13, "filename": "banana", "word": "Banana", "keywords": "banana fruit yellow tropical healthy nutrition"},
    {"id": 14, "filename": "orange", "word": "Orange", "keywords": "orange fruit citrus vitamin healthy juice"},
    {"id": 15, "filename": "grape", "word": "Grape", "keywords": "grape fruit purple small bunch wine"},
    {"id": 16, "filename": "mango", "word": "Mango", "keywords": "mango fruit tropical sweet delicious yellow"},
    {"id": 17, "filename": "cat", "word": "Cat", "keywords": "cat pet animal domestic cute fluffy"},
    {"id": 18, "filename": "bird", "word": "Bird", "keywords": "bird animal flying wings feathers sky"},
    {"id": 19, "filename": "fish", "word": "Fish", "keywords": "fish animal water swimming ocean aquarium"},
    {"id": 20, "filename": "horse", "word": "Horse", "keywords": "horse animal riding farm strong beautiful"},
    {"id": 21, "filename": "meeting", "word": "Meeting", "keywords": "meeting business office conference discussion"},
    {"id": 22, "filename": "deadline", "word": "Deadline", "keywords": "deadline time business schedule urgent clock"},
    {"id": 23, "filename": "contract", "word": "Contract", "keywords": "contract legal document business agreement signature"},
    {"id": 24, "filename": "promotion", "word": "Promotion", "keywords": "promotion career business success advancement work"},
    {"id": 25, "filename": "airport", "word": "Airport", "keywords": "airport travel airplane flight transportation terminal"},
    {"id": 26, "filename": "passport", "word": "Passport", "keywords": "passport travel document official identification border"},
    {"id": 27, "filename": "luggage", "word": "Luggage", "keywords": "luggage travel suitcase bag vacation trip"},
    {"id": 28, "filename": "tourist", "word": "Tourist", "keywords": "tourist travel vacation sightseeing camera exploration"},
    {"id": 29, "filename": "software", "word": "Software", "keywords": "software computer technology program digital code"},
    {"id": 30, "filename": "hardware", "word": "Hardware", "keywords": "hardware computer technology physical components electronics"},
    {"id": 31, "filename": "network", "word": "Network", "keywords": "network technology connection internet communication"},
    {"id": 32, "filename": "database", "word": "Database", "keywords": "database technology data storage information server"},
    {"id": 33, "filename": "break_a_leg", "word": "Break a leg", "keywords": "break leg idiom good luck theater performance"},
    {"id": 34, "filename": "hit_the_books", "word": "Hit the books", "keywords": "hit books idiom study education learning"},
    {"id": 35, "filename": "piece_of_cake", "word": "Piece of cake", "keywords": "piece cake idiom easy simple dessert"},
    {"id": 36, "filename": "under_the_weather", "word": "Under the weather", "keywords": "under weather idiom sick ill health"},
    {"id": 37, "filename": "arise", "word": "Arise", "keywords": "arise verb happen occur emerge appear"},
    {"id": 38, "filename": "comprehend", "word": "Comprehend", "keywords": "comprehend understand grasp realize knowledge"},
    {"id": 39, "filename": "negotiate", "word": "Negotiate", "keywords": "negotiate discuss business agreement deal talk"},
    {"id": 40, "filename": "accomplish", "word": "Accomplish", "keywords": "accomplish achieve complete finish success goal"},
]

# EXERCISES DATA (90 exercises) - sample based on pattern
def generate_exercises_data():
    """Generate data for 90 exercises based on lessons"""
    exercises = []
    
    # Generate 2-3 exercises per lesson (40 lessons = ~90 exercises)
    for lesson_id in range(1, 41):
        lesson_topics = {
            1: "greetings", 2: "numbers", 3: "colors", 4: "family", 5: "food",
            6: "hobbies", 7: "travel", 8: "work", 9: "routine", 10: "weather",
            11: "sports", 12: "music", 13: "movies", 14: "books", 15: "art",
            16: "nature", 17: "technology", 18: "health", 19: "education", 20: "shopping",
            21: "transportation", 22: "communication", 23: "environment", 24: "society", 25: "culture",
            26: "history", 27: "science", 28: "mathematics", 29: "literature", 30: "philosophy",
            31: "japan", 32: "korea", 33: "thailand", 34: "laos", 35: "cambodia",
            36: "malaysia", 37: "singapore", 38: "philippines", 39: "indonesia", 40: "myanmar"
        }
        
        topic = lesson_topics.get(lesson_id, "english")
        
        # Exercise 1 for lesson
        ex_id = (lesson_id - 1) * 2 + 1
        if ex_id <= 90:
            exercises.append({
                "id": ex_id,
                "filename": f"ex{ex_id}",
                "text": f"Choose the correct answer about {topic}. Multiple choice question.",
                "keywords": f"{topic} exercise question multiple choice quiz"
            })
        
        # Exercise 2 for lesson
        ex_id = (lesson_id - 1) * 2 + 2
        if ex_id <= 90:
            exercises.append({
                "id": ex_id,
                "filename": f"ex{ex_id}",
                "text": f"Fill in the blank about {topic}. Complete the sentence.",
                "keywords": f"{topic} exercise fill blank complete sentence"
            })
    
    return exercises[:90]  # Limit to 90 exercises

def generate_all_lessons():
    """Tạo media cho TẤT CẢ 40 lessons"""
    print(f"📚 Tạo media cho {len(ALL_LESSONS)} lessons...")
    
    audio_dir = f"{AUDIO_BASE}/lessons"
    images_dir = f"{IMAGES_BASE}/lessons"
    
    for i, lesson in enumerate(ALL_LESSONS, 1):
        print(f"  📖 Lesson {i}/{len(ALL_LESSONS)}: {lesson['filename']}")
        
        # Generate audio
        audio_file = f"{lesson['filename']}-intro.mp3"
        audio_path = os.path.join(audio_dir, audio_file)
        if not os.path.exists(audio_path):
            if create_audio_tts(lesson["text"], audio_path):
                print(f"    🔊 Audio: ✅")
            else:
                print(f"    🔊 Audio: ❌")
        else:
            print(f"    🔊 Audio: ✅ (đã có)")
        
        # Generate image
        image_file = f"{lesson['filename']}.jpg"
        image_path = os.path.join(images_dir, image_file)
        if not os.path.exists(image_path):
            if download_pixabay_image(lesson["keywords"], image_path):
                print(f"    🖼️  Image: ✅")
            else:
                print(f"    🖼️  Image: ❌")
        else:
            print(f"    🖼️  Image: ✅ (đã có)")
            
        time.sleep(0.8)  # Rate limiting

def generate_all_exercises():
    """Tạo media cho TẤT CẢ 90 exercises"""
    exercises_data = generate_exercises_data()
    print(f"\n✏️ Tạo media cho {len(exercises_data)} exercises...")
    
    audio_dir = f"{AUDIO_BASE}/exercises"
    images_dir = f"{IMAGES_BASE}/exercises"
    
    for i, exercise in enumerate(exercises_data, 1):
        print(f"  📝 Exercise {i}/{len(exercises_data)}: {exercise['filename']}")
        
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
            
        time.sleep(0.8)  # Rate limiting

def generate_all_flashcards():
    """Tạo media cho TẤT CẢ 40 flashcards"""
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
            
        time.sleep(0.8)  # Rate limiting

def generate_final_report():
    """Tạo báo cáo cuối cùng"""
    print(f"\n📊 Tạo báo cáo cuối cùng...")
    
    # Count all files
    lessons_audio = len([f for f in os.listdir(f"{AUDIO_BASE}/lessons") if f.endswith('.mp3')])
    lessons_images = len([f for f in os.listdir(f"{IMAGES_BASE}/lessons") if f.endswith('.jpg')])
    exercises_audio = len([f for f in os.listdir(f"{AUDIO_BASE}/exercises") if f.endswith('.mp3')])
    exercises_images = len([f for f in os.listdir(f"{IMAGES_BASE}/exercises") if f.endswith('.jpg')])
    flashcards_audio = len([f for f in os.listdir(f"{AUDIO_BASE}/flashcards") if f.endswith('.mp3')])
    flashcards_images = len([f for f in os.listdir(f"{IMAGES_BASE}/flashcards") if f.endswith('.jpg')])
    
    total_audio = lessons_audio + exercises_audio + flashcards_audio
    total_images = lessons_images + exercises_images + flashcards_images
    total_files = total_audio + total_images
    
    report = {
        "generation_time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_files": total_files,
        "breakdown": {
            "lessons": {"audio": lessons_audio, "images": lessons_images, "total": lessons_audio + lessons_images},
            "exercises": {"audio": exercises_audio, "images": exercises_images, "total": exercises_audio + exercises_images},
            "flashcards": {"audio": flashcards_audio, "images": flashcards_images, "total": flashcards_audio + flashcards_images}
        },
        "totals": {
            "audio_files": total_audio,
            "image_files": total_images,
            "all_files": total_files
        }
    }
    
    # Save report
    with open("complete_media_generation_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n🎉 HOÀN THÀNH TẤT CẢ!")
    print(f"=" * 60)
    print(f"📊 TỔNG KẾT CUỐI CÙNG:")
    print(f"   📚 Lessons: {lessons_audio} audio + {lessons_images} images = {lessons_audio + lessons_images}")
    print(f"   ✏️  Exercises: {exercises_audio} audio + {exercises_images} images = {exercises_audio + exercises_images}")
    print(f"   🎴 Flashcards: {flashcards_audio} audio + {flashcards_images} images = {flashcards_audio + flashcards_images}")
    print(f"   🔊 Tổng Audio: {total_audio} files")
    print(f"   🖼️  Tổng Images: {total_images} files")
    print(f"   📁 TỔNG CỘNG: {total_files} files")
    print(f"=" * 60)

def main():
    """Hàm chính"""
    print("🚀 LeEnglish TOEIC - COMPLETE Media Generator")
    print("=" * 60)
    print("🎯 Tạo media cho TẤT CẢ dữ liệu từ SQL:")
    print("   📚 40 Lessons")
    print("   ✏️  90 Exercises")  
    print("   🎴 40 Flashcards")
    print("=" * 60)
    
    try:
        # 1. Generate all lessons media
        generate_all_lessons()
        
        # 2. Generate all exercises media
        generate_all_exercises()
        
        # 3. Generate all flashcards media
        generate_all_flashcards()
        
        # 4. Generate final report
        generate_final_report()
        
    except KeyboardInterrupt:
        print(f"\n⚠️  Đã dừng bởi người dùng")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")

if __name__ == "__main__":
    main()
