import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ApplicationStatus } from '../types';
import { useToast } from '../contexts/ToastContext';

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const statusClasses = {
        [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800',
        [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
        [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const StudentApplicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { getStudentApplications, cancelApplication } = useData();
    const { addToast } = useToast();

    const myApplications = useMemo(() => {
        if (!user) return [];
        return getStudentApplications(user.id);
    }, [user, getStudentApplications]);

    if (!user) return null;

    const handleCancel = (applicationId: number, internshipTitle: string) => {
        if (window.confirm(`Apakah Anda yakin ingin membatalkan lamaran untuk "${internshipTitle}"?`)) {
            cancelApplication(applicationId);
            addToast('Lamaran berhasil dibatalkan.', 'success');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#264E86]">Lamaran Saya</h2>
            {myApplications.length > 0 ? (
                <div className="space-y-4">
                    {myApplications.map(app => (
                        <div key={app.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center bg-[#EFF0F4]/50">
                            <div className="flex-grow">
                                <h3 className="font-bold text-[#264E86]">{app.internship?.title}</h3>
                                <p className="text-sm text-[#264E86]/80">{app.internship?.companyName}</p>
                                <p className="text-xs text-[#264E86]/60 mt-1">
                                    Dilamar pada: {new Date(app.applicationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center space-x-3">
                                <StatusBadge status={app.status} />
                                {app.status === ApplicationStatus.APPLIED && (
                                    <button
                                        onClick={() => handleCancel(app.id, app.internship?.title || '')}
                                        className="flex items-center text-xs text-red-600 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-full transition-colors"
                                    >
                                        <TrashIcon />
                                        Batal
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-[#264E86]/80 py-8">Anda belum melamar internship apapun.</p>
            )}
        </div>
    );
};

export default StudentApplicationsPage;