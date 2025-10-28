import { useState } from "react";

interface UseCategoryFilterReturn {
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  clearFilter: () => void;
}

export function useCategoryFilter(): UseCategoryFilterReturn {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const clearFilter = () => setSelectedCategory(null);

  return {
    selectedCategory,
    setSelectedCategory,
    clearFilter,
  };
}
