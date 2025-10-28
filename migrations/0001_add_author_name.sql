-- Migration: Add authorName column to posts table
-- Date: 2025-10-28
-- Description: Adds an optional author_name field to store the display name or email of post authors

-- Add the author_name column to the posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Update existing posts to populate author_name from users table
UPDATE posts 
SET author_name = users.email 
FROM users 
WHERE posts.author_id = users.id 
AND posts.author_name IS NULL;

-- Add a comment to the column for documentation
COMMENT ON COLUMN posts.author_name IS 'Display name or email of the post author, denormalized for performance';
