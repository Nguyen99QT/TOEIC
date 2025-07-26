/**
 * ================================================================
 * EXERCISES PAGE COMPONENT
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { exerciseService } from '../../services/exercises';
import { Exercise } from '../../types';

const ExercisesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const breadcrumbItems = useBreadcrumb();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'READING' | 'LISTENING' | 'GRAMMAR' | 'VOCABULARY'>('ALL');

  // Utility functions
  const isExercisePremium = (exercise: Exercise): boolean => {
    // Consider HARD difficulty exercises as premium
    return exercise.difficulty === 'HARD';
  };

  const canAccessExercise = (exercise: Exercise): boolean => {
    // Admin can access everything
    if (currentUser?.role === 'ADMIN') {
      return true;
    }

    // Premium users can access everything
    if (currentUser?.membershipType === 'PREMIUM' || currentUser?.membershipType === 'VIP') {
      return true;
    }

    // If difficulty is null/undefined, allow basic access for first few exercises
    if (!exercise.difficulty) {
      return (exercise.orderIndex || exercise.id) <= 10; // Allow first 10 exercises
    }

    // Basic users can access EASY and MEDIUM exercises
    if (currentUser && currentUser.membershipType === 'BASIC') {
      return ['EASY', 'MEDIUM'].includes(exercise.difficulty || '');
    }

    // Unregistered users can access first 2 EASY exercises
    if (!currentUser) {
      return exercise.difficulty === 'EASY' && (exercise.orderIndex || exercise.id) <= 2;
    }

    return false;
  };

  const getExerciseRestrictionMessage = (exercise: Exercise): string | null => {
    if (canAccessExercise(exercise)) {
      return null;
    }

    if (!currentUser) {
      if ((exercise.orderIndex || 0) > 2) {
        return "Please register to access more exercises";
      }
      if (isExercisePremium(exercise)) {
        return "Premium content - Register and upgrade to access";
      }
    }

    if (currentUser && currentUser.membershipType === 'BASIC') {
      if (isExercisePremium(exercise)) {
        return "Premium content - Upgrade to PREMIUM membership";
      }
    }

    return "Access restricted";
  };

  useEffect(() => {
    const fetchExercises = async () => {
      console.log('🔄 ExercisesPage: Starting to fetch exercises...');
      setLoading(true);
      try {
        const exercisesData = await exerciseService.getAllExercises();
        console.log('✅ ExercisesPage: Successfully loaded exercises:', exercisesData?.length || 0);
        setExercises(exercisesData);
      } catch (err: any) {
        console.error('❌ ExercisesPage: Error loading exercises:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    // Filter by access type
    if (filter === 'FREE' && isExercisePremium(exercise)) return false;
    if (filter === 'PREMIUM' && !isExercisePremium(exercise)) return false;

    // Filter by type
    if (typeFilter !== 'ALL' && exercise.type !== typeFilter) return false;

    return true;
  });

  const handleExerciseClick = (exercise: Exercise) => {
    if (!canAccessExercise(exercise)) {
      const message = getExerciseRestrictionMessage(exercise);
      alert(message || "Access restricted");
      return;
    }

    navigate(`/exercises/${exercise.id}`);
  };

  const formatDuration = (duration: number): string => {
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'READING': return '📖';
      case 'LISTENING': return '🎧';
      case 'GRAMMAR': return '✏️';
      case 'VOCABULARY': return '📝';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'READING': return 'bg-blue-100 text-blue-800';
      case 'LISTENING': return 'bg-green-100 text-green-800';
      case 'GRAMMAR': return 'bg-purple-100 text-purple-800';
      case 'VOCABULARY': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string | null | undefined): string => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Error Loading Exercises</h1>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">TOEIC Exercises</h1>
        <p className="mt-2 text-gray-600">
          Practice with our comprehensive TOEIC exercises to improve your skills.
        </p>
        
        {/* Debug info */}
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
          Debug: Loaded {exercises.length} exercises
        </div>

        {/* User access info */}
        {!currentUser ? (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🎓 Free Access</h3>
            <p className="text-blue-800 text-sm mb-2">
              As a guest, you can access the first 2 A1-A2 exercises for free.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/auth/register')}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                Register for more exercises
              </button>
              <span className="text-blue-600">•</span>
              <button
                onClick={() => navigate('/auth/login')}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                Login
              </button>
            </div>
          </div>
        ) : currentUser.membershipType === 'BASIC' ? (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">🆓 BASIC Membership</h3>
            <p className="text-yellow-800 text-sm mb-2">
              Access EASY and MEDIUM exercises. Upgrade to PREMIUM for HARD exercises.
            </p>
            <button
              onClick={() => navigate('/upgrade-premium')}
              className="text-yellow-600 underline text-sm hover:text-yellow-800"
            >
              Upgrade to PREMIUM
            </button>
          </div>
        ) : null}
      </div>

      {/* Filters */}
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="access-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Access Type
            </label>
            <select
              id="access-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | 'FREE' | 'PREMIUM')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="ALL">All Exercises</option>
              <option value="FREE">Free Exercises</option>
              <option value="PREMIUM">Premium Exercises</option>
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'READING' | 'LISTENING' | 'GRAMMAR' | 'VOCABULARY')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="ALL">All Types</option>
              <option value="READING">Reading</option>
              <option value="LISTENING">Listening</option>
              <option value="GRAMMAR">Grammar</option>
              <option value="VOCABULARY">Vocabulary</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredExercises.length}</span> exercises found
            </div>
          </div>
        </div>
      </section>

      {/* Exercises Grid */}
      <section>
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more exercises.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const hasAccess = canAccessExercise(exercise);
              const restrictionMessage = getExerciseRestrictionMessage(exercise);

              return (
                <article
                  key={exercise.id}
                  className={`card transition-all duration-200 ${
                    hasAccess
                      ? 'hover:shadow-lg cursor-pointer'
                      : 'opacity-75 cursor-not-allowed'
                  }`}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <div className="p-6">
                    {/* Exercise Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {exercise.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exercise.description}
                        </p>
                      </div>
                      <div className="text-3xl ml-3">
                        {getTypeIcon(exercise.type || 'READING')}
                      </div>
                    </div>

                    {/* Exercise Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty || 'General'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type || 'READING')}`}>
                        {exercise.type || 'Reading'}
                      </span>
                      {isExercisePremium(exercise) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Premium
                        </span>
                      )}
                    </div>

                    {/* Exercise Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-3">⏱️ {exercise.timeLimit ? formatDuration(exercise.timeLimit) : '30 min'}</span>
                        <span>📊 {exercise.difficulty}</span>
                      </div>
                      {exercise.totalQuestions && (
                        <span>{exercise.totalQuestions} questions</span>
                      )}
                    </div>

                    {/* Access Status */}
                    {!hasAccess && restrictionMessage && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                        <p className="text-sm text-yellow-800">{restrictionMessage}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        hasAccess
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!hasAccess}
                    >
                      {hasAccess ? 'Start Exercise' : 'Access Restricted'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ExercisesPage;