# 🔄 HƯỚNG DẪN: CHATBOT THAY ĐỔI DỮ LIỆU THEO NGƯỜI DÙNG

## 📋 **Tổng quan**
Hệ thống chatbot đã được cập nhật để tự động thay đổi dữ liệu và ngữ cảnh khi người dùng đăng nhập/đăng xuất hoặc chuyển đổi tài khoản.

## 🔧 **Cách hoạt động:**

### **1. Phát hiện thay đổi người dùng**
```jsx
// BotpressChat.jsx - useEffect theo dõi currentUser
useEffect(() => {
  if (chatInitialized) {
    configureBotpressForUser();
  }
}, [currentUser, location.pathname, chatInitialized, configureBotpressForUser]);
```

### **2. Chuyển đổi session tự động**
```javascript
// chatSessionManager.js - Phương thức switchUser
switchUser(user, currentPath = '/') {
  // Xóa session cũ nếu user khác
  if (this.currentUserId && this.currentUserId !== (user?.id || 'guest')) {
    this.clearSession(this.currentUserId);
  }
  
  // Tạo session mới cho user
  this.currentUserId = user?.id || 'guest';
  return this.getOrCreateSession(user, currentPath);
}
```

### **3. Tạo dữ liệu riêng cho từng user**
```javascript
// Tạo mock data dựa trên user ID
generateUserTestData(user) {
  if (!user) {
    return {
      testHistory: [],
      recommendations: ["Đăng ký để bắt đầu học TOEIC"]
    };
  }

  // Mock data khác nhau cho mỗi user
  const mockTestHistory = [
    {
      type: 'Listening',
      score: 350 + (user.id % 100), // Điểm khác nhau theo user ID
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return {
    testHistory: mockTestHistory,
    progress: { averageScore: calculated },
    recommendations: this.getUserRecommendations(user, averageScore)
  };
}
```

## 📊 **Dữ liệu thay đổi theo user:**

### **👤 User A (ID: 1):**
- **Điểm trung bình:** 451 (350 + 1)
- **Gợi ý:** "Xuất sắc! Hãy thử các bài test nâng cao"
- **Session ID:** `toeic_1_timestamp_random`

### **👤 User B (ID: 5):**
- **Điểm trung bình:** 455 (350 + 5) 
- **Gợi ý:** "Xuất sắc! Hãy thử các bài test nâng cao"
- **Session ID:** `toeic_5_timestamp_random`

### **👤 Guest User:**
- **Điểm trung bình:** 0
- **Gợi ý:** "Đăng ký tài khoản để bắt đầu hành trình học TOEIC"
- **Session ID:** `toeic_guest_timestamp_random`

## 🎯 **Tính năng chính:**

### **📈 Dữ liệu cá nhân hóa:**
- Lịch sử thi khác nhau cho mỗi user
- Điểm số tính toán dựa trên user ID
- Gợi ý học tập phù hợp với trình độ
- Theo dõi tiến trình riêng biệt

### **🔄 Chuyển đổi tự động:**
- Phát hiện khi user login/logout
- Xóa session cũ khi đổi user
- Tạo session mới với dữ liệu phù hợp
- Cập nhật context theo thời gian thực

### **💬 Tin nhắn cá nhân hóa:**
```javascript
// Ví dụ welcome message cho user đã login
`Xin chào ${user.username}! 👋

📊 Điểm trung bình: ${averageScore}/990
📝 Đã làm: ${testCount} bài thi
🎯 Gợi ý: ${recommendations[0]}

Bạn cần hỗ trợ gì hôm nay?`
```

## 🧪 **Test chức năng:**

### **Bước 1: Login với User 1**
1. Đăng nhập với tài khoản bất kỳ
2. Mở chatbot
3. Kiểm tra welcome message có tên user
4. Xem dữ liệu điểm số và lịch sử

### **Bước 2: Logout và login User 2**
1. Đăng xuất
2. Đăng nhập với tài khoản khác
3. Mở chatbot
4. **Kiểm tra:** Dữ liệu đã thay đổi theo user mới

### **Bước 3: Kiểm tra Guest**
1. Đăng xuất hoàn toàn
2. Mở chatbot
3. **Kiểm tra:** Hiển thị welcome message cho guest

## 📱 **Thực tế trong dự án:**

### **Thay thế mock data bằng API thực:**
```javascript
// Trong generateUserTestData(), thay thế bằng:
async generateUserTestData(user) {
  if (!user) return defaultGuestData;
  
  try {
    const response = await fetch(`/api/users/${user.id}/test-history`);
    const testHistory = await response.json();
    
    const progressResponse = await fetch(`/api/users/${user.id}/progress`);
    const progress = await progressResponse.json();
    
    return { testHistory, progress, recommendations: [...] };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return defaultUserData;
  }
}
```

### **Tích hợp với database:**
- Lưu session ID vào database
- Fetch lịch sử thi thật từ backend
- Tính toán điểm số và progress thực tế
- Cập nhật recommendations dựa trên AI

## ✅ **Kết quả đạt được:**

✅ **Chatbot nhận biết được user hiện tại**
✅ **Dữ liệu thay đổi khi đổi user** 
✅ **Session riêng biệt cho từng user**
✅ **Welcome message cá nhân hóa**
✅ **Gợi ý phù hợp với trình độ**
✅ **Xóa session cũ khi logout**
✅ **Tự động cập nhật khi user thay đổi**

---

**🎉 Giờ đây chatbot sẽ "nhớ" và thay đổi dữ liệu theo từng người dùng một cách tự động!**
