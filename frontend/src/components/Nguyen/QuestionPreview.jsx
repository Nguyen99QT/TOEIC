import React, { useState } from 'react';

const QuestionPreview = ({ questions, groupName, groupType, partId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOption) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="alert alert-warning">
        Chưa có câu hỏi nào để xem trước.
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="card">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Kết quả bài làm</h5>
        </div>
        <div className="card-body text-center">
          <div className="mb-4">
            <h2 className="text-primary">{score.correct}/{score.total}</h2>
            <h4 className="text-muted">{score.percentage}%</h4>
          </div>
          
          <div className="row">
            {questions.map((question, index) => (
              <div key={index} className="col-12 mb-3">
                <div className={`border rounded p-3 ${selectedAnswers[index] === question.correctOption ? 'border-success bg-light' : 'border-danger'}`}>
                  <h6>Câu {index + 1}: {question.questionText}</h6>
                  <div className="row">
                    {question.options.map((option) => (
                      <div key={option.label} className="col-md-6 mb-1">
                        <span className={`
                          ${option.label === question.correctOption ? 'text-success fw-bold' : ''}
                          ${selectedAnswers[index] === option.label && option.label !== question.correctOption ? 'text-danger' : ''}
                        `}>
                          {option.label}. {option.content}
                          {option.label === question.correctOption && ' ✓'}
                          {selectedAnswers[index] === option.label && option.label !== question.correctOption && ' ✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">
                    Bạn chọn: {selectedAnswers[index] || 'Không chọn'} | Đáp án đúng: {question.correctOption}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={resetQuiz}>
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Preview: {groupName}</h5>
          <span className="badge bg-secondary">
            Câu {currentQuestion + 1}/{questions.length}
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="mb-4">
          <div className="progress mb-3">
            <div 
              className="progress-bar" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <h6 className="mb-3">Câu {currentQuestion + 1}: {question.questionText}</h6>
          
          <div className="list-group">
            {question.options.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  selectedAnswers[currentQuestion] === option.label ? 'active' : ''
                }`}
                onClick={() => handleAnswerSelect(currentQuestion, option.label)}
              >
                <span className="me-3 fw-bold">{option.label}.</span>
                <span>{option.content}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-outline-secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(curr => curr - 1)}
          >
            ← Câu trước
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button 
              className="btn btn-success"
              onClick={() => setShowResults(true)}
            >
              Xem kết quả
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentQuestion(curr => curr + 1)}
            >
              Câu tiếp → 
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPreview;
