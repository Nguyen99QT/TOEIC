# 🎓 LeEnglish TOEIC - Backend

Spring Boot backend application for the LeEnglish TOEIC learning platform.

## 📁 Project Structure (Reorganized)

```
backend/
├── 📁 src/                          # Java source code
│   ├── main/
│   │   ├── java/                    # Application code
│   │   └── resources/
│   │       ├── static/              # Static media files
│   │       │   ├── audio/           # Audio files (lessons, exercises, flashcards)
│   │       │   └── images/          # Image files (lessons, flashcards)
│   │       └── application.properties
│   └── test/                        # Test code
│
├── 🛠️ tools/                        # Development & maintenance tools
│   ├── media-generation/            # Media generation scripts
│   │   ├── generate_complete_all_media.py
│   │   ├── generate_lesson_media.py
│   │   └── ...
│   └── maintenance/                 # System maintenance tools
│       ├── check_and_clean_audio.py
│       └── clean_audio_files.py
│
├── 🗄️ database/                     # Database related files
│   ├── migrations/                  # Schema migrations
│   │   └── questions_restructured.sql
│   └── scripts/                     # Utility scripts
│       ├── fix_user_accounts.sql
│       └── update_exercise_difficulty.sql
│
├── 📚 docs/                         # Documentation & reports
│   └── reports/                     # Generated reports
│       ├── FINAL_MEDIA_GENERATION_REPORT.md
│       └── media_generation_summary.json
│
├── 🗂️ temp/                         # Temporary files
│   └── (temporary outputs)
│
├── 📦 Configuration Files
│   ├── pom.xml                      # Maven dependencies
│   ├── package.json                 # Node.js dependencies
│   ├── requirements.txt             # Python dependencies
│   └── tsconfig.json               # TypeScript configuration
```

## 🚀 Quick Start

### 1. Install Dependencies

**Java Dependencies (Maven):**

```bash
mvn clean install
```

**Python Dependencies (for tools):**

```bash
pip install -r requirements.txt
```

**Node.js Dependencies (for some tools):**

```bash
npm install
```

### 2. Run Application

**Start Spring Boot Server:**

```bash
mvn spring-boot:run
```

**Or using VS Code task:**

- Press `Ctrl+Shift+P`
- Run task: "Start Backend Server"

## 🎨 Media Generation

### Generate All Media Content

```bash
python tools/media-generation/generate_complete_all_media.py
```

This creates:

- 📊 **340 media files** (170 audio + 170 images)
- 🎯 **40 Lessons** + **90 Exercises** + **40 Flashcards**

### Individual Components

```bash
# Lessons only
python tools/media-generation/generate_lesson_media.py

# Maintenance
python tools/maintenance/check_and_clean_audio.py
```

## 🗄️ Database Operations

### Run Migrations

```sql
source database/migrations/questions_restructured.sql;
```

### Fix User Accounts

```sql
source database/scripts/fix_user_accounts.sql;
```

## 📊 Generated Content

### Audio Files (170 total)

```
src/main/resources/static/audio/
├── lessons/     # 40 lesson audio files (.mp3)
├── exercises/   # 90 exercise audio files (.mp3)
└── flashcards/  # 40 flashcard audio files (.mp3)
```

### Image Files (170 total)

```
src/main/resources/static/images/
├── lessons/     # 40 lesson images (.jpg)
├── exercises/   # 90 exercise images (.jpg)
└── flashcards/  # 40 flashcard images (.jpg)
```

## 🔧 Development Tools

### Available VS Code Tasks

- **Install Backend Dependencies** - `mvn clean install`
- **Start Backend Server** - `mvn spring-boot:run`
- **Backend Test** - `mvn test`

### Python Tools

- **Media Generation** - Automated content creation
- **Maintenance** - Audio validation and cleanup
- **Database Scripts** - Data fixes and migrations

## 📋 Prerequisites

- **Java 11+** - Spring Boot application
- **Maven 3.6+** - Dependency management
- **Python 3.8+** - Tools and scripts
- **MySQL/PostgreSQL** - Database

## 🔑 API Keys Required

For media generation tools:

- **Pixabay API Key** - Image generation
- Configured in: `tools/media-generation/*.py`

## 📚 Documentation

- 📊 **Reports**: `docs/reports/` - Generated reports and analytics
- 🛠️ **Tools**: `tools/README.md` - Development tools guide
- 🗄️ **Database**: `database/README.md` - Database operations
- 📖 **API Docs**: Available when server is running at `/swagger-ui`

## 🔄 Workflow

1. **Development**: Code changes in `src/`
2. **Media Updates**: Run tools in `tools/media-generation/`
3. **Database Changes**: Apply scripts in `database/`
4. **Maintenance**: Use tools in `tools/maintenance/`
5. **Documentation**: Check reports in `docs/reports/`

## 🏗️ Architecture

- **Spring Boot 2.x** - Main application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL/PostgreSQL** - Primary database
- **Maven** - Build and dependency management
