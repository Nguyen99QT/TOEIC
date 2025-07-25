// Test script để kiểm tra tính năng Question Groups
// Chạy trong browser console khi đã login

console.log('🧪 Testing Question Groups functionality...');

// Check authentication
const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
console.log('🔑 Token status:', token ? 'Found' : 'Missing');

if (!token) {
  console.error('❌ No authentication token found! Please login first.');
} else {
  console.log('✅ Token found, proceeding with tests...');
  
  // Test 1: Fetch question groups
  console.log('\n📋 Test 1: Fetching question groups...');
  fetch('http://localhost:8080/api/question-group', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📡 Response status:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  })
  .then(data => {
    console.log('✅ Question groups fetched successfully:', data);
    console.log(`📊 Found ${data.length} question groups`);
  })
  .catch(error => {
    console.error('❌ Failed to fetch question groups:', error);
  });

  // Test 2: Check user info
  console.log('\n👤 Test 2: Checking current user info...');
  const currentUser = localStorage.getItem('toeic_current_user');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      console.log('✅ Current user:', user);
    } catch (e) {
      console.error('❌ Error parsing user data:', e);
    }
  } else {
    console.log('⚠️ No current user data found');
  }

  // Test 3: Test token validity
  console.log('\n🔐 Test 3: Testing token validity...');
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const expired = payload.exp < now;
    console.log('🕐 Token expires at:', new Date(payload.exp * 1000));
    console.log('⏰ Current time:', new Date());
    console.log('✅ Token status:', expired ? 'EXPIRED' : 'VALID');
    if (!expired) {
      console.log(`⏳ Time remaining: ${Math.floor((payload.exp - now) / 60)} minutes`);
    }
  } catch (e) {
    console.error('❌ Error parsing token:', e);
  }
}

console.log('\n🎯 Test completed! Check the results above.');

// Helper function to create a test question group
window.createTestQuestionGroup = async function() {
  console.log('🧪 Creating test question group...');
  
  const token = localStorage.getItem('toeic_access_token') || localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found!');
    return;
  }

  const testGroup = {
    title: 'Test Question Group - ' + new Date().toLocaleTimeString(),
    type: 'PRACTICE',
    content: 'This is a test question group created from console.',
    partId: 5,
    questions: [
      {
        questionText: 'What is the capital of France?',
        correctOption: 'A',
        options: [
          { optionLabel: 'A', optionText: 'Paris' },
          { optionLabel: 'B', optionText: 'London' },
          { optionLabel: 'C', optionText: 'Berlin' },
          { optionLabel: 'D', optionText: 'Madrid' }
        ]
      }
    ]
  };

  const formData = new FormData();
  formData.append('group', new Blob([JSON.stringify(testGroup)], {
    type: 'application/json'
  }));

  try {
    const response = await fetch('http://localhost:8080/api/question-group/create-with-questions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test question group created successfully:', result);
    } else {
      const error = await response.text();
      console.error('❌ Failed to create test question group:', error);
    }
  } catch (error) {
    console.error('❌ Error creating test question group:', error);
  }
};

console.log('💡 Run createTestQuestionGroup() to create a test question group.');
