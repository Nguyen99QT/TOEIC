# 🗄️ Database Directory

This directory contains database-related scripts, migrations, and utilities for the LeEnglish TOEIC project.

## 📁 Directory Structure

### 🔄 migrations/

Database schema migrations and structural changes:

- Schema updates
- Data restructuring scripts
- Version-controlled database changes

### 📜 scripts/

Utility scripts for database operations:

- Data fixes and updates
- Maintenance scripts
- User account management
- Content updates

## 📋 Available Scripts

### Migration Scripts (`migrations/`)

- `questions_restructured.sql` - Question data restructuring migration

### Utility Scripts (`scripts/`)

- `fix_user_accounts.sql` - Fix user authentication issues
- `update_exercise_difficulty.sql` - Update exercise difficulty levels
- `user_exercise_feedback_schema.sql` - User feedback schema setup

## 🚀 Usage Guidelines

### Running Migrations

```sql
-- Connect to your database and run:
source database/migrations/questions_restructured.sql;
```

### Running Utility Scripts

```sql
-- For user account fixes:
source database/scripts/fix_user_accounts.sql;

-- For exercise updates:
source database/scripts/update_exercise_difficulty.sql;
```

## ⚠️ Safety Guidelines

1. **Always backup your database** before running any scripts
2. **Test on development environment** first
3. **Review scripts** before execution
4. **Check dependencies** between scripts

## 🔧 Database Connection

Make sure your database connection is properly configured in:

- `application.properties`
- `application-dev.properties`
- `application-prod.properties`

## 📊 Script Categories

### User Management

- Account fixes and updates
- Authentication troubleshooting
- User data corrections

### Content Management

- Exercise difficulty adjustments
- Question restructuring
- Feedback system setup

### System Maintenance

- Performance optimizations
- Data cleanup
- Index management
