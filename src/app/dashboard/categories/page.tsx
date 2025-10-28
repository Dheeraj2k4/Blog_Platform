"use client";

import { trpc } from "@/app/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Tag,
  X,
  Save,
  Folder
} from "lucide-react";

export default function CategoriesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      toast.success("Category created successfully!");
      resetForm();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to create category: ${message}`);
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      toast.success("Category updated successfully!");
      resetForm();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to update category: ${message}`);
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      toast.success("Category deleted successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to delete category: ${message}`);
    },
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", imageUrl: "" });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      imageUrl: (category as any).imageUrl || "",
    });
    setEditingId(category.id);
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Color palette for category cards
  const categoryColors = [
    { bg: "bg-gradient-to-br from-pink-100 to-pink-200", icon: "text-pink-600" },
    { bg: "bg-gradient-to-br from-blue-100 to-blue-200", icon: "text-blue-600" },
    { bg: "bg-gradient-to-br from-purple-100 to-purple-200", icon: "text-purple-600" },
    { bg: "bg-gradient-to-br from-green-100 to-green-200", icon: "text-green-600" },
    { bg: "bg-gradient-to-br from-yellow-100 to-yellow-200", icon: "text-yellow-600" },
    { bg: "bg-gradient-to-br from-orange-100 to-orange-200", icon: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Manage Categories
            </h1>
            <p className="text-muted-foreground">
              Organize your posts with categories
            </p>
          </div>
          <Button
            onClick={() => {
              if (isCreating) {
                resetForm();
              } else {
                setIsCreating(true);
              }
            }}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#071f36' }}
          >
            {isCreating ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Category
              </>
            )}
          </Button>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="card p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Tag className="h-6 w-6 mr-2 text-accent" />
                  {editingId ? "Edit Category" : "Create New Category"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter category name..."
                      className="text-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of this category (optional)"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Help readers understand what posts belong in this category
                    </p>
                  </div>

                  {/* Category Image (Optional) */}
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                    folder="categories"
                    label="Category Image (Optional)"
                    description="Upload an image for this category"
                  />

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: '#071f36' }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update Category" : "Create Category"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="border-border hover:bg-surface"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            <Folder className="h-5 w-5 mr-2 text-accent" />
            Your Categories ({categories?.length || 0})
          </h2>

          {categories && categories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category: Category, index: number) => {
                const colorScheme = categoryColors[index % categoryColors.length];
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="card overflow-hidden hover:shadow-card-hover transition-shadow group"
                  >
                    {/* Category Image or Colorful Header */}
                    {(category as any).imageUrl ? (
                      <div className="h-32 relative overflow-hidden">
                        <img
                          src={(category as any).imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`${colorScheme.bg} h-32 flex items-center justify-center relative`}>
                        <div className="absolute inset-0 bg-white/20"></div>
                        <Folder className={`h-16 w-16 ${colorScheme.icon} relative z-10`} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                      
                      {category.description ? (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {category.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-4 italic">
                          No description provided
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                          className="flex-1 text-white transition-all duration-200 hover:bg-white border-2"
                          style={{ 
                            backgroundColor: '#071f36', 
                            borderColor: '#071f36',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#071f36';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#071f36';
                            e.currentTarget.style.color = 'white';
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm(`Delete "${category.name}" category?`)) {
                              deleteMutation.mutate({ id: category.id });
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                No categories yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first category to organize your posts!
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#071f36' }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Category
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
