# GitHub Issues for LeEnglish TOEIC Platform

## Backend Issues

### [BUG] Database connection timeout on high load

**Labels**: bug, backend, database, high-priority
**Description**: When multiple users access the platform simultaneously, database connections timeout causing 500 errors.
**Steps to Reproduce**:

1. Start backend server
2. Simulate 50+ concurrent API requests
3. Observe database connection errors in logs
   **Environment**: Spring Boot 3.x, MySQL 8.0
   **Priority**: High

### [FEATURE] Add Redis caching for frequently accessed data

**Labels**: enhancement, backend, performance
**Description**: Implement Redis caching to improve API response times for questions and user data.
**User Story**: As a developer, I want to cache frequently accessed data so that API responses are faster.
**Technical Requirements**:

- Install Redis
- Add Spring Data Redis dependency
- Cache questions by section/difficulty
- Cache user profiles
  **Priority**: Medium

### [FEATURE] Implement file upload for question images

**Labels**: enhancement, backend, api
**Description**: Add endpoint to upload images for TOEIC reading comprehension questions.
**Acceptance Criteria**:

- Support PNG, JPG, JPEG formats
- Maximum file size 5MB
- Store in AWS S3 or local storage
- Return image URL in response
  **Priority**: Medium

### [BUG] JWT token expiration not handled properly

**Labels**: bug, backend, security
**Description**: When JWT token expires, the API returns 500 error instead of 401 Unauthorized.
**Expected**: Return 401 with proper error message
**Actual**: Returns 500 Internal Server Error
**Priority**: High

### [FEATURE] Add email notification system

**Labels**: enhancement, backend, notification
**Description**: Implement email notifications for user registration, password reset, and test completion.
**Requirements**:

- SMTP configuration
- Email templates
- Async email sending
- Email verification for registration
  **Priority**: Low

## Frontend Issues

### [FEATURE] Implement responsive design for mobile browsers

**Labels**: enhancement, frontend, ui/ux
**Description**: Optimize the web application for mobile browsers with responsive design.
**User Story**: As a mobile user, I want to access the platform on my phone browser so that I can study on the go.
**Requirements**:

- Mobile-first CSS
- Touch-friendly UI elements
- Optimized navigation for small screens
  **Priority**: High

### [BUG] Login form validation not working correctly

**Labels**: bug, frontend, form-validation
**Description**: Email validation allows invalid email formats and password validation is too permissive.
**Steps to Reproduce**:

1. Go to login page
2. Enter invalid email format
3. Form submits without proper validation
   **Priority**: Medium

### [FEATURE] Add dark mode toggle

**Labels**: enhancement, frontend, ui/ux
**Description**: Implement dark/light theme toggle for better user experience.
**Requirements**:

- Theme toggle switch
- Dark color palette
- Save preference in localStorage
- Smooth theme transition
  **Priority**: Low

### [FEATURE] Implement test timer with visual countdown

**Labels**: enhancement, frontend, user-experience
**Description**: Add visual countdown timer for TOEIC test sessions.
**User Story**: As a test taker, I want to see how much time is remaining so that I can manage my time effectively.
**Requirements**:

- Circular progress indicator
- Time warning at 5 minutes remaining
- Auto-submit when time expires
  **Priority**: High

### [BUG] Question navigation broken on mobile

**Labels**: bug, frontend, mobile, navigation
**Description**: Next/Previous question buttons don't work properly on mobile devices.
**Environment**: Mobile browsers (iOS Safari, Android Chrome)
**Priority**: Medium

## Mobile App Issues

### [FEATURE] Implement offline mode for downloaded tests

**Labels**: enhancement, mobile, offline
**Description**: Allow users to download test questions and take tests offline.
**User Story**: As a mobile user, I want to download tests so that I can study without internet connection.
**Requirements**:

- Local SQLite database
- Download questions API
- Sync results when online
- Progress indicators
  **Priority**: High

### [BUG] Audio playback not working on iOS

**Labels**: bug, mobile, ios, audio
**Description**: Audio files for listening section don't play on iOS devices.
**Environment**: Flutter 3.x, iOS 15+
**Steps to Reproduce**:

1. Start listening test
2. Tap play button
3. No audio plays
   **Priority**: High

### [FEATURE] Add push notifications for study reminders

**Labels**: enhancement, mobile, notifications
**Description**: Send push notifications to remind users to study daily.
**Requirements**:

- Firebase Cloud Messaging
- Notification scheduling
- User preference settings
- Custom notification content
  **Priority**: Medium

### [FEATURE] Implement biometric authentication

**Labels**: enhancement, mobile, security
**Description**: Add fingerprint/face unlock for app access.
**User Story**: As a user, I want to use biometric login so that I can access the app quickly and securely.
**Requirements**:

- Touch ID / Face ID support
- Fallback to PIN/password
- Secure storage of credentials
  **Priority**: Low

## DevOps & Infrastructure Issues

### [TASK] Set up CI/CD pipeline with GitHub Actions

**Labels**: task, devops, ci-cd
**Description**: Implement automated testing and deployment pipeline.
**Requirements**:

- Automated testing on PR
- Build and test all platforms
- Deploy to staging environment
- Deploy to production on main branch
  **Priority**: High

### [TASK] Add Docker configuration for development

**Labels**: task, devops, docker
**Description**: Create Docker Compose setup for easy development environment.
**Requirements**:

- Backend Dockerfile
- Frontend Dockerfile
- MySQL container
- Redis container (when implemented)
- Docker Compose file
  **Priority**: Medium

### [TASK] Set up monitoring and logging

**Labels**: task, devops, monitoring
**Description**: Implement application monitoring and centralized logging.
**Requirements**:

- Application performance monitoring
- Error tracking (Sentry)
- Log aggregation
- Uptime monitoring
  **Priority**: Medium

## Documentation Issues

### [TASK] Create API documentation with Swagger

**Labels**: task, documentation, api
**Description**: Generate comprehensive API documentation using Swagger/OpenAPI.
**Requirements**:

- Swagger UI integration
- Annotate all endpoints
- Include request/response examples
- Authentication documentation
  **Priority**: High

### [TASK] Write deployment guide

**Labels**: task, documentation, deployment
**Description**: Create step-by-step deployment guide for production.
**Requirements**:

- Server requirements
- Database setup
- Environment configuration
- SSL certificate setup
- Backup procedures
  **Priority**: Medium

### [TASK] Create user guide with screenshots

**Labels**: task, documentation, user-guide
**Description**: Write comprehensive user guide for the platform.
**Requirements**:

- Getting started guide
- Feature walkthroughs
- Screenshots and videos
- FAQ section
- Troubleshooting guide
  **Priority**: Low

## Testing Issues

### [TASK] Increase backend test coverage to 80%

**Labels**: task, testing, backend
**Description**: Write unit and integration tests for backend services.
**Current Coverage**: ~40%
**Target Coverage**: 80%
**Requirements**:

- Controller tests
- Service layer tests
- Repository tests
- Integration tests
  **Priority**: High

### [TASK] Add end-to-end tests for critical user flows

**Labels**: task, testing, e2e
**Description**: Implement E2E tests for user registration, login, and test taking.
**Requirements**:

- Cypress or Playwright setup
- User registration flow
- Login flow
- Test taking flow
- Score calculation verification
  **Priority**: Medium

### [TASK] Set up performance testing

**Labels**: task, testing, performance
**Description**: Implement load testing for API endpoints.
**Requirements**:

- JMeter or Artillery setup
- Test scenarios for high load
- Performance benchmarks
- Automated performance monitoring
  **Priority**: Low
