'use client';

import { useState, useEffect } from 'react';
import { Button, Modal } from '@/components/ui';
import { Plus, Star, Trash2, Save, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import {
    getTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    TestimonialData
} from '@/lib/firestore';
import { testimonials as defaultTestimonials } from '@/data/testimonials';

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Manage Testimonials
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Add and manage patient testimonials
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add New
                    </Button>
                    <Button onClick={handleSaveAll} className="gap-2" disabled={saving}>
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
                <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                    <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">
                        Add New Testimonial
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={newTestimonial.name}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                            className="px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="Patient Name"
                        />
                        <input
                            type="text"
                            value={newTestimonial.role}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                            className="px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="Role (e.g., Business Owner, Athlete)"
                        />
                    </div>
                    <textarea
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white mb-4 resize-none"
                        placeholder="Testimonial content..."
                    />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-secondary-600 dark:text-secondary-400">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-5 h-5 ${star <= newTestimonial.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-secondary-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
                    </div>
                </div>
            )}

            {/* Testimonials List */}
            <div className="space-y-4">
                {testimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                        <span className="font-bold text-primary-600 dark:text-primary-400">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={testimonial.name}
                                            onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'name', e.target.value)}
                                            className="font-medium bg-transparent border-b border-transparent hover:border-secondary-300 focus:border-primary-500 text-secondary-900 dark:text-white focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={testimonial.role}
                                            onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'role', e.target.value)}
                                            className="block text-sm bg-transparent border-b border-transparent hover:border-secondary-300 focus:border-primary-500 text-secondary-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => testimonial.id && updateLocalTestimonial(testimonial.id, 'rating', star)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-4 h-4 ${star <= testimonial.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-secondary-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={testimonial.content}
                                    onChange={(e) => testimonial.id && updateLocalTestimonial(testimonial.id, 'content', e.target.value)}
                                    rows={2}
                                    className="w-full bg-transparent border border-transparent hover:border-secondary-300 focus:border-primary-500 rounded-lg p-2 text-secondary-600 dark:text-secondary-300 focus:outline-none resize-none"
                                />
                            </div>
                            <button
                                onClick={() => testimonial.id && handleDeleteClick(testimonial.id)}
                                disabled={deleting === testimonial.id}
                                className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting === testimonial.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Testimonial"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            This will permanently remove this testimonial.
                        </p>
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Are you sure you want to proceed?
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={confirmDelete}
                            disabled={!!deleting}
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
