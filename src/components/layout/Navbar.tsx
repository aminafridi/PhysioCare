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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg sm:text-xl">P</span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white">
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
                                    'text-sm font-medium transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 py-2',
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
                            className="flex items-center text-sm text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            {settings.phone}
                        </a>
                        <Link href="/book">
                            <Button size="sm" className="min-h-[40px]">Book Appointment</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="lg:hidden flex items-center gap-1">
                        <ThemeToggle />
                        <button
                            className="p-2.5 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Full screen slide-down */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 bg-black/20 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-secondary-800 border-t border-secondary-100 dark:border-secondary-700 shadow-xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
                        >
                            <div className="container-custom py-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'block py-3 px-3 text-base font-medium transition-colors duration-200 rounded-lg min-h-[48px] flex items-center',
                                            pathname === link.href
                                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                                : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-secondary-100 dark:border-secondary-700 space-y-3">
                                    <a
                                        href={phoneLink}
                                        className="flex items-center py-3 px-3 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 rounded-lg min-h-[48px]"
                                    >
                                        <Phone className="w-5 h-5 mr-3" />
                                        <span className="font-medium">{settings.phone}</span>
                                    </a>
                                    <Link href="/book" className="block">
                                        <Button className="w-full min-h-[48px]">Book Appointment</Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
