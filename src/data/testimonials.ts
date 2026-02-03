export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

export const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Marathon Runner',
        content: 'After my knee injury, I thought my running days were over. The team here not only helped me recover but also improved my running form. I\'m now faster than before my injury!',
        rating: 5,
    },
    {
        id: '2',
        name: 'Michael Chen',
        role: 'Office Professional',
        content: 'Years of desk work left me with chronic back pain. The posture correction program completely transformed my life. I\'m now pain-free and more productive at work.',
        rating: 5,
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        role: 'Post-Surgery Patient',
        content: 'The post-surgery rehabilitation was exceptional. The therapists were knowledgeable, caring, and pushed me just the right amount. My recovery exceeded all expectations.',
        rating: 5,
    },
    {
        id: '4',
        name: 'David Thompson',
        role: 'Senior Patient',
        content: 'The home physiotherapy service was a blessing. The therapist was professional, punctual, and made my recovery after hip replacement so much easier.',
        rating: 5,
    },
    {
        id: '5',
        name: 'Lisa Park',
        role: 'Yoga Instructor',
        content: 'I came in with a shoulder injury that was affecting my practice. The treatment was thorough and the rehabilitation exercises were perfect. Highly recommend!',
        rating: 5,
    },
    {
        id: '6',
        name: 'Robert Williams',
        role: 'Construction Worker',
        content: 'The back pain treatment I received was life-changing. The team understood my job requirements and tailored my treatment accordingly. Great experience!',
        rating: 5,
    },
];
