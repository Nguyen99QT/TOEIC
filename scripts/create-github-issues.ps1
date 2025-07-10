# GitHub Issues Creation Script for LeEnglish TOEIC Platform (PowerShell)
# Make sure you have GitHub CLI installed: https://cli.github.com/

# Set repository
$REPO = "HUYDUU19/leenglish-toeic-platform"

Write-Host "🚀 Creating GitHub Issues for LeEnglish TOEIC Platform..." -ForegroundColor Green

# Function to create issue
function Create-Issue {
    param(
        [string]$Title,
        [string]$Body,
        [string]$Labels
    )
    
    Write-Host "Creating issue: $Title" -ForegroundColor Yellow
    
    gh issue create --repo $REPO --title $Title --body $Body --label $Labels
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Created: $Title" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to create: $Title" -ForegroundColor Red
    }
}

# Backend Issues
Write-Host "📦 Creating Backend Issues..." -ForegroundColor Cyan

Create-Issue -Title "[BACKEND] Implement User Authentication System" -Body @"
## 🔐 Description
Implement complete JWT-based authentication system for the TOEIC platform.

## 📋 Requirements
- [ ] User registration endpoint with validation
- [ ] User login endpoint with JWT token generation  
- [ ] Password encryption with BCrypt
- [ ] Token refresh mechanism
- [ ] User profile management endpoints
- [ ] Role-based access control (Admin, Student)
- [ ] Password reset functionality

## 🎯 Acceptance Criteria
- [ ] All authentication endpoints work correctly
- [ ] JWT tokens are properly generated and validated
- [ ] Passwords are securely encrypted
- [ ] Role-based access is enforced
- [ ] API documentation is updated
- [ ] Tests are added

## 🔗 Technical Details
- **Framework**: Spring Boot + Spring Security
- **Database**: MySQL
- **Token Type**: JWT
- **Encryption**: BCrypt
"@ -Labels "enhancement,backend,security,high-priority"

Create-Issue -Title "[BACKEND] Create Question Management API" -Body @"
## 📝 Description
Develop CRUD operations for TOEIC questions with advanced filtering and management capabilities.

## 📋 Requirements
- [ ] Create question endpoint with validation
- [ ] Get questions with filtering (section, difficulty, type)
- [ ] Update question endpoint
- [ ] Delete question endpoint with soft delete
- [ ] Random question selection algorithm
- [ ] Bulk operations (import/export)
- [ ] Image/audio upload for questions

## 🎯 Acceptance Criteria
- [ ] Full CRUD operations implemented
- [ ] Advanced filtering works correctly
- [ ] File uploads are secure and validated
- [ ] Random selection is properly randomized
- [ ] API is well documented
- [ ] Performance is optimized for large datasets

## 🔗 API Endpoints
- `POST /api/questions` - Create question
- `GET /api/questions` - List with filters
- `GET /api/questions/{id}` - Get single question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question
- `GET /api/questions/random` - Random selection
"@ -Labels "enhancement,backend,api,high-priority"

Create-Issue -Title "[BACKEND] Implement Test Session Management" -Body @"
## 🧪 Description
Create comprehensive test session tracking and scoring system for TOEIC tests.

## 📋 Requirements
- [ ] Start test session endpoint
- [ ] Save user answers in real-time
- [ ] Automatic score calculation
- [ ] Time tracking for sessions
- [ ] Generate detailed test reports
- [ ] Save complete test history
- [ ] Support for different test types (Reading, Listening, Full)

## 🎯 Acceptance Criteria
- [ ] Test sessions are properly tracked
- [ ] Scoring algorithm is accurate
- [ ] Time limits are enforced
- [ ] Reports are comprehensive
- [ ] Data integrity is maintained
- [ ] Performance is optimized

## 🔗 Technical Details
- **Entities**: TestSession, UserAnswer, TestResult
- **Scoring**: Automated based on TOEIC standards
- **Time Tracking**: Server-side validation
"@ -Labels "enhancement,backend,core,medium-priority"

# Frontend Issues
Write-Host "🌐 Creating Frontend Issues..." -ForegroundColor Cyan

Create-Issue -Title "[FRONTEND] Create User Dashboard" -Body @"
## 📊 Description
Build the main user dashboard with comprehensive overview and quick actions.

## 📋 Requirements
- [ ] User statistics overview (scores, tests taken, progress)
- [ ] Recent test results with visual charts
- [ ] Progress visualization with charts/graphs
- [ ] Quick actions (start test, practice modes)
- [ ] Responsive design for all devices
- [ ] Dark/light theme support
- [ ] Personalized recommendations

## 🎯 Acceptance Criteria
- [ ] Dashboard loads quickly with all data
- [ ] Charts and graphs are interactive
- [ ] Mobile responsive design
- [ ] Theme switching works smoothly
- [ ] All quick actions function correctly
- [ ] Performance is optimized

## 🎨 Design Requirements
- **Framework**: Next.js + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js or similar
- **Icons**: Heroicons or Lucide
"@ -Labels "enhancement,frontend,ui,high-priority"

Create-Issue -Title "[FRONTEND] Implement Test Taking Interface" -Body @"
## 🧪 Description
Build interactive and user-friendly test taking interface for TOEIC tests.

## 📋 Requirements
- [ ] Question display with multiple choice options
- [ ] Timer functionality with visual countdown
- [ ] Answer selection and navigation
- [ ] Navigation between questions with progress
- [ ] Audio player for listening sections
- [ ] Review and submit functionality
- [ ] Auto-save progress feature
- [ ] Keyboard shortcuts support

## 🎯 Acceptance Criteria
- [ ] Intuitive and easy to use interface
- [ ] Timer works accurately
- [ ] Audio playback is smooth
- [ ] Progress is saved automatically
- [ ] Submit process is secure
- [ ] Accessible design (WCAG compliant)

## 🔗 Technical Features
- **Audio**: HTML5 audio with custom controls
- **Timer**: Real-time countdown with warnings
- **Navigation**: Question palette with status indicators
- **Auto-save**: Every 30 seconds
"@ -Labels "enhancement,frontend,core,high-priority"

# Mobile Issues
Write-Host "📱 Creating Mobile Issues..." -ForegroundColor Cyan

Create-Issue -Title "[MOBILE] Setup Flutter Project Structure" -Body @"
## 📱 Description
Initialize Flutter app with proper architecture and development setup.

## 📋 Requirements
- [ ] Setup clean architecture project structure
- [ ] Configure state management (Riverpod)
- [ ] Setup API service layer with Dio
- [ ] Add navigation system (Go Router)
- [ ] Configure themes (Material 3)
- [ ] Setup local storage (Hive/SharedPreferences)
- [ ] Add internationalization support

## 🎯 Acceptance Criteria
- [ ] Project structure follows Flutter best practices
- [ ] State management is properly configured
- [ ] API integration is ready
- [ ] Navigation flows work smoothly
- [ ] Themes are consistent
- [ ] Local storage is functional

## 🔗 Technical Stack
- **State Management**: Riverpod
- **HTTP Client**: Dio
- **Navigation**: Go Router
- **Local Storage**: Hive
- **UI**: Material 3
"@ -Labels "task,mobile,setup,high-priority"

# Documentation Issues  
Write-Host "📚 Creating Documentation Issues..." -ForegroundColor Cyan

Create-Issue -Title "[DOCS] Complete API Documentation with Swagger" -Body @"
## 📚 Description
Create comprehensive API documentation using Swagger/OpenAPI specification.

## 📋 Requirements
- [ ] Swagger/OpenAPI setup in Spring Boot
- [ ] All endpoints documented with examples
- [ ] Request/response schemas defined
- [ ] Authentication flow documentation
- [ ] Error codes and responses documented
- [ ] Interactive API testing interface
- [ ] Code generation for client SDKs

## 🎯 Acceptance Criteria
- [ ] All API endpoints are documented
- [ ] Examples are accurate and working
- [ ] Interactive testing works properly
- [ ] Documentation is up-to-date with code
- [ ] Clear and comprehensive descriptions
- [ ] Proper categorization and tagging

## 🔗 Documentation Sections
- **Authentication**: JWT flow and examples
- **Users**: User management endpoints
- **Questions**: Question CRUD operations
- **Tests**: Test session management
- **Analytics**: Progress and reporting
"@ -Labels "documentation,api,medium-priority"

Write-Host "✅ All GitHub Issues created successfully!" -ForegroundColor Green
Write-Host "🔗 Check your repository: https://github.com/$REPO/issues" -ForegroundColor Blue

# Optional: Open the issues page in browser
$openBrowser = Read-Host "Open GitHub issues page in browser? (y/n)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "https://github.com/$REPO/issues"
}
