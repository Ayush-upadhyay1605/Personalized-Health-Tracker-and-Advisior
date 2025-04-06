import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, Star, Filter, 
  Clock, Video, MessageSquare, Locate, MapIcon, ListFilter 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DoctorVideoCall from '@/components/DoctorVideoCall';
import DoctorChat from '@/components/DoctorChat';
import { GoogleMap, useLoadScript, Marker, InfoWindow, Libraries } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BackToHomeButton from '@/components/navigation/BackToHomeButton';

const DoctorSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [mapCenter, setMapCenter] = useState({
    lat: 37.7749,
    lng: -122.4194
  });
  const [selectedMapDoctor, setSelectedMapDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

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
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    // ... rest of doctors data
  ];

  const specialties = [
    'All', 
    'Cardiologist', 
    'Dermatologist', 
    'Gynecologist', 
    'Neurologist', 
    'Pediatrician', 
    'Orthopedic',
    'Ophthalmologist',
    'Psychiatrist',
    'Endocrinologist',
    'Allergist',
    'Urologist',
    'Oncologist',
    'Rheumatologist',
    'Hematologist'
  ];

  const libraries: Libraries = ['places'];

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '0.5rem'
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY",
    libraries: libraries
  });

  const getUserLocation = useCallback(() => {
    setLocationStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          setMapCenter(userCoords);
          setLocationStatus('success');
          
          toast({
            title: "Location detected",
            description: "Showing doctors near your location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
          
          toast({
            title: "Location error",
            description: "Could not access your location. Please enable location services.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationStatus('unsupported');
      
      toast({
        title: "Location unavailable",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
  }, []);

  const getSortedDoctorsByDistance = useCallback(() => {
    if (!userLocation) return [...doctors];
    
    return [...doctors].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        a.coordinates.lat, 
        a.coordinates.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        b.coordinates.lat, 
        b.coordinates.lng
      );
      return distanceA - distanceB;
    });
  }, [userLocation, calculateDistance]);

  const getFilteredDoctors = useCallback(() => {
    let filtered = getSortedDoctorsByDistance();
    
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.location.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [getSortedDoctorsByDistance, selectedSpecialty, searchQuery]);

  const getNearbyDoctors = useCallback(() => {
    if (!userLocation) return [];
    
    return getSortedDoctorsByDistance().filter(doctor => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        doctor.coordinates.lat,
        doctor.coordinates.lng
      );
      return distance <= 50;
    });
  }, [userLocation, getSortedDoctorsByDistance, calculateDistance]);

  const getOnlineDoctors = useCallback(() => {
    return getFilteredDoctors().filter(doctor => doctor.id % 2 === 0);
  }, [getFilteredDoctors]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'nearby' && !userLocation) {
      getUserLocation();
    }
  };

  const handleBookAppointment = async (doctor) => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    navigate('/book-appointment');
  };

  const handleVideoCall = (doctor) => {
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

  const DoctorCard = ({ doctor, showDistance = false }) => {
    const distanceText = showDistance && userLocation ? 
      `${calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        doctor.coordinates.lat, 
        doctor.coordinates.lng
      ).toFixed(1)} km away` : '';

    return (
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
                <div className="flex flex-col items-end gap-1">
                  {doctor.availableToday && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Available Today
                    </span>
                  )}
                  {showDistance && distanceText && (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {distanceText}
                    </span>
                  )}
                </div>
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
    );
  };

  const OnlineDoctorCard = ({ doctor }) => (
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
  );

  const renderMapSection = () => {
    if (loadError) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Error loading Google Maps. Please try again later.</AlertDescription>
        </Alert>
      );
    }

    if (!isLoaded) {
      return <Skeleton className="w-full h-[500px] rounded-lg" />;
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Doctors Near You</h3>
          <Button 
            onClick={getUserLocation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Locate className="h-4 w-4" />
            {locationStatus === 'loading' ? 'Getting location...' : 'Update My Location'}
          </Button>
        </div>
        
        <div className="relative rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={10}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                }}
                label={{
                  text: "You",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            )}
            
            {getNearbyDoctors().map((doctor) => (
              <Marker
                key={`marker-${doctor.id}`}
                position={doctor.coordinates}
                onClick={() => setSelectedMapDoctor(doctor)}
              />
            ))}
            
            {selectedMapDoctor && (
              <InfoWindow
                position={selectedMapDoctor.coordinates}
                onCloseClick={() => setSelectedMapDoctor(null)}
              >
                <div className="max-w-[280px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={selectedMapDoctor.image} 
                      alt={selectedMapDoctor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-sm">{selectedMapDoctor.name}</h3>
                      <p className="text-xs text-gray-500">{selectedMapDoctor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-1">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    {selectedMapDoctor.location}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">{selectedMapDoctor.fee}</span>
                    <Button 
                      size="sm" 
                      className="h-8 bg-health-primary text-xs"
                      onClick={() => handleBookAppointment(selectedMapDoctor)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        
        <div className="mt-6 space-y-4">
          {userLocation ? (
            getNearbyDoctors().length > 0 ? (
              <>
                <h3 className="text-lg font-medium">Doctors within 50km ({getNearbyDoctors().length})</h3>
                {getNearbyDoctors().map(doctor => (
                  <DoctorCard key={`nearby-list-${doctor.id}`} doctor={doctor} showDistance={true} />
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No doctors found nearby</h3>
                <p className="text-gray-500 mb-4">Try expanding your search or check other doctors below</p>
                {getFilteredDoctors().length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Other Available Doctors</h3>
                    {getFilteredDoctors().slice(0, 3).map(doctor => (
                      <DoctorCard key={`other-${doctor.id}`} doctor={doctor} showDistance={true} />
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Enable Location Access</h3>
              <p className="text-gray-500 mb-4">Allow location access to see doctors near you</p>
              <Button onClick={getUserLocation} className="bg-health-primary hover:bg-health-primary/90">
                Enable Location
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
            <BackToHomeButton />
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
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {specialties.map(specialty => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                className={`rounded-full ${
                  selectedSpecialty === specialty
                    ? "bg-health-primary text-white"
                    : "border-gray-300 text-gray-700"
                } whitespace-nowrap`}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Doctors</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="online">Online Consultation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Available Doctors</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Sort by
              </Button>
            </div>
            
            <div className="space-y-4">
              {getFilteredDoctors().length > 0 ? (
                getFilteredDoctors().map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="nearby" className="space-y-6">
            {renderMapSection()}
          </TabsContent>
          
          <TabsContent value="online" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Online Consultation</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1 text-green-500" />
                <span>Available now</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {getOnlineDoctors().length > 0 ? (
                getOnlineDoctors().map(doctor => (
                  <OnlineDoctorCard key={`online-${doctor.id}`} doctor={doctor} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No online doctors available</h3>
                  <p className="text-gray-500">Check back later or try a different specialty</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {isVideoCallOpen && selectedDoctor && (
        <DoctorVideoCall 
          doctorName={selectedDoctor.name}
          doctorImage={selectedDoctor.image}
          open={isVideoCallOpen}
          onOpenChange={setIsVideoCallOpen}
        />
      )}
      
      {isChatOpen && selectedDoctor && (
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
