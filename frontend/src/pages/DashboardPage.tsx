/**
 * ================================================================
 * DASHBOARD PAGE COMPONENT
 * ================================================================
 */

import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { useBreadcrumb } from '../hooks/useBreadcrumb';
import apiClient from '../services/apiClient';
import dashboardService, { DashboardStats, RecentActivity } from '../services/dashboard';

const DashboardPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const breadcrumbItems = useBreadcrumb();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return; // Chỉ fetch khi đã đăng nhập

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lesson':
        return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
      case 'test':
        return <AcademicCapIcon className="w-5 h-5 text-green-500" />;
      case 'flashcard':
        return <SparklesIcon className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-500 text-xl mb-4">Failed to load dashboard</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb Navigation */}
      <motion.div variants={cardVariants}>
        <Breadcrumb items={breadcrumbItems} />
      </motion.div>

      {/* Header */}
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your learning progress</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={cardVariants}
      >
        {/* Lessons Completed */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.lessonsCompleted}</p>
              <p className="text-sm text-green-600">+{stats.weeklyProgress.lessonsThisWeek} this week</p>
            </div>
            <BookOpenIcon className="w-12 h-12 text-blue-500" />
          </div>
        </motion.div>

        {/* Practice Tests */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practice Tests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.practiceTests}</p>
              <p className="text-sm text-green-600">+{stats.weeklyProgress.testsThisWeek} this week</p>
            </div>
            <AcademicCapIcon className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
              <p className="text-sm text-green-600">+{stats.weeklyProgress.scoreImprovement} improvement</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-purple-500" />
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-3xl font-bold text-gray-900">{stats.studyStreak}</p>
              <p className="text-sm text-gray-500">days in a row</p>
            </div>
            <FireIcon className="w-12 h-12 text-orange-500" />
          </div>
        </motion.div>
      </motion.div>

      {/* Study Time & Quick Actions */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={cardVariants}
      >
        {/* Study Time */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Study Time</h3>
            <ClockIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Time</span>
              <span className="font-semibold">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="font-semibold text-blue-600">8h 45m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Average</span>
              <span className="font-semibold text-green-600">1h 15m</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center space-x-3">
                <BookOpenIcon className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Continue Learning</span>
              </div>
            </motion.button>
            <motion.button
              className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Take Practice Test</span>
              </div>
            </motion.button>
            <motion.button
              className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">Study Flashcards</span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-lg shadow-lg"
        variants={cardVariants}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <ArrowTrendingUpIcon className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        <div className="p-6">
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity: RecentActivity) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {activity.score && (
                      <p className="text-sm font-medium text-green-600">
                        {activity.score}%
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity yet</p>
              <p className="text-sm text-gray-400">Start learning to see your progress here!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});