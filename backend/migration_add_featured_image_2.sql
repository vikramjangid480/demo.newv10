-- Migration to add featured_image_2 field to blogs table
-- Date: 2024-09-24

USE boganto_blog;

-- Add featured_image_2 column to blogs table
ALTER TABLE blogs ADD COLUMN featured_image_2 VARCHAR(255) AFTER featured_image;

-- Show the updated table structure
DESCRIBE blogs;