import os
from pathlib import Path
import random

# Base paths
BASE_DIR = Path.cwd()
AUDIO_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "audio" / "exercises"
IMAGES_DIR = BASE_DIR / "src" / "main" / "resources" / "static" / "images" / "exercises"
OUTPUT_FILE = BASE_DIR / "database" / "migrations" / "new_questions_for_audio.sql"

# TOEIC topics for sample questions
TOEIC_TOPICS = [
    {
        "category": "Greetings",
        "questions": [
            {"question": "What does \"Hello\" mean in Vietnamese?", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "correct": "A", "explanation": "Hello means Xin chào."},
            {"question": "What does \"Goodbye\" mean in Vietnamese?", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "correct": "B", "explanation": "Goodbye means Tạm biệt."},
            {"question": "What does \"Thank you\" mean in Vietnamese?", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "correct": "C", "explanation": "Thank you means Cảm ơn."},
            {"question": "What does \"Sorry\" mean in Vietnamese?", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "correct": "D", "explanation": "Sorry means Xin lỗi."},
            {"question": "What does \"Please\" mean in Vietnamese?", "options": ["Làm ơn", "Không có gì", "Có thể", "Được rồi"], "correct": "A", "explanation": "Please means Làm ơn."},
        ]
    },
    {
        "category": "Business",
        "questions": [
            {"question": "What is the purpose of a business meeting?", "options": ["To discuss work matters", "To have lunch", "To take a break", "To socialize"], "correct": "A", "explanation": "Business meetings are primarily for discussing work-related matters."},
            {"question": "What should you bring to a job interview?", "options": ["Your resume", "Your lunch", "Your pet", "Your family"], "correct": "A", "explanation": "You should bring your resume to a job interview."},
            {"question": "How should you address your boss in a formal email?", "options": ["Dear Mr./Ms. [Last Name]", "Hey Boss", "Hello Friend", "What's up"], "correct": "A", "explanation": "In formal emails, address your boss as Dear Mr./Ms. [Last Name]."},
            {"question": "What does ROI stand for?", "options": ["Return On Investment", "Risk Of Inflation", "Rate Of Interest", "Record Of Income"], "correct": "A", "explanation": "ROI stands for Return On Investment."},
            {"question": "What is a deadline?", "options": ["A time by which something must be completed", "A line that should not be crossed", "A type of fishing equipment", "A kind of weapon"], "correct": "A", "explanation": "A deadline is a time by which something must be completed."},
        ]
    },
    {
        "category": "Travel",
        "questions": [
            {"question": "What do you need to travel to another country?", "options": ["Passport", "Library card", "Student ID", "Driver's license"], "correct": "A", "explanation": "You need a passport to travel to another country."},
            {"question": "Where do you check in for a flight?", "options": ["At the airline counter", "At the restaurant", "At the gift shop", "At the taxi stand"], "correct": "A", "explanation": "You check in for a flight at the airline counter."},
            {"question": "What is a boarding pass?", "options": ["A document that allows you to board a plane", "A train ticket", "A bus schedule", "A museum ticket"], "correct": "A", "explanation": "A boarding pass is a document that allows you to board a plane."},
            {"question": "What should you do if you miss your flight?", "options": ["Contact the airline immediately", "Go home", "Wait for the next day", "Call the police"], "correct": "A", "explanation": "If you miss your flight, you should contact the airline immediately."},
            {"question": "What is jet lag?", "options": ["Tiredness from traveling across time zones", "Fear of flying", "Sickness from eating airplane food", "Excitement about a trip"], "correct": "A", "explanation": "Jet lag is tiredness from traveling across different time zones."},
        ]
    },
    {
        "category": "Office Equipment",
        "questions": [
            {"question": "What is a printer used for?", "options": ["To make paper copies of documents", "To send emails", "To make phone calls", "To take photos"], "correct": "A", "explanation": "A printer is used to make paper copies of documents."},
            {"question": "What do you use a stapler for?", "options": ["To fasten papers together", "To cut paper", "To hole punch paper", "To erase mistakes"], "correct": "A", "explanation": "A stapler is used to fasten papers together."},
            {"question": "What is a photocopier?", "options": ["A machine that makes copies of documents", "A machine that takes photos", "A machine that prints from the internet", "A machine that sends faxes"], "correct": "A", "explanation": "A photocopier is a machine that makes copies of documents."},
            {"question": "What do you use a scanner for?", "options": ["To create digital copies of documents", "To print documents", "To shred papers", "To laminate documents"], "correct": "A", "explanation": "A scanner is used to create digital copies of documents."},
            {"question": "What is a paper shredder used for?", "options": ["To destroy sensitive documents", "To cut paper into shapes", "To bind documents together", "To print documents"], "correct": "A", "explanation": "A paper shredder is used to destroy sensitive documents."},
        ]
    },
    {
        "category": "Food",
        "questions": [
            {"question": "What meal do people typically eat in the morning?", "options": ["Breakfast", "Lunch", "Dinner", "Supper"], "correct": "A", "explanation": "Breakfast is typically eaten in the morning."},
            {"question": "What food is often served at a barbecue?", "options": ["Grilled meat", "Ice cream", "Soup", "Cereal"], "correct": "A", "explanation": "Grilled meat is often served at a barbecue."},
            {"question": "What beverage is made from coffee beans?", "options": ["Coffee", "Tea", "Milk", "Orange juice"], "correct": "A", "explanation": "Coffee is made from coffee beans."},
            {"question": "What fruit is yellow and has a curved shape?", "options": ["Banana", "Apple", "Orange", "Grape"], "correct": "A", "explanation": "A banana is yellow and has a curved shape."},
            {"question": "What do vegans not eat?", "options": ["Animal products", "Vegetables", "Fruits", "Grains"], "correct": "A", "explanation": "Vegans do not eat animal products."},
        ]
    }
]

from typing import List, Dict, Any
def find_unused_audio_files() -> List[str]:
    """Find audio files that haven't been associated with questions yet"""
    if not AUDIO_DIR.exists():
        print("❌ Audio directory does not exist.")
        return []
    audio_files: List[str] = [f for f in os.listdir(AUDIO_DIR) if f.startswith("ex") and f.endswith(".mp3")]
    def extract_num(x: str) -> int:
        try:
            return int(x[2:-4])
        except Exception:
            return 0
    return sorted(audio_files, key=extract_num)

def generate_new_questions_sql() -> None:
    """Generate SQL statements for new questions based on available audio files"""
    audio_files: List[str] = find_unused_audio_files()
    if not audio_files:
        print("❌ No audio files found.")
        return
    
    print(f"✅ Found {len(audio_files)} audio files.")
    
    # Generate SQL content
    sql_content = [
        "-- SQL Script to create new questions based on available audio files",
        "-- These are sample questions that should be reviewed and updated",
        "",
        "-- Ensure the exercises exist before running this script",
        "-- You may need to create new exercises first",
        ""
    ]
    
    # Start from a high ID to avoid conflicts
    next_id = 500
    next_exercise_id = 20  # Start from a high exercise ID
    
    # Group questions by exercises (6 questions per exercise)
    for i in range(0, len(audio_files), 6):
        batch = audio_files[i:i+6]
        if not batch:
            continue
        
        # Choose a random topic for this exercise
        topic = random.choice(TOEIC_TOPICS)
        category = topic["category"]
        
        # Create exercise first
        sql_content.append(f"-- Creating new exercise for {category}")
        sql_content.append(f"INSERT INTO exercises (id, title, description, type, is_active, is_premium, difficulty_level) VALUES")
        sql_content.append(f"({next_exercise_id}, '{category} Exercise', 'Practice your knowledge of {category.lower()}', 'MCQ', 1, 0, 'EASY');")
        sql_content.append("")
        
        # Create questions for this exercise
        sql_content.append(f"-- Creating questions for Exercise {next_exercise_id} ({category})")
        
        for j, audio_file in enumerate(batch):
            # Get question number from file name (ex1.mp3 -> 1)
            question_num = int(audio_file[2:-4])
            image_file = f"ex{question_num}.jpg"
            
            # Choose a random question or create a generic one if we run out
            question_data = topic["questions"][j % len(topic["questions"])]
            
            # Insert question
            sql_content.append(f"INSERT INTO questions (id, exercise_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, is_active, points, question_order, question_type, difficulty_level, audio_url, image_url) VALUES")
            sql_content.append(f"({next_id}, {next_exercise_id}, '{question_data['question']}', '{question_data['options'][0]}', '{question_data['options'][1]}', '{question_data['options'][2]}', '{question_data['options'][3]}', '{question_data['correct']}', '{question_data['explanation']}', 1, 10, {j+1}, 'MCQ', 'EASY', '/files/audio/exercises/{audio_file}', '/files/images/exercises/{image_file}');")
            
            next_id += 1
        
        sql_content.append("")
        next_exercise_id += 1
    
    # Write to SQL file
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        f.write("\n".join(sql_content))
    
    print(f"✅ Generated SQL file: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_new_questions_sql()
