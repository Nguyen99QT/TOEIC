package com.leenglish.toeic.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.leenglish.toeic.domain.EmailVerifyToken;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.VerificationType;
import com.leenglish.toeic.repository.EmailVerifyTokenRepository;
import com.leenglish.toeic.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock
    private EmailVerifyTokenRepository emailVerifyTokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private EmailVerificationService emailVerificationService;

    private User testUser;
    private EmailVerifyToken testToken;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setIsEmailVerified(false);

        testToken = new EmailVerifyToken("test-token", testUser, VerificationType.ACCOUNT_CREATION.name());
        // testToken.setId(1L);
    }

    @Test
    void testCreateVerificationToken() {
        // Given
        when(emailVerifyTokenRepository.findByUserId(testUser.getId())).thenReturn(Optional.empty());
        when(emailVerifyTokenRepository.save(any(EmailVerifyToken.class))).thenReturn(testToken);

        // When
        EmailVerifyToken result = emailVerificationService.createVerificationToken(testUser);

        // Then
        assertNotNull(result);
        assertEquals(testToken.getToken(), result.getToken());
        assertEquals(testUser, result.getUser());
        assertEquals(VerificationType.ACCOUNT_CREATION, result.getVerificationType());
        
        verify(emailVerifyTokenRepository).findByUserId(testUser.getId());
        verify(emailVerifyTokenRepository).save(any(EmailVerifyToken.class));
        verify(emailService).sendVerificationEmail(testUser, testToken.getToken());
    }

    @Test
    void testVerifyEmailToken_Success() {
        // Given
        when(emailVerifyTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(testToken));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        boolean result = emailVerificationService.verifyEmailToken("valid-token");

        // Then
        assertTrue(result);
        verify(userRepository).save(testUser);
        verify(emailVerifyTokenRepository).delete(testToken);
    }

    @Test
    void testVerifyEmailToken_TokenNotFound() {
        // Given
        when(emailVerifyTokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        // When
        boolean result = emailVerificationService.verifyEmailToken("invalid-token");

        // Then
        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
        verify(emailVerifyTokenRepository, never()).delete(any(EmailVerifyToken.class));
    }

    @Test
    void testVerifyEmailToken_ExpiredToken() {
        // Given
        testToken.setExpiresAt(LocalDateTime.now().minusMinutes(1)); // Expired 1 minute ago
        when(emailVerifyTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(testToken));

        // When
        boolean result = emailVerificationService.verifyEmailToken("expired-token");

        // Then
        assertFalse(result);
        verify(emailVerifyTokenRepository).delete(testToken);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testVerifyEmailToken_WrongType() {
        // Given
        EmailVerifyToken passwordResetToken = new EmailVerifyToken("reset-token", testUser, VerificationType.PASSWORD_RESET.name());
        when(emailVerifyTokenRepository.findByToken("reset-token")).thenReturn(Optional.of(passwordResetToken));

        // When
        boolean result = emailVerificationService.verifyEmailToken("reset-token");

        // Then
        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
        verify(emailVerifyTokenRepository, never()).delete(any(EmailVerifyToken.class));
    }

    @Test
    void testResendVerificationEmail_Success() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(emailVerifyTokenRepository.findByUserId(testUser.getId())).thenReturn(Optional.empty());
        when(emailVerifyTokenRepository.save(any(EmailVerifyToken.class))).thenReturn(testToken);

        // When
        boolean result = emailVerificationService.resendVerificationEmail("test@example.com");

        // Then
        assertTrue(result);
        verify(emailService).sendVerificationEmail(testUser, testToken.getToken());
    }

    @Test
    void testResendVerificationEmail_UserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When
        boolean result = emailVerificationService.resendVerificationEmail("nonexistent@example.com");

        // Then
        assertFalse(result);
        verify(emailService, never()).sendVerificationEmail(any(User.class), anyString());
    }

    @Test
    void testResendVerificationEmail_AlreadyVerified() {
        // Given
        testUser.setIsEmailVerified(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        boolean result = emailVerificationService.resendVerificationEmail("test@example.com");

        // Then
        assertFalse(result);
        verify(emailService, never()).sendVerificationEmail(any(User.class), anyString());
    }
} 