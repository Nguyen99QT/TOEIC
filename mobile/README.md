# Flutter Mobile UI - TOEIC Learning Platform

## Overview

This Flutter mobile application replicates the layout and design of the React.js TypeScript frontend for the LeEnglish TOEIC learning platform. The app provides a modern, professional interface with consistent design patterns and smooth navigation.

## Architecture

### Theme System (`lib/themes/app_theme.dart`)

- **AppColors**: Consistent color palette matching the React frontend
- **AppTextStyles**: Typography system with various text styles (h1-h4, body, caption, etc.)
- **AppSpacing**: Consistent spacing values (xs, sm, md, lg, xl, xxl)
- **AppRadius**: Border radius constants for consistent rounded corners
- **AppShadows**: Shadow styles for cards and elevated elements

### Layout System (`lib/widgets/layout/app_layout.dart`)

- **AppLayout**: Main layout wrapper with AppBar and BottomNavigationBar
- **CustomAppBar**: Reusable app bar component
- Responsive bottom navigation with 5 tabs: Home, Lessons, Flashcards, Exercises, Profile

### Card Components (`lib/widgets/cards/app_cards.dart`)

- **AppCard**: Base card component with consistent styling
- **FeatureCard**: Displays app features with icons and descriptions
- **LessonCard**: Shows lesson information with progress indicators
- **FlashcardSetCard**: Displays flashcard set details with study progress

### Button Components (`lib/widgets/buttons/app_buttons.dart`)

- **AppButton**: Primary button with multiple variants (primary, secondary, outline, text, danger)
- **AppIconButton**: Icon-only button with variant support
- **AppFloatingActionButton**: Floating action button for quick actions

## Screen Structure

### Main Navigation (`lib/screens/main_navigation_screen.dart`)

Central navigation controller that manages:

- PageView for smooth screen transitions
- Bottom navigation state management
- Shared app bar configurations

### Home Screen (`lib/screens/new_home_screen.dart`)

Features a comprehensive dashboard with:

- Welcome section with gradient background
- Rotating feature highlights (auto-rotating every 4 seconds)
- Quick action cards for Practice Test, Listening, and Flashcards
- Recent lessons section with progress indicators
- Flashcard sets overview
- User statistics and progress tracking

### Lessons Screen (`lib/widgets/content/lessons_content.dart`)

Provides lesson management with:

- Search functionality for finding specific lessons
- Category filtering (All, Listening, Reading, Speaking, Writing, Grammar, Vocabulary)
- Lesson cards showing duration, difficulty, and completion status
- Progress tracking with visual indicators

### Flashcards Screen (`lib/widgets/content/flashcards_content.dart`)

Comprehensive flashcard management featuring:

- Progress overview with statistics
- Filter tabs (All, Not Started, In Progress, Completed)
- Study options modal (Study New Cards, Review, Test Mode)
- Create new flashcard set dialog
- Progress tracking and last studied timestamps

## Key Features

### Design Consistency

- Matches React frontend color scheme and typography
- Consistent spacing and layout patterns
- Professional card-based interface
- Smooth animations and transitions

### User Experience

- Intuitive navigation with bottom tabs
- Pull-to-refresh functionality
- Interactive cards with tap feedback
- Modal dialogs for complex actions
- Progress indicators throughout the app

### Responsive Design

- Adaptive layouts for different screen sizes
- Proper spacing and typography scaling
- Touch-friendly interface elements
- Accessible navigation patterns

## Navigation Flow

1. **Home**: Dashboard overview with quick access to all features
2. **Lessons**: Browse and search available lessons with filtering
3. **Flashcards**: Manage flashcard sets and track study progress
4. **Exercises**: Practice tests and exercises (placeholder)
5. **Profile**: User profile and settings (placeholder)

## Technical Implementation

### State Management

- Uses StatefulWidget for local state management
- PageController for smooth screen transitions
- Real-time search and filtering

### Data Models

- `FeatureItem`: App feature descriptions
- `LessonItem`: Lesson data with progress tracking
- `FlashcardSetItem`: Flashcard set information
- `LessonData`: Extended lesson information with categories
- `FlashcardSetData`: Detailed flashcard set data

### Performance Optimizations

- Lazy loading with ListView.builder
- Efficient state updates
- Optimized animations
- Memory-conscious widget disposal

## Getting Started

### Prerequisites

- Flutter SDK (3.0+)
- Dart SDK
- Flutter development environment setup

### Installation

```bash
cd mobile
flutter pub get
flutter run -d [device]
```

### Development

The app supports hot reload for rapid development:

```bash
flutter run --hot
```

## Future Enhancements

- Authentication integration
- Backend API connectivity
- Offline data storage
- Push notifications
- Advanced progress analytics
- Audio playback for lessons
- Real-time synchronization

## Dependencies

- `flutter_riverpod`: State management
- `go_router`: Navigation routing
- Material Design 3 components
- Flutter's built-in animation framework

This Flutter mobile app successfully replicates the React frontend's design and functionality, providing a consistent cross-platform experience for TOEIC learners.
