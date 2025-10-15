import React from 'react';
import { useData } from '../contexts/DataContext';
import { users } from '../data/dummyData';
import { Role } from '../types';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
    const { internships, applications, articles, reviews } = useData();

    const totalStudents = users.filter(u => u.role === Role.STUDENT).length;
    const totalCompanies = users.filter(u => u.role === Role.COMPANY).length;

    const StatsPage = () => (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Lowongan</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{internships.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Lamaran</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{applications.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Mahasiswa</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Perusahaan</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{totalCompanies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Artikel</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{articles.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-[#264E86]/75 mb-2">Total Ulasan</h2>
                <p className="text-4xl font-bold text-[#0074E4]">{reviews.length}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <h1 className="text-3xl font-bold text-[#264E86] mb-6">Admin Dashboard</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* FIX: Removed activeTab and setActiveTab props as they are not part of SidebarProps and are unnecessary for this component. */}
                <Sidebar role={Role.ADMIN} />
                <main className="flex-1">
                    <StatsPage />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;