import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Internship, Application, Review, ResourceArticle, User, ApplicationStatus } from '../types';
import { 
    internships as dummyInternships, 
    applications as dummyApplications,
    reviews as dummyReviews,
    articles as dummyArticles,
    users as dummyUsers
} from '../data/dummyData';

interface DataContextType {
  internships: Internship[];
  applications: Application[];
  articles: ResourceArticle[];
  reviews: Review[];
  addInternship: (internship: Omit<Internship, 'id' | 'companyName' | 'companyId'>, companyId: number) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  getReviewsForCompany: (companyId: number) => Review[];
  updateApplicationStatus: (applicationId: number, status: Application['status']) => void;
  deleteInternship: (internshipId: number) => void;
  getApplicationsForCompany: (companyId: number) => Application[];
  applyForInternship: (application: Omit<Application, 'id' | 'status' | 'applicationDate'>) => void;
  getStudentApplications: (studentId: number) => Application[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [internships, setInternships] = useState<Internship[]>(dummyInternships);
    const [applications, setApplications] = useState<Application[]>(dummyApplications);
    const [reviews, setReviews] = useState<Review[]>(dummyReviews);
    const articles = dummyArticles; // Static for now

    const addInternship = useCallback((internshipData: Omit<Internship, 'id' | 'companyName' | 'companyId'>, companyId: number) => {
        const company = dummyUsers.find(u => u.id === companyId);
        if (!company) return;

        const newInternship: Internship = {
            id: Math.max(...internships.map(i => i.id), 0) + 1,
            companyName: company.name,
            companyId: company.id,
            ...internshipData
        };
        setInternships(prev => [...prev, newInternship]);
    }, [internships]);

    const addReview = useCallback((reviewData: Omit<Review, 'id'>) => {
        const newReview: Review = {
            id: Math.max(...reviews.map(r => r.id || 0), 0) + 1,
            ...reviewData
        };
        setReviews(prev => [...prev, newReview]);
    }, [reviews]);
    
    const getReviewsForCompany = useCallback((companyId: number) => {
        return reviews.filter(r => r.companyId === companyId);
    }, [reviews]);

    const updateApplicationStatus = useCallback((applicationId: number, status: Application['status']) => {
        setApplications(prev => prev.map(app => 
            app.id === applicationId ? { ...app, status } : app
        ));
    }, []);

    const deleteInternship = useCallback((internshipId: number) => {
        setInternships(prev => prev.filter(i => i.id !== internshipId));
        setApplications(prev => prev.filter(a => a.internshipId !== internshipId));
    }, []);
    
    const getApplicationsForCompany = useCallback((companyId: number) => {
        const companyInternshipIds = new Set(internships.filter(i => i.companyId === companyId).map(i => i.id));
        return applications
            .filter(app => companyInternshipIds.has(app.internshipId))
            .map(app => ({
                ...app,
                student: dummyUsers.find(u => u.id === app.studentId)
            }));
    }, [applications, internships]);

    const applyForInternship = useCallback((applicationData: Omit<Application, 'id' | 'status' | 'applicationDate'>) => {
        const newApplication: Application = {
            id: Math.max(...applications.map(a => a.id), 0) + 1,
            status: ApplicationStatus.APPLIED,
            applicationDate: new Date().toISOString().split('T')[0],
            ...applicationData
        };
        setApplications(prev => [...prev, newApplication]);
    }, [applications]);

    const getStudentApplications = useCallback((studentId: number) => {
        return applications
            .filter(app => app.studentId === studentId)
            .map(app => ({
                ...app,
                internship: internships.find(i => i.id === app.internshipId)
            }));
    }, [applications, internships]);

    return (
        <DataContext.Provider value={{ 
            internships, 
            applications, 
            articles, 
            reviews,
            addInternship,
            addReview,
            getReviewsForCompany,
            updateApplicationStatus,
            deleteInternship,
            getApplicationsForCompany,
            applyForInternship,
            getStudentApplications
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
