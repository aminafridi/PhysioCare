'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { Save, Plus, CheckCircle, Loader2, Upload, User, AlertCircle } from 'lucide-react';
import { getAboutPage, updateAboutPage, AboutPageData } from '@/lib/firestore';
import Image from 'next/image';

const defaultData: AboutPageData = {
    name: 'Dr. Sarah Johnson',
    title: 'Lead Physiotherapist',
    experience: '15+',
    bio: 'With over 15 years of experience in physiotherapy, I am passionate about helping patients recover from injuries, manage chronic conditions, and improve their overall quality of life. My approach combines evidence-based treatments with personalized care to ensure the best outcomes for each patient.',
    qualifications: [
        'Doctor of Physical Therapy (DPT)',
        'Board Certified Orthopedic Clinical Specialist',
        'Certified Sports Clinical Specialist',
        'Manual Therapy Certification',
        'Dry Needling Certification',
    ],
    mission: 'To provide exceptional, patient-centered physiotherapy care that empowers individuals to achieve their optimal physical health and quality of life.',
    vision: 'To be the leading physiotherapy practice known for innovative treatments, compassionate care, and outstanding patient outcomes.',
    imageUrl: '',
};

export default function AboutEditorPage() {
    const [data, setData] = useState<AboutPageData>(defaultData);
    const [newQualification, setNewQualification] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // Upload/Image states
    const [uploadError, setUploadError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadData() {
            const aboutData = await getAboutPage();
            if (aboutData) {
                setData(aboutData);
            }
            setLoading(false);
        }
        loadData();
    }, []);

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
            setData({ ...data, imageUrl: base64String });
        } catch (error) {
            console.error('Error converting image:', error);
            setUploadError('Failed to process image. Please try another one.');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const success = await updateAboutPage(data);

            if (success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Failed to save data. Please check your connection.');
            }
        } catch (e) {
            console.error(e);
            alert('An unexpected error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    const addQualification = () => {
        if (newQualification.trim()) {
            setData({
                ...data,
                qualifications: [...data.qualifications, newQualification.trim()],
            });
            setNewQualification('');
        }
    };

    const removeQualification = (index: number) => {
        setData({
            ...data,
            qualifications: data.qualifications.filter((_, i) => i !== index),
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Edit About Page
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Update your professional information and bio
                    </p>
                </div>
                <div className="flex">
                    <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" disabled={saving || !!uploadError}>
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
            </div>

            {/* Profile Photo */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Profile Photo
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center border-2 border-secondary-200 dark:border-secondary-600 shadow-inner">
                        {data.imageUrl ? (
                            <Image
                                src={data.imageUrl}
                                alt="Doctor profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-16 h-16 text-secondary-400" />
                        )}
                    </div>
                    <div className="flex-1 max-w-sm w-full text-center sm:text-left">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="secondary"
                            disabled={saving}
                            className="gap-2 mb-2 w-full sm:w-auto"
                        >
                            <Upload className="w-4 h-4" />
                            {data.imageUrl ? 'Change Photo' : 'Select Photo'}
                        </Button>

                        {uploadError && (
                            <div className="flex items-start gap-2 text-sm text-red-500 mb-2 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded text-left">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>{uploadError}</p>
                            </div>
                        )}

                        <p className="text-sm text-secondary-500">
                            <strong>Note:</strong> Used Base64 storage. Please keep image size <strong>under 700KB</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Professional Title
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Years of Experience
                        </label>
                        <input
                            type="text"
                            value={data.experience}
                            onChange={(e) => setData({ ...data, experience: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Biography */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Biography
                </h2>
                <textarea
                    value={data.bio}
                    onChange={(e) => setData({ ...data, bio: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                    placeholder="Write your professional biography..."
                />
            </div>

            {/* Qualifications */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Qualifications & Certifications
                </h2>
                <div className="space-y-3 mb-4">
                    {data.qualifications.map((qual, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
                        >
                            <span className="text-secondary-900 dark:text-white">{qual}</span>
                            <button
                                onClick={() => removeQualification(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                        placeholder="Add new qualification..."
                    />
                    <Button onClick={addQualification} variant="secondary">
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Mission & Vision
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Mission Statement
                        </label>
                        <textarea
                            value={data.mission}
                            onChange={(e) => setData({ ...data, mission: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Vision Statement
                        </label>
                        <textarea
                            value={data.vision}
                            onChange={(e) => setData({ ...data, vision: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
