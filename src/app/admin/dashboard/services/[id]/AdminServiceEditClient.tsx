'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, CheckCircle, Loader2, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getService, updateService, ServiceData } from '@/lib/firestore';
import { services as defaultServices } from '@/data/services';
import Image from 'next/image';

export default function EditServiceClient() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [service, setService] = useState<ServiceData>({
        title: '',
        shortDescription: '',
        fullDescription: '',
        whoIsItFor: '',
        benefits: [''],
        imageUrl: '',
        iconName: 'Activity',
        slug: '',
        order: 0,
    });

    // Upload/Image states
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadService() {
            if (!id) return;

            const data = await getService(id);
            if (data) {
                setService(data);
            } else {
                // Check if it's a default service
                const defaultService = defaultServices.find(s => s.id === id);
                if (defaultService) {
                    setService({
                        ...defaultService,
                        order: 0,
                        iconName: defaultService.icon.displayName || 'Activity',
                        slug: defaultService.id
                    });
                } else {
                    alert('Service not found');
                    // router.push('/admin/dashboard/services');
                }
            }
            setLoading(false);
        }
        loadService();
    }, [id, router]);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert image to Base64'));
                }
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError('');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (MAX 700KB for Firestore storage)
        if (file.size > 700 * 1024) {
            setUploadError('Image is too large for database storage. Please use an image under 700KB.');
            return;
        }

        try {
            // Convert to Base64 immediatley
            const base64String = await convertToBase64(file);
            setService({ ...service, imageUrl: base64String });
        } catch (error) {
            console.error('Error converting image:', error);
            setUploadError('Failed to process image. Please try another one.');
        }
    };

    const handleSave = async () => {
        if (!service.title) return;

        setSaving(true);
        // Only update fields that should be editable, assume ID exists
        const result = await updateService(id, {
            title: service.title,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            whoIsItFor: service.whoIsItFor,
            benefits: service.benefits.filter(b => b.trim()),
            imageUrl: service.imageUrl,
        });

        setSaving(false);

        if (result) {
            setSaved(true);
            setTimeout(() => {
                router.push('/admin/dashboard/services');
            }, 1500);
        } else {
            alert('Failed to update service. Please try again.');
        }
    };

    const addBenefit = () => {
        setService({
            ...service,
            benefits: [...service.benefits, ''],
        });
    };

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...service.benefits];
        newBenefits[index] = value;
        setService({ ...service, benefits: newBenefits });
    };

    const removeBenefit = (index: number) => {
        setService({
            ...service,
            benefits: service.benefits.filter((_, i) => i !== index),
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/services">
                        <button className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            Edit Service
                        </h1>
                        <p className="text-secondary-600 dark:text-secondary-400">
                            Update service details and image
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} className="gap-2" disabled={!service.title || saving}>
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : saved ? 'Updated!' : 'Update Service'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Service Title *
                                </label>
                                <input
                                    type="text"
                                    value={service.title}
                                    onChange={(e) => setService({ ...service, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                                    placeholder="e.g., Sports Injury Rehabilitation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Short Description
                                </label>
                                <input
                                    type="text"
                                    value={service.shortDescription}
                                    onChange={(e) => setService({ ...service, shortDescription: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                                    placeholder="A brief one-line description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Full Description
                                </label>
                                <textarea
                                    value={service.fullDescription}
                                    onChange={(e) => setService({ ...service, fullDescription: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                                    placeholder="Detailed description of the service..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Who Is It For?
                                </label>
                                <textarea
                                    value={service.whoIsItFor}
                                    onChange={(e) => setService({ ...service, whoIsItFor: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                                    placeholder="Describe the target patients for this service..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                            Benefits
                        </h2>
                        <div className="space-y-3 mb-4">
                            {service.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-secondary-400 text-sm w-6">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => updateBenefit(index, e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                                        placeholder="Enter a benefit..."
                                    />
                                    {service.benefits.length > 1 && (
                                        <button
                                            onClick={() => removeBenefit(index)}
                                            className="px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addBenefit}>
                            Add Benefit
                        </Button>
                    </div>
                </div>

                {/* Sidebar / Image Upload */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                            Service Image
                        </h2>

                        <div className="space-y-4">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center border-2 border-secondary-200 dark:border-secondary-600 border-dashed">
                                {service.imageUrl ? (
                                    <img
                                        src={service.imageUrl}
                                        alt="Service preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-secondary-400 p-4 text-center">
                                        <ImageIcon className="w-12 h-12 mb-2" />
                                        <span className="text-sm">No image selected</span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                disabled={saving}
                                className="w-full gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {service.imageUrl ? 'Change Image' : 'Select Image'}
                            </Button>

                            {uploadError && (
                                <div className="flex items-start gap-2 text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>{uploadError}</p>
                                </div>
                            )}

                            <p className="text-xs text-secondary-500 text-center">
                                Recommended: 800x600px, Max 700KB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
