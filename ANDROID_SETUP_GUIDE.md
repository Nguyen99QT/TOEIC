# Hướng dẫn thiết lập Android Virtual Device (AVD) cho Flutter

## Bước 1: Cài đặt Android SDK Components trong Android Studio

1. Mở Android Studio
2. Vào **File** → **Settings** (hoặc **Android Studio** → **Preferences** trên Mac)
3. Chọn **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Trong tab **SDK Platforms**, chọn:
   - ✓ Android 14.0 (API 34) - Recommended
   - ✓ Android 13.0 (API 33)
   - ✓ Android 12.0 (API 31)

5. Trong tab **SDK Tools**, đảm bảo các mục sau được chọn:
   - ✓ Android SDK Build-Tools
   - ✓ Android SDK Command-line Tools (latest)
   - ✓ Android SDK Platform-Tools
   - ✓ Android Emulator
   - ✓ Intel x86 Emulator Accelerator (HAXM installer)

6. Click **Apply** và **OK** để cài đặt

## Bước 2: Tạo Android Virtual Device (AVD)

1. Trong Android Studio, vào **Tools** → **AVD Manager**
2. Click **Create Virtual Device**
3. Chọn một device profile (ví dụ: Pixel 4, Pixel 6 Pro)
4. Chọn system image (ví dụ: API 34, x86_64)
5. Nếu chưa có, click **Download** để tải system image
6. **Quan trọng**: Đặt tên AVD khác nhau cho mỗi emulator (ví dụ: Pixel_6_Flutter, Pixel_4_Test)
7. Click **Finish**

### Khắc phục lỗi "Running multiple emulators with the same AVD":

**Lỗi này xảy ra khi:** Bạn cố chạy nhiều emulator cùng một AVD

**Giải pháp:**
- **Cách 1**: Đóng emulator hiện tại trước khi chạy emulator mới
- **Cách 2**: Tạo AVD mới với tên khác
- **Cách 3**: Chạy với flag `-read-only`: `emulator -avd Pixel_6 -read-only`

## Bước 3: Khởi động AVD

1. Trong AVD Manager, click nút **Play** (▶) bên cạnh AVD vừa tạo
2. Đợi emulator khởi động hoàn tất

## Bước 4: Kiểm tra kết nối Flutter

Mở terminal trong VS Code và chạy:
```bash
flutter devices
```

Bạn sẽ thấy emulator trong danh sách devices.

## Bước 5: Chạy ứng dụng Flutter

```bash
flutter run
```

Hoặc chọn device trong VS Code và nhấn F5.

## Ghi chú quan trọng:

- Đảm bảo Hyper-V bị tắt nếu sử dụng Intel HAXM
- Cho phép Virtualization trong BIOS/UEFI
- Emulator cần ít nhất 8GB RAM để chạy mượt mà
