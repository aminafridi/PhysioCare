'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

export function Hero() {
    return (
        <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 gradient-hero overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-100 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Professional Physiotherapy Care
                        </span>

                        <h1 className="text-secondary-900 mb-6">
                            Restore Your{' '}
                            <span className="text-gradient">Movement</span>
                        </h1>

                        <p className="text-lg text-secondary-600 mb-8 max-w-lg">
                            Experience world-class physiotherapy tailored to your recovery and performance goals.
                            We blend advanced science with compassionate care.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link href="/book">
                                <Button size="lg" className="group">
                                    Book an Appointment
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button variant="outline" size="lg">
                                    View Services
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {[
                                'Certified Experts',
                                'Modern Equipment',
                                'Patient-Centered',
                            ].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                    <span className="text-secondary-600 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square max-w-lg mx-auto">
                            {/* Main Circle */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-10" />

                            {/* Inner content - Abstract medical illustration */}
                            <div className="absolute inset-8 rounded-full bg-white shadow-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-primary-600"
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
                                    <h3 className="text-xl text-secondary-900 mb-2">Your Health</h3>
                                    <p className="text-secondary-500 text-sm">Our Priority</p>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="absolute -left-4 top-1/4 bg-white rounded-xl p-4 shadow-lg"
                            >
                                <p className="text-3xl font-bold text-primary-600">10+</p>
                                <p className="text-sm text-secondary-500">Years Experience</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="absolute -right-4 top-1/2 bg-white rounded-xl p-4 shadow-lg"
                            >
                                <p className="text-3xl font-bold text-primary-600">5000+</p>
                                <p className="text-sm text-secondary-500">Happy Patients</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="absolute left-1/4 -bottom-4 bg-white rounded-xl p-4 shadow-lg"
                            >
                                <p className="text-3xl font-bold text-primary-600">98%</p>
                                <p className="text-sm text-secondary-500">Success Rate</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
