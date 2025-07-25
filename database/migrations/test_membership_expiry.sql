-- ================================================================
-- TEST MEMBERSHIP EXPIRY SYSTEM
-- Date: 2025-07-25
-- ================================================================

-- 1. Check current membership status
SELECT 
    username,
    membership_type,
    is_premium,
    premium_expires_at,
    CASE 
        WHEN premium_expires_at IS NULL THEN 'No expiry set'
        WHEN premium_expires_at < NOW() THEN 'EXPIRED'
        WHEN premium_expires_at > NOW() THEN 'ACTIVE'
        ELSE 'UNKNOWN'
    END as status
FROM users 
WHERE membership_type = 'PREMIUM';

-- 2. Test data: Create a user with expired membership (for testing)
-- INSERT INTO users (username, email, password_hash, full_name, membership_type, is_premium, premium_expires_at, role, is_active, created_at, updated_at, total_score, is_email_verified) 
-- VALUES ('test_expired', 'expired@test.com', 'hash', 'Test Expired User', 'PREMIUM', 1, '2025-07-24 12:00:00', 'USER', 1, NOW(), NOW(), 0, 1);

-- 3. Test data: Create a user with membership expiring soon (for testing)
-- INSERT INTO users (username, email, password_hash, full_name, membership_type, is_premium, premium_expires_at, role, is_active, created_at, updated_at, total_score, is_email_verified) 
-- VALUES ('test_expiring_soon', 'expiring@test.com', 'hash', 'Test Expiring Soon User', 'PREMIUM', 1, DATE_ADD(NOW(), INTERVAL 12 HOUR), 'USER', 1, NOW(), NOW(), 0, 1);

-- 4. Check users with expired memberships (what scheduler will find)
SELECT 
    username,
    membership_type,
    premium_expires_at,
    TIMESTAMPDIFF(HOUR, premium_expires_at, NOW()) as hours_expired
FROM users 
WHERE membership_type = 'PREMIUM' 
AND premium_expires_at IS NOT NULL 
AND premium_expires_at < NOW();

-- 5. Check users with memberships expiring within 24 hours
SELECT 
    username,
    membership_type,
    premium_expires_at,
    TIMESTAMPDIFF(HOUR, NOW(), premium_expires_at) as hours_until_expiry
FROM users 
WHERE membership_type = 'PREMIUM' 
AND premium_expires_at IS NOT NULL 
AND premium_expires_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR);

-- 6. Manually expire a membership (simulate scheduler action)
-- UPDATE users 
-- SET membership_type = 'FREE', is_premium = 0, premium_expires_at = NULL 
-- WHERE username = 'test_expired';

SELECT 'Membership expiry test queries completed!' as status;
