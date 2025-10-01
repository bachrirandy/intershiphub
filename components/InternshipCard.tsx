import React from 'react';
import { Internship, Role } from '../types';
import { users } from '../data/dummyData';

// Icons
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/75" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/75" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/75" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;

interface InternshipCardProps {
    internship: Internship;
    onViewDetail: (internship: Internship) => void;
    onApply: (internshipId: number) => void;
    isApplied?: boolean;
    userRole?: Role | null;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onViewDetail, onApply, isApplied = false, userRole = null }) => {
    const company = users.find(u => u.id === internship.companyId);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-transparent hover:border-[#0074E4] transition-all duration-300 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-start space-x-4 mb-3">
                    {company?.logoUrl ? (
                        <img src={company.logoUrl} alt={`${internship.companyName} logo`} className="w-14 h-14 rounded-md object-contain border p-1 bg-white" />
                    ) : (
                        <div className="w-14 h-14 rounded-md bg-[#EFF0F4] flex items-center justify-center font-bold text-[#0074E4] text-xl">
                            {internship.companyName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-bold text-[#264E86] leading-tight">{internship.title}</h3>
                        <p className="text-md text-[#264E86]/80 font-semibold">{internship.companyName}</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 text-sm text-[#264E86]/75 mb-4">
                    <div className="flex items-center"><LocationIcon /> {internship.location}</div>
                    <div className="flex items-center"><ClockIcon /> {internship.duration}</div>
                    <div className="flex items-center"><BriefcaseIcon /> {internship.field}</div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => onViewDetail(internship)} className="px-4 py-2 text-sm font-medium text-[#0074E4] bg-white rounded-md border border-[#0074E4] hover:bg-[#EFF0F4] transition-colors">
                    Detail
                </button>
                <button 
                    onClick={() => onApply(internship.id)} 
                    disabled={isApplied || userRole === Role.COMPANY}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#0074E4] rounded-md hover:bg-[#264E86] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isApplied ? 'Sudah Dilamar' : 'Lamar Sekarang'}
                </button>
            </div>
        </div>
    );
};

export default InternshipCard;