import React from 'react';
import { Flashcard } from '../../types';

interface FlashcardCardProps {
    flashcard: Flashcard;
    showAnswer: boolean;
    onFlip: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onMarkKnown: () => void;
    onMarkUnknown: () => void;
    isFirstCard: boolean;
    isLastCard: boolean;
    currentIndex: number;
    totalCards: number;
    onAnswer: (isCorrect: boolean) => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
    flashcard,
    showAnswer,
    onFlip,
    onNext,
    onPrevious,
    onMarkKnown,
    onMarkUnknown,
    isFirstCard,
    isLastCard,
    currentIndex,
    totalCards,
    onAnswer
}) => {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Card {currentIndex + 1} of {totalCards}</span>
                    <span>{Math.round(((currentIndex + 1) / totalCards) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Flashcard */}
            <div className="relative">
                <div
                    className="bg-white rounded-xl shadow-lg p-8 min-h-[400px] flex flex-col justify-center items-center cursor-pointer transition-transform hover:scale-105"
                    onClick={onFlip}
                >
                    {!showAnswer ? (
                        // Front side - FIX: Use flashcard.front instead of word/term
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-4">FRONT</div>
                            <div className="text-3xl font-bold text-gray-800 mb-4">
                                {flashcard.front || 'No term'}
                            </div>
                            {flashcard.pronunciation && (
                                <div className="text-lg text-gray-600 italic">
                                    /{flashcard.pronunciation}/
                                </div>
                            )}
                        </div>
                    ) : (
                        // Back side - FIX: Use flashcard.back instead of meaning/definition
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-4">BACK</div>
                            <div className="text-xl text-gray-800 mb-4">
                                {flashcard.back || 'No definition'}
                            </div>
                            {flashcard.example && (
                                <div className="text-sm text-gray-600 italic border-t pt-4">
                                    <strong>Example:</strong> {flashcard.example}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Click hint */}
                <div className="text-center mt-4 text-sm text-gray-500">
                    Click card to flip
                </div>
            </div>

            {/* Action buttons */}
            {showAnswer && (
                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={() => onAnswer(false)}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Don't Know
                    </button>
                    <button
                        onClick={() => onAnswer(true)}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Know
                    </button>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={onPrevious}
                    disabled={isFirstCard}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>

                <button
                    onClick={onFlip}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Flip Card
                </button>

                <button
                    onClick={onNext}
                    disabled={isLastCard}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default FlashcardCard;