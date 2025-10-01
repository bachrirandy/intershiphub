
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Internship, Application, ApplicationStatus, User, Role } from '../types';
import { internships as initialInternships, applications as initialApplications, users } from '../data/dummyData';

interface DataContextType {
  internships: Internship[];
  applications: Application[];
  getApplicationsForCompany: (companyId: number) => (Application & { student: User | undefined, internship: Internship | undefined })[];
  getApplicationsForStudent: (studentId: number) => (Application & { internship: Internship | undefined })[];
  applyForInternship: (studentId: number, internshipId: number) => boolean;
  addInternship: (internship: Omit<Internship, 'id' | 'companyName'>, companyId: number) => void;
  deleteInternship: (internshipId: number) => void;
  updateApplicationStatus: (applicationId: number, status: ApplicationStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [internships, setInternships] = useState<Internship[]>(initialInternships);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const addInternship = useCallback((internshipData: Omit<Internship, 'id' | 'companyName'>, companyId: number) => {
    const company = users.find(u => u.id === companyId && u.role === Role.COMPANY);
    if (!company) return;

    const newInternship: Internship = {
      id: internships.length > 0 ? Math.max(...internships.map(i => i.id)) + 1 : 1,
      ...internshipData,
      companyId,
      companyName: company.name
    };
    setInternships(prev => [...prev, newInternship]);
  }, [internships]);

  const deleteInternship = useCallback((internshipId: number) => {
    setInternships(prev => prev.filter(i => i.id !== internshipId));
    // Also remove related applications for data consistency
    setApplications(prev => prev.filter(a => a.internshipId !== internshipId));
  }, []);

  const applyForInternship = useCallback((studentId: number, internshipId: number) => {
    const alreadyApplied = applications.some(app => app.studentId === studentId && app.internshipId === internshipId);
    if (alreadyApplied) return false;

    const newApplication: Application = {
      id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1,
      studentId,
      internshipId,
      status: ApplicationStatus.APPLIED
    };
    setApplications(prev => [...prev, newApplication]);
    return true;
  }, [applications]);

  const updateApplicationStatus = useCallback((applicationId: number, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status } : app));
  }, []);
  
  const getApplicationsForCompany = useCallback((companyId: number) => {
    const companyInternshipIds = internships.filter(i => i.companyId === companyId).map(i => i.id);
    return applications
      .filter(app => companyInternshipIds.includes(app.internshipId))
      .map(app => ({
        ...app,
        student: users.find(u => u.id === app.studentId),
        internship: internships.find(i => i.id === app.internshipId)
      }));
  }, [applications, internships]);

  const getApplicationsForStudent = useCallback((studentId: number) => {
    return applications
      .filter(app => app.studentId === studentId)
      .map(app => ({
        ...app,
        internship: internships.find(i => i.id === app.internshipId)
      }));
  }, [applications, internships]);

  return (
    <DataContext.Provider value={{ internships, applications, getApplicationsForCompany, getApplicationsForStudent, applyForInternship, addInternship, deleteInternship, updateApplicationStatus }}>
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