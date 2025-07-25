import os
import sys
from pathlib import Path

# Đường dẫn cơ sở
BASE_DIR = Path.cwd()
AUDIO_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGES_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "images" / "exercises"
SQL_OUTPUT_FILE = BASE_DIR / "database" / "migrations" / "update_questions_auto.sql"

def get_existing_media_files():
    """Lấy danh sách các tệp âm thanh và hình ảnh hiện có"""
    audio_files = []
    if AUDIO_DIR.exists():
        audio_files = [f for f in os.listdir(AUDIO_DIR) if f.startswith("ex") and f.endswith(".mp3")]
        audio_files.sort(key=lambda x: int(x[2:-4]))  # Sắp xếp theo số (ex1, ex2, ...)
    
    image_files = []
    if IMAGES_DIR.exists():
        image_files = [f for f in os.listdir(IMAGES_DIR) if f.startswith("ex") and f.endswith(".jpg")]
        image_files.sort(key=lambda x: int(x[2:-4]))  # Sắp xếp theo số (ex1, ex2, ...)
    
    return audio_files, image_files

def generate_update_sql():
    """Tạo câu lệnh SQL để cập nhật questions dựa trên các tệp âm thanh và hình ảnh hiện có"""
    audio_files, image_files = get_existing_media_files()
    
    if not audio_files and not image_files:
        print("❌ Không tìm thấy tệp âm thanh hoặc hình ảnh nào.")
        return
    
    print(f"✅ Tìm thấy {len(audio_files)} tệp âm thanh và {len(image_files)} tệp hình ảnh.")
    
    # Tạo nội dung SQL
    sql_content = [
        "-- SQL Script tự động tạo để cập nhật bảng questions với đường dẫn audio_url và image_url",
        "-- Được tạo dựa trên các tệp âm thanh và hình ảnh hiện có trong thư mục static",
        "",
        "-- Đề xuất: Tạo bản sao lưu trước khi chạy script này",
        "-- CREATE TABLE questions_backup AS SELECT * FROM questions;",
        ""
    ]
    
    # Cập nhật cho từng câu hỏi
    current_ex = 0
    for exercise_id in range(1, 16):  # Giả sử chúng ta có tối đa 15 bài tập
        sql_content.append(f"-- Cập nhật cho Exercise {exercise_id}")
        
        for question_order in range(1, 7):  # Mỗi bài tập có 6 câu hỏi
            current_ex += 1
            audio_file = f"ex{current_ex}.mp3"
            image_file = f"ex{current_ex}.jpg"
            
            has_audio = audio_file in audio_files
            has_image = image_file in image_files
            
            if not has_audio and not has_image:
                sql_content.append(f"-- Bỏ qua ex{current_ex} - không tìm thấy tệp âm thanh hoặc hình ảnh")
                continue
            
            update_parts = []
            if has_audio:
                update_parts.append(f"audio_url = '/files/audio/exercises/{audio_file}'")
            if has_image:
                update_parts.append(f"image_url = '/files/images/exercises/{image_file}'")
            
            update_sql = f"UPDATE questions SET {', '.join(update_parts)} WHERE exercise_id = {exercise_id} AND question_order = {question_order};"
            sql_content.append(update_sql)
        
        sql_content.append("")  # Dòng trống giữa các bài tập
    
    # Ghi ra tệp SQL
    os.makedirs(os.path.dirname(SQL_OUTPUT_FILE), exist_ok=True)
    with open(SQL_OUTPUT_FILE, "w") as f:
        f.write("\n".join(sql_content))
    
    print(f"✅ Đã tạo tệp SQL: {SQL_OUTPUT_FILE}")

if __name__ == "__main__":
    generate_update_sql()
