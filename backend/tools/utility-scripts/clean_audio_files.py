#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LeEnglish TOEIC - Audio Files Cleaner
Kiểm tra và xóa các file âm thanh bị lỗi hoặc không phát được
"""

import os
import wave
import mutagen
from mutagen.mp3 import MP3
import json
from pathlib import Path

def check_audio_file(file_path):
    """Kiểm tra file âm thanh có hợp lệ không"""
    try:
        file_size = os.path.getsize(file_path)
        
        # File quá nhỏ (dưới 1KB) có thể bị lỗi
        if file_size < 1024:
            return False, f"File quá nhỏ: {file_size} bytes"
        
        # Kiểm tra với mutagen
        try:
            audio = mutagen.File(file_path)
            if audio is None:
                return False, "Không thể đọc metadata"
            
            # Kiểm tra duration
            if hasattr(audio, 'info') and hasattr(audio.info, 'length'):
                if audio.info.length < 0.1:  # Dưới 0.1 giây
                    return False, f"Duration quá ngắn: {audio.info.length}s"
            
            return True, f"OK - {file_size} bytes"
            
        except Exception as e:
            return False, f"Lỗi mutagen: {str(e)}"
            
    except Exception as e:
        return False, f"Lỗi kiểm tra file: {str(e)}"

def scan_audio_directory(base_dir):
    """Quét thư mục âm thanh và kiểm tra từng file"""
    audio_dir = os.path.join(base_dir, "src/main/resources/static/audio")
    
    if not os.path.exists(audio_dir):
        print(f"❌ Không tìm thấy thư mục: {audio_dir}")
        return
    
    print(f"🔍 Quét thư mục âm thanh: {audio_dir}")
    print("=" * 60)
    
    valid_files = []
    invalid_files = []
    total_files = 0
    
    # Quét tất cả file .mp3
    for root, dirs, files in os.walk(audio_dir):
        for file in files:
            if file.lower().endswith('.mp3'):
                total_files += 1
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, audio_dir)
                
                is_valid, message = check_audio_file(file_path)
                
                if is_valid:
                    valid_files.append(rel_path)
                    print(f"✅ {rel_path} - {message}")
                else:
                    invalid_files.append({
                        'path': rel_path,
                        'full_path': file_path,
                        'reason': message
                    })
                    print(f"❌ {rel_path} - {message}")
    
    print("=" * 60)
    print(f"📊 TỔNG KẾT:")
    print(f"   🔊 Tổng file MP3: {total_files}")
    print(f"   ✅ File hợp lệ: {len(valid_files)}")
    print(f"   ❌ File lỗi: {len(invalid_files)}")
    
    return valid_files, invalid_files

def clean_invalid_files(invalid_files, confirm=True):
    """Xóa các file âm thanh không hợp lệ"""
    if not invalid_files:
        print("🎉 Không có file nào cần xóa!")
        return
    
    print(f"\n🗑️ SẼ XÓA {len(invalid_files)} FILE LỖI:")
    for item in invalid_files:
        print(f"   - {item['path']} ({item['reason']})")
    
    if confirm:
        response = input(f"\n❓ Xác nhận xóa {len(invalid_files)} file? (y/N): ").lower()
        if response != 'y':
            print("❌ Hủy bỏ xóa file")
            return
    
    deleted_count = 0
    for item in invalid_files:
        try:
            os.remove(item['full_path'])
            print(f"🗑️ Đã xóa: {item['path']}")
            deleted_count += 1
        except Exception as e:
            print(f"❌ Lỗi xóa {item['path']}: {e}")
    
    print(f"\n✅ Đã xóa {deleted_count}/{len(invalid_files)} file lỗi")

def generate_report(valid_files, invalid_files):
    """Tạo báo cáo chi tiết"""
    report = {
        "scan_time": "2025-07-02 22:30:00",
        "total_files": len(valid_files) + len(invalid_files),
        "valid_files": len(valid_files),
        "invalid_files": len(invalid_files),
        "valid_list": valid_files,
        "invalid_list": invalid_files
    }
    
    with open("audio_scan_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"📄 Đã tạo báo cáo: audio_scan_report.json")

def main():
    """Hàm chính"""
    print("🔊 LeEnglish TOEIC - Audio Files Cleaner")
    print("=" * 60)
    
    # Quét và kiểm tra file
    valid_files, invalid_files = scan_audio_directory(".")
    
    # Tạo báo cáo
    generate_report(valid_files, invalid_files)
    
    # Xóa file lỗi (nếu có)
    if invalid_files:
        clean_invalid_files(invalid_files, confirm=True)
    
    print("\n🎉 Hoàn tất kiểm tra và dọn dẹp file âm thanh!")

if __name__ == "__main__":
    main()
