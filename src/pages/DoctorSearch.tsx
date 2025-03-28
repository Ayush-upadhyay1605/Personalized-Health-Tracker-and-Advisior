import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Star, Filter, Clock, Video, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DoctorVideoCall from '@/components/DoctorVideoCall';
import DoctorChat from '@/components/DoctorChat';

const DoctorSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Mock data for doctors
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      experience: '15 years',
      location: "Central Hospital, New York",
      rating: 4.8,
      reviews: 127,
      fee: '$150',
      availableToday: true,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      experience: '10 years',
      location: 'Skin Care Clinic, Boston',
      rating: 4.6,
      reviews: 89,
      fee: '$120',
      availableToday: true,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      experience: '12 years',
      location: "Children's Medical Center, Chicago",
      rating: 4.9,
      reviews: 156,
      fee: '$130',
      availableToday: false,
      image: 'https://images.unsplash.com/photo-1594824476811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Neurologist',
      experience: '20 years',
      location: 'Neuroscience Institute, Seattle',
      rating: 4.7,
      reviews: 113,
      fee: '$180',
      availableToday: false,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 5,
      name: 'Dr. Priya Patel',
      specialty: 'Gynecologist',
      experience: '14 years',
      location: "Women's Health Center, San Francisco",
      rating: 4.8,
      reviews: 142,
      fee: '$160',
      availableToday: true,
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];

  const specialties = [
    'All', 
    'Cardiologist', 
    'Dermatologist', 
    'Gynecologist', 
    'Neurologist', 
    'Pediatrician', 
    'Orthopedic'
  ];

  const filteredDoctors = doctors.filter(doctor => 
    (selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty) &&
    (searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookAppointment = async (doctor) => {
    // Check if user is logged in
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    // Store the selected doctor in localStorage for appointment page
    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    navigate('/book-appointment');
  };

  const handleVideoCall = (doctor) => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to start a video call",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedDoctor(doctor);
      setIsVideoCallOpen(true);
    });
  };

  const handleChat = (doctor) => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to chat with the doctor",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedDoctor(doctor);
      setIsChatOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-health-primary border-health-primary hover:bg-health-primary/10"
            >
              Back to Home
            </Button>
          </div>
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-health-primary focus:border-health-primary sm:text-sm"
              placeholder="Search doctors, specialties, clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium">Filters</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Specialties</h3>
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <input
                      type="radio"
                      id={specialty}
                      name="specialty"
                      checked={selectedSpecialty === specialty}
                      onChange={() => setSelectedSpecialty(specialty)}
                      className="h-4 w-4 text-health-primary focus:ring-health-primary"
                    />
                    <label htmlFor={specialty} className="ml-2 text-sm text-gray-700">
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available-today"
                    className="h-4 w-4 text-health-primary focus:ring-health-primary"
                  />
                  <label htmlFor="available-today" className="ml-2 text-sm text-gray-700">
                    Available Today
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available-tomorrow"
                    className="h-4 w-4 text-health-primary focus:ring-health-primary"
                  />
                  <label htmlFor="available-tomorrow" className="ml-2 text-sm text-gray-700">
                    Available Tomorrow
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Sort by</h3>
              <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-health-primary focus:border-health-primary sm:text-sm">
                <option>Relevance</option>
                <option>Experience: High to Low</option>
                <option>Fee: Low to High</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Doctors</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
                <TabsTrigger value="online">Online Consultation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="text-sm text-gray-500 mb-2">
                  {filteredDoctors.length} doctors found
                </div>
                
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 bg-gray-100">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-40 md:h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-500">{doctor.specialty}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                <span className="ml-1 text-sm text-gray-500">({doctor.reviews} reviews)</span>
                              </div>
                            </div>
                            {doctor.availableToday && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Available Today
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="flex items-start gap-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span>{doctor.location}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{doctor.experience} experience</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <span className="text-lg font-medium text-gray-900">{doctor.fee}</span>
                              <span className="text-sm text-gray-500 ml-1">consultation fee</span>
                            </div>
                            <Button 
                              onClick={() => handleBookAppointment(doctor)}
                              className="bg-health-primary hover:bg-health-primary/90"
                            >
                              Book Appointment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="nearby">
                <div className="bg-white p-6 rounded-lg text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enable Location Access</h3>
                  <p className="text-gray-500 mb-4">Allow location access to see doctors near you</p>
                  <Button className="bg-health-primary hover:bg-health-primary/90">
                    Enable Location
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="online">
                <div className="space-y-4">
                  {filteredDoctors
                    .filter(doctor => doctor.id % 2 === 0) // Just for demo, show some doctors as available online
                    .map((doctor) => (
                      <Card key={`online-${doctor.id}`} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 bg-gray-100">
                              <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-full h-40 md:h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                                  <div className="flex items-center mt-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                    <span className="ml-1 text-sm text-gray-500">({doctor.reviews} reviews)</span>
                                  </div>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Online Now
                                </span>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  <span>{doctor.experience} experience</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div>
                                  <span className="text-lg font-medium text-gray-900">${parseInt(doctor.fee.substring(1)) - 30}</span>
                                  <span className="text-sm text-gray-500 ml-1">video consultation</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline"
                                    className="border-health-primary text-health-primary hover:bg-health-primary/10"
                                    onClick={() => handleChat(doctor)}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Chat Now
                                  </Button>
                                  <Button 
                                    className="bg-health-primary hover:bg-health-primary/90"
                                    onClick={() => handleVideoCall(doctor)}
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Video Call
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {selectedDoctor && (
        <DoctorVideoCall 
          doctorName={selectedDoctor.name}
          doctorImage={selectedDoctor.image}
          open={isVideoCallOpen}
          onOpenChange={setIsVideoCallOpen}
        />
      )}

      {selectedDoctor && (
        <DoctorChat 
          doctorName={selectedDoctor.name}
          doctorImage={selectedDoctor.image}
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}
    </div>
  );
};

export default DoctorSearch;
