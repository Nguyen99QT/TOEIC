import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditTest = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/test/${testId}/questions`)
      .then(response => {
        setQuestions(response.data);
        setAnswers(response.data.map(question => ({
          question_id: question.question_id,
          selected_option: question.selected_option || '' 
        })));
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi lấy câu hỏi!", error);
      });
  }, [testId]);

  const checkAnswer = (questionId, selectedOption, correctOption) => {
    if (selectedOption === correctOption) {
      return 'correct'; 
    }
    return 'incorrect'; 
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Kết Quả Bài Thi TOEIC</h2>
      {questions.map(question => (
        <div key={question.question_id} className="mb-4">
          <h5>{question.question_text}</h5>
          <div className="list-group">
            {question.options.map(option => {
              const answerStatus = checkAnswer(question.question_id, answers.find(ans => ans.question_id === question.question_id)?.selected_option, question.correct_option);
              return (
                <label
                  key={option.option_id}
                  className={`list-group-item ${answerStatus === 'incorrect' && answers.find(ans => ans.question_id === question.question_id)?.selected_option === option.label ? 'bg-danger text-white' : ''} 
                             ${answerStatus === 'correct' && answers.find(ans => ans.question_id === question.question_id)?.selected_option === option.label ? 'bg-success text-white' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.question_id}`}
                    value={option.label}
                    checked={answers.find(ans => ans.question_id === question.question_id)?.selected_option === option.label}
                    disabled 
                  />
                  {option.content}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditTest;
