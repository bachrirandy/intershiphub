import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Internship, ApplicationStatus, User, Role } from '../types';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;

const ProfilePage: React.FC<{user: User, updateUser: (profile: Partial<User>) => void}> = ({ user, updateUser }) => {
    const [name, setName] = useState(user.name);
    const [major, setMajor] = useState(user.major || '');
    const [skills, setSkills] = useState((user.skills || []).join(', '));
    const [cvLink, setCvLink] = useState(user.cvLink || '');
    const { addToast } = useToast();

    const handleSave = () => {
        updateUser({
            name,
            major,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            cvLink
        });
        addToast('Profil berhasil diperbarui!', 'success');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Profil Saya</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                    <input type="text" value={major} onChange={e => setMajor(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (pisahkan dengan koma)</label>
                    <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link CV (URL)</label>
                    <input type="text" value={cvLink} onChange={e => setCvLink(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Simpan Perubahan</button>
            </div>
        </div>
    );
};

const InternshipCard: React.FC<{internship: Internship, onApply: () => void, onViewDetails: () => void, applied: boolean}> = ({ internship, onApply, onViewDetails, applied }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
        <div>
            <h3 className="text-xl font-bold text-indigo-700">{internship.title}</h3>
            <p className="text-gray-600 font-medium mb-2">{internship.companyName}</p>
            <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{internship.description.substring(0, 100)}...</p>
            <div className="text-sm text-gray-700 space-y-2 mb-4">
                <p className="flex items-center"><BriefcaseIcon/> {internship.field}</p>
                <p className="flex items-center"><LocationIcon/> {internship.location}</p>
                <p className="flex items-center"><ClockIcon/> {internship.duration}</p>
            </div>
        </div>
        <div className="flex justify-end space-x-2 mt-2">
            <button
                onClick={onViewDetails}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
            >
                Lihat Detail
            </button>
            <button
                onClick={onApply}
                disabled={applied}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {applied ? 'Sudah Dilamar' : 'Lamar Sekarang'}
            </button>
        </div>
    </div>
);

const SearchPage: React.FC = () => {
    const { internships, applyForInternship, applications } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ field: '', location: '', duration: '' });
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    const fields = useMemo(() => [...new Set(internships.map(i => i.field))], [internships]);
    const locations = useMemo(() => [...new Set(internships.map(i => i.location))], [internships]);
    const durations = useMemo(() => [...new Set(internships.map(i => i.duration))], [internships]);
    
    const filteredInternships = useMemo(() => {
        return internships.filter(i => 
            i.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filters.field === '' || i.field === filters.field) &&
            (filters.location === '' || i.location === filters.location) &&
            (filters.duration === '' || i.duration === filters.duration)
        );
    }, [internships, searchTerm, filters]);

    const handleApply = (internshipId: number) => {
        if (!user) return;
        const success = applyForInternship(user.id, internshipId);
        if (success) {
            addToast('Lamaran berhasil dikirim!', 'success');
        } else {
            addToast('Anda sudah melamar di posisi ini.', 'info');
        }
    };

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-4 relative">
                        <input
                            type="text"
                            placeholder="Cari judul internship..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                           <SearchIcon />
                        </div>
                    </div>
                    <select value={filters.field} onChange={e => setFilters({...filters, field: e.target.value})} className="w-full p-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Semua Bidang</option>
                        {fields.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <select value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} className="w-full p-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Semua Lokasi</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={filters.duration} onChange={e => setFilters({...filters, duration: e.target.value})} className="w-full p-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Semua Durasi</option>
                        {durations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.length > 0 ? filteredInternships.map(internship => (
                    <InternshipCard 
                        key={internship.id} 
                        internship={internship}
                        onViewDetails={() => setSelectedInternship(internship)}
                        onApply={() => handleApply(internship.id)}
                        applied={applications.some(a => a.studentId === user?.id && a.internshipId === internship.id)}
                    />
                )) : <p className="text-gray-500 md:col-span-2 lg:col-span-3 text-center py-4">Tidak ada internship yang cocok dengan kriteria.</p>}
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

const ApplicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { getApplicationsForStudent } = useData();

    const myApplications = useMemo(() => {
        if (!user) return [];
        return getApplicationsForStudent(user.id);
    }, [user, getApplicationsForStudent]);

    const statusColor = {
        [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800',
        [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
        [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
             <h2 className="text-2xl font-bold mb-4 text-gray-800">Lamaran Saya</h2>
             <div className="space-y-4">
                 {myApplications.length > 0 ? myApplications.map(app => (
                     <div key={app.id} className="p-4 border rounded-md flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{app.internship?.title}</h3>
                            <p className="text-gray-600">{app.internship?.companyName}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor[app.status]}`}>
                            {app.status}
                        </span>
                     </div>
                 )) : <p>Anda belum melamar internship manapun.</p>}
             </div>
        </div>
    );
}

const StudentDashboard: React.FC = () => {
    const { user, updateStudentProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('search');

    if (!user) return null;
  
    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang, {user.name}!</h1>
            <p className="text-gray-600 mb-6">Kelola pencarian internship dan profilmu di sini.</p>

            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.STUDENT} activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1">
                    {activeTab === 'search' && <SearchPage />}
                    {activeTab === 'applications' && <ApplicationsPage />}
                    {activeTab === 'profile' && <ProfilePage user={user} updateUser={updateStudentProfile} />}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;