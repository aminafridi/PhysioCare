'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Bone, Heart, Home, Dumbbell, Users, Baby } from 'lucide-react';
import { Card } from '@/components/ui';
import { ServiceData } from '@/lib/firestore';

const IconMap: Record<string, any> = {
    'Activity': Activity,
    'Bone': Bone,
    'Heart': Heart,
    'Home': Home,
    'Dumbbell': Dumbbell,
    'Users': Users,
    'Baby': Baby,
};

interface ServiceCardProps {
    service: ServiceData;
    showLink?: boolean;
}

export function ServiceCard({ service, showLink = true }: ServiceCardProps) {
    const Icon = IconMap[service.iconName] || Activity;

    return (
        <Card className="h-full flex flex-col overflow-hidden group/card px-0 py-0 border-0 ring-1 ring-secondary-200 dark:ring-secondary-800">
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden bg-secondary-100">
                {service.imageUrl ? (
                    <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary-100 text-secondary-300">
                        <Icon className="w-16 h-16 opacity-20" />
                    </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* Icon positioned over image */}
                <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary-600">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow bg-white dark:bg-secondary-900">
                <h3 className="text-xl font-bold mb-3 text-secondary-900 dark:text-white group-hover/card:text-primary-600 transition-colors">
                    {service.title}
                </h3>

                <p className="text-secondary-600 dark:text-secondary-300 text-sm leading-relaxed flex-grow line-clamp-3">
                    {service.shortDescription}
                </p>

                {showLink && (
                    <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center text-primary-600 font-medium text-sm mt-5 group/link hover:text-primary-700 transition-colors"
                    >
                        Learn More
                        <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>
        </Card>
    );
}
