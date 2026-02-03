'use client';

import { motion } from 'framer-motion';
import { Award, Stethoscope, Shield, Building2 } from 'lucide-react';
import { SectionWrapper } from '@/components/ui';

const benefits = [
    {
        icon: Award,
        title: 'Expert Care',
        description: 'Our team of certified physiotherapists brings years of experience and specialized training to every treatment.',
    },
    {
        icon: Stethoscope,
        title: 'Modern Equipment',
        description: 'We use state-of-the-art equipment and the latest therapeutic technologies for optimal results.',
    },
    {
        icon: Shield,
        title: 'Evidence-Based Treatment',
        description: 'All our treatment protocols are based on the latest scientific research and clinical evidence.',
    },
    {
        icon: Building2,
        title: 'Comfortable Environment',
        description: 'Our clinic provides a welcoming, clean, and comfortable space designed for your healing journey.',
    },
];

export function WhyChooseUs() {
    return (
        <SectionWrapper background="white" id="why-choose-us">
            <div className="text-center mb-12">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="text-primary-600 font-medium text-sm uppercase tracking-wider"
                >
                    Why Choose Us
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mt-2 mb-4"
                >
                    The <span className="text-gradient">PhysioCare</span> Difference
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-secondary-600 max-w-2xl mx-auto"
                >
                    We&apos;re committed to providing exceptional physiotherapy care that makes a real
                    difference in your life.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center group"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                            <benefit.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl mb-3">{benefit.title}</h3>
                        <p className="text-secondary-600 text-sm leading-relaxed">
                            {benefit.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
