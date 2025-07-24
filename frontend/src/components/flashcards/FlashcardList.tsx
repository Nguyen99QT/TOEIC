import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardSet, User } from '../../types';
import { getCurrentUser } from '../../services/auth';
import flashcardService from '../../services/flashcardService';
import LoadingSpinner from '../ui/LoadingSpinner';

const FlashcardList: React.FC = () => {
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        loadFlashcardSets();
    }, []);

    const loadFlashcardSets = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current user
            const user = getCurrentUser();
            setCurrentUser(user);

            // Load flashcard sets
            let sets: FlashcardSet[] = [];
            if (user) {
                sets = await flashcardService.getAllSets();
            } else {
                sets = await flashcardService.getPublicSets();
            }

            console.log('🎯 Loaded flashcard sets:', sets);
            setFlashcardSets(sets);
        } catch (err: any) {
            console.error('Error loading flashcard sets:', err);
            setError('Failed to load flashcard sets. Using sample data.');

            // Fallback to sample data
            const sampleSets: FlashcardSet[] = [
                {
                    id: 1,
                    name: 'Basic Nouns',
                    description: 'Common nouns for beginners',
                    isActive: true,
                    isPremium: false,
                    isPublic: true,
                    difficultyLevel: 'BEGINNER',
                    estimatedTimeMinutes: 10,
                    viewCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: 1,
                    totalCards: 4,
                    completedCards: 0,
                    progress: 0,
                },
                {
                    id: 2,
                    name: 'Daily Verbs',
                    description: 'Everyday verbs',
                    isActive: true,
                    isPremium: false,
                    isPublic: true,
                    difficultyLevel: 'BEGINNER',
                    estimatedTimeMinutes: 10,
                    viewCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: 1,
                    totalCards: 4,
                    completedCards: 0,
                    progress: 0,
                }
            ];
            setFlashcardSets(sampleSets);
        } finally {
            setLoading(false);
        }
    };

    const handleStartStudy = (setId: number) => {
        navigate(`/flashcards/${setId}/study`);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toUpperCase()) {
            case 'EASY':
            case 'BEGINNER':
                return 'bg-green-100 text-green-800';
            case 'MEDIUM':
            case 'INTERMEDIATE':
                return 'bg-yellow-100 text-yellow-800';
            case 'HARD':
            case 'ADVANCED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter flashcard sets
    const filteredSets = flashcardSets.filter(set => {
        const matchesSearch = set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            set.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || set.category === selectedCategory;
        const matchesDifficulty = !selectedDifficulty ||
            set.difficultyLevel === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Get unique categories and difficulties for filters
    const categories = Array.from(new Set(flashcardSets.map(set => set.category).filter(Boolean)));
    const difficulties = Array.from(new Set([
        ...flashcardSets.map(set => set.difficultyLevel).filter(Boolean)
    ]));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Flashcard Sets</h1>
                    <p className="text-gray-600 mb-6">
                        Study with interactive flashcards to improve your vocabulary and knowledge.
                    </p>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search flashcard sets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Filter by category"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Filter by difficulty"
                                >
                                    <option value="">All Difficulties</option>
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="text-red-700">{error}</div>
                        <button
                            onClick={loadFlashcardSets}
                            className="mt-2 text-red-600 hover:text-red-800 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Flashcard Sets Grid */}
                {filteredSets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-xl mb-4">
                            {searchTerm || selectedCategory || selectedDifficulty
                                ? 'No flashcard sets match your filters'
                                : 'No flashcard sets available'
                            }
                        </div>
                        {(searchTerm || selectedCategory || selectedDifficulty) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setSelectedDifficulty('');
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSets.map((set) => (
                            <div
                                key={set.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                                {set.name}
                                            </h3>
                                            {set.isPremium && (
                                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {set.description}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Cards:</span>
                                            <span className="text-sm font-medium">{set.totalCards || 0}</span>
                                        </div>

                                        {set.category && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Category:</span>
                                                <span className="text-sm font-medium">{set.category}</span>
                                            </div>
                                        )}

                                        {set.difficultyLevel && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Difficulty:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(set.difficultyLevel)}`}>
                                                    {set.difficultyLevel}
                                                </span>
                                            </div>
                                        )}

                                        {set.estimatedTimeMinutes && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Time:</span>
                                                <span className="text-sm font-medium">{set.estimatedTimeMinutes} min</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleStartStudy(set.id)}
                                            disabled={set.canAccess === false}
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${set.canAccess === false
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            {set.canAccess === false ? 'Premium Required' : 'Start Studying'}
                                        </button>

                                        {/* Access info */}
                                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                            {set.isPublic && (
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                                    </svg>
                                                    Public
                                                </span>
                                            )}
                                            {set.viewCount && (
                                                <span>{set.viewCount} views</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* User info */}
                {!currentUser && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-700 text-sm">
                            📝 <strong>Sign in</strong> to access all flashcard sets and track your progress.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashcardList;
