import re
import os

# Đường dẫn đến tệp SQL
SQL_FILE = "database/migrations/update_questions.sql"

def update_sql_paths():
    """Cập nhật đường dẫn tệp trong SQL để sử dụng đường dẫn exN.mp3/jpg"""
    print("Cập nhật đường dẫn tệp trong SQL...")
    
    with open(SQL_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Tạo một ánh xạ cho các tệp âm thanh và hình ảnh
    exercise_mapping = {}
    
    # Tìm tất cả các mẫu câu hỏi trong tệp SQL
    pattern = r"-- Question \d+:.*?\nUPDATE `questions`[\s\S]+?`exercise_id` = (\d+) AND `question_order` = (\d+);"
    matches = re.findall(pattern, content)
    
    # Tạo ánh xạ cho mỗi câu hỏi
    counter = 1
    for exercise_id, question_order in matches:
        key = f"exercise_{exercise_id}_question_{question_order}"
        exercise_mapping[key] = counter
        counter += 1
    
    # Thay thế đường dẫn âm thanh
    for key, number in exercise_mapping.items():
        exercise_id, question_order = key.replace("exercise_", "").replace("question_", "").split("_")
        
        # Tìm và thay thế đường dẫn âm thanh
        audio_pattern = r"(`audio_url` = ')([^']+)('[\s\S]+?`exercise_id` = " + exercise_id + " AND `question_order` = " + question_order + ";)"
        content = re.sub(audio_pattern, fr"\1/files/audio/exercises/ex{number}.mp3\3", content)
        
        # Tìm và thay thế đường dẫn hình ảnh
        image_pattern = r"(`image_url` = ')([^']+)('[\s\S]+?`exercise_id` = " + exercise_id + " AND `question_order` = " + question_order + ";)"
        content = re.sub(image_pattern, fr"\1/files/images/exercises/ex{number}.jpg\3", content)
    
    # Ghi nội dung đã cập nhật trở lại tệp
    with open(SQL_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Đã cập nhật thành công đường dẫn tệp trong {SQL_FILE}.")

if __name__ == "__main__":
    update_sql_paths()
