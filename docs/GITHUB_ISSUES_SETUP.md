# 🚀 Hướng dẫn tạo GitHub Issues tự động cho LeEnglish TOEIC

## 📋 Bước 1: Tạo GitHub Personal Access Token

1. **Truy cập GitHub Settings:**
   - Đi đến: https://github.com/settings/tokens
   - Hoặc: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Tạo token mới:**
   - Click **"Generate new token (classic)"**
   - Điền thông tin:
     - **Note:** `LeEnglish Issues Creator`
     - **Expiration:** `90 days` (hoặc tùy chọn)
     - **Scopes:** ✅ Chọn `repo` (Full control of private repositories)

3. **Lưu token:**
   - Click **"Generate token"**
   - **⚠️ QUAN TRỌNG:** Copy token ngay lập tức (chỉ hiển thị 1 lần)
   - Lưu token vào nơi an toàn

## 📋 Bước 2: Cấu hình môi trường

### Cách 1: Sử dụng environment variable (Khuyến nghị)
```cmd
# Mở Command Prompt hoặc PowerShell
set GITHUB_TOKEN=your_token_here

# Kiểm tra
echo %GITHUB_TOKEN%
```

### Cách 2: Chỉnh sửa script trực tiếp
Mở file `run_github_issues.py` và thay:
```python
github_token = os.getenv('GITHUB_TOKEN')
```
thành:
```python
github_token = "your_token_here"
```

## 📋 Bước 3: Chạy script

### Cách 1: Sử dụng batch file (Dễ nhất)
```cmd
# Mở Command Prompt tại thư mục dự án
cd c:\HK4\toeic3\leenglish-front

# Chạy script
create_issues.bat
```

### Cách 2: Chạy Python trực tiếp
```cmd
# Kiểm tra môi trường trước
python preflight_check.py

# Tạo issues
python run_github_issues.py
```

## 📋 Bước 4: Xem kết quả

Sau khi chạy thành công, bạn có thể xem issues tại:
🔗 **https://github.com/HUYDUU19/leenglish-toeic-platform/issues**

## 🎯 Issues sẽ được tạo

1. **🐛 [CRITICAL] Media files not loading in production**
   - Ưu tiên cao: Sửa lỗi media không load
   - Labels: `bug`, `critical`, `production`, `media`

2. **🚀 [FEATURE] Media optimization and caching**
   - Tối ưu hóa media và caching
   - Labels: `enhancement`, `performance`, `media`

3. **📚 [DOCS] Complete API documentation**
   - Hoàn thiện tài liệu API
   - Labels: `documentation`, `api`, `backend`

4. **🧪 [TEST] Implement comprehensive test suite**
   - Xây dựng hệ thống test
   - Labels: `testing`, `quality`, `frontend`, `backend`

5. **🔒 [SECURITY] Security audit and improvements**
   - Kiểm tra và cải thiện bảo mật
   - Labels: `security`, `audit`, `critical`

## 🛠️ Troubleshooting

### ❌ "GITHUB_TOKEN not found"
- Đảm bảo đã set environment variable
- Hoặc chỉnh sửa script để hard-code token

### ❌ "Failed to create issue"
- Kiểm tra token có quyền `repo`
- Đảm bảo repo name và owner đúng
- Kiểm tra kết nối internet

### ❌ "Label exists" 
- Bình thường, script sẽ skip labels đã tồn tại

### ❌ "Issue exists"
- Script tự động skip issues đã tồn tại (theo title)

## 🔄 Chạy lại script

Script có thể chạy nhiều lần an toàn:
- Không tạo duplicate issues
- Không tạo duplicate labels
- Chỉ tạo những gì chưa có

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Chạy `python preflight_check.py` để kiểm tra
2. Xem log chi tiết trong terminal
3. Kiểm tra permissions của GitHub token
4. Đảm bảo repo name và owner chính xác

---

**🎉 Chúc bạn thành công với việc tự động hóa GitHub Issues!**
