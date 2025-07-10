# GitHub Issues Creator

This directory contains scripts to automatically create GitHub issues for the LeEnglish TOEIC Platform project.

## 📁 Files

- **`create-issues.js`** - Node.js script using Octokit API
- **`create-issues.ps1`** - PowerShell script using GitHub CLI
- **`package.json`** - Dependencies for Node.js script
- **`README.md`** - This documentation

## 🚀 Quick Start

### Option 1: Using PowerShell (Recommended for Windows)

```powershell
# 1. Install GitHub CLI if not already installed
winget install GitHub.cli

# 2. Authenticate with GitHub
gh auth login

# 3. Set your GitHub token (get from https://github.com/settings/tokens)
$env:GITHUB_TOKEN = "your_github_token_here"

# 4. Run the script (dry run first to preview)
.\create-issues.ps1 -DryRun

# 5. Create the issues for real
.\create-issues.ps1
```

### Option 2: Using Node.js

```bash
# 1. Install dependencies
npm install

# 2. Set your GitHub token
export GITHUB_TOKEN="your_github_token_here"  # Linux/Mac
$env:GITHUB_TOKEN="your_github_token_here"     # PowerShell

# 3. Run the script
npm run create-issues
# OR
node create-issues.js
```

## 🔑 Getting GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
4. Copy the generated token
5. Set it as environment variable `GITHUB_TOKEN`

## 📋 Issues That Will Be Created

The scripts will create the following types of issues:

### 🐛 Bug Issues

- Database connection timeout on high load
- JWT token expiration not handled properly
- Login form validation issues
- Audio playback problems on iOS

### 🚀 Feature Issues

- Redis caching implementation
- Responsive design for mobile
- Offline mode for mobile app
- Push notifications
- File upload for question images
- Dark mode toggle
- Biometric authentication

### 📋 Task Issues

- CI/CD pipeline setup
- API documentation with Swagger
- Docker configuration
- Monitoring and logging setup
- Test coverage improvements

## 🎯 Issue Labels

Issues are automatically labeled with:

- **Type**: `bug`, `enhancement`, `task`
- **Platform**: `backend`, `frontend`, `mobile`
- **Category**: `ui/ux`, `security`, `performance`, `documentation`
- **Priority**: `high-priority`

## 🔧 Customization

### Adding New Issues

Edit the `issues` array in either script to add new issues:

```javascript
// In create-issues.js
const issues = [
  {
    title: "[BUG] Your issue title",
    body: `## 🐛 Bug Description
Your detailed description here...`,
    labels: ["bug", "backend", "high-priority"],
  },
  // ... more issues
];
```

```powershell
# In create-issues.ps1
$issues = @(
    @{
        title = "[FEATURE] Your feature title"
        body = @"
## 🚀 Feature Description
Your detailed description here...
"@
        labels = @("enhancement", "frontend")
    }
)
```

### Modifying Repository

Change the repository owner and name at the top of each script:

```javascript
// create-issues.js
const REPO_OWNER = "YOUR_USERNAME";
const REPO_NAME = "YOUR_REPO_NAME";
```

```powershell
# create-issues.ps1
$Owner = "YOUR_USERNAME"
$Repo = "YOUR_REPO_NAME"
```

## 🚨 Safety Features

### Dry Run Mode (PowerShell only)

Test the script without creating actual issues:

```powershell
.\create-issues.ps1 -DryRun
```

### Rate Limiting

Both scripts include delays between API calls to avoid GitHub rate limits.

### Error Handling

Scripts will continue creating other issues even if one fails.

## 📊 Output Example

```
🚀 GitHub Issues Creator for LeEnglish TOEIC Platform
📦 Repository: HUYDUU19/leenglish-toeic-platform
📝 Issues to create: 8

📋 Creating issue 1/8: [BUG] Database connection timeout on high load
✅ Created: #123 - [BUG] Database connection timeout on high load
🔗 URL: https://github.com/HUYDUU19/leenglish-toeic-platform/issues/123

📋 Creating issue 2/8: [FEATURE] Add Redis caching for frequently accessed data
✅ Created: #124 - [FEATURE] Add Redis caching for frequently accessed data
🔗 URL: https://github.com/HUYDUU19/leenglish-toeic-platform/issues/124

🎉 Finished creating issues!
🔗 View all issues: https://github.com/HUYDUU19/leenglish-toeic-platform/issues
```

## 🛠️ Troubleshooting

### Common Issues

1. **"GitHub token not provided"**

   - Make sure you set the `GITHUB_TOKEN` environment variable
   - Verify the token has correct permissions

2. **"Rate limit exceeded"**

   - Wait a few minutes and try again
   - The scripts include delays to prevent this

3. **"Repository not found"**

   - Check the repository owner and name are correct
   - Ensure the token has access to the repository

4. **"GitHub CLI not found" (PowerShell)**
   - Install GitHub CLI: `winget install GitHub.cli`
   - Or download from: https://cli.github.com/

### Getting Help

- Check [GitHub API documentation](https://docs.github.com/en/rest/issues/issues)
- GitHub CLI help: `gh issue create --help`
- Octokit documentation: https://octokit.github.io/rest.js/

## 📝 License

This script is part of the LeEnglish TOEIC Platform project and follows the same license terms.
