import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/auth';
import QuickCreateGroup from '../../components/Nguyen/QuickCreateGroup';

interface Question {
  questionId: number;
  questionText: string;
  partNumber: number;
  correctOption: string;
  audioUrl?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface QuestionGroup {
  groupId: number;
  title: string;
  content?: string;
  type: string;
  audioUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  // Backend structure
  part?: any; // Part object from backend
  questions?: Question[]; // Questions array from backend
  createdBy?: any; // Created by user object
}

const MyQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'groups'>('groups');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // Get token using auth service
        const token = getToken();
        
        if (!token) {
          setError('No authentication token found. Please login again.');
          return;
        }

        // Fetch question groups - try multiple endpoints
        try {
          let groupsResponse = await fetch('http://localhost:8080/api/question-group/my', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (groupsResponse.ok) {
            const groupsData = await groupsResponse.json();
            setQuestionGroups(Array.isArray(groupsData) ? groupsData : []);
          } else {
            const errorText = await groupsResponse.text();
            
            // Try to parse error as JSON
            try {
              const errorJson = JSON.parse(errorText);
              if (groupsResponse.status === 403) {
                setError('Access denied. You may not have permission to view question groups.');
              } else if (groupsResponse.status === 401) {
                setError('Authentication failed. Please login again.');
              } else {
                setError(`API Error: ${errorJson.message || errorText}`);
              }
            } catch (e) {
              setError(`HTTP ${groupsResponse.status}: ${errorText}`);
            }
          }
        } catch (err) {
          setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setQuestionGroups([]);
        }

        // Fetch individual questions
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
            if (questionsResponse.status === 401) {
              setError('Authentication failed for individual questions. Please login again.');
            } else {
              setError(`Failed to load individual questions: HTTP ${questionsResponse.status}`);
            }
          }
        } catch (err) {
          setError(`Network error while fetching questions: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [user]); // Add user dependency

  const handleDeleteGroup = async (groupId: number, groupTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete the group "${groupTitle}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        alert('No authentication token found');
        return;
      }
      const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setQuestionGroups(prev => prev.filter(group => group.groupId !== groupId));
      alert(`Group "${groupTitle}" deleted successfully`);
    } catch (error) {
      alert('Failed to delete group: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Individual Question: Edit & Delete
  const handleEditIndividualQuestion = (questionId: number) => {
    navigate(`/questions/${questionId}/edit`);
  };

  const handleDeleteIndividualQuestion = async (questionId: number) => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = getToken();
      
      if (!token) {
        alert('No authentication token found');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/question-bank/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Update UI
      setQuestions(prev => prev.filter(q => q.questionId !== questionId));
      
      alert('Question deleted successfully');
    } catch (error) {
      alert('Failed to delete question: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
        <p className="mt-2 text-gray-600">
          Questions and Question Groups created by {user?.fullName || user?.username}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Individual Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Question Groups ({questionGroups.length})
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'questions' ? (
          // Individual Questions Tab
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Individual Questions ({questions.length})
              </h2>
            </div>

            {questions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-500">
                  You haven't created any individual questions yet.
                </div>
                <div className="mt-4">
                  <a
                    href="/add/add-questions"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Your First Question
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <div key={question.questionId || index} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Part {question.partNumber}
                          </span>
                          {question.audioUrl && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Audio
                            </span>
                          )}
                          {question.imageUrl && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Image
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {question.questionText || `Question ${index + 1}`}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Correct Answer: {question.correctOption}
                          </p>
                          {question.createdAt && (
                            <p className="mt-1 text-xs text-gray-400">
                              Created: {new Date(question.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => handleEditIndividualQuestion(question.questionId)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => handleDeleteIndividualQuestion(question.questionId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Question Groups Tab
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Question Groups ({questionGroups.length})
              </h2>
            </div>

            {questionGroups.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-500 mb-4">
                  You haven't created any question groups yet.
                </div>
                <QuickCreateGroup 
                  onSuccess={() => {
                    // Refresh data after successful creation
                    window.location.reload();
                  }} 
                />
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questionGroups.map((group, index) => (
                  <div key={group.groupId || index} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Part {group.part?.partNumber || 'N/A'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            group.type === 'PRACTICE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {group.type === 'PRACTICE' ? 'Practice' : 'Test'}
                          </span>
                          {group.audioUrl && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Audio
                            </span>
                          )}
                          {group.imageUrl && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Image
                            </span>
                          )}
                          {(group.questions?.length || 0) > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {group.questions?.length || 0} questions
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {group.title || `Group ${index + 1}`}
                          </h3>
                          {group.content && (
                            <p className="mt-1 text-sm text-gray-400 overflow-hidden" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {group.content.length > 100 
                                ? `${group.content.substring(0, 100)}...` 
                                : group.content}
                            </p>
                          )}
                          {group.createdAt && (
                            <p className="mt-1 text-xs text-gray-400">
                              Created: {new Date(group.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => navigate(`/questions/groups/${group.groupId}`)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => navigate(`/questions/groups/${group.groupId}/edit`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => handleDeleteGroup(group.groupId, group.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyQuestionsPage;
