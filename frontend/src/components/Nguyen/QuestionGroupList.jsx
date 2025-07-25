import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuestionGroupList = ({ onSelectGroup, refreshTrigger }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPart, setFilterPart] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const partOptions = [
    { value: '', label: 'Tất cả các phần' },
    { value: '1', label: 'Part 1 - Photographs' },
    { value: '2', label: 'Part 2 - Question-Response' },
    { value: '3', label: 'Part 3 - Conversations' },
    { value: '4', label: 'Part 4 - Talks' },
    { value: '5', label: 'Part 5 - Incomplete Sentences' },
    { value: '6', label: 'Part 6 - Text Completion' },
    { value: '7', label: 'Part 7 - Reading Comprehension' }
  ];

  useEffect(() => {
    fetchGroups();
  }, [refreshTrigger]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token xác thực');
      }

      console.log('🔍 Fetching groups with token:', token ? 'present' : 'missing');
      
      const response = await fetch('http://localhost:8080/api/question-group', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Groups fetched:', data);
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Không thể tải danh sách nhóm câu hỏi: ' + error.message);
      toast.error('Không thể tải danh sách nhóm câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${groupName}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/question-group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setGroups(groups.filter(group => group.id !== groupId));
      toast.success(`Đã xóa nhóm "${groupName}" thành công`);
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Không thể xóa nhóm câu hỏi: ' + error.message);
    }
  };

  // Filter and search logic
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPart = !filterPart || group.partId?.toString() === filterPart;
    return matchesSearch && matchesPart;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  const getPartName = (partId) => {
    const part = partOptions.find(p => p.value === partId?.toString());
    return part ? part.label : `Part ${partId}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h6>Lỗi:</h6>
        <p className="mb-0">{error}</p>
        <button className="btn btn-outline-danger btn-sm mt-2" onClick={fetchGroups}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Danh sách nhóm câu hỏi</h5>
          <span className="badge bg-primary">{filteredGroups.length} nhóm</span>
        </div>
      </div>

      <div className="card-body">
        {/* Search and Filter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên nhóm hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterPart}
              onChange={(e) => {
                setFilterPart(e.target.value);
                setCurrentPage(1);
              }}
            >
              {partOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={fetchGroups}>
              Làm mới
            </button>
          </div>
        </div>

        {/* Groups List */}
        {paginatedGroups.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">Không có nhóm câu hỏi nào.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Tên nhóm</th>
                    <th>Part</th>
                    <th>Loại</th>
                    <th>Số câu hỏi</th>
                    <th>Mô tả</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedGroups.map((group) => (
                    <tr key={group.id}>
                      <td>
                        <strong>{group.groupName}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {getPartName(group.partId)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${group.groupType === 'PRACTICE' ? 'bg-success' : 'bg-warning'}`}>
                          {group.groupType === 'PRACTICE' ? 'Luyện tập' : 'Kiểm tra'}
                        </span>
                      </td>
                      <td>
                        <span className="text-primary fw-bold">
                          {group.questionCount || 0}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {group.description ? 
                            (group.description.length > 50 ? 
                              group.description.substring(0, 50) + '...' : 
                              group.description
                            ) : 
                            'Không có mô tả'
                          }
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🔍 View button clicked for group:', group);
                              console.log('🔍 Current location before navigate:', window.location.href);
                              console.log('🔍 Navigating to:', `/questions/groups/${group.id}`);
                              
                              // Check authentication before navigate
                              const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
                              console.log('🔍 Token status:', token ? 'EXISTS' : 'MISSING');
                              
                              // Navigate to view page - using correct route
                              navigate(`/questions/groups/${group.id}`);
                              
                              // Check if navigation happened
                              setTimeout(() => {
                                console.log('🔍 Location after navigate:', window.location.href);
                              }, 100);
                            }}
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning me-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('✏️ Edit button clicked for group:', group);
                              console.log('✏️ Current location before navigate:', window.location.href);
                              console.log('✏️ Navigating to:', `/questions/groups/${group.id}/edit`);
                              
                              // Check authentication before navigate
                              const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
                              console.log('✏️ Token status:', token ? 'EXISTS' : 'MISSING');
                              
                              // Navigate to edit page - using correct route
                              navigate(`/questions/groups/${group.id}/edit`);
                              
                              // Check if navigation happened
                              setTimeout(() => {
                                console.log('✏️ Location after navigate:', window.location.href);
                              }, 100);
                            }}
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteGroup(group.id, group.groupName)}
                            title="Xóa nhóm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      Đầu
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (page === currentPage || 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                    }
                    return null;
                  })}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Tiếp
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Cuối
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionGroupList;
