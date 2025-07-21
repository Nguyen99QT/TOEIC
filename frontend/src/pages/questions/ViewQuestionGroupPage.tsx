import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('accessToken');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGroup(data);
        } else if (response.status === 404) {
          setError('Question group not found');
        } else if (response.status === 403) {
          setError('You do not have permission to view this question group');
        } else {
          setError('Failed to load question group');
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
    navigate(`/questions/edit/${groupId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${group?.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || 
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    group.type === 'LISTENING' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
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
        <div className="flex space-x-4">
          {group.audioUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audio</label>
              <audio controls className="w-full max-w-sm">
                <source src={`http://localhost:8080${group.audioUrl}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {group.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <img 
                src={`http://localhost:8080${group.imageUrl}`} 
                alt="Question group content"
                className="max-w-sm max-h-64 object-contain border rounded"
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
                <div className="flex space-x-4 mb-4">
                  {question.audioUrl && (
                    <div>
                      <audio controls className="w-full max-w-sm">
                        <source src={`http://localhost:8080${question.audioUrl}`} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                  {question.imageUrl && (
                    <div>
                      <img 
                        src={`http://localhost:8080${question.imageUrl}`} 
                        alt="Question content"
                        className="max-w-sm max-h-32 object-contain border rounded"
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
                        className={`p-3 rounded border ${
                          option.label === question.correctOption 
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
