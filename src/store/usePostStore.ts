import { create } from "zustand";
import { type Post } from "@/server/db/schema";

interface PostStore {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
}));
