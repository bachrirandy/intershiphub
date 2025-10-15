import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#264E86]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;

const CompanyProfilePage: React.FC = () => {
    const { user, updateCompanyProfile } = useAuth();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) return <p>Loading...</p>;

    const [formData, setFormData] = useState({
        name: user.name || '',
        field: user.field || '',
        description: user.description || '',
        logoUrl: user.logoUrl || '',
        website: user.website || '',
        location: user.location || '',
        companySize: user.companySize || '11-50 Karyawan',
        techStack: (user.techStack || []).join(', ')
    });
    
    React.useEffect(() => {
        setFormData({
            name: user.name || '',
            field: user.field || '',
            description: user.description || '',
            logoUrl: user.logoUrl || '',
            website: user.website || '',
            location: user.location || '',
            companySize: user.companySize || '11-50 Karyawan',
            techStack: (user.techStack || []).join(', ')
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({...prev, logoUrl: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateCompanyProfile({
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        });
        addToast('Profil perusahaan berhasil diperbarui!', 'success');
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            field: user.field || '',
            description: user.description || '',
            logoUrl: user.logoUrl || '',
            website: user.website || '',
            location: user.location || '',
            companySize: user.companySize || '11-50 Karyawan',
            techStack: (user.techStack || []).join(', ')
        });
        setIsEditing(false);
    }

    const formInputStyle = "mt-1 block w-full bg-[#EFF0F4] border border-[#0074E4]/50 rounded-md shadow-sm py-2 px-3 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4] focus:border-transparent";
    
    const ProfileInfoItem: React.FC<{label: string, value?: string | string[], isLink?: boolean}> = ({ label, value, isLink }) => (
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
                        <h2 className="text-2xl font-bold text-[#264E86]">Profil Perusahaan</h2>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-white text-[#0074E4] rounded-md border border-[#0074E4] hover:bg-[#0074E4]/10 transition-colors">
                        <EditIcon/>
                        <span>Edit Profil</span>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex-shrink-0">
                         <div className="w-32 h-32 rounded-lg border border-[#0074E4]/20 flex items-center justify-center bg-[#EFF0F4] overflow-hidden">
                             {user.logoUrl ? (
                                <img src={user.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-4xl font-bold text-[#0074E4]">{user.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                    <div className="w-full space-y-4">
                        <h3 className="text-3xl font-bold text-[#264E86]">{user.name}</h3>
                        <p className="text-[#264E86]/80 max-w-2xl">{user.description || 'Deskripsi perusahaan belum diisi.'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
                            <ProfileInfoItem label="Bidang Industri" value={user.field} />
                            <ProfileInfoItem label="Lokasi" value={user.location} />
                            <ProfileInfoItem label="Ukuran Perusahaan" value={user.companySize} />
                            <ProfileInfoItem label="Website" value={user.website} isLink />
                             <ProfileInfoItem label="Tech Stack" value={user.techStack} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#264E86]">Edit Profil Perusahaan</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Nama Perusahaan</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={formInputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[#264E86]">Bidang Industri</label>
                        <input type="text" name="field" value={formData.field} onChange={handleChange} className={formInputStyle} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[#264E86]">Lokasi Kantor Pusat</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className={formInputStyle} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#264E86]">Ukuran Perusahaan</label>
                         <select name="companySize" value={formData.companySize} onChange={handleChange} className={formInputStyle}>
                            <option>1-10 Karyawan</option>
                            <option>11-50 Karyawan</option>
                            <option>51-200 Karyawan</option>
                            <option>201-500 Karyawan</option>
                            <option>501-1,000 Karyawan</option>
                            <option>1,001+ Karyawan</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Website Perusahaan</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} className={formInputStyle} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-[#264E86]">Teknologi yang Digunakan (pisahkan dengan koma)</label>
                    <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className={formInputStyle} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Logo Perusahaan</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-md border border-[#264E86]/20 flex items-center justify-center bg-[#EFF0F4]">
                            {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain rounded-md p-1" />
                            ) : (
                                <span className="text-xs text-[#264E86]/60">Pratinjau</span>
                            )}
                        </div>
                        <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-[#264E86]/20 rounded-md shadow-sm text-sm leading-4 font-medium text-[#264E86] hover:bg-[#EFF0F4] flex items-center">
                            <UploadIcon />
                            <span>Unggah File</span>
                            <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*, image/svg+xml" />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#264E86]">Deskripsi Perusahaan</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={formInputStyle} />
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-[#0074E4] text-white rounded-md hover:bg-[#264E86]">Simpan Perubahan</button>
                    <button onClick={handleCancel} className="px-4 py-2 bg-white text-[#264E86] rounded-md border border-[#264E86]/30 hover:bg-[#EFF0F4]">Batal</button>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;