import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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

const CollaboratorBlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMyBlogs = useCallback(async () => {
    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:8080/api/blog', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const allBlogs: BlogPost[] = await response.json();
        // Filter to show only current user's blogs
        const myBlogs = allBlogs.filter(blog => blog.author === user?.username);
        setBlogs(myBlogs);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      setError('Error fetching blogs: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const handleDeleteBlog = async (blogId: number) => {
    if (!window.confirm('Are you sure you want to hide this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:8080/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBlogs(blogs.map(blog => 
          blog.id === blogId ? { ...blog, hidden: true } : blog
        ));
        alert('Blog post hidden successfully');
      } else {
        alert('Failed to hide blog post');
      }
    } catch (err) {
      alert('Error hiding blog post: ' + (err as Error).message);
    }
  };

  const handleUnhideBlog = async (blogId: number) => {
    try {
      const token = localStorage.getItem('toeic_access_token') || 
                    localStorage.getItem('authToken') ||
                    localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:8080/api/blog/${blogId}/unhide`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBlogs(blogs.map(blog => 
          blog.id === blogId ? { ...blog, hidden: false } : blog
        ));
        alert('Blog post restored successfully');
      } else {
        alert('Failed to restore blog post');
      }
    } catch (err) {
      alert('Error restoring blog post: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchMyBlogs();
    }
  }, [user?.username, fetchMyBlogs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blog Posts</h1>
          <p className="mt-2 text-gray-600">
            Manage your blog posts and content
          </p>
        </div>
        <a
          href="/create-blog"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          Create New Post
        </a>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No blog posts yet</div>
          <p className="text-gray-400 mt-2">Create your first blog post to get started</p>
          <a
            href="/create-blog"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Create First Post
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${blog.hidden ? 'opacity-60' : ''}`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {blog.title}
                      {blog.hidden && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Hidden
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {blog.content.length > 200 
                        ? `${blog.content.substring(0, 200)}...` 
                        : blog.content
                      }
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      {blog.imageUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">🖼️</span>
                            Image
                          </span>
                        </>
                      )}
                      {blog.videoUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">🎥</span>
                            Video
                          </span>
                        </>
                      )}
                      {blog.pdfUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">📄</span>
                            PDF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <a
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </a>
                    {blog.hidden ? (
                      <button
                        onClick={() => handleUnhideBlog(blog.id)}
                        className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratorBlogList;
