# 🎓 LeEnglish TOEIC Platform - Frontend

> Comprehensive TOEIC learning platform built with React.js + TypeScript

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](http://localhost:3001)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38bdf8)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file environment
cp .env.example .env

# 3. Khởi động development server
npm start
# ➜ Ứng dụng chạy tại: http://localhost:3001
```

## ✅ Current Status: **STABLE & READY**

- ✅ **Compilation**: 100% successful
- ✅ **TypeScript**: No errors, full type safety
- ✅ **Development Server**: Running stable on http://localhost:3001
- ✅ **All Components**: Properly imported and exported
- ✅ **Dependencies**: All installed and configured
- ✅ **Ready for**: Backend integration and feature development

## 📋 Tổng quan dự án

LeEnglish TOEIC Platform là một ứng dụng học tiếng Anh TOEIC toàn diện với các tính năng:

- **🎯 Luyện thi TOEIC**: Bài tập theo từng Part 1-7
- **📚 Bài học tương tác**: Nội dung học phong phú
- **🔖 Flashcards**: Học từ vựng hiệu quả
- **📊 Theo dõi tiến độ**: Thống kê chi tiết kết quả học
- **👥 Quản lý người dùng**: Hệ thống phân quyền RBAC
- **🎨 Giao diện hiện đại**: Responsive design với TailwindCSS

## 🛠 Công nghệ sử dụng

### Core Technologies

- **React.js 18.2** - UI Library
- **TypeScript** - Type Safety
- **React Router DOM v6** - Routing
- **TailwindCSS v3.3.6** - Styling Framework

### Libraries & Tools

- **Axios** - HTTP Client với interceptors
- **React Hot Toast** - Notifications
- **HeadlessUI** - Accessible UI Components
- **Heroicons** - Icon Library
- **clsx** - Conditional CSS Classes

### Development

- **Create React App** - Build Tool
- **PostCSS** - CSS Processing
- **Autoprefixer** - CSS Vendor Prefixes

## 🏗 Cấu trúc dự án

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/        # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/           # UI components
│   │       └── LoadingSpinner.tsx
│   ├── pages/             # Page components
│   │   ├── auth/         # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── admin/        # Admin pages
│   │   │   ├── AdminUsersPage.tsx
│   │   │   └── AdminContentPage.tsx
│   │   ├── user/         # User pages
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── lessons/      # Learning pages
│   │   │   ├── LessonsPage.tsx
│   │   │   └── LessonDetailPage.tsx
│   │   ├── exercises/    # Exercise pages
│   │   │   ├── ExercisesPage.tsx
│   │   │   └── ExerciseDetailPage.tsx
│   │   ├── flashcards/   # Flashcard pages
│   │   │   └── FlashcardsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/          # API services
│   │   ├── api.ts        # Base API client
│   │   ├── auth.ts       # Authentication service
│   │   └── users.ts      # User management service
│   ├── types/            # TypeScript definitions
│   │   └── index.ts      # All type definitions
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── package.json
├── tailwind.config.js    # TailwindCSS configuration
├── postcss.config.js     # PostCSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 16+
- npm hoặc yarn

### Cài đặt dependencies

```bash
cd frontend
npm install
```

### Chạy development server

```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

> **Lưu ý**: Nếu port 3000 đã được sử dụng, ứng dụng sẽ tự động chạy trên port tiếp theo (3001, 3002, ...)
> Hoặc bạn có thể chỉ định port cụ thể:

```bash
# Windows PowerShell
$env:PORT=3001; npm start

# Linux/macOS
PORT=3001 npm start
```

### Build production

```bash
npm run build
```

### Chạy tests

```bash
npm test
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```bash
REACT_APP_API_URL=http://localhost:8080/api
```

### TailwindCSS

Dự án sử dụng custom design system với:

- Primary colors: Blue palette
- Custom components: buttons, forms, cards
- Responsive breakpoints
- Dark mode support (sắp tới)

## 🎨 Design System

### Colors

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#22c55e)
- **Danger**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

### Components

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`
- **Forms**: `.form-input`, `.form-label`, `.form-select`
- **Cards**: `.card`, `.card-header`, `.card-body`
- **Badges**: `.badge`, `.badge-primary`

## 🔐 Authentication & Authorization

### Roles (RBAC)

- **USER**: Học viên thông thường
- **COLLABORATOR**: Có thể tạo/sửa nội dung
- **ADMIN**: Quản trị viên hệ thống

### Protected Routes

- Dashboard và các trang học: Yêu cầu đăng nhập
- Admin Panel: Chỉ ADMIN
- Profile: Người dùng chỉ sửa được profile của mình

### Token Management

- JWT tokens với auto-refresh
- Lưu trữ secure trong localStorage
- Automatic logout khi token hết hạn

## 📱 Responsive Design

- **Mobile First**: Tối ưu cho mobile trước
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Buttons và interactions phù hợp mobile

## 🔍 TypeScript Types

Dự án có type definitions đầy đủ cho:

- User entities và roles
- Lesson, Exercise, Question models
- API responses và requests
- Form data và validation
- Enum values (Skills, Difficulty, Parts)

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests (sắp tới)

- Cypress integration
- User journey testing

## 📦 Deployment

### Build optimization

```bash
npm run build
```

### Static hosting

- Vercel (recommended)
- Netlify
- GitHub Pages

## 🔄 Integration với Backend

Kết nối với Spring Boot backend tại:

- Base URL: `http://localhost:8080/api`
- Authentication: JWT Bearer tokens
- CORS: Configured for frontend domain

### API Endpoints

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /users` - Danh sách người dùng (Admin)
- `GET /lessons` - Danh sách bài học
- `GET /exercises` - Danh sách bài tập

## 🛡 Security Features

- XSS Protection
- CSRF Protection
- Secure token storage
- Input validation
- Role-based access control

## 🎯 Roadmap

### Phase 1 (Hoàn thành)

- ✅ Project setup với React + TypeScript
- ✅ Authentication system
- ✅ Basic UI components
- ✅ Routing và protected routes
- ✅ TailwindCSS integration

### Phase 2 (Đang phát triển)

- 🔄 API integration với backend
- 🔄 Lesson content display
- 🔄 Exercise taking interface
- 🔄 Progress tracking
- 🔄 Admin management interface

### Phase 3 (Sắp tới)

- 📋 Real-time features
- 📋 Advanced analytics
- 📋 Mobile app (React Native)
- 📋 PWA features
- 📋 Offline support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Developer**: React.js + TypeScript
- **Backend Developer**: Spring Boot + Java
- **UI/UX Designer**: TailwindCSS + Figma

## 📞 Contact

- Email: leenglish@example.com
- GitHub: https://github.com/HUYDUU19/leenglish-toeic-platform

---

**Made with ❤️ for TOEIC learners**

## 🔧 Troubleshooting

### Lỗi thường gặp và cách khắc phục

#### 1. TypeScript Import Errors

```bash
# Lỗi: Cannot find module './components/...'
# Giải pháp: Xóa cache và cài đặt lại
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

#### 2. Port đã được sử dụng

```bash
# Lỗi: Something is already running on port 3000
# Giải pháp: Sử dụng port khác
$env:PORT=3001; npm start
```

#### 3. TailwindCSS không hoạt động

```bash
# Kiểm tra file tailwind.config.js và postcss.config.js
# Đảm bảo đã import './index.css' trong src/index.tsx
npm run build  # Build lại để test
```

#### 4. Dependency Conflicts

```bash
# Xóa hoàn toàn node_modules và package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json
npm cache clean --force
npm install
```

#### 5. API Connection Issues

```bash
# Kiểm tra file .env có REACT_APP_API_URL chính xác
# Đảm bảo backend Spring Boot đang chạy trên port 8080
```

### Hot Reload Issues

Nếu hot reload không hoạt động:

```bash
# Tắt và khởi động lại development server
# Hoặc thêm vào .env:
FAST_REFRESH=true
CHOKIDAR_USEPOLLING=true
```

### Performance Tips

- Sử dụng React DevTools để debug
- Kiểm tra Network tab để theo dõi API calls
- Sử dụng Lighthouse để đánh giá performance

## 📈 Changelog

### v0.1.1 (19/06/2025) - Bug Fixes & Stability

#### 🐛 Bug Fixes

- **TypeScript Imports**: Sửa lỗi "Cannot find module" cho tất cả components
- **Dependencies**: Cài đặt đầy đủ react-router-dom, react-hot-toast
- **Module Resolution**: Tối ưu cấu trúc import và export
- **Cache Issues**: Xóa và reinstall node_modules để sửa conflicts

#### ✨ Improvements

- **Development Server**: Ổn định, compile 100% thành công
- **Port Flexibility**: Tự động chạy trên port khác khi 3000 bị chiếm
- **Error Handling**: Cải thiện error messages và debugging
- **Documentation**: Cập nhật README với troubleshooting guide

#### 🔧 Technical

- Clean TypeScript compilation
- Stable webpack dev server
- Optimized import paths
- Better module organization

### v0.1.0 (Trước 19/06/2025) - Initial Release

#### 🎉 Features

- React.js 18 + TypeScript setup
- TailwindCSS v3 styling framework
- React Router v6 with RBAC
- Complete page structure
- API service layer with Axios
- Layout components (Navbar, Sidebar, Footer)
- Authentication system foundation
- Responsive design system
