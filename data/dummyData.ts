import { User, Role, Internship, Application, ApplicationStatus, JobType } from '../types';

export let users: User[] = [
    {
        id: 1,
        email: 'johndoe@email.com',
        password: 'password',
        role: Role.STUDENT,
        name: 'John Doe',
        major: 'Computer Science',
        skills: ['React', 'TypeScript', 'Node.js'],
        cvLink: 'https://example.com/johndoe_cv.pdf'
    },
    {
        id: 2,
        email: 'techcorp@email.com',
        password: 'password',
        role: Role.COMPANY,
        name: 'TechCorp',
        field: 'Technology',
        description: 'A leading technology company innovating for the future.',
        logoUrl: 'https://placehold.co/100x100/0074E4/FFFFFF/png?text=TC'
    },
    {
        id: 3,
        email: 'admin@email.com',
        password: 'admin',
        role: Role.ADMIN,
        name: 'Admin User'
    },
     {
        id: 4,
        email: 'janesmith@email.com',
        password: 'password',
        role: Role.STUDENT,
        name: 'Jane Smith',
        major: 'Marketing',
        skills: ['SEO', 'Content Creation', 'Social Media'],
        cvLink: 'https://example.com/janesmith_cv.pdf'
    },
    {
        id: 5,
        email: 'innovateinc@email.com',
        password: 'password',
        role: Role.COMPANY,
        name: 'Innovate Inc.',
        field: 'Software Development',
        description: 'Building innovative software solutions for businesses.',
        logoUrl: 'https://placehold.co/100x100/264E86/FFFFFF/png?text=II'
    }
];

// Helper to get a date in YYYY-MM-DD format
const getDateString = (month: number, day: number) => {
    const date = new Date();
    date.setMonth(month - 1, day);
    // Handle year wrapping for previous/next year months
    if (month < 1) {
        date.setFullYear(date.getFullYear() - 1);
    } else if (month > 12) {
        date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
}

const currentMonth = new Date().getMonth() + 1;

export let internships: Internship[] = [
    {
        id: 1,
        companyId: 2,
        companyName: 'TechCorp',
        title: 'Frontend Developer Intern',
        description: 'Work with our frontend team to build amazing user experiences.',
        location: 'Jakarta',
        duration: '3 Months',
        jobType: JobType.HYBRID,
        postedDate: getDateString(currentMonth, 5), // 5th of current month
        closingDate: getDateString(currentMonth + 1, 5), // 5th of next month
        requirements: ['HTML', 'CSS', 'JavaScript', 'React'],
        field: 'Software Engineering'
    },
    {
        id: 2,
        companyId: 5,
        companyName: 'Innovate Inc.',
        title: 'Backend Developer Intern',
        description: 'Join our backend team to work on scalable server-side applications.',
        location: 'Bandung',
        duration: '6 Months',
        jobType: JobType.ONSITE,
        postedDate: getDateString(currentMonth, 15), // 15th of current month
        closingDate: getDateString(currentMonth + 1, 15), // 15th of next month
        requirements: ['Node.js', 'Express', 'SQL', 'REST APIs'],
        field: 'Software Engineering'
    },
    {
        id: 3,
        companyId: 2,
        companyName: 'TechCorp',
        title: 'Digital Marketing Intern',
        description: 'Assist our marketing team with social media campaigns and SEO.',
        location: 'Surabaya',
        duration: '3 Months',
        jobType: JobType.REMOTE,
        postedDate: getDateString(currentMonth, 22), // 22nd of current month
        closingDate: getDateString(currentMonth + 1, 22), // 22nd of next month
        requirements: ['Marketing knowledge', 'Good communication skills'],
        field: 'Marketing'
    }
];

export let applications: Application[] = [
    {
        id: 1,
        internshipId: 2,
        studentId: 1,
        status: ApplicationStatus.APPLIED
    },
    {
        id: 2,
        internshipId: 3,
        studentId: 4,
        status: ApplicationStatus.ACCEPTED
    },
    {
        id: 3,
        internshipId: 1,
        studentId: 4,
        status: ApplicationStatus.REJECTED
    }
];