'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui';
import { Condition } from '@/data/conditions';

interface ConditionCardProps {
    condition: Condition;
}

export function ConditionCard({ condition }: ConditionCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <h3 className="text-xl mb-3">{condition.name}</h3>

            <p className="text-secondary-600 text-sm leading-relaxed flex-grow mb-4">
                {condition.description}
            </p>

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-secondary-700 mb-2">Common Symptoms:</h4>
                <ul className="space-y-1">
                    {condition.symptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index} className="text-sm text-secondary-600 flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-2 flex-shrink-0" />
                            {symptom}
                        </li>
                    ))}
                </ul>
            </div>

            <Link
                href="/book"
                className="inline-flex items-center text-primary-600 font-medium text-sm group hover:text-primary-700 transition-colors"
            >
                Book Treatment
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </Card>
    );
}
