import { AdminAuthProvider } from '@/lib/AdminAuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
                {children}
            </div>
        </AdminAuthProvider>
    );
}
