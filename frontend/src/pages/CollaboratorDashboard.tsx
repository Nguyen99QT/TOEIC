import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  questionText: string;
  partNumber: number;
  correctOption: string;
  audioUrl?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  hidden?: boolean;
}

interface Stats {
  totalQuestions: number;
  questionsByPart: { [key: string]: number };
  recentQuestions: Question[];
  totalBlogs: number;
  recentBlogs: BlogPost[];
}

const CollaboratorDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    questionsByPart: {},
    recentQuestions: [],
    totalBlogs: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('toeic_access_token') || 
                      localStorage.getItem('authToken') ||
                      localStorage.getItem('accessToken');
        if (!token) return;

        // Fetch my questions for stats
        const questionsResponse = await fetch('http://localhost:8080/api/question-bank/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        let questionsData: Question[] = [];
        if (questionsResponse.ok) {
          questionsData = await questionsResponse.json();
        }

        // Fetch blogs stats
        const blogsResponse = await fetch('http://localhost:8080/api/blog', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        let blogsData: BlogPost[] = [];
        if (blogsResponse.ok) {
          blogsData = await blogsResponse.json();
          // Filter blogs by current user
          blogsData = blogsData.filter(blog => blog.author === user?.username);
        }

        // Calculate question stats
        const questionsByPart = questionsData.reduce((acc: { [key: string]: number }, q: Question) => {
          const part = `Part ${q.partNumber}`;
          acc[part] = (acc[part] || 0) + 1;
          return acc;
        }, {});

        const recentQuestions = questionsData
          .sort((a: Question, b: Question) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);

        // Calculate blog stats
        const recentBlogs = blogsData
          .sort((a: BlogPost, b: BlogPost) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 5);

        setStats({
          totalQuestions: questionsData.length,
          questionsByPart,
          recentQuestions,
          totalBlogs: blogsData.length,
          recentBlogs
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.username]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.fullName || user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Content Collaborator Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalQuestions}
          </div>
          <div className="text-sm text-gray-600">Total Questions Created</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalBlogs}
          </div>
          <div className="text-sm text-gray-600">Blog Posts Created</div>
        </div>

        {Object.entries(stats.questionsByPart).slice(0, 2).map(([part, count]) => (
          <div key={part} className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{count as number}</div>
            <div className="text-sm text-gray-600">{part} Questions</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📝</span>
              Question Management
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/add/add-questions"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Question
            </a>
            <a
              href="/add/add-group-questions"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add Question Group
            </a>
            <a
              href="/questions/my"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              View My Questions
            </a>
          </div>
        </div>

        {/* Blog Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">✍️</span>
              Blog Management
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/create-blog"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Create New Blog Post
            </a>
            <a
              href="/blog"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              View All Blog Posts
            </a>
            <a
              href="/collaborator/blogs"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage My Posts
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📊</span>
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">Questions Created</div>
                <div className="text-gray-500">Last 30 days</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {stats.recentQuestions.length}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Blog Posts</div>
                <div className="text-gray-500">Last 30 days</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {stats.recentBlogs.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">🔢</span>
              Recent Questions
            </h2>
          </div>
          <div className="p-6">
            {stats.recentQuestions.length === 0 ? (
              <p className="text-gray-500 text-sm">No questions created yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentQuestions.map((question, index) => (
                  <div key={question.id || index} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Part {question.partNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {question.correctOption}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📰</span>
              Recent Blog Posts
            </h2>
          </div>
          <div className="p-6">
            {stats.recentBlogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No blog posts created yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBlogs.map((blog, index) => (
                  <div key={blog.id || index} className="border-b border-gray-100 pb-3">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {blog.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {blog.content.substring(0, 80)}...
                    </div>
                    {blog.hidden && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorDashboard;
