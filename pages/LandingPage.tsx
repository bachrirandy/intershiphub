import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { Role } from '../types';

const LandingPage: React.FC = () => {
    const { openAuthModal } = useModal();

    const handleOpenModal = (mode: 'login' | 'register', role: Role) => {
        openAuthModal({ mode, role });
    };

    return (
        <>
            <div className="bg-white relative z-10">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
                        Temukan Peluang Internship Impianmu
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Internship Hub menghubungkan mahasiswa berbakat dengan perusahaan inovatif. Mulai karirmu sekarang.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => handleOpenModal('login', Role.STUDENT)}
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
                        >
                            Cari Internship
                        </button>
                        <button 
                            onClick={() => handleOpenModal('login', Role.COMPANY)}
                            className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-transform transform hover:scale-105"
                        >
                            Post Internship
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Kenapa Memilih Kami?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Untuk Mahasiswa</h3>
                            <p className="text-gray-600">Akses ribuan lowongan magang, bangun profil profesional, dan lacak status lamaranmu dengan mudah.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Untuk Perusahaan</h3>
                            <p className="text-gray-600">Posting lowongan magang, temukan kandidat terbaik, dan kelola proses rekrutmen secara efisien.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Proses Mudah</h3>
                            <p className="text-gray-600">Platform yang intuitif dan mudah digunakan untuk semua kalangan, dari pendaftaran hingga penerimaan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;