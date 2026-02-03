'use client';

import { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus, deleteAppointment, AppointmentData } from '@/lib/firestore';
import { Button } from '@/components/ui';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Calendar, Clock, User, Phone, Mail, Trash2, Loader2, AlertCircle } from 'lucide-react';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusOptions: AppointmentData['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setLoading(false);
    };

    const handleStatusChange = async (id: string, status: AppointmentData['status']) => {
        setUpdating(id);
        const success = await updateAppointmentStatus(id, status);
        if (success) {
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? { ...apt, status } : apt)
            );
        }
        setUpdating(null);
    };

    const openDeleteDialog = (id: string) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setDeleting(true);
        const success = await deleteAppointment(deletingId);
        if (success) {
            setAppointments(prev => prev.filter(apt => apt.id !== deletingId));
        }
        setDeleting(false);
        setDeleteDialogOpen(false);
        setDeletingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Appointments
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Manage patient appointment requests
                    </p>
                </div>
                <Button onClick={loadAppointments} variant="outline" className="gap-2">
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
                    <div key={status} className="bg-white dark:bg-secondary-800 rounded-xl p-4 border border-secondary-200 dark:border-secondary-700">
                        <p className="text-sm text-secondary-500 capitalize">{status}</p>
                        <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                            {appointments.filter(a => a.status === status).length}
                        </p>
                    </div>
                ))}
            </div>

            {/* Appointments List */}
            {appointments.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700">
                    <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                        No appointments yet
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Appointments will appear here when patients book online.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-50 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                        Patient
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                        Service
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                        Date & Time
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-secondary-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {appointment.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-secondary-900 dark:text-white">
                                                        {appointment.name}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-secondary-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {appointment.email}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {appointment.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-secondary-700 dark:text-secondary-300">
                                                {appointment.service}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-secondary-700 dark:text-secondary-300">
                                                <Calendar className="w-4 h-4 text-secondary-400" />
                                                {appointment.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-secondary-500 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {appointment.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={appointment.status}
                                                onChange={(e) => handleStatusChange(appointment.id!, e.target.value as AppointmentData['status'])}
                                                disabled={updating === appointment.id}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[appointment.status]} transition-colors`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status} className="bg-white text-secondary-900">
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openDeleteDialog(appointment.id!)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingId(null);
                }}
                onConfirm={handleDelete}
                title="Delete Appointment"
                message="Are you sure you want to delete this appointment? This action cannot be undone."
                confirmText="Delete"
                isLoading={deleting}
                variant="danger"
            />
        </div>
    );
}
