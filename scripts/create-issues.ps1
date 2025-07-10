# GitHub Issues Creator for LeEnglish TOEIC Platform
# PowerShell script to create issues using GitHub CLI

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [switch]$DryRun = $false
)

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed" -ForegroundColor Red
    Write-Host "Please install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if token is provided
if (-not $Token) {
    Write-Host "❌ GitHub token not provided" -ForegroundColor Red
    Write-Host "Set GITHUB_TOKEN environment variable or pass -Token parameter" -ForegroundColor Yellow
    Write-Host "Get token from: https://github.com/settings/tokens" -ForegroundColor Cyan
    exit 1
}

# Set GitHub token
$env:GITHUB_TOKEN = $Token

# Repository info
$Owner = "HUYDUU19"
$Repo = "leenglish-toeic-platform"
$RepoUrl = "https://github.com/$Owner/$Repo"

Write-Host "🚀 GitHub Issues Creator for LeEnglish TOEIC Platform" -ForegroundColor Green
Write-Host "📦 Repository: $Owner/$Repo" -ForegroundColor Cyan
Write-Host "🔗 URL: $RepoUrl" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "🧪 DRY RUN MODE - No issues will be created" -ForegroundColor Yellow
    Write-Host ""
}

# Define issues to create
$issues = @(
    @{
        title = "[BUG] Database connection timeout on high load"
        body = @"
## 🐛 Bug Description
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
- [ ] Load test to verify fix
"@
        labels = @("bug", "backend", "database", "high-priority")
    },
    @{
        title = "[FEATURE] Add Redis caching for frequently accessed data"
        body = @"
## 🚀 Feature Description
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
- [ ] Performance tests show improvement
"@
        labels = @("enhancement", "backend", "performance")
    },
    @{
        title = "[FEATURE] Implement responsive design for mobile browsers"
        body = @"
## 🚀 Feature Description
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
- [ ] Text is readable without zooming
"@
        labels = @("enhancement", "frontend", "ui/ux", "mobile")
    },
    @{
        title = "[TASK] Set up CI/CD pipeline with GitHub Actions"
        body = @"
## 📋 Task Description
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
- [ ] Rollback procedure defined
"@
        labels = @("task", "devops", "ci-cd", "high-priority")
    },
    @{
        title = "[FEATURE] Implement offline mode for downloaded tests"
        body = @"
## 🚀 Feature Description
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
- [ ] Storage management (delete old tests)
"@
        labels = @("enhancement", "mobile", "offline", "high-priority")
    }
)

$totalIssues = $issues.Count
Write-Host "📝 Issues to create: $totalIssues" -ForegroundColor Cyan
Write-Host ""

$createdCount = 0
$failedCount = 0

foreach ($issue in $issues) {
    $index = $issues.IndexOf($issue) + 1
    Write-Host "📋 Creating issue $index/$totalIssues`: $($issue.title)" -ForegroundColor Blue
    
    if ($DryRun) {
        Write-Host "🧪 DRY RUN - Would create issue with labels: $($issue.labels -join ', ')" -ForegroundColor Yellow
        $createdCount++
    } else {
        try {
            # Create labels parameter
            $labelsParam = $issue.labels -join ','
            
            # Create the issue using GitHub CLI
            $result = gh issue create --repo "$Owner/$Repo" --title $issue.title --body $issue.body --label $labelsParam 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Created: $result" -ForegroundColor Green
                $createdCount++
            } else {
                Write-Host "❌ Failed: $result" -ForegroundColor Red
                $failedCount++
            }
        } catch {
            Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
            $failedCount++
        }
    }
    
    Write-Host ""
    
    # Add delay to avoid rate limiting
    Start-Sleep -Seconds 2
}

Write-Host "🎉 Issue creation completed!" -ForegroundColor Green
Write-Host "✅ Successfully created: $createdCount issues" -ForegroundColor Green

if ($failedCount -gt 0) {
    Write-Host "❌ Failed to create: $failedCount issues" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 View all issues: $RepoUrl/issues" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host ""
    Write-Host "💡 To actually create the issues, run without -DryRun flag" -ForegroundColor Yellow
}
