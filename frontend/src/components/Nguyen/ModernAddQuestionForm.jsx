import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Check, 
  X, 
  Save,
  AlertCircle,
  Info
} from 'lucide-react';

const ModernAddQuestionForm = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [partNumber, setPartNumber] = useState(1);
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([
    { label: 'A', content: '' },
    { label: 'B', content: '' },
    { label: 'C', content: '' },
    { label: 'D', content: '' }
  ]);

  const partInfo = {
    1: { name: 'Photographs', icon: '📷', color: 'bg-blue-50 border-blue-200', requiresAudio: true, requiresImage: true },
    2: { name: 'Question-Response', icon: '❓', color: 'bg-green-50 border-green-200', requiresAudio: true, requiresImage: false },
    3: { name: 'Conversations', icon: '💬', color: 'bg-purple-50 border-purple-200', requiresAudio: true, requiresImage: false },
    4: { name: 'Talks', icon: '🎤', color: 'bg-orange-50 border-orange-200', requiresAudio: true, requiresImage: false },
    5: { name: 'Incomplete Sentences', icon: '📝', color: 'bg-yellow-50 border-yellow-200', requiresAudio: false, requiresImage: false },
    6: { name: 'Text Completion', icon: '📄', color: 'bg-indigo-50 border-indigo-200', requiresAudio: false, requiresImage: false },
    7: { name: 'Reading Comprehension', icon: '📖', color: 'bg-pink-50 border-pink-200', requiresAudio: false, requiresImage: false }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('Audio file too large! Please use files under 50MB.');
        return;
      }
      setAudio(file);
      toast.success(`Audio file "${file.name}" selected`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image file too large! Please use files under 10MB.');
        return;
      }
      setImage(file);
      toast.success(`Image file "${file.name}" selected`);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const current = partInfo[partNumber];
    
    if (current.requiresAudio && !audio) {
      toast.error(`Part ${partNumber} (${current.name}) requires an audio file!`);
      return false;
    }

    if (current.requiresImage && !image) {
      toast.error(`Part ${partNumber} (${current.name}) requires an image file!`);
      return false;
    }

    if (!questionText.trim()) {
      toast.error('Question content is required!');
      return false;
    }

    const hasEmptyOptions = options.some(option => !option.content.trim());
    if (hasEmptyOptions) {
      toast.error('All answer options must be filled!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const questionObj = {
      partNumber: partNumber,
      questionText: questionText,
      correctOptionLabel: correctOption,
      options: options.map(option => ({
        label: option.label,
        content: option.content
      }))
    };

    const formData = new FormData();
    formData.append('question', new Blob([JSON.stringify(questionObj)], {
      type: 'application/json'
    }));

    if (audio) {
      formData.append('audio', audio);
    }

    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication token not found! Please login again.');
        setIsLoading(false);
        return;
      }

      await axios.post(
        'http://localhost:8080/api/question-bank/add',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000,
        }
      );

      toast.success('Question has been successfully added to database!');

      // Reset form
      setQuestionText('');
      setCorrectOption('A');
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
      console.error('Upload failed:', error);
      
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

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setCorrectOption('A');
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

    const audioInput = document.querySelector('input[type="file"][accept="audio/*"]');
    const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
    if (audioInput) audioInput.value = '';
    if (imageInput) imageInput.value = '';
    
    toast.info('Form has been reset');
  };

  const currentPart = partInfo[partNumber];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Question</h1>
          <p className="text-gray-600">Create and upload TOEIC questions to the database</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Part Selection Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Question Part</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(partInfo).map(([part, info]) => (
                <label
                  key={part}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                    partNumber === parseInt(part)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="partNumber"
                    value={part}
                    checked={partNumber === parseInt(part)}
                    onChange={(e) => setPartNumber(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{info.icon}</div>
                    <div className="text-sm font-medium text-gray-900">Part {part}</div>
                    <div className="text-xs text-gray-600 mt-1">{info.name}</div>
                    {partNumber === parseInt(part) && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-blue-500" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Requirements Info */}
            <div className={`mt-4 p-4 rounded-lg border ${currentPart.color}`}>
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Part {partNumber} Requirements:</h3>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {currentPart.requiresAudio && (
                      <li className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Audio file required
                      </li>
                    )}
                    {currentPart.requiresImage && (
                      <li className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Image file required
                      </li>
                    )}
                    {!currentPart.requiresAudio && !currentPart.requiresImage && (
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Text-based question
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Media Files</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Audio File {currentPart.requiresAudio && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      audio
                        ? 'border-green-400 bg-green-50'
                        : currentPart.requiresAudio
                        ? 'border-red-300 bg-red-50 hover:bg-red-100'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      {audio ? (
                        <>
                          <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-700">{audio.name}</p>
                          <p className="text-xs text-green-600">
                            {(audio.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload audio</p>
                          <p className="text-xs text-gray-500">MP3, WAV, M4A (max 50MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Image File {currentPart.requiresImage && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      image
                        ? 'border-green-400 bg-green-50'
                        : currentPart.requiresImage
                        ? 'border-red-300 bg-red-50 hover:bg-red-100'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      {image ? (
                        <>
                          <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-700">{image.name}</p>
                          <p className="text-xs text-green-600">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-500">JPG, PNG, GIF (max 10MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Question Content</h2>
            </div>

            <div className="space-y-6">
              {/* Text Content (for Part 6 & 7) */}
              {partNumber >= 6 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passage Text (for Part 6 & 7)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows="4"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter passage text for Part 6 or Part 7..."
                  />
                </div>
              )}

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows="3"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question here..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Answer Options Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Answer Options</h2>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                    correctOption === option.label ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {option.label}
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={option.content}
                    onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
                    placeholder={`Enter choice ${option.label}...`}
                    required
                  />
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      value={option.label}
                      checked={correctOption === option.label}
                      onChange={(e) => setCorrectOption(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      correctOption === option.label
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {correctOption === option.label && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Select the correct answer by clicking the circle next to the option.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernAddQuestionForm;
