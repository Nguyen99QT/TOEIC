import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { User } from '../types';
import { persistentLogger } from '../utils/persistentLogger';

export interface AuthContextType {
    user: User | null;
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithUserData: (user: User, accessToken: string) => void;
    logout: () => void;
    signOut: () => void;
    updateCurrentUser: (user: User) => void;
    refreshAuthState: () => void; // New method to force refresh
    isAuthenticated: boolean;
    loading: boolean;
    isRefreshing: boolean;
    refreshToken: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    isRefreshing: false,
    login: async () => { },
    loginWithUserData: () => { },
    logout: () => { },
    signOut: () => { },
    updateCurrentUser: () => { },
    refreshAuthState: () => { },
    refreshToken: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const initRef = useRef(false);

    useEffect(() => {
        // Prevent multiple initialization
        if (initRef.current) return;
        initRef.current = true;

        console.log('🔍 AuthProvider: Starting authentication initialization...');
        console.log('🔍 Current browser location:', window.location.href);

        const initAuth = async () => {
            try {
                // Add a small delay to ensure localStorage is ready
                await new Promise(resolve => setTimeout(resolve, 100));

                // Use auth service functions to check authentication
                const { getToken, getCurrentUser, isAuthenticated: checkAuth, startAutoRefresh } = await import('../services/auth');

                console.log('🔍 AuthProvider: Checking existing auth...');
                console.log('🔍 Current localStorage contents:', Object.keys(localStorage));
                console.log('🔍 Direct localStorage access:');
                console.log('  - toeic_access_token:', localStorage.getItem('toeic_access_token'));
                console.log('  - authToken:', localStorage.getItem('authToken'));
                console.log('  - accessToken:', localStorage.getItem('accessToken'));
                console.log('  - toeic_current_user:', localStorage.getItem('toeic_current_user'));

                const token = getToken();
                const user = getCurrentUser();

                console.log('🔍 Token exists:', !!token);
                console.log('🔍 User exists:', !!user);
                console.log('🔍 Token preview:', token ? token.substring(0, 30) + '...' : 'null');
                console.log('🔍 User preview:', user ? user.username : 'null');
                console.log('🔍 isAuthenticated check result:', checkAuth());

                if (token && user && checkAuth()) {
                    console.log('✅ Found valid auth for:', user.username);
                    console.log('✅ Setting currentUser and isAuthenticated to true');
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    startAutoRefresh();

                    // Store timestamp for debugging
                    localStorage.setItem('auth_last_verified', new Date().toISOString());

                    console.log('✅ AuthProvider state after auth setup:', {
                        user: user.username,
                        authenticated: true,
                        location: window.location.pathname
                    });
                } else {
                    console.log('ℹ️ No valid authentication found - user is guest');
                    console.log('ℹ️ Auth check details:', {
                        hasToken: !!token,
                        hasUser: !!user,
                        authCheck: checkAuth(),
                        location: window.location.pathname
                    });
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('❌ Auth initialization error:', error);
                // On error, assume no authentication
                setCurrentUser(null);
                setIsAuthenticated(false);
            } finally {
                // Ensure loading is always set to false
                console.log('🔧 AuthProvider: Setting loading to false');
                setLoading(false);
                console.log('✅ Auth initialization completed');
            }
        };

        // Add timeout to ensure loading is cleared even if auth fails
        const timeoutId = setTimeout(() => {
            console.log('⏰ AuthProvider: Timeout reached, forcing loading to false');
            setLoading(false);
        }, 5000); // 5 second timeout

        initAuth().finally(() => {
            clearTimeout(timeoutId);
        });

        return () => {
            clearTimeout(timeoutId);
            // Cleanup on unmount
            import('../services/auth').then(({ stopAutoRefresh }) => {
                stopAutoRefresh();
            });
        };
    }, []);

    const login = async (usernameOrEmail: string, password: string): Promise<void> => {
        try {
            persistentLogger.info(`🔍 AuthContext login: Starting login process for: ${usernameOrEmail}`);
            console.log('🔍 AuthContext login: Starting login process for:', usernameOrEmail);

            const { login: authLogin, startAutoRefresh } = await import('../services/auth');

            persistentLogger.info('🔍 AuthContext login: Calling auth service login...');
            console.log('🔍 AuthContext login: Calling auth service login...');
            const response = await authLogin({
                username: usernameOrEmail,
                password: password
            });

            persistentLogger.info('🔍 AuthContext: Login response received');
            persistentLogger.info(`🔍 AuthContext: Response has token? ${!!(response.token || response.accessToken)}`);
            console.log('🔍 AuthContext: Login response received:', response);
            console.log('🔍 AuthContext: Response has token?', !!(response.token || response.accessToken));
            console.log('🔍 AuthContext: Response structure:', Object.keys(response));

            if (response && (response.token || response.accessToken)) {
                // Handle both role (string) and roles (array) from backend
                let userRole: "ADMIN" | "USER" | "COLLABORATOR" = 'USER';

                if (response.role) {
                    // Strip ROLE_ prefix if present
                    const cleanRole = response.role.replace(/^ROLE_/, '');
                    userRole = cleanRole as "ADMIN" | "USER" | "COLLABORATOR";
                } else if (response.roles && Array.isArray(response.roles) && response.roles.length > 0) {
                    // Get the first role from the array and strip ROLE_ prefix
                    const firstRole = response.roles[0].replace(/^ROLE_/, '');
                    if (firstRole === 'ADMIN' || firstRole === 'USER' || firstRole === 'COLLABORATOR') {
                        userRole = firstRole;
                    }
                }

                const user: User = {
                    id: response.id || 0,
                    username: response.username || '',
                    email: response.email || '',
                    fullName: response.username || '',
                    role: userRole,
                    membershipType: "FREE"
                };

                persistentLogger.info(`✅ AuthContext: Setting user data for ${user.username}`);
                console.log('✅ AuthContext: Setting user data:', user);

                // ⚡ FIX: Use React's state batching to ensure updates happen together
                setCurrentUser(user);
                setIsAuthenticated(true);

                // ⚡ ENHANCED: Verify state persistence immediately
                console.log('🔍 AuthContext: Checking localStorage after auth service...');

                // Wait a bit for localStorage to be written
                await new Promise(resolve => setTimeout(resolve, 100));

                const storedToken = localStorage.getItem('toeic_access_token');
                const storedUser = localStorage.getItem('toeic_current_user');

                persistentLogger.info(`🔍 Login state verification: token=${!!storedToken}, user=${!!storedUser}`);
                console.log('🔍 Login state verification:', {
                    userSet: !!user,
                    authSet: true,
                    tokenStored: !!storedToken,
                    userStored: !!storedUser,
                    username: user.username,
                    tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'NO TOKEN'
                });

                // Only start auto-refresh if everything is properly stored
                if (storedToken && storedUser) {
                    startAutoRefresh();
                    persistentLogger.info(`✅ AuthContext: Login completed successfully for ${user.username}`);
                    console.log('✅ AuthContext: Login completed successfully for', user.username);

                    // Set a longer-lasting flag for ProtectedRoute
                    localStorage.setItem('auth_just_logged_in', 'true');
                    localStorage.setItem('auth_login_timestamp', Date.now().toString());

                } else {
                    persistentLogger.error('❌ AuthContext: Failed to persist auth data properly');
                    persistentLogger.error(`❌ Token stored: ${!!storedToken}, User stored: ${!!storedUser}`);
                    console.error('❌ AuthContext: Failed to persist auth data properly');
                    console.error('❌ Token stored:', !!storedToken);
                    console.error('❌ User stored:', !!storedUser);
                    throw new Error('Failed to save authentication data');
                }
            } else {
                persistentLogger.error('❌ AuthContext: Invalid login response structure');
                console.error('❌ AuthContext: Invalid login response structure:', response);
                console.error('❌ Expected token or accessToken field, got:', Object.keys(response));
                throw new Error('Invalid login response');
            }
        } catch (error: any) {
            persistentLogger.error(`❌ AuthContext: Login error: ${error.message}`);
            console.error('❌ AuthContext: Login error:', error);
            console.error('❌ AuthContext: Full error details:', JSON.stringify(error, null, 2));

            // Don't clear auth state immediately on error
            // Let the error propagate to LoginPage for proper handling
            throw error;
        }
    };

    const loginWithUserData = useCallback(async (user: User, accessToken: string) => {
        try {
            const { setToken, setCurrentUser: storeUser, startAutoRefresh } = await import('../services/auth');
            setToken(accessToken);
            storeUser(user);
            setCurrentUser(user);
            setIsAuthenticated(true);
            startAutoRefresh();
        } catch (error) {
            console.error('Error in loginWithUserData:', error);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const { removeToken, stopAutoRefresh } = await import('../services/auth');
            removeToken();
            stopAutoRefresh();
        } catch (error) {
            console.error('Error during logout:', error);
            // Fallback to manual cleanup
            const keys = ['toeic_current_user', 'toeic_access_token', 'toeic_refresh_token', 'currentUser', 'authToken'];
            keys.forEach(key => localStorage.removeItem(key));
        }

        // Clear exercise completion data for user separation
        const { clearCompletedExercises } = await import('../services/exerciseProgress');
        clearCompletedExercises();

        setCurrentUser(null);
        setIsAuthenticated(false);
        console.log('✅ User logged out successfully');
    }, []);

    const signOut = useCallback(() => logout(), [logout]);

    const updateCurrentUser = useCallback(async (updatedUser: User) => {
        try {
            const { setCurrentUser: storeUser } = await import('../services/auth');
            storeUser(updatedUser);
            setCurrentUser(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }, []);

    // Add refresh token function
    const refreshToken = useCallback(async (): Promise<void> => {
        if (isRefreshing) {
            console.log('🔄 Token refresh already in progress');
            return;
        }

        try {
            setIsRefreshing(true);
            console.log('🔄 Starting token refresh...');

            // Import refresh function from auth service
            const { refreshAuthToken } = await import('../services/auth');

            const newAccessToken = await refreshAuthToken();

            if (newAccessToken) {
                console.log('✅ Token refreshed successfully');
                // Token is automatically stored by the auth service
                // No need to update user state unless user data changed
            } else {
                console.warn('⚠️ Token refresh failed - logging out');
                logout();
            }
        } catch (error) {
            console.error('❌ Token refresh error:', error);
            logout(); // Logout on refresh failure
        } finally {
            setIsRefreshing(false);
        }
    }, [isRefreshing, logout]);

    useEffect(() => {
        // Debug every state change
        console.log('🔍 AuthContext State Change:', {
            loading,
            isAuthenticated,
            currentUser: currentUser?.username || 'none',
            timestamp: new Date().toISOString()
        });

        // If user just became authenticated, log it prominently
        if (isAuthenticated && currentUser) {
            console.log('🎉 AuthContext: User is now authenticated!', {
                username: currentUser.username,
                id: currentUser.id
            });
        }
    }, [loading, isAuthenticated, currentUser]);

    // Add refresh function to manually re-check auth state
    const refreshAuthState = useCallback(async () => {
        console.log('🔄 Manually refreshing auth state...');
        setLoading(true);

        try {
            const { getToken, getCurrentUser, isAuthenticated: checkAuth, startAutoRefresh } = await import('../services/auth');

            const token = getToken();
            const user = getCurrentUser();

            console.log('🔄 Refresh check:', {
                hasToken: !!token,
                hasUser: !!user,
                authCheck: checkAuth()
            });

            if (token && user && checkAuth()) {
                console.log('✅ Refresh successful - user authenticated');
                setCurrentUser(user);
                setIsAuthenticated(true);
                startAutoRefresh();
            } else {
                console.log('❌ Refresh failed - user not authenticated');
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ Refresh auth state error:', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: currentUser,
                currentUser,
                isAuthenticated,
                loading,
                isRefreshing,
                login,
                loginWithUserData,
                logout,
                signOut,
                updateCurrentUser,
                refreshAuthState,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
