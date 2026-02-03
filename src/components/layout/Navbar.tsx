'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { getSettings, SettingsData } from '@/lib/firestore';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/conditions', label: 'Conditions' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
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

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        async function loadSettings() {
            const data = await getSettings();
            if (data) {
                setSettings(data);
            }
        }
        loadSettings();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const phoneLink = `tel:${settings.phone.replace(/[^0-9]/g, '')}`;

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-md'
                    : 'bg-transparent'
            )}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-secondary-900 dark:text-white">
                            Physio<span className="text-primary-600 dark:text-primary-400">Care</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400',
                                    pathname === link.href
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-secondary-600 dark:text-secondary-300'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <ThemeToggle />
                        <a
                            href={phoneLink}
                            className="flex items-center text-sm text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            {settings.phone}
                        </a>
                        <Link href="/book">
                            <Button size="sm">Book Appointment</Button>
                        </Link>

                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <button
                            className="p-2 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-white dark:bg-secondary-800 border-t border-secondary-100 dark:border-secondary-700"
                    >
                        <div className="container-custom py-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'block py-2 text-base font-medium transition-colors duration-200',
                                        pathname === link.href
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-secondary-100 dark:border-secondary-700 space-y-3">
                                <a
                                    href={phoneLink}
                                    className="flex items-center text-secondary-600 dark:text-secondary-300"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    {settings.phone}
                                </a>
                                <Link href="/book" className="block">
                                    <Button className="w-full">Book Appointment</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
