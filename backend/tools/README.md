# 🛠️ Tools Directory

This directory contains utility tools and scripts for the LeEnglish TOEIC project.

## 📁 Directory Structure

### 🎨 media-generation/

Scripts for generating audio files, images, and other media content:

- Audio generation using Google Text-to-Speech (gTTS)
- Image generation using Pixabay API
- Batch media processing for lessons, exercises, and flashcards

### 🔧 maintenance/

Maintenance and cleanup utilities:

- Audio file validation and cleanup
- Database maintenance scripts
- System health checks

## 🚀 Usage

All scripts should be run from the `backend/` root directory to ensure proper path resolution.

### Example:

```bash
cd backend/
python tools/media-generation/generate_complete_all_media.py
```

## 📋 Requirements

- Python 3.8+
- Required packages in `requirements.txt`
- API keys configured (see individual scripts)
