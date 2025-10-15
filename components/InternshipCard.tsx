import React from 'react';
import { Internship } from '../types';
import { users } from '../data/dummyData';

interface InternshipCardProps {
    internship: Internship;
    onViewDetails: (internship: Internship) => void;
    onApply: (internship: Internship) => void;
}

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onViewDetails, onApply }) => {
    const company = users.find(u => u.id === internship.companyId);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0074E4]">{internship.companyName}</p>
                        <h3 className="text-lg font-bold text-[#264E86] mt-1">{internship.title}</h3>
                    </div>
                    <div className="w-12 h-12 flex-shrink-0 bg-[#EFF0F4] rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 ml-4">
                        {company?.logoUrl ? (
                            <img src={company.logoUrl} alt={`${internship.companyName} logo`} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-xl font-bold text-[#0074E4]">{internship.companyName.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center text-xs text-[#264E86]/80 gap-x-3 gap-y-1 mb-3">
                    <span className="flex items-center"><BriefcaseIcon /> {internship.field}</span>
                    <span className="flex items-center"><LocationIcon /> {internship.location}</span>
                    <span className="flex items-center"><ClockIcon /> {internship.duration}</span>
                </div>
                <p className="text-sm text-[#264E86]/80 mt-3 line-clamp-2">
                    {internship.description}
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button onClick={() => onViewDetails(internship)} className="text-sm font-semibold text-[#264E86] hover:text-[#0074E4] transition-colors">
                    Lihat Detail
                </button>
                <button onClick={() => onApply(internship)} className="px-4 py-2 bg-[#0074E4] text-white text-sm font-bold rounded-md hover:bg-[#264E86] transition-colors">
                    Lamar
                </button>
            </div>
        </div>
    );
};

export default InternshipCard;