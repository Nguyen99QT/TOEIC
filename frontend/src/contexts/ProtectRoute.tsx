import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Spinner đơn giản, có thể thay bằng component đẹp hơn nếu muốn
const Spinner = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
        }}
    >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-500">Loading...</span>
    </div>
);

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Spinner />;
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;