import React, { useState } from 'react';
import axios from 'axios';

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [partNumber, setPartNumber] = useState(1);  // Dùng state để lưu phần câu hỏi
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [options, setOptions] = useState([
    { label: 'A', content: '' },
    { label: 'B', content: '' },
    { label: 'C', content: '' },
    { label: 'D', content: '' }
  ]);

  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('question', JSON.stringify({
      questionText,
      correctOption,
      partNumber,  // Gửi partNumber từ dropdown
      textContent,
      options: options.map(option => ({
        label: option.label,
        content: option.content
      }))
    }));

    if (audio) {
      formData.append('audio', audio);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:8080/api/question-bank/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Câu hỏi đã được thêm thành công!');
      setQuestionText('');
      setCorrectOption('');
      setPartNumber(1);  // Reset lại partNumber
      setTextContent('');
      setAudio(null);
      setImage(null);
      setOptions([
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' }
      ]);
    } catch (error) {
      console.error('Lỗi khi thêm câu hỏi:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Thêm Câu Hỏi</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">

        {/* Dropdown để chọn phần câu hỏi */}
        <div className="form-group">
          <label className="font-weight-bold">Phần câu hỏi (Part Number):</label>
          <select
            className="form-control w-75 mx-auto mb-3"
            value={partNumber}
            onChange={(e) => setPartNumber(Number(e.target.value))}
            required
          >
            <option value={1}>Part 1</option>
            <option value={2}>Part 2</option>
            <option value={3}>Part 3</option>
            <option value={4}>Part 4</option>
            <option value={5}>Part 5</option>
            <option value={6}>Part 6</option>
            <option value={7}>Part 7</option>
          </select>
        </div>

        {/* Input để nhập đoạn văn cho câu hỏi */}
        <div className="form-group">
          <label className="font-weight-bold">Đoạn văn cho câu hỏi:</label>
          <textarea
            className="form-control w-75 mx-auto mb-3"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>

        {/* Tải lên audio */}
        <div className="form-group">
          <label className="font-weight-bold">Tải lên audio:</label>
          <input
            type="file"
            className="form-control-file w-75 mx-auto mb-3"
            accept="audio/*"
            onChange={handleAudioChange}
          />
        </div>

        {/* Tải lên hình ảnh */}
        <div className="form-group">
          <label className="font-weight-bold">Tải lên hình ảnh:</label>
          <input
            type="file"
            className="form-control-file w-75 mx-auto mb-3"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Nội dung câu hỏi */}
        <div className="form-group">
          <label className="font-weight-bold">Nội dung câu hỏi:</label>
          <input
            type="text"
            className="form-control w-75 mx-auto mb-3"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>

        <h3>Lựa chọn trả lời</h3>
        {options.map((option, index) => (
          <div className="form-group" key={index}>
            <label className="font-weight-bold">{option.label}:</label>
            <input
              type="text"
              className="form-control w-75 mx-auto mb-3"
              value={option.content}
              onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
              required
            />
          </div>
        ))}

        {/* Chọn đáp án đúng */}
        <div className="form-group">
          <label className="font-weight-bold">Đáp án đúng (Chọn A, B, C, D):</label>
          <select
            className="form-control w-75 mx-auto mb-3"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            required
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-block">Thêm Câu Hỏi</button>
      </form>
    </div>
  );
};

export default AddQuestionForm;
