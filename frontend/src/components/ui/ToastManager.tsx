import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

interface ToastManagerProps {
    toasts: ToastProps[];
    removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform";
        const visibilityStyles = isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0";

        switch (type) {
            case 'success':
                return `${baseStyles} ${visibilityStyles} bg-green-50 border-green-400 text-green-800`;
            case 'error':
                return `${baseStyles} ${visibilityStyles} bg-red-50 border-red-400 text-red-800`;
            case 'warning':
                return `${baseStyles} ${visibilityStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
            case 'info':
                return `${baseStyles} ${visibilityStyles} bg-blue-50 border-blue-400 text-blue-800`;
            default:
                return `${baseStyles} ${visibilityStyles} bg-gray-50 border-gray-400 text-gray-800`;
        }
    };

    const getIcon = () => {
        switch (type) {
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
                    <h4 className="font-semibold">{title}</h4>
                    {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(id), 300);
                    }}
                    className="ml-4 text-current opacity-60 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

const ToastManager: React.FC<ToastManagerProps> = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={removeToast} />
            ))}
        </div>,
        document.body
    );
};

// Hook để sử dụng toast
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Date.now().toString();
        const newToast: ToastProps = {
            ...toast,
            id,
            onClose: removeToast
        };
        setToasts(prev => [...prev, newToast]);
        return id;
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (title: string, message?: string) =>
        addToast({ type: 'success', title, message });

    const error = (title: string, message?: string) =>
        addToast({ type: 'error', title, message });

    const warning = (title: string, message?: string) =>
        addToast({ type: 'warning', title, message });

    const info = (title: string, message?: string) =>
        addToast({ type: 'info', title, message });

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        ToastManager: () => <ToastManager toasts={toasts} removeToast={removeToast} />
    };
};

export default ToastManager;
