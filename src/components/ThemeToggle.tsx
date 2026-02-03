'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Avoid hydration mismatch
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-hidden group"
            aria-label="Toggle Theme"
        >
            <div className="relative z-10">
                {isDark ? (
                    <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
                ) : (
                    <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 group-hover:rotate-45" />
                )}
            </div>
        </button>
    );
}
