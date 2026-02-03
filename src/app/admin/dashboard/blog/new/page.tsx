'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, CheckCircle, Loader2, Upload, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { addBlogPost } from '@/lib/firestore';
import Image from 'next/image';

const categories = [
    'Health Tips',
    'Exercise',
    'Recovery',
    'Prevention',
    'Wellness',
    'Conditions',
];

export default function NewBlogPostPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [post, setPost] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Health Tips',
        author: 'Dr. Sarah Johnson',
        imageUrl: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        const slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const today = new Date();
        const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const wordCount = post.content.split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        const result = await addBlogPost({
            title: post.title,
            slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            author: post.author,
            date,
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
            alert('Failed to save post. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/blog">
                        <button className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Write New Blog Post
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400">
                            Share health tips and insights with your patients
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} className="gap-2" disabled={!post.title || saving}>
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Publishing...' : saved ? 'Published!' : 'Publish Post'}
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Post Title *
                            </label>
                            <input
                                type="text"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                className="w-full px-4 py-3 text-xl rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
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
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
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
                                rows={15}
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none font-mono text-sm"
                                placeholder="Write your blog post content here... (Markdown supported)"
                            />
                            <p className="text-xs text-secondary-500 mt-2">
                                Tip: You can use Markdown for formatting (headings, bold, lists, etc.)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
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
                                        onClick={() => setPost({ ...post, imageUrl: '' })}
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
