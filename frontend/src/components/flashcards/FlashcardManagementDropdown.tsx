import React, { useState } from 'react';
import { ChevronDownIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface FlashcardManagementDropdownProps {
    onCreateNew: () => void;
    onEditSet: (id: number) => void;
    onDeleteSet: (id: number) => void;
    onViewAnalytics: () => void;
    selectedSets?: number[];
}

const FlashcardManagementDropdown: React.FC<FlashcardManagementDropdownProps> = ({
    onCreateNew,
    onEditSet,
    onDeleteSet,
    onViewAnalytics,
    selectedSets = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser } = useAuth();

    // Check if user is collaborator or admin
    const isCollaborator = currentUser?.role === 'COLLABORATOR' || currentUser?.role === 'ADMIN';

    if (!isCollaborator) {
        return null; // Don't show for regular users
    }

    const actions = [
        {
            id: 'create',
            label: 'Tạo Flashcard Set Mới',
            icon: PlusIcon,
            onClick: onCreateNew,
            color: 'text-green-600',
            description: 'Tạo bộ flashcard mới'
        },
        {
            id: 'analytics',
            label: 'Xem Thống Kê',
            icon: EyeIcon,
            onClick: onViewAnalytics,
            color: 'text-blue-600',
            description: 'Phân tích hiệu suất học tập'
        },
        {
            id: 'edit',
            label: 'Chỉnh Sửa',
            icon: PencilIcon,
            onClick: () => selectedSets.length > 0 && onEditSet(selectedSets[0]),
            color: 'text-orange-600',
            description: 'Chỉnh sửa flashcard set',
            disabled: selectedSets.length !== 1
        },
        {
            id: 'delete',
            label: 'Xóa',
            icon: TrashIcon,
            onClick: () => selectedSets.length > 0 && onDeleteSet(selectedSets[0]),
            color: 'text-red-600',
            description: 'Xóa flashcard set đã chọn',
            disabled: selectedSets.length === 0
        }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <span className="font-medium">Quản Lý</span>
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <h3 className="font-semibold text-gray-900">Quản Lý Flashcards</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedSets.length > 0
                                        ? `${selectedSets.length} flashcard set đã chọn`
                                        : 'Chọn flashcard set để thực hiện thao tác'
                                    }
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="py-2">
                                {actions.map((action) => (
                                    <motion.button
                                        key={action.id}
                                        onClick={() => {
                                            if (!action.disabled) {
                                                action.onClick();
                                                setIsOpen(false);
                                            }
                                        }}
                                        disabled={action.disabled}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors group ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        whileHover={!action.disabled ? { x: 4 } : {}}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <action.icon className={`w-5 h-5 mt-0.5 ${action.color} group-hover:scale-110 transition-transform`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {action.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {action.description}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="text-xs text-gray-500 text-center">
                                    Quyền: {currentUser?.role} - {actions.filter(a => !a.disabled).length} tính năng khả dụng
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FlashcardManagementDropdown;
