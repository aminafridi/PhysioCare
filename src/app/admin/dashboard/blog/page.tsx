'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Plus, Edit, Trash2, Eye, Calendar, Loader2, Clock } from 'lucide-react';
import { getBlogPosts, deleteBlogPost, updateBlogPost, BlogPostData } from '@/lib/firestore';
import { blogPosts as defaultPosts } from '@/data/blog-posts';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<BlogPostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function loadPosts() {
            const data = await getBlogPosts();
            if (data.length > 0) {
                setPosts(data);
            } else {
                // Fall back to default posts
                setPosts(defaultPosts.map(p => ({
                    ...p,
                    content: '', // Minimal data for list view
                })));
            }
            setLoading(false);
        }
        loadPosts();
    }, []);

    const handleImportDefaults = async () => {
        if (!confirm('This will add all default blog posts to your database. Continue?')) return;
        setImporting(true);
        try {
            await Promise.all(defaultPosts.map(async (p) => {
                const postData: Partial<BlogPostData> = {
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.excerpt,
                    content: p.content,
                    category: p.category,
                    author: p.author,
                    date: p.date,
                    readTime: p.readTime,
                    imageUrl: p.imageUrl,
                };
                return updateBlogPost(p.id, postData);
            }));

            const data = await getBlogPosts();
            setPosts(data);
            alert('Default posts imported successfully!');
        } catch (error) {
            console.error('Import failed', error);
            alert('Failed to import defaults');
        } finally {
            setImporting(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setDeleting(itemToDelete);
        const success = await deleteBlogPost(itemToDelete);
        if (success) {
            setPosts(posts.filter((p) => p.id !== itemToDelete));
        } else {
            alert('Failed to delete post');
        }
        setDeleting(null);
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
                        Manage Blog Posts
                    </h1>
                    <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                        Create and manage your health & wellness articles
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {(posts.length === 0 || posts.some(p => defaultPosts.some(d => d.id === p.id))) && (
                        <Button
                            onClick={handleImportDefaults}
                            variant="outline"
                            disabled={importing}
                            className="min-h-[48px]"
                        >
                            {importing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Import Defaults to DB
                        </Button>
                    )}
                    <Link href="/admin/dashboard/blog/new">
                        <Button className="gap-2 w-full min-h-[48px]">
                            <Plus className="w-4 h-4" />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Posts List - Desktop */}
            <div className="hidden md:block bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-4 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {post.imageUrl ? (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl">📝</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-secondary-900 dark:text-white">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-secondary-500">
                                    <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs">
                                        {post.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {post.date}
                                    </span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/blog/${post.slug}`} target="_blank">
                                    <button className="p-2.5 text-secondary-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </Link>
                                <Link href={`/admin/dashboard/blog/${post.id}`}>
                                    <button className="p-2.5 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => post.id && handleDeleteClick(post.id)}
                                    disabled={deleting === post.id}
                                    className="p-2.5 text-secondary-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                >
                                    {deleting === post.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts List - Mobile Card View */}
            <div className="md:hidden space-y-3">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden"
                    >
                        {/* Post Image */}
                        <div className="w-full h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center overflow-hidden">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl">📝</span>
                            )}
                        </div>

                        <div className="p-4">
                            {/* Category Badge */}
                            <span className="inline-block px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium mb-2">
                                {post.category}
                            </span>

                            {/* Title */}
                            <h3 className="font-medium text-secondary-900 dark:text-white mb-2 line-clamp-2">
                                {post.title}
                            </h3>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-secondary-500 mb-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {post.readTime}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1">
                                    <Button variant="outline" className="w-full min-h-[44px] gap-2 text-sm">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Button>
                                </Link>
                                <Link href={`/admin/dashboard/blog/${post.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full min-h-[44px] gap-2 text-sm">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => post.id && handleDeleteClick(post.id)}
                                    disabled={deleting === post.id}
                                    className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center border border-red-200 dark:border-red-800"
                                >
                                    {deleting === post.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                        No blog posts yet
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Button onClick={handleImportDefaults} variant="outline" disabled={importing} className="min-h-[48px]">
                            Import Defaults
                        </Button>
                        <Link href="/admin/dashboard/blog/new">
                            <Button className="w-full min-h-[48px]">Write Your First Post</Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Blog Post"
                message="Are you sure you want to permanently delete this blog post? This action cannot be undone."
                confirmText="Delete Post"
                isLoading={!!deleting}
                variant="danger"
            />
        </div>
    );
}
