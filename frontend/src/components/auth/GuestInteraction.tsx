/**
 * ================================================================
 * GUEST INTERACTION COMPONENT
 * ================================================================
 * Component để xử lý tương tác của guest users
 * Hiển thị thông báo và yêu cầu đăng nhập khi cần
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/SimpleToast';

interface GuestInteractionProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    message?: string;
    actionName?: string;
}

const GuestInteraction: React.FC<GuestInteractionProps> = ({
    children,
    requireAuth = true,
    message = "Please login to access this feature",
    actionName = "access this feature"
}) => {
    const { isAuthenticated } = useAuth();
    const { info } = useToast();
    const navigate = useNavigate();

    const handleGuestClick = (e: React.MouseEvent) => {
        if (!isAuthenticated && requireAuth) {
            e.preventDefault();
            e.stopPropagation();

            info(
                'Login Required',
                `You need to login to ${actionName}. Click here to login.`
            );

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    if (!isAuthenticated && requireAuth) {
        return (
            <div onClick={handleGuestClick} className="cursor-pointer">
                {children}
            </div>
        );
    }

    return <>{children}</>;
};

export default GuestInteraction;
