import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Internship } from '../types';
import Calendar from '../components/Calendar';
import { CompanyDashboardContextType } from './CompanyDashboard';

const CompanyCalendarPage: React.FC = () => {
    const { setSelectedInternship } = useOutletContext<CompanyDashboardContextType>();
    const { user } = useAuth();
    const { internships } = useData();

    const myInternships = useMemo(() => {
        return internships.filter(i => i.companyId === user?.id);
    }, [internships, user]);

    return (
        <Calendar 
            internships={myInternships} 
            onEventClick={(internship) => setSelectedInternship(internship)}
        />
    );
};

export default CompanyCalendarPage;