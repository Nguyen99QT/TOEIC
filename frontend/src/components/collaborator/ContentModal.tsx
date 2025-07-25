import React, { useState, useEffect } from 'react';
import { FlashcardSet } from '../../services/collaboratorService';

interface ContentModalProps {
    contentType: 'flashcards' | 'lessons' | 'exercises';
    item: FlashcardSet | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    loading?: boolean;
}

const ContentModal: React.FC<ContentModalProps> = ({
    contentType,
    item,
    isOpen,
    onClose,
    onSave,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficultyLevel: 'BEGINNER',
        category: '',
        isPublic: true,
        isFeatured: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                description: item.description || '',
                difficultyLevel: item.difficultyLevel || 'BEGINNER',
                category: item.category || '',
                isPublic: item.isPublic ?? true,
                isFeatured: item.isFeatured ?? false
            });
        } else {
            setFormData({
                title: '',
                description: '',
                difficultyLevel: 'BEGINNER',
                category: '',
                isPublic: true,
                isFeatured: false
            });
        }
        setErrors({});
    }, [item, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        if (!formData.difficultyLevel) {
            newErrors.difficultyLevel = 'Difficulty level is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSave(formData);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    if (!isOpen) return null;

    const modalTitle = item ? `Edit ${contentType.slice(0, -1)}` : `Create New ${contentType.slice(0, -1)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {modalTitle}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter title..."
                                disabled={loading}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter description..."
                                disabled={loading}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty Level *
                            </label>
                            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty Level *
                            </label>
                            <select
                                id="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.difficultyLevel ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={loading}
                            >
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                            {errors.difficultyLevel && (
                                <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Business, Travel, Academic..."
                                disabled={loading}
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={loading}
                                />
                                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                                    Make this content public
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={loading}
                                />
                                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                                    Feature this content
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    item ? 'Update' : 'Create'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
