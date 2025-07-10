#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Issues Auto-Creator for LeEnglish TOEIC Project
Automatically creates and manages GitHub issues based on predefined templates
"""

import json
import requests
import os
from datetime import datetime
from typing import List, Dict

class GitHubIssueManager:
    def __init__(self, token: str, repo_owner: str, repo_name: str):
        """
        Initialize GitHub Issue Manager
        
        Args:
            token: GitHub Personal Access Token
            repo_owner: GitHub username/organization
            repo_name: Repository name
        """
        self.token = token
        self.repo_owner = repo_owner
        self.repo_name = repo_name
        self.base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }

    def create_issue(self, title: str, body: str, labels: List[str] = None, assignees: List[str] = None) -> Dict:
        """Create a new GitHub issue"""
        url = f"{self.base_url}/issues"
        
        data = {
            "title": title,
            "body": body,
            "labels": labels or [],
            "assignees": assignees or []
        }
        
        response = requests.post(url, headers=self.headers, json=data)
        
        if response.status_code == 201:
            issue = response.json()
            print(f"✅ Created issue #{issue['number']}: {title}")
            return issue
        else:
            print(f"❌ Failed to create issue: {title}")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return None

    def get_existing_issues(self) -> List[Dict]:
        """Get all existing issues to avoid duplicates"""
        url = f"{self.base_url}/issues"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Failed to fetch existing issues: {response.status_code}")
            return []

    def issue_exists(self, title: str) -> bool:
        """Check if issue with same title already exists"""
        existing_issues = self.get_existing_issues()
        return any(issue['title'] == title for issue in existing_issues)

def generate_leenglish_issues() -> List[Dict]:
    """Generate predefined issues for LeEnglish TOEIC project"""
    issues = []
    
    # 🐛 Critical Bug Issues
    issues.extend([
        {
            "title": "[BUG] Media files not loading in production environment",
            "body": """## 🐛 Bug Description
Media files (images and audio) are not loading properly in the production environment, causing lessons to display without visual and audio content.

## 🔄 Steps to Reproduce
1. Navigate to any lesson page in production
2. Observe that images show "Failed to load image" message
3. Try to play audio - player shows 0:01/0:01 duration
4. Check browser console for 404 errors

## ✅ Expected Behavior
- Images should load from `/files/images/lessons/` endpoints
- Audio should play with correct duration
- No 404 errors in browser console

## ❌ Actual Behavior
- Images fail to load with 404 errors
- Audio files return 404 status
- MediaDebug shows "Error" status for all media

## 📱 Environment
**Frontend:**
- Browser: Chrome 120.0, Firefox 119.0
- OS: Windows 11, macOS
- Device: Desktop, Mobile

**Backend:**
- Java Version: 17
- Spring Boot Version: 3.0.0
- Database: MySQL 8.0

## 🔍 Additional Context
- Issue appears to be related to static resource configuration
- Local development works fine
- Production server may need WebConfig adjustments
- Affects all lesson, exercise, and flashcard media

## 🎯 Priority
- [x] Critical (System down)

## 🏷️ Component
- [x] Backend (Spring Boot)
- [x] Media System""",
            "labels": ["bug", "critical", "media", "backend", "production"],
            "assignees": []
        },
        
        {
            "title": "[BUG] User authentication token expiring prematurely",
            "body": """## 🐛 Bug Description
JWT tokens are expiring much earlier than configured, causing users to be logged out unexpectedly during active sessions.

## 🔄 Steps to Reproduce
1. Log in to the application
2. Use the app normally for 10-15 minutes
3. Try to perform any authenticated action
4. Get redirected to login page despite being within token validity period

## ✅ Expected Behavior
JWT tokens should remain valid for the configured duration (24 hours)

## ❌ Actual Behavior
Tokens expire after ~15 minutes of usage

## 📱 Environment
- All browsers and devices affected
- Both development and production

## 🔍 Additional Context
- JWT configuration in application.properties shows 86400000ms (24h)
- AuthContext may not be refreshing tokens properly
- Could be related to auto-refresh mechanism

## 🎯 Priority
- [x] Critical (Major functionality broken)

## 🏷️ Component
- [x] Backend (Spring Boot)
- [x] Frontend (React)
- [x] Authentication""",
            "labels": ["bug", "critical", "authentication", "backend", "frontend"],
            "assignees": []
        }
    ])

    # ✨ Feature Enhancement Issues
    issues.extend([
        {
            "title": "[FEATURE] Implement spaced repetition for flashcard system",
            "body": """## 🎯 Feature Summary
Implement an intelligent spaced repetition algorithm for flashcards to optimize learning retention based on user performance.

## 💡 Problem Statement
Current flashcard system shows cards randomly without considering:
- User's performance history
- Time since last review
- Difficulty level of individual cards
- Optimal review intervals

## 🚀 Proposed Solution
Implement a spaced repetition system (SRS) similar to Anki:
- Track user performance on each flashcard
- Calculate optimal review intervals based on success rate
- Prioritize cards that need review
- Implement confidence scoring

## 📋 Acceptance Criteria
- [ ] Track user responses (correct/incorrect/difficulty)
- [ ] Calculate next review date for each card
- [ ] Sort flashcards by priority (due for review)
- [ ] Store performance history in database
- [ ] UI shows review schedule and progress
- [ ] Admin can configure SRS parameters

## 🎨 UI/UX Considerations
- [ ] Visual indicators for card difficulty
- [ ] Progress tracking dashboard
- [ ] Review schedule calendar
- [ ] Performance analytics

## 🔧 Technical Considerations
**Frontend:**
- [ ] New flashcard review components
- [ ] Performance tracking UI
- [ ] Analytics dashboard

**Backend:**
- [ ] New database tables for tracking
- [ ] SRS algorithm implementation
- [ ] Performance analytics endpoints

## 📊 Success Metrics
- Improved retention rates
- Increased daily active users
- Higher lesson completion rates

## 🎯 Priority
- [x] High (Core functionality)

## 🏷️ Component
- [x] Frontend (React)
- [x] Backend (Spring Boot)
- [x] Database
- [x] Flashcards""",
            "labels": ["enhancement", "high-priority", "flashcards", "algorithm", "database"],
            "assignees": []
        },

        {
            "title": "[FEATURE] Add comprehensive lesson progress tracking",
            "body": """## 🎯 Feature Summary
Implement detailed progress tracking for lessons including time spent, completion percentage, quiz scores, and learning analytics.

## 💡 Problem Statement
Users need better visibility into their learning progress:
- No tracking of time spent on lessons
- No detailed completion metrics
- No historical progress data
- No performance analytics

## 🚀 Proposed Solution
Comprehensive progress tracking system:
- Track time spent on each lesson
- Record completion percentage for each section
- Store quiz/exercise scores
- Generate learning analytics
- Progress visualization

## 📋 Acceptance Criteria
- [ ] Time tracking for lesson engagement
- [ ] Section-by-section progress recording
- [ ] Quiz score history
- [ ] Weekly/monthly progress reports
- [ ] Achievement badges
- [ ] Progress comparison with other users

## 🎨 UI/UX Considerations
- [ ] Progress bars and charts
- [ ] Achievement celebration animations
- [ ] Detailed analytics dashboard
- [ ] Mobile-friendly progress views

## 📊 Success Metrics
- Increased lesson completion rates
- Higher user engagement time
- Better learning outcomes

## 🎯 Priority
- [x] High (Core functionality)

## 🏷️ Component
- [x] Frontend (React)
- [x] Backend (Spring Boot)
- [x] Database
- [x] Lessons""",
            "labels": ["enhancement", "high-priority", "lessons", "analytics", "database"],
            "assignees": []
        }
    ])

    # 🔧 Technical Improvement Issues
    issues.extend([
        {
            "title": "[TECH] Optimize media loading performance with lazy loading",
            "body": """## 🎯 Technical Improvement
Implement lazy loading for images and audio files to improve initial page load performance and reduce bandwidth usage.

## 💡 Problem Statement
Current media loading strategy:
- All images load immediately on page render
- Large audio files loaded even if not played
- Slow initial page load on mobile connections
- High bandwidth usage

## 🚀 Proposed Solution
- Implement lazy loading for images
- Load audio only when user initiates playback
- Add intersection observer for viewport-based loading
- Implement progressive image loading (blur-to-sharp)

## 📋 Technical Requirements
- [ ] IntersectionObserver for image lazy loading
- [ ] Audio preloading strategies
- [ ] Progressive image enhancement
- [ ] Loading skeleton components
- [ ] Bandwidth-aware loading

## 🎯 Expected Performance Improvements
- 40% faster initial page load
- 60% reduction in initial bandwidth usage
- Better mobile experience
- Improved Core Web Vitals scores

## 🏷️ Component
- [x] Frontend (React)
- [x] Media System
- [x] Performance""",
            "labels": ["enhancement", "performance", "media", "frontend", "optimization"],
            "assignees": []
        },

        {
            "title": "[TECH] Add comprehensive error boundary and error handling",
            "body": """## 🎯 Technical Improvement
Implement comprehensive error boundaries and error handling throughout the application to improve user experience and debugging.

## 💡 Problem Statement
Current error handling is inconsistent:
- No global error boundaries
- Poor error messages for users
- Difficult to debug production issues
- No error reporting/logging

## 🚀 Proposed Solution
- React Error Boundaries for component errors
- Global error handler for API errors
- User-friendly error messages
- Error reporting to monitoring service
- Retry mechanisms for transient failures

## 📋 Technical Requirements
- [ ] React Error Boundary components
- [ ] Global API error interceptor
- [ ] Error logging service integration
- [ ] User-friendly error UI components
- [ ] Retry mechanisms
- [ ] Error reporting dashboard

## 🏷️ Component
- [x] Frontend (React)
- [x] Backend (Spring Boot)
- [x] Infrastructure""",
            "labels": ["enhancement", "reliability", "frontend", "backend", "monitoring"],
            "assignees": []
        }
    ])

    # 🐛 Bug Fix Issues
    issues.extend([
        {
            "title": "[BUG] Audio playback issues on Safari browser",
            "body": """## 🐛 Bug Description
Audio files fail to play properly on Safari browser, affecting lesson and flashcard audio content.

## 🔄 Steps to Reproduce
1. Open application in Safari (desktop or iOS)
2. Navigate to any lesson with audio content
3. Click play button on audio player
4. Observe audio fails to play or plays with distortion

## ✅ Expected Behavior
Audio should play smoothly on all supported browsers

## ❌ Actual Behavior
- Audio fails to start on Safari
- Sometimes plays with distortion
- Duration shows incorrectly

## 📱 Environment
- Safari 16.0+ (macOS)
- Safari on iOS 15+
- All devices affected

## 🔍 Additional Context
- Works fine on Chrome and Firefox
- May be related to audio format compatibility
- Could be CORS or audio codec issue

## 🎯 Priority
- [x] High (Major functionality broken)

## 🏷️ Component
- [x] Frontend (React)
- [x] Media System""",
            "labels": ["bug", "media", "frontend", "browser-compatibility"],
            "assignees": []
        }
    ])

    # 📚 Documentation Issues
    issues.extend([
        {
            "title": "[DOCS] Create comprehensive API documentation with examples",
            "body": """## 📚 Documentation Task
Create comprehensive API documentation for all endpoints with examples, request/response schemas, and usage guidelines.

## 📝 Requirements
- [ ] Document all REST endpoints
- [ ] Include request/response examples
- [ ] Add authentication requirements
- [ ] Provide error code documentation
- [ ] Create Postman collection
- [ ] Add rate limiting information

## 🎯 Deliverables
- Swagger/OpenAPI documentation
- Postman collection export
- README with API overview
- Integration examples

## 🏷️ Component
- [x] Documentation
- [x] Backend (Spring Boot)""",
            "labels": ["documentation", "api", "backend"],
            "assignees": []
        }
    ])

    return issues

def main():
    """Main function to create GitHub issues"""
    print("🚀 LeEnglish TOEIC - GitHub Issues Auto-Creator")
    print("=" * 50)
    
    # Configuration - Update these values
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    REPO_OWNER = "yourusername"  # Update with your GitHub username
    REPO_NAME = "leenglish-toeic"  # Update with your repo name
    
    if not GITHUB_TOKEN:
        print("❌ Error: GITHUB_TOKEN environment variable not set")
        print("   Create a Personal Access Token at: https://github.com/settings/tokens")
        print("   Required scopes: repo, issues")
        return
    
    # Initialize GitHub manager
    github = GitHubIssueManager(GITHUB_TOKEN, REPO_OWNER, REPO_NAME)
    
    # Generate issues
    issues_to_create = generate_leenglish_issues()
    
    print(f"📋 Generated {len(issues_to_create)} issues to create")
    print("🔍 Checking for existing issues...")
    
    created_count = 0
    skipped_count = 0
    
    for issue_data in issues_to_create:
        title = issue_data["title"]
        
        if github.issue_exists(title):
            print(f"⏭️  Skipped (exists): {title}")
            skipped_count += 1
            continue
        
        result = github.create_issue(
            title=title,
            body=issue_data["body"],
            labels=issue_data["labels"],
            assignees=issue_data["assignees"]
        )
        
        if result:
            created_count += 1
    
    print("\n" + "=" * 50)
    print(f"✅ Successfully created: {created_count} issues")
    print(f"⏭️  Skipped (existing): {skipped_count} issues")
    print(f"📊 Total processed: {len(issues_to_create)} issues")
    print("🎉 GitHub Issues Auto-Creation Complete!")

if __name__ == "__main__":
    main()
