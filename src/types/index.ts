export type { Post, InsertPost } from "@/server/db/schema/post";
export type { Category, InsertCategory } from "@/server/db/schema/category";

// Re-export for use in interfaces
import type { Category } from "@/server/db/schema/category";

// Post with relationships
export interface PostWithCategories {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
  author: {
    id: string;
    email: string;
  } | null;
}

// Category with metadata (for forms and displays)
export interface CategoryWithPosts extends Category {
  postCount?: number;
}

// Error type for better error handling
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
}
