import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ResourceArticle } from '../types';
import ResourceDetailModal from '../components/ResourceDetailModal';

const AllIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.076 3.077a33.745 33.745 0 002.122 2.122l3.076-3.077m15.482 0l3.076 3.077a33.745 33.745 0 01-2.122 2.122l-3.076-3.077m-11.318-5.842a51.348 51.348 0 00-3.076 3.077l-1.06-1.06a51.342 51.342 0 013.076-3.077l1.06 1.06z" /></svg>;
const CompanyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 7.5h18M3 12h18m-4.5 9v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>;


const ResourceCenter: React.FC = () => {
    const { articles } = useData();
    const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'STUDENT' | 'COMPANY'>('ALL');

    const filteredArticles = useMemo(() => {
        if (activeFilter === 'ALL') return articles;
        return articles.filter(article => article.category === activeFilter || article.category === 'GENERAL');
    }, [articles, activeFilter]);

    return (
        <div className="animate-fade-in-slide-up">
            <section className="bg-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-[#0074E4]">Pusat Sumber Daya</h1>
                    <p className="text-lg text-[#264E86]/80 mt-2">Kumpulan artikel, tips, dan panduan untuk membantumu sukses.</p>
                </div>
            </section>
            
            <main className="container mx-auto px-6 py-10">
                <div className="flex justify-center space-x-2 md:space-x-4 mb-10 border-b pb-4">
                    <button 
                        onClick={() => setActiveFilter('ALL')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base flex items-center justify-center ${activeFilter === 'ALL' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        <AllIcon />
                        <span>Semua</span>
                    </button>
                    <button 
                        onClick={() => setActiveFilter('STUDENT')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base flex items-center justify-center ${activeFilter === 'STUDENT' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        <StudentIcon />
                        <span>Untuk Mahasiswa</span>
                    </button>
                    <button 
                        onClick={() => setActiveFilter('COMPANY')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base flex items-center justify-center ${activeFilter === 'COMPANY' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        <CompanyIcon />
                        <span>Untuk Perusahaan</span>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map(article => (
                        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                           {article.imageUrl && (
                                <div className="h-48 overflow-hidden">
                                     <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                           )}
                           <div className="p-6 flex-grow flex flex-col">
                               <h2 className="text-xl font-bold text-[#264E86] mb-2">{article.title}</h2>
                               <p className="text-[#264E86]/80 flex-grow">{article.excerpt}</p>
                               <button 
                                    onClick={() => setSelectedArticle(article)}
                                    className="mt-4 self-start font-semibold text-[#0074E4] hover:text-[#264E86] transition-colors"
                                >
                                    Baca Selengkapnya &rarr;
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedArticle && (
                <ResourceDetailModal 
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}
        </div>
    );
};

export default ResourceCenter;
