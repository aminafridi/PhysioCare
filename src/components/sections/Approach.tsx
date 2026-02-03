'use client';

import { motion } from 'framer-motion';
import { Stethoscope, ClipboardList, Zap } from 'lucide-react';
import { SectionWrapper } from '@/components/ui';

const approaches = [
    {
        icon: ClipboardList,
        title: 'Comprehensive Assessment',
        description: 'We start with a thorough biomechanical evaluation to identify the root cause of your pain, not just the symptoms.',
    },
    {
        icon: Stethoscope,
        title: 'Tailored Recovery Plan',
        description: 'Based on your unique goals, we design a personalized roadmap featuring manual therapy and targeted exercises.',
    },
    {
        icon: Zap,
        title: 'Active Performance',
        description: 'We focus on long-term prevention and functional strength, ensuring you return to peak performance and stay there.',
    },
];

export function Approach() {
    return (
        <SectionWrapper background="white" id="approach">
            <div className="text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4"
                >
                    Our Methodology
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    Our <span className="text-gradient">Approach</span>
                </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {approaches.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl border border-secondary-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-transparent text-primary-500 flex items-center justify-start mb-6">
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-secondary-600 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
