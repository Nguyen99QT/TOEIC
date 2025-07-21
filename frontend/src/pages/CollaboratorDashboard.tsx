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

interface Stats {
  totalQuestions: number;
  questionsByPart: { [key: string]: number };
  recentQuestions: Question[];
}

const CollaboratorDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    questionsByPart: {},
    recentQuestions: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        // Fetch my questions for stats
        const response = await fetch('http://localhost:8080/api/question-bank/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const questions: Question[] = await response.json();
          
          // Calculate stats
          const questionsByPart = questions.reduce((acc: { [key: string]: number }, q: Question) => {
            const part = `Part ${q.partNumber}`;
            acc[part] = (acc[part] || 0) + 1;
            return acc;
          }, {});

          const recentQuestions = questions
            .sort((a: Question, b: Question) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 5);

          setStats({
            totalQuestions: questions.length,
            questionsByPart,
            recentQuestions
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

        {Object.entries(stats.questionsByPart).map(([part, count]) => (
          <div key={part} className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{count as number}</div>
            <div className="text-sm text-gray-600">{part} Questions</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
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

        {/* Recent Questions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Questions</h2>
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
      </div>
    </div>
  );
};

export default CollaboratorDashboard;
