'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { updateAdminUser, getAdminUserByEmail } from '@/lib/firestore';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    MessageSquare,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Calendar,
    ChevronDown,
    KeyRound,
    Users,
    Eye,
    EyeOff,
    Shield,
    Mail,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const sidebarLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, pageId: 'dashboard' },
    { href: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar, pageId: 'appointments' },
    { href: '/admin/dashboard/about', label: 'About Page', icon: User, pageId: 'about' },
    { href: '/admin/dashboard/services', label: 'Services', icon: Briefcase, pageId: 'services' },
    { href: '/admin/dashboard/blog', label: 'Blog Posts', icon: FileText, pageId: 'blog' },
    { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: MessageSquare, pageId: 'testimonials' },
    { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings, pageId: 'settings' },
    { href: '/admin/dashboard/users', label: 'Users', icon: Users, pageId: 'users' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, logout } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/admin');
        }
    }, [user, isLoading, router]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/admin');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setSavingPassword(true);

        try {
            // Verify current password
            const dbUser = await getAdminUserByEmail(user.email);

            if (!dbUser) {
                // Default admin user - check hardcoded password
                if (currentPassword !== 'admin123') {
                    setPasswordError('Current password is incorrect');
                    setSavingPassword(false);
                    return;
                }
                setPasswordError('Default admin password cannot be changed from here');
                setSavingPassword(false);
                return;
            }

            if (dbUser.password !== currentPassword) {
                setPasswordError('Current password is incorrect');
                setSavingPassword(false);
                return;
            }

            // Update password
            const success = await updateAdminUser(dbUser.id!, { password: newPassword });

            if (success) {
                setPasswordSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    setPasswordModalOpen(false);
                    setPasswordSuccess(false);
                }, 2000);
            } else {
                setPasswordError('Failed to update password');
            }
        } catch {
            setPasswordError('An error occurred');
        }

        setSavingPassword(false);
    };

    const closePasswordModal = () => {
        setPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError(null);
        setPasswordSuccess(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 transform transition-transform duration-200 lg:transform-none',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-secondary-200 dark:border-secondary-700">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="font-bold text-secondary-900 dark:text-white">
                            PhysioCare
                        </span>
                    </Link>
                    <button
                        className="lg:hidden p-2 text-secondary-500 hover:text-secondary-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {sidebarLinks
                        .filter(link => {
                            if (user?.role === 'superadmin') return true;
                            return user?.allowedPages?.includes(link.pageId);
                        })
                        .map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== '/admin/dashboard' && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-4 lg:px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
                        >
                            View Website <span className="hidden sm:inline">→</span>
                        </Link>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <ChevronDown className={cn(
                                "w-4 h-4 text-secondary-500 transition-transform hidden sm:block",
                                profileDropdownOpen && "rotate-180"
                            )} />
                        </button>

                        {/* Dropdown Menu */}
                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                                    <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-secondary-500 truncate">
                                        {user.email}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            setProfileModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            setPasswordModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-secondary-100 dark:border-secondary-700 pt-1">
                                    <button
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>

            {/* View Profile Modal */}
            {profileModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                                My Profile
                            </h2>
                            <button
                                onClick={() => setProfileModalOpen(false)}
                                className="p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Avatar */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                                    <User className="w-5 h-5 text-secondary-400" />
                                    <div>
                                        <p className="text-xs text-secondary-500">Full Name</p>
                                        <p className="font-medium text-secondary-900 dark:text-white">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                                    <Mail className="w-5 h-5 text-secondary-400" />
                                    <div>
                                        <p className="text-xs text-secondary-500">Email Address</p>
                                        <p className="font-medium text-secondary-900 dark:text-white">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                                    <Shield className="w-5 h-5 text-secondary-400" />
                                    <div>
                                        <p className="text-xs text-secondary-500">Role</p>
                                        <p className="font-medium text-secondary-900 dark:text-white capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setProfileModalOpen(false)}
                                className="w-full mt-6"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {passwordModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                                Change Password
                            </h2>
                            <button
                                onClick={closePasswordModal}
                                className="p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            {passwordError && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {passwordError}
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    Password changed successfully!
                                </div>
                            )}

                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closePasswordModal}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={savingPassword}
                                    className="flex-1"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
