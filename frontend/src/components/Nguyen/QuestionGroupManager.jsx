import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ToastConfig from './ToastConfig';

const QuestionGroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/question-group/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setGroups(response.data || []);
      toast.success(`Đã tải ${response.data?.length || 0} nhóm câu hỏi`);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhóm câu hỏi:', error);
      toast.error('Không thể tải danh sách nhóm câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhóm câu hỏi này?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/question-group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setGroups(groups.filter(g => g.id !== groupId));
      toast.success('Đã xóa nhóm câu hỏi thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa nhóm câu hỏi:', error);
      toast.error('Không thể xóa nhóm câu hỏi');
    }
  };

  const viewGroupDetails = (group) => {
    setSelectedGroup(group);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải danh sách nhóm câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastConfig />
      <div className="container mt-5">
        <div className="card p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">Question Group Management</h2>
            <button 
              className="btn btn-success"
              onClick={() => window.location.href = '/add-question-group'}
            >
              Add New Group
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-question-circle fa-4x text-muted"></i>
              </div>
              <h4 className="text-muted">No question groups yet</h4>
              <p className="text-muted">Create your first question group!</p>
            </div>
          ) : (
            <div className="row">
              {groups.map((group) => (
                <div key={group.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title text-truncate">{group.title}</h5>
                        <span className={`badge ${group.type === 'READING' ? 'bg-primary' : 'bg-warning'}`}>
                          {group.type === 'READING' ? '📖 Reading' : '🎧 Listening'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Part:</strong> {group.partId} | 
                          <strong> Số câu hỏi:</strong> {group.questions?.length || 0}
                        </small>
                      </div>

                      {group.content && (
                        <p className="card-text text-muted small">
                          {group.content.substring(0, 100)}
                          {group.content.length > 100 && '...'}
                        </p>
                      )}

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => viewGroupDetails(group)}
                          >
                            Xem chi tiết
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteGroup(group.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Details Modal */}
        {showDetails && selectedGroup && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedGroup.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowDetails(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Loại:</strong> {selectedGroup.type}
                    </div>
                    <div className="col-md-6">
                      <strong>Part:</strong> {selectedGroup.partId}
                    </div>
                  </div>

                  {selectedGroup.content && (
                    <div className="mb-3">
                      <strong>Nội dung:</strong>
                      <p className="mt-2 p-3 bg-light rounded">{selectedGroup.content}</p>
                    </div>
                  )}

                  <div className="mb-3">
                    <strong>Câu hỏi ({selectedGroup.questions?.length || 0}):</strong>
                    {selectedGroup.questions?.map((question, index) => (
                      <div key={index} className="mt-3 p-3 border rounded">
                        <h6>Câu {index + 1}: {question.questionText}</h6>
                        <div className="row">
                          {question.options?.map((option) => (
                            <div key={option.optionLabel} className="col-md-6 mb-2">
                              <span className={option.optionLabel === question.correctOption ? 'fw-bold text-success' : ''}>
                                {option.optionLabel}. {option.optionText}
                                {option.optionLabel === question.correctOption && ' ✓'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <small className="text-muted">Đáp án đúng: {question.correctOption}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowDetails(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionGroupManager;
