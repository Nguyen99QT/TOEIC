import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from '../types';

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

                if (token && user && checkAuth()) {
                    console.log('✅ Found valid auth for:', user.username);
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    startAutoRefresh();
                } else {
                    console.log('ℹ️ No valid authentication found - user is guest');
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
                setLoading(false);
                console.log('✅ Auth initialization completed');
            }
        };

        // Initialize immediately, don't use timeout to delay
        initAuth();

        return () => {
            // Cleanup on unmount
            import('../services/auth').then(({ stopAutoRefresh }) => {
                stopAutoRefresh();
            });
        };
    }, []);

    const login = async (usernameOrEmail: string, password: string): Promise<void> => {
        try {
            const { login: authLogin, startAutoRefresh } = await import('../services/auth');
            const response = await authLogin({
                username: usernameOrEmail,
                password: password
            });

            console.log('🔍 AuthContext: Login response received:', response);

            if (response && (response.token || response.accessToken)) {
                const user: User = {
                    id: response.id || 0,
                    username: response.username || '',
                    email: response.email || '',
                    fullName: response.username || '',
                    role: (response.role as "ADMIN" | "USER" | "COLLABORATOR") || 'USER',
                    membershipType: "FREE"
                };

                console.log('✅ AuthContext: Setting user data:', user);

                // ⚡ FIX: Use React's state batching to ensure updates happen together
                setCurrentUser(user);
                setIsAuthenticated(true);

                // ⚡ ADD: Force state update with a small delay to ensure DOM updates
                setTimeout(() => {
                    console.log('🔍 Post-login state verification:', {
                        isAuthenticated: true,
                        currentUser: user.username
                    });
                }, 100);

                startAutoRefresh();
                console.log('✅ AuthContext: Login state updated successfully');
            } else {
                console.error('❌ AuthContext: Invalid login response structure:', response);
                throw new Error('Invalid login response');
            }
        } catch (error: any) {
            console.error('❌ AuthContext: Login error:', error);
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
