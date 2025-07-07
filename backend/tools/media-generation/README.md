# 🎨 Media Generation Tools

This directory contains all scripts related to generating media content for the LeEnglish TOEIC application.

## 📊 Overview

These tools generate audio files and images for:

- **Lessons** (40 items)
- **Exercises** (90 items)
- **Flashcards** (40 items)

## 🔧 Scripts

### Core Generation Scripts

- `generate_complete_all_media.py` - Complete media generation for ALL data
- `generate_complete_media.py` - Comprehensive media generator
- `generate_extended_media.py` - Extended media for exercises and flashcards
- `generate_final_90_exercises.py` - Final 90 exercises media generation

### Specialized Scripts

- `generate_lesson_media.py` - Lesson-specific media generation
- `generate_lesson_audio.py` - Audio generation for lessons
- `generate_flashcard_images.py` - Flashcard image generation
- `generate_audio_and_images.py` - Combined audio and image generation

## 🔑 Technologies Used

### Audio Generation

- **Google Text-to-Speech (gTTS)** - High-quality English audio
- **Format**: MP3, optimized for web playback

### Image Generation

- **Pixabay API** - High-quality stock images
- **PIL (Python Imaging Library)** - Placeholder image generation
- **Format**: JPEG, 800x600 resolution

## 🚀 Usage

```bash
# Generate all media (recommended)
python tools/media-generation/generate_complete_all_media.py

# Generate specific content
python tools/media-generation/generate_lesson_media.py
```

## 📋 Prerequisites

1. **API Keys Required:**

   - Pixabay API key in scripts

2. **Python Dependencies:**

   ```bash
   pip install gtts pillow requests mutagen
   ```

3. **Directory Structure:**
   - Runs from `backend/` root
   - Creates: `src/main/resources/static/audio/` and `src/main/resources/static/images/`

## 📊 Output

Generated media is organized as:

```
src/main/resources/static/
├── audio/
│   ├── lessons/     # 40 lesson audio files
│   ├── exercises/   # 90 exercise audio files
│   └── flashcards/  # 40 flashcard audio files
└── images/
    ├── lessons/     # 40 lesson images
    ├── exercises/   # 90 exercise images (if applicable)
    └── flashcards/  # 40 flashcard images
```
