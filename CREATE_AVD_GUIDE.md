# Hướng dẫn tạo Android Virtual Device (AVD) chi tiết

## Tình trạng hiện tại:
- Android Studio: ✅ Đã cài đặt
- System Image: ✅ Có android-35 google_apis x86_64
## Tình trạng hiện tại:
- Android Studio: ✅ Đã cài đặt
- System Image: ✅ Có android-36 google_apis x86_64
- AVD: ✅ Pixel_6 đã tạo (API 36 - Android 16)
- Command line tools: ✅ Đã cài đặt
- Licenses: ✅ Đã chấp nhận
- Emulator: ✅ Đang chạy (emulator-5554)
- Flutter App: 🚀 Đang build và deploy...
- Command line tools: ✅ Đã cài đặt
- Licenses: ✅ Đã chấp nhận
- Emulator: ✅ Đang chạy (emulator-5554)
- Flutter App: 🚀 Đang deploy...

## Các bước tạo AVD:

### Bước 1: Mở Android Studio
```bash
Start-Process "D:\Program Files\Android Studio\bin\studio64.exe"
```

### Bước 2: Cài đặt SDK Components (quan trọng)
1. Vào **File** → **Settings** → **Android SDK**
2. Tab **SDK Tools**, tích chọn:
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Android Emulator  
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM)
3. **Apply** → **OK**

### Bước 3: Tạo AVD
1. **Tools** → **AVD Manager**
2. **Create Virtual Device**
3. Chọn **Pixel 4** hoặc **Pixel 6**
4. Chọn **API 36** (Android 16) - hoặc API có sẵn
5. **Next** → đặt tên AVD → **Finish**

### Bước 4: Khởi động AVD
1. Click nút ▶ (Play) trong AVD Manager
2. Đợi emulator khởi động

### Bước 5: Kiểm tra
```bash
flutter emulators
flutter devices
```

## Nếu gặp lỗi "Running multiple emulators":
- Đóng emulator hiện tại
- Hoặc dùng: `flutter emulators --launch <emulator_id>`

## Sau khi tạo xong AVD:
```bash
flutter run -d <device_id>
```
