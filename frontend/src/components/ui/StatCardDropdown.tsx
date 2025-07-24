import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface StatItem {
    label: string;
    value: string | number;
}

interface DropdownData {
    title: string;
    items: StatItem[];
}

interface StatCardDropdownProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    trend?: string;
    dropdown?: DropdownData;
    className?: string;
}

const StatCardDropdown: React.FC<StatCardDropdownProps> = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    dropdown,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
                onClick={() => dropdown && setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${color}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            {trend && (
                                <p className="text-xs text-green-600 mt-1">{trend}</p>
                            )}
                        </div>
                    </div>
                    {dropdown && (
                        <ChevronDownIcon
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                }`}
                        />
                    )}
                </div>
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && dropdown && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                    >
                        <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-3">{dropdown.title}</h4>
                            <div className="space-y-2">
                                {dropdown.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-1">
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatCardDropdown;
