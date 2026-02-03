'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, Heart, User } from 'lucide-react';
import { SectionWrapper } from '@/components/ui';
import { getAboutPage, AboutPageData } from '@/lib/firestore';

const highlights = [
    {
        icon: Award,
        text: 'Certified & Experienced',
    },
    {
        icon: User,
        text: 'Personalized Treatment Plans',
    },
    {
        icon: Heart,
        text: 'Patient-Centered Care',
    },
];

export function AboutPreview() {
    const [data, setData] = useState<AboutPageData | null>(null);

    useEffect(() => {
        async function loadData() {
            const aboutData = await getAboutPage();
            if (aboutData) {
                setData(aboutData);
            }
        }
        loadData();
    }, []);

    return (
        <SectionWrapper background="white" id="about-preview" className="py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
                {/* Image Side - Compact Clinic Focus */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[400px] mx-auto lg:mr-auto"
                >
                    {/* Blue Card Container - Premium Gradient (More Compact) */}
                    <div className="aspect-square bg-secondary-100 dark:bg-gradient-to-br dark:from-secondary-900 dark:to-secondary-800 rounded-[2.5rem] relative flex items-center justify-center p-8 shadow-xl overflow-visible transition-colors duration-300 ring-1 ring-secondary-900/5 dark:ring-white/10 group">

                        {/* Central Icon Visual */}
                        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white dark:bg-white/5 border-[6px] border-white dark:border-white/5 shadow-2xl relative z-10 shrink-0 flex items-center justify-center ring-1 ring-black/5 group-hover:scale-105 transition-transform duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full"></div>
                                <Activity className="w-24 h-24 sm:w-28 sm:h-28 text-primary-600 dark:text-primary-400 relative z-10 drop-shadow-md" />
                            </div>
                        </div>

                        {/* Experience Badge - Tighter Position */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-5 -right-5 md:bottom-6 md:-right-6 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-md p-4 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center gap-3 z-20 min-w-[180px] border border-white/50 dark:border-white/10"
                        >
                            <div className="bg-primary-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                                {data?.experience.replace('+', '') || '10'}+
                            </div>
                            <div className="flex flex-col">
                                <span className="text-secondary-900 dark:text-white font-bold text-base leading-none mb-0.5">Years of</span>
                                <span className="text-primary-600 dark:text-primary-400 font-medium text-[10px] uppercase tracking-wider">Excellence</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-[2px] bg-primary-600"></div>
                        <span className="text-primary-600 font-semibold text-xs uppercase tracking-wider">
                            About Us
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 leading-[1.2]">
                        Dedicated to Your <span className="text-primary-600 inline-block relative">
                            Health
                            <svg className="absolute w-full h-2 -bottom-1 left-0 text-primary-200 dark:text-primary-900/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>

                    <p className="text-secondary-600 dark:text-secondary-300 text-base md:text-lg mb-4 leading-relaxed">
                        At PhysioCare, we believe in a holistic approach to physiotherapy. Our team of
                        certified professionals combines years of experience with the latest evidence-based
                        techniques.
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-300 mb-6 leading-relaxed text-sm md:text-base">
                        Whether you&apos;re recovering from an injury or looking to
                        improve your physical performance, we&apos;re here to help you achieve your goals.
                    </p>

                    <div className="space-y-3">
                        {highlights.map((item, index) => (
                            <motion.div
                                key={item.text}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                                viewport={{ once: true }}
                                className="flex items-center space-x-3 group p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors duration-300"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ring-1 ring-primary-100 dark:ring-primary-800">
                                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <span className="text-secondary-800 dark:text-secondary-200 font-semibold text-base">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
