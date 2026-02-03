'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { getSettings, updateSettings, SettingsData } from '@/lib/firestore';

const defaultSettings: SettingsData = {
    clinicName: 'PhysioCare',
    tagline: 'Professional Physiotherapy Services',
    phone: '(123) 456-7890',
    email: 'info@physiocare.com',
    address: '123 Health Street, Medical District, City, State 12345',
    workingHours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 2:00 PM',
        sunday: 'Closed',
    },
    socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
    },
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            const data = await getSettings();
            if (data) {
                setSettings(data);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const success = await updateSettings(settings);
        setSaving(false);
        if (success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            alert('Failed to save settings. Please try again.');
        }
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
                        Settings
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Configure your clinic&apos;s general settings
                    </p>
                </div>
                <div className="flex">
                    <Button onClick={handleSave} className="gap-2 w-full sm:w-auto" disabled={saving}>
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

            {/* General Settings */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    General Information
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Clinic Name
                            </label>
                            <input
                                type="text"
                                value={settings.clinicName}
                                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Contact Information
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Address
                        </label>
                        <textarea
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Working Hours
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Monday - Friday
                            </label>
                            <input
                                type="text"
                                value={settings.workingHours.weekdays}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        workingHours: { ...settings.workingHours, weekdays: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Saturday
                            </label>
                            <input
                                type="text"
                                value={settings.workingHours.saturday}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        workingHours: { ...settings.workingHours, saturday: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                Sunday
                            </label>
                            <input
                                type="text"
                                value={settings.workingHours.sunday}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        workingHours: { ...settings.workingHours, sunday: e.target.value },
                                    })
                                }
                                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Social Media Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Facebook
                        </label>
                        <input
                            type="url"
                            value={settings.socialMedia.facebook}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Instagram
                        </label>
                        <input
                            type="url"
                            value={settings.socialMedia.instagram}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            Twitter / X
                        </label>
                        <input
                            type="url"
                            value={settings.socialMedia.twitter}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="https://twitter.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            value={settings.socialMedia.linkedin}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, linkedin: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                            placeholder="https://linkedin.com/..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
