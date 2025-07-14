import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    clickable?: boolean;
    elevated?: boolean;
    bordered?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    background?: 'white' | 'gray' | 'gradient' | 'transparent';
    onClick?: () => void;
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

type CardComponent = React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Body: React.FC<CardBodyProps>;
    Footer: React.FC<CardFooterProps>;
};

const Card: CardComponent = ({
    children,
    className = '',
    hover = false,
    clickable = false,
    elevated = true,
    bordered = false,
    padding = 'md',
    rounded = 'lg',
    background = 'white',
    onClick
}) => {
    const baseClasses = 'transition-all duration-300 ease-in-out';

    const backgroundClasses = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        gradient: 'bg-gradient-to-br from-white to-gray-50',
        transparent: 'bg-transparent'
    };

    const shadowClasses = elevated
        ? 'shadow-md hover:shadow-lg'
        : 'shadow-none';

    const borderClasses = bordered
        ? 'border border-gray-200'
        : 'border-0';

    const hoverClasses = hover
        ? 'hover:scale-105 hover:shadow-xl'
        : '';

    const clickableClasses = clickable
        ? 'cursor-pointer transform active:scale-95'
        : '';

    const paddingClasses = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };

    const combinedClasses = `
    ${baseClasses}
    ${backgroundClasses[background]}
    ${shadowClasses}
    ${borderClasses}
    ${hoverClasses}
    ${clickableClasses}
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <div
            className={combinedClasses}
            onClick={onClick}
            {...(clickable
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-pressed': false,
                    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
                        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            onClick();
                        }
                    }
                }
                : {}
            )}
        >
            {children}
        </div>
    );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
    <div className={`border-b border-gray-200 pb-3 mb-3 ${className}`}>
        {children}
    </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
    <div className={`flex-1 ${className}`}>
        {children}
    </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
    <div className={`border-t border-gray-200 pt-3 mt-3 ${className}`}>
        {children}
    </div>
);

// Export named components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
