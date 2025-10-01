
import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Internship, ApplicationStatus, User, Role } from '../types';
import Sidebar from '../components/Sidebar';

const statusColor = {
    [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800',
    [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
    [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800'
};
const statusBorderColor = {
    [ApplicationStatus.APPLIED]: 'border-blue-500',
    [ApplicationStatus.ACCEPTED]: 'border-green-500',
    [ApplicationStatus.REJECTED]: 'border-red-500'
};

const ProfilePage: React.FC<{user: User, updateUser: (profile: Partial<User>) => void}> = ({ user, updateUser }) => {
    const [name, setName] = useState(user.name);
    const [field, setField] = useState(user.field || '');
    const [description, setDescription] = useState(user.description || '');
    const { addToast } = useToast();

    const handleSave = () => {
        updateUser({ name, field, description });
        addToast('Profil perusahaan berhasil diperbarui!', 'success');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Profil Perusahaan</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Bidang Industri</label>
                    <input type="text" value={field} onChange={e => setField(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi Perusahaan</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Simpan Perubahan</button>
            </div>
        </div>
    );
};

const PostInternshipPage: React.FC = () => {
    const { addInternship } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ title: '', description: '', location: '', duration: '3 Months', requirements: '', field: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const newInternship = {
            ...formData,
            requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
            companyId: user.id,
        };
        addInternship(newInternship, user.id);
        addToast('Lowongan internship berhasil dibuat!', 'success');
        setFormData({ title: '', description: '', location: '', duration: '3 Months', requirements: '', field: '' });
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Buat Lowongan Internship Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Judul Posisi</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bidang</label>
                    <input type="text" name="field" value={formData.field} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900" placeholder="e.g., Software Engineering" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Durasi</label>
                    <select name="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900">
                        <option>3 Months</option>
                        <option>6 Months</option>
                        <option>1 Year</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements (pisahkan dengan koma)</label>
                    <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Post Lowongan</button>
            </form>
        </div>
    );
};

const ListingsPage: React.FC = () => {
    const { user } = useAuth();
    const { internships, getApplicationsForCompany, updateApplicationStatus } = useData();
    const { addToast } = useToast();

    const myInternships = useMemo(() => {
        return internships.filter(i => i.companyId === user?.id);
    }, [internships, user]);

    const allApplicants = useMemo(() => {
        if (!user) return [];
        return getApplicationsForCompany(user.id);
    }, [user, getApplicationsForCompany]);

    const handleStatusChange = (applicationId: number, status: ApplicationStatus) => {
        updateApplicationStatus(applicationId, status);
        addToast(`Status lamaran diubah menjadi ${status}`, 'info');
    };

    return (
        <div className="space-y-8">
            {myInternships.length > 0 ? myInternships.map(internship => (
                <div key={internship.id} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-1 text-gray-800">{internship.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{internship.location} - {internship.duration}</p>
                    <h4 className="font-semibold mb-2">Pelamar:</h4>
                    <div className="space-y-3">
                        {allApplicants.filter(a => a.internshipId === internship.id).length > 0 ? (
                            allApplicants.filter(a => a.internshipId === internship.id).map(app => (
                                <div key={app.id} className={`p-4 border-l-4 ${statusBorderColor[app.status]} rounded-r-md bg-slate-50 flex items-center justify-between`}>
                                    <div>
                                        <p className="font-semibold">{app.student?.name}</p>
                                        <a href={app.student?.cvLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                                            Lihat CV
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor[app.status]}`}>{app.status}</span>
                                        <select
                                            value={app.status}
                                            onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                        >
                                            <option value={ApplicationStatus.APPLIED}>Applied</option>
                                            <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                                            <option value={ApplicationStatus.REJECTED}>Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Belum ada pelamar.</p>
                        )}
                    </div>
                </div>
            )) : <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md">Anda belum memposting lowongan internship.</p>}
        </div>
    );
};

const CompanyDashboard: React.FC = () => {
    const { user, updateCompanyProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('listings');

    if (!user) return null;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Perusahaan: {user.name}</h1>
            <p className="text-gray-600 mb-6">Kelola lowongan internship dan kandidat Anda.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.COMPANY} activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1">
                    {activeTab === 'listings' && <ListingsPage />}
                    {activeTab === 'post' && <PostInternshipPage />}
                    {activeTab === 'profile' && <ProfilePage user={user} updateUser={updateCompanyProfile} />}
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;