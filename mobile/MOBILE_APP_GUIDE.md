# TOEIC Mobile App - Hướng dẫn sử dụng

## Tổng quan
Ứng dụng mobile TOEIC Learning Platform được phát triển bằng Flutter, kết nối với backend Java Spring Boot để cung cấp chức năng đăng nhập và xem blog.

## Chức năng đã triển khai

### 1. Đăng nhập (Authentication)
- Giao diện đăng nhập đẹp mắt với validation
- Kết nối với API backend `/api/auth/login`
- Lưu trữ token và thông tin người dùng
- Tự động kiểm tra trạng thái đăng nhập
- Xử lý lỗi và hiển thị thông báo

**Tài khoản demo:**
- Username: `admin`
- Password: `password`

### 2. Trang chủ (Home Page)
- Hiển thị thông tin chào mừng người dùng
- Thống kê điểm số, bài học, bài tập đã hoàn thành
- Các hành động nhanh (chức năng sẽ được phát triển)
- Menu đăng xuất

### 3. Blog
- Danh sách bài viết blog từ backend
- Tìm kiếm bài viết theo tiêu đề, nội dung, tác giả
- Xem chi tiết bài viết
- Admin có thể tạo bài viết mới
- Làm mới danh sách blog
- Hiển thị số lượt thích và bình luận

### 4. Navigation
- Bottom navigation bar với 2 tab: Trang chủ và Blog
- Tự động chuyển đổi giữa màn hình đăng nhập và ứng dụng chính

## Cấu trúc dự án

```
lib/
├── main.dart                           # Entry point
├── core/
│   ├── config/
│   │   └── app_config.dart            # Cấu hình ứng dụng
│   ├── theme/
│   │   └── app_theme.dart             # Theme và styling
│   └── services/
│       ├── api_service.dart           # HTTP service cơ bản
│       ├── enhanced_api_service.dart  # API service nâng cao
│       └── storage_service.dart       # Local storage
├── models/
│   ├── user.dart                      # User model
│   └── blog.dart                      # Blog model
└── features/
    ├── auth/
    │   └── presentation/
    │       ├── providers/
    │       │   └── auth_provider.dart # State management cho auth
    │       └── pages/
    │           └── login_page.dart    # Trang đăng nhập
    ├── home/
    │   └── presentation/
    │       └── pages/
    │           └── home_page.dart     # Trang chủ
    └── blog/
        └── presentation/
            └── pages/
                └── blog_list_page.dart # Trang blog
```

## Backend Integration

### API Endpoints được sử dụng:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất  
- `POST /api/auth/validate-token` - Kiểm tra token
- `GET /api/blog` - Lấy danh sách blog
- `GET /api/blog/{id}` - Lấy chi tiết blog
- `POST /api/blog` - Tạo blog mới (admin)
- `GET /api/blog/search?title=query` - Tìm kiếm blog

### Cấu hình kết nối:

**Android Emulator:** `http://10.0.2.2:8080`
**iOS Simulator:** `http://localhost:8080`

Đảm bảo backend Java Spring Boot đang chạy trên port 8080.

## Chạy ứng dụng

### 1. Yêu cầu
- Flutter SDK đã được cài đặt
- Android Studio hoặc VS Code
- Emulator/Device để test

### 2. Cài đặt dependencies
```bash
cd mobile
flutter pub get
```

### 3. Chạy ứng dụng
```bash
flutter run
```

### 4. Build APK (optional)
```bash
flutter build apk --release
```

## Tính năng State Management

Ứng dụng sử dụng **Riverpod** cho state management:

- `AuthProvider` - Quản lý trạng thái đăng nhập
- `BlogProvider` - Quản lý dữ liệu blog
- Tự động persist và restore state
- Error handling và loading states

## Tính năng Storage

- Sử dụng **Hive** cho local storage
- Lưu trữ token xác thực
- Lưu trữ thông tin người dùng
- Tự động xóa dữ liệu khi đăng xuất

## Tính năng Network

- HTTP client với **Dio**
- Automatic token injection
- Error handling và retry logic
- Timeout configuration
- Debug logging

## UI/UX Features

- Material Design 3
- Responsive layout
- Loading states
- Error states
- Success feedback
- Search functionality
- Pull-to-refresh

## Debugging

### Kiểm tra kết nối backend:
1. Đảm bảo backend đang chạy trên `http://localhost:8080`
2. Kiểm tra console logs trong Flutter
3. Xem network requests trong debug mode

### Common Issues:
- **Connection refused**: Kiểm tra backend có đang chạy không
- **404 errors**: Kiểm tra API endpoints trong backend
- **Token issues**: Xóa app data và đăng nhập lại

## Phát triển tiếp

Các chức năng có thể được thêm vào:
- Đăng ký tài khoản
- Quên mật khẩu
- Chỉnh sửa profile
- Làm bài tập TOEIC
- Học từ vựng
- Thống kê chi tiết
- Push notifications
- Offline mode

## Liên hệ hỗ trợ

Nếu gặp vấn đề khi sử dụng, vui lòng kiểm tra:
1. Backend có đang chạy không
2. Network connection
3. Console logs cho error details
