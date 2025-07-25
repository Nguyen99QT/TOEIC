import React, { useState } from 'react';
import FeedbackList from '../../components/feedback/FeedbackList';
import FeedbackStatistics from '../../components/feedback/FeedbackStatistics';

const AdminFeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'statistics'>('list');

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
          <p className="text-gray-600">
            View and manage all feedback from users
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feedback List
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'list' ? (
            <FeedbackList isAdmin={true} />
          ) : (
            <FeedbackStatistics />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Management Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Feedback Status:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <span className="text-orange-600 font-medium">Pending:</span> New feedback needs review</li>
                <li>• <span className="text-blue-600 font-medium">In Progress:</span> Currently being processed</li>
                <li>• <span className="text-green-600 font-medium">Resolved:</span> Already processed</li>
                <li>• <span className="text-gray-600 font-medium">Closed:</span> Feedback has been closed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Priority:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <span className="text-red-600 font-medium">Urgent:</span> Needs immediate attention</li>
                <li>• <span className="text-orange-600 font-medium">High:</span> Needs attention soon</li>
                <li>• <span className="text-yellow-600 font-medium">Medium:</span> Can be processed normally</li>
                <li>• <span className="text-green-600 font-medium">Low:</span> Can be processed when time allows</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminFeedbackPage; 