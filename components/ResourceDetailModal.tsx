import React from 'react';
import { ResourceArticle } from '../types';

interface ResourceDetailModalProps {
    article: ResourceArticle;
    onClose: () => void;
}

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ article, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 modal-backdrop-blur flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in" onClick={e => e.stopPropagation()}>
                {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-t-lg" />}
                <div className="p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{article.title}</h2>
                    <div className="prose max-w-none text-slate-600 leading-relaxed">
                        {article.content.split('\n').map((paragraph, index) => (
                           <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50/70 text-right border-t border-slate-200">
                     <button 
                        onClick={onClose} 
                        className="px-5 py-2 bg-white text-slate-800 font-semibold rounded-lg hover:bg-slate-100 border border-slate-300 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 bg-black/20 rounded-full p-1 hover:text-white hover:bg-black/40 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ResourceDetailModal;