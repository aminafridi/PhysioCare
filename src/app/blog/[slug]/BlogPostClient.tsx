'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SectionWrapper, Button } from '@/components/ui';
import { getBlogPostBySlug, BlogPostData } from '@/lib/firestore';
import { blogPosts as defaultPosts } from '@/data/blog-posts';
import { Clock, Calendar, ArrowLeft, Share2, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CTABanner } from '@/components/sections';

export default function BlogPostClient() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            if (!slug) return;

            // Try Firebase first
            const firebasePost = await getBlogPostBySlug(slug);
            if (firebasePost) {
                setPost(firebasePost);
            } else {
                // Fallback to default posts
                const defaultPost = defaultPosts.find(p => p.slug === slug);
                if (defaultPost) {
                    setPost({
                        ...defaultPost,
                        id: defaultPost.id,
                        imageUrl: defaultPost.imageUrl
                    });
                }
            }
            setLoading(false);
        }
        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16">
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">Post Not Found</h1>
                <p className="text-secondary-600 mb-8">The blog post you're looking for doesn't exist.</p>
                <Link href="/blog">
                    <Button>Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Header / Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-primary-50 to-white dark:from-secondary-900 dark:to-secondary-800">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                {post.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-secondary-600 dark:text-secondary-400 border-b border-secondary-200 dark:border-secondary-700 pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="font-medium text-secondary-900 dark:text-white">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <SectionWrapper background="white" className="pt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Featured Image */}
                    {post.imageUrl && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl mb-12">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-600 dark:text-secondary-300">
                        {/* We render HTML content safely since it comes from our trusted editor or static file */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Share & Tags Footer */}
                    <div className="mt-16 pt-8 border-t border-secondary-200 dark:border-secondary-700 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-secondary-500" />
                            <span className="text-secondary-600 dark:text-secondary-400">Tag:</span>
                            <span className="font-medium text-secondary-900 dark:text-white">{post.category}</span>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share Article
                        </button>
                    </div>
                </div>
            </SectionWrapper>

            <CTABanner />
        </>
    );
}
