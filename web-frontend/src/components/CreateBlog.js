import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8080';

const CreateBlog = () => {
    const [form, setForm] = useState({
        title: '',
        content: '',
        author: ''
    });
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const navigate = useNavigate();

    // Xử lý các trường nhập liệu text
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý chọn file ảnh/video
    const [pdf, setPdf] = useState(null); // state cho file PDF

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

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('author', form.author);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        if (pdf) formData.append('pdf', pdf);

        axios.post(`${BACKEND_URL}/api/blog/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                alert('Đăng bài viết thành công!');
                navigate('/'); // Quay về trang danh sách
            })
            .catch(error => {
                console.error('Lỗi khi đăng bài viết:', error);
                alert('Đăng bài viết thất bại!');
            });
    };

    return (
        <div>
            <h2>Đăng bài viết mới</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Tiêu đề:</label><br />
                    <input type="text" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Nội dung:</label><br />
                    <textarea name="content" value={form.content} onChange={handleChange} required />
                </div>
                <div>
                    <label>Ảnh (tùy chọn):</label><br />
                    <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
                </div>
                <div>
                    <label>Video (tùy chọn):</label><br />
                    <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
                </div>
                <div>
                    <label>Tác giả:</label><br />
                    <input type="text" name="author" value={form.author} onChange={handleChange} required />
                </div>
                <div>
                    <label>Tài liệu PDF (tùy chọn):</label><br />
                    <input type="file" name="pdf" accept="application/pdf" onChange={handleFileChange} />
                </div>

                <button type="submit">Đăng bài</button>
            </form>
        </div>
    );
};

export default CreateBlog;
