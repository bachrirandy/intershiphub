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
    const [scrolled, setScrolled] = useState(false);
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
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-soft' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-heading font-bold text-slate-900 tracking-tight">
                        Internship<span className="text-brand-primary">Hub</span>
                    </span>
                </NavLink>
                
                <div className="flex items-center space-x-3 md:space-x-6">
                    <NavLink to="/resources" className={({isActive}) => `text-sm font-medium transition-colors px-3 py-2 rounded-full ${isActive ? 'bg-brand-light text-brand-dark' : 'text-slate-600 hover:text-brand-primary hover:bg-slate-100'}`}>
                        Resource Center
                    </NavLink>
                    
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-white border border-slate-200 rounded-full hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                                <span className="text-sm font-semibold text-slate-700 pl-1 hidden md:block">{user.name.split(' ')[0]}</span>
                                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center overflow-hidden text-sm font-bold">
                                    {user.profilePictureUrl || user.logoUrl ? (
                                        <img src={user.profilePictureUrl || user.logoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 py-2 z-50 animate-scale-in origin-top-right border border-slate-100">
                                    <div className="px-5 py-3 border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate font-medium">{user.email}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-dark">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="py-1">
                                        <NavLink 
                                            to={getDashboardPath()}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink 
                                            to={getProfilePath()}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                                        >
                                            Edit Profil
                                        </NavLink>
                                    </div>
                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                        <button 
                                            onClick={handleLogout} 
                                            className="w-full text-left flex items-center px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button onClick={() => openAuthModal({ mode: 'login', role: Role.STUDENT })} className="hidden md:block text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors px-4">
                                Masuk
                            </button>
                            <button onClick={() => openAuthModal({ mode: 'register', role: Role.STUDENT })} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-primary hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5">
                                Daftar Sekarang
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;