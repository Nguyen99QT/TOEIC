import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessonService } from '../services/lessons';
import { Lesson } from '../types';
import LessonCard from '../components/cards/LessonCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LessonList: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        loadLessons();
    }, [isAuthenticated]);

    const loadLessons = async () => {
        try {
            console.log('🔄 Loading lessons...');
            setLoading(true);

            let loadedLessons: Lesson[] = [];
            if (isAuthenticated) {
                loadedLessons = await lessonService.getAllLessons();
            } else {
                loadedLessons = await lessonService.getAllPublicLessons();
            }

            console.log('✅ Lessons loaded:', loadedLessons.length);
            setLessons(loadedLessons);
        } catch (error) {
            console.error('❌ Error loading lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonClick = (lesson: Lesson) => {
        if (isAuthenticated) {
            navigate(`/lessons/${lesson.id}`);
        } else {
            navigate('/login');
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            await loadLessons();
            return;
        }

        try {
            console.log(`🔍 Searching lessons: "${searchTerm}"`);
            setLoading(true);
            // Since we don't have a search API, filter locally
            await loadLessons();
        } catch (error) {
            console.error('❌ Error searching lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLessons = lessons.filter(lesson => {
        const matchesDifficulty = selectedDifficulty === 'all' ||
            lesson.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

        const matchesCategory = selectedCategory === 'all' ||
            lesson.type?.toLowerCase() === selectedCategory.toLowerCase() ||
            lesson.level?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch = !searchTerm.trim() ||
            lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDifficulty && matchesCategory && matchesSearch;
    });

    const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
    const categories = ['all', 'reading', 'listening', 'grammar', 'vocabulary'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
                            📖 TOEIC Lessons
                        </h1>
                        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                            Master TOEIC skills with our comprehensive lesson collection designed by experts
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <motion.div
                    className="bg-white rounded-lg shadow-sm p-6 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search lessons..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔍</span>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div className="md:w-48">
                            <label htmlFor="difficulty-select" className="sr-only">Select difficulty level</label>
                            <select
                                id="difficulty-select"
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                title="Select difficulty level"
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="md:w-48">
                            <label htmlFor="category-select" className="sr-only">Select category</label>
                            <select
                                id="category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                title="Select lesson category"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </motion.div>

                {/* Results Summary */}
                <motion.div
                    className="mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <p className="text-gray-600">
                        Showing {filteredLessons.length} of {lessons.length} lessons
                    </p>
                </motion.div>

                {/* Lessons Grid */}
                {filteredLessons.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {filteredLessons.map((lesson, index) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                            >
                                <LessonCard
                                    lesson={lesson}
                                    onClick={() => handleLessonClick(lesson)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-16"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-gray-400 text-4xl">📖</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                            {searchTerm ? 'No lessons found' : 'No lessons available'}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {searchTerm
                                ? `No lessons match your search "${searchTerm}". Try different keywords or filters.`
                                : isAuthenticated
                                    ? "We're working on creating amazing lessons for you. Check back soon!"
                                    : "Sign up to access our comprehensive lesson library and start your TOEIC journey."
                            }
                        </p>
                        {searchTerm ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedDifficulty('all');
                                    setSelectedCategory('all');
                                    loadLessons();
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        ) : !isAuthenticated ? (
                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Get Started Free
                            </button>
                        ) : null}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LessonList;
