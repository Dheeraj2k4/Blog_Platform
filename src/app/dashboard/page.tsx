"use client";

import { trpc } from "@/app/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/posts/MarkdownEditor";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { PostWithCategories, Category } from "@/types";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    published: false,
  });

  const supabase = createClient();

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, [supabase]);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.post.getAll.useQuery({ page, limit: 10 });
  const { data: categories } = trpc.category.getAll.useQuery();

  const posts = data?.posts;
  const pagination = data?.pagination;

  const createMutation = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      toast.success("Post created successfully!");
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const updateMutation = trpc.post.update.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      toast.success("Post updated successfully!");
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });

  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const togglePublishMutation = trpc.post.togglePublish.useMutation({
    onSuccess: (data) => {
      utils.post.getAll.invalidate();
      toast.success(data.published ? "Post published!" : "Post unpublished!");
    },
    onError: (error) => {
      toast.error(`Failed to toggle publish: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", excerpt: "", imageUrl: "", published: false });
    setSelectedCategories([]);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("Please enter content");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ 
        id: editingId, 
        data: { ...formData, categoryIds: selectedCategories }
      });
    } else {
      createMutation.mutate({ ...formData, categoryIds: selectedCategories });
    }
  };

  const handleEdit = (post: PostWithCategories) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      imageUrl: (post as any).imageUrl || "",
      published: post.published,
    });
    setSelectedCategories(post.categories?.map((cat) => cat.id) || []);
    setEditingId(post.id);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (postId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate({ id: postId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Manage Posts
            </h1>
            <p className="text-muted-foreground">
              Create and manage your blog posts
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
                New Post
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
                  <FileText className="h-6 w-6 mr-2 text-accent" />
                  {editingId ? "Edit Post" : "Create New Post"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter your post title..."
                      className="text-lg"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Excerpt
                    </label>
                    <Input
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="A short description of your post (optional)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be shown in post previews and search results
                    </p>
                  </div>

                  {/* Featured Image (Optional) */}
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                    folder="posts"
                    label="Featured Image (Optional)"
                    description="Upload a featured image for your post"
                  />

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Categories
                    </label>
                    {categories && categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2 p-4 bg-surface rounded-lg border border-border">
                        {categories.map((category: Category) => (
                          <label
                            key={category.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories([...selectedCategories, category.id]);
                                } else {
                                  setSelectedCategories(
                                    selectedCategories.filter((id) => id !== category.id)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent cursor-pointer"
                            />
                            <span className="text-sm font-medium text-foreground">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 bg-surface rounded-lg border border-border">
                        No categories available.{" "}
                        <a href="/dashboard/categories" className="text-accent hover:underline">
                          Create one first
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <MarkdownEditor
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Write your post content in markdown..."
                    />
                  </div>

                  {/* Publish Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-surface rounded-lg">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      className="w-5 h-5 text-accent border-border rounded focus:ring-2 focus:ring-accent cursor-pointer"
                    />
                    <label htmlFor="published" className="text-sm font-medium cursor-pointer flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-accent" />
                      Publish immediately
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="text-white hover:opacity-90"
                      style={{ backgroundColor: '#071f36' }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update Post" : "Create Post"}
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

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2 text-accent" />
            Your Posts ({pagination?.totalCount || 0})
          </h2>

          {posts && posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post: PostWithCategories, index: number) => {
                const isOwnPost = currentUser && post.authorId === currentUser.id;
                
                return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card p-6 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Post Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          {isOwnPost && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                              style={{ backgroundColor: '#071f36', color: 'white' }}>
                              <UserIcon className="h-3 w-3" />
                              Your Post
                            </span>
                          )}
                          <span
                            className={`badge flex-shrink-0 ${
                            post.published
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                          >
                            {post.published ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwnPost && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                          className="text-white transition-all duration-200 hover:bg-white border-2"
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
                          onClick={() => togglePublishMutation.mutate({ id: post.id })}
                          disabled={togglePublishMutation.isPending}
                          className="text-white transition-all duration-200 hover:bg-white border-2"
                          style={{ 
                            backgroundColor: '#071f36', 
                            borderColor: '#071f36',
                          }}
                          onMouseEnter={(e) => {
                            if (!togglePublishMutation.isPending) {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#071f36';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#071f36';
                            e.currentTarget.style.color = 'white';
                          }}
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleteMutation.isPending}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    {!isOwnPost && (
                      <div className="text-sm text-muted-foreground">
                        By {post.authorName || post.author?.email || "Unknown"}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                No posts yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first post!
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: '#071f36' }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-30"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
