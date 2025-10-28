"use client";

import { trpc } from "@/app/client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Clock, User } from "lucide-react";
import { formatDate, getReadingTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithCategories, Category } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: searchResults } = trpc.post.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const { data, isLoading } = trpc.post.getAll.useQuery({
    published: true,
    ...(selectedCategory ? { categoryId: selectedCategory } : {}),
    limit: 12,
    page,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  const posts = searchQuery ? searchResults : data?.posts;
  const postsWithCategories = posts as PostWithCategories[] | undefined;
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              All Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of articles, tutorials, and insights
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-background border-border text-lg rounded-lg"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`badge transition-all ${
                  !selectedCategory
                    ? "badge-primary"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
                disabled={searchQuery.length > 0}
              >
                All Posts
              </button>
              {categories.map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`badge transition-all ${
                    selectedCategory === category.id
                      ? "badge-primary"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  disabled={searchQuery.length > 0}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          )}

          {searchQuery && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Found {posts?.length || 0} result{posts?.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/5" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : postsWithCategories && postsWithCategories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {postsWithCategories.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link href={`/posts/${post.slug}`}>
                      <div className="card card-hover h-full overflow-hidden group">
                        {/* Featured Image Placeholder */}
                        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category and Reading Time */}
                          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                            {post.categories && post.categories[0] ? (
                              <span className="text-primary font-medium">
                                {post.categories[0].name}
                              </span>
                            ) : (
                              <span className="text-primary font-medium">Uncategorized</span>
                            )}
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {getReadingTime(post.content)} min read
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Author and Date */}
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                                <User className="h-4 w-4" />
                              </div>
                              <span className="text-sm text-muted-foreground font-medium">
                                {post.author?.email?.split('@')[0] || 'Anonymous'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {!searchQuery && pagination && pagination.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* First page */}
                    {pagination.totalPages > 0 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(1)}
                          isActive={page === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Show ellipsis if needed */}
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show previous page */}
                    {page > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(page - 1)}
                        >
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Current page (if not first or last) */}
                    {page !== 1 && page !== pagination.totalPages && (
                      <PaginationItem>
                        <PaginationLink isActive>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Show next page */}
                    {page < pagination.totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(page + 1)}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Show ellipsis if needed */}
                    {page < pagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {pagination.totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(pagination.totalPages)}
                          isActive={page === pagination.totalPages}
                        >
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className={page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
                No posts found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Check back later for new content"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
