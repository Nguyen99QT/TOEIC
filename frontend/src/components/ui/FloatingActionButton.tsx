import React, { useState } from 'react';

interface FloatingAction {
    icon: string;
    label: string;
    onClick: () => void;
    color?: string;
}

interface FloatingActionButtonProps {
    actions?: FloatingAction[];
    mainIcon?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size?: 'sm' | 'md' | 'lg';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    actions = [],
    mainIcon = '➕',
    position = 'bottom-right',
    size = 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6'
    };

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    const iconSizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    };

    const getActionPosition = () => {
        if (position.includes('bottom')) {
            return 'flex-col-reverse space-y-reverse space-y-3';
        }
        return 'flex-col space-y-3';
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            <div className={`flex ${getActionPosition()}`}>
                {/* Action Items */}
                {isOpen && actions.map((action, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 animate-scaleIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {position.includes('right') && (
                            <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                                {action.label}
                            </span>
                        )}

                        <button
                            onClick={action.onClick}
                            className={`
                w-10 h-10 rounded-full shadow-lg text-white font-medium
                transform transition-all duration-200 hover:scale-110 active:scale-95
                ${action.color || 'bg-blue-600 hover:bg-blue-700'}
              `}
                            title={action.label}
                        >
                            <span className="text-lg">{action.icon}</span>
                        </button>

                        {position.includes('left') && (
                            <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                                {action.label}
                            </span>
                        )}
                    </div>
                ))}

                {/* Main Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            ${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-600 to-purple-600 
            text-white shadow-lg hover:shadow-xl transform transition-all duration-300 
            hover:scale-110 active:scale-95 flex items-center justify-center
            ${isOpen ? 'rotate-45' : 'rotate-0'}
          `}
                    title={isOpen ? 'Close menu' : 'Open menu'}
                >
                    <span className={iconSizeClasses[size]}>{mainIcon}</span>
                </button>
            </div>
        </div>
    );
};

// Quick Actions Component for the TOEIC platform
export const ToeicFloatingActions: React.FC = () => {
    const quickActions: FloatingAction[] = [
        {
            icon: '📚',
            label: 'Quick Lesson',
            onClick: () => window.location.href = '/lessons',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            icon: '✏️',
            label: 'Practice Test',
            onClick: () => window.location.href = '/exercises',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            icon: '🎴',
            label: 'Flashcards',
            onClick: () => window.location.href = '/flashcards',
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            icon: '📊',
            label: 'Progress',
            onClick: () => window.location.href = '/progress',
            color: 'bg-yellow-600 hover:bg-yellow-700'
        },
        {
            icon: '📞',
            label: 'Contact',
            onClick: () => window.location.href = '/contact',
            color: 'bg-red-600 hover:bg-red-700'
        }
    ];

    return (
        <FloatingActionButton
            actions={quickActions}
            mainIcon="🚀"
            position="bottom-right"
            size="lg"
        />
    );
};

export default FloatingActionButton;
