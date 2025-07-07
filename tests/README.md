# 🧪 Test Scripts

Testing utilities and scripts for the LeEnglish TOEIC platform.

## 📋 Available Tests

### PowerShell Tests

- `test-admin.ps1` - Admin dashboard functionality tests
- `test-dashboard.ps1` - General dashboard tests

### Shell Tests

- `test-token-refresh.sh` - JWT token refresh mechanism tests

## 🚀 Usage

### PowerShell Tests (Windows)

```powershell
# Run admin tests
.\tests\test-admin.ps1

# Run dashboard tests
.\tests\test-dashboard.ps1
```

### Shell Tests (Linux/Mac/WSL)

```bash
# Run token refresh tests
bash tests/test-token-refresh.sh

# Make executable if needed
chmod +x tests/test-token-refresh.sh
```

## 📊 Test Categories

### Authentication Tests

- JWT token generation and validation
- Token refresh mechanism
- Session management

### Dashboard Tests

- Admin panel functionality
- User dashboard features
- API endpoint testing

### API Tests

- Backend API endpoint validation
- Request/response testing
- Error handling verification

## 🔧 Prerequisites

### For PowerShell Tests

- Windows PowerShell 5.1+ or PowerShell Core 7+
- Appropriate execution policy: `Set-ExecutionPolicy RemoteSigned`

### For Shell Tests

- Bash shell environment
- curl or wget for HTTP requests
- jq for JSON processing (recommended)

## ⚙️ Configuration

Tests may require:

- Backend server running on `http://localhost:8080`
- Valid test credentials
- Database with test data

## 📝 Test Data

Some tests may require:

- Test user accounts
- Sample TOEIC content
- Valid authentication tokens

Refer to `scripts/database/create_test_users.sql` for test user setup.

## 🔍 Troubleshooting

### Common Issues

1. **Connection refused**: Ensure backend server is running
2. **Authentication failed**: Check test credentials
3. **Permission denied**: Verify script execution permissions

### Debug Mode

Most scripts support verbose/debug output:

```bash
# Enable debug output
DEBUG=1 bash tests/test-token-refresh.sh
```
