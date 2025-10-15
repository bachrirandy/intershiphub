import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Internship } from '../types';
import InternshipCard from '../components/InternshipCard';
import { StudentDashboardContextType } from './StudentDashboard';

const StudentSearchPage: React.FC = () => {
    const { setSelectedInternship } = useOutletContext<StudentDashboardContextType>();
    const { internships } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [fieldFilter, setFieldFilter] = useState('');

    const handleApply = (internship: Internship) => {
        navigate(`/student/apply/${internship.id}`);
    };

    const filteredInternships = useMemo(() => {
        return internships.filter(internship => {
            const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  internship.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationFilter ? internship.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
            const matchesJobType = jobTypeFilter ? internship.jobType === jobTypeFilter : true;
            const matchesField = fieldFilter ? internship.field.toLowerCase().includes(fieldFilter.toLowerCase()) : true;

            return matchesSearch && matchesLocation && matchesJobType && matchesField;
        });
    }, [internships, searchTerm, locationFilter, jobTypeFilter, fieldFilter]);

    const uniqueLocations = useMemo(() => {
        const locations = new Set(internships.map(i => i.location));
        return Array.from(locations);
    }, [internships]);

    const uniqueFields = useMemo(() => {
        const fields = new Set(internships.map(i => i.field));
        return Array.from(fields);
    }, [internships]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Cari posisi atau perusahaan..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="md:col-span-2 w-full border bg-white border-gray-300 rounded-md shadow-sm p-2 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4]"
                    />
                    <select
                        value={locationFilter}
                        onChange={e => setLocationFilter(e.target.value)}
                         className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-2 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4]"
                    >
                        <option value="">Semua Lokasi</option>
                        {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                     <select
                        value={fieldFilter}
                        onChange={e => setFieldFilter(e.target.value)}
                         className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-2 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4]"
                    >
                        <option value="">Semua Bidang</option>
                        {uniqueFields.map(field => <option key={field} value={field}>{field}</option>)}
                    </select>
                    <select
                        value={jobTypeFilter}
                        onChange={e => setJobTypeFilter(e.target.value)}
                         className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-2 text-[#264E86] focus:outline-none focus:ring-2 focus:ring-[#0074E4]"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.length > 0 ? (
                    filteredInternships.map(internship => (
                        <InternshipCard
                            key={internship.id}
                            internship={internship}
                            onViewDetails={setSelectedInternship}
                            onApply={handleApply}
                        />
                    ))
                ) : (
                    <p className="md:col-span-3 text-center text-[#264E86]/80">
                        Tidak ada lowongan yang cocok dengan kriteria pencarian Anda.
                    </p>
                )}
            </div>
        </div>
    );
};

export default StudentSearchPage;