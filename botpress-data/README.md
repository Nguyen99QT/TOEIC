# README - BOTPRESS DATA FILES

## 📁 Vị trí các file dữ liệu cho Botpress

Thư mục này chứa các file dữ liệu để upload lên Botpress Studio:

### 📚 Knowledge Base Files (để upload lên Botpress Studio):
1. **toeic_platform_features.txt** - Tính năng của platform
2. **toeic_faq.txt** - Câu hỏi thường gặp
3. **toeic_learning_tips.txt** - Tips học TOEIC
4. **navigation_guide.txt** - Hướng dẫn điều hướng

### ⚙️ Configuration Files (để tham khảo khi setup):
5. **intents_config.md** - Cấu hình Intents
6. **entities_config.md** - Cấu hình Entities

## 🔄 Cách sử dụng:

### Bước 1: Upload Knowledge Base
1. Truy cập Botpress Studio: https://studio.botpress.cloud
2. Chọn bot ID: UA3DI17D
3. Vào tab "Knowledge Base"
4. Upload 4 file .txt vào Knowledge Base

### Bước 2: Tạo Intents
- Sử dụng nội dung trong `intents_config.md`
- Tạo 3 intents chính: start_test, check_score, learn_vocabulary

### Bước 3: Tạo Entities  
- Sử dụng nội dung trong `entities_config.md`
- Tạo 3 entities: test_type, difficulty, lesson_topic

### Bước 4: Test & Deploy
- Test bot với các câu hỏi mẫu
- Deploy sau khi kiểm tra

## 📍 Vị trí trong project:
```
TOEIC/
├── botpress-data/           ← CÁC FILE NÀY
│   ├── toeic_platform_features.txt
│   ├── toeic_faq.txt
│   ├── toeic_learning_tips.txt
│   ├── navigation_guide.txt
│   ├── intents_config.md
│   ├── entities_config.md
│   └── README.md
├── frontend/
│   └── src/
│       └── utils/
│           └── chatSessionManager.js  ← ĐÃ TÍCH HỢP
└── ...
```

## 🎯 Mục đích:
- Cung cấp dữ liệu TOEIC chuyên biệt cho chatbot
- Hỗ trợ người dùng học TOEIC hiệu quả
- Tích hợp seamlessly với platform LeEnglish
