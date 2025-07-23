import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Edit, Plus, Eye, Heart, MessageCircle, Search, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    likes?: number;
    comments?: number;
    hidden?: boolean;
}

export const BlogManagementPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        // Filter blogs based on search term
        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogs(filtered);
    }, [blogs, searchTerm]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('toeic_access_token') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('accessToken');

            const response = await axios.get(`${BACKEND_URL}/api/blog/admin/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            // Fallback to regular API if admin stats fails
            try {
                const response = await axios.get(`${BACKEND_URL}/api/blog`);
                setBlogs(response.data.map((blog: any) => ({
                    ...blog,
                    likes: 0,
                    comments: 0
                })));
            } catch (fallbackError) {
                console.error('Error fetching blogs fallback:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleHide = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn ẩn bài viết này?')) {
            try {
                const token = localStorage.getItem('toeic_access_token') ||
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

                console.log('🔐 Token for hide action:', token?.substring(0, 50) + '...');
                console.log('🎯 Action: ẩn for blog ID:', id);

                // Hide the blog post
                console.log('📤 Calling hide API:', `${BACKEND_URL}/api/blog/${id}`);
                await axios.delete(`${BACKEND_URL}/api/blog/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Refresh the blog list
                fetchBlogs();
                alert('Ẩn bài viết thành công!');
            } catch (error) {
                console.error('Error hiding blog:', error);
                alert('Có lỗi xảy ra khi ẩn bài viết!');
            }
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/blog/edit/${id}`);
    };

    const handleView = (id: number) => {
        window.open(`/blog/${id}`, '_blank');
    };

    const handleCreateNew = () => {
        navigate('/admin/blog/create');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Blog</h1>
                    <p className="text-muted-foreground">
                        Quản lý tất cả bài viết blog trên hệ thống
                    </p>
                </div>
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo bài viết mới
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
                        <Badge variant="outline">{blogs.length}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{blogs.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng lượt thích</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bài viết có media</CardTitle>
                        <Badge variant="outline">
                            {blogs.filter(blog => blog.imageUrl || blog.videoUrl || blog.pdfUrl).length}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {blogs.filter(blog => blog.imageUrl || blog.videoUrl || blog.pdfUrl).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Blog List */}
            <div className="space-y-4">
                {filteredBlogs.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredBlogs.map((blog) => (
                        <Card key={blog.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-4 text-sm">
                                            <span>Tác giả: {blog.author}</span>
                                            <span>Ngày tạo: {formatDate(blog.createdAt)}</span>
                                            <div className="flex items-center gap-2">
                                                <Heart className="h-4 w-4" />
                                                <span>{blog.likes || 0} lượt thích</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="h-4 w-4" />
                                                <span>{blog.comments || 0} bình luận</span>
                                            </div>
                                            {blog.hidden && (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    Đã ẩn
                                                </Badge>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(blog.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Xem
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(blog.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Sửa
                                        </Button>
                                        {blog.hidden ? (
                                            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                                                <EyeOff className="h-4 w-4" />
                                                Đã ẩn
                                            </span>
                                        ) : (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleHide(blog.id)}
                                                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                <EyeOff className="h-4 w-4" />
                                                Ẩn
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    {truncateContent(blog.content)}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {blog.imageUrl && (
                                        <Badge variant="secondary">📷 Có ảnh</Badge>
                                    )}
                                    {blog.videoUrl && (
                                        <Badge variant="secondary">🎥 Có video</Badge>
                                    )}
                                    {blog.pdfUrl && (
                                        <Badge variant="secondary">📄 Có PDF</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
