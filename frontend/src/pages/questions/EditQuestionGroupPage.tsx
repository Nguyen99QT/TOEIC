import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Option {
  optionId?: number;
  label: string;
  content: string;
}

interface Question {
  questionId?: number;
  questionText: string;
  correctOption: string;
  questionOrder: number;
  audioUrl?: string;
  imageUrl?: string;
  options: Option[];
}

interface QuestionGroup {
  groupId: number;
  title: string;
  type: string;
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
  partId?: number;
  questions: Question[];
  createdBy?: {
    id: number;
    email: string;
    username: string;
  };
}

const EditQuestionGroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [title, setTitle] = useState('');
  const [type, setType] = useState('READING');
  const [content, setContent] = useState('');
  const [partId, setPartId] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem('toeic_access_token') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        console.log('🔍 Fetching group for edit:', groupId);

        const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data: QuestionGroup = await response.json();
          
          // Check ownership
          if (data.createdBy?.email !== user?.email) {
            setError('You do not have permission to edit this question group');
            return;
          }
          
          // Populate form
          setTitle(data.title);
          setType(data.type);
          setContent(data.content || '');
          setPartId(data.partId || 1);
          setQuestions(data.questions || []);
          setExistingAudioUrl(data.audioUrl || '');
          setExistingImageUrl(data.imageUrl || '');
        } else if (response.status === 404) {
          setError('Question group not found');
        } else if (response.status === 403) {
          setError('You do not have permission to edit this question group');
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
  }, [groupId, user?.email]);

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      correctOption: 'A',
      questionOrder: questions.length + 1,
      options: [
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Update question orders
    updatedQuestions.forEach((q, i) => {
      q.questionOrder = i + 1;
    });
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[index] as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, content: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].content = content;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('toeic_access_token') || 
                   localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken');

      if (!token) {
        alert('No authentication token found');
        return;
      }

      // Validate form
      if (!title.trim()) {
        alert('Please enter a title');
        return;
      }

      if (questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      // Check all questions are valid
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText.trim()) {
          alert(`Please enter text for question ${i + 1}`);
          return;
        }
        if (!q.options.every(opt => opt.content.trim())) {
          alert(`Please fill all options for question ${i + 1}`);
          return;
        }
      }

      // Prepare form data
      const formData = new FormData();
      
      const groupData = {
        title: title.trim(),
        type,
        content: content.trim(),
        partId,
        questions: questions.map(q => ({
          questionText: q.questionText.trim(),
          correctOption: q.correctOption,
          questionOrder: q.questionOrder,
          options: (q.options || []).map(opt => ({
            optionLabel: opt.label,
            optionText: opt.content.trim()
          }))
        }))
      };

      formData.append('group', new Blob([JSON.stringify(groupData)], {
        type: 'application/json'
      }));

      if (audio) {
        formData.append('audio', audio);
      }
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        navigate(`/questions/groups/${groupId}`);
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert('Failed to update question group: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Failed to update question group: ' + error);
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Question Group</h1>
          <button 
            onClick={() => navigate(`/questions/groups/${groupId}`)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TOEIC Part *
              </label>
              <select
                value={partId}
                onChange={(e) => setPartId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Part 1 - Picture Description</option>
                <option value={2}>Part 2 - Question-Response</option>
                <option value={3}>Part 3 - Conversations</option>
                <option value={4}>Part 4 - Talks</option>
                <option value={5}>Part 5 - Incomplete Sentences</option>
                <option value={6}>Part 6 - Text Completion</option>
                <option value={7}>Part 7 - Reading Comprehension</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LISTENING">Listening</option>
              <option value="READING">Reading</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions/Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter instructions or content for this question group..."
            />
          </div>

          {/* Media Files */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio File
              </label>
              {existingAudioUrl && !audio && (
                <div className="mb-2">
                  <audio controls className="w-full">
                    <source src={`http://localhost:8080${existingAudioUrl}`} type="audio/mpeg" />
                  </audio>
                  <p className="text-xs text-gray-500 mt-1">Current audio file</p>
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {audio && (
                <p className="text-xs text-gray-500 mt-1">New audio file selected: {audio.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File
              </label>
              {existingImageUrl && !image && (
                <div className="mb-2">
                  <img 
                    src={`http://localhost:8080${existingImageUrl}`}
                    alt="Current"
                    className="max-w-32 max-h-32 object-contain border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image file</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {image && (
                <p className="text-xs text-gray-500 mt-1">New image file selected: {image.name}</p>
              )}
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No questions yet</p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Question {qIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text *
                        </label>
                        <textarea
                          value={question.questionText}
                          onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Answer *
                        </label>
                        <select
                          value={question.correctOption}
                          onChange={(e) => updateQuestion(qIndex, 'correctOption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(question.options || []).map((option, oIndex) => (
                            <div key={oIndex}>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Option {option.label}
                              </label>
                              <input
                                type="text"
                                value={option.content}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/questions/groups/${groupId}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || questions.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Question Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionGroupPage;
