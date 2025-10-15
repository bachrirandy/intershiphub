import React, { useState, useMemo } from 'react';
import { Internship, User, Review, Role } from '../types';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { users } from '../data/dummyData';

interface InternshipDetailModalProps {
    internship: Internship;
    onClose: () => void;
}

// Icons
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 4V3a1 1 0 112 0v1H8z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-[#264E86]/60"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375.375z" /></svg>;
const JobTypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/60" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const CalendarDaysIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-[#264E86]/60"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;
const StarIcon = ({ filled, onClick }: { filled: boolean; onClick?: () => void }) => (
    <svg onClick={onClick} className={`h-6 w-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);
const ChatBubbleLeftRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-[#264E86]/60"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.125 1.125 0 00-1.59 0L13.5 16.5v-4.286c0-.97.616-1.813 1.5-2.097m6.75-6.194c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.125 1.125 0 00-1.59 0L13.5 16.5V7.875c0-.97.616-1.813 1.5-2.097M3.75 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.125 1.125 0 00-1.59 0L.75 16.5v-4.286c0-.97.616-1.813 1.5-2.097" /></svg>;


const StarRating = ({ rating, setRating }: { rating: number, setRating?: (r: number) => void }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
            <StarIcon 
                key={star} 
                filled={star <= rating} 
                onClick={setRating ? () => setRating(star) : undefined} 
            />
        ))}
    </div>
);

const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({ internship, onClose }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const { getReviewsForCompany, addReview } = useData();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    const company = users.find(u => u.id === internship.companyId);

    const companyReviews = useMemo(() => {
        return getReviewsForCompany(internship.companyId);
    }, [internship.companyId, getReviewsForCompany]);

    const averageRating = useMemo(() => {
        if (companyReviews.length === 0) return 0;
        const total = companyReviews.reduce((acc, review) => acc + review.rating, 0);
        return total / companyReviews.length;
    }, [companyReviews]);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0 || newComment.trim() === '') {
            addToast('Rating dan komentar tidak boleh kosong.', 'error');
            return;
        }
        if (!user) return;

        addReview({
            companyId: internship.companyId,
            studentId: user.id,
            studentName: user.name,
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString().split('T')[0]
        });

        addToast('Ulasan Anda berhasil dikirim!', 'success');
        setShowReviewForm(false);
        setNewRating(0);
        setNewComment("");
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                        {company?.logoUrl ? (
                            <img src={company.logoUrl} alt={`${internship.companyName} logo`} className="w-16 h-16 rounded-lg object-contain border p-1 bg-white" />
                        ) : (
                             <div className="w-16 h-16 rounded-lg bg-[#EFF0F4] flex items-center justify-center font-bold text-[#0074E4] text-2xl">
                                {internship.companyName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-[#264E86]">{internship.title}</h2>
                            <p className="text-md text-[#264E86]/80">{internship.companyName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#264E86]/80 mb-6 pb-6 border-b">
                        <div className="flex items-center"><BriefcaseIcon /> {internship.field}</div>
                        <div className="flex items-center"><LocationIcon /> {internship.location}</div>
                        <div className="flex items-center"><ClockIcon /> {internship.duration}</div>
                        <div className="flex items-center"><JobTypeIcon /> {internship.jobType}</div>
                    </div>

                     <div className="mb-6 bg-[#EFF0F4] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2 flex items-center"><CalendarDaysIcon /> Periode Lamaran</h3>
                        <p className="text-[#264E86]/80">Dibuka: <span className="font-medium">{formatDate(internship.postedDate)}</span></p>
                        <p className="text-[#264E86]/80">Ditutup: <span className="font-medium">{formatDate(internship.closingDate)}</span></p>
                    </div>

                    {company?.description && (
                         <div className="mb-6">
                            <h3 className="text-lg font-semibold text-[#264E86] mb-2 flex items-center"><BuildingOfficeIcon /> Tentang Perusahaan</h3>
                            <p className="text-[#264E86]/80 leading-relaxed">{company.description}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2">Deskripsi Pekerjaan</h3>
                        <p className="text-[#264E86]/80 leading-relaxed">{internship.description}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-2">Requirements</h3>
                        <ul className="list-disc list-inside text-[#264E86]/80 space-y-1">
                            {internship.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-[#264E86] mb-4 flex items-center"><ChatBubbleLeftRightIcon /> Ulasan Pengalaman Magang</h3>
                        <div className="bg-[#EFF0F4] p-4 rounded-lg mb-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-3xl text-[#0074E4]">{averageRating.toFixed(1)} <span className="text-lg text-[#264E86]/80">/ 5</span></p>
                                <p className="text-sm text-[#264E86]/80">dari {companyReviews.length} ulasan</p>
                            </div>
                            <StarRating rating={averageRating} />
                        </div>

                        {user?.role === Role.STUDENT && !showReviewForm && (
                             <button onClick={() => setShowReviewForm(true)} className="w-full text-center px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86] mb-4">
                                Tulis Ulasan
                            </button>
                        )}
                        
                        {showReviewForm && (
                            <form onSubmit={handleReviewSubmit} className="mb-4 p-4 border rounded-lg bg-white space-y-3">
                                <h4 className="font-semibold text-[#264E86]">Bagikan pengalamanmu</h4>
                                <div>
                                    <label className="block text-sm font-medium text-[#264E86]">Rating</label>
                                    <StarRating rating={newRating} setRating={setNewRating} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#264E86]">Komentar</label>
                                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">Batal</button>
                                    <button type="submit" className="px-3 py-1 bg-[#0074E4] text-white rounded-md">Kirim</button>
                                </div>
                            </form>
                        )}


                        <div className="space-y-4">
                            {companyReviews.map(review => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-[#264E86]">{review.studentName}</p>
                                            <p className="text-xs text-[#264E86]/70">{formatDate(review.date)}</p>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="mt-2 text-[#264E86]/80">{review.comment}</p>
                                </div>
                            ))}
                             {companyReviews.length === 0 && <p className="text-sm text-center text-[#264E86]/70">Belum ada ulasan untuk perusahaan ini.</p>}
                        </div>
                    </div>

                </div>

                <div className="sticky bottom-0 bg-[#EFF0F4] px-6 py-3 text-right">
                     <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-[#264E86] rounded-md hover:bg-[#74DBEF]/50 border border-[#264E86]/20"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetailModal;