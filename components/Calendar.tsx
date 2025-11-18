import React, { useState, useMemo } from 'react';
import { Internship } from '../types';

// Icons
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;

interface CalendarProps {
    internships: Internship[];
    onEventClick: (internship: Internship) => void;
}

const Calendar: React.FC<CalendarProps> = ({ internships, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid month skipping issues
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const eventColors = ['bg-[#0074E4]', 'bg-[#264E86]', 'bg-[#74DBEF]'];

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`blank-${i}`} className="border border-gray-200 bg-gray-50"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = new Date(year, month, day);
            
            const internshipsOnThisDay = internships.filter(i => {
                const startDate = new Date(i.postedDate);
                startDate.setHours(0,0,0,0);
                const endDate = new Date(i.closingDate);
                endDate.setHours(0,0,0,0);
                return currentDayDate >= startDate && currentDayDate <= endDate;
            });

            days.push(
                <div key={day} className="border border-gray-200 p-1.5 h-32 flex flex-col relative">
                    <span className="font-medium text-sm text-[#264E86]">{day}</span>
                    <div className="flex-grow space-y-1 mt-1 overflow-y-auto">
                        {internshipsOnThisDay.map((internship, index) => (
                            <button
                                key={internship.id}
                                onClick={() => onEventClick(internship)}
                                className={`w-full text-left p-1 text-xs font-semibold text-white ${eventColors[internship.id % eventColors.length]} rounded hover:opacity-80 truncate transition-opacity flex items-center`}
                            >
                                <div className="w-2 h-2 bg-white/80 rounded-full mr-1.5 flex-shrink-0"></div>
                                <span className="truncate">{internship.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-[#EFF0F4] text-[#264E86]"><ChevronLeftIcon/></button>
                <h2 className="text-2xl font-bold text-[#264E86]">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-[#EFF0F4] text-[#264E86]"><ChevronRightIcon/></button>
            </div>
            <div className="grid grid-cols-7">
                {weekdays.map(day => <div key={day} className="text-center font-bold text-[#264E86]/80 p-2 border-b-2 border-gray-200">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 min-h-[48rem]">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default Calendar;