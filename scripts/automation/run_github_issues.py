#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick GitHub Issues Creator for LeEnglish TOEIC Project
Simplified version to create essential issues immediately
"""

import os
import json
import requests
from datetime import datetime

def create_quick_issues():
    """Create essential GitHub issues for LeEnglish project"""
    
    # Get environment variables
    github_token = os.getenv('GITHUB_TOKEN')
    repo_owner = os.getenv('GITHUB_REPO_OWNER', 'HUYDUU19')  # Your GitHub username
    repo_name = os.getenv('GITHUB_REPO_NAME', 'leenglish-toeic-platform')  # Your repo name
    
    if not github_token:
        print("❌ GITHUB_TOKEN not found in environment variables")
        print("💡 Please set GITHUB_TOKEN environment variable or edit this script")
        
        # Fallback - ask user to enter token
        print("\nOptions:")
        print("1. Set environment variable: set GITHUB_TOKEN=your_token_here")
        print("2. Or provide token now (not recommended for security)")
        
        token_input = input("\nEnter GitHub token (or press Enter to skip): ").strip()
        if token_input:
            github_token = token_input
        else:
            print("⏭️ Skipping GitHub issue creation - no token provided")
            return
    
    print(f"🔧 Using repo: {repo_owner}/{repo_name}")
    print(f"🔑 Token length: {len(github_token)} chars")
    
    # Essential issues to create
    essential_issues = [
        {
            "title": "🐛 [CRITICAL] Media files not loading in production",
            "body": """## 🐛 Critical Bug
Media files (images/audio) are not loading in production environment.

### 🔍 Investigation needed:
- [ ] Check backend static file serving configuration
- [ ] Verify file paths and URL mapping
- [ ] Test CORS and access permissions
- [ ] Validate media file existence

### 📍 Files to check:
- `WebConfig.java` - static resource mapping
- `application.properties` - server configuration  
- `/static/audio/` and `/static/images/` directories
- Frontend MediaService URL construction

### 🎯 Priority: HIGH
**This blocks user experience completely**
""",
            "labels": ["bug", "critical", "production", "media"]
        },
        {
            "title": "🚀 [FEATURE] Media optimization and caching",
            "body": """## 🚀 Enhancement Request
Implement media optimization and caching strategy.

### 📋 Tasks:
- [ ] Add image compression and resizing
- [ ] Implement lazy loading for images
- [ ] Add audio file optimization (bitrate, format)
- [ ] Set up browser caching headers
- [ ] Consider CDN integration
- [ ] Add progressive image loading

### 🎯 Benefits:
- Faster page load times
- Reduced bandwidth usage
- Better mobile experience
- Improved SEO scores

### 📍 Files to modify:
- Backend: WebConfig.java, MediaController
- Frontend: MediaService, AuthenticatedMedia component
""",
            "labels": ["enhancement", "performance", "media", "optimization"]
        },
        {
            "title": "📚 [DOCS] Complete API documentation",
            "body": """## 📚 Documentation Task
Create comprehensive API documentation for LeEnglish TOEIC backend.

### 📋 Required Documentation:
- [ ] REST API endpoints (lessons, exercises, flashcards)
- [ ] Authentication flow and JWT usage
- [ ] Media serving endpoints
- [ ] Request/Response examples
- [ ] Error codes and handling
- [ ] Rate limiting information

### 🛠️ Tools to use:
- Swagger/OpenAPI specification
- Postman collection updates
- README.md updates

### 📍 Deliverables:
- Updated Swagger annotations in controllers
- API documentation website
- Updated Postman collection
""",
            "labels": ["documentation", "api", "backend"]
        },
        {
            "title": "🧪 [TEST] Implement comprehensive test suite",
            "body": """## 🧪 Testing Initiative
Implement comprehensive testing for frontend and backend.

### 🎯 Frontend Tests:
- [ ] Unit tests for components
- [ ] Integration tests for media loading
- [ ] E2E tests for user flows
- [ ] Media service tests
- [ ] Authentication tests

### 🎯 Backend Tests:
- [ ] Unit tests for services and controllers
- [ ] Integration tests for API endpoints
- [ ] Media serving tests
- [ ] Authentication and authorization tests
- [ ] Database integration tests

### 📊 Coverage Goals:
- Frontend: 80%+ code coverage
- Backend: 85%+ code coverage

### 🛠️ Tools:
- Frontend: Jest, React Testing Library, Cypress
- Backend: JUnit, MockMvc, TestContainers
""",
            "labels": ["testing", "quality", "frontend", "backend"]
        },
        {
            "title": "🔒 [SECURITY] Security audit and improvements",
            "body": """## 🔒 Security Review
Conduct security audit and implement security improvements.

### 🔍 Areas to Review:
- [ ] JWT token security (expiration, refresh)
- [ ] API rate limiting and DDoS protection
- [ ] Input validation and sanitization
- [ ] File upload security (media files)
- [ ] CORS configuration
- [ ] HTTPS enforcement
- [ ] Environment variable security

### 📋 Security Tasks:
- [ ] Implement request rate limiting
- [ ] Add input validation middleware
- [ ] Secure media file uploads
- [ ] Add security headers
- [ ] Implement CSRF protection
- [ ] Review authentication flow

### 🛡️ Tools:
- OWASP security guidelines
- Security scanning tools
- Dependency vulnerability checks
""",
            "labels": ["security", "audit", "critical"]
        }
    ]
    
    # GitHub API setup
    base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    print(f"\n🚀 Creating {len(essential_issues)} essential issues...")
    
    created_count = 0
    for issue in essential_issues:
        try:
            # Check if issue already exists
            existing_url = f"{base_url}/issues"
            existing_response = requests.get(existing_url, headers=headers)
            
            if existing_response.status_code == 200:
                existing_issues = existing_response.json()
                if any(existing['title'] == issue['title'] for existing in existing_issues):
                    print(f"⏭️ Skipped (exists): {issue['title']}")
                    continue
            
            # Create new issue
            create_url = f"{base_url}/issues"
            response = requests.post(create_url, headers=headers, json=issue)
            
            if response.status_code == 201:
                issue_data = response.json()
                print(f"✅ Created issue #{issue_data['number']}: {issue['title']}")
                created_count += 1
            else:
                print(f"❌ Failed to create: {issue['title']}")
                print(f"   Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error creating issue '{issue['title']}': {e}")
    
    print(f"\n🎉 Created {created_count} issues successfully!")
    print(f"🔗 View issues at: https://github.com/{repo_owner}/{repo_name}/issues")
    
    # Create labels if they don't exist
    create_labels(base_url, headers)

def create_labels(base_url, headers):
    """Create project labels if they don't exist"""
    labels = [
        {"name": "bug", "color": "d73a4a", "description": "Something isn't working"},
        {"name": "critical", "color": "b60205", "description": "Critical priority issue"},
        {"name": "enhancement", "color": "a2eeef", "description": "New feature or request"},
        {"name": "media", "color": "7057ff", "description": "Related to media files (images/audio)"},
        {"name": "performance", "color": "1d76db", "description": "Performance improvement"},
        {"name": "documentation", "color": "0075ca", "description": "Improvements or additions to documentation"},
        {"name": "testing", "color": "d4edda", "description": "Related to testing"},
        {"name": "security", "color": "f9c74f", "description": "Security related"},
        {"name": "production", "color": "dc3545", "description": "Production environment issue"},
        {"name": "frontend", "color": "20c997", "description": "Frontend related"},
        {"name": "backend", "color": "6f42c1", "description": "Backend related"}
    ]
    
    print("\n🏷️ Creating project labels...")
    
    for label in labels:
        try:
            url = f"{base_url}/labels"
            response = requests.post(url, headers=headers, json=label)
            
            if response.status_code == 201:
                print(f"✅ Created label: {label['name']}")
            elif response.status_code == 422:
                print(f"⏭️ Label exists: {label['name']}")
            else:
                print(f"❌ Failed to create label: {label['name']}")
                
        except Exception as e:
            print(f"❌ Error creating label '{label['name']}': {e}")

if __name__ == "__main__":
    print("🚀 LeEnglish GitHub Issues Quick Creator")
    print("=" * 50)
    
    # Instructions for user
    print("\n📋 Before running, please:")
    print("1. Create a GitHub Personal Access Token at: https://github.com/settings/tokens")
    print("2. Give it 'repo' permissions")
    print("3. Set environment variable: set GITHUB_TOKEN=your_token")
    print("4. Update repo_owner and repo_name in this script")
    print()
    
    create_quick_issues()
