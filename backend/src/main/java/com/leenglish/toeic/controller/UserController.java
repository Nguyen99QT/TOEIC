package com.leenglish.toeic.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Gender;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.service.AuthorizationService;
import com.leenglish.toeic.service.UserService;

/**
 * ================================================================
 * USER API CONTROLLER WITH ROLE-BASED ACCESS CONTROL
 * ================================================================
 * 
 * QUY ĐỊNH AUTHORIZATION:
 * ✅ ADMIN: Có thể làm tất cả mọi thứ
 * ✅ USER: Chỉ được sửa profile của chính mình
 * ❌ USER: KHÔNG được sửa thông tin user khác
 * 
 * SECURITY MEASURES:
 * - Admin không thể tự xóa/demote chính mình (prevent lockout)
 * - Mọi action đều check authorization trước khi thực hiện
 * - Clear error messages cho từng trường hợp
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthorizationService authorizationService;

    // ========== PUBLIC ENDPOINTS (Không cần authentication) ==========

    /**
     * GET /api/users/enums - Lấy tất cả enum values cho frontend
     * PUBLIC: Bất kỳ ai cũng có thể access để build UI dropdowns
     */
    @GetMapping("/enums")
    public ResponseEntity<Map<String, Object>> getEnumValues() {
        Map<String, Object> enums = new HashMap<>();
        enums.put("roles", Role.values());
        enums.put("genders", Gender.values());
        return ResponseEntity.ok(enums);
    }

    /**
     * GET /api/users/leaderboard - Xem bảng xếp hạng
     * PUBLIC: Ai cũng có thể xem leaderboard để tạo động lực học tập
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<User> topUsers = userService.findTopUsersByScore(limit);
        return ResponseEntity.ok(topUsers);
    }

    // ========== ADMIN-ONLY ENDPOINTS ==========

    /**
     * GET /api/users - Lấy tất cả users với filtering và pagination
     * ADMIN ONLY: Chỉ admin mới được xem danh sách tất cả users
     * User thường KHÔNG được access endpoint này
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Boolean isActive,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // BƯỚC 1: Lấy thông tin user hiện tại từ database
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();

            // BƯỚC 2: KIỂM TRA QUYỀN - Chỉ admin mới được xem tất cả users
            if (!authorizationService.isAdmin(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can view all users.");
            }

            // BƯỚC 3: Nếu là admin thì cho phép xem tất cả với filtering
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users = userService.findUsersWithFilters(
                    username, email, role, gender, country, isActive, pageable);

            return ResponseEntity.ok(users);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    /**
     * GET /api/users/by-role/{role} - Lấy users theo role
     * ADMIN ONLY: Chỉ admin mới được filter users theo role
     */
    @GetMapping("/by-role/{role}")
    public ResponseEntity<?> getUsersByRole(
            @PathVariable String role,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // Kiểm tra user hiện tại
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();

            // KIỂM TRA QUYỀN: Chỉ admin
            if (!authorizationService.isAdmin(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can filter users by role.");
            }

            // Validate enum và execute
            Role roleEnum = Role.valueOf(role.toUpperCase());
            List<User> users = userService.findByRole(roleEnum);
            return ResponseEntity.ok(users);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid role. Valid roles: " + java.util.Arrays.toString(Role.values()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    // ========== USER PROFILE ENDPOINTS (Với authorization checking) ==========

    /**
     * GET /api/users/{id} - Xem profile của một user
     * AUTHORIZATION LOGIC:
     * ✅ Admin có thể xem profile của bất kỳ ai
     * ✅ User chỉ được xem profile của chính mình
     * ❌ User KHÔNG được xem profile của user khác
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // BƯỚC 1: Lấy thông tin user hiện tại
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();

            // BƯỚC 2: KIỂM TRA QUYỀN VIEW
            // Admin xem được tất cả, User chỉ xem được chính mình
            if (!authorizationService.canViewUser(currentUser, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(authorizationService.getUnauthorizedMessage("view", currentUser.getRole()));
            }

            // BƯỚC 3: Lấy thông tin user được yêu cầu
            Optional<User> targetUser = userService.findById(id);
            if (targetUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(targetUser.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user: " + e.getMessage());
        }
    }

    /**
     * GET /api/users/profile - Lấy profile của user hiện tại
     * Endpoint tiện lợi để user lấy thông tin chính mình
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(@RequestHeader("Current-User-Id") Long currentUserId) {
        try {
            Optional<User> currentUser = userService.findById(currentUserId);
            if (currentUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }
            return ResponseEntity.ok(currentUser.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving profile: " + e.getMessage());
        }
    }

    /**
     * PUT /api/users/{id} - Cập nhật thông tin user
     * AUTHORIZATION LOGIC:
     * ✅ Admin có thể sửa profile của bất kỳ ai (bao gồm cả role)
     * ✅ User chỉ được sửa profile của chính mình (KHÔNG bao gồm role)
     * ❌ User KHÔNG được sửa thông tin của user khác
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // BƯỚC 1: Lấy thông tin user hiện tại
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();

            // BƯỚC 2: KIỂM TRA QUYỀN EDIT
            // Admin sửa được tất cả, User chỉ sửa được chính mình
            if (!authorizationService.canEditUser(currentUser, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(authorizationService.getUnauthorizedMessage("edit", currentUser.getRole()));
            }

            // BƯỚC 3: Lấy user cần cập nhật
            Optional<User> targetUserOpt = userService.findById(id);
            if (targetUserOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User targetUser = targetUserOpt.get();

            // BƯỚC 4: CẬP NHẬT CÁC FIELD CƠ BẢN (cả admin và user đều được phép)
            if (request.getFullName() != null) {
                targetUser.setFullName(request.getFullName());
            }
            if (request.getPhone() != null) {
                targetUser.setPhone(request.getPhone());
            }
            if (request.getDateOfBirth() != null) {
                targetUser.setDateOfBirth(request.getDateOfBirth());
            }
            if (request.getGender() != null) {
                Gender gender = Gender.valueOf(request.getGender().toUpperCase());
                targetUser.setGender(gender);
            }
            if (request.getCountry() != null) {
                targetUser.setCountry(request.getCountry());
            }

            // BƯỚC 5: KIỂM TRA ĐẶC BIỆT CHO ROLE - CHỈ ADMIN MỚI ĐƯỢC THAY ĐỔI
            if (request.getRole() != null) {
                Role newRole = Role.valueOf(request.getRole().toUpperCase());

                // Nếu KHÔNG phải admin thì KHÔNG được đổi role
                if (!authorizationService.isAdmin(currentUser)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Access denied. Only administrators can change user roles.");
                }

                // Admin KHÔNG được tự demote chính mình (để tránh lockout hệ thống)
                if (currentUser.getId().equals(id) && newRole != Role.ADMIN) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Admin cannot demote themselves to prevent system lockout.");
                }

                targetUser.setRole(newRole);
            }

            // BƯỚC 6: Lưu thay đổi
            User updatedUser = userService.save(targetUser);
            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid enum value: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user: " + e.getMessage());
        }
    }

    /**
     * PUT /api/users/profile - Cập nhật profile của user hiện tại
     * Endpoint tiện lợi để user tự cập nhật profile mình
     * User KHÔNG thể thay đổi role thông qua endpoint này
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(
            @RequestBody UpdateUserProfileRequest request,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // Tự động forward request tới endpoint chính với ID = currentUserId
            UpdateUserRequest fullRequest = new UpdateUserRequest();
            fullRequest.setFullName(request.getFullName());
            fullRequest.setPhone(request.getPhone());
            fullRequest.setDateOfBirth(request.getDateOfBirth());
            fullRequest.setGender(request.getGender());
            fullRequest.setCountry(request.getCountry());
            // NOTE: Không set role để đảm bảo user không thể tự thay đổi role

            return updateUser(currentUserId, fullRequest, currentUserId);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    // ========== ADMIN MANAGEMENT ENDPOINTS ==========

    /**
     * POST /api/users/{id}/change-role - Thay đổi role của user
     * ADMIN ONLY: Chỉ admin mới được thay đổi role
     * Admin KHÔNG được tự demote chính mình
     */
    @PostMapping("/{id}/change-role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestParam String newRole,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // Lấy thông tin user hiện tại
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();
            Role roleEnum = Role.valueOf(newRole.toUpperCase());

            // KIỂM TRA QUYỀN THAY ĐỔI ROLE
            if (!authorizationService.canChangeUserRole(currentUser, id, roleEnum)) {
                if (currentUser.getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Admin cannot change their own role to prevent system lockout.");
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Only administrators can change user roles.");
                }
            }

            // Thực hiện thay đổi role
            User updatedUser = userService.updateUserRole(id, roleEnum);
            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid role. Valid roles: " + java.util.Arrays.toString(Role.values()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error changing user role: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/users/{id} - Xóa user (soft delete)
     * ADMIN ONLY: Chỉ admin mới được xóa user
     * Admin KHÔNG được tự xóa chính mình
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Current-User-Id") Long currentUserId) {

        try {
            // Lấy thông tin user hiện tại
            Optional<User> currentUserOpt = userService.findById(currentUserId);
            if (currentUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found or not authenticated");
            }

            User currentUser = currentUserOpt.get();

            // KIỂM TRA QUYỀN XÓA: Chỉ admin, KHÔNG được tự xóa mình
            if (!authorizationService.canDeleteUser(currentUser, id)) {
                if (currentUser.getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Admin cannot delete themselves to prevent system lockout.");
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Only administrators can delete users.");
                }
            } // Thực hiện xóa (soft delete)
            boolean deleted = userService.softDeleteUser(id);
            if (deleted) {
                return ResponseEntity.ok().body("User deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    // ========== DTO CLASSES (Data Transfer Objects) ==========

    /**
     * DTO cho việc cập nhật user profile
     * Chứa tất cả các field mà user có thể thay đổi
     */
    public static class UpdateUserRequest {
        private String fullName; // ✅ User có thể đổi họ tên
        private String phone; // ✅ User có thể đổi số điện thoại
        private java.time.LocalDate dateOfBirth; // ✅ User có thể đổi ngày sinh
        private String gender; // ✅ User có thể đổi giới tính
        private String country; // ✅ User có thể đổi quốc gia
        private String role; // ⚠️ CHỈ ADMIN mới được đổi role

        // Getters and setters với comments giải thích
        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public java.time.LocalDate getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(java.time.LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        // Role field - CHỈ admin mới được set
        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    /**
     * DTO cho việc user tự cập nhật profile mình
     * KHÔNG bao gồm role để đảm bảo user không thể tự thay đổi quyền
     */
    public static class UpdateUserProfileRequest {
        private String fullName; // ✅ User có thể đổi
        private String phone; // ✅ User có thể đổi
        private java.time.LocalDate dateOfBirth; // ✅ User có thể đổi
        private String gender; // ✅ User có thể đổi
        private String country; // ✅ User có thể đổi
        // NOTE: KHÔNG có role field để prevent privilege escalation

        // Getters and setters
        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public java.time.LocalDate getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(java.time.LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }
    }
    

    /**
     * POST /api/users/register - Đăng ký tài khoản mới
     * PUBLIC: Ai cũng có thể đăng ký
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request) {
        try {
            // Kiểm tra username/email đã tồn tại chưa
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Tạo user mới với role USER mặc định
            User newUser = userService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getFullName(),
                    Role.USER);

            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }

    // DTO cho đăng ký user
    public static class RegisterUserRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;

        // Getters/setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
    }
}
