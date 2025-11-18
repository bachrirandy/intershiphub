import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { JobType } from '../types';

const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

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
                        isSelected ? 'bg-brand-primary text-white' : 'text-slate-700 hover:bg-slate-100'
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
                className="mt-1 relative w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-left text-slate-800"
            >
                <span>{value}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <CalendarIcon />
                </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon /></button>
                        <span className="font-semibold text-slate-700">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
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

const CompanyPostPage: React.FC = () => {
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
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Buat Lowongan Internship Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Judul Posisi</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Bidang</label>
                        <input type="text" name="field" value={formData.field} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800" placeholder="e.g., Software Engineering" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Lokasi</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Tanggal Posting</label>
                        <DatePicker value={formData.postedDate} onChange={(date) => handleDateChange('postedDate', date)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Tanggal Penutupan</label>
                        <DatePicker value={formData.closingDate} onChange={(date) => handleDateChange('closingDate', date)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tipe Pekerjaan</label>
                        <select name="jobType" value={formData.jobType} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800">
                            <option value={JobType.ONSITE}>On-site</option>
                            <option value={JobType.REMOTE}>Remote</option>
                            <option value={JobType.HYBRID}>Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Durasi</label>
                        <select name="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800">
                            <option>3 Months</option>
                            <option>6 Months</option>
                            <option>1 Year</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Requirements (pisahkan dengan koma)</label>
                    <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-white text-slate-800" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">Post Lowongan</button>
            </form>
        </div>
    );
};

export default CompanyPostPage;