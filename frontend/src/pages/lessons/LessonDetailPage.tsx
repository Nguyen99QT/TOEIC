/**
 * ================================================================
 * LESSON DETAIL PAGE COMPONENT
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthenticatedAudio, AuthenticatedImage } from '../../components/media/AuthenticatedMedia';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { lessonService } from '../../services/lessons';
import { Lesson } from '../../types';

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingLesson, setStartingLesson] = useState(false);
  const { currentUser } = useAuth();
  const breadcrumbItems = useBreadcrumb();

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) {
        setError('Lesson ID not found');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const lessonData = await lessonService.getLessonById(parseInt(id));

        // ✅ Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Lesson loaded:', lessonData.title, {
            hasImage: !!lessonData.imageUrl,
            hasAudio: !!lessonData.audioUrl
          });
        }

        setLesson(lessonData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching lesson:', err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleStartLesson = async () => {
    if (!lesson) return;

    if (lesson.isPremium && (!currentUser || !currentUser.isPremium)) {
      alert('This is a premium lesson. Please upgrade your account to access premium content.');
      return;
    }

    if (!currentUser && lesson.id && lesson.id > 2) {
      alert('Please register and log in to access more lessons. Free users can only access the first 2 basic lessons.');
      return;
    }

    setStartingLesson(true);

    try {
      navigate(`/lessons/${lesson.id}/exercises`);
    } catch (error) {
      console.error('Error starting lesson:', error);
      alert('Failed to start lesson. Please try again.');
    } finally {
      setStartingLesson(false);
    }
  };

  const handleTakeNotes = () => {
    alert('Notes feature coming soon! You can use a separate note-taking app for now.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Detail</h1>
          <p className="mt-2 text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Not Found</h1>
          <p className="mt-2 text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="mt-2 text-gray-600">Level: {lesson.level} {lesson.isPremium && '🔒 Premium'}</p>

        {lesson.isPremium && (!currentUser || !currentUser.isPremium) && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              🔒 This is a premium lesson. Upgrade your account to access premium content.
            </p>
          </div>
        )}

        {!currentUser && lesson.id && lesson.id > 2 && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              ℹ️ Please register and log in to access more lessons. Free users can access the first 2 basic lessons.
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-body space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{lesson.description}</p>
          </div>

          {lesson.content && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Content</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{lesson.content}</p>
              </div>
            </div>
          )}

          {/* Visual Content với Authentication */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Visual Content</h2>
            {lesson.imageUrl ? (
              <div className="space-y-2">
                <AuthenticatedImage
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="w-full max-w-md rounded-lg shadow-md"
                  onLoad={() => console.log('✅ Image loaded successfully:', lesson.imageUrl)}
                  onError={(error) => console.error('❌ Image failed to load:', error)}
                  fallback={
                    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-8 text-center max-w-md">
                      <div className="flex flex-col items-center text-white">
                        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium">Image Unavailable</p>
                        <p className="text-xs opacity-90 mt-1">{lesson.title}</p>
                      </div>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No image available for this lesson</p>
                </div>
              </div>
            )}
          </div>

          {/* Audio Content với Authentication */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Audio Content</h2>
            {lesson.audioUrl ? (
              <div className="space-y-2">
                <AuthenticatedAudio
                  src={lesson.audioUrl}
                  className="w-full mb-2"
                  preload="metadata"
                  fallback={
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6 3 3 0 000-6zm0 0V5a2 2 0 012-2h2m-2 4v6m0-6h4" />
                        </svg>
                        <p className="text-red-800 text-sm font-medium">Audio Unavailable</p>
                        <p className="text-red-600 text-xs mt-1">Unable to load audio for this lesson</p>
                      </div>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6 3 3 0 000-6zm0 0V5a2 2 0 012-2h2m-2 4v6m0-6h4" />
                  </svg>
                  <p className="text-gray-500 text-sm">No audio available for this lesson</p>
                  <p className="text-gray-400 text-xs mt-1">Audio may still be processing or unavailable</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              className="btn btn-primary flex items-center justify-center"
              onClick={handleStartLesson}
              disabled={startingLesson}
            >
              {startingLesson ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Starting...</span>
                </>
              ) : (
                'Start Lesson'
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleTakeNotes}
            >
              Take Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
