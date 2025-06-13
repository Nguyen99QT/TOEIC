
# TOEIC App – Hệ thống học và luyện thi TOEIC

## 🧠 Mô tả dự án

TOEIC App là một nền tảng hỗ trợ học tập và ôn luyện kỳ thi TOEIC dành cho người học. Ứng dụng bao gồm phần luyện từ vựng, ngữ pháp, nghe – đọc, bài thi thử và thống kê tiến trình học.  
Dự án gồm 3 phần: backend (Spring Boot), frontend web (React), và frontend mobile (Flutter).

---

## 📁 Cấu trúc thư mục

```
toeic-app/
├── mobile_frontend/        # Ứng dụng Flutter dành cho thiết bị di động
├── springboot-backend/     # Backend API sử dụng Spring Boot
├── web-frontend/           # Ứng dụng web sử dụng ReactJS
```

---

## 🚀 Hướng dẫn chạy từng phần

### ✅ 1. Spring Boot (Backend)

```bash
cd springboot-backend
./mvnw spring-boot:run      # hoặc dùng IDE như IntelliJ để chạy trực tiếp
```

> ✅ Yêu cầu: Java 17+, Maven

---

### ✅ 2. ReactJS (Web Frontend)

```bash
cd web-frontend
npm install
npm start
```

> ✅ Ứng dụng sẽ chạy tại `http://localhost:3000`

---

### ✅ 3. Flutter (Mobile Frontend)

```bash
cd mobile_frontend
flutter pub get
flutter run
```

> ✅ Cần thiết bị thật hoặc giả lập Android/iOS

---

## 👥 Đóng góp

Các thành viên có thể tạo nhánh mới từ `dev`, làm việc trên `feature/*`, sau đó tạo pull request để merge vào `dev`.

---

## 📄 License

This project is licensed under the MIT License.
