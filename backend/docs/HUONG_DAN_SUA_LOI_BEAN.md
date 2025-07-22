# Hướng Dẫn Sửa Lỗi Bean Definition Override

## Vấn Đề

Sau khi hợp nhất các package `com.leenglish.api` và `com.leenglish.toeic`, dự án gặp lỗi định nghĩa bean trùng lặp "Invalid bean definition with name 'authenticationManager'". Lỗi này xảy ra vì có hai file cấu hình bảo mật (`WebSecurityConfig.java` và `SecurityConfig.java`) cùng định nghĩa bean `authenticationManager`.

## Giải Pháp

1. Đã phân tích và so sánh hai file cấu hình bảo mật:

   - `WebSecurityConfig.java`: Cấu hình cơ bản
   - `SecurityConfig.java`: Cấu hình chi tiết và đầy đủ hơn

2. Quyết định giữ lại `SecurityConfig.java` vì:

   - Có cấu hình phân quyền chi tiết hơn cho các endpoint
   - Đã cấu hình `AuthenticationProvider`
   - Sử dụng `JwtAuthenticationEntryPoint` để xử lý lỗi xác thực

3. Các bước thực hiện:
   - Xóa file `WebSecurityConfig.java` để tránh xung đột bean
   - Cập nhật `ToeicBackendApplication.java` để loại bỏ component scan cho package `com.leenglish.api` không còn cần thiết

## Kiểm Tra

- Đã biên dịch và chạy ứng dụng thành công
- Không còn lỗi "Invalid bean definition"

## Lưu Ý

- Nếu có sự cố với cấu hình bảo mật, hãy kiểm tra `SecurityConfig.java` để đảm bảo tất cả các cấu hình cần thiết đã được bao gồm
- Đảm bảo các endpoint public (không cần xác thực) được định nghĩa đúng trong `SecurityConfig.java`
- Kiểm tra kỹ các tính năng liên quan đến xác thực và phân quyền sau khi thay đổi
