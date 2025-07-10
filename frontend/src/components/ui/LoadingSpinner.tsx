/**
 * ================================================================
 * LOADING SPINNER COMPONENT
 * ================================================================
 * 
 * Reusable loading spinner with different sizes and styles
 */

import clsx from 'clsx';
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    primary: 'border-primary-600 border-r-transparent',
    secondary: 'border-secondary-600 border-r-transparent',
    white: 'border-white border-r-transparent',
    gray: 'border-gray-600 border-r-transparent'
  };

  return (
    <div
      className={clsx(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
