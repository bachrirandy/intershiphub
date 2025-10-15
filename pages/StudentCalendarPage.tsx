import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Internship } from '../types';
import Calendar from '../components/Calendar';
import { StudentDashboardContextType } from './StudentDashboard';

const StudentCalendarPage: React.FC = () => {
    const { setSelectedInternship } = useOutletContext<StudentDashboardContextType>();
    const { internships } = useData();
    return <Calendar internships={internships} onEventClick={setSelectedInternship} />;
};

export default StudentCalendarPage;