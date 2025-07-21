# Giải quyết vấn đề về truy cập tài nguyên tĩnh trong ứng dụng TOEIC

## Vấn đề

Frontend không thể truy cập các tệp âm thanh và hình ảnh được lưu trữ trong thư mục backend.

## Giải pháp

### 1. Cấu hình WebConfig đã được cập nhật

File `backend/src/main/java/com/leenglish/toeic/config/WebConfig.java` đã được cập nhật để cho phép truy cập các tệp tĩnh từ nhiều đường dẫn khác nhau:

```java
// Serve audio files from static directory
registry.addResourceHandler("/audio/**")
         .addResourceLocations("classpath:/static/audio/");

// Serve image files from static directory
registry.addResourceHandler("/images/**")
         .addResourceLocations("classpath:/static/images/")
         .setCachePeriod(3600);

// Serve static resources directly
registry.addResourceHandler("/static/audio/**")
         .addResourceLocations("classpath:/static/audio/");

registry.addResourceHandler("/static/images/**")
         .addResourceLocations("classpath:/static/images/")
         .setCachePeriod(3600);
```

### 2. Đường dẫn SQL đã được cập nhật

File `backend/database/migrations/update_question_resource_paths.sql` đã được sửa để sử dụng đường dẫn tương đối `/audio/` và `/images/` thay vì `/static/audio/` và `/static/images/`.

### 3. Đường dẫn trong Frontend

Kiểm tra đường dẫn trong frontend để đảm bảo nó phù hợp với đường dẫn mà backend đang phục vụ. Các đường dẫn hiện tại nên trông như sau:

- Âm thanh: `/audio/[topic]/[topic]_ex[exercise_id]_q[question_order].mp3`
- Hình ảnh: `/images/[topic]/[topic]_ex[exercise_id]_q[question_order].jpg`

### 4. Kiểm tra CORS

Cấu hình CORS trong `application.properties` đã được thiết lập để cho phép các yêu cầu từ frontend:

```properties
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:5173,http://127.0.0.1:5173,http://localhost:8081,http://127.0.0.1:8081
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD
spring.web.cors.allowed-headers=Authorization,Content-Type,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers
spring.web.cors.allow-credentials=true
spring.web.cors.exposed-headers=Authorization,Access-Control-Allow-Origin
spring.web.cors.max-age=3600
```

## Kiểm tra kết nối

Sau khi khởi động lại backend, hãy thử truy cập trực tiếp một tệp âm thanh hoặc hình ảnh để xác minh rằng nó có thể truy cập được:

1. Thử truy cập một tệp âm thanh:

   - http://localhost:8080/audio/greetings/greetings_ex1_q1.mp3
   - http://localhost:8080/static/audio/greetings/greetings_ex1_q1.mp3

2. Thử truy cập một tệp hình ảnh:
   - http://localhost:8080/images/greetings/greetings_ex1_q1.jpg
   - http://localhost:8080/static/images/greetings/greetings_ex1_q1.jpg

## Kiểm tra trong DevTools

1. Mở DevTools trong trình duyệt (F12)
2. Chuyển đến tab "Network"
3. Tải lại trang và xem các yêu cầu cho tệp âm thanh và hình ảnh
4. Kiểm tra xem có lỗi CORS hoặc 404 không
5. Nếu gặp lỗi 404, hãy kiểm tra đường dẫn chính xác trong yêu cầu

## Khắc phục sự cố

1. Khởi động lại server sau khi thực hiện các thay đổi.
2. Xóa bộ nhớ cache của trình duyệt.
3. Đảm bảo đường dẫn trong cơ sở dữ liệu khớp với cấu hình WebConfig.
4. Kiểm tra quyền truy cập tệp trên hệ thống tệp.
