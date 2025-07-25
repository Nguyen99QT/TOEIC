// Custom Botpress Actions for TOEIC Platform
// File: botpress-custom-actions.js

/**
 * Custom action to get user's test history
 */
const getUserTestHistory = async () => {
  const { user } = event
  
  try {
    // Call your backend API
    const response = await axios.get(`http://localhost:8080/api/test-results/user/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    
    const testHistory = response.data
    
    if (testHistory.length === 0) {
      await bp.converse.say('Bạn chưa làm bài thi nào. Hãy thử làm bài thi đầu tiên!')
    } else {
      const lastTest = testHistory[0]
      await bp.converse.say(`Bài thi gần nhất: ${lastTest.testType} - Điểm: ${lastTest.score}/990`)
    }
  } catch (error) {
    await bp.converse.say('Không thể lấy lịch sử thi. Vui lòng thử lại sau.')
  }
}

/**
 * Custom action to recommend next lesson
 */
const recommendNextLesson = async () => {
  const { user } = event
  
  try {
    const response = await axios.get(`http://localhost:8080/api/lessons/recommended/${user.id}`)
    const lessons = response.data
    
    if (lessons.length > 0) {
      const lesson = lessons[0]
      await bp.converse.say(`Tôi khuyên bạn nên học: "${lesson.title}". Bạn có muốn bắt đầu không?`)
    } else {
      await bp.converse.say('Bạn đã hoàn thành tất cả bài học! Hãy thử làm bài thi thực hành.')
    }
  } catch (error) {
    await bp.converse.say('Không thể tìm bài học phù hợp. Hãy xem danh sách bài học.')
  }
}

/**
 * Custom action to get study statistics
 */
const getStudyStats = async () => {
  const { user } = event
  
  try {
    const response = await axios.get(`http://localhost:8080/api/users/${user.id}/stats`)
    const stats = response.data
    
    await bp.converse.say(`📊 Thống kê học tập của bạn:
- Bài học đã hoàn thành: ${stats.completedLessons}
- Bài thi đã làm: ${stats.testsCompleted}
- Điểm trung bình: ${stats.averageScore}
- Thời gian học: ${stats.studyTime} giờ`)
  } catch (error) {
    await bp.converse.say('Không thể lấy thống kê. Vui lòng thử lại.')
  }
}
