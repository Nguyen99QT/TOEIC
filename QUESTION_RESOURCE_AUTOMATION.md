# Hướng dẫn tạo tự động tài nguyên cho câu hỏi

## Tổng quan

Tài liệu này hướng dẫn cách sử dụng các công cụ tự động để tạo hình ảnh và âm thanh cho các câu hỏi trong TOEIC Learning Platform.

## Các công cụ

1. **generate_images.py**: Tự động tải hình ảnh từ Pixabay API dựa trên nội dung câu hỏi
2. **generate_audio.py**: Tự động tạo file âm thanh sử dụng Google Text-to-Speech
3. **generate_question_resources.bat**: Script tự động cài đặt và chạy cả hai script trên
4. **update_question_resource_paths.sql**: Cập nhật các đường dẫn tài nguyên trong cơ sở dữ liệu

## Cấu trúc thư mục

Tài nguyên được tổ chức theo chủ đề bài học:

```
frontend/public/
├── audio/
│   ├── greetings/
│   ├── numbers/
│   ├── colors/
│   └── ... (các chủ đề khác)
└── images/
    ├── greetings/
    ├── numbers/
    ├── colors/
    └── ... (các chủ đề khác)
```

## Quy ước đặt tên

File tài nguyên theo mẫu sau:

- Audio: `/audio/[chủ_đề]/[chủ_đề]_ex[exercise_id]_q[question_order].mp3`
- Hình ảnh: `/images/[chủ_đề]/[chủ_đề]_ex[exercise_id]_q[question_order].jpg`

Ví dụ:

- `/audio/greetings/greetings_ex1_q1.mp3`
- `/images/colors/colors_ex7_q2.jpg`

## Hướng dẫn sử dụng

### Cách 1: Sử dụng script tự động

1. Chạy file `generate_question_resources.bat`
2. Nhập đường dẫn đến file SQL chứa dữ liệu câu hỏi (mặc định: `backend\src\main\resources\question_full.sql`)
3. Chọn có tạo lại các file đã tồn tại hay không (Y/N)
4. Đợi quá trình tạo tài nguyên hoàn tất

### Cách 2: Chạy từng bước

#### Cài đặt thư viện cần thiết

```
pip install requests gtts
```

#### Tạo hình ảnh

```
python generate_images.py --sql path/to/questions.sql
```

Tùy chọn:

- `--force`: Tạo lại cả những file đã tồn tại
- `--sql`: Đường dẫn đến file SQL chứa dữ liệu câu hỏi

#### Tạo âm thanh

```
python generate_audio.py --sql path/to/questions.sql
```

Tùy chọn:

- `--force`: Tạo lại cả những file đã tồn tại
- `--sql`: Đường dẫn đến file SQL chứa dữ liệu câu hỏi
- `--lang`: Ngôn ngữ cho âm thanh (mặc định: 'en')

#### Cập nhật cơ sở dữ liệu

Chạy file SQL `update_question_resource_paths.sql` trong cơ sở dữ liệu của bạn để cập nhật đường dẫn cho tất cả các câu hỏi.

## Lưu ý

1. **Pixabay API**: Script sử dụng API key của Pixabay (51145294-dc08e3ca4e59d25222944ece5). Nếu gặp giới hạn API, bạn có thể đăng ký một API key mới tại [Pixabay API](https://pixabay.com/api/docs/).

2. **Google Text-to-Speech**: Không cần API key, nhưng có giới hạn số lượng yêu cầu mỗi ngày. Nếu gặp lỗi, có thể thử lại sau.

3. **Internet**: Cần kết nối internet để tải hình ảnh và tạo âm thanh.

4. **Thời gian chạy**: Quá trình có thể mất nhiều thời gian nếu có nhiều câu hỏi, do giới hạn tốc độ API.

## Xử lý sự cố

### Lỗi khi tạo hình ảnh

- Kiểm tra kết nối internet
- Xác minh API key Pixabay còn hiệu lực
- Thử đơn giản hóa từ khóa tìm kiếm

### Lỗi khi tạo âm thanh

- Kiểm tra kết nối internet
- Thử giảm độ dài văn bản
- Thử lại sau nếu đã đạt giới hạn API

### Lỗi khi chạy SQL script

- Kiểm tra quyền truy cập cơ sở dữ liệu
- Xác minh cấu trúc bảng questions có chứa các cột audio_url và image_url

## Tùy chỉnh nâng cao

Bạn có thể tùy chỉnh các script để phù hợp với nhu cầu cụ thể:

1. Thay đổi API key Pixabay trong `generate_images.py`
2. Điều chỉnh ngôn ngữ cho âm thanh trong `generate_audio.py`
3. Thay đổi quy ước đặt tên file trong cả hai script
4. Điều chỉnh các từ khóa tìm kiếm hình ảnh trong `get_search_term()` của `generate_images.py`

## Các bước tiếp theo

Sau khi tạo tài nguyên, bạn nên:

1. Kiểm tra chất lượng hình ảnh và âm thanh
2. Thay thế các file không phù hợp bằng file tự tạo
3. Cập nhật cơ sở dữ liệu với đường dẫn chính xác
4. Kiểm tra hiển thị trong ứng dụng
