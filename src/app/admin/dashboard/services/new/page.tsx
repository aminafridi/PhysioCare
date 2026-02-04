'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Save, ArrowLeft, CheckCircle, Loader2, Upload, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { addService } from '@/lib/firestore';

export default function NewServicePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [service, setService] = useState({
        title: '',
        shortDescription: '',
        fullDescription: '',
        whoIsItFor: '',
        benefits: [''],
        imageUrl: '',
    });

    // Upload/Image states
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const result = await addService({
            title: service.title,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            whoIsItFor: service.whoIsItFor,
            benefits: service.benefits.filter(b => b.trim()),
            iconName: 'Activity',
            slug,
            order: 999,
            imageUrl: service.imageUrl,
        });

        setSaving(false);

        if (result) {
            setSaved(true);
            setTimeout(() => {
                router.push('/admin/dashboard/services');
            }, 1500);
        } else {
            alert('Failed to save service. Please try again.');
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

    return (
        <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/admin/dashboard/services">
                        <button className="p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white">
                            Add New Service
                        </h1>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                            Create a new physiotherapy service
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    className="gap-2 w-full sm:w-auto min-h-[48px]"
                    disabled={!service.title || saving}
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Service'}
                </Button>
            </div>

            {/* Image - Show first on mobile */}
            <div className="lg:hidden bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
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
                        className="w-full gap-2 min-h-[48px]"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 sm:p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
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
                                    className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
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
                                    className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
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
                                    className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
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
                                    className="w-full px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                                    placeholder="Describe the target patients for this service..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 sm:p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                            Benefits
                        </h2>
                        <div className="space-y-3 mb-4">
                            {service.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-secondary-400 text-sm w-6 flex-shrink-0">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => updateBenefit(index, e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white min-h-[48px]"
                                        placeholder="Enter a benefit..."
                                    />
                                    {service.benefits.length > 1 && (
                                        <button
                                            onClick={() => removeBenefit(index)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addBenefit} className="min-h-[48px]">
                            Add Benefit
                        </Button>
                    </div>
                </div>

                {/* Sidebar / Image Upload - Hidden on mobile */}
                <div className="hidden lg:block space-y-6">
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
