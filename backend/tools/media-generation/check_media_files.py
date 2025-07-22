import os
import re
import sys
import sqlite3
from pathlib import Path
from typing import List, Tuple, Optional, Any, Dict, Union
import mysql.connector
from mysql.connector import Error, MySQLConnection

# Đường dẫn cơ sở
BASE_DIR = Path.cwd()
AUDIO_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGES_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "images" / "exercises"

# Database connection parameters
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "toeic8",
    "charset": "utf8mb4"
}

def check_database_connection():
    """Kiểm tra kết nối cơ sở dữ liệu"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Đã kết nối tới cơ sở dữ liệu MySQL")
            return connection
        else:
            print("❌ Không thể kết nối tới cơ sở dữ liệu MySQL")
            return None
    except Error as e:
        print(f"❌ Lỗi kết nối tới cơ sở dữ liệu MySQL: {e}")
        return None

def get_media_paths_from_database(connection):
    """Lấy đường dẫn media từ cơ sở dữ liệu"""
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Truy vấn để lấy tất cả các giá trị audio_url và image_url
        query = """
        SELECT id, question_text, audio_url, image_url 
        FROM questions 
        WHERE audio_url IS NOT NULL OR image_url IS NOT NULL
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        audio_paths = []
        image_paths = []
        
        for row in results:
            if row["audio_url"]:
                # Trích xuất tên tệp từ đường dẫn
                match = re.search(r'/files/audio/exercises/([^"\']+)', row["audio_url"])
                if match:
                    audio_paths.append((row["id"], match.group(1), row["question_text"]))
            
            if row["image_url"]:
                # Trích xuất tên tệp từ đường dẫn
                match = re.search(r'/files/images/exercises/([^"\']+)', row["image_url"])
                if match:
                    image_paths.append((row["id"], match.group(1), row["question_text"]))
        
        cursor.close()
        return audio_paths, image_paths
    
    except Error as e:
        print(f"❌ Lỗi thực thi truy vấn: {e}")
        return [], []

def check_files_exist():
    """Kiểm tra xem tất cả các tệp ex1.mp3, ex1.jpg, v.v. có tồn tại không"""
    print("\n🔍 Kiểm tra tệp âm thanh và hình ảnh exN.mp3/jpg...")
    
    # Kiểm tra các tệp âm thanh
    missing_audio = []
    existing_audio = []
    for i in range(1, 91):  # Giả sử chúng ta có tối đa 90 tệp
        audio_file = AUDIO_DIR / f"ex{i}.mp3"
        if not audio_file.exists():
            missing_audio.append(f"ex{i}.mp3")
        else:
            existing_audio.append(f"ex{i}.mp3")
    
    # Kiểm tra các tệp hình ảnh
    missing_images = []
    existing_images = []
    for i in range(1, 91):  # Giả sử chúng ta có tối đa 90 tệp
        image_file = IMAGES_DIR / f"ex{i}.jpg"
        if not image_file.exists():
            missing_images.append(f"ex{i}.jpg")
        else:
            existing_images.append(f"ex{i}.jpg")
    
    # Báo cáo kết quả
    if missing_audio:
        print(f"❌ Thiếu {len(missing_audio)} tệp âm thanh:")
        for file in missing_audio:
            print(f"  - {file}")
    else:
        print("✅ Tất cả các tệp âm thanh exN.mp3 đều tồn tại.")
        
    if missing_images:
        print(f"\n❌ Thiếu {len(missing_images)} tệp hình ảnh:")
        for file in missing_images:
            print(f"  - {file}")
    else:
        print("✅ Tất cả các tệp hình ảnh exN.jpg đều tồn tại.")
        
    print(f"\n✅ Tìm thấy {len(existing_audio)} tệp âm thanh và {len(existing_images)} tệp hình ảnh.")
    
    # Trả về số lượng tệp bị thiếu
    return len(missing_audio) + len(missing_images)

def check_database_media_paths():
    """Kiểm tra tất cả các đường dẫn media trong cơ sở dữ liệu"""
    print("\n🔍 Kiểm tra đường dẫn media trong cơ sở dữ liệu...")
    
    # Kết nối cơ sở dữ liệu
    connection = check_database_connection()
    if not connection:
        return 1
    
    try:
        # Lấy đường dẫn media từ cơ sở dữ liệu
        audio_paths, image_paths = get_media_paths_from_database(connection)
        
        print(f"\n📊 Tìm thấy {len(audio_paths)} tham chiếu âm thanh và {len(image_paths)} tham chiếu hình ảnh trong cơ sở dữ liệu")
        
        # Kiểm tra xem các tệp có tồn tại không
        missing_audio = []
        for id, filename, question_text in audio_paths:
            audio_file = AUDIO_DIR / filename
            if not audio_file.exists():
                missing_audio.append((id, filename, question_text))
        
        missing_images = []
        for id, filename, question_text in image_paths:
            image_file = IMAGES_DIR / filename
            if not image_file.exists():
                missing_images.append((id, filename, question_text))
        
        # In kết quả
        if missing_audio:
            print(f"\n❌ Thiếu {len(missing_audio)} tệp âm thanh từ cơ sở dữ liệu:")
            for id, filename, question_text in missing_audio:
                print(f"  - ID: {id}, Tệp: {filename}, Câu hỏi: {question_text[:50]}...")
        else:
            print("\n✅ Tất cả các tệp âm thanh tham chiếu trong cơ sở dữ liệu đều tồn tại")
        
        if missing_images:
            print(f"\n❌ Thiếu {len(missing_images)} tệp hình ảnh từ cơ sở dữ liệu:")
            for id, filename, question_text in missing_images:
                print(f"  - ID: {id}, Tệp: {filename}, Câu hỏi: {question_text[:50]}...")
        else:
            print("\n✅ Tất cả các tệp hình ảnh tham chiếu trong cơ sở dữ liệu đều tồn tại")
        
        # Tổng hợp
        if not missing_audio and not missing_images:
            print("\n✅ Tất cả các tệp media đều tồn tại. Không tìm thấy vấn đề!")
        else:
            print(f"\n❌ Tìm thấy tổng cộng {len(missing_audio) + len(missing_images)} tệp bị thiếu")
        
        return len(missing_audio) + len(missing_images)
            
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return 1
    
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("\nĐã đóng kết nối cơ sở dữ liệu")

def main():
    """Hàm chính để kiểm tra tất cả các tệp media"""
    print("=" * 60)
    print("KIỂM TRA TỆP MEDIA TOEIC")
    print("=" * 60)
    
    # Kiểm tra các tệp exN.mp3/jpg có tồn tại không
    missing_files = check_files_exist()
    
    # Kiểm tra các đường dẫn trong cơ sở dữ liệu
    missing_db_files = check_database_media_paths()
    
    # Tổng hợp kết quả
    if missing_files == 0 and missing_db_files == 0:
        print("\n✅ Tất cả các kiểm tra đều thành công! Không có vấn đề với tệp media.")
        return 0
    else:
        print(f"\n❌ Tìm thấy các vấn đề với tệp media. Vui lòng xem chi tiết ở trên.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
