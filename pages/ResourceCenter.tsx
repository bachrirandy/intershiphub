import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ResourceArticle } from '../types';
import ResourceDetailModal from '../components/ResourceDetailModal';

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
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base ${activeFilter === 'ALL' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setActiveFilter('STUDENT')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base ${activeFilter === 'STUDENT' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        Untuk Mahasiswa
                    </button>
                    <button 
                        onClick={() => setActiveFilter('COMPANY')}
                        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base ${activeFilter === 'COMPANY' ? 'bg-[#0074E4] text-white' : 'bg-white text-[#264E86] hover:bg-[#EFF0F4]'}`}
                    >
                        Untuk Perusahaan
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