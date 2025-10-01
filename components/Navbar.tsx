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
                <Link to="/" className="text-2xl font-bold text-[#0074E4]">
                    Internship<span className="text-[#264E86]">Hub</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <button
                                onClick={handleDashboardClick}
                                className="text-[#264E86]/80 hover:text-[#0074E4] font-medium px-3 py-2 rounded-md hover:bg-[#EFF0F4] transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86] transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleLoginClick}
                            className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86] transition-colors"
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