// package com.leenglish.toeic.test;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// public class PasswordHashGenerator {
//     public static void main(String[] args) {
//         BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

//         String adminPassword = "admin123";
//         String userPassword = "password123";

//         String adminHash = encoder.encode(adminPassword);
//         String userHash = encoder.encode(userPassword);

//         System.out.println("Admin password hash: " + adminHash);
//         System.out.println("User password hash: " + userHash);

//         // Test verification
//         System.out.println("Admin verification: " + encoder.matches(adminPassword, adminHash));
//         System.out.println("User verification: " + encoder.matches(userPassword, userHash));
//     }
// }
