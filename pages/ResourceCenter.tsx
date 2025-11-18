import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ResourceArticle } from '../types';
import ResourceDetailModal from '../components/ResourceDetailModal';
import Footer from '../components/Footer';

const AllIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.076 3.077a33.745 33.745 0 002.122 2.122l3.076-3.077m15.482 0l3.076 3.077a33.745 33.745 0 01-2.122 2.122l-3.076-3.077m-11.318-5.842a51.348 51.348 0 00-3.076 3.077l-1.06-1.06a51.342 51.342 0 013.076-3.077l1.06 1.06z" /></svg>;
const CompanyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 7.5h18M3 12h18m-4.5 9v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>;


const ResourceCenter: React.FC = () => {
    const { articles } = useData();
    const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'STUDENT' | 'COMPANY'>('ALL');

    const filteredArticles = useMemo(() => {
        if (activeFilter === 'ALL') return articles;
        return articles.filter(article => article.category === activeFilter || article.category === 'GENERAL');
    }, [articles, activeFilter]);

    const featuredArticle = articles[0];

    return (
        <div className="animate-fade-in-slide-up">
            {/* Header */}
            <section className="bg-white border-b border-slate-200 pt-12 pb-16">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
                        Internship<span className="text-brand-primary">Hub</span> Blog
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Wawasan terbaru seputar karir, tips magang, dan panduan rekrutmen untuk mahasiswa dan perusahaan.
                    </p>
                </div>
            </section>
            
            <main className="container mx-auto px-6 py-12">
                {/* Featured Article (Hero) */}
                {activeFilter === 'ALL' && featuredArticle && (
                    <div 
                        onClick={() => setSelectedArticle(featuredArticle)}
                        className="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden mb-16 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >
                        <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-brand-primary text-white`}>
                                 Featured
                             </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">{featuredArticle.title}</h2>
                            <p className="text-gray-200 text-lg line-clamp-2">{featuredArticle.excerpt}</p>
                        </div>
                    </div>
                )}

                {/* Filter & Grid */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 md:mb-0">Artikel Terbaru</h2>
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">Filter:</span>
                        {['ALL', 'STUDENT', 'COMPANY'].map((filter) => (
                            <button 
                                key={filter}
                                onClick={() => setActiveFilter(filter as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center ${activeFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                {filter === 'ALL' && <AllIcon />}
                                {filter === 'STUDENT' && <StudentIcon />}
                                {filter === 'COMPANY' && <CompanyIcon />}
                                {filter === 'ALL' ? 'Semua' : filter === 'STUDENT' ? 'Mahasiswa' : 'Perusahaan'}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map(article => (
                        <div key={article.id} onClick={() => setSelectedArticle(article)} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full">
                           {article.imageUrl && (
                                <div className="h-48 overflow-hidden relative">
                                     <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                     <div className="absolute top-4 left-4">
                                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 shadow-sm ${article.category === 'STUDENT' ? 'text-blue-700' : article.category === 'COMPANY' ? 'text-teal-700' : 'text-gray-700'}`}>
                                             {article.category === 'STUDENT' ? 'Mahasiswa' : article.category === 'COMPANY' ? 'Perusahaan' : 'Umum'}
                                         </span>
                                     </div>
                                </div>
                           )}
                           <div className="p-6 flex-grow flex flex-col">
                               <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">{article.title}</h3>
                               <p className="text-slate-500 flex-grow line-clamp-3 mb-4 text-sm leading-relaxed">{article.excerpt}</p>
                               <span className="text-sm font-bold text-brand-primary flex items-center group-hover:underline">
                                    Baca Selengkapnya <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                           </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />

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