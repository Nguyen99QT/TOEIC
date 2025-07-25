-- ================================================================
-- MIGRATION: Update MembershipType enum to only FREE and PREMIUM
-- Date: 2025-07-25
-- Description: Remove VIP and BASIC, keep only FREE and PREMIUM
-- ================================================================

-- Step 1: Add new column with correct enum values
ALTER TABLE users ADD COLUMN membership_type_new ENUM('FREE', 'PREMIUM') DEFAULT 'FREE';

-- Step 2: Migrate existing data
-- Convert NULL to FREE
UPDATE users SET membership_type_new = 'FREE' WHERE membership_type IS NULL;

-- Convert BASIC to FREE  
UPDATE users SET membership_type_new = 'FREE' WHERE membership_type = 'BASIC';

-- Convert PREMIUM to PREMIUM (no change)
UPDATE users SET membership_type_new = 'PREMIUM' WHERE membership_type = 'PREMIUM';

-- Convert VIP to PREMIUM (upgrade existing VIP users)
UPDATE users SET membership_type_new = 'PREMIUM' WHERE membership_type = 'VIP';

-- Step 3: Drop old column and rename new column
ALTER TABLE users DROP COLUMN membership_type;
ALTER TABLE users CHANGE COLUMN membership_type_new membership_type ENUM('FREE', 'PREMIUM') DEFAULT 'FREE' NOT NULL;

-- Step 4: Verify the migration
SELECT username, membership_type FROM users;

-- Step 5: Update any other tables that might reference membership types (if any)
-- (Add additional tables here if needed)

COMMIT;
