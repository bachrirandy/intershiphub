import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { users } from '../data/dummyData';
import { Role } from '../types';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
    const { internships, applications } = useData();
    const [activeTab, setActiveTab] = useState('stats');

    const totalStudents = users.filter(u => u.role === Role.STUDENT).length;
    const totalCompanies = users.filter(u => u.role === Role.COMPANY).length;

    const StatsPage = () => (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Lowongan</h2>
                <p className="text-4xl font-bold text-indigo-600">{internships.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Lamaran</h2>
                <p className="text-4xl font-bold text-indigo-600">{applications.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Mahasiswa</h2>
                <p className="text-4xl font-bold text-indigo-600">{totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-500 mb-2">Total Perusahaan</h2>
                <p className="text-4xl font-bold text-indigo-600">{totalCompanies}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.ADMIN} activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1">
                    {activeTab === 'stats' && <StatsPage />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
