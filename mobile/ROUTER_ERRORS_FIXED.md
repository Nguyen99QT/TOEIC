# Flutter Router Errors - Giải Thích và Sửa Lỗi

## 🐛 **Các Lỗi Đã Sửa**

### **1. Lỗi Import Không Tồn Tại**

```
Target of URI doesn't exist: 'package:toeic_mobile/features/profile/pages/settings_page.dart'
```

**Nguyên nhân**:

- Import sai đường dẫn file
- File `settings_page.dart` nằm trong `features/settings/pages/` chứ không phải `features/profile/pages/`

**Cách sửa**:

```dart
// Sai
import 'package:toeic_mobile/features/profile/pages/settings_page.dart';

// Đúng
import 'package:toeic_mobile/features/settings/pages/settings_page.dart';
```

### **2. Lỗi Ambiguous Import (Import Mơ Hồ)**

```
The name 'AuthLayout' is defined in the libraries 'package:toeic_mobile/shared/widgets/layout/auth_layout.dart' and 'package:toeic_mobile/shared/widgets/layout/main_layout.dart'
```

**Nguyên nhân**:

- Có hai class `AuthLayout` được định nghĩa trong hai file khác nhau
- Dart không biết sử dụng class nào khi có tên trùng nhau

**Cách sửa**:
Sử dụng import alias để phân biệt:

```dart
import 'package:toeic_mobile/shared/widgets/layout/main_layout.dart';
import 'package:toeic_mobile/shared/widgets/layout/auth_layout.dart' as auth;

// Sau đó sử dụng
auth.AuthLayout(
  child: LoginPage(),
)
```

### **3. Lỗi Invocation of Non-Function**

```
'AuthLayout' isn't a function
```

**Nguyên nhân**:

- Dart nhầm lẫn `AuthLayout` là function thay vì class
- Có thể do vấn đề về import hoặc định nghĩa class

**Cách sửa**:

- Sử dụng prefix import để tránh conflict
- Đảm bảo `AuthLayout` là widget (class) chứ không phải function

### **4. Lỗi Undefined Method**

```
The method 'SettingsPage' isn't defined for the type 'AppRouter'
```

**Nguyên nhân**:

- Có vấn đề về import của `SettingsPage`
- Dart không tìm thấy class `SettingsPage`

**Cách sửa**:

- Kiểm tra import đúng đường dẫn
- Đảm bảo class `SettingsPage` được export từ file đúng

### **5. Lỗi Unused Import**

```
Unused import: 'package:flutter_riverpod/flutter_riverpod.dart'
```

**Nguyên nhân**:

- Import library nhưng không sử dụng trong code
- Gây ra warning không cần thiết

**Cách sửa**:

- Xóa import không cần thiết
- Hoặc sử dụng các component từ library đó

## ✅ **Code Sau Khi Sửa**

### **Imports được sửa**:

```dart
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:toeic_mobile/core/services/auth_service.dart';
import 'package:toeic_mobile/features/auth/pages/login_page.dart';
import 'package:toeic_mobile/features/auth/pages/register_page.dart';
import 'package:toeic_mobile/features/home/pages/home_page.dart';
import 'package:toeic_mobile/features/dashboard/pages/dashboard_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lessons_page.dart';
import 'package:toeic_mobile/features/lessons/pages/lesson_detail_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercises_page.dart';
import 'package:toeic_mobile/features/exercises/pages/exercise_detail_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcards_page.dart';
import 'package:toeic_mobile/features/flashcards/pages/flashcard_study_page.dart';
import 'package:toeic_mobile/features/profile/pages/profile_page.dart';
import 'package:toeic_mobile/features/settings/pages/settings_page.dart'; // Sửa đường dẫn
import 'package:toeic_mobile/shared/widgets/layout/main_layout.dart';
import 'package:toeic_mobile/shared/widgets/layout/auth_layout.dart' as auth; // Thêm alias
```

### **Sử dụng AuthLayout với prefix**:

```dart
GoRoute(
  path: '/login',
  pageBuilder: (context, state) => MaterialPage(
    child: auth.AuthLayout( // Sử dụng với prefix
      child: LoginPage(),
    ),
  ),
),
```

### **Sử dụng SettingsPage**:

```dart
GoRoute(
  path: '/settings',
  pageBuilder: (context, state) => MaterialPage(
    child: MainLayout(
      child: const SettingsPage(), // Thêm const để optimize
    ),
  ),
),
```

## 📋 **Bài Học Rút Ra**

### **1. Quản lý Import**

- Luôn kiểm tra đường dẫn import chính xác
- Sử dụng alias khi có conflict tên
- Xóa import không cần thiết

### **2. Tổ chức File Structure**

- Đặt file đúng thư mục theo tính năng
- Đặt tên file và folder rõ ràng
- Tránh trùng tên class/function

### **3. Debugging Tips**

- Đọc kỹ error message để hiểu nguyên nhân
- Kiểm tra import và export
- Sử dụng IDE features để tự động fix

### **4. Best Practices**

- Sử dụng `const` constructor khi có thể
- Tổ chức import theo thứ tự: dart core → flutter → third party → local
- Sử dụng meaningful names cho alias

## 🔧 **Cách Tránh Lỗi Tương Tự**

### **1. Khi thêm file mới**:

```dart
// Kiểm tra đường dẫn
import 'package:toeic_mobile/features/[feature]/pages/[page_name].dart';
```

### **2. Khi có conflict tên**:

```dart
// Sử dụng alias
import 'package:library1/widget.dart' as lib1;
import 'package:library2/widget.dart' as lib2;
```

### **3. Khi refactor code**:

- Cập nhật tất cả import references
- Kiểm tra compilation sau mỗi thay đổi
- Sử dụng IDE refactoring tools

---

**Kết quả**: Tất cả lỗi đã được sửa và app_router.dart hiện tại hoạt động bình thường không có lỗi compilation.
