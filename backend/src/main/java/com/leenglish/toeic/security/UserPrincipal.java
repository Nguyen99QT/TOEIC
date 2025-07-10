package com.leenglish.toeic.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isActive;

    public UserPrincipal(Long id, String username, String email, String password,
            Collection<? extends GrantedAuthority> authorities, boolean isActive) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
    }

    public static UserPrincipalBuilder builder() {
        return new UserPrincipalBuilder();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public boolean isActive() {
        return isActive;
    }

    // Builder class
    public static class UserPrincipalBuilder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private Collection<? extends GrantedAuthority> authorities;
        private boolean isActive;

        public UserPrincipalBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserPrincipalBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserPrincipalBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserPrincipalBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserPrincipalBuilder authorities(Collection<? extends GrantedAuthority> authorities) {
            this.authorities = authorities;
            return this;
        }

        public UserPrincipalBuilder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public UserPrincipal build() {
            return new UserPrincipal(id, username, email, password, authorities, isActive);
        }
    }
}
