package com.leenglish.toeic.dto;

import com.leenglish.toeic.enums.MembershipType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String token; // For backend compatibility
    private String accessToken; // For frontend compatibility
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private MembershipType membershipType;

    public JwtResponse(String token, Long id, String username, String email, List<String> roles, MembershipType membershipType) {
        this.token = token;
        this.accessToken = token; // Set both for compatibility
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.membershipType = membershipType;
    }

    // Keep backward compatibility constructor
    public JwtResponse(String token, Long id, String username, String email, List<String> roles) {
        this.token = token;
        this.accessToken = token; // Set both for compatibility
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.membershipType = MembershipType.BASIC; // Default to BASIC
    }
}
