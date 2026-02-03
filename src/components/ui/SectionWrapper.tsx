'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
    background?: 'white' | 'gray' | 'primary' | 'gradient';
}

export function SectionWrapper({
    children,
    className,
    id,
    background = 'white',
}: SectionWrapperProps) {
    const backgrounds = {
        white: 'bg-white',
        gray: 'bg-secondary-50',
        primary: 'bg-primary-600 text-white',
        gradient: 'gradient-hero',
    };

    return (
        <section
            id={id}
            className={cn('section-padding', backgrounds[background], className)}
        >
            <div className="container-custom">{children}</div>
        </section>
    );
}
