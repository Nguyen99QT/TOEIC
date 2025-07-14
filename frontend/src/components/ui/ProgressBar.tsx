import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
    showLabel?: boolean;
    showPercentage?: boolean;
    label?: string;
    animated?: boolean;
    striped?: boolean;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    showPercentage = true,
    label,
    animated = true,
    striped = false,
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setDisplayValue(value), 100);
            return () => clearTimeout(timer);
        } else {
            setDisplayValue(value);
        }
    }, [value, animated]);

    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    const variantClasses = {
        default: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        danger: 'bg-red-600',
        gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
    };

    const stripedClass = striped ? 'bg-stripes' : '';
    const animatedClass = animated ? 'transition-all duration-1000 ease-out' : '';

    return (
        <div className={`w-full ${className}`}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        {label || 'Progress'}
                    </span>
                    {showPercentage && (
                        <span className="text-sm font-medium text-gray-500">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}

            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]} 
            ${stripedClass} 
            ${animatedClass} 
            rounded-full
            relative
            overflow-hidden
          `}
                    style={{ width: `${percentage}%` }}
                >
                    {striped && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    )}

                    {animated && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                    )}
                </div>
            </div>

            {!showPercentage && !showLabel && !label && (
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                        {displayValue} / {max}
                    </span>
                </div>
            )}
        </div>
    );
};

// Circular Progress Component
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'default',
    showLabel = true,
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setDisplayValue(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantColors = {
        default: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
    };

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={variantColors[variant]}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
