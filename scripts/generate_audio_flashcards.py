# Tạo file audio mp3 có âm thanh thực cho từng từ bằng Python và gTTS
# Yêu cầu: Đã cài Python và pip install gtts pillow

from gtts import gTTS
from PIL import Image
import os

# Danh sách từ cần tạo audio (bạn có thể thay đổi hoặc tự động lấy từ database)
words = [
    "Apple", "Book", "Car", "Dog", "Go", "Eat", "Read", "Write", "Red", "Blue", "Green", "Yellow", "Banana", "Orange", "Grape", "Mango", "Cat", "Bird", "Fish", "Horse", "Meeting", "Deadline", "Contract", "Promotion", "Airport", "Passport", "Luggage", "Tourist", "Software", "Hardware", "Network", "Database", "Break a leg", "Hit the books", "Piece of cake", "Under the weather", "Arise", "Comprehend", "Negotiate", "Accomplish"
]

output_dir = r"c:\HK4\toeic3\leenglish-front\backend\src\main\resources\flashcards"
audio_dir = os.path.join(output_dir, "audio")
image_dir = os.path.join(output_dir, "image")
os.makedirs(audio_dir, exist_ok=True)
os.makedirs(image_dir, exist_ok=True)

import re

def normalize_filename(word):
    # Replace spaces with underscores and remove unsupported characters
    return re.sub(r'[^A-Za-z0-9_]', '', word.replace(' ', '_'))

for word in words:
    safe_word = normalize_filename(word)
    # Tạo file mp3
    tts = gTTS(text=word, lang='en')
    file_path = os.path.join(audio_dir, f"{safe_word}.mp3")
    tts.save(file_path)
    print(f"Đã tạo: {file_path}")
    # Tạo file jpg trắng
    img_path = os.path.join(image_dir, f"{safe_word}.jpg")
    img = Image.new('RGB', (100, 100), (255,255,255))
    img.save(img_path, 'JPEG')
    print(f"Đã tạo: {img_path}")
