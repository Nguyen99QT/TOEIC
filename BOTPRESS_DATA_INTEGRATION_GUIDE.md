# 🤖 HƯỚNG DẪN THÊM DỮ LIỆU TOEIC VÀO BOTPRESS

## 📋 **Tổng quan**
File `chatSessionManager.js` đã được tạo với đầy đủ dữ liệu TOEIC để tích hợp với Botpress. Dưới đây là hướng dẫn chi tiết để thêm dữ liệu vào Botpress Studio.

## 🎯 **1. Truy cập Botpress Studio**

### **Đăng nhập:**
1. Truy cập: https://studio.botpress.cloud
2. Đăng nhập với tài khoản của bạn
3. Chọn bot ID: `UA3DI17D` (như trong code của bạn)

## 📚 **2. Thêm Knowledge Base**

### **Bước 1: Tạo Knowledge Base mới**
```
1. Vào tab "Knowledge Base" trong Botpress Studio
2. Click "Create Knowledge Base"
3. Đặt tên: "TOEIC Learning Platform"
4. Mô tả: "Comprehensive TOEIC learning and test preparation platform"
```

### **Bước 2: Upload nội dung TOEIC**
Tạo các file text sau và upload vào Knowledge Base:

#### **File 1: toeic_platform_features.txt**
```txt
TOEIC Learning Platform Features:

1. TESTS:
- Listening Test: 100 questions, 45 minutes, includes Photos, Question-Response, Conversations, Talks
- Reading Test: 100 questions, 75 minutes, includes Incomplete Sentences, Text Completion, Reading Comprehension  
- Full TOEIC Test: 200 questions, 2 hours, complete listening and reading sections

2. LESSONS:
- Grammar lessons organized by difficulty
- Vocabulary building with themed content
- Pronunciation practice with audio
- Progressive learning path

3. FLASHCARDS:
- Vocabulary flashcard system
- Spaced repetition learning
- Custom study sets
- Progress tracking

4. PROGRESS TRACKING:
- Detailed score history
- Performance analytics
- Improvement recommendations
- Study time tracking

5. COMMUNITY:
- Blog posts with TOEIC tips
- Student experience sharing
- Study group discussions
- Expert advice articles
```

#### **File 2: toeic_faq.txt**
```txt
TOEIC Platform FAQ:

Q: Làm sao để bắt đầu học TOEIC?
A: Đăng ký tài khoản → Chọn "Bài học" để học từ cơ bản → Hoặc "Bài thi" để đánh giá trình độ hiện tại

Q: Làm bài thi như thế nào?
A: Vào mục "Tests" → Chọn loại bài thi (Listening/Reading/Full) → Nhấn "Bắt đầu làm bài" → Làm theo thời gian quy định

Q: Xem điểm ở đâu?
A: Sau khi hoàn thành bài thi, điểm hiển thị ngay → Xem chi tiết trong "Test History" → Dashboard cho tổng quan tiến trình

Q: Cách học từ vựng hiệu quả?
A: Sử dụng Flashcards hàng ngày → Học theo chủ đề trong Lessons → Ghi chép từ mới → Ôn tập định kỳ

Q: Thay đổi thông tin cá nhân ở đâu?
A: Vào "Profile" từ menu → "Edit Profile" để cập nhật → "Change Password" để đổi mật khẩu

Q: Liên hệ hỗ trợ như thế nào?
A: Dùng trang "Contact" → Hoặc chat trực tiếp qua chatbot → Email support team
```

#### **File 3: toeic_learning_tips.txt**
```txt
TOEIC Learning Tips:

LISTENING TIPS:
- Nghe podcast tiếng Anh hàng ngày 15-30 phút
- Luyện tập với đoạn hội thoại ngắn trước
- Chú ý từ khóa trong câu hỏi (who, what, when, where)
- Đừng bỏ qua câu hỏi nếu không nghe rõ, chọn đáp án hợp lý nhất
- Luyện nghe nhiều giọng: Mỹ, Anh, Úc, Canada

READING TIPS:
- Skimming: Đọc lướt để nắm ý chính
- Scanning: Tìm thông tin cụ thể nhanh chóng
- Chú ý thì của động từ trong câu
- Quản lý thời gian: 1 phút/câu
- Đọc nhiều tài liệu tiếng Anh đa dạng

VOCABULARY TIPS:
- Học 20-30 từ mới mỗi ngày
- Học theo chủ đề: business, travel, daily life
- Sử dụng flashcard thường xuyên
- Đọc tin tức tiếng Anh
- Ghi chép và ôn tập định kỳ

GENERAL STUDY TIPS:
- Luyện tập đều đặn mỗi ngày
- Làm bài test thử hàng tuần
- Phân tích lỗi sai để cải thiện
- Tham gia cộng đồng học tập
- Đặt mục tiêu điểm số cụ thể
```

#### **File 4: navigation_guide.txt**
```txt
Platform Navigation Guide:

DASHBOARD:
- Trang tổng quan hiển thị tiến trình học tập
- Thống kê điểm số và thời gian học
- Gợi ý bài học tiếp theo
- Lịch sử hoạt động gần đây

TESTS:
- Chọn loại bài thi phù hợp trình độ
- Xem hướng dẫn trước khi làm bài
- Quản lý thời gian hiệu quả
- Xem đáp án sau khi hoàn thành

LESSONS:
- Học theo trình tự từ cơ bản đến nâng cao
- Hoàn thành bài tập cuối mỗi bài học
- Ghi chú những điểm quan trọng
- Ôn tập định kỳ

FLASHCARDS:
- Tạo bộ thẻ theo chủ đề
- Học theo phương pháp spaced repetition
- Đánh dấu từ khó để ôn tập thêm
- Theo dõi tiến trình học từ vựng

PROFILE:
- Cập nhật thông tin cá nhân
- Đặt mục tiêu học tập
- Xem thống kê chi tiết
- Quản lý cài đặt tài khoản
```

## 🎮 **3. Tạo Intents (Ý định)**

### **Intent 1: start_test**
```
Training phrases:
- "Tôi muốn làm bài thi"
- "Bắt đầu làm bài test"
- "Làm bài thi TOEIC"
- "Thi thử TOEIC"
- "Start test"

Response:
"Bạn muốn làm loại bài thi nào?
📝 Listening Test (45 phút)
📖 Reading Test (75 phút) 
🎯 Full TOEIC Test (2 giờ)

Hãy chọn loại phù hợp với thời gian của bạn!"
```

### **Intent 2: check_score**
```
Training phrases:
- "Xem điểm của tôi"
- "Kết quả bài thi"
- "Điểm số hiện tại"
- "Check score"
- "Xem kết quả"

Response:
"Để xem điểm số và kết quả chi tiết:
📊 Vào Dashboard → Test History
📈 Xem phân tích từng phần thi
📝 Đọc gợi ý cải thiện
🎯 So sánh với lần thi trước

Bạn cần hỗ trợ gì thêm về kết quả?"
```

### **Intent 3: learn_vocabulary**
```
Training phrases:
- "Học từ vựng"
- "Vocabulary"
- "Từ mới"
- "Flashcard"
- "Học từ"

Response:
"Có nhiều cách học từ vựng hiệu quả:
🎴 Flashcards - Học theo spaced repetition
📚 Lessons - Từ vựng theo chủ đề
📖 Reading - Học từ trong ngữ cảnh
🎧 Listening - Từ vựng qua âm thanh

Bạn muốn bắt đầu với phương pháp nào?"
```

## 🏷️ **4. Tạo Entities (Thực thể)**

### **Entity 1: test_type**
```
Values:
- listening: "listening test", "bài thi nghe", "nghe"
- reading: "reading test", "bài thi đọc", "đọc"  
- full: "full test", "bài thi đầy đủ", "thi thử"
```

### **Entity 2: difficulty**
```
Values:
- easy: "dễ", "cơ bản", "beginner", "easy"
- medium: "trung bình", "intermediate", "medium"
- hard: "khó", "nâng cao", "advanced", "hard"
```

### **Entity 3: lesson_topic**
```
Values:
- grammar: "ngữ pháp", "grammar", "văn phạm"
- vocabulary: "từ vựng", "vocabulary", "từ mới"
- pronunciation: "phát âm", "pronunciation"
```

## 🔧 **5. Workflow Configuration**

### **Main Conversation Flow:**
```
1. Welcome Message
   ↓
2. Detect User Intent
   ↓
3. Route to Appropriate Handler:
   - Test → Test Selection Flow
   - Learn → Learning Resources Flow  
   - Help → Support Flow
   - General → FAQ Search
   ↓
4. Provide Relevant Response
   ↓
5. Offer Next Steps/Suggestions
```

## 📊 **6. Analytics & Tracking**

### **Metrics to Track:**
- Most asked questions
- Popular test types
- Learning path preferences
- Session duration
- User satisfaction ratings

### **Custom Events:**
- test_started
- lesson_completed
- vocabulary_learned
- help_requested
- navigation_assistance

## 🚀 **7. Testing & Deployment**

### **Test Scenarios:**
1. **New User Journey:**
   - "Tôi mới tham gia, bắt đầu từ đâu?"
   - Expected: Welcome guide + first steps

2. **Test Taking:**
   - "Tôi muốn làm bài thi Listening"
   - Expected: Test info + direct link

3. **Score Inquiry:**
   - "Xem điểm bài thi gần nhất"
   - Expected: Score info + analysis

4. **Learning Help:**
   - "Làm sao học từ vựng hiệu quả?"
   - Expected: Study tips + resources

### **Deployment Steps:**
1. Train the bot với Knowledge Base
2. Test các intents và entities
3. Verify conversation flows
4. Deploy to production
5. Monitor performance

## 📞 **8. Integration với Frontend**

Chatbot đã được tích hợp trong `App.tsx` với:
- User context awareness
- Role-based responses  
- Page-specific suggestions
- Session management

File `chatSessionManager.js` cung cấp:
- Enhanced configuration
- User context tracking
- TOEIC-specific responses
- Analytics logging

## ✅ **Checklist hoàn thành:**

- [ ] Upload Knowledge Base files
- [ ] Tạo Intents chính
- [ ] Định nghĩa Entities
- [ ] Cấu hình Workflows
- [ ] Test conversation flows
- [ ] Deploy bot
- [ ] Monitor performance
- [ ] Collect user feedback
- [ ] Iterate and improve

---

**Lưu ý:** Sau khi cập nhật Botpress, có thể mất 5-10 phút để bot học và áp dụng dữ liệu mới. Hãy test thường xuyên để đảm bảo bot hoạt động chính xác!
