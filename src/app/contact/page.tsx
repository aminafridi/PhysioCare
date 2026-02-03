'use client';

import { useEffect, useState } from 'react';
import { SectionWrapper, Card } from '@/components/ui';
import { ContactForm } from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { getSettings, SettingsData } from '@/lib/firestore';

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

export default function ContactPage() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: settings.address.split(', '),
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: [settings.phone],
            link: `tel:${settings.phone.replace(/[^0-9]/g, '')}`,
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: [settings.email],
            link: `mailto:${settings.email}`,
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: [
                `Mon-Fri: ${settings.workingHours.weekdays}`,
                `Sat: ${settings.workingHours.saturday}`,
                `Sun: ${settings.workingHours.sunday}`,
            ],
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Contact Us
                        </span>
                        <h1 className="mb-6">
                            Get In <span className="text-gradient">Touch</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Have questions or ready to start your recovery journey?
                            We&apos;re here to help. Reach out to us today.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content - Contact Card */}
            <SectionWrapper background="gray">
                <div className="container-custom">
                    <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 overflow-hidden">
                        <div className="grid lg:grid-cols-12">

                            {/* Left Column: Contact Form */}
                            <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-secondary-100">
                                <h2 className="text-3xl font-bold text-secondary-900 mb-2">Send us a message</h2>
                                <p className="text-secondary-500 mb-8">
                                    Fill out the form below and our team will get back to you within 24 hours.
                                </p>
                                <ContactForm />
                            </div>

                            {/* Right Column: Contact Info Sidebar */}
                            <div className="lg:col-span-5 bg-secondary-50 p-8 md:p-12 flex flex-col justify-center">
                                <div className="space-y-10">
                                    {/* Office Address */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary-900 mb-1">Office Address</h3>
                                            <p className="text-secondary-600 leading-relaxed text-sm">
                                                {settings.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email Us */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary-900 mb-1">Email Us</h3>
                                            <p className="text-secondary-600 text-sm mb-1">
                                                For general inquiries and booking.
                                            </p>
                                            <a href={`mailto:${settings.email}`} className="text-primary-600 font-medium hover:underline">
                                                {settings.email}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Call Us */}
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary-900 mb-1">Call Us</h3>
                                            <p className="text-secondary-600 text-sm mb-1">
                                                {settings.workingHours.weekdays}
                                            </p>
                                            <a href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`} className="text-2xl font-bold text-primary-600 hover:text-primary-700">
                                                {settings.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-10 border-secondary-200" />

                                {/* Connect with us */}
                                <div>
                                    <h4 className="font-bold text-secondary-900 mb-4">Connect with us</h4>
                                    <div className="flex gap-3">
                                        {/* Placeholder Social Icons */}
                                        <div className="w-10 h-10 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-all cursor-pointer">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 transition-all cursor-pointer">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}
