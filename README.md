# 📝 Blog Platform

A modern, full-stack blogging platform built with **Next.js 15**, **tRPC**, **Drizzle ORM**, **PostgreSQL**, and **TypeScript**. Features a complete CRUD system for posts and categories with markdown support, type-safe APIs, search functionality, and a clean, responsive UI.

---

## � Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Features Documentation](./FEATURES.md)** - Complete feature list and implementation details

---

## �🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript 5.3.3
- **Backend**: tRPC v11 (Type-safe API)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod
- **Editor**: Markdown with react-markdown
- **Icons**: lucide-react

## ✨ Features

### 🔐 Authentication & Security (NEW!)
- ✅ **Supabase Authentication** - Email/password and OAuth support
- ✅ **OAuth Providers** - Google and GitHub sign-in
- ✅ **Protected Routes** - Middleware-based authentication
- ✅ **User Sessions** - Persistent sessions across reloads
- ✅ **User-Specific Content** - Posts tied to authors
- ✅ **Authorization** - Users can only edit their own posts
- ✅ **Server-Side Validation** - tRPC protected procedures

### Core Functionality (Priority 1 - 100% Complete)
- ✅ Complete CRUD operations for blog posts
- ✅ Complete CRUD operations for categories
- ✅ Many-to-many relationship between posts and categories
- ✅ Markdown-based post editor with live preview
- ✅ Auto-generated slugs from titles
- ✅ Draft/Published status toggle
- ✅ Professional landing page with hero, features, and CTA
- ✅ Responsive design (mobile, tablet, desktop)

### Advanced Features (Priority 2 - 100% Complete)
- ✅ Individual post pages with dynamic routes
- ✅ Post listing page with filtering
- ✅ Category badges and filtering
- ✅ Professional UI with Header and Footer
- ✅ Markdown rendering with syntax highlighting
- ✅ Error handling and loading states

### Enhanced Features (Priority 3 - 100% Complete)
- ✅ **Search functionality** - Search posts by title and content
- ✅ **Pagination** - Navigate through posts with page controls
- ✅ **Post statistics** - Word count and reading time estimation
- ✅ **SEO optimization** - OpenGraph tags, Twitter Cards, meta descriptions
- ✅ **Complete landing page** - 5-section professional homepage
- ✅ **Image upload** - Drag-and-drop file upload with Supabase Storage for posts and categories

### Technical Features
- ✅ End-to-end type safety with tRPC
- ✅ Zod schema validation on all inputs
- ✅ Optimistic updates for better UX
- ✅ PostgreSQL with Drizzle ORM migrations
- ✅ Clean, modular architecture
- ✅ Production-ready code structure
- ✅ SEO-friendly metadata and OpenGraph tags

## 📁 Project Structure

```
Blog_Platform/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts  # tRPC API handler
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── categories/
│   │   │   │   └── page.tsx     # Category management
│   │   │   ├── layout.tsx       # Dashboard layout
│   │   │   └── page.tsx         # Post management
│   │   ├── posts/                # Public post pages
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx     # Individual post view
│   │   │   └── page.tsx         # All posts listing
│   │   ├── client.ts             # tRPC React client
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── providers.tsx         # tRPC & React Query provider
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── textarea.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── posts/                # Post components
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── MarkdownEditor.tsx
│   │   └── categories/
│   │       └── CategoryFilter.tsx
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema/           # Database schemas
│   │   │   │   ├── post.ts       # Post table & types
│   │   │   │   ├── category.ts   # Category table & types
│   │   │   │   ├── relations.ts  # Many-to-many relations
│   │   │   │   └── index.ts
│   │   │   └── index.ts          # DB client
│   │   └── trpc/
│   │       ├── routers/
│   │       │   ├── post.ts       # Post CRUD endpoints
│   │       │   ├── category.ts   # Category CRUD endpoints
│   │       │   └── index.ts      # App router
│   │       ├── context.ts        # tRPC context
│   │       └── trpc.ts           # tRPC initialization
│   ├── lib/
│   │   ├── slugify.ts            # Slug generation utility
│   │   └── utils.ts              # Common utilities
│   ├── hooks/
│   │   ├── usePostEditor.ts      # Post editor hook
│   │   └── useCategoryFilter.ts  # Category filter hook
│   ├── store/
│   │   ├── usePostStore.ts       # Post state management
│   │   └── useCategoryStore.ts   # Category state management
│   ├── styles/
│   │   └── globals.css           # Global styles + Tailwind
│   └── types/
│       └── index.ts              # Shared types
├── drizzle/                      # Database migrations (generated)
├── .env.example                  # Environment variables template
├── drizzle.config.ts             # Drizzle ORM configuration
├── next.config.mjs               # Next.js configuration
├── package.json
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** database (Supabase or Neon recommended)

### 1. Clone or Navigate to Project

```powershell
cd c:\Users\Dheeraj\Desktop\Blog_Platform
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Getting Database & Auth Credentials:

**Supabase (Recommended for Database + Auth)**
1. Go to [supabase.com](https://supabase.com) and create a project
2. **Database**: Settings → Database → Copy connection string
3. **Auth**: Settings → API → Copy Project URL and anon key
4. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed authentication setup

**Neon (Database Only)**
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string
3. Still need Supabase for authentication

### 4. Run Database Migrations

**First time setup - Create tables:**

```powershell
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:push
```

**Add authentication support:**

Run the authentication migration in your database:
- If using Supabase: Copy contents of `migrations/add_auth_support.sql` to SQL Editor and execute
- If using psql: `psql -h host -U user -d database -f migrations/add_auth_support.sql`

📖 **See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete authentication setup guide**

### 5. Set Up Supabase Storage (for Image Uploads)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Create a bucket named: `blog-images`
5. Set it to **Public** (so uploaded images are accessible)
6. Click **Create bucket**

**Bucket Policies (optional but recommended):**
- Go to **Policies** tab
- Add INSERT policy: Allow authenticated users to upload
- Add SELECT policy: Allow public read access
- Add DELETE policy: Allow authenticated users to delete their own images

### 6. Start Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your First Account

1. Click "Get Started" or "Sign Up"
2. Choose authentication method (Email or OAuth)
3. Complete registration
4. Start creating posts with images!

The application will be available at **http://localhost:3000**

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run type-check` | Run TypeScript type checking |

## 🎯 Usage Guide

### Creating Posts

1. Navigate to **/dashboard**
2. Click **"New Post"**
3. Enter title, excerpt (optional), and content in markdown
4. Toggle **"Publish immediately"** if you want to publish right away
5. Click **"Create Post"**

### Managing Categories

1. Navigate to **/dashboard/categories**
2. Click **"New Category"**
3. Enter category name and description
4. Click **"Create Category"**

### Viewing Posts

- **Landing Page**: `/` - Hero section with features
- **All Posts**: `/posts` - Browse all published posts
- **Filter by Category**: `/posts` - Use category filter buttons
- **Individual Post**: `/posts/[slug]` - Read full post

## 🔧 Configuration

### Database Schema

The database uses three main tables:

1. **posts** - Blog posts with title, content, slug, published status
2. **categories** - Post categories with name, description, slug
3. **post_categories** - Junction table for many-to-many relationship

### tRPC API Routes

All API routes are available at `/api/trpc` with full type safety:

**Post Routes:**
- `post.getAll` - Get all posts (with optional filters)
- `post.getBySlug` - Get single post by slug
- `post.getById` - Get single post by ID
- `post.create` - Create new post
- `post.update` - Update existing post
- `post.delete` - Delete post
- `post.togglePublish` - Toggle publish status

**Category Routes:**
- `category.getAll` - Get all categories
- `category.getBySlug` - Get single category by slug
- `category.getById` - Get single category by ID
- `category.create` - Create new category
- `category.update` - Update existing category
- `category.delete` - Delete category

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom design tokens defined in `src/styles/globals.css`. You can customize:

- Color scheme (primary, secondary, accent colors)
- Typography
- Spacing
- Border radius

### Adding New Features

The modular architecture makes it easy to extend:

1. **New Database Tables**: Add schema in `src/server/db/schema/`
2. **New API Routes**: Create router in `src/server/trpc/routers/`
3. **New Pages**: Add to `src/app/`
4. **New Components**: Add to `src/components/`

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```powershell
npm run build
npm start
```

Make sure to set `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` in your production environment.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database allows connections from your IP
- Check if SSL mode is required (`?sslmode=require`)

### Build Errors

- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint` to find linting issues
- Clear `.next` folder and rebuild: `rm -r .next; npm run build`

### Migration Issues

- Delete `drizzle` folder and regenerate: `npm run db:generate`
- Check database permissions
- Verify schema files have no syntax errors

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

