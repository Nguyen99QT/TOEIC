import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard, FlashcardSet, StudySession } from '../../types';
import FlashcardCard from '../ui/FlashcardCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import flashcardService from '../../services/flashcardService';

const FlashcardStudy: React.FC = () => {
    const { setId } = useParams<{ setId: string }>();
    const navigate = useNavigate();

    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studySession, setStudySession] = useState<StudySession | null>(null);

    useEffect(() => {
        if (setId) {
            loadFlashcardSet(parseInt(setId));
        }
    }, [setId]);

    const loadFlashcardSet = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            // Load flashcard set
            const set = await flashcardService.getSetById(id);
            setFlashcardSet(set);

            // Load flashcards for this set
            const cards = await flashcardService.getFlashcards(id);
            if (cards.length === 0) {
                setError('No flashcards found in this set');
                return;
            }

            setFlashcards(cards);

            // Initialize study session - FIX: Add wrongAnswers and studiedCards
            const session: StudySession = {
                setId: id,
                currentCardIndex: 0,
                totalCards: cards.length,
                correctAnswers: 0,
                wrongAnswers: 0, // FIX: Add wrongAnswers
                startedAt: new Date().toISOString(),
                studyMode: 'STUDY',
                isCompleted: false,
                studiedCards: new Set() // FIX: Add studiedCards
            };
            setStudySession(session);

        } catch (err: any) {
            console.error('Error loading flashcard set:', err);
            setError('Failed to load flashcard set');
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setShowAnswer(!showAnswer);
    };

    const handleNext = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowAnswer(false);
        }
    };

    const handleMarkKnown = () => {
        if (studySession) {
            const updatedSession = {
                ...studySession,
                correctAnswers: studySession.correctAnswers + 1
            };
            setStudySession(updatedSession);
        }

        // Auto advance to next card
        if (currentCardIndex < flashcards.length - 1) {
            handleNext();
        } else {
            // Completed the set
            handleCompleteSession();
        }
    };

    const handleMarkUnknown = () => {
        // Just advance to next card without incrementing correct answers
        if (currentCardIndex < flashcards.length - 1) {
            handleNext();
        } else {
            // Completed the set
            handleCompleteSession();
        }
    };

    const handleCompleteSession = () => {
        if (studySession) {
            const updatedSession = {
                ...studySession,
                isCompleted: true
            };
            setStudySession(updatedSession);
        }
    };

    const handleRestart = () => {
        setCurrentCardIndex(0);
        setShowAnswer(false);
        if (studySession) {
            const newSession: StudySession = {
                ...studySession,
                currentCardIndex: 0,
                correctAnswers: 0,
                wrongAnswers: 0, // FIX: Add wrongAnswers
                startedAt: new Date().toISOString(),
                isCompleted: false,
                studiedCards: new Set() // FIX: Add studiedCards
            };
            setStudySession(newSession);
        }
    };

    const handleBackToSets = () => {
        navigate('/flashcards');
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (!studySession || !flashcardSet) return;

        // FIX: Use flashcards array instead of flashcardSet.flashcards
        const currentCard = flashcards[currentCardIndex];
        const newStudiedCards = new Set(studySession.studiedCards);
        newStudiedCards.add(currentCard.id);

        setStudySession(prev => ({
            ...prev!,
            correctAnswers: prev!.correctAnswers + (isCorrect ? 1 : 0),
            wrongAnswers: prev!.wrongAnswers + (isCorrect ? 0 : 1), // FIX: Now exists
            studiedCards: newStudiedCards // FIX: Now exists
        }));

        // Auto advance to next card
        setTimeout(() => {
            handleNext();
        }, 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button
                        onClick={handleBackToSets}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Flashcard Sets
                    </button>
                </div>
            </div>
        );
    }

    if (!flashcardSet || flashcards.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">No flashcards available</div>
                    <button
                        onClick={handleBackToSets}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Flashcard Sets
                    </button>
                </div>
            </div>
        );
    }

    // Show completion screen
    if (studySession?.isCompleted) {
        const accuracy = studySession.totalCards > 0 ? (studySession.correctAnswers / studySession.totalCards) * 100 : 0;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Study Session Complete!
                    </h2>
                    <div className="space-y-2 mb-6">
                        <p className="text-gray-600">
                            <strong>Set:</strong> {flashcardSet.name}
                        </p>
                        <p className="text-gray-600">
                            <strong>Cards Studied:</strong> {studySession.totalCards}
                        </p>
                        <p className="text-gray-600">
                            <strong>Known Cards:</strong> {studySession.correctAnswers}
                        </p>
                        <p className="text-gray-600">
                            <strong>Accuracy:</strong> {accuracy.toFixed(1)}%
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleRestart}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Study Again
                        </button>
                        <button
                            onClick={handleBackToSets}
                            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Sets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <button
                        onClick={handleBackToSets}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Flashcard Sets
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {flashcardSet.name}
                    </h1>
                    {flashcardSet.description && (
                        <p className="text-gray-600">{flashcardSet.description}</p>
                    )}
                </div>

                {/* Study progress */}
                {studySession && (
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center space-x-4 bg-white rounded-lg px-6 py-3 shadow-sm">
                            <span className="text-sm text-gray-600">
                                Session Progress: {currentCardIndex + 1}/{studySession.totalCards}
                            </span>
                            <span className="text-sm text-gray-600">
                                Known: {studySession.correctAnswers}
                            </span>
                        </div>
                    </div>
                )}

                {/* Flashcard */}
                <FlashcardCard
                    flashcard={currentCard}
                    showAnswer={showAnswer}
                    onFlip={handleFlip}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onMarkKnown={handleMarkKnown}
                    onMarkUnknown={handleMarkUnknown}
                    isFirstCard={currentCardIndex === 0}
                    isLastCard={currentCardIndex === flashcards.length - 1}
                    currentIndex={currentCardIndex}
                    totalCards={flashcards.length}
                    onAnswer={handleAnswer}
                />
            </div>
        </div>
    );
};

export default FlashcardStudy;
