import React, { ReactNode } from 'react';

interface ConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, title, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                </div>

                <div className="p-6">
                    {children}
                </div>

                <div className="px-6 py-4 bg-gray-50 text-right space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50">
                        Batalkan
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark">
                        Konfirmasi & Kirim
                    </button>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;