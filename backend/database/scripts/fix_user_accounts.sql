-- Fix user accounts script
-- This script helps fix user accounts where the username and email might be causing authentication issues

-- Update the user with email 'haha@gmail.com' to ensure its username is also 'haha@gmail.com'
-- This helps resolve issues where the frontend authenticates with email but backend expects username
UPDATE users 
SET username = 'haha@gmail.com' 
WHERE email = 'haha@gmail.com' AND username != 'haha@gmail.com';

-- Update the user with username 'hanoi' to ensure consistency
-- If the username is supposed to be 'hanoi' but the email is used for authentication,
-- make sure both email and username can be used for authentication
UPDATE users
SET email = 'hanoi@example.com'
WHERE username = 'hanoi' AND email != 'hanoi@example.com';

-- Add a log message to check the changes
SELECT id, username, email, full_name, role FROM users 
WHERE username IN ('haha@gmail.com', 'hanoi') OR email IN ('haha@gmail.com', 'hanoi@example.com');
