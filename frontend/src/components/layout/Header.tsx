import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
    const { isAuthenticated, currentUser, logout } = useAuth();

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">
                        TOICEnglish
                    </Link>

                    <nav className="flex space-x-4">
                        <Link to="/" className="hover:text-blue-200">Home</Link>
                        <Link to="/lessons" className="hover:text-blue-200">Lessons</Link>
                        <Link to="/flashcards" className="hover:text-blue-200">Flashcards</Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span>Welcome, {currentUser?.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-blue-200">Login</Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;