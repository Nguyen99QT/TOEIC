# Model Context Protocol (MCP) Configuration

## Overview

This file configures MCP servers for the LeEnglish TOEIC Platform project to enhance AI assistance capabilities.

## Configured MCP Servers

### 1. Filesystem Server

- **Purpose**: File system operations and project navigation
- **Path**: `c:\HK4\toeic3\leenglish-front`
- **Capabilities**: Read, write, list files and directories

### 2. Git Server

- **Purpose**: Git operations and version control
- **Repository**: Current project repository
- **Capabilities**: Git status, diff, log, commit operations

### 3. GitHub Server

- **Purpose**: GitHub integration and repository management
- **Requirements**: GitHub Personal Access Token
- **Capabilities**: Issues, PRs, repository information

### 4. Brave Search Server

- **Purpose**: Web search capabilities for development research
- **Requirements**: Brave Search API key
- **Capabilities**: Search web for documentation, tutorials, solutions

### 5. Memory Server

- **Purpose**: Persistent memory across conversations
- **Capabilities**: Store and recall context, preferences, project knowledge

### 6. Sequential Thinking Server

- **Purpose**: Enhanced reasoning and problem-solving
- **Capabilities**: Multi-step reasoning, complex problem analysis

## Setup Instructions

### 1. Install MCP Dependencies

```bash
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-sequential-thinking
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# GitHub Integration
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here

# Brave Search API
BRAVE_API_KEY=your_brave_api_key_here
```

### 3. Get API Keys

#### GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Copy token to `.env` file

#### Brave Search API Key:

1. Go to https://api.search.brave.com/
2. Sign up and get API key
3. Copy key to `.env` file

## Project Context for MCP

### Project Structure

```
LeEnglish TOEIC Platform/
├── backend/          # Spring Boot API (Java)
├── frontend/         # Next.js Web App (TypeScript)
├── mobile/           # Flutter App (Dart)
├── .vscode/          # VS Code Configuration
└── docs/             # Documentation
```

### Key Technologies

- **Backend**: Spring Boot 3.x, MySQL, JWT, Maven
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Mobile**: Flutter 3.x, Dart
- **Database**: MySQL (english5)
- **Version Control**: Git, GitHub

### Development URLs

- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **Database**: localhost:3306/english5
- **Repository**: https://github.com/HUYDUU19/leenglish-toeic-platform

### Common Tasks

1. **Backend Development**:

   - Start: `mvn spring-boot:run`
   - Test: `mvn test`
   - Build: `mvn clean install`

2. **Frontend Development**:

   - Start: `npm run dev`
   - Build: `npm run build`
   - Test: `npm test`

3. **Mobile Development**:
   - Start: `flutter run`
   - Build: `flutter build apk`
   - Test: `flutter test`

### API Testing

- **REST Client**: Use `api-tests.http` file
- **Postman**: Import `LeEnglish-TOEIC-API.postman_collection.json`
- **Base URL**: http://localhost:8080

### Common Issues & Solutions

1. **CORS Errors**: Check Spring Boot CORS configuration
2. **Database Connection**: Verify MySQL is running and credentials in `application.properties`
3. **JWT Issues**: Check token format and expiration
4. **Build Errors**: Check Java/Node.js versions and dependencies

## MCP Usage Examples

### File Operations

- "Read the main application.properties file"
- "List all controllers in the backend"
- "Show the structure of the frontend components"

### Git Operations

- "Check current git status"
- "Show recent commits"
- "What files have been changed?"

### GitHub Integration

- "Check recent issues in the repository"
- "Show repository statistics"
- "List recent pull requests"

### Search & Research

- "Search for Spring Boot JWT configuration examples"
- "Find Next.js authentication tutorials"
- "Research Flutter state management best practices"

### Memory & Context

- "Remember the current database schema"
- "Recall previous API endpoint designs"
- "Store current development priorities"

## Troubleshooting

### MCP Server Not Starting

1. Check if all dependencies are installed
2. Verify environment variables are set
3. Check file paths are correct for Windows

### Permission Issues

1. Ensure proper file system permissions
2. Run VS Code as administrator if needed
3. Check antivirus is not blocking MCP servers

### API Key Issues

1. Verify API keys are valid and not expired
2. Check rate limits for external services
3. Ensure proper scopes for GitHub token

## Security Notes

- Keep API keys secure and never commit to version control
- Use environment variables for sensitive configuration
- Regularly rotate API keys
- Limit GitHub token permissions to minimum required

## Benefits of MCP Integration

1. **Enhanced Development**: AI can directly interact with project files
2. **Better Context**: Persistent memory of project structure and decisions
3. **Integrated Workflows**: Git, GitHub, and file operations in one interface
4. **Research Capabilities**: Real-time web search for development questions
5. **Problem Solving**: Sequential thinking for complex debugging and architecture decisions
