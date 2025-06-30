-- Migration: Add tracking columns to opens table
-- Run this in your Supabase SQL editor

-- Add new columns to opens table
ALTER TABLE opens 
ADD COLUMN IF NOT EXISTS is_proxy_open BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_ignored BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing records to have default values
UPDATE opens 
SET is_proxy_open = FALSE, is_ignored = FALSE 
WHERE is_proxy_open IS NULL OR is_ignored IS NULL;

-- Create index for better performance when filtering by is_ignored
CREATE INDEX IF NOT EXISTS idx_opens_is_ignored ON opens(is_ignored);
CREATE INDEX IF NOT EXISTS idx_opens_is_proxy ON opens(is_proxy_open);

-- Verify the migration
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'opens' 
ORDER BY ordinal_position; 