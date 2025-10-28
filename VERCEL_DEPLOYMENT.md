# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (Supabase or Neon recommended)
- Supabase project for Auth & Storage

## Step 1: Prepare Your Database

### Option A: Supabase (Recommended - All-in-One)
1. Go to https://supabase.com and create a project
2. Get your connection string:
   - Go to Settings → Database
   - Copy the "Connection string" (Pooling mode recommended)
3. Note your Supabase URL and Anon Key (from Settings → API)

### Option B: Neon or Other PostgreSQL
1. Create a PostgreSQL database
2. Get the connection string with SSL enabled

## Step 2: Set Up Supabase Storage
1. Create a bucket named `blog-images` (public)
2. Set up storage policies (see STORAGE_SETUP.md)

## Step 3: Deploy to Vercel

### Using Vercel CLI (Recommended)
```bash
# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? blog-platform (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No
```

### Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

## Step 4: Set Environment Variables in Vercel

After deployment, add these environment variables:

1. Go to your project in Vercel Dashboard
2. Navigate to: Settings → Environment Variables
3. Add the following variables:

```
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** 
- Set all variables for "Production", "Preview", and "Development" environments
- Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL after first deployment

## Step 5: Redeploy

After adding environment variables:
```bash
vercel --prod
```

Or redeploy from the Vercel dashboard.

## Step 6: Run Database Migrations

After successful deployment, you need to run migrations:

```bash
# Install dependencies if needed
npm install

# Generate migrations
npm run db:generate

# Push to database
npm run db:push
```

## Step 7: Update Supabase Auth Settings

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add these to "Redirect URLs":
   - https://your-app.vercel.app
   - https://your-app.vercel.app/auth/callback
   - https://your-app.vercel.app/dashboard

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify database connection string is correct

### Database Connection Issues
- Use connection pooling (Supabase Pooling mode)
- Ensure SSL is enabled in connection string
- Check if your database allows connections from Vercel IPs

### Supabase Storage Not Working
- Verify bucket name is `blog-images`
- Check storage policies are set correctly
- Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

### Authentication Issues
- Verify Supabase redirect URLs are configured
- Check NEXT_PUBLIC_APP_URL matches your Vercel domain
- Ensure auth cookies are working (disable blocking third-party cookies)

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update NEXT_PUBLIC_APP_URL environment variable
5. Update Supabase redirect URLs

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

## Post-Deployment Checklist

- [ ] Database connected and migrations run
- [ ] Can sign up/login
- [ ] Can create posts
- [ ] Can upload images
- [ ] Images display correctly
- [ ] Categories work
- [ ] Search functionality works
- [ ] All pages load without errors

## Useful Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove [deployment-url]

# Open project in browser
vercel open
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:port/db |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL | https://xxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key | eyJhbGc... |
| NEXT_PUBLIC_APP_URL | Your deployed app URL | https://blog.vercel.app |

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs
