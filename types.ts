
export enum Role {
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
    ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
    APPLIED = 'Applied',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected'
}

export interface User {
    id: number;
    email: string;
    password?: string; // In a real app, this would be hashed
    role: Role;
    name: string;
    // Student specific
    major?: string;
    skills?: string[];
    cvLink?: string;
    // Company specific
    field?: string;
    description?: string;
}

export interface Internship {
    id: number;
    companyId: number;
    companyName: string;
    title: string;
    description: string;
    location: string;
    duration: string; // e.g., "3 Months", "6 Months"
    requirements: string[];
    field: string; // e.g., "Software Engineering", "Marketing"
}

export interface Application {
    id: number;
    internshipId: number;
    studentId: number;
    status: ApplicationStatus;
}
