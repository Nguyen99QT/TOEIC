import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  questionText: string;
  partNumber: number;
  correctOption: string;
  audioUrl?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface QuestionGroup {
  id: number;
  groupName: string;
  description?: string;
  partId: number;
  groupType: string;
  audioUrl?: string;
  imageUrl?: string;
  textContent?: string;
  questionCount?: number;
  createdAt?: string;
}

const SimpleMyQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'groups'>('questions');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('accessToken');
        
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }

        // Simple fetch for questions
        try {
          const questionsResponse = await fetch('http://localhost:8080/api/question-bank/my', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            setQuestions(questionsData || []);
          } else {
            console.warn('Questions fetch failed:', questionsResponse.status);
          }
        } catch (err) {
          console.log('Questions fetch failed:', err);
        }

        // Simple fetch for groups
        try {
          const groupsResponse = await fetch('http://localhost:8080/api/question-group', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (groupsResponse.ok) {
            const groupsData = await groupsResponse.json();
            setQuestionGroups(groupsData || []);
          } else if (groupsResponse.status === 404) {
            console.warn('Groups endpoint not found');
            setQuestionGroups([]);
          } else {
            console.warn('Groups fetch failed:', groupsResponse.status);
          }
        } catch (err) {
          console.log('Groups fetch failed:', err);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading your questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
        <p className="mt-2 text-gray-600">
          Questions and Groups created by {user?.fullName || user?.username}
        </p>
      </div>

      {/* Simple Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Groups ({questionGroups.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'questions' ? (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Individual Questions ({questions.length})
            </h2>
            
            {questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No individual questions yet.</p>
                <a
                  href="/add/add-questions"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Question
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id || index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Part {question.partNumber}
                        </span>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {question.questionText || `Question ${index + 1}`}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Answer: {question.correctOption}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => alert('Individual question edit coming soon! Use question groups for now.')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => alert('Individual question delete coming soon! Use question groups for now.')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Question Groups ({questionGroups.length})
            </h2>
            
            {questionGroups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No question groups yet.</p>
                <a
                  href="/add/add-group-questions"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Create Group
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {questionGroups.map((group, index) => (
                  <div key={group.id || index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Part {group.partId}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            group.groupType === 'PRACTICE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {group.groupType}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {group.groupName || `Group ${index + 1}`}
                        </h3>
                        {group.description && (
                          <p className="mt-1 text-sm text-gray-500">{group.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => navigate(`/questions/view/${group.id}`)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 text-sm"
                          onClick={() => navigate(`/questions/edit/${group.id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${group.groupName}"?`)) {
                              alert('Delete functionality coming soon!');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMyQuestionsPage;
