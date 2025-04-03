
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorFilter from '@/components/doctor-search/DoctorFilter';
import DoctorList from '@/components/doctor-search/DoctorList';
import { fetchDoctors } from '@/services/doctorService';
import { Doctor } from '@/types/doctor';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [location, setLocation] = useState('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      const doctorData = await fetchDoctors();
      setDoctors(doctorData);
      setLoading(false);
    };
    
    loadDoctors();
  }, []);

  const handleSearch = () => {
    // Filter doctors based on search criteria
    // In a real app, this would query the database
    console.log('Searching for:', searchTerm, specialty, location);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty;
    const matchesLocation = location === 'all' || doctor.location?.includes(location);
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const specialties = ['Cardiology', 'Dermatology', 'General Medicine', 'Neurology', 'Pediatrics', 'Psychiatry'];
  const locations = ['New York, NY', 'Boston, MA', 'San Francisco, CA', 'Chicago, IL', 'Los Angeles, CA'];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>
        
        <DoctorFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          specialty={specialty}
          setSpecialty={setSpecialty}
          location={location}
          setLocation={setLocation}
          handleSearch={handleSearch}
          specialties={specialties}
          locations={locations}
        />
        
        <DoctorList 
          loading={loading} 
          filteredDoctors={filteredDoctors} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default DoctorSearch;
