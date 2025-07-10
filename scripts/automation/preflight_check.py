#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pre-flight Check for GitHub Issues Creation
Validates environment and repository settings
"""

import os
import json
import requests
import subprocess
import sys

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.7+")
        return False

def check_packages():
    """Check if required packages are installed"""
    required_packages = ['requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ Package '{package}' - Available")
        except ImportError:
            print(f"❌ Package '{package}' - Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n💡 Install missing packages with: pip install {' '.join(missing_packages)}")
        return False
    return True

def check_git_config():
    """Check git configuration"""
    try:
        # Check if in git repository
        result = subprocess.run(['git', 'rev-parse', '--git-dir'], 
                              capture_output=True, text=True, cwd='.')
        if result.returncode == 0:
            print("✅ Git repository - Valid")
            
            # Get remote URL
            result = subprocess.run(['git', 'remote', 'get-url', 'origin'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                remote_url = result.stdout.strip()
                print(f"✅ Git remote: {remote_url}")
                
                # Extract repo info from URL
                if 'github.com' in remote_url:
                    # Handle both HTTPS and SSH URLs
                    if remote_url.startswith('https://'):
                        # https://github.com/user/repo.git
                        parts = remote_url.replace('https://github.com/', '').replace('.git', '').split('/')
                    elif remote_url.startswith('git@'):
                        # git@github.com:user/repo.git
                        parts = remote_url.replace('git@github.com:', '').replace('.git', '').split('/')
                    
                    if len(parts) >= 2:
                        repo_owner = parts[0]
                        repo_name = parts[1]
                        print(f"📂 Detected repo: {repo_owner}/{repo_name}")
                        return repo_owner, repo_name
                
            return None, None
        else:
            print("❌ Not in a git repository")
            return None, None
            
    except FileNotFoundError:
        print("❌ Git not found - Please install Git")
        return None, None

def check_github_token():
    """Check GitHub token configuration"""
    token = os.getenv('GITHUB_TOKEN')
    
    if not token:
        print("❌ GITHUB_TOKEN environment variable not set")
        print("\n💡 To create and set GitHub token:")
        print("1. Go to: https://github.com/settings/tokens")
        print("2. Click 'Generate new token (classic)'")
        print("3. Give it a name like 'LeEnglish Issues'")
        print("4. Select 'repo' scope (full repository access)")
        print("5. Copy the token")
        print("6. Run: set GITHUB_TOKEN=your_token_here")
        return None
    
    # Test token by making a simple API call
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        response = requests.get("https://api.github.com/user", headers=headers, timeout=10)
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ GitHub token valid - User: {user_data.get('login', 'Unknown')}")
            return token
        else:
            print(f"❌ GitHub token invalid - Status: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ GitHub API error: {e}")
        return None

def test_repo_access(token, repo_owner, repo_name):
    """Test if token has access to the repository"""
    if not token or not repo_owner or not repo_name:
        return False
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            repo_data = response.json()
            print(f"✅ Repository access - {repo_data.get('full_name')}")
            print(f"   Private: {repo_data.get('private', False)}")
            print(f"   Issues: {repo_data.get('has_issues', False)}")
            return True
        elif response.status_code == 404:
            print(f"❌ Repository not found or no access: {repo_owner}/{repo_name}")
            return False
        else:
            print(f"❌ Repository access error - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Repository API error: {e}")
        return False

def create_env_file(repo_owner, repo_name, token):
    """Create .env file with configuration"""
    env_content = f"""# GitHub Configuration for LeEnglish Issues Creator
GITHUB_TOKEN={token}
GITHUB_REPO_OWNER={repo_owner}
GITHUB_REPO_NAME={repo_name}

# Created on {os.path.basename(__file__)} at {os.path.dirname(os.path.abspath(__file__))}
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file with configuration")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def main():
    """Run pre-flight checks"""
    print("🔍 LeEnglish GitHub Issues - Pre-flight Check")
    print("=" * 50)
    
    # Check Python
    print("\n🐍 Checking Python...")
    if not check_python_version():
        return False
    
    # Check packages
    print("\n📦 Checking packages...")
    if not check_packages():
        print("\n💡 Install packages with: pip install requests")
        return False
    
    # Check Git
    print("\n📂 Checking Git repository...")
    repo_owner, repo_name = check_git_config()
    
    # Check GitHub token
    print("\n🔑 Checking GitHub token...")
    token = check_github_token()
    
    # Test repository access
    if token and repo_owner and repo_name:
        print("\n🔗 Testing repository access...")
        if test_repo_access(token, repo_owner, repo_name):
            print("\n✅ All checks passed! Ready to create issues.")
            
            # Create env file
            print("\n💾 Creating configuration file...")
            create_env_file(repo_owner, repo_name, token)
            
            print(f"\n🚀 Run the following command to create issues:")
            print(f"   python run_github_issues.py")
            print(f"\n🔗 Issues will be created at:")
            print(f"   https://github.com/{repo_owner}/{repo_name}/issues")
            
            return True
    
    print("\n❌ Pre-flight checks failed. Please fix the issues above.")
    return False

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n💡 Need help? Check the documentation or contact the team.")
    input("\nPress Enter to continue...")
