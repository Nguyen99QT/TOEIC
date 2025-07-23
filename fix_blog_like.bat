@echo off
echo =====================================================
echo 🔧 FIXING BLOG LIKE FUNCTIONALITY
echo =====================================================

echo.
echo 1. Checking MySQL connection...
mysql -u root -p -e "SELECT 'MySQL connection successful' as status;"

echo.
echo 2. Checking if database toeic8 exists...
mysql -u root -p -e "SHOW DATABASES LIKE 'toeic8';"

echo.
echo 3. Checking if blog_post table exists...
mysql -u root -p toeic8 -e "SHOW TABLES LIKE 'blog_post';"

echo.
echo 4. Checking if post_like table exists...
mysql -u root -p toeic8 -e "SHOW TABLES LIKE 'post_like';"

echo.
echo 5. Creating post_like table if not exists...
mysql -u root -p toeic8 < "d:\Final Exam\TOEIC\database\create_post_like_table.sql"

echo.
echo 6. Checking blog posts...
mysql -u root -p toeic8 -e "SELECT id, title, author FROM blog_post LIMIT 10;"

echo.
echo 7. Checking if blog post id=9 exists...
mysql -u root -p toeic8 -e "SELECT id, title, author FROM blog_post WHERE id = 9;"

echo.
echo =====================================================
echo ✅ Fix completed! Please test the like functionality.
echo =====================================================

pause
