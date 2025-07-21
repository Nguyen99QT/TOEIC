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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Flashcard Study - Set {setId}
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">
                        Flashcard study functionality will be implemented here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlashcardStudyPage;
