'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'danger'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-yellow-100 dark:bg-yellow-900/30'
                            }`}>
                            <AlertTriangle className={`w-5 h-5 ${variant === 'danger'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-yellow-600 dark:text-yellow-400'
                                }`} />
                        </div>
                        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                        {message}
                    </p>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            isLoading={isLoading}
                            className={`flex-1 ${variant === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                }`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
