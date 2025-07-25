import re

# Read the SQL file
with open("database/migrations/update_questions.sql", "r", encoding="utf-8") as f:
    content = f.read()

# Replace audio URLs - ensure we don't duplicate paths
content = re.sub(
    r"`audio_url` = '/audio/([^']+)'",
    r"`audio_url` = '/files/audio/exercises/\1'",
    content
)

# Replace image URLs - ensure we don't duplicate 'exercises/'
content = re.sub(
    r"`image_url` = '/images/exercises/([^']+)'",
    r"`image_url` = '/files/images/exercises/\1'",
    content
)

# Replace other image URLs
content = re.sub(
    r"`image_url` = '/images/([^']+)'",
    r"`image_url` = '/files/images/exercises/\1'",
    content
)

# Fix duplicate 'exercises/exercises/' paths
content = content.replace('/files/images/exercises/exercises/', '/files/images/exercises/')

print("SQL file updated successfully with correct file paths.")
