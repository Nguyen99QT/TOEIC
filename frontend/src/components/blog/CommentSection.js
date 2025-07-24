// CommentSection.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const CommentSection = ({ blogPostId }) => {
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = () => {
            axios.get(`http://localhost:8080/api/blog/${blogPostId}/comments`)
                .then(response => setComments(response.data))
                .catch(error => console.error("Lỗi khi lấy comments:", error));
        };

        fetchComments();
    }, [blogPostId]);

    const handleSubmit = () => {
        if (!newComment.trim()) {
            alert("Vui lòng nhập nội dung bình luận!");
            return;
        }

        if (!isAuthenticated || !currentUser) {
            alert("Bạn cần đăng nhập để bình luận!");
            return;
        }

        setLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("toeic_access_token");

        if (!token) {
            alert("Bạn cần đăng nhập để bình luận!");
            setLoading(false);
            return;
        }

        axios.post(`http://localhost:8080/api/blog/${blogPostId}/comments`, {
            content: newComment
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            // Add new comment to the beginning of the list (most recent first)
            setComments([res.data, ...comments]);
            setNewComment("");
        }).catch(error => {
            console.error("Lỗi khi gửi comment:", error);
            if (error.response && error.response.status === 401) {
                alert("Bạn cần đăng nhập để bình luận!");
            } else {
                alert("Có lỗi xảy ra khi gửi bình luận!");
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ marginTop: 32 }}>
            <h5 style={{
                marginBottom: 24,
                color: '#2264ea',
                fontSize: 20,
                fontWeight: 700
            }}>💬 Bình luận ({comments.length})</h5>

            <div style={{ marginBottom: 24 }}>
                {comments.length === 0 && (
                    <p style={{
                        color: '#7a8ba9',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        padding: '20px 0'
                    }}>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                )}
                {comments.map(comment => (
                    <div key={comment.id} style={{
                        display: 'flex',
                        marginBottom: 16,
                        padding: 16,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 12,
                        border: '1px solid #e9ecef'
                    }}>
                        <img
                            src={`https://i.pravatar.cc/40?u=${comment.userId}`}
                            alt="avatar"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 12,
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 8,
                                gap: 12
                            }}>
                                <span style={{
                                    fontWeight: 600,
                                    color: '#2264ea',
                                    fontSize: 14
                                }}>{comment.username}</span>
                                <span style={{
                                    color: '#7a8ba9',
                                    fontSize: 12
                                }}>{formatDate(comment.createdAt)}</span>
                            </div>
                            <div style={{
                                color: '#34405a',
                                fontSize: 14,
                                lineHeight: 1.5
                            }}>{comment.content}</div>
                        </div>
                    </div>
                ))}
            </div>

            {isAuthenticated ? (
                <div style={{
                    display: 'flex',
                    gap: 12,
                    padding: 16,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    border: '2px solid #e1f5fe',
                    marginTop: 16
                }}>
                    <img
                        src={`https://i.pravatar.cc/40?u=${currentUser?.id || 1}`}
                        alt="avatar"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <textarea
                            style={{
                                width: '100%',
                                minHeight: 80,
                                padding: 12,
                                border: '1px solid #d1d2ee',
                                borderRadius: 8,
                                fontSize: 14,
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            placeholder="Viết bình luận của bạn..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div style={{ textAlign: 'right', marginTop: 8 }}>
                            <button
                                style={{
                                    backgroundColor: loading ? '#ccc' : '#2264ea',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: 20,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12,
                    border: '1px solid #e9ecef'
                }}>
                    <p style={{ color: '#7a8ba9', margin: 0 }}>
                        Bạn cần đăng nhập để bình luận
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
