import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

interface BlogPost {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    imageUrl?: string;
    videoUrl?: string;
    pdfUrl?: string;
    hidden?: boolean;
}

export const BlogEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchBlog = async (blogId: number) => {
            try {
                setLoading(true);
                // Use the same API call as BlogDetail.js - no authorization needed for reading
                const response = await axios.get(`${BACKEND_URL}/api/blog/${blogId}`);

                const blogData = response.data;
                setBlog(blogData);
                setTitle(blogData.title);
                setContent(blogData.content);
                setAuthor(blogData.author);
            } catch (error) {
                console.error('Error fetching blog:', error);
                alert('Không thể tải thông tin bài viết!');
                navigate('/admin/blog');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog(parseInt(id));
        }
    }, [id, navigate]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Vui lòng điền đầy đủ tiêu đề và nội dung!');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('toeic_access_token') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('accessToken');

            const updatedBlog = {
                ...blog,
                title: title.trim(),
                content: content.trim(),
                author: author.trim()
            };

            await axios.put(`${BACKEND_URL}/api/blog/${id}`, updatedBlog, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Cập nhật bài viết thành công!');
            navigate('/admin/blog');
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('Có lỗi xảy ra khi cập nhật bài viết!');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/blog');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-500">Không tìm thấy bài viết!</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </Button>
                <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin bài viết</CardTitle>
                    <CardDescription>
                        Chỉnh sửa thông tin bài viết của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Tiêu đề *
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="author" className="block text-sm font-medium mb-2">
                            Tác giả
                        </label>
                        <Input
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Nhập tên tác giả..."
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-2">
                            Nội dung *
                        </label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập nội dung bài viết..."
                            className="w-full min-h-[200px]"
                        />
                    </div>

                    {/* Display existing media files */}
                    {(blog.imageUrl || blog.videoUrl || blog.pdfUrl) && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Media hiện tại
                            </label>
                            <div className="space-y-2">
                                {blog.imageUrl && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Hình ảnh:</span>
                                        <a
                                            href={`${BACKEND_URL}${blog.imageUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Xem hình ảnh
                                        </a>
                                    </div>
                                )}
                                {blog.videoUrl && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Video:</span>
                                        <a
                                            href={`${BACKEND_URL}${blog.videoUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Xem video
                                        </a>
                                    </div>
                                )}
                                {blog.pdfUrl && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">PDF:</span>
                                        <a
                                            href={`${BACKEND_URL}${blog.pdfUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Xem PDF
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BlogEditPage;
