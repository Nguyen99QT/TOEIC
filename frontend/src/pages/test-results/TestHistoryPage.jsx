import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

// Add CSS keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.querySelector('#spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spin-keyframes';
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

const TestHistoryPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchTestHistory();
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTestHistory = async () => {
    if (!user?.id) {
      setError('Vui lòng đăng nhập để xem lịch sử làm bài');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        setLoading(false);
        return;
      }

      console.log('Fetching test history for user:', user.id);
      
      const response = await axios.get(
        `http://localhost:8080/api/test-results/user/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Test history response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setTestResults(response.data);
      } else {
        console.warn('Response data is not an array:', response.data);
        setTestResults([]);
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
      if (error.response?.status === 401) {
        setError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy kết quả test nào.');
        setTestResults([]);
      } else {
        setError('Không thể tải lịch sử làm bài. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#16a34a';
    if (percentage >= 60) return '#ca8a04';
    if (percentage >= 40) return '#ea580c';
    return '#dc2626';
  };

  const getGradeText = (percentage) => {
    if (percentage >= 80) return 'Xuất sắc';
    if (percentage >= 60) return 'Khá';
    if (percentage >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            style={styles.retryButton} 
            onClick={fetchTestHistory}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Lịch sử làm bài TOEIC</h1>
        <p style={styles.subtitle}>
          Xem lại kết quả các bài test đã hoàn thành
        </p>
      </div>

      {testResults.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h2>Chưa có bài test nào</h2>
          <p>Bạn chưa hoàn thành bài test nào. Hãy bắt đầu làm bài test đầu tiên!</p>
          <button 
            style={styles.startTestButton}
            onClick={() => navigate('/tests')}
          >
            Bắt đầu làm bài
          </button>
        </div>
      ) : (
        <div style={styles.resultsList}>
          {testResults.map((result, index) => (
            <div key={result.resultId} style={styles.resultCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{result.testTitle}</h3>
                <span style={styles.cardDate}>
                  {formatDate(result.finishedAt)}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.scoreDisplay}>
                  <div style={styles.mainScoreSmall}>
                    <span style={styles.scoreNumber}>{result.totalScore}</span>
                    <span style={styles.scoreMaxSmall}>/990</span>
                  </div>
                  <div style={styles.scoreBreakdown}>
                    <span>L: {result.listeningScore}</span>
                    <span>R: {result.readingScore}</span>
                  </div>
                </div>

                <div style={styles.cardStats}>
                  <div style={styles.cardStat}>
                    <span style={styles.cardStatValue}>
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                    <span style={styles.cardStatLabel}>Câu đúng</span>
                  </div>
                  <div style={styles.cardStat}>
                    <span style={{
                      ...styles.cardStatValue,
                      color: getScoreColor(result.percentage)
                    }}>
                      {result.percentage?.toFixed(1)}%
                    </span>
                    <span style={styles.cardStatLabel}>Tỷ lệ</span>
                  </div>
                  <div style={styles.cardStat}>
                    <span style={{
                      ...styles.cardStatValue,
                      color: getScoreColor(result.percentage)
                    }}>
                      {getGradeText(result.percentage)}
                    </span>
                    <span style={styles.cardStatLabel}>Đánh giá</span>
                  </div>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button 
                  style={styles.detailButton}
                  onClick={() => navigate(`/test-results/${result.resultId}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px 0'
  },
  title: {
    fontSize: '2.5rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6b7280',
    margin: '0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    marginBottom: '20px',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    border: '1px solid #fecaca'
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '1.1rem',
    marginBottom: '20px'
  },
  retryButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    border: '1px solid #e5e7eb'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  startTestButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.2s'
  },
  resultsList: {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0',
    flex: 1
  },
  cardDate: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginLeft: '10px'
  },
  cardBody: {
    marginBottom: '20px'
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  mainScoreSmall: {
    display: 'flex',
    alignItems: 'baseline'
  },
  scoreNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937'
  },
  scoreMaxSmall: {
    fontSize: '1.2rem',
    color: '#6b7280',
    marginLeft: '4px'
  },
  scoreBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    fontSize: '0.9rem',
    color: '#4b5563'
  },
  cardStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
  },
  cardStat: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  cardStatValue: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  cardStatLabel: {
    fontSize: '0.8rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  detailButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default TestHistoryPage;
