'use client';

import { motion } from 'framer-motion';
import { Award, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { SectionWrapper } from '@/components/ui';

const reasons = [
    {
        icon: Award,
        title: 'Licensed Experts',
        description: 'Our team is fully certified and follows the highest medical standards.',
    },
    {
        icon: Clock,
        title: 'Flexible Hours',
        description: 'Early morning and late evening slots to fit your busy schedule.',
    },
    {
        icon: ShieldCheck,
        title: 'Insurance Friendly',
        description: 'We work with all major private health insurance providers.',
    },
    {
        icon: MapPin,
        title: 'Prime Location',
        description: 'Easily accessible facility with dedicated patient parking.',
    },
];

export function WhyUs() {
    return (
        <SectionWrapper background="gray" id="why-us">
            <div className="text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4"
                >
                    Why Choose Us
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    Why Patients <span className="text-gradient">Trust Us</span>
                </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {reasons.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-secondary-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 mx-auto">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-center text-secondary-900 mb-3">
                            {item.title}
                        </h3>
                        <p className="text-secondary-600 text-center text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
