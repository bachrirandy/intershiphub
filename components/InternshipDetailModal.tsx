import React from 'react';
import { Internship, User } from '../types';
import { users } from '../data/dummyData';

interface InternshipDetailModalProps {
    internship: Internship;
    onClose: () => void;
}

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-[#264E86]/60"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375-.375z" /></svg>;
const JobTypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const CalendarDaysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-[#264E86]/60"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;


const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({ internship, onClose }) => {
    const company = users.find(u => u.id === internship.companyId);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                        {company?.logoUrl ? (
                            <img src={company.logoUrl} alt={`${internship.companyName} logo`} className="w-16 h-16 rounded-lg object-contain border p-1 bg-white" />
                        ) : (
                             <div className="w-16 h-16 rounded-lg bg-[#EFF0F4] flex items-center justify-center font-bold text-[#0074E4] text-2xl">
                                {internship.companyName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-[#264E86]">{internship.title}</h2>
                            <p className="text-md text-[#264E86]/80">{internship.companyName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#264E86]/80 mb-6 pb-6 border-b">
                        <div className="flex items-center"><BriefcaseIcon /> {internship.field}</div>
                        <div className="flex items-center"><LocationIcon /> {internship.location}</div>
                        <div className="flex items-center"><ClockIcon /> {internship.duration}</div>
                        <div className="flex items-center"><JobTypeIcon /> {internship.jobType}</div>
                    </div>

                     <div className="mb-6 bg-[#EFF0F4] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2 flex items-center"><CalendarDaysIcon /> Periode Lamaran</h3>
                        <p className="text-[#264E86]/80">Dibuka: <span className="font-medium">{formatDate(internship.postedDate)}</span></p>
                        <p className="text-[#264E86]/80">Ditutup: <span className="font-medium">{formatDate(internship.closingDate)}</span></p>
                    </div>

                    {company?.description && (
                         <div className="mb-6">
                            <h3 className="text-lg font-semibold text-[#264E86] mb-2 flex items-center"><BuildingOfficeIcon /> Tentang Perusahaan</h3>
                            <p className="text-[#264E86]/80 leading-relaxed">{company.description}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2">Deskripsi Pekerjaan</h3>
                        <p className="text-[#264E86]/80 leading-relaxed">{internship.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2">Requirements</h3>
                        <ul className="list-disc list-inside text-[#264E86]/80 space-y-1">
                            {internship.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-[#EFF0F4] px-6 py-3 text-right">
                     <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-[#264E86] rounded-md hover:bg-[#74DBEF]/50 border border-[#264E86]/20"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetailModal;