import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const BlogList = () => {
  const { currentUser } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);
  const [showManagement, setShowManagement] = useState(false);

  // Check if user has management permissions
  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'COLLABORATOR';

  const fetchBlogs = async (keyword = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const url = keyword
        ? `${BACKEND_URL}/api/blog/search?title=${encodeURIComponent(keyword)}`
        : `${BACKEND_URL}/api/blog`;

      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);

        // Fetch like counts for each blog
        if (data && data.length > 0) {
          const counts: Record<number, number> = {};
          await Promise.all(
            data.map(async (blog: BlogPost) => {
              try {
                const res = await fetch(`${BACKEND_URL}/api/blog/${blog.id}/likes`, { headers });
                if (res.ok) {
                  counts[blog.id] = await res.json();
                } else {
                  counts[blog.id] = 0;
                }
              } catch {
                counts[blog.id] = 0;
              }
            })
          );
          setLikeCounts(counts);
        } else {
          setLikeCounts({});
        }
      } else {
        throw new Error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Không thể tải danh sách blog');
      setBlogs([]);
      setLikeCounts({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(searchKeyword);
  };

  const handleBlogSelection = (blogId: number) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog.id));
    }
  };

  // Single blog actions
  const handleSingleHide = async (blogId: number) => {
    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`${BACKEND_URL}/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Đã ẩn bài viết thành công');
        fetchBlogs(searchKeyword);
      } else {
        toast.error('Không thể ẩn bài viết');
      }
    } catch (error) {
      console.error('Error hiding blog:', error);
      toast.error('Có lỗi xảy ra khi ẩn bài viết');
    }
  };

  const handleSingleRestore = async (blogId: number) => {
    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`${BACKEND_URL}/api/blog/${blogId}/unhide`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Đã khôi phục bài viết thành công');
        fetchBlogs(searchKeyword);
      } else {
        toast.error('Không thể khôi phục bài viết');
      }
    } catch (error) {
      console.error('Error restoring blog:', error);
      toast.error('Có lỗi xảy ra khi khôi phục bài viết');
    }
  };

  const handleSingleDelete = async (blogId: number) => {
    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`${BACKEND_URL}/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Đã xóa bài viết thành công');
        fetchBlogs(searchKeyword);
      } else {
        toast.error('Không thể xóa bài viết');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  const handleHideBlogs = async () => {
    if (selectedBlogs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một bài viết');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn ẩn ${selectedBlogs.length} bài viết đã chọn?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const promises = selectedBlogs.map(blogId =>
        fetch(`${BACKEND_URL}/api/blog/${blogId}/hide`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(res => res.ok).length;

      if (successCount === selectedBlogs.length) {
        toast.success(`Đã ẩn ${successCount} bài viết thành công`);
      } else {
        toast.warning(`Đã ẩn ${successCount}/${selectedBlogs.length} bài viết`);
      }

      setSelectedBlogs([]);
      fetchBlogs(searchKeyword);
    } catch (error) {
      console.error('Error hiding blogs:', error);
      toast.error('Có lỗi xảy ra khi ẩn bài viết');
    }
  };

  const handleRestoreBlogs = async () => {
    if (selectedBlogs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một bài viết');
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const promises = selectedBlogs.map(blogId =>
        fetch(`${BACKEND_URL}/api/blog/${blogId}/unhide`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(res => res.ok).length;

      if (successCount === selectedBlogs.length) {
        toast.success(`Đã khôi phục ${successCount} bài viết thành công`);
      } else {
        toast.warning(`Đã khôi phục ${successCount}/${selectedBlogs.length} bài viết`);
      }

      setSelectedBlogs([]);
      fetchBlogs(searchKeyword);
    } catch (error) {
      console.error('Error restoring blogs:', error);
      toast.error('Có lỗi xảy ra khi khôi phục bài viết');
    }
  };

  const handleDeleteBlogs = async () => {
    if (selectedBlogs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một bài viết');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${selectedBlogs.length} bài viết đã chọn? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const promises = selectedBlogs.map(blogId =>
        fetch(`${BACKEND_URL}/api/blog/${blogId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(res => res.ok).length;

      if (successCount === selectedBlogs.length) {
        toast.success(`Đã xóa ${successCount} bài viết thành công`);
      } else {
        toast.warning(`Đã xóa ${successCount}/${selectedBlogs.length} bài viết`);
      }

      setSelectedBlogs([]);
      fetchBlogs(searchKeyword);
    } catch (error) {
      console.error('Error deleting blogs:', error);
      toast.error('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  return (
    <div style={{
      maxWidth: 1200,
      margin: '36px auto 0 auto',
      padding: 24,
      background: 'linear-gradient(110deg, #f3f4f8 60%, #dde6f7 100%)',
      minHeight: '100vh',
      borderRadius: 16,
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.08)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#172945',
          margin: 0,
          letterSpacing: 1
        }}>📰 Danh sách bài viết</h2>

        {canManage && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link
              to="/create-blog"
              style={{
                padding: '10px 20px',
                background: '#2264ea',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                transition: 'background 0.2s'
              }}
            >
              ✏️ Tạo bài viết mới
            </Link>
            <button
              onClick={() => setShowManagement(!showManagement)}
              style={{
                padding: '10px 20px',
                background: showManagement ? '#dc3545' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {showManagement ? '❌ Đóng quản lý' : '⚙️ Quản lý'}
            </button>
          </div>
        )}
      </div>

      {/* Management Controls */}
      {canManage && showManagement && (
        <div style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#172945' }}>🛠️ Công cụ quản lý</h3>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <button
              onClick={handleSelectAll}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              {selectedBlogs.length === blogs.length ? '❌ Bỏ chọn tất cả' : '✅ Chọn tất cả'}
            </button>
            
            <span style={{ color: '#666', fontSize: 14 }}>
              Đã chọn: {selectedBlogs.length}/{blogs.length} bài viết
            </span>
          </div>

          {selectedBlogs.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleHideBlogs}
                style={{
                  padding: '8px 16px',
                  background: '#ffc107',
                  color: '#000',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                🙈 Ẩn bài viết
              </button>
              
              <button
                onClick={handleRestoreBlogs}
                style={{
                  padding: '8px 16px',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                👁️ Khôi phục
              </button>

              {currentUser?.role === 'ADMIN' && (
                <button
                  onClick={handleDeleteBlogs}
                  style={{
                    padding: '8px 16px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🗑️ Xóa vĩnh viễn
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm bài viết theo tiêu đề..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              flexGrow: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid #ccc',
              fontSize: 16,
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          />
          <button type="submit" style={{
            padding: '10px 20px',
            background: '#2264ea',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            Tìm
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div style={{
          padding: 40,
          background: "#fff4",
          borderRadius: 16,
          textAlign: "center",
          color: "#555"
        }}>
          <p>🔄 Đang tải...</p>
        </div>
      )}

      {/* No Blogs State */}
      {!loading && blogs.length === 0 && (
        <div style={{
          padding: 40,
          background: "#fff4",
          borderRadius: 16,
          textAlign: "center",
          color: "#555"
        }}>
          <p>📭 Không có bài viết nào.</p>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && blogs.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32
        }}>
          {blogs.map(blog => (
            <div
              key={blog.id}
              style={{
                background: blog.hidden ? '#f8f9fa' : '#fff',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 4px 24px 0 rgba(52, 84, 209, 0.09)',
                transition: 'transform 0.17s, box-shadow 0.17s',
                border: blog.hidden ? '2px dashed #ccc' : 'none',
                position: 'relative',
                minHeight: 390,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflow: 'hidden',
                opacity: blog.hidden ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!blog.hidden) {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                }
              }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {/* Selection Checkbox for Management */}
              {canManage && showManagement && (
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 10
                }}>
                  <input
                    type="checkbox"
                    checked={selectedBlogs.includes(blog.id)}
                    onChange={() => handleBlogSelection(blog.id)}
                    style={{
                      width: 20,
                      height: 20,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}

              {/* Hidden Badge */}
              {blog.hidden && (
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: '#ffc107',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  zIndex: 10
                }}>
                  🙈 Đã ẩn
                </div>
              )}

              <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  width: '100%',
                  height: 170,
                  overflow: 'hidden',
                  borderRadius: 12,
                  marginBottom: 18,
                  background: '#f1f5fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {blog.imageUrl ? (
                    <img
                      src={`${BACKEND_URL}${blog.imageUrl}`}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 12,
                        transition: 'transform 0.2s',
                      }}
                      onError={e => e.currentTarget.style.display = 'none'}
                    />
                  ) : (
                    <span style={{ color: "#aaa", fontSize: 72 }}>🖼️</span>
                  )}
                </div>
                <h3 style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 12,
                  color: blog.hidden ? '#666' : '#24345c'
                }}>
                  {blog.title}
                </h3>
                <p style={{
                  color: blog.hidden ? '#999' : '#587',
                  fontSize: 14,
                  marginBottom: 14,
                  minHeight: 32,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box'
                }}>
                  {(blog.content || '').length > 80
                    ? blog.content.substring(0, 80) + '...'
                    : blog.content}
                </p>
              </Link>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <div style={{
                  color: '#1976d2',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 16
                }}>
                  <span role="img" aria-label="like" style={{ fontSize: 21, marginRight: 6, marginTop: 2 }}>❤️</span>
                  {likeCounts[blog.id] ?? 0}
                  <span style={{ fontSize: 13, color: '#666', marginLeft: 5 }}>lượt thích</span>
                </div>
                <div style={{
                  color: '#555',
                  fontSize: 13,
                  fontStyle: 'italic'
                }}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                </div>
              </div>

              {/* Author Info and Edit Button */}
              <div style={{
                marginTop: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {blog.author && (
                  <div style={{
                    fontSize: 12,
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    👤 {blog.author}
                  </div>
                )}
                
                {/* Edit Button - Show if user can edit this blog */}
                {canManage && (
                  currentUser?.role === 'ADMIN' || 
                  (currentUser?.role === 'COLLABORATOR' && blog.author === currentUser.username)
                ) && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link
                      to={`/edit-blog/${blog.id}`}
                      style={{
                        padding: '4px 8px',
                        background: '#17a2b8',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#138496'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#17a2b8'}
                    >
                      ✏️ Sửa
                    </Link>
                    
                    {/* Hide/Unhide Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (blog.hidden) {
                          if (window.confirm('Bạn có chắc chắn muốn khôi phục bài viết này?')) {
                            handleSingleRestore(blog.id);
                          }
                        } else {
                          if (window.confirm('Bạn có chắc chắn muốn ẩn bài viết này?')) {
                            handleSingleHide(blog.id);
                          }
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        background: blog.hidden ? '#28a745' : '#ffc107',
                        color: blog.hidden ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      {blog.hidden ? '👁️' : '🙈'}
                    </button>
                    
                    {/* Delete Button - Only for ADMIN */}
                    {currentUser?.role === 'ADMIN' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm('⚠️ Bạn có CHẮC CHẮN muốn XÓA VĨNH VIỄN bài viết này? Hành động này không thể hoàn tác!')) {
                            handleSingleDelete(blog.id);
                          }
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#c82333'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#dc3545'}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
