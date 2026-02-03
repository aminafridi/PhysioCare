export interface Condition {
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
}

export const conditions: Condition[] = [
    {
        id: 'sciatica',
        name: 'Sciatica',
        description: 'Sciatica is pain that radiates along the path of the sciatic nerve, which branches from your lower back through your hips and buttocks and down each leg. It typically affects only one side of your body.',
        symptoms: [
            'Pain radiating from lower back to leg',
            'Numbness or tingling in the leg',
            'Weakness in the affected leg',
            'Sharp or burning sensation'
        ],
        treatments: [
            'Manual therapy',
            'Stretching exercises',
            'Core strengthening',
            'Posture correction'
        ],
    },
    {
        id: 'frozen-shoulder',
        name: 'Frozen Shoulder',
        description: 'Frozen shoulder, also known as adhesive capsulitis, is a condition characterized by stiffness and pain in your shoulder joint. It develops gradually and typically resolves in one to three years.',
        symptoms: [
            'Shoulder stiffness',
            'Limited range of motion',
            'Pain that worsens at night',
            'Difficulty with overhead movements'
        ],
        treatments: [
            'Range of motion exercises',
            'Stretching therapy',
            'Heat therapy',
            'Joint mobilization'
        ],
    },
    {
        id: 'knee-pain',
        name: 'Knee Pain',
        description: 'Knee pain is a common complaint that affects people of all ages. It may result from an injury, such as a ruptured ligament or torn cartilage, or conditions like arthritis, gout, or infections.',
        symptoms: [
            'Swelling and stiffness',
            'Redness and warmth',
            'Weakness or instability',
            'Popping or crunching noises'
        ],
        treatments: [
            'Strengthening exercises',
            'Balance training',
            'Manual therapy',
            'Bracing and taping'
        ],
    },
    {
        id: 'muscle-strains',
        name: 'Muscle Strains',
        description: 'A muscle strain occurs when muscle fibers are overstretched or torn. This usually happens as a result of fatigue, overuse, or improper use of a muscle.',
        symptoms: [
            'Sudden onset of pain',
            'Limited range of motion',
            'Muscle spasms',
            'Swelling and bruising'
        ],
        treatments: [
            'Rest and ice therapy',
            'Gentle stretching',
            'Progressive strengthening',
            'Soft tissue massage'
        ],
    },
    {
        id: 'arthritis',
        name: 'Arthritis',
        description: 'Arthritis is inflammation of one or more joints, causing pain and stiffness that can worsen with age. The most common types are osteoarthritis and rheumatoid arthritis.',
        symptoms: [
            'Joint pain and stiffness',
            'Swelling around joints',
            'Decreased range of motion',
            'Morning stiffness'
        ],
        treatments: [
            'Low-impact exercises',
            'Joint protection techniques',
            'Aquatic therapy',
            'Pain management strategies'
        ],
    },
    {
        id: 'post-stroke-rehab',
        name: 'Post-Stroke Rehabilitation',
        description: 'Post-stroke rehabilitation helps stroke survivors relearn skills lost when part of the brain is damaged. For most stroke patients, rehabilitation involves regaining motor skills and coordination.',
        symptoms: [
            'Muscle weakness or paralysis',
            'Balance problems',
            'Difficulty with coordination',
            'Speech and swallowing difficulties'
        ],
        treatments: [
            'Motor relearning exercises',
            'Balance and gait training',
            'Functional training',
            'Neuroplasticity-based therapy'
        ],
    },
];
