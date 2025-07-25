// Test script để debug edit blog save issue
const testEditBlogSave = async () => {
  const token = localStorage.getItem('toeic_access_token') || 
                localStorage.getItem('authToken') ||
                localStorage.getItem('accessToken');

  console.log('🔐 Token found:', !!token);
  console.log('🔐 Token value:', token?.substring(0, 20) + '...');

  const formData = new FormData();
  formData.append('title', 'Test Edit Title ' + new Date().getTime());
  formData.append('content', 'Test Edit Content ' + new Date().getTime());

  console.log('🚀 Sending PUT request to: http://localhost:8080/api/blog/3/upload');

  try {
    const response = await fetch('http://localhost:8080/api/blog/3/upload', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Update successful:', result);
    } else {
      const errorData = await response.text();
      console.error('❌ Update failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Chạy test
testEditBlogSave();
