'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui';
import { ConditionCard } from '@/components/ConditionCard';
import { CTABanner } from '@/components/sections';
import { conditions } from '@/data/conditions';

export default function ConditionsPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Conditions We Treat
                        </span>
                        <h1 className="mb-6">
                            Expert Treatment for <span className="text-gradient">Various Conditions</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Our experienced physiotherapists provide specialized care for a wide range
                            of musculoskeletal and neurological conditions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Conditions Grid */}
            <SectionWrapper background="white">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conditions.map((condition, index) => (
                        <motion.div
                            key={condition.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <ConditionCard condition={condition} />
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Additional Info */}
            <SectionWrapper background="gray">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="mb-6">
                        Don&apos;t See Your <span className="text-gradient">Condition?</span>
                    </h2>
                    <p className="text-secondary-600 mb-8 leading-relaxed">
                        The conditions listed above are just a few examples of what we treat.
                        Our physiotherapists are trained to assess and treat a wide variety of
                        musculoskeletal, neurological, and cardiopulmonary conditions. If you&apos;re
                        unsure whether physiotherapy can help with your specific concern, please
                        don&apos;t hesitate to contact us for a consultation.
                    </p>
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-xl mb-4">We Also Treat:</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                'Tendinitis',
                                'Plantar Fasciitis',
                                'Carpal Tunnel',
                                'Whiplash',
                                'Scoliosis',
                                'TMJ Disorders',
                                'Fibromyalgia',
                                'Balance Disorders',
                                'Chronic Pain',
                                'Sports Injuries',
                            ].map((condition) => (
                                <span
                                    key={condition}
                                    className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium"
                                >
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <CTABanner />
        </>
    );
}
