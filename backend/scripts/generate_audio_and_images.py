import os
from gtts import gTTS
import requests
from PIL import Image
from io import BytesIO

# Danh sách từ vựng từ database flashcards - cập nhật đầy đủ từ SQL
vocabulary_data = [
    # Basic Nouns (Set 1)
    {"word": "apple", "audio": "audio/apple.mp3", "image": "images/apple.jpg"},
    {"word": "book", "audio": "audio/book.mp3", "image": "images/book.jpg"},
    {"word": "car", "audio": "audio/car.mp3", "image": "images/car.jpg"},
    {"word": "dog", "audio": "audio/dog.mp3", "image": "images/dog.jpg"},
    
    # Daily Verbs (Set 2)
    {"word": "go", "audio": "audio/go.mp3", "image": "images/go.jpg"},
    {"word": "eat", "audio": "audio/eat.mp3", "image": "images/eat.jpg"},
    {"word": "read", "audio": "audio/read.mp3", "image": "images/read.jpg"},
    {"word": "write", "audio": "audio/write.mp3", "image": "images/write.jpg"},
    
    # Colors (Set 3)
    {"word": "red", "audio": "audio/red.mp3", "image": "images/red.jpg"},
    {"word": "blue", "audio": "audio/blue.mp3", "image": "images/blue.jpg"},
    {"word": "green", "audio": "audio/green.mp3", "image": "images/green.jpg"},
    {"word": "yellow", "audio": "audio/yellow.mp3", "image": "images/yellow.jpg"},
    
    # Fruits (Set 4)
    {"word": "banana", "audio": "audio/banana.mp3", "image": "images/banana.jpg"},
    {"word": "orange", "audio": "audio/orange.mp3", "image": "images/orange.jpg"},
    {"word": "grape", "audio": "audio/grape.mp3", "image": "images/grape.jpg"},
    {"word": "mango", "audio": "audio/mango.mp3", "image": "images/mango.jpg"},
    
    # Animals (Set 5)
    {"word": "cat", "audio": "audio/cat.mp3", "image": "images/cat.jpg"},
    {"word": "bird", "audio": "audio/bird.mp3", "image": "images/bird.jpg"},
    {"word": "fish", "audio": "audio/fish.mp3", "image": "images/fish.jpg"},
    {"word": "horse", "audio": "audio/horse.mp3", "image": "images/horse.jpg"},
    
    # Business (Set 6)
    {"word": "meeting", "audio": "audio/meeting.mp3", "image": "images/meeting.jpg"},
    {"word": "deadline", "audio": "audio/deadline.mp3", "image": "images/deadline.jpg"},
    {"word": "contract", "audio": "audio/contract.mp3", "image": "images/contract.jpg"},
    {"word": "promotion", "audio": "audio/promotion.mp3", "image": "images/promotion.jpg"},
    
    # Travel (Set 7)
    {"word": "airport", "audio": "audio/airport.mp3", "image": "images/airport.jpg"},
    {"word": "passport", "audio": "audio/passport.mp3", "image": "images/passport.jpg"},
    {"word": "luggage", "audio": "audio/luggage.mp3", "image": "images/luggage.jpg"},
    {"word": "tourist", "audio": "audio/tourist.mp3", "image": "images/tourist.jpg"},
    
    # Technology (Set 8)
    {"word": "software", "audio": "audio/software.mp3", "image": "images/software.jpg"},
    {"word": "hardware", "audio": "audio/hardware.mp3", "image": "images/hardware.jpg"},
    {"word": "network", "audio": "audio/network.mp3", "image": "images/network.jpg"},
    {"word": "database", "audio": "audio/database.mp3", "image": "images/database.jpg"},
    
    # Idioms (Set 9) - use simplified words for images
    {"word": "break a leg", "audio": "audio/break_a_leg.mp3", "image": "images/break_a_leg.jpg", "image_search": "good luck"},
    {"word": "hit the books", "audio": "audio/hit_the_books.mp3", "image": "images/hit_the_books.jpg", "image_search": "study books"},
    {"word": "piece of cake", "audio": "audio/piece_of_cake.mp3", "image": "images/piece_of_cake.jpg", "image_search": "easy task"},
    {"word": "under the weather", "audio": "audio/under_the_weather.mp3", "image": "images/under_the_weather.jpg", "image_search": "sick person"},
    
    # Advanced Verbs (Set 10)
    {"word": "arise", "audio": "audio/arise.mp3", "image": "images/arise.jpg"},
    {"word": "comprehend", "audio": "audio/comprehend.mp3", "image": "images/comprehend.jpg", "image_search": "understand"},
    {"word": "negotiate", "audio": "audio/negotiate.mp3", "image": "images/negotiate.jpg"},
    {"word": "accomplish", "audio": "audio/accomplish.mp3", "image": "images/accomplish.jpg", "image_search": "achievement"},
]

# Pixabay API key của bạn
PIXABAY_API_KEY = "51114417-3aba4468c5fde7de5c683db54"

print("=== Bắt đầu tạo file audio và image cho flashcards ===")
print(f"Tổng số từ vựng cần xử lý: {len(vocabulary_data)}")

# Tạo file audio cho tất cả từ vựng
print("\n--- Tạo file audio ---")
for item in vocabulary_data:
    word = item["word"]
    audio_file = item["audio"]
    
    os.makedirs(os.path.dirname(audio_file), exist_ok=True)
    if not os.path.exists(audio_file):
        try:
            tts = gTTS(word, lang='en')
            tts.save(audio_file)
            print(f"✅ Created audio: {audio_file}")
        except Exception as e:
            print(f"❌ Failed to create audio for '{word}': {e}")
    else:
        print(f"⏭️  Audio exists, skip: {audio_file}")

# Tạo file image cho tất cả từ vựng sử dụng Pixabay
print("\n--- Tạo file image từ Pixabay ---")
for item in vocabulary_data:
    word = item["word"]
    image_file = item["image"]
    search_term = item.get("image_search", word)  # Sử dụng image_search nếu có, không thì dùng word
    
    if not image_file.lower().endswith('.jpg'):
        print(f"⏭️  Skip non-jpg image: {image_file}")
        continue
        
    os.makedirs(os.path.dirname(image_file), exist_ok=True)
    if not os.path.exists(image_file):
        # Sử dụng Pixabay API
        try:
            url_pixabay = f"https://pixabay.com/api/?key={PIXABAY_API_KEY}&q={search_term}&image_type=photo&per_page=5&safesearch=true&min_width=400&min_height=300"
            resp = requests.get(url_pixabay, timeout=15)
            data = resp.json()
            
            if data.get('hits') and len(data['hits']) > 0:
                # Lấy ảnh đầu tiên từ kết quả
                img_url = data['hits'][0]['webformatURL']
                print(f"📥 Downloading from Pixabay: {search_term} -> {image_file}")
                
                img_resp = requests.get(img_url, timeout=15)
                img = Image.open(BytesIO(img_resp.content))
                img = img.convert('RGB')  # Đảm bảo format RGB
                
                # Resize ảnh về kích thước chuẩn
                img = img.resize((512, 384), Image.Resampling.LANCZOS)
                img.save(image_file, 'JPEG', quality=85)
                print(f"✅ Downloaded image from Pixabay: {image_file}")
            else:
                print(f"⚠️  Pixabay: No image found for '{search_term}', creating blank image")
                # Tạo ảnh trắng với text
                img = Image.new('RGB', (512, 384), color='white')
                # Có thể thêm text vào ảnh trắng
                img.save(image_file, 'JPEG')
                print(f"🖼️  Created blank image: {image_file}")
                
        except Exception as e:
            print(f"❌ Pixabay failed for '{search_term}': {e}")
            # Tạo ảnh trắng làm fallback
            img = Image.new('RGB', (512, 384), color='white')
            img.save(image_file, 'JPEG')
            print(f"🖼️  Created fallback blank image: {image_file}")
    else:
        print(f"⏭️  Image exists, skip: {image_file}")

print(f"\n=== HOÀN THÀNH ===")
print(f"🎯 Đã xử lý {len(vocabulary_data)} từ vựng")
print(f"📁 Audio files trong: audio/")
print(f"🖼️  Image files trong: images/")
print(f"\n📋 Các bước tiếp theo:")
print(f"1️⃣  Chạy script SQL: update_flashcard_media.sql")
print(f"2️⃣  Restart backend server")
print(f"3️⃣  Test flashcards trên frontend")
print(f"4️⃣  Kiểm tra SecurityConfig đã mở endpoint /images/** và /audio/**")
