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
  tracking_id TEXT NOT NULL REFERENCES sent_emails(tracking_id) ON DELETE CASCADE,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sent_emails table for tracking
CREATE TABLE IF NOT EXISTS sent_emails (
  id TEXT PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  html_body TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_opens_tracking_id ON opens(tracking_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_email ON sent_emails(user_email);
CREATE INDEX IF NOT EXISTS idx_sent_emails_tracking_id ON sent_emails(tracking_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);

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
  FOR ALL USING (tracking_id IN (SELECT tracking_id FROM sent_emails WHERE user_email = auth.uid())); 