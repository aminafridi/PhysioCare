'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Modal } from '@/components/ui';
import { Plus, Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { getServices, deleteService, updateService, ServiceData } from '@/lib/firestore';
import { services as defaultServices } from '@/data/services';

export default function ServicesManagementPage() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function loadServices() {
            const data = await getServices();
            if (data.length > 0) {
                setServices(data);
            } else {
                // Fall back to default services if no Firebase data
                setServices(defaultServices.map((s, i) => ({
                    ...s,
                    order: i,
                    iconName: s.icon.displayName || 'Activity',
                    slug: s.id,
                })));
            }
            setLoading(false);
        }
        loadServices();
    }, []);

    const handleImportDefaults = async () => {
        if (!confirm('This will add all default services to your database. Continue?')) return;
        setImporting(true);
        try {
            // Import all defaults
            await Promise.all(defaultServices.map(async (s, i) => {
                const serviceData: Partial<ServiceData> = {
                    title: s.title,
                    shortDescription: s.shortDescription,
                    fullDescription: s.fullDescription,
                    whoIsItFor: s.whoIsItFor,
                    benefits: s.benefits,
                    imageUrl: s.imageUrl,
                    iconName: s.icon.displayName || 'Activity',
                    slug: s.id,
                    order: i
                };
                return updateService(s.id, serviceData);
            }));

            // Reload
            const data = await getServices();
            setServices(data);
            alert('Default services imported successfully!');
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
        const success = await deleteService(itemToDelete);
        if (success) {
            setServices(services.filter((s) => s.id !== itemToDelete));
        } else {
            alert('Failed to delete service');
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Manage Services
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Add, edit, or remove your physiotherapy services
                    </p>
                </div>
                <div className="flex gap-3">
                    {services.length === 0 || services.some(s => defaultServices.some(d => d.id === s.id)) && (
                        <Button onClick={handleImportDefaults} variant="outline" disabled={importing}>
                            {importing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Import Defaults to DB
                        </Button>
                    )}
                    <Link href="/admin/dashboard/services/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Service
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Services List */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="flex items-center gap-4 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
                        >
                            <button className="text-secondary-400 cursor-grab hover:text-secondary-600">
                                <GripVertical className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                {/* Dynamic Icon attempt or fallback */}
                                <span className="text-xl">💆</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-secondary-900 dark:text-white">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate">
                                    {service.shortDescription}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/dashboard/services/${service.id}`}>
                                    <button className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => service.id && handleDeleteClick(service.id)}
                                    disabled={deleting === service.id}
                                    className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {deleting === service.id ? (
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

            {services.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                        No services added yet
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={handleImportDefaults} variant="outline" disabled={importing}>
                            Import Defaults
                        </Button>
                        <Link href="/admin/dashboard/services/new">
                            <Button>Add Your First Service</Button>
                        </Link>
                    </div>
                </div>
            )}

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Service"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Are you sure you want to delete this service? This action cannot be undone.
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
                            Delete Service
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
