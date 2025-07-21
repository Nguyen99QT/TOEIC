import React, { useState } from 'react';

const TestResultsReview = ({ reviewResult, onReturnToTests }) => {
  const [currentPartFilter, setCurrentPartFilter] = useState('all');
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);

  // Safe destructuring with default values
  const { testResult = {}, questionReviews = [] } = reviewResult || {};

  // Calculate additional fields from backend data
  const percentage = testResult.totalQuestions > 0 
    ? (testResult.correctAnswers / testResult.totalQuestions * 100) 
    : 0;
  const totalScore = (testResult.scoreListen || 0) + (testResult.scoreRead || 0);

  // Early return if no data
  if (!reviewResult || !questionReviews || questionReviews.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No test results to display</h2>
        <button onClick={onReturnToTests} style={{ padding: '10px 20px', marginTop: '20px' }}>
          Return to Tests
        </button>
      </div>
    );
  }

  // Filter questions based on current filters
  const filteredQuestions = questionReviews.filter(question => {
    // Safety check
    if (!question) return false;
    
    // Part filter
    if (currentPartFilter !== 'all' && question.partNumber !== parseInt(currentPartFilter)) {
      return false;
    }
    
    // Correct/Incorrect filter
    if (showCorrectOnly && !question.isCorrect) return false;
    if (showIncorrectOnly && question.isCorrect) return false;
    
    return true;
  });

  // Calculate stats by part
  const partStats = [1, 2, 3, 4, 5, 6, 7].map(partNumber => {
    const partQuestions = questionReviews.filter(q => q && q.partNumber === partNumber);
    const correctCount = partQuestions.filter(q => q && q.isCorrect).length;
    return {
      partNumber,
      total: partQuestions.length,
      correct: correctCount,
      percentage: partQuestions.length > 0 ? (correctCount / partQuestions.length * 100).toFixed(1) : 0
    };
  }).filter(stat => stat.total > 0);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px'
    },
    scoreCard: {
      backgroundColor: '#dbeafe',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      marginBottom: '30px'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginRight: '10px',
      marginBottom: '10px'
    },
    filterButton: {
      padding: '8px 16px',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginRight: '10px',
      marginBottom: '10px',
      backgroundColor: 'white'
    },
    activeFilter: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6'
    },
    questionCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px'
    },
    correctAnswer: {
      backgroundColor: '#dcfce7',
      borderColor: '#16a34a'
    },
    incorrectAnswer: {
      backgroundColor: '#fef2f2',
      borderColor: '#dc2626'
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      margin: '5px 0',
      borderRadius: '6px',
      border: '1px solid #e5e5e5'
    },
    correctOption: {
      backgroundColor: '#dcfce7',
      borderColor: '#16a34a',
      color: '#15803d'
    },
    userWrongOption: {
      backgroundColor: '#fef2f2',
      borderColor: '#dc2626',
      color: '#dc2626'
    },
    partGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    partStatCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {/* Overall Results */}
      <div style={styles.scoreCard}>
        <h1 style={{fontSize: '32px', marginBottom: '10px', color: '#1e40af'}}>
          🎉 Kết quả bài test TOEIC
        </h1>
        <div style={{fontSize: '24px', marginBottom: '15px'}}>
          <span style={{color: '#16a34a', fontWeight: 'bold'}}>{testResult.correctAnswers}</span>
          <span style={{color: '#6b7280'}}> / </span>
          <span style={{color: '#1e40af', fontWeight: 'bold'}}>{testResult.totalQuestions}</span>
          <span style={{color: '#6b7280'}}> câu đúng</span>
        </div>
        <div style={{fontSize: '20px', marginBottom: '10px'}}>
          Tỷ lệ đúng: <span style={{color: '#1e40af', fontWeight: 'bold'}}>{percentage.toFixed(1)}%</span>
        </div>
        <div style={{fontSize: '28px', fontWeight: 'bold', color: '#059669'}}>
          Điểm: {totalScore}/990
        </div>
      </div>

      {/* Part Statistics */}
      <div style={styles.card}>
        <h2 style={{fontSize: '24px', marginBottom: '20px'}}>📊 Thống kê theo từng phần</h2>
        <div style={styles.partGrid}>
          {partStats.map(stat => (
            <div key={stat.partNumber} style={styles.partStatCard}>
              <h3 style={{fontSize: '18px', marginBottom: '10px', color: '#3b82f6'}}>
                Part {stat.partNumber}
              </h3>
              <div style={{fontSize: '16px', marginBottom: '5px'}}>
                {stat.correct}/{stat.total} câu đúng
              </div>
              <div style={{fontSize: '14px', color: stat.percentage >= 70 ? '#16a34a' : '#dc2626'}}>
                {stat.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={styles.card}>
        <h2 style={{fontSize: '24px', marginBottom: '20px'}}>📝 Chi tiết từng câu hỏi</h2>
        
        <div style={{marginBottom: '20px'}}>
          <div style={{marginBottom: '15px'}}>
            <span style={{fontWeight: 'bold', marginRight: '10px'}}>Lọc theo phần:</span>
            <button
              style={{...styles.filterButton, ...(currentPartFilter === 'all' ? styles.activeFilter : {})}}
              onClick={() => setCurrentPartFilter('all')}
            >
              Tất cả
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map(part => (
              <button
                key={part}
                style={{...styles.filterButton, ...(currentPartFilter === part.toString() ? styles.activeFilter : {})}}
                onClick={() => setCurrentPartFilter(part.toString())}
              >
                Part {part}
              </button>
            ))}
          </div>
          
          <div>
            <span style={{fontWeight: 'bold', marginRight: '10px'}}>Lọc theo kết quả:</span>
            <button
              style={{...styles.filterButton, ...(showCorrectOnly ? styles.activeFilter : {})}}
              onClick={() => {
                setShowCorrectOnly(!showCorrectOnly);
                setShowIncorrectOnly(false);
              }}
            >
              ✅ Chỉ câu đúng
            </button>
            <button
              style={{...styles.filterButton, ...(showIncorrectOnly ? styles.activeFilter : {})}}
              onClick={() => {
                setShowIncorrectOnly(!showIncorrectOnly);
                setShowCorrectOnly(false);
              }}
            >
              ❌ Chỉ câu sai
            </button>
          </div>
        </div>

        <div style={{marginBottom: '20px', fontSize: '16px', color: '#6b7280'}}>
          Hiển thị {filteredQuestions.length} / {questionReviews.length} câu hỏi
        </div>
      </div>

      {/* Question Reviews */}
      <div>
        {filteredQuestions.map((question, index) => (
          <div 
            key={question.questionId} 
            style={{
              ...styles.questionCard,
              ...(question.isCorrect ? styles.correctAnswer : styles.incorrectAnswer)
            }}
          >
            <div style={{display: 'flex', alignItems: 'start', gap: '15px', marginBottom: '15px'}}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: question.isCorrect ? '#16a34a' : '#dc2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}>
                  {question.isCorrect ? '✓' : '✗'}
                </span>
              </div>
              
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                  <h3 style={{fontSize: '18px', margin: 0}}>
                    Part {question.partNumber} - Câu {index + 1}
                  </h3>
                  <span style={{
                    backgroundColor: question.isCorrect ? '#16a34a' : '#dc2626',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {question.isCorrect ? 'ĐÚNG' : 'SAI'}
                  </span>
                </div>
                
                <p style={{fontSize: '16px', marginBottom: '15px', fontWeight: 'bold'}}>
                  {question.questionText}
                </p>
                
                {/* Hiển thị image nếu có */}
                {question.imageUrl && (
                  <div style={{marginBottom: '15px', textAlign: 'center'}}>
                    <img 
                      src={`http://localhost:8080${question.imageUrl}`}
                      alt="Question visual content"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        border: '1px solid #e5e5e5'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Hiển thị audio player nếu có */}
                {question.audioUrl && (
                  <div style={{marginBottom: '15px'}}>
                    <audio 
                      controls 
                      style={{width: '100%', maxWidth: '400px'}}
                      preload="metadata"
                    >
                      <source src={`http://localhost:8080${question.audioUrl}`} type="audio/mpeg" />
                      <source src={`http://localhost:8080${question.audioUrl}`} type="audio/wav" />
                      <source src={`http://localhost:8080${question.audioUrl}`} type="audio/mp3" />
                      Trình duyệt của bạn không hỗ trợ audio player.
                    </audio>
                  </div>
                )}
                
                <div style={{marginBottom: '15px'}}>
                  {question.options.map(option => {
                    const isCorrect = option.label === question.correctAnswer;
                    const isUserChoice = option.label === question.userAnswer;
                    
                    return (
                      <div
                        key={option.optionId}
                        style={{
                          ...styles.option,
                          ...(isCorrect ? styles.correctOption : {}),
                          ...(isUserChoice && !isCorrect ? styles.userWrongOption : {})
                        }}
                      >
                        <span style={{fontWeight: 'bold', marginRight: '8px'}}>
                          {option.label}.
                        </span>
                        <span>{option.content}</span>
                        {isCorrect && (
                          <span style={{marginLeft: '10px', fontSize: '14px'}}>
                            ✅ Đáp án đúng
                          </span>
                        )}
                        {isUserChoice && !isCorrect && (
                          <span style={{marginLeft: '10px', fontSize: '14px'}}>
                            ❌ Bạn chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div style={{fontSize: '14px', color: '#6b7280'}}>
                  <strong>Đáp án của bạn:</strong> {question.userAnswer || 'Chưa trả lời'} | 
                  <strong> Đáp án đúng:</strong> {question.correctAnswer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{...styles.card, textAlign: 'center'}}>
        <button onClick={onReturnToTests} style={styles.button}>
          🏠 Quay về danh sách bài test
        </button>
        <button 
          onClick={() => window.print()} 
          style={{...styles.button, backgroundColor: '#059669'}}
        >
          🖨️ In kết quả
        </button>
      </div>
    </div>
  );
};

export default TestResultsReview;
