'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: (e: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDark, setIsDark] = useState(false);
    const animatingRef = useRef(false);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = useCallback((e: React.MouseEvent) => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        const x = e.clientX;
        const y = e.clientY;
        const newIsDark = !isDark;

        // Calculate the maximum radius needed to cover the entire screen
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Check if View Transitions API is supported
        if (document.startViewTransition) {
            // Set the position for the animation
            document.documentElement.style.setProperty('--x', `${x}px`);
            document.documentElement.style.setProperty('--y', `${y}px`);
            document.documentElement.style.setProperty('--r', `${maxRadius}px`);

            const transition = document.startViewTransition(() => {
                if (newIsDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });

            transition.ready.then(() => {
                // Animate the clip-path
                const clipPathStart = newIsDark
                    ? `circle(0px at ${x}px ${y}px)`
                    : `circle(${maxRadius}px at ${x}px ${y}px)`;
                const clipPathEnd = newIsDark
                    ? `circle(${maxRadius}px at ${x}px ${y}px)`
                    : `circle(0px at ${x}px ${y}px)`;

                document.documentElement.animate(
                    {
                        clipPath: [clipPathStart, clipPathEnd],
                    },
                    {
                        duration: 500,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        pseudoElement: newIsDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
                    }
                );
            });

            transition.finished.then(() => {
                animatingRef.current = false;
            });
        } else {
            // Fallback for browsers without View Transitions API
            if (newIsDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            animatingRef.current = false;
        }

        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
