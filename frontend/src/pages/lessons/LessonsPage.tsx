/**
 * ================================================================
 * LESSONS LIST PAGE COMPONENT
 * ================================================================
 * Hiển thị danh sách tất cả các bài học từ backend
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { lessonService } from '../../services/lessons';
import { Lesson } from '../../types';

const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const breadcrumbItems = useBreadcrumb();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('ALL');

  // Utility functions
  // Chỉ coi B2, C1, C2 là premium
  const isLessonPremium = (level: string): boolean => {
    return ['B2', 'C1', 'C2'].includes(level);
  };

  // A1, A2, B1 là basic cho user thường
  const isBasicLevel = (level: string): boolean => {
    return ['A1', 'A2', 'B1'].includes(level);
  };

  const canAccessLesson = (lesson: Lesson): boolean => {
    // Admin can access everything
    if (currentUser?.role === 'ADMIN') {
      return true;
    }

    // Premium users can access everything
    if (currentUser?.membershipType === 'PREMIUM') {
      return true;
    }

    // Free users (registered) có thể truy cập A1-B1
    if (currentUser && currentUser.membershipType === 'FREE') {
      return isBasicLevel(lesson.level);
    }

    // Unregistered users chỉ truy cập được 2 bài đầu A1-A2
    if (!currentUser) {
      return ['A1', 'A2'].includes(lesson.level) && lesson.orderIndex <= 2;
    }

    return false;
  };

  const getLessonRestrictionMessage = (lesson: Lesson): string | null => {
    if (canAccessLesson(lesson)) {
      return null;
    }

    if (!currentUser) {
      if (lesson.orderIndex > 2) {
        return "Please register to access more lessons";
      }
      if (isLessonPremium(lesson.level)) {
        return "Premium content - Register and upgrade to access";
      }
    }

    if (currentUser && currentUser.membershipType === 'FREE') {
      if (isLessonPremium(lesson.level)) {
        return "Premium content - Upgrade to PRE membership";
      }
    }

    return "Access restricted";
  };

  useEffect(() => {
    setLoading(true);
    lessonService.getAllLessons()
      .then(data => setLessons(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    // Filter by access type
    if (filter === 'FREE' && lesson.isPremium) return false;
    if (filter === 'PREMIUM' && !lesson.isPremium) return false;

    // Filter by level
    if (levelFilter !== 'ALL' && lesson.level !== levelFilter) return false;

    return true;
  });

  const handleLessonClick = (lesson: Lesson) => {
    if (!canAccessLesson(lesson)) {
      if (!currentUser) {
        // Redirect to registration for unregistered users
        navigate('/auth/register', {
          state: {
            from: `/lessons/${lesson.id}`,
            message: isLessonPremium(lesson.level)
              ? "Register and upgrade to premium to access advanced lessons"
              : "Register to access more lessons"
          }
        });
        return;
      } else if (currentUser.membershipType === 'FREE' && isLessonPremium(lesson.level)) {
        // Show premium upgrade modal
        showPremiumUpgradeModal(lesson);
        return;
      }
    }

    navigate(`/lessons/${lesson.id}`);
  };

  const showPremiumUpgradeModal = (lesson: Lesson) => {
    const upgradeConfirm = window.confirm(
      `This is a ${lesson.level} level lesson which requires PRE membership.\n\n` +
      `PRE benefits:\n` +
      `• Access to all B1-C2 lessons\n` +
      `• Advanced exercises and tests\n` +
      `• Progress tracking\n` +
      `• Certificate upon completion\n\n` +
      `Would you like to upgrade to PRE membership?`
    );

    if (upgradeConfirm) {
      // Navigate to upgrade page (you can implement this)
      navigate('/upgrade-premium', {
        state: {
          from: `/lessons/${lesson.id}`,
          requestedLesson: lesson
        }
      });
    }
  };

  const formatLevel = (level: string): string => {
    return level;
  };

  const formatDuration = (duration: number): string => {
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
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
          <h1 className="text-3xl font-bold text-gray-900">Error Loading Lessons</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">TOEIC Lessons</h1>
        <p className="mt-2 text-gray-600">
          Improve your English skills with our comprehensive TOEIC lessons.
        </p>

        {/* User access info */}
        {!currentUser ? (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" role="alert">
            <h3 className="font-semibold text-blue-900 mb-2">🎓 Free Access</h3>
            <p className="text-blue-800 text-sm mb-2">
              As a guest, you can access the first 2 A1-A2 lessons for free.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/auth/register')}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                Register for more A1-A2 lessons
              </button>
              <span className="text-blue-600">•</span>
              <button
                onClick={() => navigate('/auth/login')}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                Login here
              </button>
            </div>
          </div>
        ) : currentUser.membershipType === 'FREE' ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
            <h3 className="font-semibold text-green-900 mb-2">✅ FREE Member</h3>
            <p className="text-green-800 text-sm mb-2">
              You have access to all A1-A2 lessons. Upgrade to PRE for B1-C2 content.
            </p>
            <button
              onClick={() => navigate('/upgrade-premium')}
              className="text-green-600 underline text-sm hover:text-green-800"
            >
              Upgrade to PRE membership
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg" role="alert">
            <h3 className="font-semibold text-purple-900 mb-2">🎖️ PRE Member</h3>
            <p className="text-purple-800 text-sm">
              You have full access to all lessons from A1 to C2. Enjoy learning!
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <section aria-labelledby="filters-heading">
        <h2 id="filters-heading" className="sr-only">Filter Options</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="content-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Access Type
            </label>
            <select
              id="content-type-filter"
              name="contentType"
              title="Filter lessons by access type"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | 'FREE' | 'PREMIUM')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Lessons</option>
              <option value="FREE">Basic (A1-A2)</option>
              <option value="PREMIUM">Premium (B1-C2)</option>
            </select>
          </div>

          <div>
            <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-1">
              CEFR Level
            </label>
            <select
              id="level-filter"
              name="level"
              title="Filter lessons by CEFR level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as 'ALL' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Levels</option>
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="sr-only">Available Lessons</h2>
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more lessons.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => {
              const hasAccess = canAccessLesson(lesson);
              const restrictionMessage = getLessonRestrictionMessage(lesson);

              return (
                <article
                  key={lesson.id}
                  className={`card transition-all duration-200 ${hasAccess
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'opacity-75 cursor-not-allowed'
                    }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="card-body">
                    {/* Header with title and badges */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="card-title text-lg">
                        {lesson.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {/* Level badge */}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isBasicLevel(lesson.level)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                          }`}>
                          {lesson.level}
                        </span>

                        {/* Premium badge */}
                        {lesson.isPremium && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                            🔒 PRE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {lesson.description}
                    </p>

                    {/* Lesson details */}
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-medium">{formatLevel(lesson.level)}</span>
                      </div>

                      {lesson.duration && (
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{formatDuration(lesson.duration)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Order:</span>
                        <span className="font-medium">#{lesson.orderIndex}</span>
                      </div>

                      {lesson.progress !== undefined && hasAccess && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Progress:</span>
                            <span className="font-medium">{lesson.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Access restriction warning */}
                    {restrictionMessage && (
                      <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600" role="alert">
                        🔒 {restrictionMessage}
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      className={`w-full text-sm ${hasAccess
                        ? 'btn btn-primary'
                        : 'btn btn-outline opacity-50'
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLessonClick(lesson);
                      }}
                    >
                      {hasAccess ? 'View Lesson' : 'Upgrade to Access'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Stats footer */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Lesson Statistics</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {lessons.length}
              </div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {lessons.filter(l => !l.isPremium).length}
              </div>
              <div className="text-sm text-gray-600">Basic (A1-A2)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {lessons.filter(l => l.isPremium).length}
              </div>
              <div className="text-sm text-gray-600">Premium (B1-C2)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {lessons.filter(l => canAccessLesson(l)).length}
              </div>
              <div className="text-sm text-gray-600">Accessible</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LessonsPage;
