import React from 'react';
import { Internship, JobType } from '../types';
import { users } from '../data/dummyData';

interface InternshipCardProps {
    internship: Internship;
    onViewDetails: (internship: Internship) => void;
    onApply: (internship: Internship) => void;
}

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;

const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onViewDetails, onApply }) => {
    const company = users.find(u => u.id === internship.companyId);

    // Determine color accent based on job type using strictly new brand colors
    const getTypeColor = (type: JobType) => {
        switch(type) {
            // Use brand-dark for Remote
            case JobType.REMOTE: return 'bg-indigo-50 text-brand-dark border-indigo-100';
            // Use brand-teal for Hybrid
            case JobType.HYBRID: return 'bg-teal-50 text-teal-700 border-teal-100';
            // Use brand-primary for Onsite
            default: return 'bg-blue-50 text-brand-primary border-blue-100';
        }
    };

    const getStripColor = (type: JobType) => {
        switch(type) {
            case JobType.REMOTE: return 'bg-brand-dark';
            case JobType.HYBRID: return 'bg-brand-teal';
            default: return 'bg-brand-primary';
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col transform hover:-translate-y-1 overflow-hidden">
            {/* Top Color Strip */}
            <div className={`h-1.5 w-full ${getStripColor(internship.jobType)}`}></div>
            
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
                         {company?.logoUrl ? (
                            <img src={company.logoUrl} alt={`${internship.companyName} logo`} className="w-full h-full object-contain p-1" />
                        ) : (
                            <span className="text-xl font-bold text-slate-400">{internship.companyName.charAt(0)}</span>
                        )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getTypeColor(internship.jobType)}`}>
                        {internship.jobType}
                    </span>
                </div>

                <div className="flex-grow">
                    <h3 className="text-lg font-heading font-bold text-slate-900 mb-1 group-hover:text-brand-primary transition-colors line-clamp-1" title={internship.title}>
                        {internship.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">{internship.companyName}</p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                            <BriefcaseIcon /> 
                            <span className="truncate">{internship.field}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <LocationIcon /> 
                            <span className="truncate">{internship.location}</span>
                        </div>
                         <div className="flex items-center text-sm text-slate-600">
                            <ClockIcon /> 
                            <span className="truncate">{internship.duration}</span>
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 mt-auto">
                     <button onClick={() => onViewDetails(internship)} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-brand-primary transition-colors">
                        Detail
                    </button>
                    <button onClick={() => onApply(internship)} className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-brand-primary hover:shadow-glow transition-all">
                        Lamar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternshipCard;