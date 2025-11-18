import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-2xl font-heading font-bold text-slate-900 tracking-tight mb-4">
                            Internship<span className="text-brand-primary">Hub</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Platform #1 untuk menghubungkan talenta muda berbakat dengan perusahaan top di Indonesia. Bangun masa depanmu hari ini.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Untuk Mahasiswa</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-brand-primary">Cari Magang</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Buat Profil</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Tips Karir</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Event Kampus</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Untuk Perusahaan</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-brand-primary">Pasang Lowongan</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Cari Talenta</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Solusi HR</a></li>
                            <li><a href="#" className="hover:text-brand-primary">Harga</a></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-slate-900 mb-4">Hubungi Kami</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>support@internshiphub.id</li>
                            <li>+62 812 3456 7890</li>
                            <li>Jakarta Selatan, Indonesia</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} InternshipHub Indonesia. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-brand-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-primary">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;