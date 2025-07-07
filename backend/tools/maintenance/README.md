# 🔧 Maintenance Tools

This directory contains maintenance and cleanup utilities for the LeEnglish TOEIC application.

## 🛠️ Available Tools

### Audio Maintenance

- `check_and_clean_audio.py` - Comprehensive audio file validator and cleaner
- `clean_audio_files.py` - Audio files cleanup utility

## 🔍 check_and_clean_audio.py

### Purpose

- Validates audio file integrity using `mutagen`
- Removes corrupted or invalid audio files
- Preserves organized audio files in structured directories
- Generates detailed cleanup reports

### Features

- ✅ File size validation (removes files < 1KB)
- ✅ Audio duration validation (removes files < 0.1s)
- ✅ Preserves files in organized folders: `flashcards/`, `exercises/`, `lessons/`
- ✅ Comprehensive error reporting
- ✅ JSON report generation

### Usage

```bash
cd backend/
python tools/maintenance/check_and_clean_audio.py
```

### Output

- Console progress with emoji indicators
- `audio_cleanup_report.json` - Detailed JSON report
- Preserved organized audio files
- Removed corrupted/invalid files

## 🧹 clean_audio_files.py

### Purpose

Basic audio file cleanup with validation and reporting.

### Features

- Audio file integrity checking
- Invalid file removal with confirmation
- Progress reporting
- JSON report generation

### Usage

```bash
cd backend/
python tools/maintenance/clean_audio_files.py
```

## 📊 Reports Generated

Both tools generate detailed reports including:

- Total files scanned
- Valid vs invalid file counts
- Files deleted vs preserved
- Error details and file paths
- Timestamp and operation summary

## ⚠️ Safety Features

- **Confirmation prompts** before deletion
- **Organized folder protection** - preserves structured audio
- **Detailed logging** of all operations
- **Backup recommendations** before running cleanup

## 🔧 Dependencies

```bash
pip install mutagen pathlib
```

## 📁 Affects Directories

```
src/main/resources/static/audio/
├── lessons/     # Protected - organized content
├── exercises/   # Protected - organized content
├── flashcards/  # Protected - organized content
└── (other)/     # Subject to cleanup
```
