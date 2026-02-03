'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
    email: string;
    name: string;
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

// Simple credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
    email: 'admin@physiocare.com',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simple authentication (replace with real auth in production)
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const adminUser = { email, name: ADMIN_CREDENTIALS.name };
            setUser(adminUser);
            localStorage.setItem('adminUser', JSON.stringify(adminUser));
            return true;
        }
        return false;
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
