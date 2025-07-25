# 🔧 Utility Scripts - Script Tiện Ích

Folder này chứa các script đơn giản, tiện ích cho việc bảo trì và xử lý dữ liệu.

## 📋 Danh sách script

### `update_sql_paths.py`

**Chức năng:** Cập nhật đường dẫn file trong SQL
**Mô tả:** Script đơn giản để thay đổi đường dẫn audio/image trong file SQL
**Sử dụng:**

```bash
python tools/utility-scripts/update_sql_paths.py
```

### `generate_media_files.py`

**Chức năng:** Copy và rename file media theo mapping
**Mô tả:** Script để copy file ex1.mp3 thành filename mới dựa trên SQL
**Sử dụng:**

```bash
python tools/utility-scripts/generate_media_files.py
```

## 🎯 Đặc điểm

- **Đơn giản:** Thực hiện một nhiệm vụ cụ thể
- **Tiện ích:** Hỗ trợ các tác vụ bảo trì
- **Độc lập:** Không phụ thuộc vào system phức tạp
- **Nhanh chóng:** Chạy và hoàn thành nhanh

## 📂 Phân loại

Script được đặt ở đây nếu:

- Thực hiện một tác vụ đơn giản
- Không cần API phức tạp
- Chủ yếu xử lý file/text
- Sử dụng thường xuyên cho bảo trì

## 📞 Sử dụng

Có thể chạy trực tiếp từ backend root:

```bash
cd backend/
python tools/utility-scripts/script_name.py
```
