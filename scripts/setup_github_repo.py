#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Issues Configuration
Update repository settings and labels
"""

import requests
import json
import os

class GitHubConfig:
    def __init__(self, token: str, repo_owner: str, repo_name: str):
        self.token = token
        self.repo_owner = repo_owner
        self.repo_name = repo_name
        self.base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }

    def create_labels(self):
        """Create custom labels for LeEnglish TOEIC project"""
        labels = [
            # Priority Labels
            {"name": "critical", "color": "d73a49", "description": "Critical issue requiring immediate attention"},
            {"name": "high-priority", "color": "ff6b6b", "description": "High priority issue"},
            {"name": "medium-priority", "color": "ffa726", "description": "Medium priority issue"},
            {"name": "low-priority", "color": "66bb6a", "description": "Low priority issue"},
            
            # Component Labels
            {"name": "media", "color": "9c27b0", "description": "Media system related"},
            {"name": "authentication", "color": "2196f3", "description": "User authentication system"},
            {"name": "lessons", "color": "4caf50", "description": "Lesson management"},
            {"name": "exercises", "color": "ff9800", "description": "Exercise system"},
            {"name": "flashcards", "color": "e91e63", "description": "Flashcard functionality"},
            {"name": "database", "color": "795548", "description": "Database related"},
            {"name": "api", "color": "607d8b", "description": "REST API issues"},
            
            # Type Labels
            {"name": "feature", "color": "7b68ee", "description": "New feature request"},
            {"name": "improvement", "color": "54c7ec", "description": "Enhancement to existing feature"},
            {"name": "performance", "color": "ffeb3b", "description": "Performance optimization"},
            {"name": "security", "color": "f44336", "description": "Security related issue"},
            {"name": "ui/ux", "color": "e1bee7", "description": "User interface/experience"},
            
            # Status Labels
            {"name": "needs-review", "color": "fbca04", "description": "Needs code review"},
            {"name": "in-progress", "color": "0052cc", "description": "Currently being worked on"},
            {"name": "blocked", "color": "d4c5f9", "description": "Blocked by external dependency"},
            {"name": "good-first-issue", "color": "7057ff", "description": "Good for newcomers"},
            
            # Platform Labels
            {"name": "frontend", "color": "61dafb", "description": "React frontend"},
            {"name": "backend", "color": "6db33f", "description": "Spring Boot backend"},
            {"name": "mobile", "color": "a4c639", "description": "Mobile specific"},
            {"name": "browser-compatibility", "color": "ff7f00", "description": "Browser compatibility issue"}
        ]
        
        print("🏷️  Creating custom labels...")
        created_count = 0
        
        for label in labels:
            url = f"{self.base_url}/labels"
            response = requests.post(url, headers=self.headers, json=label)
            
            if response.status_code == 201:
                print(f"✅ Created label: {label['name']}")
                created_count += 1
            elif response.status_code == 422:
                print(f"⏭️  Label exists: {label['name']}")
            else:
                print(f"❌ Failed to create label: {label['name']} - {response.status_code}")
        
        print(f"🎉 Created {created_count} new labels")

    def setup_issue_templates(self):
        """Create issue template files"""
        print("📝 Setting up issue templates...")
        
        # This would typically involve creating files in .github/ISSUE_TEMPLATE/
        # For now, we'll just print the instructions
        print("""
📋 To complete setup, create these files in your repository:

1. .github/ISSUE_TEMPLATE/bug_report.yml
2. .github/ISSUE_TEMPLATE/feature_request.yml  
3. .github/ISSUE_TEMPLATE/media_issue.yml
4. .github/ISSUE_TEMPLATE/performance_issue.yml

Use the templates provided in the main script.
        """)

def main():
    print("⚙️  GitHub Repository Configuration")
    print("=" * 40)
    
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    REPO_OWNER = "yourusername"  # Update this
    REPO_NAME = "leenglish-toeic"  # Update this
    
    if not GITHUB_TOKEN:
        print("❌ Error: GITHUB_TOKEN environment variable not set")
        return
    
    config = GitHubConfig(GITHUB_TOKEN, REPO_OWNER, REPO_NAME)
    
    print(f"🔧 Configuring repository: {REPO_OWNER}/{REPO_NAME}")
    
    # Create labels
    config.create_labels()
    
    # Setup templates (instructions)
    config.setup_issue_templates()
    
    print("✅ Repository configuration complete!")

if __name__ == "__main__":
    main()
