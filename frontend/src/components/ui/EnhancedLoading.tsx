import React from 'react';

interface EnhancedLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'spinner' | 'dots' | 'pulse';
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
    message = "Loading...",
    size = 'md',
    type = 'spinner'
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16'
    };

    const renderSpinner = () => (
        <div className={`animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
    );

    const renderDots = () => (
        <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );

    const renderPulse = () => (
        <div className={`bg-blue-600 rounded-full animate-pulse ${sizeClasses[size]}`}></div>
    );

    const renderLoader = () => {
        switch (type) {
            case 'dots': return renderDots();
            case 'pulse': return renderPulse();
            default: return renderSpinner();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            {renderLoader()}
            {message && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

export default EnhancedLoading;
