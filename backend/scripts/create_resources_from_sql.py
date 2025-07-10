import re
import os
import sys
from pathlib import Path
from create_silent_mp3 import create_silent_mp3
from create_blank_jpg import create_blank_jpg

# Đường dẫn gốc resource backend
RESOURCE_ROOT = os.path.join(os.path.dirname(__file__), 'src', 'main', 'resources')

def slugify(text):
    # Chuyển text thành tên file hợp lệ
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    text = text.strip('_')
    return text + '.jpg'

def extract_urls(sql_path):
    with open(sql_path, encoding='utf-8') as f:
        sql = f.read()
    audio_urls = re.findall(r"audio_url\s*=\s*'([^']+\.mp3)'", sql)
    # Lấy mọi image_url, kể cả không phải file
    image_urls = re.findall(r"image_url\s*=\s*'([^']+)'", sql)
    return set(audio_urls), set(image_urls)

def ensure_file(rel_path, filetype):
    abs_path = os.path.join(RESOURCE_ROOT, rel_path.lstrip('/\\'))
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    if not os.path.exists(abs_path):
        if filetype == 'mp3':
            create_silent_mp3(abs_path, 1000)
        else:
            create_blank_jpg(abs_path)
        print(f"Created: {abs_path}")
    else:
        print(f"Exists: {abs_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_resources_from_sql.py <english7.sql>")
        sys.exit(1)
    sql_path = sys.argv[1]
    audio_urls, image_urls = extract_urls(sql_path)
    for url in audio_urls:
        ensure_file(url, 'mp3')
    for url in image_urls:
        # Nếu không phải file ảnh hợp lệ thì chuyển thành tên file .jpg
        if not re.search(r'\.(jpg|jpeg|png)$', url, re.IGNORECASE):
            file_name = slugify(url)
            print(f"[INFO] Converted '{url}' -> '{file_name}'")
            url = file_name
        ensure_file(url, 'jpg')
    print("Done!")
