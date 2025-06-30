# 🚀 Quick Deployment Checklist

**Frontend build is ready!** Follow these steps in order:

## ✅ Step 1: Deploy Backend to Render (15 minutes)

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Create New Web Service**
3. **Connect GitHub** repository
4. **Configure Build & Start**:
   ```
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```
5. **Add Environment Variables**:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://YOUR-SERVICE-NAME.onrender.com/api/auth/google/callback
   HUGGINGFACE_API_KEY=your_huggingface_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://YOUR-APP-NAME.netlify.app
   ```
6. **Deploy** and note your backend URL

---

## ✅ Step 2: Setup Production Database (10 minutes)

1. **Go to [supabase.com](https://supabase.com)**
2. **Create new project**
3. **Go to SQL Editor**
4. **Copy and run** the migration script from `DEPLOYMENT.md`

---

## ✅ Step 3: Deploy Frontend to Netlify (5 minutes)

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag and drop** the `dist` folder (already built!)
3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com/api
   ```
4. **Note your frontend URL**

---

## ✅ Step 4: Fix Google OAuth (10 minutes)

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **APIs & Services** > **OAuth consent screen**
3. **Change to "External" user type**
4. **APIs & Services** > **Credentials**
5. **Update Authorized Redirect URIs**:
   ```
   https://YOUR-BACKEND-NAME.onrender.com/api/auth/google/callback
   ```
6. **Update Authorized JavaScript origins**:
   ```
   https://YOUR-APP-NAME.netlify.app
   ```

---

## ✅ Step 5: Update URLs in Code (5 minutes)

1. **Update `server/src/index.js` CORS**:
   ```javascript
   origin: [
     'https://YOUR-APP-NAME.netlify.app',
     'http://localhost:5173'
   ]
   ```

2. **Update `public/_redirects`**:
   ```
   /api/*  https://YOUR-BACKEND-NAME.onrender.com/api/:splat  200
   ```

---

## ✅ Step 6: Test Everything (5 minutes)

1. **Visit your Netlify URL**
2. **Try signing in**
3. **Send a test email**
4. **Check analytics work**

---

## 🎉 You're Live!

**Frontend**: `https://YOUR-APP-NAME.netlify.app`
**Backend**: `https://YOUR-BACKEND-NAME.onrender.com`

---

## 🔧 If Something Goes Wrong

- **Check Render logs** for backend errors
- **Check Netlify logs** for frontend issues  
- **Verify environment variables** are set correctly
- **Check Google OAuth** settings
- **Ensure database** migration ran successfully

**Need help?** Check the detailed `DEPLOYMENT.md` guide! 