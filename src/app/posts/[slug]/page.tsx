"use client";

import { trpc } from "@/app/client";
import { formatDate, getWordCount, getReadingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { Clock, BookOpen } from "lucide-react";
import type { Category } from "@/types";

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: post, isLoading } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

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
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
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
