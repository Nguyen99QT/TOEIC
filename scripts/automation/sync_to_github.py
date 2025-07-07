#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git Sync Helper for LeEnglish Project
Helps commit and push changes to GitHub
"""

import subprocess
import os
from datetime import datetime

def run_git_command(command, description=""):
    """Run a git command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd='.')
        if result.returncode == 0:
            print(f"✅ {description or command}")
            if result.stdout.strip():
                print(f"   {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Failed: {description or command}")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ Exception in {description or command}: {e}")
        return False

def check_git_status():
    """Check current git status"""
    print("📋 Checking git status...")
    
    # Check if we're in a git repo
    if not run_git_command("git status --porcelain", "Checking git repository"):
        return False
    
    # Get current branch
    result = subprocess.run("git branch --show-current", shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        current_branch = result.stdout.strip()
        print(f"📍 Current branch: {current_branch}")
    
    # Check for changes
    result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        changes = result.stdout.strip()
        if changes:
            print("📝 Found changes to commit:")
            for line in changes.split('\n'):
                print(f"   {line}")
            return True
        else:
            print("✅ No changes to commit")
            return False
    
    return False

def sync_to_github():
    """Sync all changes to GitHub"""
    print("🚀 LeEnglish Git Sync Helper")
    print("=" * 50)
    
    # Check git status
    if not check_git_status():
        print("ℹ️  No changes to sync")
        return True
    
    # Add all changes
    print("\n📦 Adding changes...")
    if not run_git_command("git add .", "Adding all changes"):
        return False
    
    # Create commit message
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_message = f"""🚀 Optimize media system and setup GitHub automation

✨ New Features:
- Complete media generation system for lessons/exercises/flashcards
- Automated GitHub issues creation scripts
- Professional README and documentation

🐛 Bug Fixes:
- Fixed media loading issues in frontend
- Corrected AuthContext login flow
- Improved MediaService URL handling

🔧 Improvements:
- Refactored media components and services
- Added comprehensive error handling
- Enhanced debugging tools and components

📚 Documentation:
- Added setup guides and troubleshooting
- Created GitHub issues templates
- Comprehensive API documentation

🛠️ Scripts & Automation:
- Media generation and cleanup scripts
- GitHub issues auto-creation tools
- Pre-flight check and demo scripts

Generated at: {timestamp}
"""
    
    # Commit changes
    print(f"\n💾 Committing changes...")
    if not run_git_command(f'git commit -m "{commit_message}"', "Committing changes"):
        return False
    
    # Push to GitHub
    print(f"\n🌐 Pushing to GitHub...")
    if not run_git_command("git push", "Pushing to origin"):
        print("💡 If this is the first push, you may need to set upstream:")
        print("   git push --set-upstream origin main")
        return False
    
    print("\n🎉 Successfully synced to GitHub!")
    
    # Show repository info
    result = subprocess.run("git remote get-url origin", shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        repo_url = result.stdout.strip()
        print(f"🔗 Repository: {repo_url}")
        
        # Extract GitHub repo info for issues link
        if 'github.com' in repo_url:
            if 'HUYDUU19/leenglish-toeic-platform' in repo_url:
                print(f"🎯 Create issues at: https://github.com/HUYDUU19/leenglish-toeic-platform/issues")
                print(f"📊 View project at: https://github.com/HUYDUU19/leenglish-toeic-platform")
    
    return True

def main():
    """Main function"""
    try:
        if sync_to_github():
            print("\n✅ Git sync completed successfully!")
            print("\n🚀 Next steps:")
            print("1. Set up GitHub token (see GITHUB_ISSUES_SETUP.md)")
            print("2. Run: python run_github_issues.py")
            print("3. Or use: create_issues.bat")
            print("4. Check your GitHub repository for the updates")
        else:
            print("\n❌ Git sync failed. Please check the errors above.")
            return False
            
    except KeyboardInterrupt:
        print("\n⏹️  Git sync cancelled by user")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    input(f"\nPress Enter to continue...")
    exit(0 if success else 1)
