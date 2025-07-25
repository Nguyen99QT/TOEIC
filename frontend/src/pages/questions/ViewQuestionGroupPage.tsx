import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../services/auth';

interface Question {
  questionId: number;
  questionText: string;
  correctOption: string;
  questionOrder: number;
  audioUrl?: string;
  imageUrl?: string;
  options: Option[];
}

interface Option {
  optionId: number;
  label: string;
  content: string;
}

interface QuestionGroup {
  groupId: number;
  title: string;
  type: string;
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
  part?: {
    partId: number;
    partName: string;
  };
  questions: Question[];
  createdBy?: {
    id: number;
    email: string;
    username: string;
  };
}

const ViewQuestionGroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<QuestionGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem('toeic_access_token') || getToken();

        if (!token) {
          setError('No authentication token found');
          return;
        }

        console.log('🔍 Fetching group with ID:', groupId);
        console.log('🔑 Using token:', token ? 'present' : 'missing');

        const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Group data received:', data);
          setGroup(data);
        } else if (response.status === 404) {
          setError('Question group not found');
        } else if (response.status === 403) {
          setError('You do not have permission to view this question group');
        } else {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          setError('Failed to load question group: ' + errorText);
        }
      } catch (err: any) {
        console.error('Error fetching group:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const handleEdit = () => {
    navigate(`/questions/groups/${groupId}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${group?.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || 
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/questions/my');
      } else {
        alert('Failed to delete question group');
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      alert('Failed to delete question group');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading question group...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">Error: {error}</div>
        <button
          onClick={() => navigate('/questions/my')}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to My Questions
        </button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Question group not found</p>
        <button
          onClick={() => navigate('/questions/my')}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to My Questions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {group && (
        <>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {group.part && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {group.part.partName}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.type === 'LISTENING' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {group.type}
                  </span>
                  <span className="text-gray-400">
                    {group.questions?.length || 0} question{(group.questions?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                {group.createdBy && (
                  <p className="text-xs text-gray-400 mt-1">
                    Created by: {group.createdBy.email}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/questions/my')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                {group.createdBy?.email === user?.email && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content/Instructions */}
            {group.content && (
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
                <p className="text-gray-700">{group.content}</p>
              </div>
            )}

            {/* Media */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
              {group.audioUrl && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4 4 0 10.996 7.886 1 1 0 10.004-2A2 2 0 108 13V7.82l8-1.6v5.894a4 4 0 11-.994 7.886 1 1 0 10-.012-2A2 2 0 1016 15V3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Group Audio</h4>
                      <p className="text-xs text-gray-600">Listen to the audio for this question group</p>
                    </div>
                  </div>
                  <audio
                    controls
                    className="w-full h-12 bg-white rounded-lg shadow-inner border border-gray-200"
                    style={{
                      filter: 'sepia(20%) saturate(70%) hue-rotate(180deg)'
                    }}
                  >
                    <source src={`http://localhost:8080${group.audioUrl}`} type="audio/mpeg" />
                    <source src={`http://localhost:8080${group.audioUrl}`} type="audio/wav" />
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                      Your browser does not support the audio element. Please try a different browser.
                    </div>
                  </audio>
                </div>
              )}
              {group.imageUrl && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Group Image</h4>
                      <p className="text-xs text-gray-600">Visual content for this question group</p>
                    </div>
                  </div>
                  <img
                    src={`http://localhost:8080${group.imageUrl}`}
                    alt="Question group content"
                    className="w-full max-w-md max-h-64 object-contain border border-gray-200 rounded-lg shadow-sm bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Questions ({group.questions?.length || 0})
            </h2>

            {(group.questions?.length || 0) === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No questions in this group</p>
              </div>
            ) : (
              (group.questions || [])
                .sort((a, b) => (a.questionOrder || 0) - (b.questionOrder || 0))
                .map((question, index) => (
                  <div key={question.questionId} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Question {index + 1}
                      </h3>
                      <span className="text-sm text-gray-500">
                        Correct: {question.correctOption}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{question.questionText}</p>

                    {/* Question Media */}
                    <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4 mb-4">
                      {question.audioUrl && (
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793l-4.618-3.77a1 1 0 01-.383-.793V7.77a1 1 0 01.383-.793l4.618-3.77z" />
                                <path d="M15 8a2 2 0 012 2v0a2 2 0 01-2 2V8zM17.657 6.343A1 1 0 0119.07 7.757a7 7 0 010 4.486 1 1 0 11-1.414 1.414 5 5 0 000-7.314z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-700">Question Audio</span>
                          </div>
                          <audio
                            controls
                            className="w-full h-10 bg-white rounded border border-gray-200 shadow-inner"
                            style={{
                              filter: 'sepia(20%) saturate(70%) hue-rotate(90deg)'
                            }}
                          >
                            <source src={`http://localhost:8080${question.audioUrl}`} type="audio/mpeg" />
                            <source src={`http://localhost:8080${question.audioUrl}`} type="audio/wav" />
                            <span className="text-xs text-red-600">Audio not supported</span>
                          </audio>
                        </div>
                      )}
                      {question.imageUrl && (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-700">Question Image</span>
                          </div>
                          <img
                            src={`http://localhost:8080${question.imageUrl}`}
                            alt="Question content"
                            className="w-full max-w-sm max-h-40 object-contain border border-gray-200 rounded shadow-sm bg-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Options:</h4>
                      {(question.options || [])
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((option) => (
                          <div
                            key={option.optionId}
                            className={`p-3 rounded border ${option.label === question.correctOption
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                              }`}
                          >
                            <span className="font-medium">{option.label}.</span> {option.content}
                            {option.label === question.correctOption && (
                              <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewQuestionGroupPage;
