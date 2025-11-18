import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Internship, Role } from '../types';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';

export interface StudentDashboardContextType {
  setSelectedInternship: (internship: Internship | null) => void;
};

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-slide-up">
            <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-heading font-bold">Halo, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-blue-100 mt-2 text-lg max-w-xl">Siap mengejar peluang baru hari ini? Lengkapi profilmu dan mulai melamar ke perusahaan impian.</p>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <Sidebar role={Role.STUDENT} />
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

export default StudentDashboard;