# LeEnglish TOEIC Learning System - Design Documentation

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Use Case Diagrams](#use-case-diagrams)
- [Sequence Diagrams](#sequence-diagrams)
- [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [System Architecture](#system-architecture)

---

## 🎯 System Overview

LeEnglish TOEIC Learning System is a comprehensive language learning platform with:

- **Backend**: Spring Boot REST API with JWT Authentication
- **Frontend**: React.js with TypeScript
- **Mobile**: Flutter cross-platform app
- **Database**: MySQL with JPA/Hibernate

---

## 👥 Use Case Diagrams

### Main System Use Cases

```mermaid
graph TB
    %% Actors
    A1[Guest User]
    A2[Registered User]
    A3[Collaborator]
    A4[Admin]

    %% System boundary
    subgraph "LeEnglish TOEIC System"
        %% Authentication Use Cases
        UC1[Register Account]
        UC2[Login]
        UC3[Logout]
        UC4[Refresh Token]

        %% Flashcard Use Cases
        UC5[View Public Flashcard Sets]
        UC6[Study Flashcards]
        UC7[Complete Study Session]
        UC8[Create Flashcard Set]
        UC9[Edit Flashcard Set]
        UC10[Delete Flashcard Set]
        UC11[Search Flashcards]

        %% Lesson Use Cases
        UC12[View Free Lessons]
        UC13[Take Lesson]
        UC14[Complete Lesson]
        UC15[Create Lesson]
        UC16[Edit Lesson]

        %% Exercise Use Cases
        UC17[View Free Exercises]
        UC18[Take Exercise]
        UC19[Submit Exercise]
        UC20[View Exercise Results]
        UC21[Create Exercise]
        UC22[Edit Exercise]

        %% Progress Use Cases
        UC23[View User Progress]
        UC24[Track Study Statistics]
        UC25[Generate Progress Report]

        %% Media Use Cases
        UC26[Play Audio]
        UC27[View Images]
        UC28[Upload Media]
        UC29[Manage Media Library]

        %% Admin Use Cases
        UC30[Manage Users]
        UC31[System Administration]
        UC32[View System Analytics]
    end

    %% Relationships - Guest User
    A1 --> UC1
    A1 --> UC2
    A1 --> UC5
    A1 --> UC6
    A1 --> UC12
    A1 --> UC17
    A1 --> UC26
    A1 --> UC27

    %% Relationships - Registered User
    A2 --> UC3
    A2 --> UC4
    A2 --> UC7
    A2 --> UC11
    A2 --> UC13
    A2 --> UC14
    A2 --> UC18
    A2 --> UC19
    A2 --> UC20
    A2 --> UC23
    A2 --> UC24

    %% Relationships - Collaborator (inherits User + additional)
    A3 --> UC8
    A3 --> UC9
    A3 --> UC10
    A3 --> UC15
    A3 --> UC16
    A3 --> UC21
    A3 --> UC22
    A3 --> UC28
    A3 --> UC29

    %% Relationships - Admin (inherits all + additional)
    A4 --> UC30
    A4 --> UC31
    A4 --> UC32
    A4 --> UC25
```

### Detailed Flashcard Study Use Case

```mermaid
graph LR
    A[User] --> UC1[Select Flashcard Set]
    UC1 --> UC2[Load Flashcard Data]
    UC2 --> UC3[Display First Card]
    UC3 --> UC4[Show Question/Term]
    UC4 --> UC5[User Flips Card]
    UC5 --> UC6[Show Answer/Definition]
    UC6 --> UC7[Navigate to Next/Previous]
    UC7 --> UC8{More Cards?}
    UC8 -->|Yes| UC4
    UC8 -->|No| UC9[Finish Study Session]
    UC9 --> UC10[Record Study Statistics]
    UC10 --> UC11[Return to Flashcard List]
```

---

## 🔄 Sequence Diagrams

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant JWTService

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Validate user credentials
    Database-->>Backend: User data
    Backend->>JWTService: Generate tokens
    JWTService-->>Backend: Access & Refresh tokens
    Backend-->>Frontend: Authentication response
    Frontend->>Frontend: Store tokens in localStorage
    Frontend-->>User: Redirect to dashboard

    Frontend->>Backend: API request with Authorization header
    Backend->>JWTService: Validate access token
    JWTService-->>Backend: Token validation result
    alt Token valid
        Backend-->>Frontend: API response
    else Token expired
        Frontend->>Backend: POST /api/auth/refresh
        Backend->>JWTService: Generate new access token
        JWTService-->>Backend: New access token
        Backend-->>Frontend: New token response
        Frontend->>Frontend: Update localStorage
        Frontend->>Backend: Retry original request
        Backend-->>Frontend: API response
    end
```

### 2. Flashcard Study Session Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant MediaServer

    User->>Frontend: Navigate to study page
    Frontend->>Backend: GET /api/flashcard-sets/{id}
    Backend->>Database: Query flashcard set
    Database-->>Backend: Flashcard set data
    Backend-->>Frontend: Flashcard set response

    Frontend->>Backend: GET /api/flashcards/sets/{id}/flashcards
    Backend->>Database: Query flashcards
    Database-->>Backend: Flashcard list
    Backend-->>Frontend: Flashcard data

    Frontend->>Frontend: Initialize study session
    Frontend-->>User: Display first flashcard

    loop For each flashcard
        User->>Frontend: View card question
        User->>Frontend: Flip card
        Frontend-->>User: Show answer

        opt Audio available
            Frontend->>MediaServer: Request audio file
            MediaServer-->>Frontend: Audio stream
            Frontend-->>User: Play pronunciation
        end

        User->>Frontend: Navigate to next card
    end

    User->>Frontend: Finish study session
    Frontend->>Backend: POST /api/flashcards/sets/{id}/complete
    Backend->>Database: Save study statistics
    Database-->>Backend: Confirmation
    Backend-->>Frontend: Success response
    Frontend-->>User: Navigate to flashcard list
```

### 3. Exercise Taking Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Select exercise
    Frontend->>Backend: GET /api/exercises/{id}
    Backend->>Database: Query exercise data
    Database-->>Backend: Exercise questions
    Backend-->>Frontend: Exercise data

    Frontend-->>User: Display exercise questions

    loop For each question
        User->>Frontend: Select answer
        Frontend->>Frontend: Store answer locally
    end

    User->>Frontend: Submit exercise
    Frontend->>Backend: POST /api/exercises/{id}/submit
    Backend->>Backend: Calculate score
    Backend->>Database: Save exercise result
    Database-->>Backend: Confirmation
    Backend-->>Frontend: Results with score
    Frontend-->>User: Display results page
```

### 4. Media Serving Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant FileSystem
    participant SecurityConfig

    Frontend->>Backend: Request /audio/apple.mp3
    Backend->>SecurityConfig: Check security configuration
    SecurityConfig-->>Backend: Permit without JWT required
    Backend->>FileSystem: Read audio file
    FileSystem-->>Backend: Audio stream
    Backend-->>Frontend: Audio file response
    Frontend->>Frontend: Play audio in browser

    Frontend->>Backend: Request /images/flashcard1.jpg
    Backend->>SecurityConfig: Check security configuration
    SecurityConfig-->>Backend: Permit without JWT required
    Backend->>FileSystem: Read image file
    FileSystem-->>Backend: Image data
    Backend-->>Frontend: Image response
```

---

## 🗄️ Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    %% User Management
    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        enum role "USER, COLLABORATOR, ADMIN"
        datetime created_at
        datetime updated_at
        boolean active
    }

    %% Flashcard System
    FLASHCARD_SETS {
        bigint id PK
        varchar name
        text description
        enum difficulty "BEGINNER, INTERMEDIATE, ADVANCED"
        varchar category
        bigint created_by FK
        datetime created_at
        datetime updated_at
        boolean is_public
        integer card_count
    }

    FLASHCARDS {
        bigint id PK
        bigint set_id FK
        varchar front_text
        varchar back_text
        text hint
        varchar image_url
        varchar audio_url
        integer order_index
        datetime created_at
        datetime updated_at
    }

    %% Lesson System
    LESSONS {
        bigint id PK
        varchar title
        text content
        text description
        enum difficulty "BEGINNER, INTERMEDIATE, ADVANCED"
        varchar category
        bigint created_by FK
        datetime created_at
        datetime updated_at
        boolean is_free
        integer duration_minutes
    }

    %% Exercise System
    EXERCISES {
        bigint id PK
        varchar title
        text description
        enum type "MULTIPLE_CHOICE, FILL_BLANK, LISTENING"
        enum difficulty "BEGINNER, INTERMEDIATE, ADVANCED"
        bigint lesson_id FK
        bigint created_by FK
        datetime created_at
        datetime updated_at
        boolean is_free
        integer time_limit_minutes
    }

    QUESTIONS {
        bigint id PK
        bigint exercise_id FK
        text question_text
        varchar question_type
        text correct_answer
        json options
        text explanation
        varchar image_url
        varchar audio_url
        integer points
        integer order_index
    }

    %% Progress Tracking
    USER_PROGRESS {
        bigint id PK
        bigint user_id FK
        varchar progress_type "FLASHCARD, LESSON, EXERCISE"
        bigint target_id
        enum status "IN_PROGRESS, COMPLETED, PAUSED"
        integer score
        integer total_questions
        integer correct_answers
        datetime started_at
        datetime completed_at
        json additional_data
    }

    STUDY_SESSIONS {
        bigint id PK
        bigint user_id FK
        bigint flashcard_set_id FK
        datetime started_at
        datetime completed_at
        integer duration_minutes
        integer cards_studied
        json ratings
        json study_data
    }

    EXERCISE_RESULTS {
        bigint id PK
        bigint user_id FK
        bigint exercise_id FK
        integer score
        integer total_questions
        integer correct_answers
        datetime started_at
        datetime completed_at
        json answers
        integer time_taken_minutes
    }

    %% Relationships
    USERS ||--o{ FLASHCARD_SETS : creates
    USERS ||--o{ LESSONS : creates
    USERS ||--o{ EXERCISES : creates
    USERS ||--o{ USER_PROGRESS : tracks
    USERS ||--o{ STUDY_SESSIONS : participates
    USERS ||--o{ EXERCISE_RESULTS : achieves

    FLASHCARD_SETS ||--o{ FLASHCARDS : contains
    FLASHCARD_SETS ||--o{ STUDY_SESSIONS : used_in

    LESSONS ||--o{ EXERCISES : includes
    LESSONS ||--o{ USER_PROGRESS : tracked_in

    EXERCISES ||--o{ QUESTIONS : contains
    EXERCISES ||--o{ EXERCISE_RESULTS : generates
    EXERCISES ||--o{ USER_PROGRESS : tracked_in
```

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[React Frontend<br/>Port 3000]
        MOBILE[Flutter Mobile<br/>iOS/Android]
    end

    subgraph "API Gateway Layer"
        LB[Load Balancer<br/>Nginx]
    end

    subgraph "Application Layer"
        API[Spring Boot API<br/>Port 8080]
        AUTH[JWT Authentication<br/>Filter Chain]
        MEDIA[Media Server<br/>Static Resources]
    end

    subgraph "Security Layer"
        JWT_SVC[JWT Service<br/>Token Management]
        SEC_CONFIG[Security Config<br/>Authorization Rules]
    end

    subgraph "Business Layer"
        FLASHCARD_SVC[Flashcard Service]
        LESSON_SVC[Lesson Service]
        EXERCISE_SVC[Exercise Service]
        USER_SVC[User Service]
        PROGRESS_SVC[Progress Service]
    end

    subgraph "Data Layer"
        DB[(MySQL Database<br/>Port 3306)]
        FS[File System<br/>Audio/Images]
    end

    %% Client connections
    WEB --> LB
    MOBILE --> LB

    %% Load balancer
    LB --> API

    %% API layer
    API --> AUTH
    API --> MEDIA
    API --> JWT_SVC
    API --> SEC_CONFIG

    %% Business services
    API --> FLASHCARD_SVC
    API --> LESSON_SVC
    API --> EXERCISE_SVC
    API --> USER_SVC
    API --> PROGRESS_SVC

    %% Data connections
    FLASHCARD_SVC --> DB
    LESSON_SVC --> DB
    EXERCISE_SVC --> DB
    USER_SVC --> DB
    PROGRESS_SVC --> DB
    MEDIA --> FS

    %% Security flow
    AUTH --> JWT_SVC
    AUTH --> SEC_CONFIG
```

### API Security Flow

```mermaid
graph LR
    REQ[HTTP Request] --> JWT_FILTER[JWT Authentication Filter]
    JWT_FILTER --> CHECK{Has Valid JWT?}

    CHECK -->|Yes| AUTH_CTX[Set Security Context]
    CHECK -->|No| PUBLIC{Public Endpoint?}

    PUBLIC -->|Yes| SKIP[Skip Authentication]
    PUBLIC -->|No| UNAUTHORIZED[401 Unauthorized]

    AUTH_CTX --> AUTHORIZE{Has Permission?}
    AUTHORIZE -->|Yes| CONTROLLER[Controller Method]
    AUTHORIZE -->|No| FORBIDDEN[403 Forbidden]

    SKIP --> CONTROLLER
    CONTROLLER --> RESPONSE[HTTP Response]

    %% Token refresh flow
    UNAUTHORIZED --> REFRESH{Has Refresh Token?}
    REFRESH -->|Yes| NEW_TOKEN[Generate New Token]
    REFRESH -->|No| LOGIN[Redirect to Login]
    NEW_TOKEN --> RETRY[Retry Request]
    RETRY --> JWT_FILTER
```

---

## 📁 Project Structure

```
LeEnglish-TOEIC-System/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/leenglish/toeic/
│   │   ├── controller/         # REST Controllers
│   │   ├── service/           # Business Logic
│   │   ├── repository/        # Data Access Layer
│   │   ├── entity/           # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── config/           # Configuration Classes
│   │   └── security/         # Security Implementation
│   ├── src/main/resources/
│   │   ├── static/           # Static Resources
│   │   └── application.properties
│   ├── audio/                # Audio files
│   ├── images/               # Image files
│   └── pom.xml
├── frontend/                  # React.js Frontend
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Page Components
│   │   ├── services/        # API Services
│   │   ├── contexts/        # React Contexts
│   │   ├── types/           # TypeScript Types
│   │   └── utils/           # Utility Functions
│   ├── public/              # Public Assets
│   └── package.json
├── mobile/                   # Flutter Mobile App
│   ├── lib/
│   │   ├── models/          # Data Models
│   │   ├── screens/         # UI Screens
│   │   ├── services/        # API Services
│   │   ├── providers/       # State Management
│   │   └── main.dart
│   ├── assets/              # Mobile Assets
│   └── pubspec.yaml
└── docs/                    # Documentation
    ├── SYSTEM_DESIGN.md     # This file
    ├── API_DOCUMENTATION.md
    └── USER_GUIDE.md
```

---

## 🔗 Key Technologies

- **Backend**: Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL
- **Frontend**: React.js, TypeScript, Tailwind CSS, Axios
- **Mobile**: Flutter, Dart
- **Authentication**: JWT with refresh token mechanism
- **Media**: Static file serving with Spring Boot
- **Database**: MySQL with proper indexing and relationships
- **Security**: Role-based access control (USER, COLLABORATOR, ADMIN)

---

_This documentation provides a comprehensive overview of the LeEnglish TOEIC Learning System architecture and design patterns._
