# MEMBERSHIP TYPE CLEANUP - HƯỚNG DẪN

## 🎯 **MỤC TIÊU**
Loại bỏ BASIC và VIP, chỉ giữ lại FREE và PREMIUM trong hệ thống membership.

## ✅ **CÁC THAY ĐỔI ĐÃ THỰC HIỆN**

### **1. Backend Code**
- ✅ `MembershipType.java`: Chỉ còn `FREE, PREMIUM`
- ✅ `JwtResponse.java`: Updated membershipType field
- ✅ `AuthController.java`: Return membershipType from database
- ✅ `MembershipController.java`: Upgrade logic to PREMIUM

### **2. Frontend Code**
- ✅ `types/index.ts`: `membershipType: "FREE" | "PREMIUM"`
- ✅ `auth.ts`: LoginResponse có membershipType
- ✅ `AuthContext.tsx`: Sử dụng membershipType từ backend
- ✅ `Navigation.tsx`: Hiển thị "👑 Premium" hoặc "Free Member"

### **3. Database Migration Scripts**
- ✅ `backup_before_membership_migration.sql`: Backup trước khi migrate
- ✅ `update_membership_type_enum.sql`: Migration script chính
- ✅ `verify_membership_migration.sql`: Kiểm tra sau migration
- ✅ `run_membership_migration.bat`: Script chạy migration

## 🚀 **CÁCH THỰC HIỆN MIGRATION**

### **Bước 1: Backup Database**
```sql
source d:\Final Exam\TOEIC\database\migrations\backup_before_membership_migration.sql
```

### **Bước 2: Chạy Migration**
```cmd
cd "d:\Final Exam\TOEIC"
run_membership_migration.bat
```

### **Bước 3: Kiểm Tra**
```sql
source d:\Final Exam\TOEIC\database\migrations\verify_membership_migration.sql
```

### **Bước 4: Build & Start Services**
```cmd
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend  
cd frontend
npm start
```

## 📊 **DATA CONVERSION RULES**

| Giá trị cũ | Giá trị mới | Lý do |
|------------|-------------|-------|
| `NULL`     | `FREE`      | Users chưa có membership |
| `BASIC`    | `FREE`      | Đổi tên basic thành free |
| `PREMIUM`  | `PREMIUM`   | Giữ nguyên |
| `VIP`      | `PREMIUM`   | Upgrade VIP users lên Premium |

## 🎯 **KẾT QUẢ MONG MUỐN**

- ✅ Database chỉ có `FREE` và `PREMIUM`
- ✅ Frontend hiển thị đúng membership status
- ✅ Login trả về membershipType từ database
- ✅ Membership không bị mất khi logout/login
- ✅ Upgrade payment hoạt động từ FREE → PREMIUM

## ⚠️ **LƯU Ý**
- Chạy backup trước khi migration
- Test trên môi trường dev trước
- Có thể rollback bằng backup table nếu cần

---
**Created**: 2025-07-25  
**Status**: Ready for execution
