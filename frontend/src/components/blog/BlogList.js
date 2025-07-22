import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8080';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [likeCounts, setLikeCounts] = useState({});
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchBlogs = async (keyword = "") => {
        try {
            const url = keyword
                ? `${BACKEND_URL}/api/blog/search?title=${encodeURIComponent(keyword)}`
                : `${BACKEND_URL}/api/blog`;

            const response = await axios.get(url);
            setBlogs(response.data);

            // Chỉ gọi API likes nếu có blog
            if (response.data && response.data.length > 0) {
                const counts = {};
                await Promise.all(
                    response.data.map(async (blog) => {
                        try {
                            const res = await axios.get(`${BACKEND_URL}/api/blog/${blog.id}/likes`);
                            counts[blog.id] = res.data;
                        } catch {
                            counts[blog.id] = 0;
                        }
                    })
                );
                setLikeCounts(counts);
            } else {
                setLikeCounts({});
            }
        } catch (error) {
            // Nếu lỗi kết nối, báo cho người dùng biết backend chưa chạy
            if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
                alert("Không kết nối được tới server! Bạn cần chạy backend tại http://localhost:8080.");
            } else {
                alert("Lỗi khi gọi API blog!");
            }
            setBlogs([]);
            setLikeCounts({});
            console.error('Lỗi khi gọi API:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBlogs(searchKeyword);
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
            <h2 style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#172945',
                marginBottom: 24,
                letterSpacing: 1
            }}>📰 Danh sách bài viết</h2>

            {/* Thanh tìm kiếm */}
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
                    }}
                        onMouseOver={e => e.currentTarget.style.background = "#154bb3"}
                        onMouseOut={e => e.currentTarget.style.background = "#2264ea"}
                    >
                        Tìm
                    </button>
                </div>
            </form>

            {blogs.length === 0 && (
                <div style={{
                    padding: 40,
                    background: "#fff4",
                    borderRadius: 16,
                    textAlign: "center",
                    color: "#555"
                }}>
                    <p>Không có bài viết nào.</p>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 32
            }}>
                {blogs.map(blog => (
                    <div
                        key={blog.id}
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: '0 4px 24px 0 rgba(52, 84, 209, 0.09)',
                            transition: 'transform 0.17s, box-shadow 0.17s',
                            border: 'none',
                            position: 'relative',
                            minHeight: 390,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
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
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                ) : (
                                    <span style={{ color: "#aaa", fontSize: 72 }}>🖼️</span>
                                )}
                            </div>
                            <h3 style={{
                                fontWeight: 700,
                                fontSize: 22,
                                marginBottom: 12,
                                color: '#24345c'
                            }}>
                                {blog.title}
                            </h3>
                            <p style={{
                                color: '#587',
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;
