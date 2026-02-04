'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Plus, Star, Trash2, Save, CheckCircle, Loader2, AlertTriangle, X } from 'lucide-react';
import {
    getTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    TestimonialData
} from '@/lib/firestore';
import { testimonials as defaultTestimonials } from '@/data/testimonials';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function TestimonialsManagementPage() {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        role: '',
        content: '',
        rating: 5,
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        async function loadTestimonials() {
            const data = await getTestimonials();
            if (data.length > 0) {
                setTestimonials(data);
            } else {
                setTestimonials(defaultTestimonials);
            }
            setLoading(false);
        }
        loadTestimonials();
    }, []);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setDeleting(itemToDelete);
        const success = await deleteTestimonial(itemToDelete);
        if (success) {
            setTestimonials(testimonials.filter((t) => t.id !== itemToDelete));
        } else {
            alert('Failed to delete testimonial');
        }
        setDeleting(null);
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleSaveAll = async () => {
        setSaving(true);
        // Update all testimonials in Firebase
        for (const testimonial of testimonials) {
            if (testimonial.id) {
                await updateTestimonial(testimonial.id, {
                    name: testimonial.name,
                    role: testimonial.role,
                    content: testimonial.content,
                    rating: testimonial.rating,
                });
            }
        }
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleAddTestimonial = async () => {
        if (newTestimonial.name && newTestimonial.content) {
            const id = await addTestimonial(newTestimonial);
            if (id) {
                setTestimonials([
                    { id, ...newTestimonial },
                    ...testimonials,
                ]);
                setNewTestimonial({ name: '', role: '', content: '', rating: 5 });
                setShowAddForm(false);
            } else {
                alert('Failed to add testimonial');
            }
        }
    };

    const updateLocalTestimonial = (id: string, field: string, value: string | number) => {
        setTestimonials(
            testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        );
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
                        Manage Testimonials
                    </h1>
                    <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400">
                        Add and manage patient testimonials
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="gap-2 min-h-[48px]"
                    >
                        <Plus className="w-4 h-4" />
                        Add New
                    </Button>
                    <Button onClick={handleSaveAll} className="gap-2 min-h-[48px]" disabled={saving}>
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saved ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
                    </Button>
                </div>
            </div>

            {/* Add New Form */}
            {showAddForm && (
                <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 sm:p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                            Add New Testimonial
                        </h3>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center sm:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={newTestimonial.name}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                            className="px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                            placeholder="Patient Name"
                        />
                        <input
                            type="text"
                            value={newTestimonial.role}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                            className="px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                            placeholder="Role (e.g., Business Owner, Athlete)"
                        />
                    </div>
                    <textarea
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white mb-4 resize-none"
                        placeholder="Testimonial content..."
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-secondary-600 dark:text-secondary-400">Rating:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                                        className="p-1 focus:outline-none min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${star <= newTestimonial.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-secondary-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handleAddTestimonial} className="w-full sm:w-auto min-h-[48px]">
                            Add Testimonial
                        </Button>
                    </div>
                </div>
            )}

            {/* Testimonials List */}
            <div className="space-y-3 sm:space-y-4">
                {testimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-4 sm:p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Avatar and Info */}
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-primary-600 dark:text-primary-400 text-sm sm:text-base">
                                        {testimonial.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={testimonial.name}
                                        onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'name', e.target.value)}
                                        className="w-full font-medium bg-transparent border-b border-transparent hover:border-secondary-300 focus:border-primary-500 text-secondary-900 dark:text-white focus:outline-none py-1"
                                    />
                                    <input
                                        type="text"
                                        value={testimonial.role}
                                        onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'role', e.target.value)}
                                        className="w-full text-sm bg-transparent border-b border-transparent hover:border-secondary-300 focus:border-primary-500 text-secondary-500 focus:outline-none py-1"
                                    />
                                </div>
                            </div>

                            {/* Delete button - visible on mobile */}
                            <button
                                onClick={() => testimonial.id && handleDeleteClick(testimonial.id)}
                                disabled={deleting === testimonial.id}
                                className="p-2.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center self-end sm:self-start"
                            >
                                {deleting === testimonial.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 my-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => testimonial.id && updateLocalTestimonial(testimonial.id, 'rating', star)}
                                    className="p-0.5 focus:outline-none"
                                >
                                    <Star
                                        className={`w-5 h-5 ${star <= testimonial.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-secondary-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <textarea
                            value={testimonial.content}
                            onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'content', e.target.value)}
                            rows={2}
                            className="w-full bg-transparent border border-transparent hover:border-secondary-300 focus:border-primary-500 rounded-lg p-2 text-secondary-600 dark:text-secondary-300 focus:outline-none resize-none text-sm sm:text-base"
                        />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {testimonials.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                        No testimonials yet
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>Add Your First Testimonial</Button>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Testimonial"
                message="This will permanently remove this testimonial. Are you sure you want to proceed?"
                confirmText="Delete"
                isLoading={!!deleting}
                variant="danger"
            />
        </div>
    );
}
