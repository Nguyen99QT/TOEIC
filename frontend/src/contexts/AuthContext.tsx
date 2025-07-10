import React, { useContext, useEffect, useState } from 'react';
import { startAutoRefresh, stopAutoRefresh } from '../services/auth';
import { User } from '../types';

export interface AuthContextType {
    user: User | null; // For backward compatibility
    currentUser: User | null; // Primary user property
    login: (email: string, password: string) => Promise<void>; // Fixed signature
    loginWithUserData: (user: User, accessToken: string) => void; // NEW: For direct user data login
    logout: () => void;
    signOut: () => void;
    updateCurrentUser: (user: User) => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    login: async () => { }, // Fixed default to match signature
    loginWithUserData: () => { }, // NEW: Default for loginWithUserData
    logout: () => { },
    signOut: () => { },
    updateCurrentUser: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const initializeAuth = () => {
        console.log('🔍 AuthProvider: Initializing authentication...');

        try {
            // Check for token first - use toeic_access_token as primary key
            const token = localStorage.getItem("toeic_access_token") ||
                localStorage.getItem("authToken");

            if (!token) {
                console.log('❌ No valid token found');
                return false;
            }

            // Then check for user data - use toeic_current_user as primary key
            const userData = localStorage.getItem("toeic_current_user") ||
                localStorage.getItem("currentUser");

            if (!userData) {
                console.log('❌ No user data found');
                return false;
            }

            try {
                const user = JSON.parse(userData);
                // Less strict validation to handle different user data formats
                if (!user) {
                    console.log('❌ Invalid user data format');
                    return false;
                }
                console.log('✅ Found valid authentication data');
                return { user, token };
            } catch (e) {
                console.error('❌ Error parsing user data:', e);
                return false;
            }
        } catch (e) {
            console.error('❌ Error during auth initialization:', e);
            return false;
        }
    };

    // Thêm hàm này vào AuthProvider để debug
    const debugAuthState = () => {
        console.group('🔍 Auth Debug Info');
        // Kiểm tra tất cả các key có thể chứa token
        console.log('toeic_access_token:', localStorage.getItem('toeic_access_token') ? '✅ Exists' : '❌ Missing');
        console.log('authToken:', localStorage.getItem('authToken') ? '✅ Exists' : '❌ Missing');

        // Kiểm tra tất cả các key có thể chứa user data
        console.log('toeic_current_user:', localStorage.getItem('toeic_current_user') ? '✅ Exists' : '❌ Missing');
        console.log('currentUser:', localStorage.getItem('currentUser') ? '✅ Exists' : '❌ Missing');

        // Kiểm tra trạng thái auth trong React component
        console.log('isAuthenticated state:', isAuthenticated);
        console.log('currentUser state:', currentUser ? '✅ Exists' : '❌ Missing');
        console.groupEnd();
    };

    useEffect(() => {
        console.log('🔍 AuthProvider: Checking authentication status...');
        debugAuthState(); // Thêm debug info

        const authData = initializeAuth();

        if (authData) {
            console.log('✅ Valid authentication found:', authData.user.email || authData.user.username);
            setCurrentUser(authData.user);
            setIsAuthenticated(true);
            startAutoRefresh();
        } else {
            console.log('❌ No valid authentication found');
            // Clean up any invalid auth data
            localStorage.removeItem("toeic_access_token");
            localStorage.removeItem("toeic_current_user");
            localStorage.removeItem("authToken");
            localStorage.removeItem("currentUser");
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);

        return () => {
            stopAutoRefresh();
        };
    }, []);

    // ✅ FIXED: Proper login function for AuthContext
    const login = async (usernameOrEmail: string, password: string): Promise<void> => {
        try {
            console.log('🔑 AuthContext: Attempting login for:', usernameOrEmail);

            // Thêm kiểm tra tính hợp lệ của thông tin đăng nhập
            if (!usernameOrEmail || !password) {
                throw new Error('Tên đăng nhập và mật khẩu không được để trống');
            }

            // Log chi tiết hơn để debug
            console.log(`🔍 Login attempt with: ${usernameOrEmail.length > 3 ? usernameOrEmail.substring(0, 3) + '...' : usernameOrEmail} / ${password ? '********' : 'empty'}`);

            // ✅ Import the login function from auth service
            const { login: authLogin } = await import('../services/auth');

            // Thêm logic để kiểm tra xem đang nhập email hay username
            const isEmail = usernameOrEmail.includes('@');

            // ✅ Call with proper LoginRequest format, gửi đúng kiểu thông tin
            const response = await authLogin({
                username: usernameOrEmail,
                // Không truyền email nữa
                password: password
            });

            if (response && response.user && response.accessToken) {
                console.log('✅ Login successful, storing auth data...');
                // Don't need to duplicate storage since login function already handles it
                // Just update the local state
                setCurrentUser(response.user);
                setIsAuthenticated(true);
                startAutoRefresh();
                console.log('✅ AuthContext: Login completed successfully');
            } else {
                throw new Error('Invalid login response - missing user or accessToken');
            }
        } catch (error: any) {
            console.error('❌ AuthContext login error:', error);

            // Cải thiện thông báo lỗi cụ thể về vấn đề mật khẩu
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
                } else if (error.response.data?.message?.toLowerCase().includes('password')) {
                    throw new Error('Mật khẩu không hợp lệ: ' + error.response.data.message);
                }
            }

            throw error; // Re-throw so components can handle the error
        }
    };

    // ✅ NEW: Function to handle login with existing user data (for after successful API call)
    const loginWithUserData = (user: User, accessToken: string) => {
        console.log('🔑 AuthProvider: Setting up user session...');

        // Store with consistent keys
        localStorage.setItem("toeic_access_token", accessToken);
        localStorage.setItem("toeic_current_user", JSON.stringify(user));

        // Update state
        setCurrentUser(user);
        setIsAuthenticated(true);
        startAutoRefresh();

        console.log('✅ User session initialized successfully');
    };

    const logout = () => {
        console.log('🚪 AuthContext: Logging out...');

        // Clear all possible token keys
        localStorage.removeItem('toeic_current_user');
        localStorage.removeItem('toeic_access_token');
        localStorage.removeItem('toeic_refresh_token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        stopAutoRefresh();

        console.log('✅ Logout completed');
    };

    const signOut = () => {
        console.log('🚪 AuthContext: Signing out...');
        logout(); // Sử dụng logout function
    };

    const updateCurrentUser = (updatedUser: User) => {
        console.log('👤 AuthContext: Updating user info...');

        localStorage.setItem('toeic_current_user', JSON.stringify(updatedUser));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // For backward compatibility
        setCurrentUser(updatedUser);

        console.log('✅ User info updated');
    };

    return (
        <AuthContext.Provider
            value={{
                user: currentUser, // Provide both for compatibility
                currentUser,
                isAuthenticated,
                loading,
                login, // Now uses the correct login function
                loginWithUserData, // NEW: For direct user data login
                logout,
                signOut,
                updateCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);