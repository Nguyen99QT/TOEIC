#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - COMPLETE Media Generator FINAL VERSION
Tạo media cho TẤT CẢ 90 exercises từ dữ liệu SQL mới nhất
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
    create_placeholder_image(save_path, query)
    return False

def create_placeholder_image(save_path, text):
    """Tạo hình ảnh placeholder khi không download được"""
    try:
        # Tạo hình ảnh 800x600 với background gradient
        img = Image.new('RGB', (800, 600), color='#f0f0f0')
        draw = ImageDraw.Draw(img)
        
        # Tạo gradient background
        for y in range(600):
            color_val = int(240 - (y * 40 / 600))
            color = (color_val, color_val + 10, color_val + 20)
            draw.line([(0, y), (800, y)], fill=color)
        
        # Thêm text
        try:
            font = ImageFont.truetype("arial.ttf", 36)
        except:
            font = ImageFont.load_default()
        
        # Tính toán vị trí text
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (800 - text_width) // 2
        y = (600 - text_height) // 2
        
        # Vẽ shadow
        draw.text((x+2, y+2), text, font=font, fill='#888888')
        # Vẽ text chính
        draw.text((x, y), text, font=font, fill='#333333')
        
        # Thêm border
        draw.rectangle([10, 10, 790, 590], outline='#cccccc', width=3)
        
        # Lưu hình ảnh
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        img.save(save_path, 'JPEG', quality=85)
        return True
    except Exception as e:
        print(f"❌ Lỗi tạo placeholder: {e}")
        return False

def generate_audio(text, save_path):
    """Tạo file audio từ text"""
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Kiểm tra file đã tồn tại và có kích thước hợp lý
        if os.path.exists(save_path):
            file_size = os.path.getsize(save_path)
            if file_size > 1000:  # File lớn hơn 1KB
                return True
            else:
                # Xóa file nhỏ/corrupt
                os.remove(save_path)
                print(f"  🗑️  Đã xóa file audio cũ: {save_path}")
        
        # Tạo audio mới
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(save_path)
        return True
    except Exception as e:
        print(f"❌ Lỗi tạo audio: {e}")
        return False

def generate_exercise_media():
    """Tạo media cho tất cả 90 exercises"""
    print("✏️ Tạo media cho 90 exercises...")
    
    # Danh sách 90 exercises từ SQL data
    exercises = [
        # Exercise 1-10
        {"id": 1, "name": "ex1", "title": "Greetings Exercise", "content": "Choose the correct greeting"},
        {"id": 2, "name": "ex2", "title": "Greeting Match", "content": "Match the greeting with language"},
        {"id": 3, "name": "ex3", "title": "Greeting Fill", "content": "Fill in the greeting blank"},
        {"id": 4, "name": "ex4", "title": "Numbers Exercise", "content": "Choose the correct number"},
        {"id": 5, "name": "ex5", "title": "Numbers Match", "content": "Match numbers with words"},
        {"id": 6, "name": "ex6", "title": "Numbers Fill", "content": "Fill in the number blank"},
        {"id": 7, "name": "ex7", "title": "Colors Exercise", "content": "Choose the correct color"},
        {"id": 8, "name": "ex8", "title": "Colors Match", "content": "Match colors with objects"},
        {"id": 9, "name": "ex9", "title": "Colors Fill", "content": "Fill in the color blank"},
        {"id": 10, "name": "ex10", "title": "Family Exercise", "content": "Choose correct family member"},
        
        # Exercise 11-20
        {"id": 11, "name": "ex11", "title": "Family Match", "content": "Match family members"},
        {"id": 12, "name": "ex12", "title": "Family Fill", "content": "Fill in family member"},
        {"id": 13, "name": "ex13", "title": "Food Exercise", "content": "Choose the correct food"},
        {"id": 14, "name": "ex14", "title": "Food Match", "content": "Match food with category"},
        {"id": 15, "name": "ex15", "title": "Food Fill", "content": "Fill in the food blank"},
        {"id": 16, "name": "ex16", "title": "Hobbies Exercise", "content": "Choose the correct hobby"},
        {"id": 17, "name": "ex17", "title": "Hobbies Match", "content": "Match hobbies with activities"},
        {"id": 18, "name": "ex18", "title": "Hobbies Fill", "content": "Fill in hobby blank"},
        {"id": 19, "name": "ex19", "title": "Travel Exercise", "content": "Choose travel destination"},
        {"id": 20, "name": "ex20", "title": "Travel Match", "content": "Match destination with country"},
        
        # Exercise 21-30
        {"id": 21, "name": "ex21", "title": "Travel Fill", "content": "Fill in travel destination"},
        {"id": 22, "name": "ex22", "title": "Work Exercise", "content": "Choose the correct job"},
        {"id": 23, "name": "ex23", "title": "Work Match", "content": "Match job with description"},
        {"id": 24, "name": "ex24", "title": "Work Fill", "content": "Fill in job title"},
        {"id": 25, "name": "ex25", "title": "Routine Exercise", "content": "Choose daily routine"},
        {"id": 26, "name": "ex26", "title": "Routine Match", "content": "Match routine with time"},
        {"id": 27, "name": "ex27", "title": "Routine Fill", "content": "Fill in routine activity"},
        {"id": 28, "name": "ex28", "title": "Weather Exercise", "content": "Choose weather description"},
        {"id": 29, "name": "ex29", "title": "Weather Match", "content": "Match weather with activity"},
        {"id": 30, "name": "ex30", "title": "Weather Fill", "content": "Fill in weather condition"},
        
        # Exercise 31-40
        {"id": 31, "name": "ex31", "title": "Sports Exercise", "content": "Choose the correct sport"},
        {"id": 32, "name": "ex32", "title": "Sports Match", "content": "Match sport with equipment"},
        {"id": 33, "name": "ex33", "title": "Sports Fill", "content": "Fill in sport name"},
        {"id": 34, "name": "ex34", "title": "Music Exercise", "content": "Choose music genre"},
        {"id": 35, "name": "ex35", "title": "Music Match", "content": "Match genre with description"},
        {"id": 36, "name": "ex36", "title": "Music Fill", "content": "Fill in music genre"},
        {"id": 37, "name": "ex37", "title": "Movies Exercise", "content": "Choose movie genre"},
        {"id": 38, "name": "ex38", "title": "Movies Match", "content": "Match movie with actor"},
        {"id": 39, "name": "ex39", "title": "Movies Fill", "content": "Fill in movie title"},
        {"id": 40, "name": "ex40", "title": "Books Exercise", "content": "Choose book genre"},
        
        # Exercise 41-50
        {"id": 41, "name": "ex41", "title": "Books Match", "content": "Match book with author"},
        {"id": 42, "name": "ex42", "title": "Books Fill", "content": "Fill in book genre"},
        {"id": 43, "name": "ex43", "title": "Art Exercise", "content": "Choose art style"},
        {"id": 44, "name": "ex44", "title": "Art Match", "content": "Match artwork with artist"},
        {"id": 45, "name": "ex45", "title": "Art Fill", "content": "Fill in art style"},
        {"id": 46, "name": "ex46", "title": "Nature Exercise", "content": "Choose nature element"},
        {"id": 47, "name": "ex47", "title": "Nature Match", "content": "Match element with description"},
        {"id": 48, "name": "ex48", "title": "Nature Fill", "content": "Fill in earth description"},
        {"id": 49, "name": "ex49", "title": "Technology Exercise", "content": "Choose correct technology"},
        {"id": 50, "name": "ex50", "title": "Technology Match", "content": "Match tech with function"},
        
        # Exercise 51-60
        {"id": 51, "name": "ex51", "title": "Technology Fill", "content": "Fill in technology device"},
        {"id": 52, "name": "ex52", "title": "Health Exercise", "content": "Choose health activity"},
        {"id": 53, "name": "ex53", "title": "Health Match", "content": "Match activity with benefit"},
        {"id": 54, "name": "ex54", "title": "Health Fill", "content": "Fill in health activity"},
        {"id": 55, "name": "ex55", "title": "Education Exercise", "content": "Choose education level"},
        {"id": 56, "name": "ex56", "title": "Education Match", "content": "Match level with description"},
        {"id": 57, "name": "ex57", "title": "Education Fill", "content": "Fill in education institution"},
        {"id": 58, "name": "ex58", "title": "Shopping Exercise", "content": "Choose shopping item"},
        {"id": 59, "name": "ex59", "title": "Shopping Match", "content": "Match item with category"},
        {"id": 60, "name": "ex60", "title": "Shopping Fill", "content": "Fill in grocery item"},
        
        # Exercise 61-70
        {"id": 61, "name": "ex61", "title": "Transportation Exercise", "content": "Choose correct transportation"},
        {"id": 62, "name": "ex62", "title": "Transportation Match", "content": "Match vehicle with description"},
        {"id": 63, "name": "ex63", "title": "Transportation Fill", "content": "Fill in transportation mode"},
        {"id": 64, "name": "ex64", "title": "Communication Exercise", "content": "Choose communication tool"},
        {"id": 65, "name": "ex65", "title": "Communication Match", "content": "Match tool with function"},
        {"id": 66, "name": "ex66", "title": "Communication Fill", "content": "Fill in communication device"},
        {"id": 67, "name": "ex67", "title": "Environment Exercise", "content": "Choose environment action"},
        {"id": 68, "name": "ex68", "title": "Environment Match", "content": "Match action with benefit"},
        {"id": 69, "name": "ex69", "title": "Environment Fill", "content": "Fill in environment action"},
        {"id": 70, "name": "ex70", "title": "Society Exercise", "content": "Choose society aspect"},
        
        # Exercise 71-80
        {"id": 71, "name": "ex71", "title": "Society Match", "content": "Match aspect with description"},
        {"id": 72, "name": "ex72", "title": "Society Fill", "content": "Fill in society value"},
        {"id": 73, "name": "ex73", "title": "Culture Exercise", "content": "Choose culture element"},
        {"id": 74, "name": "ex74", "title": "Culture Match", "content": "Match element with description"},
        {"id": 75, "name": "ex75", "title": "Culture Fill", "content": "Fill in favorite food"},
        {"id": 76, "name": "ex76", "title": "Vietnamese Language", "content": "Primary language in Vietnam"},
        {"id": 77, "name": "ex77", "title": "Indonesia Capital", "content": "Capital of Indonesia"},
        {"id": 78, "name": "ex78", "title": "Banh Mi Ingredient", "content": "Main ingredient in Banh Mi"},
        {"id": 79, "name": "ex79", "title": "Malaysia Capital", "content": "Capital of Malaysia"},
        {"id": 80, "name": "ex80", "title": "Scuba Gas", "content": "Primary gas in scuba tank"},
        
        # Exercise 81-90 (10 exercises mới)
        {"id": 81, "name": "ex81", "title": "Philippines Capital", "content": "Capital of the Philippines"},
        {"id": 82, "name": "ex82", "title": "Kimchi Ingredient", "content": "Main ingredient in Kimchi"},
        {"id": 83, "name": "ex83", "title": "Singapore Capital", "content": "Capital of Singapore"},
        {"id": 84, "name": "ex84", "title": "Singapore Language", "content": "Primary language in Singapore"},
        {"id": 85, "name": "ex85", "title": "Brunei Capital", "content": "Capital of Brunei"},
        {"id": 86, "name": "ex86", "title": "Laksa Ingredient", "content": "Main ingredient in Laksa"},
        {"id": 87, "name": "ex87", "title": "Myanmar Capital", "content": "Capital of Myanmar"},
        {"id": 88, "name": "ex88", "title": "Myanmar Language", "content": "Primary language in Myanmar"},
        {"id": 89, "name": "ex89", "title": "Cambodia Capital", "content": "Capital of Cambodia"},
        {"id": 90, "name": "ex90", "title": "Pho Ingredient", "content": "Main ingredient in Pho"}
    ]
    
    for i, exercise in enumerate(exercises, 1):
        print(f"  📝 Exercise {i}/90: {exercise['name']}")
        
        # Tạo audio
        audio_path = os.path.join(AUDIO_BASE, "exercises", f"{exercise['name']}.mp3")
        audio_text = f"{exercise['title']}. {exercise['content']}"
        
        if generate_audio(audio_text, audio_path):
            print(f"    🔊 Audio: ✅")
        else:
            print(f"    🔊 Audio: ❌")
        
        # Tạo image
        image_path = os.path.join(IMAGES_BASE, "exercises", f"{exercise['name']}.jpg")
        image_query = f"education quiz {exercise['title']} learning"
        
        if download_pixabay_image(image_query, image_path):
            print(f"    🖼️  Image: ✅")
        else:
            print(f"    🖼️  Image: ✅ (placeholder)")
        
        # Delay để tránh spam API
        time.sleep(0.2)

def generate_final_report():
    """Tạo báo cáo cuối cùng với số liệu chính xác"""
    print("📊 Tạo báo cáo cuối cùng...")
    
    # Đếm số file thực tế
    lessons_audio = len([f for f in os.listdir(os.path.join(AUDIO_BASE, "lessons")) if f.endswith('.mp3')]) if os.path.exists(os.path.join(AUDIO_BASE, "lessons")) else 0
    lessons_images = len([f for f in os.listdir(os.path.join(IMAGES_BASE, "lessons")) if f.endswith('.jpg')]) if os.path.exists(os.path.join(IMAGES_BASE, "lessons")) else 0
    
    exercises_audio = len([f for f in os.listdir(os.path.join(AUDIO_BASE, "exercises")) if f.endswith('.mp3')]) if os.path.exists(os.path.join(AUDIO_BASE, "exercises")) else 0
    exercises_images = len([f for f in os.listdir(os.path.join(IMAGES_BASE, "exercises")) if f.endswith('.jpg')]) if os.path.exists(os.path.join(IMAGES_BASE, "exercises")) else 0
    
    flashcards_audio = len([f for f in os.listdir(os.path.join(AUDIO_BASE, "flashcards")) if f.endswith('.mp3')]) if os.path.exists(os.path.join(AUDIO_BASE, "flashcards")) else 0
    flashcards_images = len([f for f in os.listdir(os.path.join(IMAGES_BASE, "flashcards")) if f.endswith('.jpg')]) if os.path.exists(os.path.join(IMAGES_BASE, "flashcards")) else 0
    
    report = {
        "generation_time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_files": lessons_audio + lessons_images + exercises_audio + exercises_images + flashcards_audio + flashcards_images,
        "breakdown": {
            "lessons": {
                "audio": lessons_audio,
                "images": lessons_images,
                "total": lessons_audio + lessons_images
            },
            "exercises": {
                "audio": exercises_audio,
                "images": exercises_images,
                "total": exercises_audio + exercises_images
            },
            "flashcards": {
                "audio": flashcards_audio,
                "images": flashcards_images,
                "total": flashcards_audio + flashcards_images
            }
        },
        "totals": {
            "audio_files": lessons_audio + exercises_audio + flashcards_audio,
            "image_files": lessons_images + exercises_images + flashcards_images,
            "all_files": lessons_audio + lessons_images + exercises_audio + exercises_images + flashcards_audio + flashcards_images
        }
    }
    
    # Lưu báo cáo
    with open("final_complete_media_generation_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    return report

def main():
    """Hàm chính"""
    print("🚀 LeEnglish TOEIC - FINAL COMPLETE Media Generator")
    print("=" * 60)
    print("🎯 Tạo media cho TẤT CẢ 90 exercises từ SQL data mới:")
    print("   ✏️  90 Exercises (bổ sung 10 exercises cuối)")
    print("=" * 60)
    
    # Tạo thư mục nếu chưa có
    os.makedirs(os.path.join(AUDIO_BASE, "exercises"), exist_ok=True)
    os.makedirs(os.path.join(IMAGES_BASE, "exercises"), exist_ok=True)
    
    # Tạo media cho exercises
    generate_exercise_media()
    
    # Tạo báo cáo cuối cùng
    report = generate_final_report()
    
    print("🎉 HOÀN THÀNH TẤT CẢ!")
    print("=" * 60)
    print("📊 TỔNG KẾT CUỐI CÙNG:")
    print(f"   📚 Lessons: {report['breakdown']['lessons']['audio']} audio + {report['breakdown']['lessons']['images']} images = {report['breakdown']['lessons']['total']}")
    print(f"   ✏️  Exercises: {report['breakdown']['exercises']['audio']} audio + {report['breakdown']['exercises']['images']} images = {report['breakdown']['exercises']['total']}")
    print(f"   🎴 Flashcards: {report['breakdown']['flashcards']['audio']} audio + {report['breakdown']['flashcards']['images']} images = {report['breakdown']['flashcards']['total']}")
    print(f"   🔊 Tổng Audio: {report['totals']['audio_files']} files")
    print(f"   🖼️  Tổng Images: {report['totals']['image_files']} files")
    print(f"   📁 TỔNG CỘNG: {report['totals']['all_files']} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
