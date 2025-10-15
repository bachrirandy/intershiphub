import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { Role } from '../types';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { openAuthModal } = useModal();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const getDashboardPath = () => {
        if (!user) return '/';
        switch (user.role) {
            case Role.STUDENT: return '/student';
            case Role.COMPANY: return '/company';
            case Role.ADMIN: return '/admin';
            default: return '/';
        }
    };
    
    const getProfilePath = () => {
        if (!user) return '/';
        switch (user.role) {
            case Role.STUDENT: return '/student/profile';
            case Role.COMPANY: return '/company/profile';
            default: return getDashboardPath();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <NavLink to="/" className="text-2xl font-bold text-[#0074E4]">
                    InternshipHub
                </NavLink>
                <div className="flex items-center space-x-4">
                    <NavLink to="/resources" className={({isActive}) => `text-base font-medium ${isActive ? 'text-[#0074E4]' : 'text-[#264E86]'} hover:text-[#0074E4] transition-colors`}>
                        Resources
                    </NavLink>
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center w-10 h-10 bg-[#EFF0F4] rounded-full overflow-hidden border-2 border-transparent hover:border-[#0074E4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0074E4]">
                                {user.profilePictureUrl || user.logoUrl ? (
                                    <img src={user.profilePictureUrl || user.logoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-[#0074E4] text-lg">{user.name.charAt(0)}</span>
                                )}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 animate-fade-in">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-semibold text-[#264E86] truncate">{user.name}</p>
                                        <p className="text-xs text-[#264E86]/70 truncate">{user.email}</p>
                                    </div>
                                    <NavLink 
                                        to={getProfilePath()}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-[#264E86] hover:bg-[#EFF0F4]"
                                    >
                                        Profil
                                    </NavLink>
                                    <NavLink 
                                        to={getDashboardPath()}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-[#264E86] hover:bg-[#EFF0F4]"
                                    >
                                        Dashboard
                                    </NavLink>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-[#EFF0F4]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button onClick={() => openAuthModal({ mode: 'login', role: Role.STUDENT })} className="text-base font-medium text-[#264E86] hover:text-[#0074E4] transition-colors">
                                Login
                            </button>
                            <button onClick={() => openAuthModal({ mode: 'register', role: Role.STUDENT })} className="bg-[#0074E4] text-white px-4 py-2 rounded-md font-medium hover:bg-[#264E86] transition-colors">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;