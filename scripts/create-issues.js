#!/usr/bin/env node

/**
 * GitHub Issues Creator Script
 * Creates issues for LeEnglish TOEIC Platform
 */

const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

// Configuration
const REPO_OWNER = "HUYDUU19";
const REPO_NAME = "leenglish-toeic-platform";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ Please set GITHUB_TOKEN environment variable");
  console.log("Get token from: https://github.com/settings/tokens");
  process.exit(1);
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Issue definitions
const issues = [
  // Backend Issues
  {
    title: "[BUG] Database connection timeout on high load",
    body: `## 🐛 Bug Description
When multiple users access the platform simultaneously, database connections timeout causing 500 errors.

## 🔄 Steps to Reproduce
1. Start backend server
2. Simulate 50+ concurrent API requests  
3. Observe database connection errors in logs

## ✅ Expected Behavior
Database should handle concurrent connections properly

## ❌ Actual Behavior
Connection timeout errors occur under load

## 🌐 Environment
- Backend: Spring Boot 3.x
- Database: MySQL 8.0
- Connection Pool: Default HikariCP

## 📋 Additional Context
Need to configure proper connection pool settings and implement connection retry logic.

## ✋ Acceptance Criteria
- [ ] Configure optimal connection pool size
- [ ] Add connection retry mechanism
- [ ] Add monitoring for connection metrics
- [ ] Load test to verify fix`,
    labels: ["bug", "backend", "database", "high-priority"],
  },

  {
    title: "[FEATURE] Add Redis caching for frequently accessed data",
    body: `## 🚀 Feature Description
Implement Redis caching to improve API response times for questions and user data.

## 🎯 Problem Statement
Current API responses are slow due to repeated database queries for the same data.

## 💡 Proposed Solution
Add Redis caching layer for:
- Questions by section/difficulty
- User profiles
- Leaderboard data

## 🔄 User Story
As a developer, I want to cache frequently accessed data so that API responses are faster.

## 📱 Platform
- [x] Backend (Spring Boot API)

## 🔧 Technical Considerations
- Implementation complexity: Medium
- Breaking changes: No
- Database changes required: No
- Third-party services needed: Redis

## 📋 Acceptance Criteria
- [ ] Redis dependency added
- [ ] Cache configuration implemented
- [ ] Question caching added
- [ ] User profile caching added
- [ ] Cache invalidation strategy implemented
- [ ] Performance tests show improvement`,
    labels: ["enhancement", "backend", "performance"],
  },

  {
    title: "[FEATURE] Implement responsive design for mobile browsers",
    body: `## 🚀 Feature Description
Optimize the web application for mobile browsers with responsive design.

## 🎯 Problem Statement
Current web app is not optimized for mobile devices, making it difficult to use on phones.

## 💡 Proposed Solution
Implement mobile-first responsive design with:
- Flexible grid layout
- Touch-friendly UI elements
- Optimized navigation for small screens

## 🔄 User Story
As a mobile user, I want to access the platform on my phone browser so that I can study on the go.

## 📱 Platform
- [x] Frontend (Next.js Web App)

## 🔧 Technical Considerations
- Implementation complexity: Medium
- Breaking changes: No
- Requires CSS refactoring: Yes

## 📋 Acceptance Criteria
- [ ] Mobile-first CSS implemented
- [ ] Touch-friendly buttons (min 44px)
- [ ] Responsive navigation menu
- [ ] Test forms work on mobile
- [ ] Images scale properly
- [ ] Text is readable without zooming`,
    labels: ["enhancement", "frontend", "ui/ux", "mobile"],
  },

  {
    title: "[FEATURE] Implement offline mode for downloaded tests",
    body: `## 🚀 Feature Description
Allow users to download test questions and take tests offline.

## 🎯 Problem Statement
Users want to study without internet connection, especially when traveling.

## 💡 Proposed Solution
Implement offline capability with:
- Local SQLite database
- Download questions API
- Sync results when online

## 🔄 User Story
As a mobile user, I want to download tests so that I can study without internet connection.

## 📱 Platform
- [x] Mobile (Flutter App)

## 🔧 Technical Considerations
- Implementation complexity: High
- Breaking changes: No
- Database changes required: Yes (offline schema)
- Local storage: SQLite

## 📋 Acceptance Criteria
- [ ] SQLite database setup
- [ ] Download questions API
- [ ] Offline test taking functionality
- [ ] Result synchronization when online
- [ ] Progress indicators for downloads
- [ ] Storage management (delete old tests)`,
    labels: ["enhancement", "mobile", "offline", "high-priority"],
  },

  {
    title: "[BUG] JWT token expiration not handled properly",
    body: `## 🐛 Bug Description
When JWT token expires, the API returns 500 error instead of 401 Unauthorized.

## 🔄 Steps to Reproduce
1. Login to get JWT token
2. Wait for token to expire (or manually use expired token)
3. Make API request with expired token
4. Observe 500 error instead of 401

## ✅ Expected Behavior
Should return 401 Unauthorized with proper error message

## ❌ Actual Behavior
Returns 500 Internal Server Error

## 🌐 Environment
- Backend: Spring Boot 3.x
- Security: Spring Security + JWT

## 🔍 Error Logs
\`\`\`
java.lang.NullPointerException: JWT token validation failed
\`\`\`

## 📋 Additional Context
Frontend should handle 401 errors to redirect to login page.

## ✋ Acceptance Criteria
- [ ] Proper 401 response for expired tokens
- [ ] Consistent error message format
- [ ] Frontend handles 401 correctly
- [ ] Unit tests for token validation`,
    labels: ["bug", "backend", "security", "high-priority"],
  },

  {
    title: "[TASK] Set up CI/CD pipeline with GitHub Actions",
    body: `## 📋 Task Description
Implement automated testing and deployment pipeline using GitHub Actions.

## 🎯 Requirements
- Automated testing on pull requests
- Build and test all platforms (Backend, Frontend, Mobile)
- Deploy to staging environment
- Deploy to production on main branch

## 🔧 Technical Implementation
1. **Backend Pipeline**:
   - Maven test and build
   - Docker image creation
   - Deploy to staging/production

2. **Frontend Pipeline**:
   - npm test and build
   - Deploy to Vercel/Netlify
   - Environment-specific builds

3. **Mobile Pipeline**:
   - Flutter test
   - Build APK for Android
   - Build for iOS (if applicable)

## 📋 Acceptance Criteria
- [ ] GitHub Actions workflow files created
- [ ] Backend CI/CD pipeline working
- [ ] Frontend CI/CD pipeline working
- [ ] Mobile build pipeline working
- [ ] Staging environment configured
- [ ] Production deployment process documented
- [ ] Rollback procedure defined`,
    labels: ["task", "devops", "ci-cd", "high-priority"],
  },

  {
    title: "[TASK] Create API documentation with Swagger",
    body: `## 📋 Task Description
Generate comprehensive API documentation using Swagger/OpenAPI.

## 🎯 Requirements
- Swagger UI integration with Spring Boot
- Document all endpoints with examples
- Include authentication documentation
- Interactive API testing

## 🔧 Technical Implementation
1. Add Swagger dependencies to pom.xml
2. Configure Swagger in Spring Boot
3. Annotate all controllers
4. Add request/response examples
5. Document authentication flow

## 📋 Acceptance Criteria
- [ ] Swagger UI accessible at /swagger-ui.html
- [ ] All endpoints documented
- [ ] Request/response examples included
- [ ] Authentication documentation
- [ ] Error response documentation
- [ ] Try-it-out functionality working`,
    labels: ["task", "documentation", "api", "high-priority"],
  },

  {
    title: "[FEATURE] Add push notifications for study reminders",
    body: `## 🚀 Feature Description
Send push notifications to remind users to study daily.

## 🎯 Problem Statement
Users need reminders to maintain consistent study habits.

## 💡 Proposed Solution
Implement push notifications using Firebase Cloud Messaging:
- Daily study reminders
- Test completion notifications
- Achievement notifications

## 🔄 User Story
As a user, I want to receive study reminders so that I can maintain consistent practice.

## 📱 Platform
- [x] Mobile (Flutter App)

## 🔧 Technical Considerations
- Implementation complexity: Medium
- Third-party services needed: Firebase Cloud Messaging
- Permissions required: Notification permission

## 📋 Acceptance Criteria
- [ ] Firebase FCM integration
- [ ] Notification scheduling
- [ ] User preference settings
- [ ] Custom notification content
- [ ] Handle notification taps
- [ ] Notification history`,
    labels: ["enhancement", "mobile", "notifications"],
  },
];

async function createIssues() {
  console.log("🚀 Starting to create GitHub issues...");
  console.log(`📦 Repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`📝 Issues to create: ${issues.length}`);
  console.log();

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];

    try {
      console.log(
        `📋 Creating issue ${i + 1}/${issues.length}: ${issue.title}`
      );

      const response = await octokit.rest.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
      });

      console.log(`✅ Created: #${response.data.number} - ${issue.title}`);
      console.log(`🔗 URL: ${response.data.html_url}`);
      console.log();

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to create issue: ${issue.title}`);
      console.error(`Error: ${error.message}`);
      console.log();
    }
  }

  console.log("🎉 Finished creating issues!");
  console.log(
    `🔗 View all issues: https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`
  );
}

// Run the script
createIssues().catch((error) => {
  console.error("❌ Script failed:", error.message);
  process.exit(1);
});
