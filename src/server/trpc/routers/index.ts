import { createTRPCRouter } from "../trpc";
import { postRouter } from "./post";
import { categoryRouter } from "./category";

export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
