import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { posts, postCategories, insertPostSchema } from "@/server/db/schema";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export const postRouter = createTRPCRouter({
  // Get all posts with optional category filter
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        categoryId: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(50),
        page: z.number().min(1).default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { published, categoryId, limit, page } = input;
      const offset = (page - 1) * limit;

      let query = ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          authorId: posts.authorId,
          imageUrl: posts.imageUrl,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      // Filter by published status if provided
      if (published !== undefined) {
        query = query.where(eq(posts.published, published)) as typeof query;
      }

      const allPosts = await query;

      // Get categories and author for all posts
      const postsWithCategoriesAndAuthor = await Promise.all(
        allPosts.map(async (post) => {
          const categories = await ctx.db.query.postCategories.findMany({
            where: (pc, { eq }) => eq(pc.postId, post.id),
            with: {
              category: true,
            },
          });

          // Get author information
          const [author] = await ctx.db.query.users.findMany({
            where: (u, { eq }) => eq(u.id, post.authorId!),
            columns: {
              id: true,
              email: true,
            },
          });

          return {
            ...post,
            categories: categories.map((pc) => pc.category),
            author: author || null,
          };
        })
      );

      // Get total count for pagination
      let countQuery = ctx.db.select().from(posts);
      if (published !== undefined) {
        countQuery = countQuery.where(eq(posts.published, published)) as typeof countQuery;
      }
      const totalPosts = await countQuery;
      const totalCount = totalPosts.length;

      // Filter by category if provided
      if (categoryId) {
        const postIdsInCategory = await ctx.db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, categoryId));

        const postIds = postIdsInCategory.map((pc) => pc.postId);

        if (postIds.length === 0) {
          return {
            posts: [],
            pagination: {
              page,
              limit,
              totalCount: 0,
              totalPages: 0,
            },
          };
        }

        const filteredWithCategoriesAndAuthor = postsWithCategoriesAndAuthor.filter((post) => postIds.includes(post.id));
        return {
          posts: filteredWithCategoriesAndAuthor,
          pagination: {
            page,
            limit,
            totalCount: postIds.length,
            totalPages: Math.ceil(postIds.length / limit),
          },
        };
      }

      return {
        posts: postsWithCategoriesAndAuthor,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  // Search posts by title and content
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        published: z.boolean().optional().default(true),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, published, limit } = input;

      const searchPattern = `%${query}%`;

      let searchQuery = ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          imageUrl: posts.imageUrl,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(
          and(
            or(
              ilike(posts.title, searchPattern),
              ilike(posts.content, searchPattern)
            ),
            published !== undefined ? eq(posts.published, published) : undefined
          )
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit);

      return await searchQuery;
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug));

      if (!post) {
        throw new Error("Post not found");
      }

      // Get categories for this post
      const categories = await ctx.db.query.postCategories.findMany({
        where: (pc, { eq }) => eq(pc.postId, post.id),
        with: {
          category: true,
        },
      });

      // Get author information
      let author = null;
      if (post.authorId) {
        [author] = await ctx.db.query.users.findMany({
          where: (u, { eq }) => eq(u.id, post.authorId!),
          columns: {
            id: true,
            email: true,
          },
        });
      }

      return {
        ...post,
        categories: categories.map((pc) => pc.category),
        author: author || null,
      };
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!post) {
        throw new Error("Post not found");
      }

      // Get categories for this post
      const categories = await ctx.db.query.postCategories.findMany({
        where: (pc, { eq }) => eq(pc.postId, post.id),
        with: {
          category: true,
        },
      });

      return {
        ...post,
        categories: categories.map((pc) => pc.category),
      };
    }),

  // Create new post (Protected)
  create: protectedProcedure
    .input(
      insertPostSchema.extend({
        categoryIds: z.array(z.string().uuid()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...postData } = input;

      // Generate slug from title if not provided
      const slug = postData.slug || slugify(postData.title);

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          ...postData,
          slug,
          authorId: ctx.user.id, // Add author ID from authenticated user
        })
        .returning();

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  // Update post (Protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: insertPostSchema.partial().extend({
          categoryIds: z.array(z.string().uuid()).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...postData } = input.data;

      // Verify post belongs to user
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new Error("Unauthorized: You can only edit your own posts");
      }

      // Update slug if title changed
      if (postData.title && !postData.slug) {
        postData.slug = slugify(postData.title);
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...postData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Remove existing categories
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, input.id));

        // Add new categories
        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  // Delete post (Protected)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify post belongs to user
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!existingPost) {
        throw new Error("Post not found");
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new Error("Unauthorized: You can only delete your own posts");
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),

  // Toggle publish status (Protected)
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.authorId !== ctx.user.id) {
        throw new Error("Unauthorized: You can only modify your own posts");
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          published: !post.published,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      return updatedPost;
    }),
});
