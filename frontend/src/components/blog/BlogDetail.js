import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection';
import { AuthContext } from '../../contexts/AuthContext';

const BACKEND_URL = 'http://localhost:8080';

const BlogDetail = () => {
    const { id } = useParams();
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Get likes count
        axios.get(`${BACKEND_URL}/api/blog/${id}/likes`)
            .then(response => {
                console.log("✅ Likes count response:", response.data);
                setLikes(response.data); // response.data is just a number
            })
            .catch(error => {
                console.error("❌ Lỗi khi lấy số lượt like:", error);
                console.error("Error details:", error.response?.data, error.response?.status);
            });

        // Check if current user has liked this post (only if user is authenticated)
        if (isAuthenticated && currentUser) {
            const token = localStorage.getItem("toeic_access_token");

            if (token && currentUser.id) {
                console.log("🔍 Checking like status for user:", currentUser.id);
                // Check if user has already liked this post
                axios.get(`${BACKEND_URL}/api/blog/${id}/likes/check?userId=${currentUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        console.log("✅ Like status response:", response.data);
                        setIsLiked(response.data);
                    })
                    .catch(error => {
                        console.error("❌ Lỗi khi check trạng thái like:", error);
                        console.error("Error details:", error.response?.data, error.response?.status);
                        // Try alternative endpoint if check endpoint doesn't exist
                        setIsLiked(false);
                    });
            }
        }
    }, [id, currentUser, isAuthenticated]);

    const handleLike = () => {
        // Check if user is authenticated
        if (!isAuthenticated || !currentUser) {
            console.error("❌ User not authenticated");
            alert("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }

        console.log("🔄 Attempting to toggle like for blog:", id, "user:", currentUser.id);

        // Get token from localStorage
        const token = localStorage.getItem("toeic_access_token");

        if (!token) {
            console.error("❌ Token không tồn tại. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }

        const userId = currentUser.id; // Use actual current user ID
        console.log("📤 Making like request with userId:", userId);

        axios.post(`${BACKEND_URL}/api/blog/${id}/likes?userId=${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Add token to header
            },
        })
            .then(res => {
                console.log("✅ Like toggle success:", res.data);
                // Update like count with the response data (which is just a number)
                setLikes(res.data);
                // Toggle the like status
                setIsLiked(!isLiked);
            })
            .catch(error => {
                console.error("❌ Lỗi khi like:", error);
                console.error("Error details:", error.response?.data, error.response?.status);
                if (error.response && error.response.status === 401) {
                    alert("Bạn cần đăng nhập để thực hiện thao tác này.");
                } else {
                    alert("Có lỗi xảy ra khi thực hiện thao tác này.");
                }
            });
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/blog/${id}`)
            .then(response => setBlog(response.data))
            .catch(error => console.error('Lỗi khi lấy chi tiết bài viết:', error));
    }, [id]);

    if (!blog) return <p>Đang tải...</p>;

    return (
        <div style={{
            maxWidth: 760,
            margin: "48px auto 24px auto",
            padding: 32,
            borderRadius: 18,
            background: "linear-gradient(111deg, #eef2fa 60%, #f3f6fd 100%)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.08)"
        }}>
            {/* Ảnh bìa */}
            {blog.imageUrl && (
                <div style={{
                    width: '100%',
                    height: 320,
                    marginBottom: 28,
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: "#eaf0ff",
                    boxShadow: "0 3px 24px 0 #4b78da15",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={`${BACKEND_URL}${blog.imageUrl}`}
                        alt={blog.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 18,
                            transition: 'transform 0.3s'
                        }}
                        onError={e => (e.target.style.display = 'none')}
                    />
                </div>
            )}

            {/* Tiêu đề */}
            <h1 style={{
                fontSize: 34,
                fontWeight: 800,
                color: '#283653',
                marginBottom: 12,
                letterSpacing: '.3px',
                lineHeight: 1.15
            }}>{blog.title}</h1>
            <div style={{
                color: '#7a8ba9',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                marginBottom: 22
            }}>
                <span style={{ marginRight: 20 }}>✍️ {blog.author}</span>
                <span>
                    📅 {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                </span>
            </div>

            {/* Video */}
            {blog.videoUrl && (
                <div style={{
                    width: "100%",
                    background: "#eaf0ff",
                    borderRadius: 12,
                    margin: "18px 0 28px 0",
                    boxShadow: "0 3px 12px 0 #18335511",
                    padding: 12,
                    textAlign: "center"
                }}>
                    <video width="100%" controls style={{ borderRadius: 12, background: "#eee" }}>
                        <source src={`${BACKEND_URL}${blog.videoUrl}`} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                    </video>
                </div>
            )}

            {/* Nội dung */}
            <div style={{
                fontSize: 18,
                color: "#34405a",
                margin: "24px 0",
                lineHeight: 1.75,
                letterSpacing: '.02em'
            }}>
                {blog.content}
            </div>

            {/* Link tài liệu PDF */}
            {blog.pdfUrl && (
                <div style={{ marginTop: 32 }}>
                    <a
                        href={`${BACKEND_URL}${blog.pdfUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '12px 22px',
                            borderRadius: 12,
                            background: '#2264ea',
                            color: '#fff',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: 18,
                            boxShadow: '0 2px 12px 0 #c3e1fd80',
                            marginTop: 8,
                            transition: 'background 0.2s',
                            letterSpacing: '.02em'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "#10399e"}
                        onMouseOut={e => e.currentTarget.style.background = "#2264ea"}
                    >
                        📄 Tải tài liệu PDF
                    </a>
                </div>
            )}

            {/* Like + bình luận */}
            <div style={{
                display: "flex",
                alignItems: "center",
                margin: "36px 0 12px 0"
            }}>
                <button
                    onClick={handleLike}
                    style={{
                        background: "#fff",
                        color: isLiked ? "#d41f65" : "#7a8ba9",
                        fontSize: 22,
                        border: `2px solid ${isLiked ? "#f8b6d6" : "#d1d2ee"}`,
                        borderRadius: 16,
                        fontWeight: 600,
                        padding: "12px 24px",
                        cursor: "pointer",
                        boxShadow: "0 2px 16px 0 #d1d2ee22",
                        marginRight: 24,
                        transition: "all 0.15s"
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = isLiked ? "#fce4ee" : "#e1f5fe";
                        e.currentTarget.style.border = `2px solid ${isLiked ? "#d41f65" : "#90caf9"}`;
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.border = `2px solid ${isLiked ? "#f8b6d6" : "#d1d2ee"}`;
                    }}
                >
                    {isLiked ? "❤️ thích" : "🤍 Đã Thích"} ({likes})
                </button>
                <span style={{ color: "#555", fontSize: 16 }}>
                    💬 Bình luận dưới đây để chia sẻ ý kiến của bạn!
                </span>
            </div>
            <div style={{ marginTop: 18 }}>
                <CommentSection blogPostId={id} />
            </div>
        </div>
    );
};

export default BlogDetail;
