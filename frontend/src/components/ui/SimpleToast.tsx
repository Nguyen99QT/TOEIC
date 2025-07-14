import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const getToastStyles = () => {
        const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300";

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
            default:
                return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800`;
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="flex items-start">
                <span className="text-lg mr-3">{getIcon()}</span>
                <div className="flex-1">
                    <h4 className="font-semibold">{toast.title}</h4>
                    {toast.message && <p className="text-sm mt-1 opacity-90">{toast.message}</p>}
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="ml-4 text-current opacity-60 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Date.now().toString();
        const newToast: Toast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (title: string, message?: string) => {
        addToast({ type: 'success', title, message });
    };

    const error = (title: string, message?: string) => {
        addToast({ type: 'error', title, message });
    };

    const warning = (title: string, message?: string) => {
        addToast({ type: 'warning', title, message });
    };

    const info = (title: string, message?: string) => {
        addToast({ type: 'info', title, message });
    };

    const contextValue: ToastContextType = {
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {toasts.length > 0 && createPortal(
                <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
