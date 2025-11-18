import React from 'react';
import { NavLink } from 'react-router-dom';
import { Role } from '../types';

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;


interface SidebarProps {
    role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const studentTabs = [
        { id: 'search', label: 'Cari Internship', icon: <SearchIcon />, path: '/student' },
        { id: 'applications', label: 'Lamaran Saya', icon: <DocumentTextIcon />, path: '/student/applications' },
        { id: 'calendar', label: 'Kalender', icon: <CalendarIcon />, path: '/student/calendar' },
    ];

    const companyTabs = [
        { id: 'listings', label: 'Lowongan Saya', icon: <BriefcaseIcon />, path: '/company' },
        { id: 'post', label: 'Buat Lowongan', icon: <PlusCircleIcon />, path: '/company/post' },
        { id: 'calendar', label: 'Kalender', icon: <CalendarIcon />, path: '/company/calendar' },
    ];

    const adminTabs = [
        { id: 'stats', label: 'Statistics', icon: <ChartBarIcon />, path: '/admin' }
    ];

    const getTabs = () => {
        switch (role) {
            case Role.STUDENT: return studentTabs;
            case Role.COMPANY: return companyTabs;
            case Role.ADMIN: return adminTabs;
            default: return [];
        }
    };
    
    const tabs = getTabs();

    return (
        <aside className="w-full lg:w-64 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex-shrink-0 h-fit sticky top-24" aria-label="Sidebar">
            <nav className="space-y-1">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.id}
                        to={tab.path}
                        end={tab.path === '/student' || tab.path === '/company' || tab.path === '/admin'}
                        className={({ isActive }) => 
                            `relative group w-full flex items-center px-4 py-3 text-left text-sm font-semibold rounded-xl transition-all duration-200 
                            ${isActive 
                                ? "bg-blue-50 text-brand-primary" 
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-brand-primary rounded-r-full"></span>}
                                <span className={`mr-3 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;