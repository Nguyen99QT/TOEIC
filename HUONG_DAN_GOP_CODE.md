# Hướng Dẫn Gộp Các File Backend

## Giới Thiệu

Tài liệu này hướng dẫn quá trình gộp các file trùng lặp từ package `com.leenglish.api` vào package `com.leenglish.toeic` để tạo cấu trúc thống nhất cho backend.

## Các Bước Thực Hiện

### 1. Tạo Bản Sao Lưu

Trước khi thực hiện gộp, chúng ta sẽ tạo bản sao lưu của thư mục `com.leenglish.api`:

```bash
xcopy /s /y "backend\src\main\java\com\leenglish\api" "backend\backup\api\"
```

### 2. Di Chuyển TokenBlacklistService

Chúng ta sẽ di chuyển `TokenBlacklistService` từ package api sang toeic:

```bash
copy /Y "backend\src\main\java\com\leenglish\api\services\TokenBlacklistService.java" "backend\src\main\java\com\leenglish\toeic\service\"
```

Và cập nhật package declaration:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java') -replace 'package com.leenglish.api.services;', 'package com.leenglish.toeic.service;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\service\TokenBlacklistService.java'"
```

### 3. Di Chuyển JwtUtils

Tạo thư mục utils trong toeic nếu chưa có:

```bash
if not exist "backend\src\main\java\com\leenglish\toeic\utils" mkdir "backend\src\main\java\com\leenglish\toeic\utils"
```

Di chuyển JwtUtils:

```bash
copy /Y "backend\src\main\java\com\leenglish\api\utils\JwtUtils.java" "backend\src\main\java\com\leenglish\toeic\utils\"
```

Cập nhật package declaration:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java') -replace 'package com.leenglish.api.utils;', 'package com.leenglish.toeic.utils;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\utils\JwtUtils.java'"
```

### 4. Cập Nhật CorsConfig

Đánh dấu CorsConfig trong toeic là cấu hình chính:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java') -replace '@Configuration', '@Configuration\n@Primary' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\CorsConfig.java'"
```

### 5. Cập Nhật SecurityConfig

Cập nhật SecurityConfig để sử dụng JwtRequestFilter:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java') -replace 'JwtAuthenticationFilter', 'JwtRequestFilter' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\SecurityConfig.java'"
```

### 6. Di Chuyển WebSecurityConfig

Di chuyển WebSecurityConfig từ api sang toeic:

```bash
copy /Y "backend\src\main\java\com\leenglish\api\security\WebSecurityConfig.java" "backend\src\main\java\com\leenglish\toeic\config\"
```

Cập nhật package và imports:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java') -replace 'package com.leenglish.api.security;', 'package com.leenglish.toeic.config;' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java'"
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java') -replace 'import com.leenglish.api', 'import com.leenglish.toeic' | Set-Content 'backend\src\main\java\com\leenglish\toeic\config\WebSecurityConfig.java'"
```

### 7. Cập Nhật ToeicBackendApplication

Thêm ComponentScan để quét cả hai package trong quá trình chuyển đổi:

```bash
powershell -Command "(Get-Content 'backend\src\main\java\com\leenglish\toeic\ToeicBackendApplication.java') -replace '@SpringBootApplication', '@SpringBootApplication\n@ComponentScan(basePackages = {\"com.leenglish.toeic\", \"com.leenglish.api\"})' | Set-Content 'backend\src\main\java\com\leenglish\toeic\ToeicBackendApplication.java'"
```

## Kiểm Tra Sau Khi Gộp

Sau khi thực hiện các bước trên, chạy lệnh sau để kiểm tra:

```bash
cd backend
mvn clean compile
```

Nếu biên dịch thành công, backend đã được gộp thành công.

## Các Bước Tiếp Theo

1. Chạy `check-migration.bat` để kiểm tra cấu trúc thư mục sau khi gộp
2. Chạy `test-integration-vi.bat` để kiểm tra tích hợp với Flutter app
3. Loại bỏ dần các file trong package api khi đã chắc chắn không còn cần đến chúng

## Kết Quả Gộp Code

Sau khi thực hiện các bước trên, các file trong package `com.leenglish.api` đã được gộp vào package `com.leenglish.toeic` thành công. Cụ thể:

1. **Security**:

   - JwtRequestFilter đã được di chuyển từ `com.leenglish.api.security` sang `com.leenglish.toeic.security`
   - WebSecurityConfig đã được di chuyển từ `com.leenglish.api.security` sang `com.leenglish.toeic.config`
   - CorsConfig đã được di chuyển từ `com.leenglish.api.security` sang `com.leenglish.toeic.config`

2. **Services**:

   - TokenBlacklistService đã được di chuyển từ `com.leenglish.api.services` sang `com.leenglish.toeic.service`

3. **Utils**:

   - JwtUtils đã được di chuyển từ `com.leenglish.api.utils` sang `com.leenglish.toeic.utils`

4. **Controllers**:
   - AuthController đã được di chuyển từ `com.leenglish.api.controllers` sang `com.leenglish.toeic.controller`

Các imports đã được cập nhật để phản ánh cấu trúc mới.

## Xóa Folder API

Sau khi đã gộp thành công các file từ package `com.leenglish.api` sang package `com.leenglish.toeic` và đảm bảo ứng dụng hoạt động tốt, chúng ta có thể xóa folder `api` bằng script `xoa-folder-api.bat`.

```bash
.\xoa-folder-api.bat
```

Script này sẽ thực hiện các bước sau:

1. Kiểm tra việc biên dịch để đảm bảo không có lỗi
2. Xóa folder `com.leenglish.api`
3. Hiển thị thông báo hoàn thành

Chú ý: Chỉ chạy script này sau khi đã biên dịch thành công và kiểm tra ứng dụng hoạt động tốt.

## Kết Luận

Sau khi hoàn thành quá trình gộp, cấu trúc của ứng dụng đã được đơn giản hóa và thống nhất hơn. Tất cả các lớp liên quan đến bảo mật, tiện ích và dịch vụ đã được đặt trong các package phù hợp trong `com.leenglish.toeic`. Điều này giúp dễ dàng bảo trì và phát triển ứng dụng trong tương lai.

Các package chính hiện tại:

- `com.leenglish.toeic.config`: Chứa các lớp cấu hình
- `com.leenglish.toeic.security`: Chứa các lớp liên quan đến bảo mật
- `com.leenglish.toeic.service`: Chứa các dịch vụ
- `com.leenglish.toeic.controller`: Chứa các controller
- `com.leenglish.toeic.utils`: Chứa các lớp tiện ích

Tất cả các import đã được cập nhật để phản ánh cấu trúc mới này.

## Khắc Phục Sự Cố

Nếu bạn gặp lỗi trong quá trình gộp, đây là một số sự cố phổ biến và cách khắc phục:

1. **Lỗi ký tự không hợp lệ (illegal character)**:

   - Nguyên nhân: Do việc thay thế chuỗi trong script tạo ra các ký tự đặc biệt không hợp lệ
   - Cách khắc phục: Mở file và sửa trực tiếp các dòng bị lỗi

2. **Lỗi không tìm thấy class/package**:

   - Nguyên nhân: Có thể do import chưa được cập nhật đúng
   - Cách khắc phục: Thêm import cho class đó hoặc sửa đường dẫn package

3. **Lỗi duplicate bean**:
   - Nguyên nhân: Có nhiều bean cùng loại trong container
   - Cách khắc phục: Thêm annotation @Primary cho bean chính

## Lưu Ý Quan Trọng

1. Luôn tạo bản sao lưu trước khi thực hiện gộp
2. Kiểm tra biên dịch sau mỗi bước để phát hiện lỗi sớm
3. Sử dụng script check-migration.bat để kiểm tra kết quả gộp
4. Chỉ xóa các file cũ sau khi đã xác nhận mọi thứ hoạt động tốt
