"use client";

import { trpc } from "@/app/client";
import { formatDate, getWordCount, getReadingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useParams, useRouter } from "next/navigation";
import { Clock, BookOpen, Edit2, Trash2, User as UserIcon } from "lucide-react";
import type { Category } from "@/types";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const supabase = createClient();

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, [supabase]);

  const { data: post, isLoading } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const deleteMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      router.push("/posts");
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const handleEdit = () => {
    router.push("/dashboard");
  };

  const handleDelete = () => {
    if (post && confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deleteMutation.mutate({ id: post.id });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  const wordCount = getWordCount(post.content);
  const readingTime = getReadingTime(post.content);
  const isOwnPost = currentUser && post.authorId === currentUser.id;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Featured Image */}
      {(post as any).imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={(post as any).imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}
      
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold flex-1">{post.title}</h1>
          {isOwnPost && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
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
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        {/* Author info */}
        <div className="flex items-center gap-2 mb-4">
          {isOwnPost && (
            <span className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
              style={{ backgroundColor: '#071f36', color: 'white' }}>
              <UserIcon className="h-3 w-3" />
              Your Post
            </span>
          )}
          {!isOwnPost && (post as any).authorName && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              By {(post as any).authorName}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-4">
          <time>{formatDate(post.createdAt)}</time>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{wordCount} words</span>
          </div>
        </div>
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2">
            {post.categories.map((category: Category) => (
              <span
                key={category.id}
                className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.excerpt && (
        <div className="text-lg text-muted-foreground mb-8 pb-8 border-b">
          {post.excerpt}
        </div>
      )}

      <div className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
