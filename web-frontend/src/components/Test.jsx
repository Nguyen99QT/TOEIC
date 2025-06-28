import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Test = () => {
  const { testId } = useParams();
  const [parts, setParts] = useState([]);
  const [answers, setAnswers] = useState([]); // Lưu các câu trả lời của người dùng

  useEffect(() => {
    axios.get(`http://localhost:8080/api/test/${testId}/parts`)
      .then(response => {
        setParts(response.data);
      })
      .catch(error => {
        console.error("Error fetching test parts:", error);
      });
  }, [testId]);

  // Hàm xử lý khi người dùng nộp bài thi
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi các câu trả lời của người dùng về backend
    axios.post('http://localhost:8080/api/user/result', { answers })
      .then(response => {
        alert("Kết quả đã được lưu!");
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi lưu kết quả!", error);
      });
  };

  // Hàm xử lý khi người dùng chọn câu trả lời
  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prevAnswers => {
      const existingAnswer = prevAnswers.find(answer => answer.question_id === questionId);
      if (existingAnswer) {
        // Nếu đã có câu trả lời cho câu hỏi này, cập nhật lại
        return prevAnswers.map(answer => 
          answer.question_id === questionId ? { ...answer, selected_option: selectedOption } : answer
        );
      } else {
        // Nếu chưa có câu trả lời, thêm mới
        return [...prevAnswers, { question_id: questionId, selected_option: selectedOption }];
      }
    });
  };

  return (
    <div>
      <h2>Bài Thi TOEIC</h2>
      <form onSubmit={handleSubmit}>
        {parts.map(part => (
          <div key={part.part_id}>
            <h3>{part.title}</h3>
            <p>{part.instructions}</p>
            <Questions partId={part.part_id} testId={testId} onAnswerChange={handleAnswerChange} />
          </div>
        ))}
        <button type="submit">Nộp Bài</button>
      </form>
    </div>
  );
};

const Questions = ({ partId, testId, onAnswerChange }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/test/${testId}/part/${partId}/questions`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  }, [testId, partId]);

  return (
    <div>
      {questions.map(question => (
        <div key={question.question_id}>
          <p>{question.question_text}</p>
          <Options 
            questionId={question.question_id}
            options={question.options}
            onAnswerChange={onAnswerChange} 
          />
        </div>
      ))}
    </div>
  );
};

const Options = ({ questionId, options, onAnswerChange }) => {
  return (
    <div>
      {options.map(option => (
        <label key={option.option_id}>
          <input 
            type="radio" 
            name={`question-${questionId}`} 
            value={option.label} 
            onChange={() => onAnswerChange(questionId, option.label)} 
          />
          {option.content}
        </label>
      ))}
    </div>
  );
};

export default Test;
