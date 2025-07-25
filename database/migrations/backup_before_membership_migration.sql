-- ================================================================
-- BACKUP SCRIPT: Backup users table before membership migration
-- Date: 2025-07-25
-- ================================================================

-- Create backup table
CREATE TABLE users_backup_before_membership_migration AS SELECT * FROM users;

-- Verify backup
SELECT COUNT(*) as total_users_backed_up FROM users_backup_before_membership_migration;

-- Show current membership distribution
SELECT 
    membership_type,
    COUNT(*) as count
FROM users 
GROUP BY membership_type;

SELECT 'Backup completed successfully!' as status;
