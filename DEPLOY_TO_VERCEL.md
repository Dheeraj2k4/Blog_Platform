# Complete Vercel Deployment Guide (Website Method)

## 🚀 Step-by-Step Deployment with Working Backend

### PART 1: Prepare Your Database (Supabase - Recommended)

#### Step 1.1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" → Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `blog-platform` (or your choice)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
5. Click "Create new project" (takes 2-3 minutes)

#### Step 1.2: Get Database Connection String
1. In Supabase Dashboard, go to **Settings** (gear icon) → **Database**
2. Scroll down to "Connection string" section
3. Select **"Transaction"** mode (for Vercel)
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the actual password you set
6. **Save this connection string** - you'll need it for Vercel!

#### Step 1.3: Get Supabase API Keys
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. **Save both** - needed for Vercel!

#### Step 1.4: Set Up Supabase Storage
1. In Supabase Dashboard, click **Storage** (bucket icon)
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `blog-images` (EXACT name, don't change!)
   - **Public bucket**: Toggle ON ✅
4. Click "Create bucket"
5. Click on `blog-images` bucket → **Policies** tab
6. Click "New Policy" → Choose "For full customization"
7. Add these 3 policies:

**Policy 1: Allow Public Read**
```sql
-- Name: Allow public read
-- Operation: SELECT
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

**Policy 2: Allow Authenticated Upload**
```sql
-- Name: Allow authenticated upload
-- Operation: INSERT
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');
```

**Policy 3: Allow Authenticated Delete**
```sql
-- Name: Allow authenticated delete
-- Operation: DELETE
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');
```

---

### PART 2: Push Your Code to GitHub

#### Step 2.1: Initialize Git (if not done)
```powershell
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

#### Step 2.2: Create GitHub Repository
1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `Blog_Platform`
   - **Visibility**: Public (or Private - your choice)
3. Click "Create repository"
4. **Don't initialize** with README (you already have code)

#### Step 2.3: Push to GitHub
```powershell
git remote add origin https://github.com/YOUR-USERNAME/Blog_Platform.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username!

---

### PART 3: Deploy to Vercel

#### Step 3.1: Sign Up / Login to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" (or "Login")
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

#### Step 3.2: Import Your Project
1. On Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find your `Blog_Platform` repository in the list
3. Click **"Import"**

#### Step 3.3: Configure Project Settings
You'll see the "Configure Project" page:

1. **Project Name**: `blog-platform` (or customize)
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: `./` (leave as is)
4. **Build Command**: `npm run build` (auto-filled)
5. **Output Directory**: `.next` (auto-filled)

#### Step 3.4: Add Environment Variables
This is **CRITICAL** for your backend to work!

Click **"Environment Variables"** dropdown and add these **4 variables**:

**Variable 1: DATABASE_URL**
- **Name**: `DATABASE_URL`
- **Value**: Your Supabase connection string from Step 1.2
  ```
  postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```
- **Environment**: Check all 3 boxes (Production, Preview, Development)

**Variable 2: NEXT_PUBLIC_SUPABASE_URL**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase Project URL from Step 1.3
  ```
  https://xxxxx.supabase.co
  ```
- **Environment**: Check all 3 boxes

**Variable 3: NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon key from Step 1.3
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Environment**: Check all 3 boxes

**Variable 4: NEXT_PUBLIC_APP_URL**
- **Name**: `NEXT_PUBLIC_APP_URL`
- **Value**: `https://blog-platform.vercel.app` (use your project name)
- **Environment**: Check all 3 boxes
- **Note**: You'll update this after deployment with actual URL

#### Step 3.5: Deploy!
1. Click **"Deploy"** button
2. Wait 2-5 minutes for build to complete
3. You'll see "Congratulations!" when done

#### Step 3.6: Copy Your Deployment URL
1. Click **"Visit"** or copy the URL (like `https://blog-platform-xxxx.vercel.app`)
2. **IMPORTANT**: Update the `NEXT_PUBLIC_APP_URL` environment variable:
   - Go to your project → **Settings** → **Environment Variables**
   - Find `NEXT_PUBLIC_APP_URL`
   - Click "Edit" → Update with your actual Vercel URL
   - Click "Save"

---

### PART 4: Set Up Database Tables

Your database is empty! You need to create tables.

#### Option A: Using Supabase SQL Editor (Recommended)
1. Go to Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Copy and paste this complete schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_post_categories_post ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category ON post_categories(category_id);
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

#### Option B: Using Drizzle Push (From Your Local Machine)
```powershell
# Make sure DATABASE_URL is in your .env file
npm run db:push
```

---

### PART 5: Configure Supabase Auth for Your Domain

#### Step 5.1: Update Supabase Auth Settings
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-actual-vercel-url.vercel.app`
3. In **Redirect URLs**, add these (replace with YOUR actual URL):
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/*
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/dashboard
   ```
4. Click "Save"

#### Step 5.2: Enable Email Provider
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

---

### PART 6: Test Your Deployment! 🎉

#### Test Checklist:
1. **Visit your site**: `https://your-app.vercel.app`
2. **Sign Up**: Create a new account
   - Check your email for confirmation
   - Click the confirmation link
3. **Login**: Login with your credentials
4. **Create a Post**:
   - Go to Dashboard
   - Click "Add New Post"
   - Upload an image
   - Fill in title, content, excerpt
   - Assign categories
   - Publish
5. **View Post**: Check if it appears on All Posts page
6. **Test Image**: Verify uploaded image displays
7. **Test Search**: Try searching for posts
8. **Test Categories**: Filter by category

---

### PART 7: Troubleshooting

#### ❌ Build Fails
**Check:**
- Build logs in Vercel dashboard
- All 4 environment variables are set correctly
- No TypeScript errors in your code

**Solution:**
- Go to Vercel Dashboard → Deployments → Click failed deployment → View logs
- Fix errors and redeploy

#### ❌ "Cannot connect to database"
**Check:**
- DATABASE_URL is correct (with password replaced)
- Using "Transaction" mode (not "Session" mode)
- Connection string ends with `?sslmode=require`

**Solution:**
```
postgresql://postgres.xxxxx:PASSWORD@host.supabase.com:6543/postgres?sslmode=require
```

#### ❌ "Bucket not found" when uploading images
**Check:**
- Bucket name is exactly `blog-images`
- Bucket is set to "Public"
- Storage policies are created

**Solution:**
- Recreate bucket with exact name
- Re-run policies from Step 1.4

#### ❌ Can't sign up / login
**Check:**
- Supabase redirect URLs include your Vercel domain
- NEXT_PUBLIC_SUPABASE_URL is correct
- NEXT_PUBLIC_SUPABASE_ANON_KEY is correct

**Solution:**
- Update redirect URLs in Supabase Auth settings
- Verify all NEXT_PUBLIC_ variables are set

#### ❌ Images upload but don't display
**Check:**
- Browser console for errors
- Image URLs are publicly accessible
- Storage policies allow public read

**Solution:**
- Make bucket public
- Add "Allow public read" policy

---

### PART 8: Continuous Deployment

✅ **Automatic Deployments** are now enabled!

Every time you push to GitHub:
```powershell
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Update your live site

**Branch Previews:**
- Push to `main` → Production deployment
- Push to other branches → Preview deployment

---

### 🎯 Post-Deployment Tips

1. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `myblog.com`)
   - Update DNS records
   - Update NEXT_PUBLIC_APP_URL and Supabase redirect URLs

2. **Monitor Performance**:
   - Vercel Dashboard → Analytics
   - Check page load times
   - Monitor error rates

3. **Set Up Alerts**:
   - Project Settings → Notifications
   - Get notified of failed deployments

4. **Database Backups**:
   - Supabase automatically backs up your database
   - Go to Database → Backups to restore if needed

---

### 📝 Quick Reference

**Your URLs:**
- **Live Site**: https://your-app.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

**Environment Variables:**
```env
DATABASE_URL=postgresql://postgres.xxxxx:PASSWORD@host:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

### ✅ Deployment Complete!

Your blog platform is now live with:
- ✅ Working authentication (Supabase Auth)
- ✅ Database (PostgreSQL via Supabase)
- ✅ Image uploads (Supabase Storage)
- ✅ Auto-deployments (Vercel + GitHub)
- ✅ SSL/HTTPS (Vercel automatic)
- ✅ Global CDN (Vercel Edge Network)

**Need help?** Check:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

🎉 **Congratulations on your deployment!**
