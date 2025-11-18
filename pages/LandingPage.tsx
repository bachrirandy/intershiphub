
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Role, Internship } from '../types';
import InternshipCard from '../components/InternshipCard';
import InternshipDetailModal from '../components/InternshipDetailModal';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    const { openAuthModal } = useModal();
    const { user } = useAuth();
    const { internships } = useData();
    const navigate = useNavigate();
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    const latestInternships = useMemo(() => {
        return [...internships]
          .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
          .slice(0, 6);
    }, [internships]);

    const handleApply = (internship: Internship) => {
        if (!user) {
            openAuthModal({ mode: 'login', role: Role.STUDENT });
        } else if (user.role === Role.STUDENT) {
            navigate(`/student/apply/${internship.id}`);
        } else {
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
        if (user?.role === Role.STUDENT) {
            navigate('/student');
        } else if (user?.role === Role.COMPANY) {
            navigate('/company');
        } else {
            openAuthModal({ mode: 'register', role: Role.STUDENT });
        }
    };

    const handleRekrutTalentaClick = () => {
        if (user?.role === Role.COMPANY) {
            navigate('/company');
        } else if (user?.role === Role.STUDENT) {
            navigate('/student');
        } else {
            openAuthModal({ mode: 'register', role: Role.COMPANY });
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-50 pt-10 pb-20 lg:pt-20 lg:pb-28">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-light rounded-full blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-light rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-primary text-sm font-semibold mb-6 animate-fade-in">
                                <span className="flex h-2 w-2 rounded-full bg-brand-primary mr-2"></span>
                                #1 Platform Magang Indonesia
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-heading font-extrabold text-slate-900 leading-tight mb-6">
                                Mulai Karir Impianmu <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-purple">Tanpa Batas.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Temukan ribuan kesempatan magang di perusahaan top. Validasi skillmu, bangun networking, dan siap kerja lebih cepat.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button 
                                    onClick={handleCariMagangClick}
                                    className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark hover:shadow-glow hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-brand-primary/25"
                                >
                                    Cari Magang
                                </button>
                                <button 
                                    onClick={handleRekrutTalentaClick}
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300"
                                >
                                    Rekrut Talenta
                                </button>
                            </div>

                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500">
                                <div className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Terverifikasi</div>
                                <div className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Gratis Daftar</div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                                <img 
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    alt="Students working" 
                                    className="rounded-xl w-full object-cover h-[300px] lg:h-[400px]"
                                />
                                
                                {/* Floating Card 1 */}
                                <div className="absolute -left-8 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Status Lamaran</p>
                                        <p className="text-sm font-bold text-slate-900">Diterima 🎉</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                             <div className="absolute top-1/2 right-0 -mr-12 w-24 h-24 bg-brand-purple/20 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="bg-white border-y border-slate-100">
                <div className="container mx-auto px-6 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                        <div>
                            <p className="text-3xl font-heading font-bold text-brand-primary">500+</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Perusahaan Aktif</p>
                        </div>
                        <div>
                            <p className="text-3xl font-heading font-bold text-brand-primary">10k+</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Mahasiswa Terdaftar</p>
                        </div>
                         <div>
                            <p className="text-3xl font-heading font-bold text-brand-primary">1.5k</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Lowongan Tersedia</p>
                        </div>
                         <div>
                            <p className="text-3xl font-heading font-bold text-brand-primary">95%</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Tingkat Kepuasan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By (Logos) */}
            <section className="py-10 bg-slate-50/50">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Dipercaya oleh perusahaan terdepan</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Gojek_logo_2019.svg" alt="Gojek" className="h-8 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Tokopedia.svg" alt="Tokopedia" className="h-8 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Traveloka_Primary_Logo.png/800px-Traveloka_Primary_Logo.png" alt="Traveloka" className="h-8 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bukalapak.svg/2560px-Bukalapak.svg.png" alt="Bukalapak" className="h-6 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.png" alt="PLN" className="h-10 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Logo_PT_Bukit_Asam_Tbk.svg" alt="Bukit Asam" className="h-10 object-contain" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Logo_Pupuk_Sriwidjaja_Palembang.svg/1200px-Logo_Pupuk_Sriwidjaja_Palembang.svg.png" alt="Pusri" className="h-10 object-contain" />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Cara Kerja InternshipHub</h2>
                        <p className="text-slate-600 text-lg">Proses simpel untuk menghubungkanmu dengan kesempatan karir terbaik.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                        
                        {[
                            { icon: "👤", title: "Buat Akun", desc: "Lengkapi profil profesionalmu dengan mudah." },
                            { icon: "🔍", title: "Cari Lowongan", desc: "Filter berdasarkan jurusan, lokasi, dan minat." },
                            { icon: "📝", title: "Lamar Online", desc: "Kirim lamaran dan dokumen dalam satu klik." },
                            { icon: "🤝", title: "Interview & Deal", desc: "Pantau status dan dapatkan tawaran magang." }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center relative">
                                <div className="w-16 h-16 bg-brand-light/50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-inner">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Internships Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2">Lowongan Terbaru 🔥</h2>
                            <p className="text-slate-600">Kesempatan fresh yang baru saja diposting hari ini.</p>
                        </div>
                        <button
                            onClick={handleViewAllClick}
                            className="text-brand-primary font-bold hover:text-brand-dark flex items-center transition-colors"
                        >
                            Lihat Semua <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestInternships.map(internship => (
                            <InternshipCard
                                key={internship.id}
                                internship={internship}
                                onViewDetails={setSelectedInternship}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
             <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-brand-dark rounded-3xl p-8 md:p-16 relative overflow-hidden text-white text-center">
                         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         <div className="relative z-10 max-w-3xl mx-auto">
                             <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">"Berkat InternshipHub, saya mendapatkan magang di unicorn teknologi impian saya sebelum lulus kuliah."</h2>
                             <div className="flex items-center justify-center gap-4">
                                 <img src="https://i.pravatar.cc/150?u=testi" alt="Student" className="w-12 h-12 rounded-full border-2 border-white/30" />
                                 <div className="text-left">
                                     <p className="font-bold text-lg">Sarah Putri</p>
                                     <p className="text-white/70 text-sm">UI/UX Designer Intern at GoJek</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
             </section>
             
             <Footer />
            
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
