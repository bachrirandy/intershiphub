import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ApplicationStatus } from '../types';

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

const StudentApplicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { getStudentApplications } = useData();

    const myApplications = useMemo(() => {
        if (!user) return [];
        return getStudentApplications(user.id);
    }, [user, getStudentApplications]);

    if (!user) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#264E86]">Lamaran Saya</h2>
            {myApplications.length > 0 ? (
                <div className="space-y-4">
                    {myApplications.map(app => (
                        <div key={app.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center bg-[#EFF0F4]/50">
                            <div>
                                <h3 className="font-bold text-[#264E86]">{app.internship?.title}</h3>
                                <p className="text-sm text-[#264E86]/80">{app.internship?.companyName}</p>
                                <p className="text-xs text-[#264E86]/60 mt-1">
                                    Dilamar pada: {new Date(app.applicationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <StatusBadge status={app.status} />
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
