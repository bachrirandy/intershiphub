import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Application } from '../types';

// Icons
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const STEPS = [
    { id: 1, name: 'Data Diri' },
    { id: 2, name: 'Dokumen Pendukung' },
    { id: 3, name: 'Akademik & Keterampilan' },
    { id: 4, name: 'Detail Lamaran' },
    { id: 5, name: 'Verifikasi & Persetujuan' },
];

const MultiStepProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {STEPS.map((step) => (
                <li key={step.name} className="md:flex-1">
                    {currentStep > step.id ? (
                        <div className="group w-full border-l-4 border-[#0074E4] py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                            <span className="text-sm font-medium text-[#0074E4]">{step.name}</span>
                        </div>
                    ) : currentStep === step.id ? (
                        <div className="w-full border-l-4 border-[#0074E4] py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                            <span className="text-sm font-bold text-[#0074E4]">{step.name}</span>
                        </div>
                    ) : (
                        <div className="group w-full border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                            <span className="text-sm font-medium text-gray-500">{step.name}</span>
                        </div>
                    )}
                </li>
            ))}
        </ol>
    </nav>
);

const FileInput: React.FC<{
    label: string;
    id: string;
    required?: boolean;
    file: File | null;
    onFileChange: (file: File | null) => void;
    error?: string;
}> = ({ label, id, required, file, onFileChange, error }) => (
    <div>
        <label className="block text-sm font-medium text-[#264E86]">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <label htmlFor={id} className="mt-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#264E86] bg-white hover:bg-gray-50 cursor-pointer">
            <UploadIcon /> {file ? 'Ganti File' : 'Pilih File'}
        </label>
        <input id={id} type="file" className="sr-only" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} accept=".pdf,.doc,.docx,image/*" />
        {file && <p className="text-sm text-gray-600 mt-2">File terpilih: {file.name}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


const ApplicationFormPage: React.FC = () => {
    const { internshipId } = useParams();
    const navigate = useNavigate();
    const { internships, applyForInternship, getStudentApplications } = useData();
    const { user } = useAuth();
    const { addToast } = useToast();

    const internship = useMemo(() => internships.find(i => i.id === parseInt(internshipId || '0')), [internships, internshipId]);

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // State for all form data
    const [formData, setFormData] = useState<Partial<Application>>({
        fullName: user?.name || '',
        university: user?.university || '',
        major: user?.major || '',
        activeEmail: user?.email || '',
        currentSemester: 5,
        gender: 'Laki-laki',
        gpa: 3.5,
        mainSkills: user?.skills || [],
        softwareTools: [],
        languages: ['Indonesia'],
        preferredWorkType: 'Hybrid',
        dataAuthenticityConfirmation: false,
        dataProcessingConsent: false
    });
    
    // State for files
    const [files, setFiles] = useState({
        profilePicture: null as File | null,
        cv: null as File | null,
        recommendationLetter: null as File | null,
        transcript: null as File | null,
        portfolio: null as File | null,
        certificates: null as File | null,
    });

    if (!user) return null;
    if (!internship) return <div className="text-center py-10">Lowongan tidak ditemukan.</div>;

    const hasApplied = getStudentApplications(user.id).some(app => app.internshipId === internship.id);

    const validateStep = () => {
        const newErrors: Record<string, string> = {};
        if (currentStep === 1) {
            if (!formData.studentIdNumber) newErrors.studentIdNumber = "NIM tidak boleh kosong.";
            if (!formData.dateOfBirth) newErrors.dateOfBirth = "Tanggal lahir tidak boleh kosong.";
            if (!formData.phoneNumber) newErrors.phoneNumber = "Nomor telepon tidak boleh kosong.";
            if (!formData.address) newErrors.address = "Alamat tidak boleh kosong.";
        }
        if (currentStep === 2) {
            if (!files.cv) newErrors.cv = "CV wajib diunggah.";
            if (!files.transcript) newErrors.transcript = "Transkrip wajib diunggah.";
        }
        if (currentStep === 3) {
            if (!formData.gpa || formData.gpa <= 0 || formData.gpa > 4) newErrors.gpa = "IPK tidak valid (0-4).";
        }
        if (currentStep === 4) {
            if (!formData.reasonForApplying) newErrors.reasonForApplying = "Alasan melamar tidak boleh kosong.";
            if (!formData.internshipStartDate) newErrors.internshipStartDate = "Tanggal mulai tidak boleh kosong.";
            if (!formData.internshipEndDate) newErrors.internshipEndDate = "Tanggal selesai tidak boleh kosong.";
        }
        if (currentStep === 5) {
            if (!formData.dataAuthenticityConfirmation) newErrors.dataAuthenticityConfirmation = "Anda harus menyetujui pernyataan ini.";
            if (!formData.dataProcessingConsent) newErrors.dataProcessingConsent = "Anda harus menyetujui persetujuan ini.";
            if (!formData.eSignature) newErrors.eSignature = "Tanda tangan digital wajib diisi.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'mainSkills' || name === 'softwareTools' || name === 'languages') {
             setFormData({ ...formData, [name]: value.split(',').map(s => s.trim()).filter(Boolean) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleFileChange = (field: keyof typeof files, file: File | null) => {
        setFiles(prev => ({ ...prev, [field]: file }));
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            addToast('Harap perbaiki error pada formulir.', 'error');
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) {
            addToast('Harap perbaiki error pada formulir.', 'error');
            return;
        }

        const finalApplicationData: Omit<Application, 'id' | 'status' | 'applicationDate'> = {
            ...formData,
            internshipId: internship.id,
            studentId: user.id,
            profilePictureFileName: files.profilePicture?.name,
            cvFileName: files.cv!.name,
            transcriptFileName: files.transcript!.name,
            recommendationLetterFileName: files.recommendationLetter?.name,
            portfolioFileNameOrLink: files.portfolio?.name,
            certificatesFileName: files.certificates?.name,
        } as Omit<Application, 'id' | 'status' | 'applicationDate'>;

        applyForInternship(finalApplicationData);
        addToast('Lamaran berhasil dikirim!', 'success');
        navigate('/student/applications');
    };

    const labelStyle = "block text-sm font-medium text-[#264E86]";
    const formInputStyle = (field: string) => `mt-1 block w-full border rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4] ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
    const formSelectStyle = (field: string) => `mt-1 block w-full border rounded-md shadow-sm py-2 px-3 bg-white text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4] ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
    const formReadonlyStyle = "mt-1 block w-full bg-gray-100 border-gray-300 rounded-md py-2 px-3 text-gray-500";
    
    return (
        <div className="container mx-auto px-6 py-8 animate-fade-in-slide-up">
            <Link to="/student" className="inline-flex items-center text-[#0074E4] hover:text-[#264E86] font-medium mb-6">
                <ArrowLeftIcon />
                Kembali ke Pencarian
            </Link>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="text-center pb-4 mb-8">
                    <h1 className="text-3xl font-bold text-[#264E86]">Formulir Lamaran</h1>
                    <p className="text-lg text-[#264E86]/80 mt-1">{internship.title} - {internship.companyName}</p>
                </div>
                
                <div className="mb-8">
                    <MultiStepProgressBar currentStep={currentStep} />
                </div>
                
                 {hasApplied ? (
                     <div className="text-center py-10 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                        <p className="text-lg font-semibold text-blue-800">Anda sudah melamar untuk posisi ini.</p>
                        <p className="text-blue-700">Anda dapat melihat status lamaran Anda di halaman "Lamaran Saya".</p>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Render Step Content */}
                    <div className="p-4 border rounded-md bg-gray-50/50 min-h-[300px]">
                        <h3 className="text-xl font-semibold text-[#0074E4] mb-4">{STEPS[currentStep - 1].name}</h3>
                        
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className={labelStyle}>Nama Lengkap</label><input type="text" name="fullName" value={formData.fullName} className={formReadonlyStyle} readOnly /></div>
                                <div><label htmlFor="studentIdNumber" className={labelStyle}>NIM <span className="text-red-500">*</span></label><input type="number" id="studentIdNumber" name="studentIdNumber" value={formData.studentIdNumber || ''} onChange={handleChange} className={formInputStyle('studentIdNumber')} required />{errors.studentIdNumber && <p className="text-red-500 text-xs mt-1">{errors.studentIdNumber}</p>}</div>
                                <div><label className={labelStyle}>Jurusan</label><input type="text" name="major" value={formData.major} className={formReadonlyStyle} readOnly /></div>
                                <div><label className={labelStyle}>Universitas</label><input type="text" name="university" value={formData.university} className={formReadonlyStyle} readOnly /></div>
                                <div><label htmlFor="currentSemester" className={labelStyle}>Semester <span className="text-red-500">*</span></label><select id="currentSemester" name="currentSemester" value={formData.currentSemester} onChange={handleChange} className={formSelectStyle('currentSemester')}><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></div>
                                <div><label htmlFor="gender" className={labelStyle}>Jenis Kelamin <span className="text-red-500">*</span></label><select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={formSelectStyle('gender')}><option>Laki-laki</option><option>Perempuan</option><option>Lainnya</option></select></div>
                                <div><label htmlFor="dateOfBirth" className={labelStyle}>Tanggal Lahir <span className="text-red-500">*</span></label><input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className={formInputStyle('dateOfBirth')} required />{errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}</div>
                                <div><label htmlFor="phoneNumber" className={labelStyle}>Nomor Telepon <span className="text-red-500">*</span></label><input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className={formInputStyle('phoneNumber')} required />{errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}</div>
                                <div className="md:col-span-2"><label className={labelStyle}>Email</label><input type="email" name="activeEmail" value={formData.activeEmail} className={formReadonlyStyle} readOnly /></div>
                                <div className="md:col-span-2"><label htmlFor="address" className={labelStyle}>Alamat Domisili <span className="text-red-500">*</span></label><textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} rows={3} className={formInputStyle('address')} required />{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}</div>
                                <div className="md:col-span-2"><FileInput label="Foto Profil (Opsional)" id="profile-picture" file={files.profilePicture} onFileChange={(f) => handleFileChange('profilePicture', f)} /></div>
                            </div>
                        )}

                        {currentStep === 2 && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileInput label="Curriculum Vitae (CV)" id="cv-upload" required file={files.cv} onFileChange={(f) => handleFileChange('cv', f)} error={errors.cv} />
                                <FileInput label="Transkrip Nilai" id="transcript-upload" required file={files.transcript} onFileChange={(f) => handleFileChange('transcript', f)} error={errors.transcript} />
                                <FileInput label="Surat Rekomendasi Dosen (Opsional)" id="recommendation-upload" file={files.recommendationLetter} onFileChange={(f) => handleFileChange('recommendationLetter', f)} />
                                <FileInput label="Portofolio / Hasil Karya (Opsional)" id="portfolio-upload" file={files.portfolio} onFileChange={(f) => handleFileChange('portfolio', f)} />
                                <div className="md:col-span-2"><FileInput label="Sertifikat Pendukung (Opsional)" id="certificates-upload" file={files.certificates} onFileChange={(f) => handleFileChange('certificates', f)} /></div>
                             </div>
                        )}

                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="gpa" className={labelStyle}>IPK Terakhir <span className="text-red-500">*</span></label><input type="number" id="gpa" name="gpa" step="0.01" min="0" max="4" value={formData.gpa} onChange={handleChange} className={formInputStyle('gpa')} required />{errors.gpa && <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>}</div>
                                <div><label htmlFor="mainSkills" className={labelStyle}>Keahlian Utama (pisahkan koma)</label><input type="text" id="mainSkills" name="mainSkills" value={Array.isArray(formData.mainSkills) ? formData.mainSkills.join(', ') : ''} onChange={handleChange} className={formInputStyle('mainSkills')} /></div>
                                <div><label htmlFor="softwareTools" className={labelStyle}>Software/Tools (pisahkan koma)</label><input type="text" id="softwareTools" name="softwareTools" value={Array.isArray(formData.softwareTools) ? formData.softwareTools.join(', ') : ''} onChange={handleChange} className={formInputStyle('softwareTools')} /></div>
                                <div><label htmlFor="languages" className={labelStyle}>Bahasa (pisahkan koma)</label><input type="text" id="languages" name="languages" value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''} onChange={handleChange} className={formInputStyle('languages')} /></div>
                                <div className="md:col-span-2"><label htmlFor="organizationalExperience" className={labelStyle}>Pengalaman Organisasi</label><textarea id="organizationalExperience" name="organizationalExperience" value={formData.organizationalExperience || ''} onChange={handleChange} rows={3} className={formInputStyle('organizationalExperience')} /></div>
                                <div className="md:col-span-2"><label htmlFor="previousInternshipExperience" className={labelStyle}>Pengalaman Magang Sebelumnya</label><textarea id="previousInternshipExperience" name="previousInternshipExperience" value={formData.previousInternshipExperience || ''} onChange={handleChange} rows={3} className={formInputStyle('previousInternshipExperience')} /></div>
                            </div>
                        )}
                        
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div><label className={labelStyle}>Posisi Dilamar</label><input type="text" value={internship.title} className={formReadonlyStyle} readOnly /></div>
                                <div><label className={labelStyle}>Perusahaan</label><input type="text" value={internship.companyName} className={formReadonlyStyle} readOnly /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label htmlFor="internshipStartDate" className={labelStyle}>Tanggal Mulai Magang <span className="text-red-500">*</span></label><input type="date" id="internshipStartDate" name="internshipStartDate" value={formData.internshipStartDate || ''} onChange={handleChange} className={formInputStyle('internshipStartDate')} required />{errors.internshipStartDate && <p className="text-red-500 text-xs mt-1">{errors.internshipStartDate}</p>}</div>
                                    <div><label htmlFor="internshipEndDate" className={labelStyle}>Tanggal Selesai Magang <span className="text-red-500">*</span></label><input type="date" id="internshipEndDate" name="internshipEndDate" value={formData.internshipEndDate || ''} onChange={handleChange} className={formInputStyle('internshipEndDate')} required />{errors.internshipEndDate && <p className="text-red-500 text-xs mt-1">{errors.internshipEndDate}</p>}</div>
                                </div>
                                <div><label htmlFor="preferredWorkType" className={labelStyle}>Preferensi Kerja <span className="text-red-500">*</span></label><select id="preferredWorkType" name="preferredWorkType" value={formData.preferredWorkType} onChange={handleChange} className={formSelectStyle('preferredWorkType')}><option>WFO</option><option>WFH</option><option>Hybrid</option></select></div>
                                <div><label htmlFor="expectedSalary" className={labelStyle}>Gaji/Insentif Diharapkan (Opsional)</label><input type="number" id="expectedSalary" name="expectedSalary" value={formData.expectedSalary || ''} onChange={handleChange} className={formInputStyle('expectedSalary')} /></div>
                                <div><label htmlFor="reasonForApplying" className={labelStyle}>Alasan Melamar <span className="text-red-500">*</span></label><textarea id="reasonForApplying" name="reasonForApplying" value={formData.reasonForApplying || ''} onChange={handleChange} rows={4} className={formInputStyle('reasonForApplying')} required />{errors.reasonForApplying && <p className="text-red-500 text-xs mt-1">{errors.reasonForApplying}</p>}</div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400">
                                    <h4 className="font-semibold text-yellow-800">Tinjau Kembali Lamaran Anda</h4>
                                    <p className="text-sm text-yellow-700">Pastikan semua data dan dokumen yang Anda masukkan sudah benar sebelum mengirimkan lamaran.</p>
                                </div>
                                <div className="flex items-start">
                                    <input id="dataAuthenticityConfirmation" name="dataAuthenticityConfirmation" type="checkbox" checked={!!formData.dataAuthenticityConfirmation} onChange={handleChange} className="h-4 w-4 text-[#0074E4] focus:ring-[#264E86] border-gray-300 rounded mt-1" />
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="dataAuthenticityConfirmation" className="font-medium text-[#264E86]">Saya menyatakan bahwa data yang saya isi adalah benar.</label>
                                        {errors.dataAuthenticityConfirmation && <p className="text-red-500 text-xs mt-1">{errors.dataAuthenticityConfirmation}</p>}
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <input id="dataProcessingConsent" name="dataProcessingConsent" type="checkbox" checked={!!formData.dataProcessingConsent} onChange={handleChange} className="h-4 w-4 text-[#0074E4] focus:ring-[#264E86] border-gray-300 rounded mt-1" />
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="dataProcessingConsent" className="font-medium text-[#264E86]">Saya menyetujui data saya digunakan untuk keperluan seleksi magang.</label>
                                        {errors.dataProcessingConsent && <p className="text-red-500 text-xs mt-1">{errors.dataProcessingConsent}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="eSignature" className="block text-sm font-medium text-[#264E86]">Tanda Tangan Digital (Ketik Nama Lengkap Anda) <span className="text-red-500">*</span></label>
                                    <input type="text" id="eSignature" name="eSignature" value={formData.eSignature || ''} onChange={handleChange} placeholder="Ketik nama lengkap Anda di sini" className={`${formInputStyle('eSignature')} font-serif italic`} required />
                                    {errors.eSignature && <p className="text-red-500 text-xs mt-1">{errors.eSignature}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="pt-5 flex justify-between">
                        <button type="button" onClick={handlePrev} disabled={currentStep === 1} className="px-4 py-2 bg-white text-[#264E86] font-medium rounded-md border border-[#264E86]/30 hover:bg-[#EFF0F4] disabled:opacity-50 disabled:cursor-not-allowed">
                            Sebelumnya
                        </button>
                        {currentStep < STEPS.length ? (
                            <button type="button" onClick={handleNext} className="px-6 py-2 bg-[#0074E4] text-white font-bold rounded-md hover:bg-[#264E86] transition-colors">
                                Selanjutnya
                            </button>
                        ) : (
                            <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors">
                                Kirim Lamaran
                            </button>
                        )}
                    </div>
                </form>
                )}
            </div>
        </div>
    );
};

export default ApplicationFormPage;