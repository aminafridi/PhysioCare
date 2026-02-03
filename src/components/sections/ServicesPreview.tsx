'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SectionWrapper, Button } from '@/components/ui';
import { ServiceCard } from '../ServiceCard';
import { getServices, ServiceData } from '@/lib/firestore';
import { services as staticServices } from '@/data/services';

export function ServicesPreview() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadServices() {
            try {
                const data = await getServices();
                if (data.length > 0) {
                    setServices(data.slice(0, 6));
                } else {
                    // Fallback to static if no DB data (converting static to ServiceData format)
                    const formatted = staticServices.slice(0, 6).map(s => {
                        let iconName = 'Activity';
                        if (s.id === 'sports-physiotherapy') iconName = 'Dumbbell';
                        if (s.id === 'post-surgery-rehab') iconName = 'Heart';
                        if (s.id === 'back-neck-pain') iconName = 'Activity';
                        if (s.id === 'joint-therapy') iconName = 'Bone';
                        if (s.id === 'posture-correction') iconName = 'Users';
                        if (s.id === 'home-physiotherapy') iconName = 'Home';
                        if (s.id === 'pediatric-physiotherapy') iconName = 'Baby';

                        return {
                            id: s.id,
                            title: s.title,
                            shortDescription: s.shortDescription,
                            fullDescription: s.fullDescription,
                            whoIsItFor: s.whoIsItFor,
                            benefits: s.benefits,
                            iconName: iconName,
                            slug: s.id,
                            imageUrl: s.imageUrl,
                            order: 0
                        };
                    });
                    setServices(formatted);
                }
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    if (loading) {
        return (
            <SectionWrapper background="gray" id="services-preview">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper background="gray" id="services-preview">
            <div className="text-center mb-12">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="text-primary-600 font-medium text-sm uppercase tracking-wider"
                >
                    Our Services
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mt-2 mb-4"
                >
                    Comprehensive <span className="text-gradient">Physiotherapy</span> Services
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-secondary-600 max-w-2xl mx-auto"
                >
                    We offer a wide range of specialized physiotherapy services designed to help you
                    recover, rehabilitate, and achieve optimal physical health.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <ServiceCard service={service} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mt-10"
            >
                <Link href="/services">
                    <Button variant="outline" className="group">
                        View All Services
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </motion.div>
        </SectionWrapper>
    );
}
