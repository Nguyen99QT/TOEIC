import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CollaboratorLayout from '../../components/layouts/CollaboratorLayout';
import StatsCard from '../../components/ui/StatsCard';
import QuickActions from '../../components/collaborator/QuickActions';
import RecentActivity from '../../components/collaborator/RecentActivity';
import ContentOverview from '../../components/collaborator/ContentOverview';

interface DashboardStats {
  totalFlashcardSets: number;
  totalFlashcards: number;
  totalLessons: number;
  totalUsers: number;
  recentActivities: any[];
}

const CollaboratorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalFlashcardSets: 0,
    totalFlashcards: 0,
    totalLessons: 0,
    totalUsers: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls to get dashboard stats
      // const response = await collaboratorService.getDashboardStats();
      // setStats(response);
      
      // Mock data for now
      setStats({
        totalFlashcardSets: 25,
        totalFlashcards: 1250,
        totalLessons: 40,
        totalUsers: 150,
        recentActivities: [
          { id: 1, type: 'flashcard_created', description: 'Created new flashcard set "Business English"', timestamp: new Date() },
          { id: 2, type: 'lesson_updated', description: 'Updated lesson "TOEIC Reading Part 5"', timestamp: new Date() },
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollaboratorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {typeof currentUser === 'object' && currentUser?.username ? currentUser.username : 'Collaborator'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your content and track user engagement
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/collaborator/content"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Content
            </Link>
            <Link
              to="/collaborator/analytics"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Flashcard Sets"
            value={stats.totalFlashcardSets}
            icon="📚"
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Total Flashcards"
            value={stats.totalFlashcards}
            icon="🃏"
            color="green"
            trend="+8%"
          />
          <StatsCard
            title="Lessons"
            value={stats.totalLessons}
            icon="📖"
            color="purple"
            trend="+5%"
          />
          <StatsCard
            title="Active Users"
            value={stats.totalUsers}
            icon="👥"
            color="orange"
            trend="+15%"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Content Overview */}
          <div className="lg:col-span-2">
            <ContentOverview />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <RecentActivity activities={stats.recentActivities} />
        </div>
      </div>
    </CollaboratorLayout>
  );
};

export default CollaboratorDashboard;