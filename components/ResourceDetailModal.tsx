import React from 'react';
import { ResourceArticle } from '../types';

interface ResourceDetailModalProps {
    article: ResourceArticle;
    onClose: () => void;
}

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ article, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-t-lg" />}
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-[#264E86] mb-4">{article.title}</h2>
                    <div className="prose max-w-none text-[#264E86]/90 leading-relaxed">
                        {article.content.split('\n').map((paragraph, index) => (
                           <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div className="sticky bottom-0 bg-[#EFF0F4] px-6 py-3 text-right border-t">
                     <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-[#264E86] rounded-md hover:bg-gray-100 border border-gray-300"
                    >
                        Tutup
                    </button>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 bg-white/50 rounded-full p-1 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ResourceDetailModal;