'use client';

import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="h-full flex flex-col relative">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-12 h-12 text-primary-600" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                ))}
            </div>

            {/* Content */}
            <p className="text-secondary-600 text-sm leading-relaxed flex-grow mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-secondary-100">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                    </span>
                </div>
                <div>
                    <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                    <p className="text-sm text-secondary-500">{testimonial.role}</p>
                </div>
            </div>
        </Card>
    );
}
