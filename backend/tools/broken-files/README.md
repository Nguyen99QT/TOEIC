# 🔧 Broken Files - File Cần Sửa Lỗi

Folder này chứa các file có lỗi cần được sửa chữa trước khi sử dụng.

## 📋 Danh sách file có lỗi

### `check_media_files.py`

**Lỗi:** Missing mysql.connector dependency
**Mô tả:** File cần thư viện mysql.connector để kết nối cơ sở dữ liệu
**Cách sửa:**

```bash
pip install mysql-connector-python
```

**Chức năng:** Kiểm tra các file media có tồn tại trong database không

### `generate_exercise_media.py`

**Lỗi:** Type annotation issues, API key dependencies
**Mô tả:** File có lỗi type hints và cần API key cho media generation
**Cách sửa:**

- Thêm type annotations đúng cách
- Cấu hình API keys cho OpenAI và Pixabay
  **Chức năng:** Tạo file audio và image từ SQL data

### `generate_new_exercises_from_audio.py`

**Lỗi:** Type annotation issues, incomplete functions
**Mô tả:** File có lỗi type hints và một số function chưa hoàn thành
**Cách sửa:**

- Hoàn thiện các function còn thiếu
- Sửa type annotations
  **Chức năng:** Tạo exercises mới từ file audio chưa sử dụng

### `validate_audio_files.py`

**Lỗi:** Missing librosa and numpy dependencies, syntax errors
**Mô tả:** File cần thư viện librosa, numpy để phân tích audio và có lỗi cú pháp f-string
**Cách sửa:**

```bash
pip install librosa numpy
```

- Sửa lỗi cú pháp trong f-string
  **Chức năng:** Validate quality của audio files

### `verify_and_update_media_files.py`

**Lỗi:** Missing mysql.connector dependency
**Mô tả:** File cần thư viện mysql.connector để kiểm tra database
**Cách sửa:**

```bash
pip install mysql-connector-python
```

**Chức năng:** Verify media files với database và tạo SQL update

### `generate_exercise_media_broken.py`

**Lỗi:** Corrupted during editing, type annotation issues
**Mô tả:** File bị lỗi trong quá trình edit, type annotations không đúng
**Cách sửa:** File này đã được thay thế bằng version mới đã sửa
**Chức năng:** Generate audio/image từ OpenAI API (đã có version mới)

## ⚠️ Lưu ý

Các file trong folder này:

- **KHÔNG** được sử dụng trực tiếp
- Cần được sửa lỗi trước khi di chuyển về folder chính
- Có thể chứa dependencies thiếu hoặc code không hoàn chỉnh

## 🔨 Hướng dẫn sửa lỗi

1. **Cài đặt dependencies thiếu**
2. **Kiểm tra import statements**
3. **Test file sau khi sửa**
4. **Di chuyển về folder phù hợp nếu hoạt động tốt**

## 📞 Liên hệ

Nếu cần hỗ trợ sửa lỗi, vui lòng kiểm tra:

- `docs/PYTHON_FILE_FIXES.md` - Hướng dẫn sửa lỗi Python
- `requirements.txt` - Danh sách dependencies cần thiết
