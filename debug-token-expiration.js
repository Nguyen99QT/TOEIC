// Debug token expiration
function checkTokenExpiration() {
    const token = localStorage.getItem('toeic_access_token') || 
                  localStorage.getItem('authToken') ||
                  localStorage.getItem('accessToken');
    
    if (!token) {
        console.log('❌ No token found');
        return;
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const exp = payload.exp;
        const timeLeft = exp - now;
        
        console.log('🔐 Token Debug:', {
            username: payload.sub,
            roles: payload.roles,
            issuedAt: new Date(payload.iat * 1000).toLocaleString(),
            expiresAt: new Date(exp * 1000).toLocaleString(),
            timeLeftSeconds: timeLeft,
            timeLeftMinutes: Math.floor(timeLeft / 60),
            isExpired: timeLeft <= 0,
            willExpireSoon: timeLeft < 300 // 5 minutes
        });
        
        if (timeLeft <= 0) {
            console.error('❌ TOKEN HAS EXPIRED!');
        } else if (timeLeft < 300) {
            console.warn('⚠️ TOKEN WILL EXPIRE SOON!');
        } else {
            console.log('✅ Token is valid');
        }
        
    } catch (error) {
        console.error('❌ Invalid token format:', error);
    }
}

// Chạy check mỗi 30 giây
setInterval(checkTokenExpiration, 30000);
checkTokenExpiration(); // Check ngay
