/**
 * ================================================================
 * BREADCRUMB COMPONENT
 * ================================================================
 * 
 * Reusable breadcrumb navigation component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav className={`flex ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {/* Home link */}
                <li>
                    <Link
                        to="/"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HomeIcon className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {/* Breadcrumb items */}
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                        {item.href && !item.current ? (
                            <Link
                                to={item.href}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={`${item.current
                                        ? 'text-gray-900 font-medium'
                                        : 'text-gray-500'
                                    }`}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
