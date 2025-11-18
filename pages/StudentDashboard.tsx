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
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <h1 className="text-3xl font-bold text-[#264E86] mb-2">Selamat Datang, {user.name}</h1>
            <p className="text-[#264E86]/80 mb-6">Temukan kesempatan magang terbaik untuk memulai karirmu.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.STUDENT} />
                <main className="flex-1">
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