import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { persistentLogger } from '../../utils/persistentLogger';
import LoadingSpinner from '../ui/LoadingSpinner';

const GenerateTestForm = () => {
    const navigate = useNavigate();
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [partNumber, setPartNumber] = useState(1);  // Mặc định Part 1
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy câu hỏi từ backend khi partNumber thay đổi
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/question-bank/part/${partNumber}`);
                setPreviewQuestions(response.data);  // Cập nhật câu hỏi để xem trước
                persistentLogger.info(`Loaded ${response.data.length} questions for part ${partNumber}`);
            } catch (error) {
                console.error('Lỗi khi tải câu hỏi:', error);
                setError('Không thể tải câu hỏi. Vui lòng thử lại.');
                persistentLogger.error(`Failed to load questions for part ${partNumber}: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
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

    const handleGenerateTest = async () => {
        if (selectedQuestions.length === 0) {
            alert('Vui lòng chọn ít nhất một câu hỏi!');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/tests/generate', {
                questionIds: selectedQuestions,
                partNumber: partNumber
            });
            alert('Bài test đã được tạo thành công với ID: ' + response.data.testId);
            persistentLogger.info(`Test created successfully with ID: ${response.data.testId}`);
            navigate(`/tests/${response.data.testId}`);
        } catch (error) {
            console.error('Lỗi khi tạo bài test:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            alert(errorMessage);
            setError(errorMessage);
            persistentLogger.error(`Failed to create test: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Tạo Bài Test TOEIC</h2>

            {/* Error display */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Dropdown chọn phần câu hỏi */}
            <div className="form-group">
                <label className="font-weight-bold">Chọn phần câu hỏi:</label>
                <select
                    className="form-control w-75 mx-auto mb-3"
                    value={partNumber}
                    onChange={(e) => setPartNumber(Number(e.target.value))}
                    disabled={loading}
                >
                    <option value={1}>Part 1 - Photographs</option>
                    <option value={2}>Part 2 - Question-Response</option>
                    <option value={3}>Part 3 - Conversations</option>
                    <option value={4}>Part 4 - Short Talks</option>
                    <option value={5}>Part 5 - Incomplete Sentences</option>
                    <option value={6}>Part 6 - Text Completion</option>
                    <option value={7}>Part 7 - Reading Comprehension</option>
                </select>
            </div>

            {/* Loading spinner */}
            {loading && (
                <div className="text-center my-4">
                    <LoadingSpinner />
                    <p>Đang tải câu hỏi...</p>
                </div>
            )}

            {/* Xem trước câu hỏi */}
            {!loading && (
                <div className="form-group">
                    <h3>Xem trước câu hỏi từ phần {partNumber} ({previewQuestions.length} câu):</h3>
                    {previewQuestions.length > 0 ? (
                        <div className="row">
                            {previewQuestions.map((question) => (
                                <div key={question.id} className="col-md-6 mb-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`question-${question.id}`}
                                                    value={question.id}
                                                    checked={selectedQuestions.includes(question.id)}
                                                    onChange={() => handleQuestionSelect(question.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`question-${question.id}`}>
                                                    <strong>Q{question.id}:</strong> {question.questionText}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <p>Không có câu hỏi trong phần này.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Selection summary */}
            {selectedQuestions.length > 0 && (
                <div className="alert alert-success">
                    <p><strong>Đã chọn {selectedQuestions.length} câu hỏi</strong></p>
                </div>
            )}

            {/* Nút tạo bài test */}
            <div className="text-center">
                <button
                    onClick={handleGenerateTest}
                    className="btn btn-primary btn-lg"
                    disabled={loading || selectedQuestions.length === 0}
                >
                    {loading ? 'Đang tạo...' : `Tạo Bài Test (${selectedQuestions.length} câu)`}
                </button>
            </div>
        </div>
    );
};

export default GenerateTestForm;
