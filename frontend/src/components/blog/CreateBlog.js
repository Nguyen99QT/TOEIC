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
        if (name === 'image') {
            setImage(files[0]); // nếu bạn có state image
        } else if (name === 'video') {
            setVideo(files[0]); // nếu bạn có state video
        } else if (name === 'pdf') {
            setPdf(files[0]);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isAuthenticated || !currentUser) {
            alert('Bạn cần đăng nhập để đăng bài viết!');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('author', form.author || currentUser.username);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        if (pdf) formData.append('pdf', pdf);

        // Get token from multiple possible storage keys
        const token = localStorage.getItem('toeic_access_token') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('accessToken');

        if (!token) {
            alert('Bạn cần đăng nhập để đăng bài viết!');
            setLoading(false);
            return;
        }

        axios.post(`${BACKEND_URL}/api/blog/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // KHÔNG cần set Content-Type, axios sẽ tự động set cho FormData
            }
        })
            .then(() => {
                alert('Đăng bài viết thành công!');
                navigate('/admin/blog'); // Quay về trang quản lý blog
            })
            .catch(error => {
                console.error('Lỗi khi đăng bài viết:', error);
                if (error.response && error.response.status === 401) {
                    alert('Bạn cần đăng nhập để đăng bài viết!');
                } else {
                    alert('Đăng bài viết thất bại!');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
