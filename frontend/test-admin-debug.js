// Debug script for admin access issues
// Run this in browser console when on admin dashboard

console.log('🔍 Admin Access Debug Script');

// Check localStorage
const currentUser = JSON.parse(localStorage.getItem('toeic_current_user'));
const accessToken = localStorage.getItem('toeic_access_token');

console.log('📦 LocalStorage Data:', {
  currentUser,
  accessToken: accessToken ? 'Present' : 'Missing',
  userRole: currentUser?.role
});

// Check if user is admin
if (currentUser && currentUser.role === 'ADMIN') {
  console.log('✅ User has ADMIN role');
} else {
  console.log('❌ User does not have ADMIN role:', currentUser?.role);
}

// Test backend API call
if (accessToken) {
  fetch('http://localhost:8080/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('🔗 Backend /me response:', data);
  })
  .catch(error => {
    console.error('❌ Backend API error:', error);
  });
} else {
  console.log('⚠️ No access token found');
}

// Check React state (if available)
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('🔧 React DevTools available');
} else {
  console.log('⚠️ React DevTools not available');
} 