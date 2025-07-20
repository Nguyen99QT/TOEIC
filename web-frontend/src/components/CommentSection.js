// CommentSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentSection = ({ blogPostId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/api/blog/${blogPostId}/comments`)
            .then(response => setComments(response.data))
            .catch(error => console.error("Lỗi khi lấy comments:", error));
    }, [blogPostId]);

    const handleSubmit = () => {
        if (!newComment.trim()) return;

        axios.post(`http://localhost:8080/api/blog/${blogPostId}/comments`, {
            content: newComment,
            userId: 1
        }).then(res => {
            setComments([...comments, res.data]);
            setNewComment("");
        }).catch(error => console.error("Lỗi khi gửi comment:", error));
    };

    return (
        <div className="mt-4">
            <h5 className="mb-4 text-primary">💬 Bình luận</h5>

            <div className="mb-4">
                {comments.length === 0 && (
                    <p className="text-muted">Chưa có bình luận nào.</p>
                )}
                {comments.map(comment => (
                    <div key={comment.id} className="d-flex mb-3">
                        <img
                            src={`https://i.pravatar.cc/40?u=${comment.userId}`}
                            alt="avatar"
                            className="rounded-circle me-3"
                            width="40"
                            height="40"
                        />
                        <div className="bg-light px-3 py-2 rounded shadow-sm w-100">
                            <div className="fw-semibold text-dark mb-1">Người dùng #{comment.userId}</div>
                            <div className="text-secondary">{comment.content}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex">
                <img
                    src={`https://i.pravatar.cc/40?u=1`}
                    alt="avatar"
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                />
                <div className="flex-grow-1">
                    <textarea
                        className="form-control mb-2"
                        rows="2"
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="text-end">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSubmit}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
