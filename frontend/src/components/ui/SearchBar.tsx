import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
    onSearch: (searchTerm: string, filters: SearchFilters) => void;
    placeholder?: string;
    className?: string;
}

interface SearchFilters {
    category?: string;
    difficulty?: string;
    isPublic?: boolean;
    isPremium?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Tìm kiếm flashcard sets...",
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(() => {
            onSearch(searchTerm, filters);
            setIsSearching(false);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, filters, onSearch]);

    const handleClearSearch = () => {
        setSearchTerm('');
        setFilters({});
        searchInputRef.current?.focus();
    };

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === '' ? undefined : value
        }));
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className={`relative ${className}`}>
            {/* Main Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />

                <div className="absolute inset-y-0 right-0 flex items-center">
                    {/* Loading indicator */}
                    {isSearching && (
                        <div className="mr-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                            />
                        </div>
                    )}

                    {/* Clear button */}
                    {(searchTerm || activeFiltersCount > 0) && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="mr-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}                    {/* Filter button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`mr-3 p-1 rounded transition-colors ${showFilters || activeFiltersCount > 0
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="relative">
                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Bộ lọc nâng cao</h4>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={() => setFilters({})}
                                        className="text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        Xóa tất cả
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục
                                    </label>
                                    <select
                                        value={filters.category || ''}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        aria-label="Category filter"
                                        title="Filter by category"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="vocabulary">Từ vựng</option>
                                        <option value="grammar">Ngữ pháp</option>
                                        <option value="listening">Nghe</option>
                                        <option value="reading">Đọc</option>
                                        <option value="business">Kinh doanh</option>
                                    </select>
                                </div>

                                {/* Difficulty Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Độ khó
                                    </label>
                                    <select
                                        value={filters.difficulty || ''}
                                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        aria-label="Difficulty filter"
                                        title="Filter by difficulty"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="BEGINNER">Cơ bản</option>
                                        <option value="INTERMEDIATE">Trung cấp</option>
                                        <option value="ADVANCED">Nâng cao</option>
                                    </select>
                                </div>

                                {/* Public Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại
                                    </label>
                                    <select
                                        value={filters.isPublic === undefined ? '' : filters.isPublic.toString()}
                                        onChange={(e) => handleFilterChange('isPublic', e.target.value === '' ? undefined : e.target.value === 'true')}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        aria-label="Visibility filter"
                                        title="Filter by visibility"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="true">Công khai</option>
                                        <option value="false">Riêng tư</option>
                                    </select>
                                </div>

                                {/* Premium Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Premium
                                    </label>
                                    <select
                                        value={filters.isPremium === undefined ? '' : filters.isPremium.toString()}
                                        onChange={(e) => handleFilterChange('isPremium', e.target.value === '' ? undefined : e.target.value === 'true')}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        aria-label="Premium filter"
                                        title="Filter by premium status"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="false">Miễn phí</option>
                                        <option value="true">Premium</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
