import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  hidden?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
}

const BACKEND_URL = 'http://localhost:8080';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Check if user can edit this blog
  const canEdit = useCallback((blog: BlogPost | null): boolean => {
    if (!currentUser || !blog) return false;
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'COLLABORATOR' && blog.author === currentUser.username) return true;
    return false;
  }, [currentUser]);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`${BACKEND_URL}/api/blog/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blogData = await response.json();
        setBlog(blogData);
        setTitle(blogData.title);
        setContent(blogData.content);

        // Check if user can edit this blog
        if (!canEdit(blogData)) {
          toast.error('Bạn không có quyền chỉnh sửa bài viết này');
          navigate('/blogs');
          return;
        }
      } else {
        throw new Error('Không thể tải bài viết');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Có lỗi xảy ra khi tải bài viết');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, canEdit]);

  useEffect(() => {
    if (!id) {
      toast.error('ID blog không hợp lệ');
      navigate('/blogs');
      return;
    }
    fetchBlog();
  }, [id, navigate, fetchBlog]);

  const handleSave = async () => {
    console.log('🔘 Save button clicked!');
    console.log('🔘 Title:', title?.substring(0, 50));
    console.log('🔘 Content:', content?.substring(0, 50));
    console.log('🔘 Current user:', currentUser);
    console.log('🔘 Can edit:', canEdit(blog));
    
    if (!title.trim()) {
      console.log('❌ No title provided');
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    if (!content.trim()) {
      console.log('❌ No content provided');
      toast.error('Vui lòng nhập nội dung');
      return;
    }

    console.log('✅ Validation passed, proceeding to save...');
    try {
      setSaving(true);
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      console.log('� DEBUG TOKEN INFO:');
      console.log('- toeic_access_token:', localStorage.getItem('toeic_access_token') ? 'EXISTS' : 'NULL');
      console.log('- authToken:', localStorage.getItem('authToken') ? 'EXISTS' : 'NULL');  
      console.log('- accessToken:', localStorage.getItem('accessToken') ? 'EXISTS' : 'NULL');
      console.log('- Final token used:', token ? token.substring(0, 30) + '...' : 'NULL');
      console.log('- Token length:', token?.length || 0);

      console.log('�🔄 Preparing FormData for blog update:', {
        id,
        title,
        content: content.substring(0, 50) + '...',
        hasImageFile: !!imageFile,
        hasVideoFile: !!videoFile,
        hasPdfFile: !!pdfFile
      });

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      if (imageFile) {
        formData.append('image', imageFile);
        console.log('📸 Added image file:', imageFile.name);
      }
      if (videoFile) {
        formData.append('video', videoFile);
        console.log('🎬 Added video file:', videoFile.name);
      }
      if (pdfFile) {
        formData.append('pdf', pdfFile);
        console.log('📄 Added PDF file:', pdfFile.name);
      }

      console.log('🚀 Sending PUT request to:', `${BACKEND_URL}/api/blog/${id}/upload`);

      const response = await fetch(`${BACKEND_URL}/api/blog/${id}/upload`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Update successful:', result);
        toast.success('Cập nhật bài viết thành công!');
        navigate('/blogs');
      } else {
        const errorData = await response.text();
        console.error('❌ Update failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      console.error('❌ Error updating blog:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/blogs');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file types
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh hợp lệ');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video hợp lệ');
      return;
    }
    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error('Vui lòng chọn file PDF hợp lệ');
      return;
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
      return;
    }

    switch (type) {
      case 'image':
        setImageFile(file);
        break;
      case 'video':
        setVideoFile(file);
        break;
      case 'pdf':
        setPdfFile(file);
        break;
    }
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: 800,
        margin: '36px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.08)',
        textAlign: 'center'
      }}>
        <h2>🔄 Đang tải...</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{
        maxWidth: 800,
        margin: '36px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.08)',
        textAlign: 'center'
      }}>
        <h2>❌ Không tìm thấy bài viết</h2>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 800,
      margin: '36px auto',
      padding: 24,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.08)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#172945',
          margin: '0 0 8px 0'
        }}>
          ✏️ Chỉnh sửa bài viết
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Bài viết của: {blog.author} • Tạo ngày: {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Title Input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          color: '#333'
        }}>
          Tiêu đề *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết..."
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2264ea'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>

      {/* Content Textarea */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          color: '#333'
        }}>
          Nội dung *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bài viết..."
          rows={12}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2264ea'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>

      {/* File Uploads */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: '#333' }}>📎 Tệp đính kèm</h3>
        
        {/* Current Files */}
        {(blog.imageUrl || blog.videoUrl || blog.pdfUrl) && (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 8, color: '#666', fontSize: 14 }}>Tệp hiện tại:</h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {blog.imageUrl && (
                <span style={{ 
                  padding: '4px 8px', 
                  background: '#e3f2fd', 
                  borderRadius: 4, 
                  fontSize: 12,
                  color: '#1976d2'
                }}>
                  🖼️ Hình ảnh
                </span>
              )}
              {blog.videoUrl && (
                <span style={{ 
                  padding: '4px 8px', 
                  background: '#f3e5f5', 
                  borderRadius: 4, 
                  fontSize: 12,
                  color: '#7b1fa2'
                }}>
                  🎥 Video
                </span>
              )}
              {blog.pdfUrl && (
                <span style={{ 
                  padding: '4px 8px', 
                  background: '#fff3e0', 
                  borderRadius: 4, 
                  fontSize: 12,
                  color: '#f57c00'
                }}>
                  📄 PDF
                </span>
              )}
            </div>
          </div>
        )}

        {/* New File Uploads */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              🖼️ Hình ảnh mới
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
              style={{ width: '100%', fontSize: 12 }}
            />
            {imageFile && (
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#666' }}>
                Đã chọn: {imageFile.name}
              </p>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              🎥 Video mới
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              style={{ width: '100%', fontSize: 12 }}
            />
            {videoFile && (
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#666' }}>
                Đã chọn: {videoFile.name}
              </p>
            )}
          </div>

          {/* PDF Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              📄 PDF mới
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'pdf')}
              style={{ width: '100%', fontSize: 12 }}
            />
            {pdfFile && (
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#666' }}>
                Đã chọn: {pdfFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={handleCancel}
          disabled={saving}
          style={{
            padding: '12px 24px',
            background: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => {
            if (!saving) e.currentTarget.style.background = '#5a6268';
          }}
          onMouseOut={(e) => {
            if (!saving) e.currentTarget.style.background = '#6c757d';
          }}
        >
          ❌ Hủy
        </button>
        
        <button
          onClick={handleSave}
          disabled={saving || !title.trim() || !content.trim()}
          style={{
            padding: '12px 24px',
            background: saving || !title.trim() || !content.trim() ? '#ccc' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: saving || !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => {
            if (!saving && title.trim() && content.trim()) {
              e.currentTarget.style.background = '#218838';
            }
          }}
          onMouseOut={(e) => {
            if (!saving && title.trim() && content.trim()) {
              e.currentTarget.style.background = '#28a745';
            }
          }}
        >
          {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default EditBlog;
