# Hướng dẫn khắc phục vấn đề truy cập tài nguyên tĩnh

## Tóm tắt

Các tài nguyên (audio và hình ảnh) đã được di chuyển từ thư mục `frontend/public` sang `backend/src/main/resources/static`, nhưng frontend không thể truy cập chúng. Đây là các thay đổi đã được thực hiện để khắc phục vấn đề:

## Các thay đổi đã thực hiện

### 1. Cập nhật WebConfig

File `backend/src/main/java/com/leenglish/toeic/config/WebConfig.java` đã được cập nhật để hỗ trợ cả đường dẫn trực tiếp và đường dẫn có tiền tố `/static/`:

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

### 2. Cập nhật SQL script

File `backend/database/migrations/update_question_resource_paths.sql` đã được cập nhật để sử dụng đường dẫn không có tiền tố `/static/`:

```sql
UPDATE questions q
JOIN exercise_lesson_map elm ON q.exercise_id = elm.exercise_id
SET
    q.audio_url = CONCAT('/audio/', elm.topic, '/', elm.topic, '_ex', q.exercise_id, '_q', q.question_order, '.mp3'),
    q.image_url = CONCAT('/images/', elm.topic, '/', elm.topic, '_ex', q.exercise_id, '_q', q.question_order, '.jpg')
WHERE
    q.audio_url IS NULL OR
    q.audio_url LIKE 'exercises/ex%.mp3' OR
    q.audio_url NOT LIKE '/audio/%';
```

### 3. Tạo tệp HTML kiểm tra

Một tệp HTML kiểm tra đã được tạo tại `backend/src/main/resources/static/resource-test.html` để kiểm tra truy cập tài nguyên.

## Các bước tiếp theo

1. **Khởi động lại backend server** để áp dụng các thay đổi cấu hình:

   ```
   cd c:\TOEIC\TOEIC-Group-Huy\backend
   mvn spring-boot:run
   ```

2. **Chạy SQL script** để cập nhật đường dẫn trong cơ sở dữ liệu:

   ```
   mysql -u root -p toeic8 < c:\TOEIC\TOEIC-Group-Huy\backend\database\migrations\update_question_resource_paths.sql
   ```

   hoặc sử dụng phpMyAdmin để thực thi SQL.

3. **Kiểm tra truy cập tài nguyên** bằng cách truy cập:

   - http://localhost:8080/resource-test.html

4. **Kiểm tra trong ứng dụng frontend** để xác nhận tài nguyên có thể truy cập:
   - http://localhost:3000 (hoặc cổng khác mà frontend đang chạy)

## Lý do vấn đề và giải pháp

1. **Sai đường dẫn**: Khi di chuyển tài nguyên từ frontend sang backend, đường dẫn trong cơ sở dữ liệu không khớp với cấu hình WebConfig.

2. **CORS**: Mặc dù cấu hình CORS đã được thiết lập trong backend, nhưng đường dẫn không được ánh xạ chính xác.

3. **Cấu hình ResourceHandlers**: WebConfig đã được cập nhật để ánh xạ cả đường dẫn trực tiếp (`/audio/`, `/images/`) và đường dẫn có tiền tố (`/static/audio/`, `/static/images/`).

Bằng cách thực hiện các thay đổi trên, frontend sẽ có thể truy cập tài nguyên được lưu trữ trong thư mục backend.

## Kiểm tra nhanh URL

Để xác nhận một tài nguyên có thể truy cập được, hãy thử các URL sau:

1. http://localhost:8080/audio/greetings/greetings_ex1_q1.mp3
2. http://localhost:8080/images/greetings/greetings_ex1_q1.jpg

Nếu các URL này hoạt động, điều đó có nghĩa là cấu hình backend đã chính xác và frontend chỉ cần sử dụng URL tương ứng.
