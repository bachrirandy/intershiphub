import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Internship, ApplicationStatus, User, Role, JobType } from '../types';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';
import Calendar from '../components/Calendar';

// Icons
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
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#264E86]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>


const ProfilePage = ({ user, updateUser }: {user: User, updateUser: (profile: Partial<User>) => void}) => {
    const [name, setName] = useState(user.name);
    const [field, setField] = useState(user.field || '');
    const [description, setDescription] = useState(user.description || '');
    const [logoUrl, setLogoUrl] = useState(user.logoUrl || '');
    const { addToast } = useToast();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUser({ name, field, description, logoUrl });
        addToast('Profil perusahaan berhasil diperbarui!', 'success');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264E86]">Profil Perusahaan</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Nama Perusahaan</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-[#264E86]">Bidang Industri</label>
                    <input type="text" value={field} onChange={e => setField(e.target.value)} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Logo Perusahaan</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-md border border-[#264E86]/20 flex items-center justify-center bg-[#EFF0F4]">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain rounded-md" />
                            ) : (
                                <span className="text-xs text-[#264E86]/60">Pratinjau</span>
                            )}
                        </div>
                        <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-[#264E86]/20 rounded-md shadow-sm text-sm leading-4 font-medium text-[#264E86] hover:bg-[#EFF0F4] flex items-center">
                            <UploadIcon />
                            <span>Unggah File</span>
                            <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*, image/svg+xml" />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Deskripsi Perusahaan</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-[#0074E4] focus:border-[#0074E4]" />
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86]">Simpan Perubahan</button>
            </div>
        </div>
    );
};


const DatePicker: React.FC<{ value: string; onChange: (date: string) => void }> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value || new Date()));
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeMonth = (amount: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(newDate.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const renderCalendarGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const selectedDate = new Date(value);

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`blank-${i}`} className="w-10 h-10"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
            days.push(
                <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                        isSelected ? 'bg-[#0074E4] text-white' : 'text-[#264E86] hover:bg-[#EFF0F4]'
                    }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 relative w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-left text-[#264E86]"
            >
                <span>{value}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <CalendarIcon />
                </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-4 border border-[#264E86]/10">
                    <div className="flex justify-between items-center mb-2">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-[#EFF0F4]"><ChevronLeftIcon /></button>
                        <span className="font-semibold text-[#264E86]">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-[#EFF0F4]"><ChevronRightIcon /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#264E86]/70 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 place-items-center">
                        {renderCalendarGrid()}
                    </div>
                </div>
            )}
        </div>
    );
};

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

const PostInternshipPage = () => {
    const { addInternship } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        location: '', 
        duration: '3 Months', 
        requirements: '', 
        field: '', 
        jobType: JobType.ONSITE,
        postedDate: new Date().toISOString().split('T')[0],
        closingDate: getTomorrow()
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (field: 'postedDate' | 'closingDate', date: string) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (new Date(formData.closingDate) <= new Date(formData.postedDate)) {
            addToast('Tanggal penutupan harus setelah tanggal posting.', 'error');
            return;
        }
        const newInternship = {
            ...formData,
            jobType: formData.jobType as JobType,
            requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
            companyId: user.id,
        };
        addInternship(newInternship, user.id);
        addToast('Lowongan internship berhasil dibuat!', 'success');
        setFormData({ 
            title: '', description: '', location: '', duration: '3 Months', requirements: '', field: '', jobType: JobType.ONSITE, 
            postedDate: new Date().toISOString().split('T')[0],
            closingDate: getTomorrow()
        });
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264E86]">Buat Lowongan Internship Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Judul Posisi</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Bidang</label>
                        <input type="text" name="field" value={formData.field} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]" placeholder="e.g., Software Engineering" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Lokasi</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[#264E86]">Tanggal Posting</label>
                        <DatePicker value={formData.postedDate} onChange={(date) => handleDateChange('postedDate', date)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[#264E86]">Tanggal Penutupan</label>
                        <DatePicker value={formData.closingDate} onChange={(date) => handleDateChange('closingDate', date)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Tipe Pekerjaan</label>
                        <select name="jobType" value={formData.jobType} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]">
                            <option value={JobType.ONSITE}>On-site</option>
                            <option value={JobType.REMOTE}>Remote</option>
                            <option value={JobType.HYBRID}>Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Durasi</label>
                        <select name="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]">
                            <option>3 Months</option>
                            <option>6 Months</option>
                            <option>1 Year</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Requirements (pisahkan dengan koma)</label>
                    <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="mt-1 block w-full border border-[#264E86]/20 rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86]" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86]">Post Lowongan</button>
            </form>
        </div>
    );
};

const ListingsPage = () => {
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

const CalendarPage = () => {
    const { user } = useAuth();
    const { internships } = useData();
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    const myInternships = useMemo(() => {
        return internships.filter(i => i.companyId === user?.id);
    }, [internships, user]);

    return (
        <>
            <Calendar 
                internships={myInternships} 
                onEventClick={(internship) => setSelectedInternship(internship)}
            />
            {selectedInternship && (
                <InternshipDetailModal 
                    internship={selectedInternship} 
                    onClose={() => setSelectedInternship(null)} 
                />
            )}
        </>
    );
};


const CompanyDashboard: React.FC = () => {
    const { user, updateCompanyProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('listings');

    if (!user) return null;

    return (
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <h1 className="text-3xl font-bold text-[#264E86] mb-2">Dashboard Perusahaan: {user.name}</h1>
            <p className="text-[#264E86]/80 mb-6">Kelola lowongan internship dan kandidat Anda.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar role={Role.COMPANY} activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="flex-1">
                    {activeTab === 'listings' && <ListingsPage />}
                    {activeTab === 'post' && <PostInternshipPage />}
                    {activeTab === 'calendar' && <CalendarPage />}
                    {activeTab === 'profile' && <ProfilePage user={user} updateUser={updateCompanyProfile} />}
                </main>
            </div>
        </div>
    );
};

export default CompanyDashboard;