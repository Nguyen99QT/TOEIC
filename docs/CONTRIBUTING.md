# Contributing to LeEnglish TOEIC Learning Platform

Thank you for your interest in contributing to LeEnglish! 🎉

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/leenglish-toeic-platform.git
   cd leenglish-toeic-platform
   ```
3. **Open** VS Code workspace:
   ```bash
   code leenglish-workspace.code-workspace
   ```
4. **Install** dependencies:
   ```bash
   npm run install:all
   ```

## 🛠️ Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the existing code style
- Write tests for new features
- Update documentation when needed

### 3. Test Your Changes

```bash
# Test individual projects
npm run test:backend
npm run test:frontend
npm run test:mobile

# Or test everything
npm run test:all
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🎯 Project Structure

### Backend (Spring Boot)

- Follow Spring Boot best practices
- Use proper REST API conventions
- Write unit and integration tests

### Frontend (Next.js)

- Use TypeScript for type safety
- Follow React best practices
- Write component tests

### Mobile (Flutter)

- Follow Flutter/Dart conventions
- Use Riverpod for state management
- Write widget tests

## 🧪 Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Test both happy path and edge cases

## 📋 Pull Request Guidelines

1. **Title**: Use descriptive titles
2. **Description**: Explain what your PR does
3. **Tests**: Include relevant tests
4. **Documentation**: Update docs if needed
5. **Breaking Changes**: Clearly mark any breaking changes

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Environment**: OS, Browser, versions
2. **Steps**: How to reproduce the issue
3. **Expected**: What should happen
4. **Actual**: What actually happens
5. **Screenshots**: If applicable

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Explain the use case
3. Describe the proposed solution
4. Consider the impact on all platforms

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## 📞 Getting Help

- 💬 **Discord**: [Join our community](https://discord.gg/leenglish)
- 📧 **Email**: dev@leenglish.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/leenglish-toeic-platform/issues)

Thank you for contributing! 🙏
