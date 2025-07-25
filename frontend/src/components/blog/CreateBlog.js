import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const BACKEND_URL = 'http://localhost:8080';

const CreateBlog = () => {
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        content: '',
        author: currentUser?.username || ''
    });
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Xử lý các trường nhập liệu text
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý chọn file ảnh/video/pdf
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (!file) return;

        // Kiểm tra size file
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB
        if (file.size > MAX_SIZE) {
            alert(`File quá lớn! Vui lòng chọn file nhỏ hơn 50MB. File hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            e.target.value = ''; // Clear input
            return;
        }

        if (name === 'image') {
            // Kiểm tra định dạng ảnh
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh hợp lệ!');
                e.target.value = '';
                return;
            }
            setImage(file);
        } else if (name === 'video') {
            // Kiểm tra định dạng video
            if (!file.type.startsWith('video/')) {
                alert('Vui lòng chọn file video hợp lệ!');
                e.target.value = '';
                return;
            }
            console.log('Video selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
            setVideo(file);
        } else if (name === 'pdf') {
            // Kiểm tra định dạng PDF
            if (file.type !== 'application/pdf') {
                alert('Vui lòng chọn file PDF hợp lệ!');
                e.target.value = '';
                return;
            }
            setPdf(file);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated || !currentUser) {
            alert('Bạn cần đăng nhập để đăng bài viết!');
            return;
        }

        // Kiểm tra role - chỉ COLLABORATOR và ADMIN mới được tạo blog
        if (currentUser.role !== 'COLLABORATOR' && currentUser.role !== 'ADMIN') {
            alert('Chỉ cộng tác viên và admin mới có thể tạo blog!');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('author', form.author || currentUser.username);

        if (image) {
            formData.append('image', image);
            console.log('📷 Adding image:', image.name, 'Size:', (image.size / 1024 / 1024).toFixed(2) + 'MB');
        }
        if (video) {
            formData.append('video', video);
            console.log('🎥 Adding video:', video.name, 'Size:', (video.size / 1024 / 1024).toFixed(2) + 'MB');
        }
        if (pdf) {
            formData.append('pdf', pdf);
            console.log('📄 Adding PDF:', pdf.name, 'Size:', (pdf.size / 1024 / 1024).toFixed(2) + 'MB');
        }

        // Get token from multiple possible storage keys
        const token = localStorage.getItem('toeic_access_token') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('accessToken');

        if (!token) {
            alert('Bạn cần đăng nhập để đăng bài viết!');
            setLoading(false);
            return;
        }

        console.log('🚀 Starting blog upload...');

        axios.post(`${BACKEND_URL}/api/blog/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // KHÔNG cần set Content-Type, axios sẽ tự động set cho FormData
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`📤 Upload progress: ${percentCompleted}%`);
            }
        })
            .then((response) => {
                console.log('✅ Blog upload successful:', response.data);
                alert('Đăng bài viết thành công!');
                navigate('/admin/blog'); // Quay về trang quản lý blog
            })
            .catch(error => {
                console.error('❌ Lỗi khi đăng bài viết:', error);
                console.error('Error details:', {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });

                if (error.response && error.response.status === 401) {
                    alert('Bạn cần đăng nhập để đăng bài viết!');
                } else if (error.response && error.response.status === 413) {
                    alert('File quá lớn! Vui lòng chọn file nhỏ hơn.');
                } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                    alert('Lỗi kết nối mạng! Vui lòng kiểm tra kết nối và thử lại.');
                } else {
                    alert('Đăng bài viết thất bại! ' + (error.response?.data || error.message));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Kiểm tra quyền trước khi render form
    if (!isAuthenticated || !currentUser) {
        return (
            <div style={{
                maxWidth: 800,
                margin: '20px auto',
                padding: 32,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#ef4444', marginBottom: 16 }}>Yêu cầu đăng nhập</h2>
                <p>Bạn cần đăng nhập để tạo bài viết blog.</p>
            </div>
        );
    }

    if (currentUser.role !== 'COLLABORATOR' && currentUser.role !== 'ADMIN') {
        return (
            <div style={{
                maxWidth: 800,
                margin: '20px auto',
                padding: 32,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#ef4444', marginBottom: 16 }}>Không có quyền truy cập</h2>
                <p>Chỉ cộng tác viên và admin mới có thể tạo bài viết blog.</p>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
                    Role hiện tại: {currentUser.role}
                </p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 800,
            margin: '20px auto',
            padding: 32,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
        }}>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: 8
                }}>Tạo bài viết mới</h2>
                <p style={{
                    color: '#64748b',
                    fontSize: 16
                }}>Tạo và đăng bài viết blog mới cho hệ thống</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                    }}>Tiêu đề *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: 16,
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        placeholder="Nhập tiêu đề bài viết..."
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                    }}>Nội dung *</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        rows={8}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: 16,
                            transition: 'border-color 0.2s',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        placeholder="Nhập nội dung bài viết..."
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                    }}>Tác giả *</label>
                    <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: 16,
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        placeholder="Tên tác giả..."
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#374151'
                        }}>📷 Ảnh (tùy chọn)</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '2px dashed #d1d5db',
                                borderRadius: 8,
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        />
                        {image && (
                            <p style={{ marginTop: 8, fontSize: 12, color: '#16a34a' }}>
                                ✓ {image.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#374151'
                        }}>🎥 Video (tùy chọn)</label>
                        <input
                            type="file"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '2px dashed #d1d5db',
                                borderRadius: 8,
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        />
                        {video && (
                            <p style={{ marginTop: 8, fontSize: 12, color: '#16a34a' }}>
                                ✓ {video.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#374151'
                        }}>📄 PDF (tùy chọn)</label>
                        <input
                            type="file"
                            name="pdf"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '2px dashed #d1d5db',
                                borderRadius: 8,
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        />
                        {pdf && (
                            <p style={{ marginTop: 8, fontSize: 12, color: '#16a34a' }}>
                                ✓ {pdf.name}
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blog')}
                        style={{
                            padding: '12px 24px',
                            border: '2px solid #e5e7eb',
                            borderRadius: 8,
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                            e.target.style.borderColor = '#d1d5db';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#ffffff';
                            e.target.style.borderColor = '#e5e7eb';
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: 8,
                            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                            color: '#ffffff',
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#2563eb';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#3b82f6';
                            }
                        }}
                    >
                        {loading ? 'Đang đăng...' : 'Đăng bài viết'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
