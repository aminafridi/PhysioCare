'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { addAppointment } from '@/lib/firestore';

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

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

interface BookingFormProps {
    selectedDate: string | null;
    selectedTime: string | null;
}

export function BookingForm({ selectedDate, selectedTime }: BookingFormProps) {
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
        if (!selectedDate || !selectedTime) {
            setSubmitError('Please select a date and time for your appointment.');
            return;
        }

        try {
            const result = await addAppointment({
                name: data.fullName,
                email: data.email,
                phone: data.phone,
                service: data.serviceInterest,
                date: selectedDate,
                time: selectedTime,
                message: data.message,
                status: 'pending',
            });

            if (result) {
                setIsSubmitted(true);
                setSubmitError(null);
                reset();
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                setSubmitError('Failed to book appointment. Please try again.');
            }
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
                            Your appointment has been booked! We&apos;ll confirm shortly.
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

                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-secondary-900 mb-2">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        {...register('message')}
                        className="w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none placeholder-secondary-400 bg-secondary-50/50"
                        placeholder="Any specific concerns or requirements..."
                    />
                </div>

                {selectedDate && selectedTime && (
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                        <p className="text-sm text-primary-700">
                            <strong>Selected:</strong> {selectedDate} at {selectedTime}
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    isLoading={isSubmitting}
                >
                    Book Appointment <Send className="w-4 h-4 ml-2 inline-block" />
                </Button>
            </form>
        </div>
    );
}

export function BookingCalendarWithForm() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const formatDateString = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const calendarDays = getDaysInMonth(currentMonth);
    const today = new Date();

    const isPastDate = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    return (
        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-secondary-100">
            <div className="p-8">
                <h3 className="text-xl font-bold mb-6 text-secondary-900">1. Select Date & Time</h3>

                {/* Calendar */}
                <div className="bg-secondary-50 p-6 rounded-xl mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-secondary-600" />
                        </button>
                        <span className="font-bold text-secondary-900">{monthName}</span>
                        <button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-secondary-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-4 text-center text-xs text-secondary-400 font-semibold">
                        {days.map(d => <div key={d}>{d[0]}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, i) => (
                            <div key={i} className="aspect-square flex items-center justify-center">
                                {day ? (
                                    <button
                                        onClick={() => !isPastDate(day) && setSelectedDate(formatDateString(day))}
                                        disabled={isPastDate(day)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                                            ${selectedDate === formatDateString(day)
                                                ? 'bg-primary-500 text-white shadow-md'
                                                : isPastDate(day)
                                                    ? 'text-secondary-300 cursor-not-allowed'
                                                    : 'text-secondary-700 hover:bg-white hover:shadow-sm'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ) : (
                                    <div />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div>
                    <label className="block text-secondary-900 font-medium mb-3">
                        Preferred Time Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {hours.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                                    ${selectedTime === time
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-white border border-secondary-200 text-secondary-700 hover:border-primary-500'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-8 bg-white">
                <h3 className="text-xl font-bold mb-6 text-secondary-900">2. Your Details</h3>
                <BookingForm selectedDate={selectedDate} selectedTime={selectedTime} />
            </div>
        </div>
    );
}
