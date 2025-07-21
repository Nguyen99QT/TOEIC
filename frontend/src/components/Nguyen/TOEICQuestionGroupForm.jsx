import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TOEICQuestionGroupForm = () => {
  const [groupData, setGroupData] = useState({
    groupName: '',
    partId: 1,
    groupType: 'PRACTICE',
    description: ''
  });
  
  const [content, setContent] = useState({
    textContent: '',
    audio: null,
    image: null,
    audioPreview: null,
    imagePreview: null
  });

  const [questions, setQuestions] = useState([{
    id: Date.now(),
    questionText: '',
    correctOption: '',
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ]
  }]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // TOEIC Part configurations
  const toeicParts = {
    1: { name: 'Part 1 - Photographs', type: 'LISTENING', maxQuestions: 6, hasImage: true, hasAudio: true },
    2: { name: 'Part 2 - Question-Response', type: 'LISTENING', maxQuestions: 25, hasAudio: true },
    3: { name: 'Part 3 - Conversations', type: 'LISTENING', maxQuestions: 13, hasAudio: true },
    4: { name: 'Part 4 - Talks', type: 'LISTENING', maxQuestions: 10, hasAudio: true },
    5: { name: 'Part 5 - Incomplete Sentences', type: 'READING', maxQuestions: 30 },
    6: { name: 'Part 6 - Text Completion', type: 'READING', maxQuestions: 4, hasText: true },
    7: { name: 'Part 7 - Reading Comprehension', type: 'READING', maxQuestions: 15, hasText: true }
  };

  const currentPart = toeicParts[groupData.partId];

  // Auto-save functionality
  useEffect(() => {
    const saveData = { groupData, content: { ...content, audio: null, image: null }, questions };
    localStorage.setItem('toeicGroupDraft', JSON.stringify(saveData));
    localStorage.setItem('toeicGroupDraftTime', new Date().toISOString());
  }, [groupData, content, questions]); // Include full content object

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem('toeicGroupDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGroupData(data.groupData || groupData);
        setContent(prev => ({ ...prev, textContent: data.content?.textContent || '' }));
        setQuestions(data.questions || questions);
        toast.info('Draft restored successfully');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGroupData = (field, value) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
    if (field === 'partId') {
      // Reset questions when changing part
      const newPart = toeicParts[value];
      if (newPart.maxQuestions < questions.length) {
        setQuestions(questions.slice(0, newPart.maxQuestions));
      }
    }
  };

  const handleFileChange = (type, file) => {
    if (type === 'audio') {
      setContent(prev => ({
        ...prev,
        audio: file,
        audioPreview: file ? URL.createObjectURL(file) : null
      }));
    } else if (type === 'image') {
      setContent(prev => ({
        ...prev,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : null
      }));
    }
  };

  const addQuestion = () => {
    if (questions.length < currentPart.maxQuestions) {
      const newQuestion = {
        id: Date.now(),
        questionText: '',
        correctOption: '',
        options: [
          { label: 'A', content: '' },
          { label: 'B', content: '' },
          { label: 'C', content: '' },
          { label: 'D', content: '' }
        ]
      };
      setQuestions([...questions, newQuestion]);
      toast.success(`Added question ${questions.length + 1}`);
    } else {
      toast.warning(`${currentPart.name} allows maximum ${currentPart.maxQuestions} questions`);
    }
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      toast.success('Question deleted');
    } else {
      toast.warning('Must have at least 1 question');
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].content = value;
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!groupData.groupName.trim()) {
      toast.error('Please enter question group name!');
      return false;
    }

    if (currentPart.hasText && !content.textContent.trim()) {
      toast.error(`${currentPart.name} requires text content!`);
      return false;
    }

    if (currentPart.hasAudio && !content.audio) {
      toast.error(`${currentPart.name} requires audio file!`);
      return false;
    }

    if (currentPart.hasImage && !content.image) {
      toast.error(`${currentPart.name} requires image!`);
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Please enter content for question ${i + 1}!`);
        return false;
      }
      if (!q.correctOption) {
        toast.error(`Please select correct answer for question ${i + 1}!`);
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].content.trim()) {
          toast.error(`Please enter answer ${q.options[j].label} for question ${i + 1}!`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setProgress(10);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found! Please login again.');
        return;
      }

      const formData = new FormData();
      
      // Prepare group data
      const groupPayload = {
        title: groupData.groupName,           // Backend expects 'title'
        type: groupData.groupType,            // Backend expects 'type'  
        content: content.textContent,         // Backend expects 'content'
        partId: groupData.partId,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          correctOption: q.correctOption,
          options: q.options.map(opt => ({
            optionLabel: opt.label,
            optionText: opt.content
          }))
        }))
      };

      console.log('📋 Group payload being sent:', groupPayload);
      console.log('📄 Group data:', groupData);
      console.log('❓ Questions data:', questions);
      console.log('� Detailed questions:', questions.map((q, i) => ({
        index: i,
        questionText: q.questionText,
        correctOption: q.correctOption,
        options: q.options,
        hasAllOptions: q.options.every(opt => opt.content.trim() !== '')
      })));
      console.log('�📝 Content data:', content);

      setProgress(30);

      formData.append('group', new Blob([JSON.stringify(groupPayload)], {
        type: 'application/json'
      }));

      if (content.audio) {
        formData.append('audio', content.audio);
        console.log('🎵 Audio file attached:', content.audio.name);
      }
      
      if (content.image) {
        formData.append('image', content.image);
        console.log('🖼️ Image file attached:', content.image.name);
      }

      // Debug FormData
      console.log('📦 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else if (value instanceof Blob) {
          console.log(`${key}: Blob - ${value.size} bytes`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      setProgress(60);

      await axios.post(
        'http://localhost:8080/api/question-group/create-with-questions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(60 + (percentCompleted * 0.4));
          }
        }
      );

      setProgress(100);
      toast.success('TOEIC question group created successfully!');
      
      // Clear draft
      localStorage.removeItem('toeicGroupDraft');
      localStorage.removeItem('toeicGroupDraftTime');
      
      // Reset form
      setGroupData({
        groupName: '',
        partId: 1,
        groupType: 'PRACTICE',
        description: ''
      });
      setContent({
        textContent: '',
        audio: null,
        image: null,
        audioPreview: null,
        imagePreview: null
      });
      setQuestions([{
        id: Date.now(),
        questionText: '',
        correctOption: '',
        options: [
          { label: 'A', content: '' },
          { label: 'B', content: '' },
          { label: 'C', content: '' },
          { label: 'D', content: '' }
        ]
      }]);

    } catch (error) {
      console.error('❌ Error creating group:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);
      
      let errorMessage = 'Error creating question group: ';
      if (error.response?.status === 400) {
        errorMessage += 'Invalid data format. Please check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please login again.';
      } else if (error.response?.status === 413) {
        errorMessage += 'File too large. Please use smaller files.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create TOEIC Question Group</h1>
          <p className="mt-2 text-gray-600">
            Create question group in TOEIC format with shared content and multiple questions
          </p>
          {progress > 0 && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Processing... {progress}%</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Group Name *
              </label>
              <input
                type="text"
                value={groupData.groupName}
                onChange={(e) => updateGroupData('groupName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g.: Listening - Conversations about work"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TOEIC Part *
              </label>
              <select
                value={groupData.partId}
                onChange={(e) => updateGroupData('partId', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(toeicParts).map(([id, part]) => (
                  <option key={id} value={id}>{part.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {currentPart.type} - Maximum {currentPart.maxQuestions} questions
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Type
              </label>
              <select
                value={groupData.groupType}
                onChange={(e) => updateGroupData('groupType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PRACTICE">Practice</option>
                <option value="TEST">Test</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={groupData.description}
                onChange={(e) => updateGroupData('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description of this question group"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shared Content ({currentPart.type})
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Content */}
              {currentPart.hasText && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Passage *
                  </label>
                  <textarea
                    value={content.textContent}
                    onChange={(e) => setContent(prev => ({ ...prev, textContent: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter text passage for reading comprehension..."
                    required={currentPart.hasText}
                  />
                </div>
              )}

              {/* Audio Upload */}
              {currentPart.hasAudio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio File *
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange('audio', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={currentPart.hasAudio}
                  />
                  {content.audioPreview && (
                    <audio controls className="mt-2 w-full">
                      <source src={content.audioPreview} />
                    </audio>
                  )}
                </div>
              )}

              {/* Image Upload */}
              {currentPart.hasImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('image', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={currentPart.hasImage}
                  />
                  {content.imagePreview && (
                    <img 
                      src={content.imagePreview} 
                      alt="Preview" 
                      className="mt-2 max-h-32 object-cover rounded"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Questions Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Câu hỏi ({questions.length}/{currentPart.maxQuestions})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                disabled={questions.length >= currentPart.maxQuestions}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Question {qIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Câu hỏi *
                      </label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter question..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, oIndex) => (
                        <div key={option.label}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đáp án {option.label} *
                          </label>
                          <input
                            type="text"
                            value={option.content}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter answer ${option.label}...`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer *
                      </label>
                      <div className="flex space-x-4">
                        {question.options.map((option) => (
                          <label key={option.label} className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              value={option.label}
                              checked={question.correctOption === option.label}
                              onChange={(e) => updateQuestion(qIndex, 'correctOption', e.target.value)}
                              className="mr-2"
                              required
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('toeicGroupDraft');
                  window.location.reload();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('🔍 DEBUG - Current form data:');
                  console.log('Group Data:', groupData);
                  console.log('Content:', content);
                  console.log('Questions:', questions);
                  console.log('Current Part:', currentPart);
                  toast.info('Debug info logged to console');
                }}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Debug Data
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Question Group'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TOEICQuestionGroupForm;
