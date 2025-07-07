#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - Audio Files Checker & Cleaner
Kiểm tra và xóa các file âm thanh bị lỗi hoặc không phát được
"""

import os
import mutagen
from mutagen.mp3 import MP3
import json
from datetime import datetime

AUDIO_BASE = "src/main/resources/static"
AUDIO_ORGANIZED_FOLDERS = ["audio/flashcards", "audio/exercises", "audio/lessons"]

def should_keep_file(file_path, audio_base):
    """Kiểm tra xem file có nên giữ lại không (trong thư mục organized)"""
    relative_path = os.path.relpath(file_path, audio_base)
    
    # Giữ lại file trong các thư mục đã tổ chức
    for folder in AUDIO_ORGANIZED_FOLDERS:
        if relative_path.startswith(folder):
            return True
    
    return False

def check_audio_file(file_path):
    """Kiểm tra file âm thanh có hợp lệ không"""
    try:
        # Kiểm tra kích thước file
        file_size = os.path.getsize(file_path)
        if file_size < 1000:  # File nhỏ hơn 1KB chắc chắn bị lỗi
            return False, f"File quá nhỏ: {file_size} bytes"
        
        # Kiểm tra header MP3
        audio = MP3(file_path)
        duration = audio.info.length
        
        if duration < 0.1:  # Âm thanh ngắn hơn 0.1 giây có thể bị lỗi
            return False, f"Âm thanh quá ngắn: {duration:.2f}s"
        
        return True, f"OK - Duration: {duration:.2f}s, Size: {file_size} bytes"
        
    except Exception as e:
        return False, f"Lỗi đọc file: {str(e)}"

def scan_and_clean_audio():
    """Quét và làm sạch các file âm thanh bị lỗi"""
    print("🔍 LeEnglish TOEIC - Audio Files Checker & Cleaner")
    print("🗑️  Xóa file âm thanh lỗi và không cần thiết")
    print("✅ Giữ lại file trong: flashcards, exercises, lessons")
    print("=" * 60)
    
    report = {
        "scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_files": 0,
        "valid_files": 0,
        "invalid_files": 0,
        "deleted_files": 0,
        "kept_organized": 0,
        "deleted_unorganized": 0,
        "issues": []
    }
    
    # Quét tất cả file MP3
    for root, dirs, files in os.walk(AUDIO_BASE):
        for file in files:
            if file.endswith('.mp3'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, AUDIO_BASE)
                
                report["total_files"] += 1
                
                # Kiểm tra xem file có trong thư mục organized không
                should_keep = should_keep_file(file_path, AUDIO_BASE)
                
                if should_keep:
                    # File trong thư mục organized - kiểm tra tính hợp lệ
                    is_valid, message = check_audio_file(file_path)
                    
                    if is_valid:
                        report["valid_files"] += 1
                        report["kept_organized"] += 1
                        print(f"✅ GIỮ: {relative_path}: {message}")
                    else:
                        report["invalid_files"] += 1
                        report["issues"].append({
                            "file": relative_path,
                            "issue": message,
                            "action": "deleted_invalid_organized"
                        })
                        print(f"❌ XÓA (lỗi): {relative_path}: {message}")
                        
                        # Xóa file organized bị lỗi
                        try:
                            os.remove(file_path)
                            report["deleted_files"] += 1
                            print(f"🗑️  Đã xóa file lỗi: {relative_path}")
                        except Exception as e:
                            print(f"❌ Không thể xóa {relative_path}: {e}")
                else:
                    # File không trong thư mục organized - xóa luôn
                    report["deleted_unorganized"] += 1
                    report["issues"].append({
                        "file": relative_path,
                        "issue": "File không trong thư mục organized",
                        "action": "deleted_unorganized"
                    })
                    print(f"🗑️  XÓA (không organized): {relative_path}")
                    
                    try:
                        os.remove(file_path)
                        report["deleted_files"] += 1
                        print(f"🗑️  Đã xóa: {relative_path}")
                    except Exception as e:
                        print(f"❌ Không thể xóa {relative_path}: {e}")
    
    # Tạo báo cáo
    with open("audio_cleanup_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("📊 TỔNG KẾT:")
    print(f"   📁 Tổng file kiểm tra: {report['total_files']}")
    print(f"   ✅ File hợp lệ (giữ lại): {report['valid_files']}")
    print(f"   📚 File organized giữ lại: {report['kept_organized']}")
    print(f"   🗑️  File không organized đã xóa: {report['deleted_unorganized']}")
    print(f"   ❌ File lỗi đã xóa: {report['invalid_files']}")
    print(f"   🗑️  Tổng file đã xóa: {report['deleted_files']}")
    print("=" * 60)
    
    return report

if __name__ == "__main__":
    scan_and_clean_audio()
