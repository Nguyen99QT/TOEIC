# 📝 TOEIC Test Pages - Created by Nguyen

## 🎯 Mô tả
Trang làm bài thi TOEIC với đầy đủ tính năng chuyên nghiệp, được tạo trong folder `frontend/src/pages/Nguyen/`.

## 📁 Cấu trúc Files
```
frontend/src/pages/Nguyen/
├── TestPage.tsx          # Trang làm bài thi chính
├── TestListPage.tsx      # Trang danh sách bài thi
├── index.ts              # Export file
└── README.md             # File này
```

## 🚀 Tính năng chính

### TestPage.tsx
- ⏰ **Timer đếm ngược**: 2 giờ cho bài thi TOEIC
- 📊 **Progress bar**: Hiển thị tiến độ làm bài
- 🧭 **Question navigation**: Sidebar để di chuyển giữa các câu hỏi
- 🎵 **Audio support**: Hỗ trợ phát audio cho listening
- 🖼️ **Image support**: Hiển thị hình ảnh câu hỏi
- 📝 **Answer tracking**: Lưu trạng thái đáp án
- 🏆 **Score calculation**: Tính điểm theo chuẩn TOEIC
- 📋 **Result display**: Hiển thị kết quả chi tiết

### TestListPage.tsx
- 📋 **Test listing**: Danh sách tất cả bài thi
- ➕ **Create test**: Tạo bài thi mới từ question bank
- 🎯 **Demo test**: Bài thi demo để thử nghiệm
- 📊 **TOEIC structure info**: Thông tin cấu trúc bài thi

## 🔗 Routes được thêm vào App.tsx
```tsx
{/* Test Routes by Nguyen */}
<Route path="/tests" element={<ProtectedRoute><Layout><TestListPage /></Layout></ProtectedRoute>} />
<Route path="/tests/:testId" element={<ProtectedRoute><Layout><TestPage /></Layout></ProtectedRoute>} />
<Route path="/tests/demo" element={<ProtectedRoute><Layout><TestPage /></Layout></ProtectedRoute>} />
```

## 🔧 Service Layer

### tests.ts Service
Cung cấp các API calls:
- `getAllTests()` - Lấy danh sách bài thi
- `getTestById(id)` - Lấy thông tin chi tiết bài thi
- `generateTest(request)` - Tạo bài thi mới
- `getTestQuestions(testId)` - Lấy câu hỏi của bài thi
- `submitTest(submission)` - Nộp bài thi
- `getTestResult(resultId)` - Lấy kết quả chi tiết

## 🎨 UI/UX Features

### Responsive Design
- 📱 Mobile-friendly layout
- 🖥️ Desktop optimized interface
- 📐 Grid system cho question navigation

### Visual Indicators
- 🔵 Câu hiện tại (màu xanh)
- 🟢 Đã trả lời (màu xanh lá)
- ⚪ Chưa trả lời (màu xám)
- 🔴 Timer warnings (đỏ khi < 5 phút)

### Interactive Elements
- ✅ Radio buttons cho multiple choice
- 🎵 Audio controls
- ⏭️ Navigation buttons
- 📊 Progress indicators

## 🔌 Backend Integration

### API Endpoints sử dụng:
- `GET /api/tests` - Danh sách tests
- `GET /api/tests/{id}` - Chi tiết test
- `POST /api/tests/generate` - Tạo test mới
- `GET /api/question-group/all` - Lấy questions
- `POST /api/submit` - Nộp bài
- `GET /api/submit/result/{id}` - Kết quả

## 🎯 Cách sử dụng

### 1. Truy cập trang Tests
- Đăng nhập vào hệ thống
- Click vào "Tests" trong navbar
- Sẽ hiển thị TestListPage

### 2. Làm bài thi demo
- Click "Làm bài thi demo" 
- Hệ thống sẽ load câu hỏi từ question bank
- Bắt đầu làm bài với timer 2 giờ

### 3. Tạo bài thi mới
- Click "Tạo bài thi mới"
- Điền thông tin: tên, mô tả
- Chọn số câu hỏi cho mỗi Part (1-7)
- Hệ thống tự động generate từ question bank

### 4. Trong quá trình làm bài
- Sử dụng sidebar để navigate
- Audio/Image tự động hiển thị
- Timer đếm ngược liên tục
- Progress bar cập nhật real-time

### 5. Nộp bài và xem kết quả
- Click "Nộp bài" khi hoàn thành
- Hệ thống tự động chấm điểm
- Hiển thị kết quả Listening/Reading
- Có thể xem chi tiết từng câu

## 🔧 Technical Details

### State Management
- React hooks (useState, useEffect, useCallback)
- Local state cho answers, timer, navigation
- Error handling và loading states

### Performance Optimization
- useCallback cho expensive operations
- Conditional rendering
- Efficient re-renders

### Security
- Protected routes
- Authentication required
- Input validation

## 🚀 Demo
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm start`
3. Navigate to: `http://localhost:3000/tests`
4. Đăng nhập và thử nghiệm!

## 👤 Created by
**Nguyen** - TOEIC Test System Developer

---
*Trang này được tích hợp hoàn toàn với backend Spring Boot và sử dụng question bank có sẵn để tạo bài thi TOEIC chuyên nghiệp.*
