import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;


const StudentProfilePage: React.FC = () => {
    const { user, updateStudentProfile } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return <p>Loading...</p>;

    const [formData, setFormData] = useState({
        name: user.name || '',
        major: user.major || '',
        skills: (user.skills || []).join(', '),
        cvLink: user.cvLink || '',
        university: user.university || '',
        graduationYear: user.graduationYear || new Date().getFullYear() + 4,
        bio: user.bio || '',
        portfolioLink: user.portfolioLink || '',
        linkedinProfile: user.linkedinProfile || '',
        profilePictureUrl: user.profilePictureUrl || ''
    });
    
    // Ensure form data is in sync with user context if user changes
    React.useEffect(() => {
        setFormData({
            name: user.name || '',
            major: user.major || '',
            skills: (user.skills || []).join(', '),
            cvLink: user.cvLink || '',
            university: user.university || '',
            graduationYear: user.graduationYear || new Date().getFullYear() + 4,
            bio: user.bio || '',
            portfolioLink: user.portfolioLink || '',
            linkedinProfile: user.linkedinProfile || '',
            profilePictureUrl: user.profilePictureUrl || ''
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({...prev, profilePictureUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateStudentProfile({
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            graduationYear: Number(formData.graduationYear)
        });
        addToast('Profil berhasil diperbarui!', 'success');
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        // Reset form data to current user state
        setFormData({
            name: user.name || '',
            major: user.major || '',
            skills: (user.skills || []).join(', '),
            cvLink: user.cvLink || '',
            university: user.university || '',
            graduationYear: user.graduationYear || new Date().getFullYear() + 4,
            bio: user.bio || '',
            portfolioLink: user.portfolioLink || '',
            linkedinProfile: user.linkedinProfile || '',
            profilePictureUrl: user.profilePictureUrl || ''
        });
        setIsEditing(false);
    };
    
    const formInputStyle = "mt-1 block w-full bg-[#EFF0F4] border border-[#0074E4]/50 rounded-md shadow-sm py-2 px-3 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4] focus:border-transparent";
    
    const ProfileInfoItem: React.FC<{label: string, value?: string | string[] | number, isLink?: boolean}> = ({ label, value, isLink }) => (
        <div>
            <p className="text-sm font-medium text-[#264E86]/60">{label}</p>
            {isLink && typeof value === 'string' ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-md text-[#0074E4] hover:underline break-words">{value || '-'}</a>
            ) : Array.isArray(value) ? (
                 <div className="flex flex-wrap gap-2 mt-1">
                    {value.map((item, index) => <span key={index} className="px-2 py-1 text-sm bg-[#74DBEF]/50 text-[#264E86] rounded-full">{item}</span>)}
                </div>
            ) : (
                <p className="text-md text-[#264E86]">{value || '-'}</p>
            )}
        </div>
    );

    if (!isEditing) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#264E86]">Profil Saya</h2>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-white text-[#0074E4] rounded-md border border-[#0074E4] hover:bg-[#0074E4]/10 transition-colors">
                        <EditIcon/>
                        <span>Edit Profil</span>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full border-2 border-[#0074E4]/30 flex items-center justify-center bg-[#EFF0F4]">
                            {user.profilePictureUrl ? (
                                <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-4xl font-bold text-[#0074E4]">{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                            )}
                        </div>
                    </div>
                    <div className="w-full space-y-4">
                        <h3 className="text-3xl font-bold text-[#264E86]">{user.name}</h3>
                        <p className="text-[#264E86]/80 max-w-2xl">{user.bio || 'Bio belum diisi.'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
                            <ProfileInfoItem label="Universitas" value={user.university} />
                            <ProfileInfoItem label="Jurusan" value={user.major} />
                            <ProfileInfoItem label="Tahun Lulus" value={user.graduationYear} />
                            <ProfileInfoItem label="Keahlian" value={user.skills} />
                            <ProfileInfoItem label="Link CV" value={user.cvLink} isLink />
                            <ProfileInfoItem label="Link Portofolio" value={user.portfolioLink} isLink />
                            <ProfileInfoItem label="Profil LinkedIn" value={user.linkedinProfile} isLink />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#264E86]">Edit Profil</h2>
            <div className="space-y-6">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full border-2 border-[#0074E4]/30 flex items-center justify-center bg-[#EFF0F4]">
                        {formData.profilePictureUrl ? (
                            <img src={formData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-3xl font-bold text-[#0074E4]">{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                        )}
                    </div>
                    <div>
                         <label htmlFor="picture-upload" className="cursor-pointer bg-white py-2 px-4 border border-[#264E86]/20 rounded-md shadow-sm text-sm font-medium text-[#264E86] hover:bg-[#EFF0F4] flex items-center">
                            <UploadIcon />
                            <span>Ubah Foto</span>
                            <input id="picture-upload" name="picture-upload" type="file" className="sr-only" onChange={handlePictureChange} accept="image/*" />
                        </label>
                        <p className="text-xs text-[#264E86]/60 mt-2">JPG, PNG, atau GIF. Maks 800x800px.</p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Nama Lengkap</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={formInputStyle} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Universitas</label>
                        <input type="text" name="university" value={formData.university} onChange={handleChange} className={formInputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Jurusan</label>
                        <input type="text" name="major" value={formData.major} onChange={handleChange} className={formInputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[#264E86]">Tahun Lulus</label>
                        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className={formInputStyle} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Bio Singkat</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Ceritakan sedikit tentang diri Anda, minat, dan tujuan karir Anda." className={formInputStyle} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Keahlian (pisahkan dengan koma)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} className={formInputStyle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Link CV (Google Drive, dll)</label>
                        <input type="url" name="cvLink" value={formData.cvLink} onChange={handleChange} className={formInputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Link Portofolio</label>
                        <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} className={formInputStyle} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#264E86]">Profil LinkedIn</label>
                        <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} className={formInputStyle} />
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86]">Simpan Perubahan</button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-white text-[#264E86] rounded-md border border-[#264E86]/30 hover:bg-[#EFF0F4]">Batal</button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;