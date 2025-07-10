/**
 * ================================================================
 * FLASHCARDS PAGE COMPONENT
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { getCurrentUser } from '../../services/auth';
import { flashcardService } from '../../services/flashcardService'; // Import flashcard service
import { FlashcardSet, User } from '../../types'; // ✅ Import unified types
import { canAccessFlashcardSet } from '../../utils/accessControl'; // Import access control function

const FlashcardsPage: React.FC = () => {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumb();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user first
        const user = getCurrentUser();
        setCurrentUser(user);

        await fetchFlashcardSets(user);
      } catch (err: any) {
        console.error('Error in fetchData:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchFlashcardSets = async (user: User | null) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching flashcard sets...');

      let flashcardSets: FlashcardSet[] = [];

      // Strategy 1: Try to fetch from API
      try {
        if (user) {
          console.log('👤 Authenticated user, fetching all sets...');
          flashcardSets = await flashcardService.getAllSets();
        } else {
          console.log('🌐 Guest user, fetching public sets...');
          flashcardSets = await flashcardService.getPublicSets();
        }

        console.log('✅ API flashcard sets loaded:', flashcardSets.length);

      } catch (apiError: any) {
        console.warn('⚠️ API failed, using fallback data:', apiError.message);

        // Strategy 2: Use fallback data
        flashcardSets = getFallbackFlashcardSets();
      }

      // Strategy 3: Apply access control
      if (user) {
        // Show all sets but mark access restrictions
        flashcardSets = flashcardSets.map(set => ({
          ...set,
          canAccess: canAccessFlashcardSet(set, user)
        }));
      } else {
        // Filter to only public sets for guests
        flashcardSets = flashcardSets.filter(set => set.isPublic && !set.isPremium);
      }

      setFlashcardSets(flashcardSets);
      setError(null);

    } catch (finalError: any) {
      console.error('❌ All strategies failed:', finalError);
      setError('Failed to load flashcard sets');
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackFlashcardSets = (): FlashcardSet[] => {
    return [
      {
        id: 1,
        name: 'Essential Greetings',
        description: 'Basic greeting vocabulary for beginners',
        difficultyLevel: 'BEGINNER',
        isPremium: false,
        isActive: true,
        isPublic: true,
        estimatedTimeMinutes: 15,
        tags: 'greetings,basic,vocabulary',
        viewCount: 156,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1,
        title: 'Essential Greetings'
      },
      {
        id: 2,
        name: 'Common Phrases',
        description: 'Everyday phrases for conversation',
        difficultyLevel: 'BEGINNER',
        isPremium: false,
        isActive: true,
        isPublic: true,
        estimatedTimeMinutes: 20,
        tags: 'phrases,conversation,daily',
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1
      },
      {
        id: 3,
        name: 'Advanced Vocabulary',
        description: 'Complex words for advanced learners',
        difficultyLevel: 'ADVANCED',
        isPremium: true,
        isActive: true,
        isPublic: true,
        estimatedTimeMinutes: 30,
        tags: 'advanced,vocabulary,complex',
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 1
      }
    ];
  };

  const handleStudySet = (setId: number) => {
    console.log(`📚 Navigating to study set ${setId}`);
    navigate(`/flashcards/study/${setId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {currentUser ? 'Your Flashcard Sets' : 'Free Flashcard Sets'}
        </h1>
        <p className="mt-2 text-gray-600">
          {currentUser
            ? 'Study with your personalized flashcard collections'
            : 'Practice with our free flashcard collections'
          }
        </p>

        {/* Authentication Notice */}
        {!currentUser && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 You're viewing free flashcard sets.{' '}
              <button
                onClick={() => navigate('/login')}
                className="underline font-medium hover:text-blue-900"
              >
                Login
              </button>
              {' '}to access all sets and premium content.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Flashcard Sets Grid */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentUser ? 'Available Flashcard Sets' : 'Free Flashcard Sets'}
          </h2>
        </div>
        <div className="card-body">
          {flashcardSets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No flashcard sets available at the moment.</p>
              {!currentUser && (
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 btn btn-primary"
                >
                  Login to Access More Sets
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.map((set) => (
                <div
                  key={set.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Set Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {set.name}
                    </h3>
                    {set.isPremium && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {set.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(set.difficultyLevel)}`}>
                        {set.difficultyLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-700">{set.estimatedTimeMinutes} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Views:</span>
                      <span className="text-gray-700">{set.viewCount}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {set.tags && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {set.tags.split(',').slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                        {set.tags.split(',').length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{set.tags.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStudySet(set.id)}
                      className={`btn btn-sm flex-1 ${set.isPremium && !currentUser?.isPremium
                        ? 'btn-secondary opacity-50 cursor-not-allowed'
                        : 'btn-primary'
                        }`}
                      disabled={set.isPremium && !currentUser?.isPremium}
                    >
                      {set.isPremium && !currentUser?.isPremium
                        ? '🔒 Premium Required'
                        : '📚 Study Set'
                      }
                    </button>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-400 mt-3">
                    Created: {formatDate(set.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {!currentUser && flashcardSets.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want Access to More Flashcards?
          </h3>
          <p className="text-gray-600 mb-4">
            Join our community to access premium flashcard sets and track your progress.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-outline"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
