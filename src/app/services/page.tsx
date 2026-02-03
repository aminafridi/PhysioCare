'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/ui';
import { CTABanner } from '@/components/sections';
import { ServiceCard } from '@/components/ServiceCard';
import { services as staticServices } from '@/data/services';
import { getServices, ServiceData } from '@/lib/firestore';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadServices() {
            try {
                const data = await getServices();
                if (data.length > 0) {
                    setServices(data);
                } else {
                    // Fallback to static
                    // (Reuse fallback mapping logic if needed, or consistent mapping)
                    const formatted = staticServices.map(s => {
                        let iconName = 'Activity';
                        if (s.id === 'sports-physiotherapy') iconName = 'Dumbbell';
                        if (s.id === 'post-surgery-rehab') iconName = 'Heart';
                        if (s.id === 'back-neck-pain') iconName = 'Activity';
                        if (s.id === 'joint-therapy') iconName = 'Bone';
                        if (s.id === 'posture-correction') iconName = 'Users';
                        if (s.id === 'home-physiotherapy') iconName = 'Home';
                        if (s.id === 'pediatric-physiotherapy') iconName = 'Baby';
                        // Add new mappings for new static services
                        if (s.id === 'manual-therapy') iconName = 'Users';
                        if (s.id === 'neurological-rehab') iconName = 'Brain';
                        if (s.id === 'vestibular-therapy') iconName = 'Activity';

                        return {
                            id: s.id,
                            title: s.title,
                            shortDescription: s.shortDescription,
                            fullDescription: s.fullDescription,
                            whoIsItFor: s.whoIsItFor,
                            benefits: s.benefits,
                            iconName: iconName,
                            slug: s.id,
                            order: 0,
                            imageUrl: s.imageUrl
                        };
                    });
                    setServices(formatted);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Our Services
                        </span>
                        <h1 className="mb-6">
                            Expert Medical <span className="text-gradient">Treatments</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            We offer a wide range of specialized treatments designed to address your
                            unique needs and help you achieve optimal physical health.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <SectionWrapper background="white">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <ServiceCard service={service} showLink={true} />
                        </motion.div>
                    ))}
                </div>
            </SectionWrapper>

            <CTABanner />
        </>
    );
}
