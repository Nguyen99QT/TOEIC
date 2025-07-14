# Python File Fixes

## 1. check_media_files.py

- Add import: `from typing import List, Tuple, Optional, Any, Dict, Union`
- Add import: `from mysql.connector import MySQLConnection`
- Add type annotations:
  - `def check_database_connection() -> Optional[mysql.connector.connection.MySQLConnection]:`
  - `def get_media_paths_from_database(connection: mysql.connector.connection.MySQLConnection) -> Tuple[List[Tuple[int, str, str]], List[Tuple[int, str, str]]]:`
  - `def check_files_exist() -> int:`
  - `def check_database_media_paths() -> int:`
  - `def main() -> int:`
- Fix variable types:
  - `missing_audio: List[Tuple[int, str, str]] = []`
  - `missing_images: List[Tuple[int, str, str]] = []`
  - `audio_paths: List[Tuple[int, str, str]] = []`
  - `image_paths: List[Tuple[int, str, str]] = []`

## 2. generate_media_files.py

- Remove unused import: `import requests`

## 3. generate_new_exercises_from_audio.py

- Add import: `from typing import List, Dict, Tuple, Optional, Union, Any`
- Fix function implementations:
  - Complete `get_audio_files()`
  - Complete `get_image_files()`
  - Complete `get_sql_mappings()`

## 4. analyze_audio_and_generate_questions.py

- Add import: `from typing import List, Dict, Tuple, Optional, Union, Any`
- Complete missing function implementations:
  - Complete `get_audio_files()`
  - Complete `get_image_files()`

## How to implement missing functions

### get_audio_files():

```python
def get_audio_files() -> List[str]:
    """Get all ex*.mp3 files from the audio directory."""
    audio_files = []
    if not AUDIO_PATH.exists():
        print(f"❌ Audio directory not found: {AUDIO_PATH}")
        return []

    for file in AUDIO_PATH.glob("ex*.mp3"):
        audio_files.append(file.name)

    return sorted(audio_files, key=lambda x: int(re.search(r'ex(\d+)\.mp3', x).group(1)))
```

### get_image_files():

```python
def get_image_files() -> List[str]:
    """Get all ex*.jpg files from the images directory."""
    image_files = []
    if not IMAGES_PATH.exists():
        print(f"❌ Images directory not found: {IMAGES_PATH}")
        return []

    for file in IMAGES_PATH.glob("ex*.jpg"):
        image_files.append(file.name)

    return sorted(image_files, key=lambda x: int(re.search(r'ex(\d+)\.jpg', x).group(1)))
```

### get_sql_mappings():

```python
def get_sql_mappings() -> Dict[Tuple[int, int], int]:
    """Extract exercise_id and question_order mappings from SQL file."""
    if not SQL_PATH.exists():
        print(f"❌ SQL file not found: {SQL_PATH}")
        return {}

    with open(SQL_PATH, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    mappings = {}
    for match in re.finditer(r"WHERE exercise_id = (\d+) AND question_order = (\d+);", sql_content):
        exercise_id = int(match.group(1))
        question_order = int(match.group(2))

        # Find corresponding audio/image file numbers
        audio_pattern = fr"audio_url = '/files/audio/exercises/ex(\d+)\.mp3'"

        # Get context around the match
        start = max(0, match.start() - 200)
        end = min(len(sql_content), match.end() + 200)
        context = sql_content[start:end]

        audio_match = re.search(audio_pattern, context)

        if audio_match:
            audio_num = int(audio_match.group(1))
            mappings[(exercise_id, question_order)] = audio_num

    return mappings
```
