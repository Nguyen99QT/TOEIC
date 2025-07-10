#!/bin/bash

# GitHub Issues Creation Script for LeEnglish TOEIC Platform
# Make sure you have GitHub CLI installed: https://cli.github.com/

# Set repository (change if needed)
REPO="HUYDUU19/leenglish-toeic-platform"

echo "🚀 Creating GitHub Issues for LeEnglish TOEIC Platform..."

# Backend Issues
echo "📦 Creating Backend Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[BACKEND] Implement User Authentication System" \
  --body "## 🔐 Description
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
- **Encryption**: BCrypt" \
  --label "enhancement,backend,security,high-priority"

gh issue create \
  --repo "$REPO" \
  --title "[BACKEND] Create Question Management API" \
  --body "## 📝 Description
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
- \`POST /api/questions\` - Create question
- \`GET /api/questions\` - List with filters
- \`GET /api/questions/{id}\` - Get single question
- \`PUT /api/questions/{id}\` - Update question
- \`DELETE /api/questions/{id}\` - Delete question
- \`GET /api/questions/random\` - Random selection" \
  --label "enhancement,backend,api,high-priority"

gh issue create \
  --repo "$REPO" \
  --title "[BACKEND] Implement Test Session Management" \
  --body "## 🧪 Description
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
- **Time Tracking**: Server-side validation" \
  --label "enhancement,backend,core,medium-priority"

# Frontend Issues
echo "🌐 Creating Frontend Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[FRONTEND] Create User Dashboard" \
  --body "## 📊 Description
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
- **Icons**: Heroicons or Lucide" \
  --label "enhancement,frontend,ui,high-priority"

gh issue create \
  --repo "$REPO" \
  --title "[FRONTEND] Implement Test Taking Interface" \
  --body "## 🧪 Description
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
- **Auto-save**: Every 30 seconds" \
  --label "enhancement,frontend,core,high-priority"

# Mobile Issues
echo "📱 Creating Mobile Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[MOBILE] Setup Flutter Project Structure" \
  --body "## 📱 Description
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
- **UI**: Material 3" \
  --label "task,mobile,setup,high-priority"

gh issue create \
  --repo "$REPO" \
  --title "[MOBILE] Implement Mobile Authentication" \
  --body "## 🔐 Description
Create mobile authentication screens with modern UX/UI design.

## 📋 Requirements
- [ ] Login screen with validation and error handling
- [ ] Registration screen with form validation
- [ ] Biometric authentication (fingerprint/face)
- [ ] Remember me functionality with secure storage
- [ ] Social login integration (Google, Facebook)
- [ ] Logout functionality with session cleanup
- [ ] Password reset flow

## 🎯 Acceptance Criteria
- [ ] Smooth and intuitive user experience
- [ ] Secure credential storage
- [ ] Biometric authentication works on supported devices
- [ ] Social login integration is seamless
- [ ] Error handling is user-friendly
- [ ] Accessibility features included

## 🎨 Design Requirements
- **UI Framework**: Flutter Material 3
- **Animations**: Smooth transitions
- **Validation**: Real-time form validation
- **Security**: Encrypted local storage" \
  --label "enhancement,mobile,auth,high-priority"

# Database Issues
echo "🗄️ Creating Database Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[DATABASE] Design Complete Database Schema" \
  --body "## 🗄️ Description
Design comprehensive database schema for the TOEIC learning platform.

## 📋 Requirements
- [ ] User management tables (users, roles, permissions)
- [ ] Question bank tables with relationships
- [ ] Test session and results tables
- [ ] User progress and analytics tables
- [ ] Performance indexes for optimization
- [ ] Data migration scripts
- [ ] Foreign key constraints and data integrity

## 🎯 Acceptance Criteria
- [ ] Schema supports all application features
- [ ] Proper normalization and relationships
- [ ] Indexes for performance optimization
- [ ] Data integrity constraints
- [ ] Migration scripts are tested
- [ ] Documentation is complete

## 🔗 Main Entities
- **User**: Authentication and profile data
- **Question**: TOEIC questions with metadata
- **TestSession**: Test tracking and timing
- **UserAnswer**: User responses
- **TestResult**: Calculated scores and analytics" \
  --label "task,database,architecture,high-priority"

# DevOps Issues
echo "🔧 Creating DevOps Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[DEVOPS] Setup CI/CD Pipeline" \
  --body "## 🔧 Description
Setup automated CI/CD pipeline for continuous integration and deployment.

## 📋 Requirements
- [ ] GitHub Actions workflow configuration
- [ ] Automated testing for all components
- [ ] Build verification and artifact creation
- [ ] Automated deployment to staging/production
- [ ] Environment-specific configurations
- [ ] Security scanning and vulnerability checks
- [ ] Notification system for build status

## 🎯 Acceptance Criteria
- [ ] All tests run automatically on PR
- [ ] Builds are created for each component
- [ ] Deployments are automated and reliable
- [ ] Security checks pass
- [ ] Notifications work properly
- [ ] Rollback mechanism is available

## 🔗 Pipeline Stages
1. **Lint & Test**: Code quality and unit tests
2. **Build**: Create artifacts for each component
3. **Security**: Vulnerability scanning
4. **Deploy**: Automated deployment
5. **Verify**: Post-deployment health checks" \
  --label "task,devops,automation,medium-priority"

# Documentation Issues
echo "📚 Creating Documentation Issues..."

gh issue create \
  --repo "$REPO" \
  --title "[DOCS] Complete API Documentation with Swagger" \
  --body "## 📚 Description
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
- **Analytics**: Progress and reporting" \
  --label "documentation,api,medium-priority"

echo "✅ All GitHub Issues created successfully!"
echo "🔗 Check your repository: https://github.com/$REPO/issues"
