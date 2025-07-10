#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demo GitHub Issues Creator - Shows what would be created
No GitHub token required, just shows the issues that would be created
"""

import json
from datetime import datetime

def demo_issues():
    """Demo: Show issues that would be created"""
    
    print("🎯 LeEnglish GitHub Issues - DEMO MODE")
    print("=" * 60)
    print("This shows what issues would be created (no actual GitHub API calls)")
    print()
    
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
    
    # Project labels
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
        {"name": "backend", "color": "6f42c1", "description": "Backend related"},
        {"name": "optimization", "color": "0052cc", "description": "Code optimization"},
        {"name": "api", "color": "5319e7", "description": "API related"},
        {"name": "quality", "color": "bfdadc", "description": "Code quality improvement"},
        {"name": "audit", "color": "fef2c0", "description": "Security audit"}
    ]
    
    print("🏷️ LABELS TO BE CREATED:")
    print("-" * 30)
    for i, label in enumerate(labels, 1):
        print(f"{i:2d}. {label['name']:<15} - {label['description']}")
    
    print(f"\n📝 ISSUES TO BE CREATED:")
    print("-" * 30)
    
    for i, issue in enumerate(essential_issues, 1):
        print(f"\n{i}. {issue['title']}")
        print(f"   Labels: {', '.join(issue['labels'])}")
        print(f"   Body length: {len(issue['body'])} characters")
        print(f"   Tasks in body: {issue['body'].count('- [ ]')} checkboxes")
    
    print(f"\n📊 SUMMARY:")
    print("-" * 30)
    print(f"Total labels: {len(labels)}")
    print(f"Total issues: {len(essential_issues)}")
    print(f"Repository: HUYDUU19/leenglish-toeic-platform")
    print(f"Target URL: https://github.com/HUYDUU19/leenglish-toeic-platform/issues")
    
    # Save demo output to file
    demo_data = {
        "generated_at": datetime.now().isoformat(),
        "repository": "HUYDUU19/leenglish-toeic-platform",
        "labels": labels,
        "issues": essential_issues,
        "summary": {
            "total_labels": len(labels),
            "total_issues": len(essential_issues),
            "estimated_time": "2-3 minutes to create all"
        }
    }
    
    with open('github_issues_demo.json', 'w', encoding='utf-8') as f:
        json.dump(demo_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Demo data saved to: github_issues_demo.json")
    print(f"\n🚀 To actually create these issues:")
    print(f"   1. Set up GitHub token (see GITHUB_ISSUES_SETUP.md)")
    print(f"   2. Run: python run_github_issues.py")
    print(f"   3. Or use: create_issues.bat")
    
    return essential_issues

if __name__ == "__main__":
    demo_issues()
    input("\nPress Enter to continue...")
