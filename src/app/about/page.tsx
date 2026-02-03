'use client';

import { useEffect, useState } from 'react';
import { SectionWrapper } from '@/components/ui';
import { CTABanner, Approach } from '@/components/sections';
import { Award, Target, CheckCircle, Loader2 } from 'lucide-react';
import { getAboutPage, AboutPageData } from '@/lib/firestore';



const defaultData: AboutPageData = {
    name: 'Dr. Sarah Johnson',
    title: 'Lead Physiotherapist',
    experience: '15+',
    bio: 'With over 15 years of experience in physiotherapy, I am passionate about helping patients recover from injuries, manage chronic conditions, and improve their overall quality of life.',
    qualifications: [
        'Doctor of Physical Therapy (DPT)',
        'Board Certified Clinical Specialist',
        'Certified Sports Physical Therapist',
        'Manual Therapy Certification',
        'Dry Needling Certification',
    ],
    mission: 'To provide exceptional, evidence-based physiotherapy care that empowers our patients to achieve their fullest potential.',
    vision: 'To be the leading physiotherapy clinic in our community, recognized for clinical excellence and innovative treatment approaches.',
};

export default function AboutPage() {
    const [data, setData] = useState<AboutPageData>(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const aboutData = await getAboutPage();
            if (aboutData) {
                setData(aboutData);
            }
            setLoading(false);
        }
        loadData();
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
            {/* Header / Hero */}
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            About Our Practice
                        </span>
                        <h1 className="mb-6">
                            Lead <span className="text-gradient">Practitioner</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Dedicated to restoring your movement and enhancing your quality of life
                            through expert, personalized physiotherapy care.
                        </p>
                    </div>
                </div>
            </section>

            {/* Lead Practitioner Section */}
            <SectionWrapper background="white">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-secondary-100 mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        {/* Image Column */}
                        <div className="md:col-span-4 relative flex justify-center">
                            {/* Circle Image Container */}
                            <div className="aspect-square w-full max-w-xs relative rounded-full overflow-hidden shadow-2xl border-4 border-white ring-1 ring-secondary-100">
                                {data.imageUrl ? (
                                    <img
                                        src={data.imageUrl}
                                        alt={data.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center">
                                        <span className="text-6xl">👩‍⚕️</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="md:col-span-8">
                            <span className="block text-primary-600 font-bold text-sm tracking-wider uppercase mb-2">
                                Lead Practitioner
                            </span>
                            <h2 className="text-4xl font-bold text-secondary-900 mb-1">
                                {data.name}
                            </h2>
                            <p className="text-secondary-500 font-medium mb-6">
                                {data.title}
                            </p>

                            <p className="text-secondary-600 leading-relaxed mb-8 text-lg">
                                {data.bio}
                            </p>

                            {/* Specialization Pills */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {data.qualifications.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* Mission & Vision */}
            <SectionWrapper background="gray">
                <div className="max-w-3xl mb-12">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-4">Mission & Vision</h2>
                    <p className="text-secondary-600 text-lg">
                        We are committed to providing evidence-based, personalized care to help our community achieve optimal movement and long-term health through innovative rehabilitation.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-3">Our Mission</h3>
                        <p className="text-secondary-600 leading-relaxed">
                            {data.mission}
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-3">Our Vision</h3>
                        <p className="text-secondary-600 leading-relaxed">
                            {data.vision}
                        </p>
                    </div>
                </div>
            </SectionWrapper>

            {/* Our Approach (New Component) */}
            <Approach />

            <CTABanner />
        </>
    );
}
