# 🚀 Mailed - Production Deployment Guide

Complete guide to deploy Mailed to production (Netlify + Render + Supabase).

## 📋 Pre-Deployment Checklist

### 1. **Google Cloud Console Setup (Critical)**

Currently you have a test user limitation. Here's how to make it public:

#### **Step 1: Configure OAuth Consent Screen**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **OAuth consent screen**
3. **Change User Type from "Internal" to "External"**
4. Fill out the required fields:
   - App name: `Mailed - Email Tracking`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
5. **Add Scopes** (if not already added):
   ```
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/gmail.compose
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   ```
6. **Submit for Verification** (or use unverified mode for testing)

#### **Step 2: Update OAuth Credentials**
1. Go to **APIs & Services** > **Credentials**
2. Edit your OAuth 2.0 Client
3. **Update Authorized Redirect URIs**:
   ```
   https://your-backend-name.onrender.com/api/auth/google/callback
   ```

---

## 🎯 Deployment Steps

### **Phase 1: Backend Deployment (Render)**

#### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

#### **Step 2: Deploy Backend**
1. **Create New Web Service**
2. **Connect Repository**: Link your GitHub repo
3. **Configure Build Settings**:
   ```
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```
4. **Set Environment Variables** (in Render dashboard):
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend-name.onrender.com/api/auth/google/callback
   HUGGINGFACE_API_KEY=your_huggingface_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.netlify.app
   ```

#### **Step 3: Note Your Backend URL**
- After deployment, note your Render URL: `https://your-backend-name.onrender.com`

---

### **Phase 2: Database Setup (Supabase)**

#### **Step 1: Create Production Database**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database setup

#### **Step 2: Run Database Migration**
1. Go to **SQL Editor** in Supabase dashboard
2. Run the migration script:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emails table for storing fetched emails
CREATE TABLE IF NOT EXISTS emails (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  subject TEXT,
  from_address TEXT,
  date TIMESTAMP WITH TIME ZONE,
  snippet TEXT,
  title TEXT,
  tags TEXT[],
  preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Sent emails table for tracking
CREATE TABLE IF NOT EXISTS sent_emails (
  id VARCHAR(255) PRIMARY KEY,
  tracking_id VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  html_body TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opens table for email tracking
CREATE TABLE IF NOT EXISTS opens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tracking_id VARCHAR(255) NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address INET,
  is_proxy_open BOOLEAN DEFAULT FALSE,
  is_ignored BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (tracking_id) REFERENCES sent_emails(tracking_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_user_email ON emails(user_email);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_email ON sent_emails(user_email);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_opens_tracking_id ON opens(tracking_id);
CREATE INDEX IF NOT EXISTS idx_opens_opened_at ON opens(opened_at DESC);
```

#### **Step 3: Configure Row Level Security (Optional)**
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE opens ENABLE ROW LEVEL SECURITY;

-- Create policies (customize as needed)
CREATE POLICY "Users can access own data" ON users FOR ALL USING (email = current_user_email());
```

---

### **Phase 3: Frontend Deployment (Netlify)**

#### **Step 1: Update Frontend Configuration**
1. **Update `src/utils/api.ts`** with your backend URL:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-name.onrender.com/api';
   ```

#### **Step 2: Create Production Environment File**
Create `.env.production`:
```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

#### **Step 3: Build and Deploy**
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - OR connect GitHub for auto-deployment

#### **Step 4: Configure Netlify**
1. **Set Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

3. **Configure Redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

---

## 🔧 Post-Deployment Configuration

### **1. Update Google OAuth**
- Add your Netlify URL to **Authorized JavaScript origins**:
  ```
  https://your-app-name.netlify.app
  ```

### **2. Update Backend CORS**
In `server/src/index.js`, update CORS configuration:
```javascript
app.use(cors({
  origin: [
    'https://your-app-name.netlify.app',
    'http://localhost:5173' // Keep for development
  ],
  credentials: true
}));
```

### **3. Test the Deployment**
1. Visit your Netlify URL
2. Try signing in with any Gmail account
3. Send a test email with tracking
4. Verify analytics work

---

## 🐛 Common Issues & Solutions

### **Google OAuth "Access Blocked"**
- **Issue**: App not verified by Google
- **Solution**: Use unverified mode or submit for verification

### **CORS Errors**
- **Issue**: Frontend can't connect to backend
- **Solution**: Check CORS configuration and environment variables

### **Database Connection Issues**
- **Issue**: Backend can't connect to Supabase
- **Solution**: Verify environment variables and database URL

### **Tracking Pixel Not Working**
- **Issue**: Email opens not recorded
- **Solution**: Check backend logs and ensure CORS allows tracking endpoint

---

## 📊 Monitoring & Maintenance

### **Render Monitoring**
- Check backend logs in Render dashboard
- Monitor response times and errors

### **Netlify Monitoring**
- Check build logs for frontend issues
- Monitor site performance

### **Supabase Monitoring**
- Monitor database usage and performance
- Check for any connection issues

---

## 🚀 Going Live Checklist

- [ ] Google OAuth configured for external users
- [ ] Backend deployed to Render with all environment variables
- [ ] Database migrated to production Supabase
- [ ] Frontend built and deployed to Netlify
- [ ] All URLs updated in configurations
- [ ] CORS properly configured
- [ ] Test user authentication flow
- [ ] Test email sending and tracking
- [ ] Verify analytics dashboard works
- [ ] Test on different devices/browsers

---

**Your app will be live at**: `https://your-app-name.netlify.app`
**Backend API at**: `https://your-backend-name.onrender.com`

Now anyone in the world can use your Mailed application! 🎉 