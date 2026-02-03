'use client';

import Link from 'next/link';
import { Clock, ArrowRight, User } from 'lucide-react';
import { Card } from '@/components/ui';
import { BlogPost } from '@/data/blog-posts';

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Card className="h-full flex flex-col overflow-hidden p-0">
            {/* Image Placeholder */}
            <div className="h-48 relative bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                {post.imageUrl ? (
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Category */}
                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-3 w-fit">
                    {post.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-secondary-900 mb-3 line-clamp-2">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-secondary-600 text-sm leading-relaxed flex-grow mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-secondary-500 mb-4">
                    <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                    </div>
                </div>

                {/* Link */}
                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary-600 font-medium text-sm group hover:text-primary-700 transition-colors"
                >
                    Read Article
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </Card>
    );
}
