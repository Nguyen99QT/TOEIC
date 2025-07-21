import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import TestResultsReview from '../../components/Nguyen/TestResultsReview';
import axios from 'axios';

const TestResultDetailPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestResultDetail = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        const headers = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.get(
          `http://localhost:8080/api/test-results/${resultId}/detail`,
          {
            headers: headers,
            timeout: 10000
          }
        );
        
        console.log('Test result detail response:', response.data);
        
        // Check if response has the expected structure
        if (!response.data || !response.data.resultId) {
          throw new Error('Invalid response structure');
        }
        
        // Transform the response to match TestResultsReview expected format
        const resultData = response.data;
        const transformedResult = {
          testResult: {
            resultId: resultData.resultId,
            testTitle: resultData.testTitle,
            user: user?.username || 'Unknown User',
            scoreListen: resultData.listeningScore,
            scoreRead: resultData.readingScore,
            totalQuestions: resultData.totalQuestions,
            correctAnswers: resultData.correctAnswers,
            totalScore: resultData.totalScore
          },
          questionReviews: resultData.answers || []
        };
        
        setReviewResult(transformedResult);
        setError('');
      } catch (err) {
        console.error('Error fetching test result detail:', err);
        setError('Không thể tải chi tiết kết quả test. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (resultId) {
      fetchTestResultDetail();
    }
  }, [resultId, user]);

  const handleReturnToTests = () => {
    navigate('/test-history');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Đang tải chi tiết kết quả...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={handleReturnToTests}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Quay lại lịch sử test
        </button>
      </div>
    );
  }

  return (
    <div>
      <TestResultsReview 
        reviewResult={reviewResult} 
        onReturnToTests={handleReturnToTests}
      />
    </div>
  );
};

export default TestResultDetailPage;
