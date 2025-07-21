import React, { useState } from 'react';
import axios from 'axios';

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctOption, setCorrectOption] = useState('A');  // ← Default value
  const [partNumber, setPartNumber] = useState(1);
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

    // ✅ VALIDATION: Require audio và image cho các Part cần thiết
    if ((partNumber <= 4) && !audio) {
      alert('Listening Parts (1-4) cần có file audio!');
      return;
    }

    if (partNumber === 1 && !image) {
      alert('Part 1 (Photos) cần có hình ảnh!');
      return;
    }

    // ✅ CREATE QUESTION OBJECT for @RequestPart("question")
    const questionObj = {
      partNumber: partNumber,
      questionText: questionText,
      correctOptionLabel: correctOption,
      options: options.map(option => ({
        label: option.label,
        content: option.content
      }))
    };

    // ✅ CREATE FormData with proper structure
    const formData = new FormData();
    
    // ✅ Add question as JSON Blob (matches @RequestPart("question"))
    formData.append('question', new Blob([JSON.stringify(questionObj)], {
      type: 'application/json'
    }));

    // ✅ Add files with correct names (matches @RequestPart names)
    if (audio) {
      formData.append('audio', audio);  // ← Matches @RequestPart("audio")
      console.log('📎 Audio file added:', audio.name);
    }

    if (image) {
      formData.append('image', image);  // ← Matches @RequestPart("image")
      console.log('📎 Image file added:', image.name);
    }

    // ✅ Debug FormData contents
    console.log('📤 FormData for /add endpoint:');
    console.log('📋 Question object:', questionObj);
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (${value.size} bytes)`);
      } else if (value instanceof Blob) {
        console.log(`${key}: JSON Blob (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      console.log('🚀 Sending request to protected /api/question-bank/add...');

      // ✅ Get token from localStorage
      const token = localStorage.getItem('authToken');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Using auth token from localStorage');
        console.log('🔍 Token preview:', token.substring(0, 50) + '...');
        console.log('🔍 Token length:', token.length);
      } else {
        console.warn('⚠️ No auth token found in localStorage');
        alert('Authentication token not found! Please login again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/question-bank/add',
        formData,
        {
          headers: headers,
          timeout: 30000,
        }
      );

      console.log('✅ Success response:', response.status);
      alert('Question has been successfully added to database!');

      // Reset form
      setQuestionText('');
      setCorrectOption('A');  // ← Reset to default
      setPartNumber(1);
      setTextContent('');
      setAudio(null);
      setImage(null);
      setOptions([
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' }
      ]);

      // Reset file inputs
      const audioInput = document.querySelector('input[type="file"][accept="audio/*"]');
      const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
      if (audioInput) audioInput.value = '';
      if (imageInput) imageInput.value = '';

    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Request config:', error.config);

      let errorMessage = 'An error occurred while adding the question!';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication error! Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data! Please check the information.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add Question to Database</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">

        {/* Dropdown to select question part */}
        <div className="form-group">
          <label className="font-weight-bold">Question Part (Part Number):</label>
          <select
            className="form-control w-75 mx-auto mb-3"
            value={partNumber}
            onChange={(e) => setPartNumber(Number(e.target.value))}
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
          {/* ✅ Show requirements */}
          <small className="text-info d-block text-center">
            {partNumber <= 4 ? '🎧 Audio file required' : '📝 Text-based questions'}
            {partNumber === 1 ? ' + 📷 Image file required' : ''}
          </small>
        </div>

        {/* Input for question text content */}
        <div className="form-group">
          <label className="font-weight-bold">Question Text Content (if any):</label>
          <textarea
            className="form-control w-75 mx-auto mb-3"
            rows="3"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter passage text for Part 6 or Part 7..."
          />
        </div>

        {/* Upload audio */}
        <div className="form-group">
          <label className="font-weight-bold">Upload Audio:</label>
          <input
            type="file"
            className="form-control-file w-75 mx-auto mb-3"
            accept="audio/*"
            onChange={handleAudioChange}
          />
          {audio && (
            <small className="text-success d-block text-center">
              ✅ Audio: {audio.name} ({(audio.size / 1024 / 1024).toFixed(2)}MB)
            </small>
          )}
        </div>

        {/* Upload image */}
        <div className="form-group">
          <label className="font-weight-bold">Upload Image:</label>
          <input
            type="file"
            className="form-control-file w-75 mx-auto mb-3"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <small className="text-success d-block text-center">
              ✅ Image: {image.name} ({(image.size / 1024 / 1024).toFixed(2)}MB)
            </small>
          )}
        </div>

        {/* Question content */}
        <div className="form-group">
          <label className="font-weight-bold">Question Content:</label>
          <input
            type="text"
            className="form-control w-75 mx-auto mb-3"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter question..."
            required
          />
        </div>

        <h3>Answer Options</h3>
        {options.map((option, index) => (
          <div className="form-group" key={index}>
            <label className="font-weight-bold">{option.label}:</label>
            <input
              type="text"
              className="form-control w-75 mx-auto mb-3"
              value={option.content}
              onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
              placeholder={`Enter choice ${option.label}...`}
              required
            />
          </div>
        ))}

        {/* Select correct answer */}
        <div className="form-group">
          <label className="font-weight-bold">Correct Answer:</label>
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

        <button type="submit" className="btn btn-primary btn-block">
          💾 Save Question to Database
        </button>
      </form>
    </div>
  );
};

export default AddQuestionForm;