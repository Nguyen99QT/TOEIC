import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from '../types';
import { clearCompletedExercises } from '../services/exerciseProgress';

export interface AuthContextType {
    user: User | null;
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithUserData: (user: User, accessToken: string) => void;
    logout: () => void;
    signOut: () => void;
    updateCurrentUser: (user: User) => void;
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

        const initAuth = async () => {
            try {
                // Use auth service functions to check authentication
                const { getToken, getCurrentUser, isAuthenticated: checkAuth, startAutoRefresh } = await import('../services/auth');

                const token = getToken();
                const user = getCurrentUser();

                console.log('🔍 AuthProvider: Checking existing auth...');
                console.log('🔍 Token exists:', !!token);
                console.log('🔍 User exists:', !!user);
                console.log('🔍 Token preview:', token ? token.substring(0, 20) + '...' : 'null');
                console.log('🔍 User info:', user ? { id: user.id, username: user.username } : 'null');
                
                // Debug localStorage directly in AuthContext
                console.log('🔍 Debug localStorage from AuthContext:', {
                    'token': localStorage.getItem('token') ? 'EXISTS' : 'MISSING',
                    'toeic_access_token': localStorage.getItem('toeic_access_token') ? 'EXISTS' : 'MISSING',
                    'accessToken': localStorage.getItem('accessToken') ? 'EXISTS' : 'MISSING',
                    'authToken': localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING',
                    'toeic_current_user': localStorage.getItem('toeic_current_user') ? 'EXISTS' : 'MISSING',
                    'currentUser': localStorage.getItem('currentUser') ? 'EXISTS' : 'MISSING'
                });

                if (token && user && checkAuth()) {
                    console.log('✅ Found valid auth for:', user.username);
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    startAutoRefresh();
                } else {
                    console.log('ℹ️ No valid authentication found - user is guest');
                    console.log('🔍 checkAuth() result:', token && user ? checkAuth() : 'skipped (missing token or user)');

                    // Check if we have a recent login success flag OR valid tokens
                    const loginSuccess = localStorage.getItem('toeic_login_success');
                    const justLoggedIn = localStorage.getItem('auth_just_logged_in');
                    const loginTimestamp = localStorage.getItem('auth_login_timestamp');
                    
                    // Check if login was very recent (within last 30 seconds)
                    const isVeryRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 30000;
                    
                    if ((loginSuccess === 'true' || justLoggedIn === 'true' || isVeryRecentLogin) && token && user) {
                        console.log('🔧 Found recent login indicators, forcibly restoring authentication');
                        console.log('🔧 Login indicators:', { loginSuccess, justLoggedIn, isVeryRecentLogin, hasToken: !!token, hasUser: !!user });
                        setCurrentUser(user);
                        setIsAuthenticated(true);
                        startAutoRefresh();
                        
                        // Clean up flags after successful restoration
                        setTimeout(() => {
                            localStorage.removeItem('toeic_login_success');
                            localStorage.removeItem('auth_just_logged_in');
                        }, 5000);
                        return;
                    }

                    // If we have valid-looking token and user but checkAuth fails, try to restore anyway
                    if (token && user && token.length > 20 && user.username) {
                        console.warn('🔧 Token and user exist but checkAuth failed - attempting forced restoration');
                        setCurrentUser(user);
                        setIsAuthenticated(true);
                        startAutoRefresh();
                        return;
                    }

                    // If checkAuth failed but we have token/user, it might be expired
                    if (token && user && !checkAuth()) {
                        console.warn('🚨 Token/user exists but authentication check failed - likely expired');
                        // Clear potentially invalid data
                        const { removeToken } = await import('../services/auth');
                        removeToken();
                    }

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
            console.log('🔍 AuthContext: Starting login process...');
            const { login: authLogin, startAutoRefresh } = await import('../services/auth');
            
            console.log('🔍 AuthContext: Calling authLogin...');
            const response = await authLogin({
                username: usernameOrEmail,
                password: password
            });

            console.log('🔍 AuthContext: Login response received:', response);
            console.log('🔍 AuthContext: Checking localStorage after authLogin...');
            console.log('🔍 AuthContext: Token in localStorage:', !!localStorage.getItem('toeic_access_token'));
            console.log('🔍 AuthContext: User in localStorage:', !!localStorage.getItem('toeic_current_user'));

            if (response && (response.token || response.accessToken)) {
                // ✅ FIX: Explicitly save token to localStorage
                const token = response.token || response.accessToken;
                console.log('🔍 AuthContext: Manually saving token to localStorage...');
                
                const { setToken } = await import('../services/auth');
                setToken(token);
                console.log('✅ AuthContext: Token saved manually');

                // Also save user data to localStorage with the setCurrentUser function
                const { setCurrentUser: storeUser } = await import('../services/auth');
                
                // Handle both role (string) and roles (array) from backend
                let userRole: "ADMIN" | "USER" | "COLLABORATOR" = 'USER';

                if (response.role) {
                    userRole = response.role as "ADMIN" | "USER" | "COLLABORATOR";
                } else if (response.roles && Array.isArray(response.roles) && response.roles.length > 0) {
                    // Get the first role from the array and handle ROLE_ prefix
                    const firstRole = response.roles[0];
                    if (firstRole === 'ROLE_ADMIN' || firstRole === 'ADMIN') {
                        userRole = 'ADMIN';
                    } else if (firstRole === 'ROLE_USER' || firstRole === 'USER') {
                        userRole = 'USER';
                    } else if (firstRole === 'ROLE_COLLABORATOR' || firstRole === 'COLLABORATOR') {
                        userRole = 'COLLABORATOR';
                    }
                }

                console.log('🔍 AuthContext: Processed role:', userRole, 'from response.roles:', response.roles);

                const user: User = {
                    id: response.id || 0,
                    username: response.username || '',
                    email: response.email || '',
                    fullName: response.username || '',
                    role: userRole,
                    membershipType: response.membershipType || "BASIC"
                };

                console.log('✅ AuthContext: Setting user data:', user);

                // Store user data in localStorage immediately
                storeUser(user);
                console.log('✅ AuthContext: User data stored in localStorage');

                // Use React's state batching to ensure updates happen together
                setCurrentUser(user);
                setIsAuthenticated(true);

                // Set multiple flags to indicate successful login for persistence
                localStorage.setItem('toeic_login_success', 'true');
                localStorage.setItem('auth_just_logged_in', 'true');
                localStorage.setItem('auth_login_timestamp', Date.now().toString());

                // Add a verification step to ensure state updates properly
                setTimeout(() => {
                    console.log('🔍 Post-login state verification:', {
                        isAuthenticated: true,
                        currentUser: user.username,
                        localStorage: {
                            token: !!localStorage.getItem('toeic_access_token'),
                            user: !!localStorage.getItem('toeic_current_user'),
                            loginFlag: localStorage.getItem('toeic_login_success'),
                            justLoggedIn: localStorage.getItem('auth_just_logged_in'),
                            loginTimestamp: localStorage.getItem('auth_login_timestamp')
                        }
                    });
                }, 200);

                startAutoRefresh();
                console.log('✅ AuthContext: Login state updated successfully');
            } else {
                console.error('❌ AuthContext: Invalid login response structure:', response);
                throw new Error('Invalid login response');
            }
        } catch (error: any) {
            console.error('❌ AuthContext: Login error:', error);
            localStorage.removeItem('toeic_login_success');
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
            const keys = ['toeic_current_user', 'toeic_access_token', 'toeic_refresh_token', 'currentUser', 'authToken', 'toeic_login_success'];
            keys.forEach(key => localStorage.removeItem(key));
        }

        // Clear exercise completion data from localStorage
        try {
            clearCompletedExercises();
            console.log('✅ Exercise completion data cleared');
        } catch (error) {
            console.warn('⚠️ Could not clear exercise completion data:', error);
            // Fallback to manual cleanup
            localStorage.removeItem('completed_exercises');
            localStorage.removeItem('completedExercises');
        }

        // Clear all authentication flags
        localStorage.removeItem('toeic_login_success');
        localStorage.removeItem('auth_just_logged_in');
        localStorage.removeItem('auth_login_timestamp');
        
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

        // If user was authenticated but now is not, warn about potential false logout
        if (!isAuthenticated && currentUser) {
            console.warn('⚠️ Potential false logout detected! Current user exists but isAuthenticated is false');
            
            // Check if we still have valid token/user in localStorage
            const { getToken, getCurrentUser } = require('../services/auth');
            const token = getToken();
            const storedUser = getCurrentUser();
            
            if (token && storedUser) {
                console.warn('🔧 Found valid token/user in localStorage, restoring authentication');
                setCurrentUser(storedUser);
                setIsAuthenticated(true);
                return;
            }
        }

        // Auto-restore authentication if we have tokens but not authenticated
        if (!loading && !isAuthenticated && !currentUser) {
            const checkForValidAuth = async () => {
                try {
                    const { getToken, getCurrentUser } = await import('../services/auth');
                    const token = getToken();
                    const storedUser = getCurrentUser();
                    
                    // Check for recent login flags
                    const justLoggedIn = localStorage.getItem('auth_just_logged_in');
                    const loginSuccess = localStorage.getItem('toeic_login_success');
                    const loginTimestamp = localStorage.getItem('auth_login_timestamp');
                    const isVeryRecentLogin = loginTimestamp && (Date.now() - parseInt(loginTimestamp)) < 30000;
                    
                    if (token && storedUser && (justLoggedIn || loginSuccess || isVeryRecentLogin)) {
                        console.log('🔄 Auto-restoring authentication from valid tokens and flags');
                        setCurrentUser(storedUser);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Error in auto-restore:', error);
                }
            };
            
            checkForValidAuth();
        }
    }, [loading, isAuthenticated, currentUser]);

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
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
