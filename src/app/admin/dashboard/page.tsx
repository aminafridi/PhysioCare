'use client';

import { useState, useEffect } from 'react';
import { FileText, Briefcase, MessageSquare, Eye, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getServices, getBlogPosts, getTestimonials } from '@/lib/firestore';

const quickActions = [
    { label: 'Add New Service', href: '/admin/dashboard/services/new', icon: Briefcase },
    { label: 'Write Blog Post', href: '/admin/dashboard/blog/new', icon: FileText },
    { label: 'Edit About Page', href: '/admin/dashboard/about', icon: TrendingUp },
];

export default function DashboardPage() {
    const [stats, setStats] = useState([
        { label: 'Total Services', value: '...', icon: Briefcase, href: '/admin/dashboard/services', color: 'bg-blue-500' },
        { label: 'Blog Posts', value: '...', icon: FileText, href: '/admin/dashboard/blog', color: 'bg-green-500' },
        { label: 'Testimonials', value: '...', icon: MessageSquare, href: '/admin/dashboard/testimonials', color: 'bg-purple-500' },
        { label: 'Page Views', value: '1.2k', icon: Eye, color: 'bg-orange-500' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [services, posts, testimonials] = await Promise.all([
                    getServices(),
                    getBlogPosts(),
                    getTestimonials()
                ]);

                setStats([
                    { label: 'Total Services', value: services.length.toString(), icon: Briefcase, href: '/admin/dashboard/services', color: 'bg-blue-500' },
                    { label: 'Blog Posts', value: posts.length.toString(), icon: FileText, href: '/admin/dashboard/blog', color: 'bg-green-500' },
                    { label: 'Testimonials', value: testimonials.length.toString(), icon: MessageSquare, href: '/admin/dashboard/testimonials', color: 'bg-purple-500' },
                    { label: 'Page Views', value: '1.2k', icon: Eye, color: 'bg-orange-500' },
                ]);
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                    Welcome back! Here&apos;s an overview of your website.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-1">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        {stat.href && (
                            <Link
                                href={stat.href}
                                className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Manage →
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <action.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="font-medium text-secondary-900 dark:text-white">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Getting Started
                </h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">1</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-secondary-900 dark:text-white">Update Your About Page</h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                Add your bio, qualifications, and professional photo.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary-600 dark:text-secondary-300 font-bold text-sm">2</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-secondary-900 dark:text-white">Customize Your Services</h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                Add, edit, or remove services based on your offerings.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary-600 dark:text-secondary-300 font-bold text-sm">3</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-secondary-900 dark:text-white">Write Your First Blog Post</h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                Share health tips and physiotherapy insights with your patients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
