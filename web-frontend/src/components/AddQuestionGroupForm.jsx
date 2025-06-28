import React, { useState } from 'react';
import axios from 'axios';
import BotpressChat from './BotpressChat';

const AddQuestionGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [audio, setAudio] = useState(null);  // Để lưu tệp audio
  const [image, setImage] = useState(null);  // Để lưu tệp hình ảnh
  const [textContent, setTextContent] = useState('');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('group', JSON.stringify({
      title: groupName,
      textContent,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        correctOption: q.correctOption,
        options: q.options,
      })),
    }));

    if (audio) {
      formData.append('audio', audio);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:8080/api/question-group/create-with-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Nhóm câu hỏi đã được thêm thành công!');
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
      console.error('Lỗi khi thêm nhóm câu hỏi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <>
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4 text-primary">Thêm Nhóm Câu Hỏi</h2>
        <form onSubmit={handleSubmit}>
          {/* Tên nhóm */}
          <div className="form-group mb-4">
            <label>Tên nhóm:</label>
            <input
              type="text"
              className="form-control"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          {/* Đoạn audio */}
          <div className="form-group mb-4">
            <label>Đoạn audio:</label>
            <input
              type="file"
              className="form-control-file"
              onChange={handleAudioChange}
            />
          </div>

          {/* Đoạn văn */}
          <div className="form-group mb-4">
            <label>Đoạn văn:</label>
            <textarea
              className="form-control"
              rows="4"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          </div>

          {/* Tải lên hình ảnh */}
          <div className="form-group mb-4">
            <label>Tải lên hình ảnh:</label>
            <input
              type="file"
              className="form-control-file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Câu hỏi trong nhóm */}
          <h4 className="mt-4 mb-3">Câu hỏi trong nhóm</h4>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4">
              <div className="form-group mb-3">
                <label>Câu hỏi số {qIndex + 1}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  required
                />
              </div>

              <h5>Lựa chọn trả lời</h5>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-group mb-3">
                  <label>{option.label}:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={option.content}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                </div>
              ))}

              {/* Đáp án đúng */}
              <div className="form-group mb-4">
                <h5>Đáp án đúng (Chọn A, B, C, D):</h5>
                <select
                  className="form-control"
                  value={question.correctOption}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                  required
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          ))}

          {/* Thêm câu hỏi mới */}
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={addQuestion}>
            Thêm câu hỏi
          </button>

          {/* Submit */}
          <div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
            Thêm Nhóm Câu Hỏi
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
