import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { persistentLogger } from '../utils/persistentLogger';

// Spinner đơn giản, có thể thay bằng component đẹp hơn nếu muốn
const Spinner = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-500">Loading...</span>
    </div>
);

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading, currentUser } = useAuth();

    // Check if user just logged in - more sophisticated timing check
    const justLoggedIn = localStorage.getItem('auth_just_logged_in');
    const loginTimestamp = localStorage.getItem('auth_login_timestamp');
    const hasValidTokens = localStorage.getItem('toeic_access_token') && localStorage.getItem('toeic_current_user');

    // Check if login was recent (within last 15 seconds) - increased timeout
    const isRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 15000;

    // Check if token is actually valid (not expired)
    const isTokenValid = () => {
        const token = localStorage.getItem('toeic_access_token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now; // Token not expired
        } catch {
            return false;
        }
    };

    persistentLogger.info(`🔍 ProtectedRoute check: auth=${isAuthenticated}, loading=${loading}, justLoggedIn=${!!justLoggedIn}, recentLogin=${!!isRecentLogin}, hasTokens=${!!hasValidTokens}, tokenValid=${isTokenValid()}`);
    console.log('🔍 ProtectedRoute check:', {
        loading,
        isAuthenticated,
        currentUser: currentUser?.username || 'none',
        location: window.location.pathname,
        justLoggedIn: !!justLoggedIn,
        isRecentLogin: !!isRecentLogin,
        hasValidTokens,
        tokenValid: isTokenValid(),
        timestamp: new Date().toISOString()
    });

    // If user just logged in and has valid tokens, allow access temporarily
    if ((justLoggedIn || isRecentLogin) && hasValidTokens && isTokenValid()) {
        persistentLogger.info('⏳ ProtectedRoute: User just logged in with valid tokens, allowing access');
        console.log('⏳ ProtectedRoute: User just logged in with valid tokens, allowing access');
        // Clean up the flag after a delay to allow AuthContext to catch up
        setTimeout(() => {
            localStorage.removeItem('auth_just_logged_in');
        }, 12000); // Increase timeout to 12 seconds
        return <>{children}</>;
    }

    // Check if we have valid authentication data even if AuthContext isn't ready yet
    if (!loading && !isAuthenticated && hasValidTokens && !isRecentLogin) {
        persistentLogger.warn('⚠️ ProtectedRoute: AuthContext not ready but tokens exist, forcing auth refresh');
        console.log('⚠️ ProtectedRoute: AuthContext not ready but tokens exist, forcing auth refresh');
        // Don't reload immediately, give AuthContext more time
        setTimeout(() => {
            if (!isAuthenticated && hasValidTokens) {
                persistentLogger.error('❌ ProtectedRoute: AuthContext failed to initialize, reloading page');
                window.location.reload();
            }
        }, 2000);
        return <Spinner />;
    }

    if (loading) {
        persistentLogger.info('⏳ ProtectedRoute: Still loading, showing spinner');
        console.log('⏳ ProtectedRoute: Still loading, showing spinner');
        return <Spinner />;
    }

    if (!isAuthenticated) {
        persistentLogger.error(`❌ ProtectedRoute: User not authenticated, redirecting to login from ${window.location.pathname}`);
        console.log('❌ ProtectedRoute: User not authenticated, redirecting to login');
        console.log('❌ Redirect reason:', {
            hasUser: !!currentUser,
            isAuthenticatedValue: isAuthenticated,
            hasTokens: hasValidTokens,
            from: window.location.pathname
        });
        return <Navigate to="/login" replace />;
    }

    persistentLogger.info(`✅ ProtectedRoute: User ${currentUser?.username} authenticated, rendering protected content`);
    console.log('✅ ProtectedRoute: User authenticated, rendering protected content');
    return <>{children}</>;
};

export default ProtectedRoute;