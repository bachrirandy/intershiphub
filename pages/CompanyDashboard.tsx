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
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <h1 className="text-3xl font-bold text-[#264E86] mb-2">Dashboard Perusahaan: {user.name}</h1>
            <p className="text-[#264E86]/80 mb-6">Kelola lowongan internship dan kandidat Anda.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.COMPANY} />
                <main className="flex-1">
                    <Outlet context={{ setSelectedInternship } satisfies CompanyDashboardContextType} />
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