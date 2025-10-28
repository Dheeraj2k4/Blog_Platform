"use client";

import { type Post } from "@/server/db/schema";
import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden group">
      {/* Post Image or Placeholder */}
      <Link href={`/posts/${post.slug}`}>
        {(post as any).imageUrl ? (
          <div className="h-48 relative overflow-hidden">
            <img
              src={(post as any).imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            <FileText className="h-16 w-16 text-primary/30 relative z-10" />
          </div>
        )}
      </Link>

      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(post.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || truncate(post.content, 150)}
        </p>
        {!post.published && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
            Draft
          </span>
        )}
      </CardContent>
    </Card>
  );
}
