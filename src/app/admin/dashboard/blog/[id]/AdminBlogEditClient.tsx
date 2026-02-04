'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, CheckCircle, Loader2, Upload, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getBlogPost, updateBlogPost, BlogPostData } from '@/lib/firestore';
import { blogPosts as defaultPosts } from '@/data/blog-posts';
import Image from 'next/image';

const categories = [
    'Health Tips',
    'Exercise',
    'Recovery',
    'Prevention',
    'Wellness',
    'Conditions',
];

export default function EditBlogPostClient() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [post, setPost] = useState<BlogPostData>({
        title: '',
        excerpt: '',
        content: '',
        category: 'Health Tips',
        author: '',
        imageUrl: undefined,
        date: '',
        readTime: '',
        slug: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadPost() {
            if (!id) return;

            const data = await getBlogPost(id);
            if (data) {
                setPost(data);
            } else {
                // Check if it's a default post
                const defaultPost = defaultPosts.find(p => p.id === id);
                if (defaultPost) {
                    setPost(defaultPost);
                } else {
                    alert('Blog post not found');
                }
            }
            setLoading(false);
        }
        loadPost();
    }, [id, router]);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        if (file.size > 700 * 1024) {
            setError('Image must be smaller than 700KB');
            return;
        }

        try {
            const base64 = await convertToBase64(file);
            setPost({ ...post, imageUrl: base64 });
        } catch (err) {
            setError('Failed to process image');
        }
    };

    const handleSave = async () => {
        if (!post.title) return;

        setSaving(true);
        const wordCount = post.content.split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        const result = await updateBlogPost(id, {
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            author: post.author,
            readTime,
            imageUrl: post.imageUrl,
        });

        setSaving(false);

        if (result) {
            setSaved(true);
            setTimeout(() => {
                router.push('/admin/dashboard/blog');
            }, 1500);
        } else {
            alert('Failed to update post. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/admin/dashboard/blog">
                        <button className="p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
                            Edit Blog Post
                        </h1>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                            Edit your health article
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    className="gap-2 w-full sm:w-auto min-h-[48px]"
                    disabled={!post.title || saving}
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </Button>
            </div>

            {/* Cover Image - Show first on mobile */}
            <div className="lg:hidden bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Cover Image</h3>

                <div className="space-y-4">
                    {post.imageUrl ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-600 group">
                            <Image
                                src={post.imageUrl}
                                alt="Cover preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => setPost({ ...post, imageUrl: undefined })}
                                className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-8 flex flex-col items-center justify-center text-secondary-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-secondary-700/50 transition-all cursor-pointer min-h-[120px]"
                        >
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Upload Image</span>
                            <span className="text-xs mt-1">Max 700KB</span>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Details - Show on mobile before content */}
            <div className="lg:hidden bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Post Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Category
                        </label>
                        <select
                            value={post.category}
                            onChange={(e) => setPost({ ...post, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            value={post.author}
                            onChange={(e) => setPost({ ...post, author: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                        />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 sm:p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Post Title *
                            </label>
                            <input
                                type="text"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                className="w-full px-4 py-3 text-base sm:text-xl rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                                placeholder="Enter a compelling title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={post.excerpt}
                                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                                placeholder="A brief summary that appears in post previews..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Content
                            </label>
                            <textarea
                                value={post.content}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                                rows={12}
                                className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none font-mono text-sm"
                                placeholder="Write your blog post content here... (Markdown supported)"
                            />
                            <p className="text-xs text-secondary-500 mt-2">
                                Tip: You can use Markdown for formatting (headings, bold, lists, etc.)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Hidden on mobile (shown above) */}
                <div className="hidden lg:block space-y-6">
                    {/* Cover Image */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Cover Image</h3>

                        <div className="space-y-4">
                            {post.imageUrl ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-600 group">
                                    <Image
                                        src={post.imageUrl}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => setPost({ ...post, imageUrl: undefined })}
                                        className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-8 flex flex-col items-center justify-center text-secondary-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-secondary-700/50 transition-all cursor-pointer"
                                >
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Upload Image</span>
                                    <span className="text-xs mt-1">Max 700KB</span>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Post Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={post.category}
                                    onChange={(e) => setPost({ ...post, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={post.author}
                                    onChange={(e) => setPost({ ...post, author: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
