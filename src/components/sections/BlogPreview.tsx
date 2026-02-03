'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SectionWrapper, Button } from '@/components/ui';
import { BlogCard } from '@/components/BlogCard';
import { getBlogPosts, BlogPostData } from '@/lib/firestore';
import { blogPosts as staticPosts } from '@/data/blog-posts';

export function BlogPreview() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await getBlogPosts();
                if (data.length > 0) {
                    // Transform Firestore data for BlogCard
                    const formatted = data.slice(0, 3).map((p: BlogPostData) => ({
                        id: p.id || '',
                        title: p.title,
                        slug: p.slug,
                        excerpt: p.excerpt,
                        content: p.content || '',
                        category: p.category,
                        author: p.author,
                        date: p.date,
                        readTime: p.readTime,
                        imageUrl: p.imageUrl,
                    }));
                    setPosts(formatted);
                } else {
                    // Fallback to static posts if DB is empty
                    setPosts(staticPosts.slice(0, 3));
                }
            } catch (error) {
                console.error('Error loading blog preview:', error);
                setPosts(staticPosts.slice(0, 3));
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, []);

    if (loading) {
        return (
            <SectionWrapper background="white" id="blog-preview">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper background="white" id="blog-preview">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4"
                    >
                        Blog & Resources
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Latest Health <span className="text-gradient">Insights</span>
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Link href="/blog">
                        <Button variant="outline" className="gap-2 group">
                            View All Articles
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <BlogCard post={post} />
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
