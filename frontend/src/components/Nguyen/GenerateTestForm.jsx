import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenerateTestForm = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [partNumber, setPartNumber] = useState(1);  // Mặc định Part 1
    const [previewQuestions, setPreviewQuestions] = useState([]);

    // Lấy câu hỏi từ backend khi partNumber thay đổi
    useEffect(() => {
        axios.get(`http://localhost:8080/api/question-bank/part/${partNumber}`)
            .then(response => {
                setQuestions(response.data);
                setPreviewQuestions(response.data);  // Cập nhật câu hỏi để xem trước
            })
            .catch(error => console.error('Lỗi khi tải câu hỏi:', error));
    }, [partNumber]);

    const handleQuestionSelect = (questionId) => {
        setSelectedQuestions(prevState => {
            if (prevState.includes(questionId)) {
                return prevState.filter(id => id !== questionId);  // Xóa câu hỏi khỏi danh sách
            } else {
                return [...prevState, questionId];  // Thêm câu hỏi vào danh sách
            }
        });
    };

    const handleGenerateTest = () => {
        if (selectedQuestions.length === 0) {
            alert('Vui lòng chọn ít nhất một câu hỏi!');
            return;
        }

        axios.post('http://localhost:8080/api/tests/generate', selectedQuestions)
            .then(response => {
                alert('Bài test đã được tạo thành công với ID: ' + response.data);
            })
            .catch(error => {
                console.error('Lỗi khi tạo bài test:', error);
                alert('Có lỗi xảy ra. Vui lòng thử lại!');
            });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Tạo Bài Test TOEIC</h2>
            
            {/* Dropdown chọn phần câu hỏi */}
            <div className="form-group">
                <label className="font-weight-bold">Chọn phần câu hỏi:</label>
                <select
                    className="form-control w-75 mx-auto mb-3"
                    value={partNumber}
                    onChange={(e) => setPartNumber(Number(e.target.value))}
                >
                    <option value={1}>Part 1</option>
                    <option value={2}>Part 2</option>
                    <option value={3}>Part 3</option>
                    <option value={4}>Part 4</option>
                    <option value={5}>Part 5</option>
                    <option value={6}>Part 6</option>
                    <option value={7}>Part 7</option>
                </select>
            </div>

            {/* Xem trước câu hỏi */}
            <div className="form-group">
                <h3>Xem trước câu hỏi từ phần {partNumber}:</h3>
                {previewQuestions.length > 0 ? (
                    previewQuestions.map((question) => (
                        <div key={question.id}>
                            <input
                                type="checkbox"
                                value={question.id}
                                onChange={() => handleQuestionSelect(question.id)}
                            />
                            <label>{question.questionText}</label>
                        </div>
                    ))
                ) : (
                    <p>Không có câu hỏi trong phần này.</p>
                )}
            </div>

            {/* Nút tạo bài test */}
            <button
                onClick={handleGenerateTest}
                className="btn btn-primary btn-block"
            >
                Tạo Bài Test
            </button>
        </div>
    );
};

export default GenerateTestForm;
