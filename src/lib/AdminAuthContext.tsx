'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAdminUserByEmail, AdminUserData } from './firestore';

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'superadmin' | 'admin' | 'editor';
    allowedPages: string[];
}

interface AdminAuthContextType {
    user: AdminUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    isLoading: true,
    login: async () => false,
    logout: () => { },
});

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}

// Default super admin (fallback if no users in Firestore)
const DEFAULT_ADMIN = {
    email: 'admin@physiocare.com',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'superadmin' as const,
    allowedPages: ['dashboard', 'appointments', 'about', 'services', 'blog', 'testimonials', 'settings', 'users'],
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('adminUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // First try to find user in Firestore
            const firestoreUser = await getAdminUserByEmail(email);

            if (firestoreUser && firestoreUser.password === password) {
                const adminUser: AdminUser = {
                    id: firestoreUser.id!,
                    email: firestoreUser.email,
                    name: firestoreUser.name,
                    role: firestoreUser.role,
                    allowedPages: firestoreUser.allowedPages,
                };
                setUser(adminUser);
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                return true;
            }

            // Fallback to default admin if no Firestore user found
            if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
                const adminUser: AdminUser = {
                    id: 'default',
                    email: DEFAULT_ADMIN.email,
                    name: DEFAULT_ADMIN.name,
                    role: DEFAULT_ADMIN.role,
                    allowedPages: DEFAULT_ADMIN.allowedPages,
                };
                setUser(adminUser);
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            // Fallback to default admin on error
            if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
                const adminUser: AdminUser = {
                    id: 'default',
                    email: DEFAULT_ADMIN.email,
                    name: DEFAULT_ADMIN.name,
                    role: DEFAULT_ADMIN.role,
                    allowedPages: DEFAULT_ADMIN.allowedPages,
                };
                setUser(adminUser);
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                return true;
            }
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
    };

    return (
        <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}
