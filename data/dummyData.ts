
import { User, Role, Internship, Application, ApplicationStatus } from '../types';

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
        description: 'A leading technology company innovating for the future.'
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
        description: 'Building innovative software solutions for businesses.'
    }
];

export let internships: Internship[] = [
    {
        id: 1,
        companyId: 2,
        companyName: 'TechCorp',
        title: 'Frontend Developer Intern',
        description: 'Work with our frontend team to build amazing user experiences.',
        location: 'Jakarta',
        duration: '3 Months',
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
