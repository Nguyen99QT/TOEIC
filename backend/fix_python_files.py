#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script to fix the Python files with type annotation errors and other issues
"""

import os
import sys
import re
from pathlib import Path

def fix_check_media_files():
    """Fix the check_media_files.py file"""
    filepath = Path('check_media_files.py')
    
    if not filepath.exists():
        print(f"Error: {filepath} does not exist")
        return False
    
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add type imports
    new_content = re.sub(
        r'import os\nimport re\nimport sys\nimport sqlite3\nfrom pathlib import Path\nimport mysql.connector\nfrom mysql.connector import Error',
        'import os\nimport re\nimport sys\nimport sqlite3\nfrom pathlib import Path\nfrom typing import List, Tuple, Optional, Any, Dict, Union\nimport mysql.connector\nfrom mysql.connector import Error, MySQLConnection',
        content
    )
    
    # Fix the return type of check_files_exist
    new_content = re.sub(
        r'def check_files_exist\(\):',
        'def check_files_exist() -> int:',
        new_content
    )
    
    # Fix the return type of check_database_connection
    new_content = re.sub(
        r'def check_database_connection\(\):',
        'def check_database_connection() -> Optional[mysql.connector.connection.MySQLConnection]:',
        new_content
    )
    
    # Fix the return type of get_media_paths_from_database
    new_content = re.sub(
        r'def get_media_paths_from_database\(connection\):',
        'def get_media_paths_from_database(connection: mysql.connector.connection.MySQLConnection) -> Tuple[List[Tuple[int, str, str]], List[Tuple[int, str, str]]]:',
        new_content
    )
    
    # Fix the return type of check_database_media_paths
    new_content = re.sub(
        r'def check_database_media_paths\(\):',
        'def check_database_media_paths() -> int:',
        new_content
    )
    
    # Fix the return type of main
    new_content = re.sub(
        r'def main\(\):',
        'def main() -> int:',
        new_content
    )
    
    # Fix variable declarations
    new_content = re.sub(
        r'    missing_audio = \[\]',
        '    missing_audio: List[Tuple[int, str, str]] = []',
        new_content
    )
    new_content = re.sub(
        r'    missing_images = \[\]',
        '    missing_images: List[Tuple[int, str, str]] = []',
        new_content
    )
    new_content = re.sub(
        r'    audio_paths = \[\]',
        '    audio_paths: List[Tuple[int, str, str]] = []',
        new_content
    )
    new_content = re.sub(
        r'    image_paths = \[\]',
        '    image_paths: List[Tuple[int, str, str]] = []',
        new_content
    )
    
    # Write the modified content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Fixed {filepath}")
    return True

def fix_generate_media_files():
    """Fix the generate_media_files.py file"""
    filepath = Path('generate_media_files.py')
    
    if not filepath.exists():
        print(f"Error: {filepath} does not exist")
        return False
    
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if 'requests' import exists and remove it
    if 'import requests' in content:
        content = content.replace('import requests', '')
    
    # Fix import lines if needed
    if 'import os' not in content:
        content = 'import os\n' + content
    if 'import re' not in content:
        content = 'import re\n' + content
    if 'import shutil' not in content:
        content = 'import shutil\n' + content
    if 'from pathlib import Path' not in content:
        content = 'from pathlib import Path\n' + content
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    # Write the modified content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filepath}")
    return True

def fix_generate_new_exercises_from_audio():
    """Fix the generate_new_exercises_from_audio.py file"""
    filepath = Path('generate_new_exercises_from_audio.py')
    
    if not filepath.exists():
        print(f"Error: {filepath} does not exist")
        return False
    
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add missing imports
    if 'import re' not in content:
        content = re.sub(
            r'import os',
            'import os\nimport re',
            content
        )
    
    # Add type hints
    content = re.sub(
        r'from pathlib import Path',
        'from pathlib import Path\nfrom typing import List, Dict, Tuple, Optional, Union, Any',
        content
    )
    
    # Add complete implementation for get_audio_files if needed
    if 'def get_audio_files():' in content and 'audio_files.append(file.name)' not in content:
        content = re.sub(
            r'def get_audio_files\(\):.*?return \[\]',
            '''def get_audio_files() -> List[str]:
    """Get all ex*.mp3 files from the audio directory."""
    audio_files = []
    if not AUDIO_PATH.exists():
        print(f"❌ Audio directory not found: {AUDIO_PATH}")
        return []
    
    for file in AUDIO_PATH.glob("ex*.mp3"):
        audio_files.append(file.name)
    
    return sorted(audio_files, key=lambda x: int(re.search(r'ex(\\d+)\\.mp3', x).group(1)))''',
            content, 
            flags=re.DOTALL
        )
    
    # Add complete implementation for get_image_files if needed
    if 'def get_image_files():' in content and 'image_files.append(file.name)' not in content:
        content = re.sub(
            r'def get_image_files\(\):.*?return \[\]',
            '''def get_image_files() -> List[str]:
    """Get all ex*.jpg files from the images directory."""
    image_files = []
    if not IMAGES_PATH.exists():
        print(f"❌ Images directory not found: {IMAGES_PATH}")
        return []
    
    for file in IMAGES_PATH.glob("ex*.jpg"):
        image_files.append(file.name)
    
    return sorted(image_files, key=lambda x: int(re.search(r'ex(\\d+)\\.jpg', x).group(1)))''',
            content, 
            flags=re.DOTALL
        )
    
    # Add type annotations to functions
    content = re.sub(
        r'def get_sql_mappings\(\):',
        'def get_sql_mappings() -> Dict[Tuple[int, int], int]:',
        content
    )
    
    content = re.sub(
        r'def get_max_exercise_id\(mappings\):',
        'def get_max_exercise_id(mappings: Dict[Tuple[int, int], int]) -> int:',
        content
    )
    
    # Write the modified content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filepath}")
    return True

def fix_analyze_audio_and_generate_questions():
    """Fix the analyze_audio_and_generate_questions.py file"""
    filepath = Path('analyze_audio_and_generate_questions.py')
    
    if not filepath.exists():
        print(f"Error: {filepath} does not exist")
        return False
    
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add type hints
    content = re.sub(
        r'from pathlib import Path',
        'from pathlib import Path\nfrom typing import List, Dict, Tuple, Optional, Union, Any',
        content
    )
    
    # Add complete implementation for get_audio_files if needed
    if 'def get_audio_files():' in content and 'return audio_files' not in content:
        content = re.sub(
            r'def get_audio_files\(\):.*?if not AUDIO_PATH\.exists\(\):',
            '''def get_audio_files() -> List[str]:
    """Get all ex*.mp3 files from the audio directory."""
    audio_files = []
    if not AUDIO_PATH.exists():''',
            content, 
            flags=re.DOTALL
        )
        # Add the rest of the function if it's missing
        if 'audio_files.append(file.name)' not in content:
            content = re.sub(
                r'if not AUDIO_PATH\.exists\(\):.*?\n(    .*?\n)*?def',
                '''if not AUDIO_PATH.exists():
        print(f"❌ Audio directory not found: {AUDIO_PATH}")
        return []
    
    for file in AUDIO_PATH.glob("ex*.mp3"):
        audio_files.append(file.name)
    
    return sorted(audio_files, key=lambda x: int(re.search(r'ex(\\d+)\\.mp3', x).group(1)))

def''',
                content, 
                flags=re.DOTALL
            )
    
    # Add complete implementation for get_image_files if needed
    if 'def get_image_files():' in content and 'return image_files' not in content:
        content = re.sub(
            r'def get_image_files\(\):.*?if not IMAGES_PATH\.exists\(\):',
            '''def get_image_files() -> List[str]:
    """Get all ex*.jpg files from the images directory."""
    image_files = []
    if not IMAGES_PATH.exists():''',
            content, 
            flags=re.DOTALL
        )
        # Add the rest of the function if it's missing
        if 'image_files.append(file.name)' not in content:
            content = re.sub(
                r'if not IMAGES_PATH\.exists\(\):.*?\n(    .*?\n)*?def',
                '''if not IMAGES_PATH.exists():
        print(f"❌ Images directory not found: {IMAGES_PATH}")
        return []
    
    for file in IMAGES_PATH.glob("ex*.jpg"):
        image_files.append(file.name)
    
    return sorted(image_files, key=lambda x: int(re.search(r'ex(\\d+)\\.jpg', x).group(1)))

def''',
                content, 
                flags=re.DOTALL
            )
    
    # Write the modified content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filepath}")
    return True

def main():
    """Main function to fix all files"""
    print("=" * 60)
    print("Fixing Python files")
    print("=" * 60)
    
    fixed_count = 0
    
    if fix_check_media_files():
        fixed_count += 1
    
    if fix_generate_media_files():
        fixed_count += 1
    
    if fix_generate_new_exercises_from_audio():
        fixed_count += 1
    
    if fix_analyze_audio_and_generate_questions():
        fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files.")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
