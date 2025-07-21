import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Option {
  label: string;
  content: string;
}

interface Question {
  id: number;
  questionText: string;
  partNumber: number;
  correctOption: string;
  audioUrl?: string;
  imageUrl?: string;
  options: Option[];
}

const EditIndividualQuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found.');
          setLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:8080/api/question-bank/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map API fields to local state with safe defaults
        setQuestion({
          id: data.questionId || 0,
          questionText: data.questionText || '',
          partNumber: data.partNumber || 1,
          correctOption: data.correctOption || '',
          audioUrl: data.audioUrl,
          imageUrl: data.imageUrl,
          options: Array.isArray(data.options) && data.options.length >= 4
            ? data.options.map((opt: any) => ({
                label: opt.label || '',
                content: opt.content || ''
              }))
            : [
                { label: 'A', content: data.optionA || '' },
                { label: 'B', content: data.optionB || '' },
                { label: 'C', content: data.optionC || '' },
                { label: 'D', content: data.optionD || '' }
              ]
        });
      } catch (err: any) {
        setError(err.message || 'Error fetching question');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!question) return;
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question) return;
    const newOptions = [...question.options];
    newOptions[index].content = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    
    // Validate form data
    if (!question.questionText.trim()) {
      setError('Question text is required');
      return;
    }
    if (!question.correctOption) {
      setError('Please select the correct option');
      return;
    }
    if (question.options.some(opt => !opt.content.trim())) {
      setError('All options must have content');
      return;
    }
    
    setSaving(true);
    setError(''); // Clear previous errors
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found.');
        setSaving(false);
        return;
      }
      const formData = new FormData();
      // Build question DTO
      const questionDTO = {
        questionText: question.questionText.trim(),
        partNumber: question.partNumber,
        correctOptionLabel: question.correctOption, // Đúng tên trường backend cần
        options: question.options,
      };
      formData.append('question', new Blob([JSON.stringify(questionDTO)], { type: 'application/json' }));
      if (audioFile) formData.append('audio', audioFile);
      if (imageFile) formData.append('image', imageFile);
      
      const response = await fetch(`http://localhost:8080/api/question-bank/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      alert('Question updated successfully!');
      navigate('/questions/my');
    } catch (err: any) {
      setError(err.message || 'Error updating question');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/questions/my')}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }
  if (!question) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>Question not found.</p>
          <button 
            onClick={() => navigate('/questions/my')}
            className="mt-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/questions/my')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to My Questions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Question</h1>
          <p className="text-gray-600 mt-2">Question ID: {question.id}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
              <textarea
                name="questionText"
                value={question.questionText || ''}
                onChange={(e) => setQuestion({ ...question, questionText: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
                autoFocus
                placeholder="Enter your question text here..."
              />
            </div>

            {/* Part Number and Correct Option */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Part Number *</label>
                <select
                  name="partNumber"
                  value={question.partNumber || 1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>Part {num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Option *</label>
                <select
                  name="correctOption"
                  value={question.correctOption || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select correct option</option>
                  {question.options.map(opt => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label} - {opt.content || 'Empty option'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => (
                  <div key={opt.label} className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Option {opt.label}
                    </label>
                    <input
                      type="text"
                      value={opt.content || ''}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter option ${opt.label}...`}
                      required
                      maxLength={150}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audio File</label>
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setAudioFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {question.audioUrl && !audioFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    Current: <a href={question.audioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{question.audioUrl.split('/').pop()}</a>
                  </div>
                )}
                {audioFile && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-600">
                    New: {audioFile.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {question.imageUrl && !imageFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    Current: <a href={question.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{question.imageUrl.split('/').pop()}</a>
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-600">
                    New: {imageFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center font-medium"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
                onClick={() => navigate('/questions/my')}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditIndividualQuestionPage;
