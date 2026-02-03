import {
    Activity,
    Bone,
    Heart,
    Home,
    Dumbbell,
    Users,
    Baby
} from 'lucide-react';
import { ComponentType } from 'react';

export interface Service {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    whoIsItFor: string;
    benefits: string[];
    icon: ComponentType<{ className?: string }>;
    imageUrl?: string;
}

export const services: Service[] = [
    {
        id: 'sports-physiotherapy',
        title: 'Sports Physiotherapy',
        shortDescription: 'Specialized treatment for sports injuries and athletic performance enhancement.',
        fullDescription: 'Our sports physiotherapy program is designed for athletes of all levels. We provide comprehensive assessment and treatment for sports-related injuries, helping you get back to peak performance safely and efficiently.',
        whoIsItFor: 'Athletes, fitness enthusiasts, and anyone with sports-related injuries',
        benefits: [
            'Faster recovery from sports injuries',
            'Improved athletic performance',
            'Injury prevention strategies',
            'Sport-specific rehabilitation programs',
            'Return-to-sport assessments'
        ],
        icon: Dumbbell,
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop', // Gym/Rehab
    },
    {
        id: 'post-surgery-rehab',
        title: 'Post-Surgery Rehabilitation',
        shortDescription: 'Comprehensive rehabilitation programs following surgical procedures.',
        fullDescription: 'Our post-surgical rehabilitation program helps patients recover strength, mobility, and function after various surgical procedures. We work closely with your surgical team to ensure optimal recovery outcomes.',
        whoIsItFor: 'Patients recovering from orthopedic surgeries, joint replacements, or other surgical procedures',
        benefits: [
            'Faster surgical recovery',
            'Reduced post-operative complications',
            'Restored mobility and function',
            'Pain management techniques',
            'Personalized recovery timelines'
        ],
        icon: Heart,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', // Medical Equipment/Care
    },
    {
        id: 'back-neck-pain',
        title: 'Back & Neck Pain Treatment',
        shortDescription: 'Expert care for chronic and acute back and neck pain conditions.',
        fullDescription: 'Back and neck pain can significantly impact your quality of life. Our specialized treatment approaches address the root cause of your pain, providing lasting relief and preventing recurrence.',
        whoIsItFor: 'Anyone suffering from acute or chronic back pain, neck pain, or related conditions',
        benefits: [
            'Long-term pain relief',
            'Improved posture and alignment',
            'Strengthened core muscles',
            'Reduced reliance on medication',
            'Prevention of future episodes'
        ],
        icon: Activity,
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop', // Massage/Back
    },
    {
        id: 'joint-therapy',
        title: 'Knee & Joint Therapy',
        shortDescription: 'Specialized treatment for joint pain, stiffness, and mobility issues.',
        fullDescription: 'Our joint therapy program focuses on restoring optimal joint function through targeted exercises, manual therapy, and education. We treat various joint conditions including arthritis, injuries, and post-surgical recovery.',
        whoIsItFor: 'Patients with joint pain, arthritis, joint injuries, or mobility limitations',
        benefits: [
            'Reduced joint pain and inflammation',
            'Improved joint mobility',
            'Strengthened supporting muscles',
            'Delayed progression of arthritis',
            'Enhanced daily function'
        ],
        icon: Bone,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', // Joint/Knee
    },
    {
        id: 'posture-correction',
        title: 'Posture Correction',
        shortDescription: 'Comprehensive posture assessment and correction programs.',
        fullDescription: 'Poor posture can lead to various musculoskeletal problems. Our posture correction program identifies postural imbalances and provides targeted interventions to restore optimal alignment and prevent related issues.',
        whoIsItFor: 'Office workers, students, and anyone with postural concerns or related pain',
        benefits: [
            'Improved spinal alignment',
            'Reduced muscle tension and headaches',
            'Enhanced breathing and energy',
            'Prevention of degenerative changes',
            'Better overall appearance'
        ],
        icon: Users,
        imageUrl: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=800&auto=format&fit=crop', // Posture/Standing
    },
    {
        id: 'home-physiotherapy',
        title: 'Home Physiotherapy',
        shortDescription: 'Professional physiotherapy services delivered at your doorstep.',
        fullDescription: 'For patients who cannot visit our clinic, we offer comprehensive home physiotherapy services. Our therapists bring all necessary equipment and provide the same quality care in the comfort of your home.',
        whoIsItFor: 'Elderly patients, post-surgical patients, or those with mobility limitations',
        benefits: [
            'Convenience of home treatment',
            'Familiar and comfortable environment',
            'No travel required',
            'Family involvement in care',
            'Flexible scheduling'
        ],
        icon: Home,
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop', // Home/Care
    },
    {
        id: 'pediatric-physiotherapy',
        title: 'Pediatric Physiotherapy',
        shortDescription: 'Specialized physiotherapy care for infants, children, and adolescents.',
        fullDescription: 'Our pediatric physiotherapy services address developmental delays, neurological conditions, and musculoskeletal issues in children. We use play-based therapy and family-centered approaches to help children reach their full potential.',
        whoIsItFor: 'Children with developmental delays, injuries, or movement disorders',
        benefits: [
            'Age-appropriate treatment approaches',
            'Improved motor development',
            'Enhanced participation in activities',
            'Family education and support',
            'Fun and engaging therapy sessions'
        ],
        icon: Baby,
        imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop', // Child/Baby
    },
    {
        id: 'manual-therapy',
        title: 'Manual Therapy',
        shortDescription: 'Hands-on treatment to mobilize joints and soft tissues.',
        fullDescription: 'Our manual therapy techniques allow us to mobilize stiff joints and soft tissues, reducing pain and improving range of motion effectively.',
        whoIsItFor: 'Patients with stiffness, joint restrictions, or soft tissue pain',
        benefits: [
            'Immediate pain relief',
            'Improved joint mobility',
            'Reduced muscle tension',
            'Enhanced circulation',
            'Faster recovery'
        ],
        icon: Users,
        imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop', // Massage/Manual
    },
    {
        id: 'neurological-rehab',
        title: 'Neurological Rehab',
        shortDescription: 'Specialized care for neurological conditions and stroke recovery.',
        fullDescription: 'We provide comprehensive rehabilitation for patients with neurological conditions, helping to retrain the brain and body for improved function and independence.',
        whoIsItFor: 'Stroke survivors, patients with MS, Parkinson\'s, or other neurological conditions',
        benefits: [
            'Improved balance and coordination',
            'Restored movement patterns',
            'Enhanced independence',
            'Fall prevention',
            'Neuroplasticity promotion'
        ],
        icon: Activity,
        imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=800&auto=format&fit=crop', // Neuro/Brain or Rehab
    },
    {
        id: 'vestibular-therapy',
        title: 'Vestibular Therapy',
        shortDescription: 'Treatment for dizziness, vertigo, and balance disorders.',
        fullDescription: 'Our vestibular therapy program effectively treats inner ear disorders that cause dizziness and balance issues, creating a safer and more stable world for our patients.',
        whoIsItFor: 'Patients experiencing vertigo, dizziness, or balance issues',
        benefits: [
            'Reduced dizziness and vertigo',
            'Improved balance and stability',
            'Decreased fall risk',
            'Enhanced gaze stability',
            'Return to daily activities'
        ],
        icon: Activity,
        imageUrl: 'https://images.unsplash.com/photo-1533227297464-94a45330a848?q=80&w=800&auto=format&fit=crop', // Balance/Yoga
    },
];
