'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser, AdminUserData } from '@/lib/firestore';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button } from '@/components/ui';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Users, Plus, Pencil, Trash2, Loader2, AlertCircle, X, Eye, EyeOff, ChevronDown } from 'lucide-react';

const ALL_PAGES = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services' },
    { id: 'blog', label: 'Blog Posts' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'settings', label: 'Settings' },
    { id: 'users', label: 'Users Management' },
];

const roleColors = {
    superadmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    editor: 'bg-green-100 text-green-800',
};

interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: 'superadmin' | 'admin' | 'editor';
    allowedPages: string[];
}

const defaultFormData: UserFormData = {
    name: '',
    email: '',
    password: '',
    role: 'editor',
    allowedPages: ['dashboard'],
};

export default function UsersPage() {
    const { user: currentUser } = useAdminAuth();
    const [users, setUsers] = useState<AdminUserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
    const [formData, setFormData] = useState<UserFormData>(defaultFormData);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deletingUserName, setDeletingUserName] = useState<string>('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data);
        setLoading(false);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData(defaultFormData);
        setShowPassword(false);
        setError(null);
        setModalOpen(true);
    };

    const openEditModal = (user: AdminUserData) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            allowedPages: user.allowedPages,
        });
        setShowPassword(false);
        setError(null);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.email) {
            setError('Name and email are required');
            return;
        }

        if (!editingUser && !formData.password) {
            setError('Password is required for new users');
            return;
        }

        if (formData.allowedPages.length === 0) {
            setError('At least one page must be assigned');
            return;
        }

        setSaving(true);

        try {
            if (editingUser) {
                const updateData: Partial<AdminUserData> = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    allowedPages: formData.allowedPages,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await updateAdminUser(editingUser.id!, updateData);
            } else {
                await addAdminUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    allowedPages: formData.allowedPages,
                });
            }
            setModalOpen(false);
            loadUsers();
        } catch (err) {
            setError('Failed to save user');
        }

        setSaving(false);
    };

    const openDeleteDialog = (user: AdminUserData) => {
        setDeletingUserId(user.id!);
        setDeletingUserName(user.name);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingUserId) return;
        setDeleting(true);
        await deleteAdminUser(deletingUserId);
        loadUsers();
        setDeleting(false);
        setDeleteDialogOpen(false);
        setDeletingUserId(null);
        setDeletingUserName('');
    };

    const togglePage = (pageId: string) => {
        setFormData(prev => ({
            ...prev,
            allowedPages: prev.allowedPages.includes(pageId)
                ? prev.allowedPages.filter(p => p !== pageId)
                : [...prev.allowedPages, pageId],
        }));
    };

    const selectAllPages = () => {
        setFormData(prev => ({
            ...prev,
            allowedPages: ALL_PAGES.map(p => p.id),
        }));
    };

    // Check if current user can access this page
    if (currentUser && !currentUser.allowedPages.includes('users') && currentUser.role !== 'superadmin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center px-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        You don&apos;t have permission to view this page.
                    </p>
                </div>
            </div>
        );
    }

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
                        Users Management
                    </h1>
                    <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                        Manage admin users and their permissions
                    </p>
                </div>
                <Button onClick={openCreateModal} className="gap-2 w-full sm:w-auto min-h-[44px]">
                    <Plus className="w-4 h-4" />
                    Add User
                </Button>
            </div>

            {/* Users List */}
            {users.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-secondary-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-secondary-900 dark:text-white mb-2">
                        No users yet
                    </h3>
                    <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 mb-4 px-4">
                        Create your first admin user to get started.
                    </p>
                    <Button onClick={openCreateModal} variant="outline" className="gap-2 min-h-[44px]">
                        <Plus className="w-4 h-4" />
                        Add User
                    </Button>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                            User
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                            Role
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                            Allowed Pages
                                        </th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-secondary-900 dark:text-white truncate">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-secondary-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.allowedPages.slice(0, 3).map(page => (
                                                        <span key={page} className="px-2 py-0.5 bg-secondary-100 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-200 text-xs rounded capitalize">
                                                            {page}
                                                        </span>
                                                    ))}
                                                    {user.allowedPages.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-secondary-100 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-200 text-xs rounded">
                                                            +{user.allowedPages.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2.5 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(user)}
                                                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-3">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-4"
                            >
                                {/* Header row */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-secondary-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-secondary-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${roleColors[user.role]}`}>
                                        {user.role}
                                    </span>
                                </div>

                                {/* Allowed Pages */}
                                <div className="mb-4">
                                    <p className="text-xs text-secondary-500 mb-2">Allowed Pages</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.allowedPages.slice(0, 4).map(page => (
                                            <span key={page} className="px-2 py-1 bg-secondary-100 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-200 text-xs rounded capitalize">
                                                {page}
                                            </span>
                                        ))}
                                        {user.allowedPages.length > 4 && (
                                            <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-200 text-xs rounded">
                                                +{user.allowedPages.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                    <Button
                                        onClick={() => openEditModal(user)}
                                        variant="outline"
                                        className="flex-1 gap-2 min-h-[44px]"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </Button>
                                    <button
                                        onClick={() => openDeleteDialog(user)}
                                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-red-200 dark:border-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Create/Edit Modal - Mobile Optimized */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white dark:bg-secondary-800 w-full sm:rounded-2xl sm:max-w-lg sm:mx-4 max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary-200 dark:border-secondary-700 flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white">
                                {editingUser ? 'Edit User' : 'Create User'}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
                                {error && (
                                    <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[48px]"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[48px]"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                        Password {editingUser && <span className="text-secondary-500 text-xs">(leave blank to keep current)</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full px-4 py-3 pr-12 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[48px]"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary-400 hover:text-secondary-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserFormData['role'] }))}
                                            className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none min-h-[48px]"
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="admin">Admin</option>
                                            <option value="superadmin">Super Admin</option>
                                        </select>
                                        <ChevronDown className="w-5 h-5 text-secondary-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Allowed Pages */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-secondary-900 dark:text-white">
                                            Allowed Pages
                                        </label>
                                        <button
                                            type="button"
                                            onClick={selectAllPages}
                                            className="text-xs text-primary-600 hover:text-primary-700 p-2 -m-2 min-h-[44px] flex items-center"
                                        >
                                            Select All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {ALL_PAGES.map(page => (
                                            <label
                                                key={page.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${formData.allowedPages.includes(page.id)
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                    : 'border-secondary-200 dark:border-secondary-600 hover:border-secondary-300'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.allowedPages.includes(page.id)}
                                                    onChange={() => togglePage(page.id)}
                                                    className="w-5 h-5 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                                                    {page.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Actions */}
                            <div className="flex items-center gap-3 p-4 sm:p-6 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 flex-shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 min-h-[48px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={saving}
                                    className="flex-1 min-h-[48px]"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingUserId(null);
                    setDeletingUserName('');
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${deletingUserName}"? This action cannot be undone and the user will no longer be able to access the admin panel.`}
                confirmText="Delete"
                isLoading={deleting}
                variant="danger"
            />
        </div>
    );
}
