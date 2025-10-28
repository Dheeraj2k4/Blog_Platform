import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { categories, insertCategorySchema } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(categories)
      .orderBy(desc(categories.name));
  }),

  // Get single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug));

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id));

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Create new category (Protected)
  create: protectedProcedure
    .input(insertCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name if not provided
      const slug = input.slug || slugify(input.name);

      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          ...input,
          slug,
        })
        .returning();

      return newCategory;
    }),

  // Update category (Protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: insertCategorySchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData = { ...input.data };

      // Update slug if name changed
      if (updateData.name && !updateData.slug) {
        updateData.slug = slugify(updateData.name);
      }

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, input.id))
        .returning();

      if (!updatedCategory) {
        throw new Error("Category not found");
      }

      return updatedCategory;
    }),

  // Delete category (Protected)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
