'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui';

// Form validation schema
const contactFormSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    serviceInterest: z.string().min(1, 'Please select a service'),
    message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const services = [
    'General Physiotherapy',
    'Sports Rehabilitation',
    'Post-Surgery Recovery',
    'Manual Therapy',
    'Back & Neck Pain',
    'Other'
];

export function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Form submitted:', data);
            setIsSubmitted(true);
            setSubmitError(null);
            reset();

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            setSubmitError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-700 text-sm">
                            Thank you! Your inquiry has been submitted. We&apos;ll contact you shortly.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {submitError && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{submitError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-secondary-900 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            {...register('fullName')}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-secondary-200 focus:ring-primary-500'
                                } focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-secondary-400 bg-secondary-50/50`}
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-secondary-900 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-secondary-200 focus:ring-primary-500'
                                } focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-secondary-400 bg-secondary-50/50`}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-secondary-900 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            {...register('phone')}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-secondary-200 focus:ring-primary-500'
                                } focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-secondary-400 bg-secondary-50/50`}
                            placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Service Interest */}
                    <div>
                        <label htmlFor="serviceInterest" className="block text-sm font-semibold text-secondary-900 mb-2">
                            Service Interest
                        </label>
                        <div className="relative">
                            <select
                                id="serviceInterest"
                                {...register('serviceInterest')}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.serviceInterest ? 'border-red-300 focus:ring-red-500' : 'border-secondary-200 focus:ring-primary-500'
                                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-secondary-50/50 appearance-none text-secondary-700`}
                            >
                                <option value="">Select a service</option>
                                {services.map((service) => (
                                    <option key={service} value={service}>
                                        {service}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-secondary-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                        {errors.serviceInterest && (
                            <p className="mt-1 text-sm text-red-600">{errors.serviceInterest.message}</p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-secondary-900 mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        {...register('message')}
                        className="w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none placeholder-secondary-400 bg-secondary-50/50"
                        placeholder="Tell us about your project needs..."
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    isLoading={isSubmitting}
                >
                    Send Message <Send className="w-4 h-4 ml-2 inline-block" />
                </Button>
            </form>
        </div>
    );
}
