declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export interface ToastOptions {
    id?: string;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    style?: React.CSSProperties;
    className?: string;
    icon?: ReactNode;
    iconTheme?: {
      primary: string;
      secondary: string;
    };
    ariaProps?: {
      role: string;
      'aria-live': 'assertive' | 'off' | 'polite';
    };
  }

  export interface Toast {
    id: string;
    message: string | ReactNode;
    type: 'success' | 'error' | 'loading' | 'blank';
    position: ToastOptions['position'];
    duration: number;
    visible: boolean;
    style: React.CSSProperties;
    className: string;
    icon?: ReactNode;
    iconTheme?: ToastOptions['iconTheme'];
    ariaProps: ToastOptions['ariaProps'];
    createdAt: number;
    pausedAt?: number;
  }

  export const toast: {
    (message: string | ReactNode, options?: ToastOptions): string;
    success: (message: string | ReactNode, options?: ToastOptions) => string;
    error: (message: string | ReactNode, options?: ToastOptions) => string;
    loading: (message: string | ReactNode, options?: ToastOptions) => string;
    dismiss: (id?: string) => void;
    remove: (id?: string) => void;
    promise: <T>(
      promise: Promise<T>,
      msgs: {
        loading: string | ReactNode;
        success: string | ReactNode | ((value: T) => ReactNode);
        error: string | ReactNode | ((error: any) => ReactNode);
      },
      options?: ToastOptions
    ) => Promise<T>;
  };

  export interface ToasterProps {
    position?: ToastOptions['position'];
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
  }

  export const Toaster: React.FC<ToasterProps>;

  export default toast;
}
