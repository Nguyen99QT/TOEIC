import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  EyeIcon,
  SaveIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ImprovedAddQuestionGroupForm = () => {
  // ========== STATE MANAGEMENT ==========
  const [formData, setFormData] = useState({
    groupName: '',
    groupType: 'READING',
    partId: 1,
    textContent: '',
    difficulty: 'MEDIUM',
    estimatedTime: 10,
    tags: []
  });

  const [media, setMedia] = useState({
    audio: null,
    image: null
  });

  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Progress tracking
  const [completionProgress, setCompletionProgress] = useState(0);

  // ========== HELPER FUNCTIONS ==========
  function createEmptyQuestion() {
    return {
      id: Date.now() + Math.random(),
      questionText: '',
      correctOption: '',
      explanation: '',
      difficulty: 'MEDIUM',
      options: [
        { label: 'A', content: '', isCorrect: false },
        { label: 'B', content: '', isCorrect: false },
        { label: 'C', content: '', isCorrect: false },
        { label: 'D', content: '', isCorrect: false }
      ],
      keywords: []
    };
  }

  // ========== VALIDATION ==========
  const validateForm = useCallback(() => {
    const errors = {};
    
    // Basic info validation
    if (!formData.groupName.trim()) {
      errors.groupName = 'Tên nhóm không được để trống';
    }
    
    if (formData.groupName.length < 3) {
      errors.groupName = 'Tên nhóm phải có ít nhất 3 ký tự';
    }

    // Questions validation
    const questionErrors = {};
    questions.forEach((question, index) => {
      const qErrors = {};
      
      if (!question.questionText.trim()) {
        qErrors.questionText = 'Câu hỏi không được để trống';
      }
      
      if (!question.correctOption) {
        qErrors.correctOption = 'Phải chọn đáp án đúng';
      }
      
      const emptyOptions = question.options.filter(opt => !opt.content.trim());
      if (emptyOptions.length > 0) {
        qErrors.options = 'Tất cả lựa chọn phải được điền';
      }
      
      if (Object.keys(qErrors).length > 0) {
        questionErrors[index] = qErrors;
      }
    });
    
    if (Object.keys(questionErrors).length > 0) {
      errors.questions = questionErrors;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, questions]);

  // ========== PROGRESS CALCULATION ==========
  const calculateProgress = useCallback(() => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic info (5 fields)
    totalFields += 5;
    if (formData.groupName.trim()) completedFields++;
    if (formData.groupType) completedFields++;
    if (formData.partId) completedFields++;
    if (formData.difficulty) completedFields++;
    if (formData.estimatedTime > 0) completedFields++;

    // Questions (each question has 6 required fields)
    questions.forEach(question => {
      totalFields += 6; // questionText, correctOption, 4 options
      if (question.questionText.trim()) completedFields++;
      if (question.correctOption) completedFields++;
      question.options.forEach(option => {
        if (option.content.trim()) completedFields++;
      });
    });

    const progress = Math.round((completedFields / totalFields) * 100);
    setCompletionProgress(progress);
  }, [formData, questions]);

  // ========== AUTO SAVE ==========
  const autoSave = useCallback(async () => {
    if (!autoSaveEnabled || !formData.groupName.trim()) return;

    try {
      const draftData = {
        ...formData,
        questions,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('questionGroupDraft', JSON.stringify(draftData));
      setLastSaved(new Date());
      toast.success('Đã tự động lưu nháp', { autoClose: 2000 });
    } catch (error) {
      console.error('Auto save failed:', error);
    }
  }, [formData, questions, autoSaveEnabled]);

  // ========== LOAD DRAFT ==========
  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem('questionGroupDraft');
      if (draft) {
        const draftData = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...draftData }));
        setQuestions(draftData.questions || [createEmptyQuestion()]);
        toast.info('Đã tải nháp đã lưu');
      }
    } catch (error) {
      console.error('Load draft failed:', error);
    }
  }, []);

  // ========== EFFECTS ==========
  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoSaveEnabled) {
        autoSave();
      }
    }, 30000); // Auto save every 30 seconds

    return () => clearTimeout(timer);
  }, [autoSave, autoSaveEnabled]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // ========== EVENT HANDLERS ==========
  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaChange = (type, file) => {
    setMedia(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].content = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, optionLabel) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = optionLabel;
    
    // Update isCorrect flags
    newQuestions[qIndex].options.forEach(option => {
      option.isCorrect = option.label === optionLabel;
    });
    
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = questions[index];
    const duplicated = {
      ...questionToDuplicate,
      id: Date.now() + Math.random(),
      questionText: questionToDuplicate.questionText + ' (Copy)'
    };
    
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicated);
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.warning('Phải có ít nhất một câu hỏi');
      return;
    }
    
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const saveDraft = async () => {
    await autoSave();
    toast.success('Đã lưu nháp thành công!');
  };

  const clearDraft = () => {
    localStorage.removeItem('questionGroupDraft');
    setFormData({
      groupName: '',
      groupType: 'READING',
      partId: 1,
      textContent: '',
      difficulty: 'MEDIUM',
      estimatedTime: 10,
      tags: []
    });
    setQuestions([createEmptyQuestion()]);
    setMedia({ audio: null, image: null });
    toast.info('Đã xóa nháp');
  };

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Không tìm thấy token xác thực! Vui lòng đăng nhập lại.');
        return;
      }

      const formDataToSend = new FormData();
      
      const groupData = {
        title: formData.groupName,
        type: formData.groupType,
        content: formData.textContent,
        partId: formData.partId,
        difficulty: formData.difficulty,
        estimatedTime: formData.estimatedTime,
        tags: formData.tags,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          correctOption: q.correctOption,
          explanation: q.explanation || '',
          difficulty: q.difficulty,
          keywords: q.keywords || [],
          options: q.options.map(opt => ({
            optionLabel: opt.label,
            optionText: opt.content
          })),
        })),
      };
      
      formDataToSend.append('group', new Blob([JSON.stringify(groupData)], {
        type: 'application/json'
      }));

      if (media.audio) {
        formDataToSend.append('audio', media.audio);
      }
      if (media.image) {
        formDataToSend.append('image', media.image);
      }

      await axios.post(
        'http://localhost:8080/api/question-group/create-with-questions', 
        formDataToSend, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      toast.success('Nhóm câu hỏi đã được thêm thành công!');
      
      // Clear form and draft
      clearDraft();
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('Lỗi khi thêm nhóm câu hỏi:', error);
      toast.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Thêm Nhóm Câu Hỏi</h1>
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                Lưu lần cuối: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Tiến độ hoàn thành: {completionProgress}% ({questions.length} câu hỏi)
        </p>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Xem trước: {formData.groupName}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <strong>Loại:</strong> {formData.groupType}
            </div>
            <div>
              <strong>Part:</strong> {formData.partId}
            </div>
            <div>
              <strong>Độ khó:</strong> {formData.difficulty}
            </div>
            <div>
              <strong>Thời gian ước tính:</strong> {formData.estimatedTime} phút
            </div>
          </div>
          
          {formData.textContent && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Đoạn văn:</h3>
              <p className="bg-gray-50 p-4 rounded">{formData.textContent}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Câu {index + 1}: {question.questionText}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {question.options.map((option) => (
                    <div 
                      key={option.label}
                      className={`p-2 rounded ${option.label === question.correctOption ? 'bg-green-100 border-green-300' : 'bg-gray-50'}`}
                    >
                      <strong>{option.label}.</strong> {option.content}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-green-600">
                  <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                  Đáp án đúng: {question.correctOption}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên nhóm câu hỏi *
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => handleFormDataChange('groupName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.groupName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="VD: Reading Comprehension - Business Articles"
                />
                {validationErrors.groupName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.groupName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại bài thi *
                </label>
                <select
                  value={formData.groupType}
                  onChange={(e) => handleFormDataChange('groupType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="READING">Reading</option>
                  <option value="LISTENING">Listening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part số *
                </label>
                <select
                  value={formData.partId}
                  onChange={(e) => handleFormDataChange('partId', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(part => (
                    <option key={part} value={part}>Part {part}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleFormDataChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EASY">Dễ</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Khó</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian ước tính (phút)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.estimatedTime}
                  onChange={(e) => handleFormDataChange('estimatedTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đoạn văn/Hướng dẫn
              </label>
              <textarea
                rows="4"
                value={formData.textContent}
                onChange={(e) => handleFormDataChange('textContent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập đoạn văn hoặc hướng dẫn cho nhóm câu hỏi..."
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Tài liệu đính kèm</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File audio
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleMediaChange('audio', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {media.audio && (
                  <p className="text-sm text-green-600 mt-1">✓ {media.audio.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMediaChange('image', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {media.image && (
                  <p className="text-sm text-green-600 mt-1">✓ {media.image.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Câu hỏi ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm câu hỏi
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Câu hỏi {qIndex + 1}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(qIndex)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Nhân bản câu hỏi"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="Xóa câu hỏi"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung câu hỏi *
                      </label>
                      <textarea
                        rows="2"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.questions?.[qIndex]?.questionText ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập nội dung câu hỏi..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, oIndex) => (
                        <div key={option.label}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lựa chọn {option.label} *
                          </label>
                          <input
                            type="text"
                            value={option.content}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Nhập lựa chọn ${option.label}...`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Đáp án đúng *
                        </label>
                        <select
                          value={question.correctOption}
                          onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.questions?.[qIndex]?.correctOption ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Chọn đáp án đúng</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Độ khó câu hỏi
                        </label>
                        <select
                          value={question.difficulty}
                          onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="EASY">Dễ</option>
                          <option value="MEDIUM">Trung bình</option>
                          <option value="HARD">Khó</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giải thích đáp án
                      </label>
                      <textarea
                        rows="2"
                        value={question.explanation}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Giải thích tại sao đáp án này đúng..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tự động lưu nháp</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Xóa nháp
                </button>
                
                <button
                  type="button"
                  onClick={saveDraft}
                  className="flex items-center px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Lưu nháp
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || completionProgress < 80}
                  className={`flex items-center px-8 py-2 text-sm font-medium text-white rounded-md ${
                    isSubmitting || completionProgress < 80
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Tạo nhóm câu hỏi
                    </>
                  )}
                </button>
              </div>
            </div>

            {completionProgress < 80 && (
              <div className="mt-4 flex items-center text-sm text-amber-600">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Vui lòng hoàn thành ít nhất 80% form để có thể submit
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ImprovedAddQuestionGroupForm;
