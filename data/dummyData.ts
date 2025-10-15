import { User, Role, Internship, Application, ApplicationStatus, Review, ResourceArticle, JobType } from '../types';

export const users: User[] = [
    { id: 1, name: 'John Doe', email: 'johndoe@email.com', password: 'password123', role: Role.STUDENT, major: 'Computer Science', skills: ['React', 'Node.js', 'TypeScript'], cvLink: 'https://example.com/cv.pdf', university: 'Universitas Gadjah Mada', graduationYear: 2025, bio: 'Passionate computer science student with a focus on web development.', portfolioLink: 'https://example.com/portfolio', linkedinProfile: 'https://linkedin.com/in/johndoe', profilePictureUrl: 'https://i.pravatar.cc/150?u=johndoe' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@email.com', password: 'password123', role: Role.STUDENT, major: 'Information Systems', skills: ['UI/UX Design', 'Figma', 'Project Management'], cvLink: 'https://example.com/cv2.pdf', university: 'Institut Teknologi Bandung', graduationYear: 2024, bio: 'Creative student interested in designing user-centric digital experiences.', portfolioLink: 'https://example.com/portfolio2', linkedinProfile: 'https://linkedin.com/in/janesmith', profilePictureUrl: 'https://i.pravatar.cc/150?u=janesmith' },
    { id: 101, name: 'TechCorp', email: 'techcorp@email.com', password: 'password123', role: Role.COMPANY, field: 'Technology', description: 'Leading innovations in software solutions.', logoUrl: 'https://via.placeholder.com/150/0074E4/FFFFFF?text=T', website: 'https://techcorp.com', location: 'Jakarta', companySize: '201-500 Karyawan', techStack: ['Go', 'Kubernetes', 'AWS'] },
    { id: 102, name: 'InnovateHub', email: 'innovatehub@email.com', password: 'password123', role: Role.COMPANY, field: 'Fintech', description: 'Revolutionizing financial services with cutting-edge tech.', logoUrl: 'https://via.placeholder.com/150/264E86/FFFFFF?text=I', website: 'https://innovatehub.com', location: 'Bandung', companySize: '51-200 Karyawan', techStack: ['Python', 'Django', 'React'] },
    { id: 999, name: 'Admin User', email: 'admin@email.com', password: 'admin123', role: Role.ADMIN },
];

export let internships: Internship[] = [
    { id: 1, title: 'Frontend Developer Intern', companyId: 101, companyName: 'TechCorp', field: 'Software Engineering', location: 'Jakarta', duration: '3 Months', jobType: JobType.HYBRID, postedDate: '2024-07-01', closingDate: '2024-07-31', description: 'Work on our main web application, building new features and improving user experience.', requirements: ['React', 'JavaScript', 'HTML/CSS'] },
    { id: 2, title: 'UI/UX Designer Intern', companyId: 102, companyName: 'InnovateHub', field: 'Design', location: 'Bandung', duration: '6 Months', jobType: JobType.REMOTE, postedDate: '2024-07-05', closingDate: '2024-08-15', description: 'Join our design team to create intuitive and beautiful interfaces for our fintech products.', requirements: ['Figma', 'Prototyping', 'User Research'] },
    { id: 3, title: 'Backend Developer Intern', companyId: 101, companyName: 'TechCorp', field: 'Software Engineering', location: 'Jakarta', duration: '3 Months', jobType: JobType.ONSITE, postedDate: '2024-07-10', closingDate: '2024-08-10', description: 'Help build and maintain our microservices architecture using Go.', requirements: ['Go', 'REST APIs', 'SQL'] },
];

export let applications: Application[] = [
    { 
        id: 1, internshipId: 1, studentId: 1, status: ApplicationStatus.APPLIED, applicationDate: '2024-07-03', 
        fullName: 'John Doe', studentIdNumber: '123456789', major: 'Computer Science', university: 'Universitas Gadjah Mada',
        currentSemester: 7, gender: 'Laki-laki', dateOfBirth: '2003-05-15', phoneNumber: '081234567890', activeEmail: 'johndoe@email.com',
        address: 'Jl. Merdeka No. 1, Yogyakarta', cvFileName: 'JohnDoe_CV.pdf', transcriptFileName: 'JohnDoe_Transcript.pdf',
        gpa: 3.8, mainSkills: ['React', 'Node.js'], softwareTools: ['VS Code', 'Git'], languages: ['Indonesia', 'English'],
        reasonForApplying: 'Sangat tertarik dengan pengembangan frontend di TechCorp.', internshipStartDate: '2024-09-01', internshipEndDate: '2024-12-01',
        preferredWorkType: 'Hybrid', dataAuthenticityConfirmation: true, dataProcessingConsent: true, eSignature: 'John Doe'
    },
    { 
        id: 2, internshipId: 2, studentId: 2, status: ApplicationStatus.ACCEPTED, applicationDate: '2024-07-06',
        fullName: 'Jane Smith', studentIdNumber: '987654321', major: 'Information Systems', university: 'Institut Teknologi Bandung',
        currentSemester: 8, gender: 'Perempuan', dateOfBirth: '2002-11-20', phoneNumber: '081234567891', activeEmail: 'janesmith@email.com',
        address: 'Jl. Asia Afrika No. 10, Bandung', cvFileName: 'JaneSmith_CV.pdf', transcriptFileName: 'JaneSmith_Transcript.pdf',
        gpa: 3.9, mainSkills: ['UI/UX Design', 'Figma'], softwareTools: ['Figma', 'Adobe XD'], languages: ['Indonesia', 'English'],
        reasonForApplying: 'Ingin berkontribusi pada desain produk di InnovateHub.', internshipStartDate: '2024-08-15', internshipEndDate: '2025-02-15',
// FIX: Changed 'Remote' to 'WFH' to match the Application type definition.
        preferredWorkType: 'WFH', dataAuthenticityConfirmation: true, dataProcessingConsent: true, eSignature: 'Jane Smith'
    },
    { 
        id: 3, internshipId: 1, studentId: 2, status: ApplicationStatus.REJECTED, applicationDate: '2024-07-04',
        fullName: 'Jane Smith', studentIdNumber: '987654321', major: 'Information Systems', university: 'Institut Teknologi Bandung',
        currentSemester: 8, gender: 'Perempuan', dateOfBirth: '2002-11-20', phoneNumber: '081234567892', activeEmail: 'janesmith@email.com',
        address: 'Jl. Asia Afrika No. 10, Bandung', cvFileName: 'JaneSmith_CV.pdf', transcriptFileName: 'JaneSmith_Transcript.pdf',
        gpa: 3.9, mainSkills: ['UI/UX Design', 'Figma'], softwareTools: ['Figma', 'Adobe XD'], languages: ['Indonesia', 'English'],
        reasonForApplying: 'Mencoba peruntungan di bidang lain.', internshipStartDate: '2024-09-01', internshipEndDate: '2024-12-01',
        preferredWorkType: 'Hybrid', dataAuthenticityConfirmation: true, dataProcessingConsent: true, eSignature: 'Jane Smith'
    },
];

export let reviews: Review[] = [
    { id: 1, companyId: 101, studentId: 2, studentName: 'Jane Smith', rating: 4, comment: 'Great learning experience and supportive team. The work was challenging and rewarding.', date: '2023-12-15' },
    { id: 2, companyId: 102, studentId: 1, studentName: 'John Doe', rating: 5, comment: 'Amazing culture at InnovateHub. I was given real responsibilities and learned a lot about the fintech industry.', date: '2024-01-20' },
];

export const articles: ResourceArticle[] = [
    { id: 1, title: '5 Tips Menulis CV yang Dilirik HRD', excerpt: 'CV adalah gerbang pertamamu menuju pekerjaan impian. Pelajari cara membuatnya menonjol.', content: 'Menulis CV yang efektif adalah kunci untuk mendapatkan panggilan interview.\nPertama, pastikan CV Anda ringkas dan to the point, idealnya tidak lebih dari satu halaman.\nKedua, sesuaikan CV dengan posisi yang Anda lamar, tonjolkan pengalaman dan keahlian yang paling relevan.\nKetiga, gunakan kata kunci dari deskripsi pekerjaan.\nKeempat, periksa kembali tata bahasa dan ejaan.\nTerakhir, gunakan desain yang bersih dan profesional.', imageUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', category: 'STUDENT' },
    { id: 2, title: 'Cara Sukses Wawancara Kerja Online', excerpt: 'Wawancara online menjadi standar baru. Siapkan dirimu untuk tampil maksimal.', content: 'Wawancara online membutuhkan persiapan yang sedikit berbeda.\nPastikan koneksi internet stabil dan gunakan perangkat dengan kamera dan mikrofon yang baik.\nPilih latar belakang yang rapi dan profesional.\nLakukan riset tentang perusahaan dan posisi yang dilamar.\nSiapkan jawaban untuk pertanyaan umum dan siapkan juga pertanyaan untuk pewawancara.\nBerpakaianlah secara profesional seolah-olah Anda wawancara tatap muka.', imageUrl: 'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', category: 'STUDENT' },
    { id: 3, title: 'Membangun Program Magang yang Efektif', excerpt: 'Program magang yang baik menguntungkan perusahaan dan mahasiswa. Berikut cara membangunnya.', content: 'Program magang yang sukses dimulai dengan tujuan yang jelas.\nTentukan apa yang ingin Anda capai dengan program ini.\nBerikan proyek yang bermakna bagi anak magang, bukan hanya tugas administratif.\nTunjuk seorang mentor untuk membimbing mereka.\nBerikan feedback secara teratur dan ciptakan lingkungan kerja yang inklusif.\nDi akhir program, lakukan evaluasi untuk perbaikan di masa depan.', imageUrl: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', category: 'COMPANY' },
];
