# Comment và Feedback API Documentation

## Tổng quan

Hệ thống API cho tính năng comment lesson và feedback admin đã được phát triển hoàn chỉnh với đầy đủ Repository, Service, và Controller layers.

## 🎯 **Comment System API**

### Base URL: `/api/comments`

### 1. Comment Operations

#### Tạo comment mới
```http
POST /api/comments/lessons/{lessonId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "Great lesson! Very helpful for TOEIC preparation."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "userName": "john_doe",
    "userAvatar": "https://example.com/avatar.jpg",
    "lessonId": 1,
    "content": "Great lesson! Very helpful for TOEIC preparation.",
    "isEdited": false,
    "createdAt": "2024-01-15T10:30:00",
    "likeCount": 0,
    "dislikeCount": 0,
    "replies": [],
    "isLikedByCurrentUser": false,
    "isDislikedByCurrentUser": false,
    "canEdit": true,
    "canDelete": true
  }
}
```

#### Cập nhật comment
```http
PUT /api/comments/{commentId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "Updated comment content"
}
```

#### Xóa comment
```http
DELETE /api/comments/{commentId}
Authorization: Bearer {token}
```

#### Lấy comment theo ID
```http
GET /api/comments/{commentId}
Authorization: Bearer {token}
```

#### Lấy comments của lesson
```http
GET /api/comments/lessons/{lessonId}?page=0&size=10&sortBy=createdAt&sortDir=desc
Authorization: Bearer {token}
```

#### Lấy comments của user
```http
GET /api/comments/users/{userId}?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy comments gần đây
```http
GET /api/comments/recent?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy comments phổ biến
```http
GET /api/comments/popular?page=0&size=10
Authorization: Bearer {token}
```

#### Đếm comments của lesson
```http
GET /api/comments/lessons/{lessonId}/count
Authorization: Bearer {token}
```

### 2. Reply Operations

#### Tạo reply
```http
POST /api/comments/{commentId}/replies
Content-Type: application/json
Authorization: Bearer {token}

"I agree with your comment!"
```

#### Cập nhật reply
```http
PUT /api/comments/replies/{replyId}
Content-Type: application/json
Authorization: Bearer {token}

"Updated reply content"
```

#### Xóa reply
```http
DELETE /api/comments/replies/{replyId}
Authorization: Bearer {token}
```

#### Lấy replies của comment
```http
GET /api/comments/{commentId}/replies
Authorization: Bearer {token}
```

### 3. Like Operations

#### Like comment
```http
POST /api/comments/{commentId}/like
Authorization: Bearer {token}
```

#### Dislike comment
```http
POST /api/comments/{commentId}/dislike
Authorization: Bearer {token}
```

#### Unlike comment
```http
DELETE /api/comments/{commentId}/like
Authorization: Bearer {token}
```

#### Undislike comment
```http
DELETE /api/comments/{commentId}/dislike
Authorization: Bearer {token}
```

#### Like reply
```http
POST /api/comments/replies/{replyId}/like
Authorization: Bearer {token}
```

#### Dislike reply
```http
POST /api/comments/replies/{replyId}/dislike
Authorization: Bearer {token}
```

## 📋 **Feedback System API**

### Base URL: `/api/feedback`

### 1. User Operations

#### Tạo feedback mới
```http
POST /api/feedback
Content-Type: application/json
Authorization: Bearer {token}

{
  "subject": "Bug Report",
  "content": "The audio is not playing in lesson 5",
  "feedbackType": "BUG_REPORT",
  "priority": "HIGH",
  "isAnonymous": false,
  "contactEmail": "user@example.com",
  "contactPhone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "userName": "john_doe",
    "userAvatar": "https://example.com/avatar.jpg",
    "subject": "Bug Report",
    "content": "The audio is not playing in lesson 5",
    "feedbackType": "BUG_REPORT",
    "priority": "HIGH",
    "status": "PENDING",
    "isAnonymous": false,
    "contactEmail": "user@example.com",
    "contactPhone": "0123456789",
    "adminResponse": null,
    "createdAt": "2024-01-15T10:30:00",
    "canEdit": true,
    "canDelete": true,
    "canRespond": false
  }
}
```

#### Cập nhật feedback
```http
PUT /api/feedback/{feedbackId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "subject": "Updated Bug Report",
  "content": "Updated content",
  "feedbackType": "BUG_REPORT",
  "priority": "HIGH"
}
```

#### Xóa feedback
```http
DELETE /api/feedback/{feedbackId}
Authorization: Bearer {token}
```

#### Lấy feedback của user
```http
GET /api/feedback/my?page=0&size=10
Authorization: Bearer {token}
```

### 2. Admin Operations

#### Lấy tất cả feedback
```http
GET /api/feedback/admin/all?page=0&size=10&sortBy=createdAt&sortDir=desc
Authorization: Bearer {token}
```

#### Lấy feedback theo trạng thái
```http
GET /api/feedback/admin/status/{status}?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy feedback theo độ ưu tiên
```http
GET /api/feedback/admin/priority/{priority}?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy feedback theo loại
```http
GET /api/feedback/admin/type/{feedbackType}?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy feedback chờ xử lý
```http
GET /api/feedback/admin/pending?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy feedback khẩn cấp
```http
GET /api/feedback/admin/urgent?page=0&size=10
Authorization: Bearer {token}
```

#### Lấy feedback cần phản hồi
```http
GET /api/feedback/admin/needing-response?page=0&size=10
Authorization: Bearer {token}
```

#### Phản hồi feedback
```http
PUT /api/feedback/admin/{feedbackId}/respond
Content-Type: application/json
Authorization: Bearer {token}

{
  "adminResponse": "We are investigating this issue. Thank you for reporting.",
  "status": "IN_PROGRESS"
}
```

#### Cập nhật trạng thái feedback
```http
PUT /api/feedback/admin/{feedbackId}/status?status=RESOLVED
Authorization: Bearer {token}
```

#### Tìm kiếm feedback
```http
GET /api/feedback/admin/search?searchTerm=audio&page=0&size=10
Authorization: Bearer {token}
```

#### Lọc feedback theo tiêu chí
```http
GET /api/feedback/admin/filter?status=PENDING&priority=HIGH&feedbackType=BUG_REPORT&page=0&size=10
Authorization: Bearer {token}
```

### 3. Statistics

#### Thống kê tổng quan
```http
GET /api/feedback/admin/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback statistics retrieved successfully",
  "data": {
    "total": 150,
    "pending": 25,
    "urgent": 5,
    "resolved": 100,
    "closed": 20,
    "lowPriority": 30,
    "mediumPriority": 80,
    "highPriority": 30,
    "urgentPriority": 10,
    "bugReportCount": 50,
    "featureRequestCount": 30,
    "technicalIssueCount": 40,
    "generalCount": 30
  }
}
```

#### Lấy feedback gần đây
```http
GET /api/feedback/admin/recent?limit=5
Authorization: Bearer {token}
```

#### Đếm feedback theo trạng thái
```http
GET /api/feedback/admin/count/status/{status}
Authorization: Bearer {token}
```

#### Đếm feedback theo độ ưu tiên
```http
GET /api/feedback/admin/count/priority/{priority}
Authorization: Bearer {token}
```

#### Đếm feedback theo loại
```http
GET /api/feedback/admin/count/type/{feedbackType}
Authorization: Bearer {token}
```

#### Đếm feedback khẩn cấp
```http
GET /api/feedback/admin/count/urgent
Authorization: Bearer {token}
```

#### Đếm feedback chờ xử lý
```http
GET /api/feedback/admin/count/pending
Authorization: Bearer {token}
```

## 🔧 **Enums và Constants**

### FeedbackType
- `GENERAL` - Feedback chung
- `BUG_REPORT` - Báo cáo lỗi
- `FEATURE_REQUEST` - Yêu cầu tính năng
- `TECHNICAL_ISSUE` - Vấn đề kỹ thuật
- `CONTENT_REQUEST` - Yêu cầu nội dung
- `ACCOUNT_ISSUE` - Vấn đề tài khoản
- `PAYMENT_ISSUE` - Vấn đề thanh toán
- `SUGGESTION` - Đề xuất
- `COMPLAINT` - Khiếu nại
- `OTHER` - Khác

### Priority
- `LOW` - Thấp
- `MEDIUM` - Trung bình
- `HIGH` - Cao
- `URGENT` - Khẩn cấp

### Status
- `PENDING` - Chờ xử lý
- `IN_PROGRESS` - Đang xử lý
- `RESOLVED` - Đã giải quyết
- `CLOSED` - Đã đóng

### LikeType
- `LIKE` - Thích
- `DISLIKE` - Không thích

## 📊 **Database Schema**

### Bảng chính:
1. **`lesson_comments`** - Comments cho lesson
2. **`comment_replies`** - Replies cho comments
3. **`comment_likes`** - Like/dislike cho comments và replies
4. **`feedback`** - Feedback gửi đến admin

### Views:
1. **`comment_statistics`** - Thống kê comments
2. **`feedback_statistics`** - Thống kê feedback

### Triggers:
- Tự động cập nhật like/dislike counts
- Tự động cập nhật timestamps

## 🚀 **Deployment**

### 1. Chạy migration
```sql
-- Chạy file: backend/database/migrations/create_comment_and_feedback_system.sql
```

### 2. Cấu hình application.properties
```properties
# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# Pagination
spring.data.web.pageable.default-page-size=10
spring.data.web.pageable.max-page-size=100
```

### 3. Test API
```bash
# Test comment API
curl -X POST http://localhost:8080/api/comments/lessons/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test comment"}'

# Test feedback API
curl -X POST http://localhost:8080/api/feedback \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test", "content": "Test feedback", "feedbackType": "GENERAL"}'
```

## 📝 **Notes**

1. **Authentication**: Tất cả API đều yêu cầu JWT token
2. **Authorization**: User chỉ có thể edit/delete content của mình
3. **Pagination**: Tất cả list API đều hỗ trợ pagination
4. **Soft Delete**: Không xóa hoàn toàn data, chỉ đánh dấu deleted
5. **Audit Trail**: Tất cả entity đều có createdAt, updatedAt
6. **Performance**: Đã tạo indexes tối ưu cho query
7. **Validation**: Sử dụng Bean Validation cho request DTOs
8. **Error Handling**: Sử dụng global exception handler 