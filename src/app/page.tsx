"use client";

import { trpc } from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { PostWithCategories } from "@/types";

export default function HomePage() {
  const { data } = trpc.post.getAll.useQuery({
    published: true,
    limit: 6,
  });

  const posts = data?.posts || [];
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-sans" style={{ color: '#071f36' }}>
              Level Up Your Story Game
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-sans">
              Creative inspiration starts with just <span className="font-semibold" style={{ color: '#071f36' }}>Articler</span>.
            </p>
          </div>

          <p className="text-center text-gray-600 mb-12 font-sans">
            Practical tips to help you unlock actionable insights in creating compelling content.
          </p>

          {featuredPost && (
            <div>
              <Link href={`/posts/${featuredPost.slug}`}>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {(featuredPost as any).imageUrl ? (
                      <img
                        src={(featuredPost as any).imageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                    )}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-2 text-white text-sm font-medium rounded-full font-sans" style={{ backgroundColor: '#071f36' }}>
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-4 text-sm">
                      {featuredPost.categories && featuredPost.categories[0] ? (
                        <span className="font-semibold font-sans" style={{ color: '#071f36' }}>{featuredPost.categories[0].name}</span>
                      ) : (
                        <span className="font-semibold font-sans" style={{ color: '#071f36' }}>Uncategorized</span>
                      )}
                      <span className="flex items-center text-gray-500 font-sans">
                        <Clock className="h-4 w-4 mr-1" />
                        {getReadingTime(featuredPost.content)} min read
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-gray-700 transition-colors leading-tight font-sans" style={{ color: '#071f36' }}>
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg font-sans">{featuredPost.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 pt-6">
                      <div className="text-sm font-sans">
                        <p className="font-medium" style={{ color: '#071f36' }}>
                          Written by {featuredPost.author?.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <p className="text-gray-500">Posted on {formatDate(featuredPost.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans" style={{ color: '#071f36' }}>
                Fresh Reads, Same Story Grind.
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl font-sans">
                Get the hottest writing hacks.
              </p>
            </div>
            <div className="flex justify-end items-center mb-8">
              <Link href="/posts">
                <Button variant="outline" className="text-white hover:opacity-90 font-sans rounded-full px-6" style={{ borderColor: '#071f36', backgroundColor: '#071f36' }}>
                  See all posts
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post: PostWithCategories) => (
                <div key={post.id}>
                  <Link href={`/posts/${post.slug}`}>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {(post as any).imageUrl ? (
                          <img
                            src={(post as any).imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-sm">
                          {post.categories && post.categories[0] ? (
                            <span className="font-semibold font-sans" style={{ color: '#071f36' }}>{post.categories[0].name}</span>
                          ) : (
                            <span className="font-semibold font-sans" style={{ color: '#071f36' }}>Uncategorized</span>
                          )}
                          <span className="flex items-center text-gray-500 font-sans">
                            <Clock className="h-4 w-4 mr-1" />
                            {getReadingTime(post.content)} min read
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors line-clamp-2 leading-tight font-sans" style={{ color: '#071f36' }}>
                          {post.title}
                        </h3>
                        <div className="text-sm font-sans pt-4 border-t border-gray-200">
                          <p className="font-medium" style={{ color: '#071f36' }}>
                            Written by {post.author?.email?.split('@')[0] || 'Anonymous'}
                          </p>
                          <p className="text-gray-500">Posted on {formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4 font-sans" style={{ color: '#071f36' }}>Why Articler</h2>
              <p className="text-gray-600 leading-relaxed mb-6 font-sans">
                We believe that creative freedom starts with the right knowledge.
              </p>
              <Link href="/dashboard">
                <Button className="text-white hover:opacity-90 font-sans rounded-full px-6" style={{ backgroundColor: '#071f36' }}>
                  More about us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 font-sans" style={{ color: '#071f36' }}>
                Create the creative life that gives you joy.
              </h3>
              <p className="text-gray-600 mb-6 font-sans">
                Join 1,000,000+ subscribers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 font-sans"
                />
                <Button className="text-white hover:opacity-90 font-sans rounded-xl px-6" style={{ backgroundColor: '#071f36' }}>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-500 font-sans">Trusted by 1,000,000+ professionals</p>
        </div>
      </section>
    </div>
  );
}
