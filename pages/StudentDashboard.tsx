import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Internship, ApplicationStatus, User, Role, JobType } from '../types';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';
import Calendar from '../components/Calendar';
import InternshipCard from '../components/InternshipCard';

// Icons
const statusColor = {
    [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-800',
    [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
    [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800'
};
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


const ProfilePage = ({ user, updateUser }: {user: User, updateUser: (profile: Partial<User>) => void}) => {
    const [major, setMajor] = useState(user.major || '');
    const [skills, setSkills] = useState((user.skills || []).join(', '));
    const [cvLink, setCvLink] = useState(user.cvLink || '');
    const { addToast } = useToast();

    const handleSave = () => {
        updateUser({ major, skills: skills.split(',').map(s => s.trim()).filter(Boolean), cvLink });
        addToast('Profil berhasil diperbarui!', 'success');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264E86]">Profil Saya</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Jurusan</label>
                    <input type="text" value={major} onChange={e => setMajor(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Keahlian (pisahkan dengan koma)</label>
                    <input type="text" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Link CV (Google Drive, LinkedIn, etc)</label>
                    <input type="url" value={cvLink} onChange={e => setCvLink(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86]">Simpan Perubahan</button>
            </div>
        </div>
    );
};

// Custom Dropdown Component
const FilterDropdown: React.FC<{
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}> = ({ label, options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-left focus:outline-none focus:ring-1 focus:ring-[#0074E4] focus:border-[#0074E4] flex items-center justify-between"
            >
                <span className="text-[#264E86] truncate">{selectedValue || label}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
                    <li
                        onClick={() => handleSelect('')}
                        className="text-[#264E86] cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#EFF0F4]"
                    >
                        {label}
                    </li>
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="text-[#264E86] cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#EFF0F4]"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const SearchPage = ({ setSelectedInternship }: {setSelectedInternship: (internship: Internship) => void}) => {
    const { internships, applyForInternship, getApplicationsForStudent } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    
    // States for new filters
    const [fieldFilter, setFieldFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    
    const myApplications = useMemo(() => {
        if (!user) return [];
        return getApplicationsForStudent(user.id);
    }, [user, getApplicationsForStudent]);

    const appliedInternshipIds = useMemo(() => {
        return new Set(myApplications.map(app => app.internshipId));
    }, [myApplications]);

    const handleApply = (internshipId: number) => {
        if (!user) return;
        const success = applyForInternship(user.id, internshipId);
        if (success) {
            addToast('Lamaran berhasil dikirim!', 'success');
        } else {
            addToast('Anda sudah pernah melamar di posisi ini.', 'error');
        }
    };
    
    const filteredInternships = useMemo(() => {
        return internships.filter(internship => {
            const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  internship.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesField = fieldFilter ? internship.field === fieldFilter : true;
            const matchesLocation = locationFilter ? internship.location === locationFilter : true;
            const matchesDuration = durationFilter ? internship.duration === durationFilter : true;
            const matchesJobType = jobTypeFilter ? internship.jobType === jobTypeFilter : true;
            return matchesSearch && matchesField && matchesLocation && matchesDuration && matchesJobType;
        });
    }, [internships, searchTerm, fieldFilter, locationFilter, durationFilter, jobTypeFilter]);
    
    // Memoized options for dropdowns
    const uniqueFields = useMemo(() => [...new Set(internships.map(i => i.field))], [internships]);
    const uniqueLocations = useMemo(() => [...new Set(internships.map(i => i.location))], [internships]);
    const uniqueDurations = useMemo(() => [...new Set(internships.map(i => i.duration))], [internships]);
    const jobTypeOptions = Object.values(JobType);


    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                 <input
                    type="text"
                    placeholder="Cari posisi atau perusahaan..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FilterDropdown label="Semua Bidang" options={uniqueFields} selectedValue={fieldFilter} onSelect={setFieldFilter} />
                    <FilterDropdown label="Semua Lokasi" options={uniqueLocations} selectedValue={locationFilter} onSelect={setLocationFilter} />
                    <FilterDropdown label="Semua Durasi" options={uniqueDurations} selectedValue={durationFilter} onSelect={setDurationFilter} />
                    <FilterDropdown label="Semua Tipe" options={jobTypeOptions} selectedValue={jobTypeFilter} onSelect={setJobTypeFilter} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.length > 0 ? filteredInternships.map(internship => (
                    <InternshipCard 
                        key={internship.id} 
                        internship={internship} 
                        onApply={handleApply} 
                        onViewDetail={setSelectedInternship}
                        isApplied={appliedInternshipIds.has(internship.id)}
                        userRole={user?.role || null}
                    />
                )) : (
                    <p className="col-span-full text-center text-[#264E86]/75">Tidak ada lowongan yang cocok dengan kriteria pencarian Anda.</p>
                )}
            </div>
        </div>
    );
};

const ApplicationsPage = ({ setSelectedInternship }: {setSelectedInternship: (internship: Internship) => void}) => {
    const { getApplicationsForStudent } = useData();
    const { user } = useAuth();
    
    const myApplications = useMemo(() => {
        if (!user) return [];
        return getApplicationsForStudent(user.id);
    }, [user, getApplicationsForStudent]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264E86]">Lamaran Saya</h2>
            <div className="space-y-4">
                {myApplications.length > 0 ? myApplications.map(app => (
                    app.internship && (
                        <div key={app.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-[#264E86]">{app.internship.title}</h3>
                                <p className="text-sm text-[#264E86]/80">{app.internship.companyName}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor[app.status]}`}>{app.status}</span>
                                <button onClick={() => setSelectedInternship(app.internship!)} className="px-3 py-1 text-sm font-medium text-[#0074E4] bg-white rounded-md border border-[#0074E4] hover:bg-[#EFF0F4]">
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    )
                )) : (
                    <p className="text-[#264E86]/75">Anda belum pernah melamar internship.</p>
                )}
            </div>
        </div>
    );
};

const CalendarPage = ({ setSelectedInternship }: {setSelectedInternship: (internship: Internship) => void}) => {
    const { internships } = useData();
    return <Calendar internships={internships} onEventClick={setSelectedInternship} />;
};


const StudentDashboard: React.FC = () => {
    const { user, updateStudentProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('search');
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    if (!user) return null;

    return (
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <h1 className="text-3xl font-bold text-[#264E86] mb-2">Selamat Datang, {user.name}</h1>
            <p className="text-[#264E86]/80 mb-6">Temukan kesempatan magang terbaik untuk memulai karirmu.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.STUDENT} activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1">
                    {activeTab === 'search' && <SearchPage setSelectedInternship={setSelectedInternship} />}
                    {activeTab === 'applications' && <ApplicationsPage setSelectedInternship={setSelectedInternship} />}
                    {activeTab === 'calendar' && <CalendarPage setSelectedInternship={setSelectedInternship} />}
                    {activeTab === 'profile' && <ProfilePage user={user} updateUser={updateStudentProfile} />}
                </main>
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

export default StudentDashboard;