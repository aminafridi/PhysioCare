'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui';
import { BlogCard } from '@/components/BlogCard';
import { CTABanner } from '@/components/sections';
import { blogPosts as defaultPosts } from '@/data/blog-posts';
import { getBlogPosts, BlogPostData } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

export default function BlogPage() {
    const [posts, setPosts] = useState(defaultPosts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            const data = await getBlogPosts();
            if (data.length > 0) {
                // Transform Firebase data to match expected format
                const formatted = data.map((p: BlogPostData) => ({
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
            }
            setLoading(false);
        }
        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Insights & Resources
                        </span>
                        <h1 className="mb-6">
                            Stay <span className="text-gradient">Movement-Optimized</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Expert advice, injury prevention tips, and rehabilitation guides
                            to help you perform at your best.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <SectionWrapper background="white">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <BlogCard post={post} />
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Newsletter Section */}
            <SectionWrapper background="gray">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="mb-4">
                        Subscribe to Our <span className="text-gradient">Newsletter</span>
                    </h2>
                    <p className="text-secondary-600 mb-8">
                        Get the latest health tips and physiotherapy insights delivered
                        straight to your inbox. No spam, just valuable content.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </SectionWrapper>

            <CTABanner />
        </>
    );
}
