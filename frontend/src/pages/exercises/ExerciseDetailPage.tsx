/**
 * ================================================================
 * EXERCISE DETAIL PAGE COMPONENT
 * ================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Exercise, Question } from '../../types';
import { exerciseService } from '../../services/exercises';
import { questionService } from '../../services/questions';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import EnhancedButton from '../../components/ui/EnhancedButton';
import AuthDebugChecker from '../../components/debug/AuthDebugChecker';
import AuthTestComponent from '../../components/debug/AuthTestComponent';

const ExerciseDetailPage: React.FC = () => {
  const breadcrumbItems = useBreadcrumb();
  const navigate = useNavigate();
  const { lessonId, exerciseId } = useParams<{ lessonId: string; exerciseId: string }>();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExerciseData = async () => {
      if (!exerciseId) return;

      try {
        setLoading(true);
        const exerciseData = await exerciseService.getExerciseById(Number(exerciseId));
        setExercise(exerciseData);

        const questionsData = await questionService.getQuestionsByExerciseId(Number(exerciseId));
        setQuestions(questionsData);
      } catch (err) {
        console.error('Error loading exercise data:', err);
        setError('Failed to load exercise data');
      } finally {
        setLoading(false);
      }
    };

    loadExerciseData();
  }, [exerciseId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'listening':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'reading':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'vocabulary':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
      case 'grammar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const handleStartExercise = () => {
    if (questions.length > 0) {
      navigate(`/lessons/${lessonId}/exercises/${exerciseId}/questions/${questions[0].id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Exercise</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      {/* Auth Debug Component for Development */}
      <AuthDebugChecker />
      <AuthTestComponent />

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Exercise Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 animate-fade-in-up">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full p-3">
                {getTypeIcon(exercise?.type || '')}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{exercise?.title}</h1>
                <p className="text-gray-600 mt-1">{exercise?.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(exercise?.difficulty || '')}`}>
              {exercise?.difficulty}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {exercise?.type}
            </span>
          </div>
        </div>

        {/* Exercise Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-green-600">{exercise?.timeLimit || 'No limit'}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-2xl font-bold text-purple-600">{questions.reduce((sum, q) => sum + q.points, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Exercise Button */}
        <div className="flex justify-center">
          <EnhancedButton
            onClick={handleStartExercise}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            disabled={questions.length === 0}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V6a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
            Start Exercise
          </EnhancedButton>
        </div>
      </div>

      {/* Fun Section with Illustration */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 p-8 text-center animate-fade-in-up">
        <div className="max-w-md mx-auto">
          {/* Fun Illustration */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-float">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                <span className="text-xs">✨</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-md animate-pulse animation-delay-500">
                <span className="text-xs">🎯</span>
              </div>
              <div className="absolute top-4 -left-4 w-4 h-4 bg-pink-400 rounded-full flex items-center justify-center shadow-md animate-pulse animation-delay-1000">
                <span className="text-xs">💡</span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Ready to Challenge Yourself? 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              This exercise contains <span className="font-semibold text-blue-600">{questions.length} exciting questions</span>
            </p>
            <p className="text-gray-500">
              Click "Start Exercise" above to begin your learning journey!
            </p>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-lg font-bold text-blue-600">{questions.reduce((sum, q) => sum + q.points, 0)}</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-sm text-gray-600">Time Limit</p>
              <p className="text-lg font-bold text-green-600">{exercise?.timeLimit || 'No limit'}</p>
            </div>
          </div>

          {/* Encouragement */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-gray-700 italic">
              "Every expert was once a beginner. Every pro was once an amateur."
            </p>
            <p className="text-sm text-gray-500 mt-2">Good luck with your exercise! 🍀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
