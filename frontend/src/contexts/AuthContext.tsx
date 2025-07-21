import React, { useContext, useState, useEffect } from 'react';
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
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    login: async () => { },
    loginWithUserData: () => { },
    logout: () => { },
    signOut: () => { },
    updateCurrentUser: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (usernameOrEmail: string, password: string) => {
        try {
            setLoading(true);
            console.log('🔑 Attempting login with:', usernameOrEmail);
            
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameOrEmail,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log('📱 Login response:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Set user data
            const userData: User = {
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                fullName: data.user.fullName,
                role: data.user.role,
                isPremium: data.user.isPremium,
                membershipType: data.user.membershipType || 'BASIC'
            };

            setUser(userData);
            
            // Store both token and user data in localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            console.log('✅ Login successful, user set:', userData);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        console.log('🚪 User logged out');
        // Force page reload to ensure clean state
        window.location.replace('/login');
    };

    const signOut = logout;

    const loginWithUserData = (userData: User, accessToken: string) => {
        setUser(userData);
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const updateCurrentUser = (userData: User) => {
        setUser(userData);
    };

    // Check for existing token on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('authToken');
            const savedUserData = localStorage.getItem('userData');
            
            if (token && savedUserData) {
                try {
                    console.log('� Restoring session from localStorage...');
                    const userData = JSON.parse(savedUserData);
                    setUser(userData);
                    console.log('✅ Session restored:', userData);
                } catch (error) {
                    console.error('❌ Error parsing saved user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            } else {
                console.log('ℹ️ No saved session found');
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user: user,
                currentUser: user,
                isAuthenticated,
                loading,
                login,
                loginWithUserData,
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