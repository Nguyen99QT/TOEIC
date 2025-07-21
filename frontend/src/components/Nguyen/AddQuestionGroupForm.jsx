import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BotpressChat from './BotpressChat';
import ToastConfig from './ToastConfig';

const AddQuestionGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [audio, setAudio] = useState(null);  // Để lưu tệp audio
  const [image, setImage] = useState(null);  // Để lưu tệp hình ảnh
  const [textContent, setTextContent] = useState('');
  const [groupType, setGroupType] = useState('READING'); // Thêm type
  const [partId, setPartId] = useState(1); // Thêm partId
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [questions, setQuestions] = useState([{
    questionText: '', 
    correctOption: '', 
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ]
  }]);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      groupName,
      textContent,
      groupType,
      partId,
      questions
    };
    localStorage.setItem('questionGroupDraft', JSON.stringify(saveData));
    localStorage.setItem('questionGroupDraftTime', new Date().toISOString());
  }, [groupName, textContent, groupType, partId, questions]);

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem('questionGroupDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGroupName(data.groupName || '');
        setTextContent(data.textContent || '');
        setGroupType(data.groupType || 'READING');
        setPartId(data.partId || 1);
        setQuestions(data.questions || [{
          questionText: '', 
          correctOption: '', 
          options: [
            { label: 'A', content: '' },
            { label: 'B', content: '' },
            { label: 'C', content: '' },
            { label: 'D', content: '' }
          ]
        }]);
      } catch (e) {
        console.log('Could not load saved data');
      }
    }
  }, []);

  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].content = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      {
        questionText: '', 
        correctOption: '', 
        options: [
          { label: 'A', content: '' },
          { label: 'B', content: '' },
          { label: 'C', content: '' },
          { label: 'D', content: '' }
        ]
      }
    ]);
    toast.success('Added new question');
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      toast.success('Question deleted');
    } else {
      toast.warning('Must have at least 1 question in the group');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!groupName.trim()) {
      toast.error('Please enter question group name!');
      setIsSubmitting(false);
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Please enter content for question ${i + 1}!`);
        setIsSubmitting(false);
        return;
      }
      if (!q.correctOption) {
        toast.error(`Please select correct answer for question ${i + 1}!`);
        setIsSubmitting(false);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].content.trim()) {
          toast.error(`Please enter answer ${q.options[j].label} for question ${i + 1}!`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    const formData = new FormData();
    
    // ✅ Create JSON blob instead of string for proper parsing
    const groupData = {
      title: groupName,
      type: groupType,
      content: textContent,
      partId: partId,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        correctOption: q.correctOption,
        options: q.options.map(opt => ({
          optionLabel: opt.label,    // ✅ Fixed: label -> optionLabel
          optionText: opt.content    // ✅ Fixed: content -> optionText
        })),
      })),
    };
    
    // ✅ Append as JSON blob with proper content type
    formData.append('group', new Blob([JSON.stringify(groupData)], {
      type: 'application/json'
    }));

    if (audio) {
      formData.append('audio', audio);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem('authToken');
      const headers = {};
      
      // ✅ Don't set Content-Type for FormData - let browser set it with boundary
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Using auth token for group creation');
      } else {
        console.warn('⚠️ No auth token found in localStorage');
        toast.error('Không tìm thấy token xác thực! Vui lòng đăng nhập lại.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post('http://localhost:8080/api/question-group/create-with-questions', formData, {
        headers: headers,
      });
      
      console.log('✅ Group created successfully:', response.data);
      toast.success('Question group has been added successfully!');
      
      // Clear saved draft
      localStorage.removeItem('questionGroupDraft');
      localStorage.removeItem('questionGroupDraftTime');
      
      // Reset form
      setGroupName('');
      setTextContent('');
      setAudio(null);
      setImage(null);
      setQuestions([{
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
      console.error('Error when adding question group:', error);
      console.error('Error details:', error.response?.data);
      toast.error('An error occurred. Please try again! Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <ToastConfig />
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4 text-primary">Add Question Group</h2>
        
        {/* Progress indicator */}
        <div className="mb-4">
          <small className="text-muted">
            Progress: {questions.filter(q => q.questionText && q.correctOption && q.options.every(opt => opt.content)).length}/{questions.length} questions completed
          </small>
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${(questions.filter(q => q.questionText && q.correctOption && q.options.every(opt => opt.content)).length / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Group name */}
          <div className="form-group mb-4">
            <label><strong>Group Name:</strong></label>
            <input
              type="text"
              className="form-control"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              placeholder="Enter question group name..."
            />
          </div>

          {/* Group type */}
          <div className="form-group mb-4">
            <label><strong>Group Type:</strong></label>
            <select
              className="form-control"
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              required
            >
              <option value="READING">📖 Reading</option>
              <option value="LISTENING">🎧 Listening</option>
            </select>
          </div>

          {/* Part ID */}
          <div className="form-group mb-4">
            <label><strong>Part số:</strong></label>
            <select
              className="form-control"
              value={partId}
              onChange={(e) => setPartId(parseInt(e.target.value))}
              required
            >
              <option value={1}>Part 1 - Photographs</option>
              <option value={2}>Part 2 - Question-Response</option>
              <option value={3}>Part 3 - Conversations</option>
              <option value={4}>Part 4 - Talks</option>
              <option value={5}>Part 5 - Incomplete Sentences</option>
              <option value={6}>Part 6 - Text Completion</option>
              <option value={7}>Part 7 - Reading Comprehension</option>
            </select>
          </div>

          {/* Đoạn audio */}
          <div className="form-group mb-4">
            <label><strong>Đoạn audio:</strong> <small className="text-muted">(tùy chọn)</small></label>
            <input
              type="file"
              className="form-control-file"
              onChange={handleAudioChange}
              accept="audio/*"
            />
            {audio && <small className="text-success">✓ Đã chọn file: {audio.name}</small>}
          </div>

          {/* Đoạn văn */}
          <div className="form-group mb-4">
            <label><strong>Đoạn văn:</strong> <small className="text-muted">(tùy chọn)</small></label>
            <textarea
              className="form-control"
              rows="4"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter passage or content related to question group..."
            />
          </div>

          {/* Tải lên hình ảnh */}
          <div className="form-group mb-4">
            <label><strong>Tải lên hình ảnh:</strong> <small className="text-muted">(tùy chọn)</small></label>
            <input
              type="file"
              className="form-control-file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && <small className="text-success">✓ Đã chọn file: {image.name}</small>}
          </div>

          {/* Questions in group */}
          <h4 className="mt-4 mb-3">Questions in Group ({questions.length})</h4>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 border p-3 rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Question {qIndex + 1}</h5>
                {questions.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Xóa
                  </button>
                )}
              </div>
              
              <div className="form-group mb-3">
                <label>Question Content:</label>
                <input
                  type="text"
                  className="form-control"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  required
                  placeholder="Enter question content..."
                />
              </div>

              <h6>Lựa chọn trả lời</h6>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-group mb-3">
                  <label>{option.label}:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={option.content}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                    placeholder={`Enter answer ${option.label}...`}
                  />
                </div>
              ))}

              {/* Correct Answer */}
              <div className="form-group mb-4">
                <label><strong>Correct Answer:</strong></label>
                <select
                  className="form-control"
                  value={question.correctOption}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                  required
                >
                  <option value="">-- Select Correct Answer --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}

          {/* Add new question */}
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={addQuestion}>
            Add Question
          </button>

          {/* Submit */}
          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary flex-grow-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang xử lý...
                </>
              ) : (
                'Add Question Group'
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={() => {
                localStorage.removeItem('questionGroupDraft');
                setGroupName('');
                setTextContent('');
                setAudio(null);
                setImage(null);
                setQuestions([{
                  questionText: '', 
                  correctOption: '', 
                  options: [
                    { label: 'A', content: '' },
                    { label: 'B', content: '' },
                    { label: 'C', content: '' },
                    { label: 'D', content: '' }
                  ]
                }]);
                toast.info('Draft deleted');
              }}
            >
              Clear Draft
            </button>
          </div>
          
        </form>
      </div>
      

    </div>
    <BotpressChat />
    </>
  );
};

export default AddQuestionGroupForm;
