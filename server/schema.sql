-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emails table
CREATE TABLE emails (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  from_address TEXT NOT NULL,
  title TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  preview TEXT NOT NULL,
  snippet TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opens table for tracking
CREATE TABLE opens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email_id TEXT REFERENCES emails(id) ON DELETE CASCADE,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_opens_email_id ON opens(email_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE opens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own emails" ON emails
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own email opens" ON opens
  FOR ALL USING (email_id IN (SELECT id FROM emails WHERE user_id = auth.uid())); 