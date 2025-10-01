import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { useModal } from '../contexts/ModalContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { openAuthModal } = useModal();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLoginClick = () => {
        openAuthModal({ mode: 'login', role: Role.STUDENT });
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case Role.STUDENT:
                return '/student';
            case Role.COMPANY:
                return '/company';
            case Role.ADMIN:
                return '/admin';
            default:
                return '/';
        }
    };

    const handleDashboardClick = () => {
        navigate(getDashboardLink());
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">
                    Internship<span className="text-slate-800">Hub</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <button
                                onClick={handleDashboardClick}
                                className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleLoginClick}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Login / Register
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;