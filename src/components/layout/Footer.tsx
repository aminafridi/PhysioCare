'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Clock
} from 'lucide-react';
import { getSettings, SettingsData } from '@/lib/firestore';

const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/conditions', label: 'Conditions' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

const serviceLinks = [
    { href: '/services#sports-physiotherapy', label: 'Sports Physiotherapy' },
    { href: '/services#post-surgery-rehab', label: 'Post-Surgery Rehab' },
    { href: '/services#back-neck-pain', label: 'Back & Neck Pain' },
    { href: '/services#joint-therapy', label: 'Joint Therapy' },
    { href: '/services#posture-correction', label: 'Posture Correction' },
];

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

export function Footer() {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        async function loadSettings() {
            const data = await getSettings();
            if (data) {
                setSettings(data);
            }
        }
        loadSettings();
    }, []);

    const socialLinks = [
        { href: settings.socialMedia.facebook || '#', icon: Facebook, label: 'Facebook' },
        { href: settings.socialMedia.twitter || '#', icon: Twitter, label: 'Twitter' },
        { href: settings.socialMedia.instagram || '#', icon: Instagram, label: 'Instagram' },
        { href: settings.socialMedia.linkedin || '#', icon: Linkedin, label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-secondary-900 text-secondary-300">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                {settings.clinicName.split('Care')[0]}<span className="text-primary-400">Care</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            {settings.tagline}. We&apos;re committed to helping you restore your movement and relieve your pain.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Our Services</h4>
                        <ul className="space-y-3">
                            {serviceLinks.map((service) => (
                                <li key={service.href}>
                                    <Link
                                        href={service.href}
                                        className="text-sm hover:text-primary-400 transition-colors duration-200"
                                    >
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">
                                    {settings.address}
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`} className="text-sm hover:text-primary-400 transition-colors">
                                    {settings.phone}
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href={`mailto:${settings.email}`} className="text-sm hover:text-primary-400 transition-colors">
                                    {settings.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Newsletter</h4>
                        <p className="text-sm mb-4">Subscribe to get the latest health updates and tips.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-secondary-800 border border-secondary-700 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-secondary-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-secondary-400">
                            © {currentYear} {settings.clinicName}. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
