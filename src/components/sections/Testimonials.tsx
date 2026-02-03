'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { SectionWrapper } from '@/components/ui';
import { TestimonialCard } from '../TestimonialCard';
import { testimonials as defaultTestimonials } from '@/data/testimonials';
import { getTestimonials, TestimonialData } from '@/lib/firestore';

export function Testimonials() {
    const [testimonials, setTestimonials] = useState(defaultTestimonials);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleTestimonials = 3;

    useEffect(() => {
        async function loadTestimonials() {
            const data = await getTestimonials();
            if (data.length > 0) {
                // Transform Firebase data to match expected format
                const formatted = data.map((t: TestimonialData) => ({
                    id: t.id || '',
                    name: t.name,
                    role: t.role,
                    content: t.content,
                    rating: t.rating,
                }));
                setTestimonials(formatted);
            }
            setLoading(false);
        }
        loadTestimonials();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + visibleTestimonials >= testimonials.length ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, testimonials.length - visibleTestimonials) : prev - 1
        );
    };

    if (loading) {
        return (
            <SectionWrapper background="gray" id="testimonials">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper background="gray" id="testimonials">
            <div className="text-center mb-12">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="text-primary-600 font-medium text-sm uppercase tracking-wider"
                >
                    Testimonials
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mt-2 mb-4"
                >
                    What Our <span className="text-gradient">Patients</span> Say
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-secondary-600 max-w-2xl mx-auto"
                >
                    Real stories from real patients who have experienced the difference our care
                    makes in their recovery journey.
                </motion.p>
            </div>

            {/* Desktop Carousel */}
            <div className="hidden lg:block relative">
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-3 gap-6"
                        >
                            {testimonials
                                .slice(currentIndex, currentIndex + visibleTestimonials)
                                .map((testimonial, index) => (
                                    <TestimonialCard
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                    />
                                ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {testimonials.length > visibleTestimonials && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary-600 hover:text-primary-600 transition-colors"
                            aria-label="Previous testimonials"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary-600 hover:text-primary-600 transition-colors"
                            aria-label="Next testimonials"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Mobile/Tablet Grid */}
            <div className="lg:hidden grid md:grid-cols-2 gap-6">
                {testimonials.slice(0, 4).map((testimonial) => (
                    <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                    />
                ))}
            </div>

            {/* View All Link */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
            >
                <p className="text-secondary-500 text-sm">
                    Join our community of satisfied patients and start your recovery journey today.
                </p>
            </motion.div>
        </SectionWrapper>
    );
}
