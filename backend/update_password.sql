UPDATE users SET password_hash = '$2a$12$thqpN0KEeKMZm7qdHyiBCezcRuFGoV.UAz79Jo.OJkQIiAN4iouzG' WHERE username = 'student1';
SELECT username, password_hash FROM users WHERE username = 'student1';
