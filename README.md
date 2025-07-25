Dưới đây là bản README chuyên nghiệp, đầy đủ, chuẩn đồ án, song ngữ (Tiếng Việt & Tiếng Anh), tổng hợp từ code và cấu trúc dự án branch **Huy** (backend Spring Boot, frontend Next.js, mobile Flutter):

---

# 🎯 LeEnglish TOEIC Learning Platform

Một nền tảng luyện thi TOEIC đa nền tảng: Backend Spring Boot, Frontend Next.js, Mobile Flutter.

A comprehensive multi-platform TOEIC learning platform: Spring Boot backend, Next.js frontend, Flutter mobile app.

---

## 🏗️ Kiến trúc dự án / Project Architecture

```
📦 LeEnglish TOEIC Platform
├── 🚀 backend/           # Spring Boot API Server
├── 🌐 frontend/          # Next.js Web Application
├── 📱 mobile/            # Flutter Mobile App
├── 🔧 .vscode/           # VS Code Workspace Settings
├── 📝 .gitignore         # Git Ignore Rules
└── 📖 README.md          # This Documentation
```

---

## ⚡ Công nghệ sử dụng / Technology Stack

| Thành phần / Component   | Công nghệ / Technology      | Mục đích / Purpose      |
|-------------------------|-----------------------------|------------------------|
| **Backend**             | Spring Boot 3.2.0           | REST API Server        |
| **Database**            | MySQL/H2                    | Lưu trữ dữ liệu        |
| **Security**            | Spring Security + JWT       | Xác thực, bảo mật      |
| **Frontend**            | Next.js 14 + Tailwind CSS   | Web Application        |
| **Mobile**              | Flutter 3.x + Riverpod      | Mobile App             |

---

## ⚡ Hướng dẫn cài đặt / Quick Start Guide

### 📋 Yêu cầu cài đặt / Prerequisites

- Java 17+ (Backend)
- Node.js 18+ (Frontend)
- Flutter SDK 3.0+ (Mobile)
- Maven
- Git

### 🛠️ Cài đặt dự án / Project Setup

```bash
git clone https://github.com/Nguyen99QT/TOEIC.git
cd TOEIC

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd ../frontend
npm install
npm run dev

# Mobile
cd ../mobile
flutter pub get
flutter run
```

---

## 📝 Tính năng chính / Key Features

- ✅ Đa nền tảng (Web, Android, iOS) / Multi-platform (Web, Android, iOS)
- ✅ Luyện tập TOEIC đầy đủ, chia phần / Full TOEIC practice, section-wise
- ✅ Theo dõi tiến độ học / User progress tracking
- ✅ Ngân hàng câu hỏi phong phú / Comprehensive question bank
- ✅ Test thử, kiểm tra kết quả / Practice tests & results
- ✅ Quản lý người dùng / User management
- ✅ Xác thực bảo mật JWT / Secure authentication (JWT)
- ✅ API đầy đủ tài liệu / Complete API documentation

---

## 🔗 API Documentation / Tài liệu API

- **Base URL:** http://localhost:8080
- **Auth:** JWT qua header `Authorization: Bearer <token>`
- **Swagger:** http://localhost:8080/swagger-ui.html

### Ví dụ một số endpoint / Example endpoints

| Method | Endpoint                 | Chức năng / Description      | Auth |
|--------|--------------------------|------------------------------|------|
| GET    | /api/health              | Kiểm tra server / Health     | ❌   |
| POST   | /api/auth/login          | Đăng nhập / Login            | ❌   |
| POST   | /api/auth/register       | Đăng ký / Register           | ❌   |
| GET    | /api/users/{id}          | Lấy thông tin người dùng     | ✅   |
| GET    | /api/questions           | Lấy danh sách câu hỏi        | ✅   |
| POST   | /api/test-sessions       | Bắt đầu bài test / Start test| ✅   |

---

## 📁 Cấu trúc thư mục chi tiết / Project Structure

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/leenglish/toeic/
│   ├── controller/     # REST Controllers
│   ├── service/        # Business logic
│   ├── repository/     # Data access
│   ├── model/          # Entity models
│   ├── config/         # Cấu hình bảo mật
│   └── dto/            # Data Transfer Objects
├── src/main/resources/
│   ├── application.properties
│   ├── static/audio/
│   └── static/images/
├── pom.xml
```
### Frontend (Next.js)
```
frontend/
├── src/app/            # App Router
├── components/         # React Components
├── lib/                # API utilities
├── types/              # TypeScript types
├── package.json
```
### Mobile (Flutter)
```
mobile/
├── lib/
│   ├── main.dart
│   ├── models/
│   ├── services/
│   ├── screens/
│   ├── widgets/
│   ├── providers/
│   └── utils/
├── assets/             # Images, audio
├── pubspec.yaml
```

---

## 🧑‍💻 Đóng góp / Contributing

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit & push
4. Tạo Pull Request

---

## 📝 License

Dự án này được cấp phép dưới MIT License.  
This project is licensed under the MIT License.

---

## 💬 Liên hệ & cộng đồng / Support & Community

- 📧 Email: support@leenglish.com
- 🐛 Issues: [GitHub Issues](https://github.com/Nguyen99QT/TOEIC/issues)
- 📖 Wiki: [Documentation Wiki](https://github.com/Nguyen99QT/TOEIC/wiki)

---

**⭐ Nếu thấy hữu ích, hãy cho repo này một Star! / Star this repository if you find it helpful! ⭐**

---

Bạn có thể copy nội dung này vào file `README.md` của dự án. Nếu cần thêm phần mô tả, báo cáo, hoặc bổ sung chi tiết cho từng module, hãy phản hồi nhé!