import React, { useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Role, Internship } from '../types';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';


const LandingPage: React.FC = () => {
    const { openAuthModal } = useModal();
    const { internships, applyForInternship } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    const handleStudentRegister = () => {
        openAuthModal({ mode: 'register', role: Role.STUDENT });
    };

    const handleCompanyRegister = () => {
        openAuthModal({ mode: 'register', role: Role.COMPANY });
    };

    const handleApply = (internshipId: number) => {
        if (!user) {
            openAuthModal({ mode: 'login', role: Role.STUDENT });
            return;
        }
        if (user.role === Role.STUDENT) {
            const success = applyForInternship(user.id, internshipId);
            if (success) {
                addToast('Lamaran berhasil dikirim!', 'success');
            } else {
                addToast('Anda sudah pernah melamar di posisi ini.', 'error');
            }
        } else {
            addToast('Hanya mahasiswa yang dapat melamar.', 'error');
        }
    };

    return (
        <div className="animate-fade-in-slide-up">
            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-[#0074E4] mb-4">
                        Temukan Internship Impianmu
                    </h1>
                    <p className="text-lg text-[#264E86]/80 mb-8 max-w-3xl mx-auto">
                        InternshipHub adalah jembatan antara mahasiswa berbakat dengan perusahaan terkemuka. Mulai karirmu dari sini.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={handleStudentRegister} 
                            className="px-8 py-3 bg-[#0074E4] text-white font-bold rounded-lg hover:bg-[#264E86] transition-colors"
                        >
                            Cari Internship
                        </button>
                        <button 
                            onClick={handleCompanyRegister} 
                            className="px-8 py-3 bg-transparent border-2 border-[#0074E4] text-[#0074E4] font-bold rounded-lg hover:bg-[#0074E4]/10 transition-colors"
                        >
                            Posting Lowongan
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Internships */}
            <section className="py-16 bg-[#EFF0F4]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#264E86] mb-10">
                        Lowongan Terbaru
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internships.slice(0, 6).map(internship => (
                            <InternshipCard 
                                key={internship.id} 
                                internship={internship}
                                onViewDetail={setSelectedInternship}
                                onApply={handleApply}
                                userRole={user?.role || null}
                            />
                        ))}
                    </div>
                    {internships.length === 0 && (
                        <p className="text-center text-[#264E86]/75">Saat ini belum ada lowongan tersedia.</p>
                    )}
                </div>
            </section>
            
            {/* How it works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#264E86] mb-12">
                        Bagaimana Cara Kerjanya?
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                        {/* For Students */}
                        <div className="text-center max-w-sm">
                            <div className="bg-[#74DBEF]/30 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
                               <p className="text-4xl">👨‍🎓</p>
                            </div>
                            <h3 className="text-2xl font-bold text-[#0074E4] mb-2">Untuk Mahasiswa</h3>
                            <p className="text-[#264E86]/80">
                                Buat profil, unggah CV, dan jelajahi ratusan lowongan magang. Lamar dengan sekali klik dan pantau status lamaranmu.
                            </p>
                        </div>

                        {/* For Companies */}
                        <div className="text-center max-w-sm">
                             <div className="bg-[#74DBEF]/30 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
                                <p className="text-4xl">🏢</p>
                            </div>
                            <h3 className="text-2xl font-bold text-[#0074E4] mb-2">Untuk Perusahaan</h3>
                            <p className="text-[#264E86]/80">
                                Posting lowongan magang dengan mudah, kelola kandidat yang masuk, dan temukan talenta terbaik untuk tim Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#264E86] text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} InternshipHub. All rights reserved.</p>
                </div>
            </footer>

            {selectedInternship && (
                <InternshipDetailModal 
                    internship={selectedInternship} 
                    onClose={() => setSelectedInternship(null)} 
                />
            )}
        </div>
    );
};

export default LandingPage;