'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

export function Hero() {
    return (
        <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-48 lg:pb-24 gradient-hero overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 right-4 sm:top-20 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-primary-200 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-4 sm:bottom-20 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary-100 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center md:text-left"
                    >
                        <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                            Professional Physiotherapy Care
                        </span>

                        <h1 className="text-secondary-900 mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                            Restore Your{' '}
                            <span className="text-gradient">Movement</span>
                        </h1>

                        <p className="text-base sm:text-lg text-secondary-600 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
                            Experience world-class physiotherapy tailored to your recovery and performance goals.
                            We blend advanced science with compassionate care.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center md:justify-start">
                            <Link href="/book" className="w-full sm:w-auto">
                                <Button size="lg" className="group w-full sm:w-auto min-h-[48px]">
                                    Book an Appointment
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">
                                    View Services
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
                            {[
                                'Certified Experts',
                                'Modern Equipment',
                                'Patient-Centered',
                            ].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
                                    <span className="text-secondary-600 text-xs sm:text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image/Illustration - Now visible on md+ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden md:block"
                    >
                        <div className="relative aspect-square max-w-sm lg:max-w-lg mx-auto">
                            {/* Main Circle */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-10" />

                            {/* Inner content - Abstract medical illustration */}
                            <div className="absolute inset-6 lg:inset-8 rounded-full bg-white shadow-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 lg:w-12 lg:h-12 text-primary-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-base lg:text-xl text-secondary-900 mb-1 lg:mb-2">Your Health</h3>
                                    <p className="text-secondary-500 text-xs lg:text-sm">Our Priority</p>
                                </div>
                            </div>

                            {/* Floating Stats - Responsive positioning */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="absolute -left-2 lg:-left-4 top-1/4 bg-white rounded-xl p-3 lg:p-4 shadow-lg"
                            >
                                <p className="text-2xl lg:text-3xl font-bold text-primary-600">10+</p>
                                <p className="text-xs lg:text-sm text-secondary-500">Years Experience</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="absolute -right-2 lg:-right-4 top-1/2 bg-white rounded-xl p-3 lg:p-4 shadow-lg"
                            >
                                <p className="text-2xl lg:text-3xl font-bold text-primary-600">5000+</p>
                                <p className="text-xs lg:text-sm text-secondary-500">Happy Patients</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="absolute left-1/4 -bottom-2 lg:-bottom-4 bg-white rounded-xl p-3 lg:p-4 shadow-lg"
                            >
                                <p className="text-2xl lg:text-3xl font-bold text-primary-600">98%</p>
                                <p className="text-xs lg:text-sm text-secondary-500">Success Rate</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Mobile Stats Row - Visible only on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="md:hidden grid grid-cols-3 gap-3"
                    >
                        {[
                            { value: '10+', label: 'Years' },
                            { value: '5000+', label: 'Patients' },
                            { value: '98%', label: 'Success' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-xl p-3 shadow-lg text-center">
                                <p className="text-xl font-bold text-primary-600">{stat.value}</p>
                                <p className="text-xs text-secondary-500">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
