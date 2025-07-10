# Media Assets Generator Documentation

## Overview

The `generate_media_assets.py` script automatically creates sample images and audio files for the LeEnglish TOEIC Platform based on the file paths found in SQL database files.

## Features

- 🖼️ **Image Generation**: Creates placeholder images for lessons, exercises, flashcards, and user profiles
- 🔊 **Audio Generation**: Generates text-to-speech audio files for listening exercises
- 📁 **Directory Structure**: Automatically creates organized folder structure
- 🎨 **Customizable Design**: Uses different color palettes for different content types
- 📱 **Mobile Support**: Generates assets for Flutter mobile app
- 📊 **Reporting**: Creates detailed reports of generated files

## Installation

### 1. Install Python Dependencies

```powershell
# Navigate to scripts directory
cd scripts

# Install required packages
pip install -r requirements.txt
```

### 2. Alternative Manual Installation

If you prefer to install packages individually:

```powershell
pip install Pillow gtts pydub requests
```

### 3. Optional Dependencies

For enhanced functionality:

```powershell
# Advanced image processing
pip install opencv-python

# Speech recognition features
pip install SpeechRecognition
```

## Usage

### Basic Usage

```powershell
# Generate all media assets
python generate_media_assets.py

# Preview what will be created (dry run)
python generate_media_assets.py --dry-run

# Enable verbose logging
python generate_media_assets.py --verbose

# Combine options
python generate_media_assets.py --dry-run --verbose
```

### Advanced Options

```powershell
# Show help
python generate_media_assets.py --help

# Run from different directory
python c:\path\to\scripts\generate_media_assets.py
```

## Generated Assets

### Images

The script generates various types of images:

#### **Lesson Images** (`frontend/public/images/lessons/`)

- `greeting.jpg` - Basic greetings lesson
- `present-simple.jpg` - Grammar lesson
- `numbers-time.jpg` - Numbers and time vocabulary
- `past-simple.jpg` - Past tense grammar
- `conversations.jpg` - Listening practice
- `conditionals.jpg` - Conditional sentences
- `business-email.jpg` - Business English
- And more...

#### **Exercise Images** (`frontend/public/images/exercises/`)

- `photo_exercise1.jpg` - TOEIC Part 1 photo description
- `woman_typing.jpg` - Office scene exercise
- `office_scene.jpg` - Workplace vocabulary
- And more...

#### **User Assets** (`frontend/public/images/users/`)

- `user_1.jpg` to `user_10.jpg` - Profile placeholders

#### **Achievement Badges** (`frontend/public/images/achievements/`)

- `achievement_1.png` - First Login badge
- `achievement_2.png` - Lesson Complete badge
- And more...

### Audio Files

#### **Lesson Audio** (`frontend/public/audio/lessons/`)

- `greeting-intro.mp3` - Introduction to greetings
- `numbers.mp3` - Numbers pronunciation
- `daily-conversations.mp3` - Conversation practice
- `advanced-words.mp3` - Advanced vocabulary
- And more...

#### **Exercise Audio** (`frontend/public/audio/exercises/`)

- `part1_ex1.mp3` - TOEIC Part 1 listening
- `q1.mp3` to `q5.mp3` - Question audio files
- And more...

### Mobile Assets

#### **Mobile Images** (`mobile/assets/images/`)

- `app_icon.png` - App icon
- `splash_logo.png` - Splash screen logo
- `lesson_placeholder.png` - Lesson placeholder

## File Structure Created

```
frontend/public/
├── images/
│   ├── lessons/
│   │   ├── greeting.jpg
│   │   ├── present-simple.jpg
│   │   ├── numbers-time.jpg
│   │   └── ...
│   ├── exercises/
│   │   ├── photo_exercise1.jpg
│   │   ├── woman_typing.jpg
│   │   └── ...
│   ├── flashcards/
│   ├── users/
│   │   ├── user_1.jpg
│   │   ├── user_2.jpg
│   │   └── ...
│   └── achievements/
│       ├── achievement_1.png
│       ├── achievement_2.png
│       └── ...
├── audio/
│   ├── lessons/
│   │   ├── greeting-intro.mp3
│   │   ├── numbers.mp3
│   │   └── ...
│   └── exercises/
│       ├── part1_ex1.mp3
│       ├── q1.mp3
│       └── ...
└── videos/
    └── lessons/

mobile/assets/
├── images/
│   ├── app_icon.png
│   ├── splash_logo.png
│   └── lesson_placeholder.png
└── audio/
```

## Using Generated Assets

### Frontend (Next.js)

```typescript
// In your React components
const lessonImage = "/images/lessons/greeting.jpg";
const userAvatar = "/images/users/user_1.jpg";
const audioUrl = "/audio/lessons/greeting-intro.mp3";

// Example usage
<img src={lessonImage} alt="Greeting lesson" />
<audio src={audioUrl} controls />
```

### Mobile (Flutter)

```dart
// In your Flutter widgets
Image.asset('assets/images/app_icon.png')
Image.asset('assets/images/lesson_placeholder.png')

// Audio playback
AudioPlayer.play('assets/audio/lesson_audio.mp3')
```

### Backend (Spring Boot)

```java
// Serve static files
@GetMapping("/api/media/images/{filename}")
public ResponseEntity<Resource> getImage(@PathVariable String filename) {
    // Serve from frontend/public/images/
}
```

## Customization

### Adding New Image Types

Edit the `media_patterns` dictionary in the script:

```python
media_patterns = {
    'your_custom_image.jpg': ('lesson', 'custom_category'),
    # Add more patterns...
}
```

### Adding New Audio Content

Edit the `AUDIO_CONTENT` dictionary:

```python
AUDIO_CONTENT = {
    'custom_category': [
        "Your custom audio text here",
        "Another audio sample",
    ]
}
```

### Changing Color Palettes

Modify the `COLOR_PALETTES` dictionary:

```python
COLOR_PALETTES = {
    'lessons': ['#FF5733', '#33FF57', '#3357FF'],  # Custom colors
    # Add more palettes...
}
```

## Troubleshooting

### Common Issues

1. **"Pillow not installed"**

   ```powershell
   pip install Pillow
   ```

2. **"gTTS not available"**

   ```powershell
   pip install gtts
   ```

   Note: Requires internet connection for text-to-speech

3. **"pydub not available"**

   ```powershell
   pip install pydub
   ```

4. **Font errors on Windows**

   - The script uses system fonts automatically
   - Fallback to default font if custom fonts not found

5. **Audio generation fails**
   - Check internet connection (required for gTTS)
   - Script will create placeholder beep sounds as fallback

### Permission Issues

On Windows, ensure you have write permissions:

```powershell
# Run as administrator if needed
# Or check folder permissions
```

### Path Issues

Make sure you're running from the correct directory:

```powershell
# Check current directory
pwd

# Navigate to project root
cd c:\HK4\toeic3\leenglish-front

# Run script
python scripts\generate_media_assets.py
```

## Output and Reporting

After running the script, you'll get:

1. **Console Output**: Real-time progress and status messages
2. **Media Files**: All generated images and audio files
3. **Report File**: `media_generation_report.md` with detailed summary

### Sample Output

```
[10:30:15] ℹ️  🚀 Starting LeEnglish Media Assets Generator
[10:30:15] ✅ Created directory: frontend\public\images\lessons
[10:30:16] ✅ Generated lesson image: frontend\public\images\lessons\greeting.jpg
[10:30:17] ✅ Generated audio file: frontend\public\audio\lessons\greeting-intro.mp3
[10:30:20] ✅ Generation complete! Created 45 files
```

## Performance Considerations

- **Image Generation**: Fast, typically <1 second per image
- **Audio Generation**: Slower due to text-to-speech API calls
- **Total Time**: Approximately 2-5 minutes for full generation
- **File Sizes**:
  - Images: 50-200 KB each
  - Audio: 100-500 KB each
  - Total: ~50-100 MB for all assets

## Integration with Build Process

### Package.json Scripts

Add to your `frontend/package.json`:

```json
{
  "scripts": {
    "generate-media": "python ../scripts/generate_media_assets.py",
    "generate-media-preview": "python ../scripts/generate_media_assets.py --dry-run"
  }
}
```

### CI/CD Integration

```yaml
# In your GitHub Actions or CI pipeline
- name: Generate Media Assets
  run: |
    cd scripts
    pip install -r requirements.txt
    python generate_media_assets.py
```

## Best Practices

1. **Version Control**: Add generated files to `.gitignore` if they're build artifacts
2. **Optimization**: Consider using WebP format for better compression
3. **Accessibility**: Add proper alt text when using images
4. **Lazy Loading**: Implement lazy loading for better performance
5. **Caching**: Use browser caching for static assets

## Future Enhancements

- [ ] WebP image format support
- [ ] Video file generation
- [ ] SVG icon generation
- [ ] Batch processing of custom content
- [ ] Integration with cloud storage
- [ ] Automated optimization pipeline
- [ ] Multi-language audio support
