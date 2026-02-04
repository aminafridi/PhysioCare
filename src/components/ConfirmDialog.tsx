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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-secondary-800 w-full sm:w-auto sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${variant === 'danger'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-yellow-100 dark:bg-yellow-900/30'
                            }`}>
                            <AlertTriangle className={`w-5 h-5 ${variant === 'danger'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-yellow-600 dark:text-yellow-400'
                                }`} />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-6 text-sm sm:text-base">
                        {message}
                    </p>

                    {/* Actions - Full width on mobile */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 min-h-[48px]"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            isLoading={isLoading}
                            className={`flex-1 min-h-[48px] ${variant === 'danger'
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
