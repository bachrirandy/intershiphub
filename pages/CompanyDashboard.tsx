import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Internship, Role } from '../types';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';

export interface CompanyDashboardContextType {
    setSelectedInternship: (internship: Internship | null) => void;
};

const CompanyDashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-slide-up">
             <div className="mb-8 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard Perusahaan</h1>
                        <p className="text-slate-500 mt-1 text-lg">{user.name} &bull; HR Command Center</p>
                    </div>
                    <div className="hidden md:block p-3 bg-blue-50 rounded-xl text-brand-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <Sidebar role={Role.COMPANY} />
                <main className="flex-1 min-w-0">
                    <Outlet context={{ setSelectedInternship }} />
                </main>
            </div>

            {selectedInternship && (
                <InternshipDetailModal 
                    internship={selectedInternship} 
                    onClose={() => setSelectedInternship(null)} 
                />
            )}
        </div>
    );
};

export default CompanyDashboard;