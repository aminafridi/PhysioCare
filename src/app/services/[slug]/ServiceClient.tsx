'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Calendar, Shield, Loader2, Activity, Dumbbell, Brain, Heart, Stethoscope, Bone, LucideIcon } from 'lucide-react';
import { SectionWrapper, Button, Card } from '@/components/ui';
import { CTABanner } from '@/components/sections';
import { getService, ServiceData } from '@/lib/firestore';
import { services as staticServices } from '@/data/services';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    'Activity': Activity,
    'Dumbbell': Dumbbell,
    'Brain': Brain,
    'Heart': Heart,
    'Stethoscope': Stethoscope,
    'Bone': Bone,
};

export default function ServiceClient() {
    const params = useParams();
    const slug = params.slug as string;
    const [service, setService] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadService() {
            // Try fetch from Firestore
            const dbService = await getService(slug);

            if (dbService) {
                setService(dbService);
            } else {
                // Fallback to static
                const staticData = staticServices.find(s => s.id === slug);
                if (staticData) {
                    let iconName = 'Activity';
                    if (staticData.id === 'sports-physiotherapy') iconName = 'Dumbbell';
                    if (staticData.id === 'post-surgery-rehab') iconName = 'Heart';
                    if (staticData.id === 'back-neck-pain') iconName = 'Activity';
                    if (staticData.id === 'joint-therapy') iconName = 'Bone';
                    if (staticData.id === 'posture-correction') iconName = 'Users';
                    if (staticData.id === 'home-physiotherapy') iconName = 'Home';
                    if (staticData.id === 'pediatric-physiotherapy') iconName = 'Baby';
                    if (staticData.id === 'manual-therapy') iconName = 'Users';
                    if (staticData.id === 'neurological-rehab') iconName = 'Activity';
                    if (staticData.id === 'vestibular-therapy') iconName = 'Activity';

                    setService({
                        id: staticData.id,
                        title: staticData.title,
                        shortDescription: staticData.shortDescription,
                        fullDescription: staticData.fullDescription,
                        whoIsItFor: staticData.whoIsItFor,
                        benefits: staticData.benefits,
                        iconName: iconName,
                        slug: staticData.id,
                        order: 0,
                        imageUrl: staticData.imageUrl,
                    });
                }
            }
            setLoading(false);
        }
        loadService();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-secondary-900 mb-4">Service Not Found</h1>
                <Link href="/services">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Services
                    </Button>
                </Link>
            </div>
        );
    }

    const Icon = iconMap[service.iconName] || Activity;

    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-16 bg-secondary-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/20" />
                <div className="container-custom relative z-10">
                    <Link href="/services" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Services
                    </Link>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
                            <Icon className="w-10 h-10 text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
                            <p className="text-xl text-secondary-300 max-w-2xl">
                                {service.shortDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <SectionWrapper background="white">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl mb-6">About This Treatment</h2>
                        <div className="prose prose-lg text-secondary-600 mb-12">
                            <p>{service.fullDescription}</p>
                        </div>

                        <div className="bg-primary-50 rounded-2xl p-8 mb-12 border border-primary-100">
                            <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 text-primary-600 mr-2" />
                                Who Is It For?
                            </h3>
                            <p className="text-secondary-700">{service.whoIsItFor}</p>
                        </div>

                        <h3 className="text-2xl mb-6">Key Benefits</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {service.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start bg-white p-4 rounded-xl border border-secondary-100 shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                                    <span className="text-secondary-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-secondary-900 text-white border-none">
                            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
                            <p className="text-secondary-400 mb-6 text-sm">
                                Ready to start your recovery? Schedule your consultation with our expert team today.
                            </p>
                            <Link href="/book" className="block">
                                <Button className="w-full bg-primary-600 hover:bg-primary-500 text-white border-none">
                                    Schedule Now
                                </Button>
                            </Link>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Clinic Hours</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center text-secondary-600">
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Mon - Fri</span>
                                    <span className="font-medium text-secondary-900">8:00 AM - 7:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center text-secondary-600">
                                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Saturday</span>
                                    <span className="font-medium text-secondary-900">9:00 AM - 2:00 PM</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </SectionWrapper>

            <CTABanner />
        </>
    );
}
