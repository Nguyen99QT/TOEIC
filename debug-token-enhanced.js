console.log('🔍 Starting enhanced token expiration monitoring...');

let lastTokenState = null;
let lastAuthState = null;
let warningShown = false;
let criticalWarningShown = false;
let redirectCount = 0;

// Enhanced token check function
function checkTokenExpiration() {
    const token = localStorage.getItem('toeic_access_token');
    const refreshToken = localStorage.getItem('toeic_refresh_token');
    const currentUser = localStorage.getItem('toeic_current_user');
    const timestamp = new Date().toISOString();
    
    if (!token) {
        console.log(`⚠️ [${timestamp}] NO TOKEN FOUND - User should be redirected to login`);
        if (lastTokenState !== 'NO_TOKEN') {
            console.log('🚨 TOKEN LOST! This might cause login redirect');
            redirectCount++;
        }
        lastTokenState = 'NO_TOKEN';
        return;
    }
    
    try {
        // Decode token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        const minutesLeft = Math.floor(timeUntilExpiry / 1000 / 60);
        const secondsLeft = Math.floor((timeUntilExpiry % 60000) / 1000);
        
        // Determine token state
        let tokenState;
        if (timeUntilExpiry <= 0) {
            tokenState = 'EXPIRED';
            console.log(`❌ [${timestamp}] TOKEN EXPIRED! ${Math.abs(minutesLeft)}m${Math.abs(secondsLeft)}s ago`);
            if (lastTokenState !== 'EXPIRED') {
                console.log('🚨 TOKEN JUST EXPIRED! Auto-refresh should kick in or user will be redirected');
                redirectCount++;
            }
        } else if (timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes
            tokenState = 'CRITICAL';
            console.log(`🔥 [${timestamp}] TOKEN CRITICAL - Expires in ${minutesLeft}m${secondsLeft}s`);
            if (!criticalWarningShown) {
                console.log('⚠️ TOKEN ENTERING CRITICAL ZONE - Auto-refresh should trigger soon');
                criticalWarningShown = true;
            }
        } else if (timeUntilExpiry < 10 * 60 * 1000) { // Less than 10 minutes
            tokenState = 'WARNING';
            console.log(`⚡ [${timestamp}] TOKEN WARNING - Expires in ${minutesLeft}m${secondsLeft}s`);
            if (!warningShown) {
                console.log('⚠️ TOKEN ENTERING WARNING ZONE');
                warningShown = true;
            }
        } else {
            tokenState = 'HEALTHY';
            console.log(`✅ [${timestamp}] Token healthy - ${minutesLeft}m${secondsLeft}s remaining`);
            // Reset warnings when token is refreshed
            if (lastTokenState === 'CRITICAL' || lastTokenState === 'WARNING' || lastTokenState === 'EXPIRED') {
                console.log('🔄 TOKEN REFRESHED - Warnings reset');
                warningShown = false;
                criticalWarningShown = false;
            }
        }
        
        // Check for state changes
        if (lastTokenState !== tokenState) {
            console.log(`🔄 Token state changed: ${lastTokenState} → ${tokenState}`);
        }
        
        lastTokenState = tokenState;
        
        // Additional info
        console.log(`   User: ${payload.sub || 'Unknown'}`);
        console.log(`   Roles: ${payload.roles || 'Unknown'}`);
        console.log(`   Has Refresh Token: ${!!refreshToken}`);
        console.log(`   Has Current User: ${!!currentUser}`);
        
        // Check page location for redirect detection
        const currentPath = window.location.pathname;
        const authState = currentPath === '/login' ? 'LOGIN_PAGE' : 'AUTHENTICATED_PAGE';
        
        if (lastAuthState !== authState) {
            console.log(`📍 Page state changed: ${lastAuthState} → ${authState}`);
            if (authState === 'LOGIN_PAGE' && lastAuthState === 'AUTHENTICATED_PAGE') {
                redirectCount++;
                console.log(`🚨 REDIRECT TO LOGIN DETECTED! Total redirects: ${redirectCount}`);
            }
        }
        lastAuthState = authState;
        
    } catch (error) {
        console.error(`❌ [${timestamp}] Error parsing token:`, error);
        lastTokenState = 'INVALID';
    }
}

// Enhanced monitoring with variable intervals
function startMonitoring() {
    // Initial check
    checkTokenExpiration();
    
    // Check every 15 seconds for more granular monitoring
    const interval = setInterval(() => {
        checkTokenExpiration();
        
        // Also check for any authentication issues
        const authErrors = localStorage.getItem('auth_error');
        if (authErrors) {
            console.log('🚨 Auth errors detected:', authErrors);
        }
        
        // Check refresh failures
        const refreshFailCount = localStorage.getItem('refresh_fail_count');
        if (refreshFailCount && parseInt(refreshFailCount) > 0) {
            console.log(`⚠️ Refresh failures: ${refreshFailCount}`);
        }
        
    }, 15000); // Every 15 seconds
    
    console.log('🔍 Enhanced monitoring started - checking every 15 seconds');
    console.log('📊 This will help identify exactly when token issues occur');
    
    // Stop monitoring after 30 minutes to avoid cluttering console
    setTimeout(() => {
        clearInterval(interval);
        console.log('⏹️ Token monitoring stopped after 30 minutes');
        console.log(`📊 Total redirects detected: ${redirectCount}`);
    }, 30 * 60 * 1000);
}

startMonitoring();
