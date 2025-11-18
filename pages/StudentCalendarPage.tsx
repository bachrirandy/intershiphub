import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Internship } from '../types';
import Calendar from '../components/Calendar';
import { StudentDashboardContextType } from './StudentDashboard';

const StudentCalendarPage: React.FC = () => {
    const outletContext = useOutletContext() as StudentDashboardContextType;
    const { internships } = useData();

    if (!outletContext) {
        return null; // or a loading spinner
    }
    const { setSelectedInternship } = outletContext;
    
    return <Calendar internships={internships} onEventClick={setSelectedInternship} />;
};

export default StudentCalendarPage;