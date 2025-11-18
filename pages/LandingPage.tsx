import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Role, Internship } from '../types';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';

const LandingPage: React.FC = () => {
    const { openAuthModal } = useModal();
    const { user } = useAuth();
    const { internships } = useData();
    const navigate = useNavigate();

    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    const latestInternships = useMemo(() => {
        return internships.slice(0, 6);
    }, [internships]);

    const handleApply = (internship: Internship) => {
        if (!user) {
            openAuthModal({ mode: 'login', role: Role.STUDENT });
        } else if (user.role === Role.STUDENT) {
            navigate(`/student/apply/${internship.id}`);
        } else {
             // Handle case where a company user might click apply
             navigate('/company');
        }
    };
    
    const handleViewAllClick = () => {
        if (user && user.role === Role.STUDENT) {
            navigate('/student');
        } else {
            openAuthModal({ mode: 'login', role: Role.STUDENT });
        }
    };

    const handleCariMagangClick = () => {
        if (user) {
            // If logged in, go to the appropriate dashboard
            if (user.role === Role.STUDENT) {
                navigate('/student');
            } else {
                // Non-students (e.g., companies) also get redirected to their dashboard
                navigate('/company');
            }
        } else {
            // If not logged in, open registration modal for students
            openAuthModal({ mode: 'register', role: Role.STUDENT });
        }
    };

    const handleRekrutTalentaClick = () => {
        if (user) {
            // If logged in, go to the appropriate dashboard
            if (user.role === Role.COMPANY) {
                navigate('/company');
            } else {
                // Non-companies (e.g., students) also get redirected to their dashboard
                navigate('/student');
            }
        } else {
            // If not logged in, open registration modal for companies
            openAuthModal({ mode: 'register', role: Role.COMPANY });
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-[#264E86] mb-4">
                        Temukan Peluang Magang Impianmu
                    </h1>
                    <p className="text-xl text-[#264E86]/80 mb-8 max-w-3xl mx-auto">
                        InternshipHub menghubungkan mahasiswa berbakat dengan perusahaan inovatif untuk pengalaman magang yang tak ternilai.
                    </p>
                    <div className="space-x-4">
                        <button 
                            onClick={handleCariMagangClick}
                            className="bg-[#0074E4] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#264E86] transition-transform transform hover:scale-105"
                        >
                            Cari Magang
                        </button>
                        <button 
                            onClick={handleRekrutTalentaClick}
                            className="bg-transparent text-[#0074E4] font-bold py-3 px-8 rounded-lg border-2 border-[#0074E4] hover:bg-[#0074E4]/10 transition-transform transform hover:scale-105"
                        >
                            Rekrut Talenta
                        </button>
                    </div>
                </div>
            </section>

            {/* Latest Internships Section */}
            <section className="py-16 bg-[#EFF0F4]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#264E86] mb-12">Lowongan Terbaru</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestInternships.map(internship => (
                            <InternshipCard
                                key={internship.id}
                                internship={internship}
                                onViewDetails={setSelectedInternship}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button
                            onClick={handleViewAllClick}
                            className="bg-white text-[#264E86] font-bold py-3 px-8 rounded-lg border border-[#264E86]/20 hover:bg-[#74DBEF]/50 transition-colors shadow-sm"
                        >
                            Lihat Semua Lowongan
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-[#264E86] mb-12">Mengapa Memilih InternshipHub?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-[#EFF0F4] p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-[#0074E4] mb-2">Untuk Mahasiswa</h3>
                            <p className="text-[#264E86]/80">
                                Temukan ribuan lowongan magang yang sesuai dengan jurusan dan minatmu. Bangun profil profesional dan lamar dengan mudah.
                            </p>
                        </div>
                        <div className="bg-[#EFF0F4] p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-[#0074E4] mb-2">Untuk Perusahaan</h3>
                            <p className="text-[#264E86]/80">
                                Dapatkan akses ke talenta-talenta muda terbaik dari berbagai universitas. Kelola proses rekrutmen dengan efisien.
                            </p>
                        </div>
                        <div className="bg-[#EFF0F4] p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-[#0074E4] mb-2">Terpercaya & Aman</h3>
                            <p className="text-[#264E86]/80">
                                Semua perusahaan dan lowongan telah kami verifikasi untuk memastikan pengalaman yang aman dan berkualitas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
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
