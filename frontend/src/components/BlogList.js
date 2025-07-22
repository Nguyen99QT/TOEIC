import React, { useEffect, useState } from "react";
import apiClient from "../services/apiRequest";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const response = await apiClient.get("/api/blog");
            setBlogs(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            if (error.response && error.response.status === 401) {
                alert("Bạn cần đăng nhập để xem danh sách bài viết!");
            }
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div>
            <h2>Danh sách bài viết</h2>
            {blogs.length === 0 ? (
                <p>Không có bài viết nào.</p>
            ) : (
                <ul>
                    {blogs.map((blog) => (
                        <li key={blog.id}>{blog.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BlogList;