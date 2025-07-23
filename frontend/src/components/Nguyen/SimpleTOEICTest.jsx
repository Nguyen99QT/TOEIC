import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TestResultsReview from './TestResultsReview';

const SimpleTOEICTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [testParts, setTestParts] = useState([]); // Part navigation structure
  const [questionsData, setQuestionsData] = useState([]); // Raw question data from API
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [completedParts, setCompletedParts] = useState(new Set()); // Track completed parts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timer state (2 hours = 7200 seconds total)
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testReviewResult, setTestReviewResult] = useState(null);
  
  // Audio management
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioPlaylist, setAudioPlaylist] = useState([]);
  const [isAudioCompleted, setIsAudioCompleted] = useState(false);
  
  // Test structure - TOEIC has 7 parts
  // Parts 1-4: Listening (audio required)
  // Parts 5-7: Reading (no audio)
  const isListeningPart = useCallback((partNumber) => partNumber <= 4, []);

  // Initialize test data
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/tests/${testId}/parts`);
        
        // Store raw question data for filtering by part later
        setTestParts(response.data);
        
        // Create part structure for navigation (7 parts in TOEIC)
        const partStructure = [
          { partId: 1, partNumber: 1, title: "Part 1: Mô tả tranh", description: "Nghe và chọn mô tả phù hợp với tranh" },
          { partId: 2, partNumber: 2, title: "Part 2: Hỏi - đáp", description: "Nghe câu hỏi và chọn câu trả lời phù hợp" },
          { partId: 3, partNumber: 3, title: "Part 3: Đối thoại", description: "Nghe đoạn hội thoại và trả lời câu hỏi" },
          { partId: 4, partNumber: 4, title: "Part 4: Bài nói chuyện", description: "Nghe bài nói và trả lời câu hỏi" },
          { partId: 5, partNumber: 5, title: "Part 5: Hoàn thành câu", description: "Chọn từ hoặc cụm từ để hoàn thành câu" },
          { partId: 6, partNumber: 6, title: "Part 6: Hoàn thành đoạn văn", description: "Chọn từ hoặc câu để hoàn thành đoạn văn" },
          { partId: 7, partNumber: 7, title: "Part 7: Đọc hiểu", description: "Đọc đoạn văn và trả lời câu hỏi" }
        ];
        
        // Filter only parts that have questions in the test data
        const availableParts = partStructure.filter(part => 
          response.data.some(question => question.partNumber === part.partNumber)
        );
        
        console.log(`Loaded test data with ${response.data.length} questions across ${availableParts.length} parts`);
        
        // Store the part structure separately for navigation
        setTestParts(availableParts);
        
        // Store raw question data
        setQuestionsData(response.data);
        
        setError(null);
      } catch (error) {
        console.error('Error loading test data:', error);
        setError('Không thể tải dữ liệu bài test');
      } finally {
        setIsLoading(false);
      }
    };
    loadTestData();
  }, [testId]);

  // Test submission function
  const handleTestSubmit = useCallback(async () => {
    try {
      const submissionData = {
        testId: parseInt(testId),
        answers: Object.entries(userAnswers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          selectedOption: answer
        }))
      };
      
      console.log('Submitting test with data:', JSON.stringify(submissionData, null, 2));
      
      // Submit for review (includes both scoring and answer review)
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Sending request with auth token');
        console.log('Token preview:', token.substring(0, 50) + '...');
      } else {
        console.log('No auth token found in localStorage');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        alert('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:8080/api/tests/${testId}/review`, 
        submissionData,
        {
          headers: headers,
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Server response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Response keys:', Object.keys(response.data || {}));
      
      const reviewResult = response.data;
      
      // Debug the structure
      console.log('reviewResult structure check:');
      console.log('- Has testResult:', !!reviewResult.testResult);
      console.log('- Has questionReviews:', !!reviewResult.questionReviews);
      console.log('- questionReviews type:', typeof reviewResult.questionReviews);
      
      // Validate review result structure
      if (!reviewResult || !reviewResult.questionReviews) {
        console.error('Invalid review result structure:', reviewResult);
        alert('Lỗi: Dữ liệu kết quả test không hợp lệ');
        return;
      }
      
      // Store review result for display
      setTestReviewResult(reviewResult);
      setIsTestCompleted(true);
      
      console.log('Test submitted successfully:', reviewResult);
    } catch (error) {
      console.error('Error submitting test:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          console.error('Authentication failed - token may be invalid or expired');
          console.error('Current token:', localStorage.getItem('accessToken'));
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else {
          alert(`Lỗi server: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.error('Request made but no response:', error.request);
        alert('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Lỗi không xác định: ${error.message}`);
      }
    }
  }, [testId, userAnswers]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTestStarted && !isTestCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeRemaining, handleTestSubmit]);

  // Audio management function with enhanced error handling and retries
  const playAudioSequence = useCallback((audioList, index, retryCount = 0) => {
    if (!audioRef.current || index >= audioList.length) {
      // All audio completed
      setIsAudioPlaying(false);
      setIsAudioCompleted(true);
      console.log('All audio in part completed');
      return;
    }

    const currentAudio = audioList[index];
    const maxRetries = 2;
    
    console.log(`Playing audio ${index + 1}/${audioList.length} (attempt ${retryCount + 1}):`, currentAudio.url);
    
    setCurrentAudioIndex(index);
    setIsAudioPlaying(true);
    
    // Test audio URL validity and size before setting
    fetch(currentAudio.url, { method: 'HEAD' })
      .then(response => {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        
        console.log(`Audio ${index + 1} info:`, {
          status: response.status,
          contentLength: contentLength,
          contentType: contentType,
          url: currentAudio.url
        });
        
        // Check if file is too small (likely corrupted/placeholder)
        if (contentLength && parseInt(contentLength) < 100) {
          throw new Error(`Audio file too small (${contentLength} bytes) - likely corrupted`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // File seems valid, proceed with playback
        audioRef.current.src = currentAudio.url;
        
        // Set up event handlers for main audio element
        audioRef.current.onended = () => {
          console.log(`Audio ${index + 1} ended, playing next...`);
          setTimeout(() => {
            playAudioSequence(audioList, index + 1, 0);
          }, 1000);
        };
        
        audioRef.current.onerror = (e) => {
          console.warn(`Audio ${index + 1} playback error:`, e.target.error);
          handleAudioError(audioList, index, retryCount, `Playback error: ${e.target.error?.message || 'Unknown'}`);
        };
        
        audioRef.current.oncanplay = () => {
          console.log(`Audio ${index + 1} ready for playback`);
        };
        
        // Try to play
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`Audio ${index + 1} play promise failed:`, error.message);
            handleAudioError(audioList, index, retryCount, `Play failed: ${error.message}`);
          });
        }
      })
      .catch(error => {
        console.warn(`Audio ${index + 1} validation failed:`, error.message);
        handleAudioError(audioList, index, retryCount, `Validation failed: ${error.message}`);
      });
    
    // Helper function to handle audio errors with retry logic
    function handleAudioError(audioList, index, retryCount, errorMessage) {
      if (retryCount < maxRetries) {
        console.log(`Retrying audio ${index + 1} (attempt ${retryCount + 2}/${maxRetries + 1})`);
        setTimeout(() => {
          playAudioSequence(audioList, index, retryCount + 1);
        }, 1000);
      } else {
        console.warn(`Audio ${index + 1} failed after ${maxRetries + 1} attempts: ${errorMessage}`);
        console.log(`Skipping to next audio...`);
        setTimeout(() => {
          playAudioSequence(audioList, index + 1, 0);
        }, 500);
      }
    }
  }, []);

  // Load questions when part changes
  useEffect(() => {
    const loadQuestionsForCurrentPart = () => {
      if (!questionsData || questionsData.length === 0 || !testParts[currentPartIndex]) return;
      
      try {
        // Filter questions for current part from raw question data
        const currentPartNumber = testParts[currentPartIndex].partNumber;
        const currentPartQuestions = questionsData.filter(question => 
          question.partNumber === currentPartNumber
        );
        
        // Transform API data to match component expectations
        const transformedQuestions = currentPartQuestions.map(q => ({
          questionId: q.questionId,
          partNumber: q.partNumber,
          questionOrder: q.questionOrder,
          questionText: q.questionText,
          audioUrl: q.audioUrl,
          imageUrl: q.imageUrl,
          // Transform the options format from API to component format
          options: [
            { optionId: `${q.questionId}-A`, label: 'A', content: q.optionA },
            { optionId: `${q.questionId}-B`, label: 'B', content: q.optionB },
            { optionId: `${q.questionId}-C`, label: 'C', content: q.optionC },
            { optionId: `${q.questionId}-D`, label: 'D', content: q.optionD }
          ].filter(opt => opt.content) // Filter out empty options
        }));
        
        // Filter out invalid questions (with null options or questionText = "abc")
        const validQuestions = transformedQuestions.filter(question => {
          const hasValidOptions = question.options && question.options.length >= 2 &&
            question.options.every(option => option.label && option.content);
          const hasValidText = question.questionText && 
            question.questionText !== "abc" && question.questionText !== "abcc" &&
            question.questionText.trim().length > 3;
          return hasValidOptions && hasValidText;
        });
        
        console.log(`Loaded ${validQuestions.length} valid questions for part ${currentPartNumber} (filtered from ${transformedQuestions.length})`);
        setCurrentQuestions(validQuestions);
        
        // Auto-play audio for listening parts
        if (isListeningPart(currentPartNumber) && validQuestions.length > 0) {
          // Create audio playlist from all questions with valid audio
          const audioList = validQuestions
            .filter(q => {
              // More thorough audio URL validation
              if (!q.audioUrl) return false;
              
              // Check if audioUrl is a valid string and not empty
              const audioUrl = q.audioUrl.trim();
              if (audioUrl.length === 0) return false;
              
              // Check if it's a valid audio file extension
              const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
              const hasValidExtension = validExtensions.some(ext => 
                audioUrl.toLowerCase().includes(ext)
              );
              
              console.log(`Audio validation for question ${q.questionId}:`, {
                audioUrl: audioUrl,
                hasValidExtension: hasValidExtension,
                fullUrl: `http://localhost:8080${audioUrl}`
              });
              
              return hasValidExtension;
            })
            .map(q => ({
              url: `http://localhost:8080${q.audioUrl}`,
              questionId: q.questionId,
              questionText: q.questionText,
              audioFileName: q.audioUrl.split('/').pop() // Extract filename for debugging
            }));
          
          console.log(`Created audio playlist for part ${currentPartNumber}:`, audioList);
          setAudioPlaylist(audioList);
          setCurrentAudioIndex(0);
          setIsAudioCompleted(false);
          
          if (audioList.length > 0) {
            console.log(`Starting audio sequence with ${audioList.length} audio files`);
            setTimeout(() => {
              playAudioSequence(audioList, 0, 0);
            }, 1000);
          } else {
            console.log(`No valid audio files found for part ${currentPartNumber}, marking as completed`);
            setIsAudioCompleted(true);
          }
        } else {
          // For reading parts, mark audio as completed immediately
          setIsAudioCompleted(true);
          setAudioPlaylist([]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setError('Không thể tải câu hỏi');
      }
    };

    if (questionsData.length > 0 && testParts.length > 0 && currentPartIndex < testParts.length) {
      loadQuestionsForCurrentPart();
    }
  }, [currentPartIndex, questionsData, testParts, testId, playAudioSequence, isListeningPart]);

  // Navigation functions with restriction to prevent going back
  const handleNextPart = () => {
    if (currentPartIndex < testParts.length - 1) {
      // Mark current part as completed (cannot go back)
      setCompletedParts(prev => new Set([...prev, currentPartIndex]));
      
      // Move to next part
      setCurrentPartIndex(prev => prev + 1);
      setIsAudioPlaying(false);
      setIsAudioCompleted(false);
      setCurrentAudioIndex(0);
      setAudioPlaylist([]);
      
      console.log(`Moved to part ${currentPartIndex + 2}, completed parts:`, [...completedParts, currentPartIndex]);
      
      // Scroll to first question of new part
      scrollToFirstQuestion();
    } else {
      // Last part completed - submit test
      handleTestSubmit();
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getCurrentPartAnswers = () => {
    return currentQuestions.filter(q => userAnswers[q.questionId]).length;
  };

  const isCurrentPartComplete = () => {
    return getCurrentPartAnswers() === currentQuestions.length;
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  // Function to scroll to first question of current part
  const scrollToFirstQuestion = () => {
    setTimeout(() => {
      const firstQuestion = document.querySelector('.question-card');
      if (firstQuestion) {
        firstQuestion.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300);
  };

  // Function to find first unanswered question in current part
  const getFirstUnansweredQuestion = () => {
    return currentQuestions.find(q => !userAnswers[q.questionId]);
  };

  // Function to scroll to first unanswered question
  const scrollToUnansweredQuestion = () => {
    const unansweredQuestion = getFirstUnansweredQuestion();
    if (unansweredQuestion) {
      const questionElement = document.querySelector(`[data-question-id="${unansweredQuestion.questionId}"]`);
      if (questionElement) {
        questionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      paddingTop: '140px' // Space for sticky header
    },
    stickyHeader: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '20px 0',
      borderBottom: '2px solid #e5e5e5'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e5e5',
      padding: '15px 0',
      position: 'sticky',
      top: '0',
      zIndex: 10
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    buttonDisabled: {
      backgroundColor: '#d1d5db',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    questionCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px'
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      marginBottom: '8px',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9'
    },
    optionSelected: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6'
    },
    timer: {
      fontSize: '20px',
      fontWeight: 'bold',
      fontFamily: 'monospace'
    },
    timerRed: {
      color: '#dc2626'
    },
    progressBar: {
      display: 'flex',
      gap: '4px',
      marginTop: '10px'
    },
    progressSegment: {
      flex: 1,
      height: '6px',
      borderRadius: '3px'
    },
    progressCompleted: {
      backgroundColor: '#10b981'
    },
    progressCurrent: {
      backgroundColor: '#3b82f6'
    },
    progressPending: {
      backgroundColor: '#e5e7eb'
    }
  };

  if (isLoading) {
    return (
      <div style={{...styles.container, textAlign: 'center', paddingTop: '100px'}}>
        <div style={{fontSize: '18px'}}>Đang tải bài test...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...styles.container, textAlign: 'center', paddingTop: '100px'}}>
        <div style={{fontSize: '18px', color: '#dc2626'}}>{error}</div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, textAlign: 'center'}}>
          <h1 style={{fontSize: '32px', marginBottom: '20px'}}>TOEIC Practice Test</h1>
          <div style={{marginBottom: '30px'}}>
            <p style={{fontSize: '18px', marginBottom: '10px'}}>Thời gian làm bài: 2 giờ (120 phút)</p>
            <p style={{fontSize: '18px', marginBottom: '10px'}}>Tổng số câu hỏi: 200 câu</p>
            <p style={{fontSize: '18px', marginBottom: '20px'}}>Cấu trúc bài test:</p>
            
            <div style={{textAlign: 'left', maxWidth: '600px', margin: '0 auto'}}>
              <div style={{marginBottom: '20px'}}>
                <h3 style={{fontSize: '20px', marginBottom: '10px'}}>Phần Listening (45 phút):</h3>
                <ul style={{listStyle: 'disc', paddingLeft: '20px'}}>
                  <li>Part 1: Mô tả tranh (6 câu)</li>
                  <li>Part 2: Hỏi - đáp (25 câu)</li>
                  <li>Part 3: Đối thoại (39 câu)</li>
                  <li>Part 4: Bài nói chuyện (30 câu)</li>
                </ul>
              </div>
              <div>
                <h3 style={{fontSize: '20px', marginBottom: '10px'}}>Phần Reading (75 phút):</h3>
                <ul style={{listStyle: 'disc', paddingLeft: '20px'}}>
                  <li>Part 5: Hoàn thành câu (30 câu)</li>
                  <li>Part 6: Hoàn thành đoạn văn (16 câu)</li>
                  <li>Part 7: Đọc hiểu (54 câu)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style={{backgroundColor: '#fef3c7', border: '1px solid #f59e0b', padding: '15px', marginBottom: '20px', borderRadius: '6px'}}>
            <p style={{fontWeight: 'bold', marginBottom: '10px'}}>Lưu ý quan trọng:</p>
            <ul style={{listStyle: 'disc', paddingLeft: '20px', textAlign: 'left'}}>
              <li>Audio sẽ tự động phát và không thể phát lại</li>
              <li>Bạn cần hoàn thành tất cả câu hỏi trong part trước khi chuyển sang part tiếp theo</li>
              <li>Phần Reading sẽ hiển thị toàn bộ sau khi hoàn thành Listening</li>
              <li>Thời gian đếm ngược và tự động nộp bài khi hết giờ</li>
            </ul>
          </div>
          
          <button onClick={startTest} style={{...styles.button, fontSize: '18px', padding: '15px 30px'}}>
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  if (isTestCompleted) {
    if (testReviewResult) {
      return <TestResultsReview reviewResult={testReviewResult} onReturnToTests={() => navigate('/tests')} />;
    }
    
    return (
      <div style={styles.container}>
        <div style={{...styles.card, textAlign: 'center'}}>
          <h1 style={{fontSize: '32px', marginBottom: '20px', color: '#059669'}}>Hoàn thành bài test!</h1>
          <p style={{fontSize: '18px', marginBottom: '15px'}}>Cảm ơn bạn đã hoàn thành bài test TOEIC</p>
          <p style={{fontSize: '16px', marginBottom: '20px'}}>Kết quả sẽ được xử lý và thông báo sớm nhất có thể.</p>
          <button
            onClick={() => navigate('/tests')}
            style={styles.button}
          >
            Quay về danh sách bài test
          </button>
        </div>
      </div>
    );
  }

  const currentPart = testParts[currentPartIndex];
  if (!currentPart) return null;

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Sticky Timer and Progress Bar */}
      <div style={styles.stickyHeader}>
        <div style={styles.headerContent}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <h1 style={{fontSize: '20px', margin: 0, color: '#1e40af'}}>TOEIC Test</h1>
              <div style={{color: '#6b7280', fontSize: '16px', fontWeight: 'bold'}}>
                Part {currentPart.partNumber}/7: {currentPart.title}
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div style={{color: '#6b7280', fontSize: '14px'}}>
                Đã trả lời: <span style={{color: '#059669', fontWeight: 'bold'}}>{getCurrentPartAnswers()}</span>/<span style={{fontWeight: 'bold'}}>{currentQuestions.length}</span>
              </div>
              <div style={{
                ...styles.timer,
                ...(timeRemaining < 600 ? styles.timerRed : {}),
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                ⏰ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div style={styles.progressBar}>
            {testParts.map((part, index) => (
              <div
                key={part.partId}
                style={{
                  ...styles.progressSegment,
                  ...(index < currentPartIndex ? styles.progressCompleted :
                      index === currentPartIndex ? styles.progressCurrent :
                      styles.progressPending)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Current Part Header */}
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
            <div>
              <h2 style={{fontSize: '24px', marginBottom: '10px'}}>
                {currentPart.title}
              </h2>
              <p style={{color: '#6b7280', marginBottom: '15px'}}>{currentPart.description}</p>
              
              {isListeningPart(currentPart.partNumber) && (
                <div style={{backgroundColor: '#dbeafe', border: '1px solid #3b82f6', padding: '12px', borderRadius: '6px'}}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                    <span style={{marginRight: '8px'}}>🎧</span>
                    <span style={{color: '#1e40af', fontWeight: '500'}}>
                      {isAudioPlaying ? 
                        `Đang phát audio ${currentAudioIndex + 1}/${audioPlaylist.length}...` : 
                        (isAudioCompleted ? 'Đã phát xong tất cả audio' : 'Chuẩn bị phát audio')
                      }
                    </span>
                  </div>
                  
                  {audioPlaylist.length > 0 && (
                    <div style={{fontSize: '12px', color: '#6b7280'}}>
                      📋 Danh sách audio: {audioPlaylist.length} file
                      {currentAudioIndex < audioPlaylist.length && audioPlaylist[currentAudioIndex] && (
                        <div style={{marginTop: '4px', fontSize: '11px'}}>
                          🎵 Hiện tại: {audioPlaylist[currentAudioIndex].audioFileName || 'Unknown'}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {audioPlaylist.length === 0 && isListeningPart(currentPart.partNumber) && (
                    <div style={{fontSize: '12px', color: '#f59e0b', marginTop: '4px'}}>
                      ⚠️ Không tìm thấy file audio hợp lệ cho phần này
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {currentPartIndex >= 4 && (
              <div style={{color: '#6b7280', fontSize: '14px'}}>
                📖 Reading Section
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div>
          {currentQuestions.map((question, questionIndex) => (
            <div key={question.questionId} style={styles.questionCard} className="question-card" data-question-id={question.questionId}>
              <div style={{display: 'flex', alignItems: 'start', gap: '15px'}}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{color: '#3b82f6', fontWeight: 'bold', fontSize: '14px'}}>
                    {questionIndex + 1}
                  </span>
                </div>
                
                <div style={{flex: 1}}>
                  <div style={{marginBottom: '15px'}}>
                    <p style={{fontSize: '16px', marginBottom: '15px'}}>{question.questionText}</p>
                    
                    {/* Image display */}
                    {question.imageUrl && (
                      <div style={{marginBottom: '15px'}}>
                        <img
                          src={`http://localhost:8080${question.imageUrl}`}
                          alt="Question"
                          style={{maxWidth: '400px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Answer options */}
                  <div>
                    {question.options && question.options.map((option) => {
                      const isSelected = userAnswers[question.questionId] === option.label;
                      return (
                        <label
                          key={option.optionId}
                          style={{
                            ...styles.option,
                            ...(isSelected ? styles.optionSelected : {})
                          }}
                          onClick={() => handleAnswerChange(question.questionId, option.label)}
                        >
                          <input
                            type="radio"
                            name={`question-${question.questionId}`}
                            value={option.label}
                            checked={isSelected}
                            onChange={() => {}} // Handled by label click
                            style={{marginRight: '10px'}}
                          />
                          <span style={{fontWeight: 'bold', marginRight: '8px'}}>{option.label}.</span>
                          <span>{option.content}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation and Unanswered Questions Helper */}
        <div style={{marginTop: '30px'}}>
          {/* Unanswered Questions Helper */}
          {!isCurrentPartComplete() && getFirstUnansweredQuestion() && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{color: '#92400e', fontWeight: 'bold', marginBottom: '5px'}}>
                  ⚠️ Còn {currentQuestions.length - getCurrentPartAnswers()} câu chưa trả lời
                </div>
                <div style={{color: '#92400e', fontSize: '14px'}}>
                  Hoàn thành tất cả để chuyển sang part tiếp theo
                </div>
              </div>
              <button
                onClick={scrollToUnansweredQuestion}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Đi đến câu chưa làm
              </button>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              {completedParts.size > 0 && (
                <span style={{color: '#6b7280'}}>
                  ✅ Đã hoàn thành {completedParts.size} phần (không thể quay lại)
                </span>
              )}
            </div>
            
            <div>
            {currentPartIndex < testParts.length - 1 ? (
              <button
                onClick={handleNextPart}
                disabled={!isCurrentPartComplete()}
                style={{
                  ...styles.button,
                  ...(isCurrentPartComplete() ? {} : styles.buttonDisabled)
                }}
              >
                {isListeningPart(currentPart.partNumber) && currentPartIndex === 3
                  ? 'Chuyển sang phần Reading →'
                  : 'Part tiếp theo →'
                }
              </button>
            ) : (
              <button
                onClick={handleTestSubmit}
                disabled={!isCurrentPartComplete()}
                style={{
                  ...styles.button,
                  backgroundColor: isCurrentPartComplete() ? '#059669' : '#d1d5db',
                  ...(isCurrentPartComplete() ? {} : styles.buttonDisabled)
                }}
              >
                Nộp bài test
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced audio element for listening parts */}
      {isListeningPart(currentPart.partNumber) && (
        <audio
          ref={audioRef}
          onPlay={() => {
            setIsAudioPlaying(true);
            console.log('Audio started playing');
          }}
          onPause={() => {
            setIsAudioPlaying(false);
            console.log('Audio paused');
          }}
          onEnded={() => {
            setIsAudioPlaying(false);
            console.log('Audio ended');
          }}
          onError={(e) => {
            console.error('Audio element error:', {
              error: e.target.error,
              code: e.target.error?.code,
              message: e.target.error?.message,
              currentSrc: e.target.currentSrc
            });
            setIsAudioPlaying(false);
          }}
          onLoadStart={() => {
            console.log('Audio load start');
          }}
          onLoadedData={() => {
            console.log('Audio data loaded successfully');
          }}
          onCanPlay={() => {
            console.log('Audio can play - ready for playback');
          }}
          preload="metadata"
          crossOrigin="anonymous"
          controls={false} // Hide controls for automatic playback
        />
      )}
    </div>
  );
};

export default SimpleTOEICTest;
