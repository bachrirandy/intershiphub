import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { ApplicationStatus } from '../types';

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
const JobTypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/75" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;


const CompanyListingsPage: React.FC = () => {
    const { user } = useAuth();
    const { internships, getApplicationsForCompany, updateApplicationStatus, deleteInternship } = useData();
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
    
    const handleDelete = (internshipId: number, internshipTitle: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${internshipTitle}"?`)) {
            deleteInternship(internshipId);
            addToast(`Lowongan "${internshipTitle}" berhasil dihapus.`, 'success');
        }
    };

    return (
        <div className="space-y-8">
            {myInternships.length > 0 ? myInternships.map(internship => (
                <div key={internship.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold mb-1 text-[#264E86]">{internship.title}</h3>
                            <div className="flex flex-wrap items-center text-sm text-[#264E86]/75 mb-4 gap-x-4 gap-y-1">
                                <span>{internship.location}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span>{internship.duration}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span className="flex items-center"><JobTypeIcon /> {internship.jobType}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(internship.id, internship.title)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            aria-label="Hapus lowongan"
                        >
                            <TrashIcon />
                        </button>
                    </div>

                    <h4 className="font-semibold mb-2 text-[#264E86]">Pelamar:</h4>
                    <div className="space-y-3">
                        {allApplicants.filter(a => a.internshipId === internship.id).length > 0 ? (
                            allApplicants.filter(a => a.internshipId === internship.id).map(app => (
                                <div key={app.id} className={`p-4 border-l-4 ${statusBorderColor[app.status]} rounded-r-md bg-[#EFF0F4] flex items-center justify-between`}>
                                    <div>
                                        <p className="font-semibold text-[#264E86]">{app.student?.name}</p>
                                        <a href={app.student?.cvLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0074E4] hover:underline">
                                            Lihat CV
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor[app.status]}`}>{app.status}</span>
                                        <select
                                            value={app.status}
                                            onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                            className="text-sm border-[#264E86]/20 rounded-md focus:ring-[#0074E4] focus:border-[#0074E4] bg-white text-[#264E86]"
                                        >
                                            <option value={ApplicationStatus.APPLIED}>Applied</option>
                                            <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                                            <option value={ApplicationStatus.REJECTED}>Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#264E86]/75 text-sm">Belum ada pelamar.</p>
                        )}
                    </div>
                </div>
            )) : <p className="text-[#264E86]/75 bg-white p-6 rounded-lg shadow-md">Anda belum memposting lowongan internship.</p>}
        </div>
    );
};

export default CompanyListingsPage;
