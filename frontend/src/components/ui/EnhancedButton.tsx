import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    rounded?: boolean;
    children: ReactNode;
}

const EnhancedButton: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = false,
    disabled,
    children,
    className = '',
    ...props
}) => {
    const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `.trim();

    const variantClasses = {
        primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
      text-white shadow-lg hover:shadow-xl focus:ring-blue-500
    `,
        secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 
      focus:ring-gray-500
    `,
        success: `
      bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
      text-white shadow-lg hover:shadow-xl focus:ring-green-500
    `,
        warning: `
      bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
      text-white shadow-lg hover:shadow-xl focus:ring-yellow-500
    `,
        danger: `
      bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
      text-white shadow-lg hover:shadow-xl focus:ring-red-500
    `,
        ghost: `
      bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 
      focus:ring-gray-500
    `
    };

    const sizeClasses = {
        xs: 'px-2 py-1 text-xs rounded',
        sm: 'px-3 py-1.5 text-sm rounded-md',
        md: 'px-4 py-2 text-sm rounded-lg',
        lg: 'px-6 py-3 text-base rounded-lg',
        xl: 'px-8 py-4 text-lg rounded-xl'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const roundedClass = rounded ? 'rounded-full' : '';

    const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${roundedClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={combinedClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {!loading && leftIcon && (
                <span className="mr-2">{leftIcon}</span>
            )}

            <span>{children}</span>

            {!loading && rightIcon && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </button>
    );
};

export default EnhancedButton;
