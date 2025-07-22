import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection';

const BACKEND_URL = 'http://localhost:8080';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/blog/${id}/likes`)
            .then(response => {
                setLikes(response.data.likesCount);
                setIsLiked(response.data.isLiked);
            })
            .catch(error => console.error("Lỗi khi lấy số lượt like:", error));
    }, [id]);

    const handleLike = () => {
        const userId = 1; // Thay bằng ID người dùng hiện tại
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage

        if (!token) {
            console.error("Token không tồn tại. Người dùng cần đăng nhập.");
            alert("Bạn cần đăng nhập để thực hiện thao tác này.");
            return;
        }

        axios.post(`${BACKEND_URL}/api/blog/${id}/likes`, { userId }, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        })
            .then(res => {
                setLikes(res.data.likesCount);
                setIsLiked(res.data.isLiked);
            })
            .catch(error => {
                console.error("Lỗi khi like:", error);
                if (error.response && error.response.status === 401) {
                    alert("Bạn cần đăng nhập để thực hiện thao tác này.");
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
                    {isLiked ? "❤️ Đã thích" : "🤍 Thích"} ({likes})
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
