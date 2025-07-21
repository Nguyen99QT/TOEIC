package com.leenglish.toeic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leenglish.toeic.domain.EmailVerifyToken;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerifyTokenRepository extends JpaRepository<EmailVerifyToken, Long> {
    Optional<EmailVerifyToken> findByToken(String token);
    Optional<EmailVerifyToken> findByUserId(Long userId);
}