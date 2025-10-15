import React, { useState } from 'react';
import { Internship } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface ApplicationFormModalProps {
    internship: Internship;
    onClose: () => void;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ internship, onClose }) => {
    const { user } = useAuth();
    const { applyForInternship, getStudentApplications } = useData();
    const { addToast } = useToast();
    const [coverLetter, setCoverLetter] = useState('');

    if (!user) return null;

    const hasApplied = getStudentApplications(user.id).some(app => app.internshipId === internship.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasApplied) {
            addToast('Anda sudah melamar untuk posisi ini.', 'error');
            return;
        }

        applyForInternship({
            internshipId: internship.id,
            studentId: user.id,
            coverLetter,
        });

        addToast('Lamaran berhasil dikirim!', 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-[#264E86]">Lamar Posisi</h2>
                    <p className="text-[#264E86]/80">{internship.title} di {internship.companyName}</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="font-semibold text-[#264E86] mb-2">Profil Anda</h3>
                            <div className="bg-[#EFF0F4] p-4 rounded-md text-sm space-y-1">
                                <p><span className="font-medium">Nama:</span> {user.name}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Jurusan:</span> {user.major || 'Belum diisi'}</p>
                                {user.cvLink ? (
                                    <a href={user.cvLink} target="_blank" rel="noopener noreferrer" className="text-[#0074E4] hover:underline">
                                        Lihat CV Terlampir
                                    </a>
                                ) : (
                                    <p className="text-red-500">Harap lengkapi link CV di profil Anda.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-[#264E86]">
                                Surat Pengantar (Opsional)
                            </label>
                            <textarea
                                id="coverLetter"
                                value={coverLetter}
                                onChange={e => setCoverLetter(e.target.value)}
                                rows={5}
                                placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 text-right space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50">
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={!user.cvLink || hasApplied}
                            className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {hasApplied ? 'Sudah Dilamar' : 'Kirim Lamaran'}
                        </button>
                    </div>
                </form>

                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ApplicationFormModal;