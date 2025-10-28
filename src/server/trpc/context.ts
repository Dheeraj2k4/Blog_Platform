import { db } from "../db";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export const createTRPCContext = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    db,
    user: user as User | null,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
