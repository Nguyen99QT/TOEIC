/**
 * ================================================================
 * FLASHCARD STUDY PAGE COMPONENT
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import apiClient from '../../services/api';
import { Flashcard, FlashcardSet } from '../../types'; // ✅ Import unified types

const FlashcardStudyPage: React.FC = () => {
    const { setId } = useParams<{ setId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const breadcrumbItems = useBreadcrumb();

    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`🔍 Fetching flashcard set ${setId}...`);

                // Strategy 1: Try to get flashcard set with flashcards from backend
                try {
                    // First get the flashcard set info
                    const setResponse = await apiClient.get(`/flashcards/sets/${setId}`);
                    console.log('✅ Flashcard set response:', setResponse.data);

                    // Then get the flashcards for this set
                    const flashcardsResponse = await apiClient.get(`/flashcards/sets/${setId}/flashcards`);
                    console.log('✅ Flashcards response:', flashcardsResponse.data);

                    // Combine set info with flashcards
                    const completeSet = {
                        ...setResponse.data,
                        flashcards: flashcardsResponse.data || []
                    };

                    if (completeSet.flashcards && completeSet.flashcards.length > 0) {
                        console.log(`✅ Found ${completeSet.flashcards.length} flashcards for set ${setId}`);
                        setFlashcardSet(completeSet);
                        return;
                    } else {
                        console.warn(`⚠️ No flashcards found for set ${setId}, trying alternative endpoints...`);
                    }
                } catch (apiError: any) {
                    console.error('❌ API Error:', apiError.response?.status, apiError.message);
                }

                // Strategy 2: Try free endpoint if authenticated endpoint fails
                try {
                    console.log(`🔓 Trying free flashcard set ${setId}...`);
                    const response = await apiClient.get(`/flashcards/free/${setId}`);

                    if (response.data && response.data.flashcards && response.data.flashcards.length > 0) {
                        console.log(`✅ Found free set with ${response.data.flashcards.length} flashcards`);
                        setFlashcardSet(response.data);
                        return;
                    }
                } catch (freeError: any) {
                    console.warn('❌ Free endpoint also failed:', freeError.response?.status);
                }

                // Strategy 3: Only use fallback if NO data from backend
                console.log('⚠️ Using fallback data - please check if database has flashcards for set', setId);
                throw new Error('No flashcards found in database - using demo data');

            } catch (err: any) {
                console.error('❌ All strategies failed, using fallback data:', err.message);
                setError('Using demo data - database connection issue');

                // Fallback data (keep existing fallback logic)...

                // ✅ Updated fallback data with all required properties
                const fallbackFlashcards: Flashcard[] = [
                    {
                        id: 1,
                        setId: parseInt(setId!), // ✅ Use setId instead of flashcardSetId
                        frontText: 'Hello',
                        backText: 'A greeting used when meeting someone',
                        hint: 'A common greeting', // ✅ Now hint is allowed
                        imageUrl: '/images/hello.jpg',
                        audioUrl: '/audio/hello.mp3',
                        difficultyLevel: 'BEGINNER',
                        tags: 'greeting,basic,conversation', // ✅ Now tags is allowed
                        orderIndex: 1,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        flashcardSetId: parseInt(setId!) // ✅ Keep for compatibility
                    },
                    {
                        id: 2,
                        setId: parseInt(setId!),
                        frontText: 'Thank you',
                        backText: 'An expression of gratitude',
                        hint: 'Used to show appreciation', // ✅ Now hint is allowed
                        imageUrl: '/images/thankyou.jpg',
                        audioUrl: '/audio/thankyou.mp3',
                        difficultyLevel: 'BEGINNER',
                        tags: 'politeness,basic,gratitude', // ✅ Now tags is allowed
                        orderIndex: 2,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        flashcardSetId: parseInt(setId!)
                    },
                    {
                        id: 3,
                        setId: parseInt(setId!),
                        frontText: 'Goodbye',
                        backText: 'A farewell expression',
                        hint: 'Used when leaving or ending a conversation', // ✅ Now hint is allowed
                        imageUrl: '/images/goodbye.jpg',
                        audioUrl: '/audio/goodbye.mp3',
                        difficultyLevel: 'BEGINNER',
                        tags: 'farewell,basic,conversation', // ✅ Now tags is allowed
                        orderIndex: 3,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        flashcardSetId: parseInt(setId!)
                    }
                ];

                // ✅ Updated fallback set with all required properties
                const fallbackSet: FlashcardSet = {
                    id: parseInt(setId!),
                    name: 'Essential Greetings Flashcards',
                    title: 'Essential Greetings Flashcards', // ✅ Add title for compatibility
                    description: 'Basic greeting vocabulary for beginners',
                    difficultyLevel: 'BEGINNER',
                    isPremium: false,
                    isPublic: true, // ✅ Add required isPublic property
                    estimatedTimeMinutes: 15,
                    tags: 'greetings,basic,vocabulary,essential',
                    viewCount: 0,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: 1,
                    flashcards: fallbackFlashcards
                };

                setFlashcardSet(fallbackSet);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcardSet();
    }, [setId, isAuthenticated]);

    const handleNext = () => {
        if (flashcardSet && flashcardSet.flashcards && currentCardIndex < flashcardSet.flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };


    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleFinishStudy = () => {
        // Record study session
        if (isAuthenticated && flashcardSet) {
            apiClient.post(`/flashcards/sets/${flashcardSet.id}/complete`).catch(console.error);
        }
        navigate('/flashcards');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // ✅ Fix error check to include flashcards validation
    if (error || !flashcardSet || !flashcardSet.flashcards || flashcardSet.flashcards.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Flashcards</h2>
                    <p className="text-red-600 mb-4">
                        {error ||
                            !flashcardSet ? 'Flashcard set not found' :
                            'No flashcards available in this set'}
                    </p>
                    <button
                        onClick={() => navigate('/flashcards')}
                        className="btn btn-primary"
                    >
                        Back to Flashcards
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Now we can safely access flashcards - TypeScript knows it's not undefined
    const currentCard = flashcardSet.flashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / flashcardSet.flashcards.length) * 100;

    // Debug: Log current card media URLs
    console.log('🎯 Current card media:', {
        frontText: currentCard.frontText,
        imageUrl: currentCard.imageUrl,
        audioUrl: currentCard.audioUrl,
        fullImagePath: currentCard.imageUrl ? `http://localhost:8080${currentCard.imageUrl}` : null,
        fullAudioPath: currentCard.audioUrl ? `http://localhost:8080${currentCard.audioUrl}` : null
    });


    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className="mb-4" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/flashcards')}
                        className="btn btn-secondary"
                    >
                        ← Back to Sets
                    </button>
                    <div className="text-sm text-gray-500">
                        Card {currentCardIndex + 1} of {flashcardSet.flashcards.length}
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {flashcardSet.title || flashcardSet.name}
                </h1>
                <p className="text-gray-600">{flashcardSet.description}</p>

                {/* Set Info */}
                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    {flashcardSet.estimatedTimeMinutes && (
                        <span>⏱️ {flashcardSet.estimatedTimeMinutes} min</span>
                    )}
                    {flashcardSet.viewCount !== undefined && (
                        <span>👀 {flashcardSet.viewCount} views</span>
                    )}
                    {flashcardSet.isPublic ? (
                        <span>🌐 Public</span>
                    ) : (
                        <span>🔒 Private</span>
                    )}
                    {flashcardSet.isPremium && (
                        <span>⭐ Premium</span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
                <div className="relative">
                    <div
                        className={`card min-h-80 cursor-pointer transition-transform duration-300 ${isFlipped ? 'scale-95' : ''
                            }`}
                        onClick={handleFlip}
                    >
                        <div className="card-body flex items-center justify-center text-center">
                            {!isFlipped ? (
                                /* Front of card */
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        {currentCard.frontText}
                                    </h2>
                                    {currentCard.imageUrl && (
                                        <img
                                            src={`http://localhost:8080${currentCard.imageUrl}`}
                                            alt={currentCard.frontText}
                                            className="max-w-xs mx-auto rounded-lg mb-4"
                                            onError={(e) => {
                                                console.warn('Failed to load image:', currentCard.imageUrl);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                            onLoad={() => {
                                                console.log('Image loaded successfully:', currentCard.imageUrl);
                                            }}
                                        />
                                    )}
                                    {/* ✅ Now hint access is safe */}
                                    {currentCard.hint && (
                                        <p className="text-sm text-blue-600 mb-4">
                                            💡 {currentCard.hint}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-6">Click to see answer</p>
                                </div>
                            ) : (
                                /* Back of card */
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                        {currentCard.frontText}
                                    </h3>
                                    <p className="text-lg text-gray-900 mb-4">
                                        {currentCard.backText}
                                    </p>

                                    {/* Audio Player */}
                                    {currentCard.audioUrl && (
                                        <div className="mb-4">
                                            <audio
                                                controls
                                                className="mx-auto"
                                                preload="none"
                                                onError={(e) => {
                                                    console.warn('Failed to load audio:', currentCard.audioUrl);
                                                }}
                                                onLoadedData={() => {
                                                    console.log('Audio loaded successfully:', currentCard.audioUrl);
                                                }}
                                            >
                                                <source src={`http://localhost:8080${currentCard.audioUrl}`} type="audio/mpeg" />
                                                <source src={`http://localhost:8080${currentCard.audioUrl}`} type="audio/wav" />
                                                <source src={`http://localhost:8080${currentCard.audioUrl}`} type="audio/ogg" />
                                                Your browser does not support audio playback.
                                            </audio>
                                            <p className="text-xs text-gray-500 mt-1 text-center">🔊 Click play to hear pronunciation</p>
                                        </div>
                                    )}

                                    {/* Back side image (if different from front) */}
                                    {currentCard.imageUrl && (
                                        <img
                                            src={`http://localhost:8080${currentCard.imageUrl}`}
                                            alt={currentCard.backText}
                                            className="max-w-xs mx-auto rounded-lg mb-4"
                                            onError={(e) => {
                                                console.warn('Failed to load back image:', currentCard.imageUrl);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}

                                    {/* ✅ Tags access is now safe */}
                                    {currentCard.tags && (
                                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                                            {currentCard.tags.split(',').map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Difficulty Badge */}
                                    {currentCard.difficultyLevel && (
                                        <span className={`text-xs px-2 py-1 rounded ${currentCard.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                                            currentCard.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {currentCard.difficultyLevel}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Flip indicator */}
                    <div className="absolute top-4 right-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {isFlipped ? 'Answer' : 'Question'}
                        </span>
                    </div>

                    {/* Card order indicator */}
                    {currentCard.orderIndex && (
                        <div className="absolute top-4 left-4">
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                #{currentCard.orderIndex}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentCardIndex === 0}
                    className="btn btn-secondary disabled:opacity-50"
                >
                    ← Previous
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={handleFlip}
                        className="btn btn-outline"
                    >
                        {isFlipped ? 'Show Question' : 'Show Answer'}
                    </button>
                </div>

                {/* ✅ Safe access - we already validated flashcards exists */}
                {currentCardIndex < flashcardSet.flashcards.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="btn btn-primary"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleFinishStudy}
                        className="btn btn-success"
                    >
                        Finish Study
                    </button>
                )}
            </div>

            {/* Study Progress & Set Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                        <strong>Progress:</strong> {Math.round(progress)}%
                    </div>
                    <div>
                        <strong>Set Difficulty:</strong>
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${flashcardSet.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                            flashcardSet.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {flashcardSet.difficultyLevel}
                        </span>
                    </div>
                    <div>
                        <strong>Estimated Time:</strong> {flashcardSet.estimatedTimeMinutes || 'N/A'} min
                    </div>
                </div>

                {/* Set Tags */}
                {flashcardSet.tags && (
                    <div className="mt-3">
                        <strong className="text-sm text-gray-600">Set Tags:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {flashcardSet.tags.split(',').map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Access Info */}
                <div className="mt-3 text-sm text-gray-600">
                    <strong>Access:</strong>
                    <span className="ml-2">
                        {flashcardSet.isPublic ? '🌐 Public' : '🔒 Private'}
                        {flashcardSet.isPremium && ' • ⭐ Premium Required'}
                    </span>
                </div>
            </div>

            {/* Demo Notice for unauthenticated users */}
            {!isAuthenticated && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                        <span className="text-2xl mr-3">ℹ️</span>
                        <div>
                            <h4 className="font-semibold text-yellow-900 mb-2">Guest Mode</h4>
                            <p className="text-yellow-800 text-sm">
                                You're studying as a guest. <a href="/auth/login" className="underline">Sign in</a> to track your progress and access premium content!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardStudyPage;
