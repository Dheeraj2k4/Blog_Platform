import { create } from "zustand";
import { type Category } from "@/server/db/schema";

interface CategoryStore {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
