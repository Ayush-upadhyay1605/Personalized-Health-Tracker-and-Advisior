
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  email: string;
  rating?: number;
  location?: string;
  image?: string;
  fee?: string;
  availability?: string[];
}

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [location, setLocation] = useState('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      
      try {
        // Query all users with role=doctor from Supabase
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          throw error;
        }
        
        // Filter users with role 'doctor' and map to our Doctor interface
        const doctorUsers = users
          .filter(user => user.user_metadata?.role === 'doctor')
          .map(user => ({
            id: user.id,
            name: user.user_metadata?.full_name || 'Unknown Doctor',
            specialty: user.user_metadata?.specialty || 'General Medicine',
            hospital: user.user_metadata?.hospital || 'Unknown Hospital',
            email: user.email || '',
            rating: 4.8, // Default rating for now
            location: user.user_metadata?.location || 'Unknown Location',
            image: user.user_metadata?.image || '/placeholder.svg',
            fee: user.user_metadata?.fee || '$100',
            availability: user.user_metadata?.availability || ['Today']
          }));
        
        // Our sample doctor data (always include it if no doctors found)
        const sampleDoctors: Doctor[] = [
          {
            id: '1',
            name: 'Dr. Sample',
            specialty: 'General Medicine',
            hospital: 'General Hospital',
            email: 'doctor@example.com',
            rating: 4.8,
            location: 'New York, NY',
            image: '/placeholder.svg',
            fee: '$100',
            availability: ['Today', 'Tomorrow']
          },
          {
            id: '2',
            name: 'Dr. Jane Smith',
            specialty: 'Cardiology',
            hospital: 'Heart Center',
            email: 'drjane@example.com',
            rating: 4.9,
            location: 'Boston, MA',
            image: '/placeholder.svg',
            fee: '$150',
            availability: ['Tomorrow']
          },
          {
            id: '3',
            name: 'Dr. Michael Wong',
            specialty: 'Pediatrics',
            hospital: 'Children\'s Hospital',
            email: 'drwong@example.com',
            rating: 4.7,
            location: 'San Francisco, CA',
            image: '/placeholder.svg',
            fee: '$120',
            availability: ['Today', 'Tomorrow']
          }
        ];
        
        // Combine real doctors with sample doctors
        // Only use sample doctors if no real doctors found
        const allDoctors = doctorUsers.length > 0 ? doctorUsers : sampleDoctors;
        setDoctors(allDoctors);
      } catch (error) {
        console.error('Error in doctor search:', error);
        // Fallback to sample data
        const sampleDoctors: Doctor[] = [
          {
            id: '1',
            name: 'Dr. Sample',
            specialty: 'General Medicine',
            hospital: 'General Hospital',
            email: 'doctor@example.com',
            rating: 4.8,
            location: 'New York, NY',
            image: '/placeholder.svg',
            fee: '$100',
            availability: ['Today', 'Tomorrow']
          },
          {
            id: '2',
            name: 'Dr. Jane Smith',
            specialty: 'Cardiology',
            hospital: 'Heart Center',
            email: 'drjane@example.com',
            rating: 4.9,
            location: 'Boston, MA',
            image: '/placeholder.svg',
            fee: '$150',
            availability: ['Tomorrow']
          },
          {
            id: '3',
            name: 'Dr. Michael Wong',
            specialty: 'Pediatrics',
            hospital: 'Children\'s Hospital',
            email: 'drwong@example.com',
            rating: 4.7,
            location: 'San Francisco, CA',
            image: '/placeholder.svg',
            fee: '$120',
            availability: ['Today', 'Tomorrow']
          }
        ];
        setDoctors(sampleDoctors);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    // Filter doctors based on search criteria
    // In a real app, this would query the database
    console.log('Searching for:', searchTerm, specialty, location);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    navigate('/book-appointment', { state: { doctor } });
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
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Doctor name or specialty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Any specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any specialty</SelectItem>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any location</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch} 
            className="mt-4 w-full md:w-auto bg-health-primary text-white hover:bg-health-primary/90"
          >
            Search Doctors
          </Button>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/4 p-6 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img 
                        src={doctor.image || '/placeholder.svg'} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{doctor.name}</h2>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <p className="text-gray-500">{doctor.hospital}</p>
                        
                        <div className="flex items-center mt-2">
                          {doctor.rating && (
                            <div className="flex items-center mr-4">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span>{doctor.rating}</span>
                            </div>
                          )}
                          
                          {doctor.location && (
                            <div className="flex items-center mr-4">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">{doctor.location}</span>
                            </div>
                          )}
                          
                          {doctor.fee && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">{doctor.fee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 space-y-2">
                        {doctor.availability?.includes('Today') && (
                          <div className="flex items-center text-green-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">Available Today</span>
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => handleBookAppointment(doctor)}
                          className="w-full bg-health-primary text-white hover:bg-health-primary/90"
                        >
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorSearch;
