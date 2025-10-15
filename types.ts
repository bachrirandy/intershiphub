export enum Role {
    STUDENT = 'student',
    COMPANY = 'company',
    ADMIN = 'admin',
}

export enum JobType {
    ONSITE = 'On-site',
    REMOTE = 'Remote',
    HYBRID = 'Hybrid',
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: Role;
    // Student specific
    major?: string;
    skills?: string[];
    cvLink?: string;
    university?: string;
    graduationYear?: number;
    bio?: string;
    portfolioLink?: string;
    linkedinProfile?: string;
    profilePictureUrl?: string;
    // Company specific
    field?: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    location?: string;
    companySize?: string;
    techStack?: string[];
}

export interface Internship {
    id: number;
    title: string;
    companyId: number;
    companyName: string;
    field: string;
    location: string;
    duration: string;
    jobType: JobType;
    postedDate: string; // YYYY-MM-DD
    closingDate: string; // YYYY-MM-DD
    description: string;
    requirements: string[];
}

export interface Application {
    id: number;
    internshipId: number;
    studentId: number;
    status: ApplicationStatus;
    applicationDate: string; // YYYY-MM-DD
    coverLetter?: string;
    // Denormalized for easier display
    internship?: Internship;
    student?: User;
}

export interface Review {
    id?: number; // make it optional if it's added by the data context
    companyId: number;
    studentId: number;
    studentName: string;
    rating: number; // 1-5
    comment: string;
    date: string; // YYYY-MM-DD
}

export interface ResourceArticle {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    imageUrl?: string;
    category: 'STUDENT' | 'COMPANY' | 'GENERAL';
}
