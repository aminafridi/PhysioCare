import { Metadata } from 'next';
import { SectionWrapper, Card } from '@/components/ui';
import { BookingCalendarWithForm } from '@/components';
import { Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Book an Appointment',
    description:
        'Schedule your physiotherapy appointment with PhysioCare. Easy online booking for personalized treatment.',
};

const benefits = [
    'Personalized treatment plan',
    'Flexible appointment times',
    'Experienced physiotherapists',
    'State-of-the-art facilities',
];

export default function BookPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 gradient-hero">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Book Appointment
                        </span>
                        <h1 className="mb-6">
                            Schedule Your <span className="text-gradient">Consultation</span>
                        </h1>
                        <p className="text-lg text-secondary-600">
                            Take the first step towards recovery. Book your appointment today and
                            let us help you on your journey to better health.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <SectionWrapper background="white">
                <div className="max-w-6xl mx-auto">

                    <Card className="p-0 overflow-hidden shadow-2xl border-0" hover={false}>
                        <div className="p-8 border-b border-secondary-100 text-center">
                            <h2 className="text-2xl font-bold">Request an Appointment</h2>
                            <p className="text-secondary-600">
                                Select a date and time, then fill in your details.
                            </p>
                        </div>

                        <BookingCalendarWithForm />
                    </Card>

                    {/* Additional Info */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <Card className="p-6" hover={false}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                </div>
                                <h3 className="text-lg">Working Hours</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Monday - Friday</span>
                                    <span className="font-medium text-secondary-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Saturday</span>
                                    <span className="font-medium text-secondary-900">10:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Sunday</span>
                                    <span className="font-medium text-red-500">Closed</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6" hover={false}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                </div>
                                <h3 className="text-lg">Patient Benefits</h3>
                            </div>
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-secondary-600">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                            <h4 className="font-semibold text-primary-900 mb-2">Need Immediate Help?</h4>
                            <p className="text-sm text-primary-700 mb-4">
                                For urgent cases, please call us directly.
                            </p>
                            <a
                                href="tel:+1234567890"
                                className="inline-flex items-center text-primary-600 font-medium text-sm hover:text-primary-700"
                            >
                                (123) 456-7890
                            </a>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}
