
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
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define libraries as a string array, which is the correct type for @react-google-maps/api
const libraries = ['places'];

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

// Center on US by default
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

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
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedMapDoctor, setSelectedMapDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Enhanced mock data for doctors with location coordinates
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
      coordinates: { lat: 40.7128, lng: -74.0060 } // New York
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
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 42.3601, lng: -71.0589 } // Boston
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
      image: 'https://images.unsplash.com/photo-1594824476811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 41.8781, lng: -87.6298 } // Chicago
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
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 47.6062, lng: -122.3321 } // Seattle
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
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 37.7749, lng: -122.4194 } // San Francisco
    },
    {
      id: 6,
      name: 'Dr. Robert Lee',
      specialty: 'Orthopedic',
      experience: '16 years',
      location: 'Joint Care Center, Los Angeles',
      rating: 4.7,
      reviews: 115,
      fee: '$175',
      availableToday: true,
      image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 34.0522, lng: -118.2437 } // Los Angeles
    },
    {
      id: 7,
      name: 'Dr. Maria Gonzalez',
      specialty: 'Cardiologist',
      experience: '18 years',
      location: 'Heart Center, Miami',
      rating: 4.9,
      reviews: 167,
      fee: '$190',
      availableToday: false,
      image: 'https://images.unsplash.com/photo-1594824476811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      coordinates: { lat: 25.7617, lng: -80.1918 } // Miami
    }
  ];

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // Replace with actual API key
    libraries: libraries
  });

  // Specialties list
  const specialties = [
    'All', 
    'Cardiologist', 
    'Dermatologist', 
    'Gynecologist', 
    'Neurologist', 
    'Pediatrician', 
    'Orthopedic'
  ];

  // Get user's location
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
          
          // Show success toast
          toast({
            title: "Location detected",
            description: "Showing doctors near your location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
          
          // Show error toast
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
      
      // Show error toast
      toast({
        title: "Location unavailable",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }, []);

  // Sort doctors by distance from user
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

  // Filter doctors based on search and specialty
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

  // Filter for nearby doctors (within 50km)
  const getNearbyDoctors = useCallback(() => {
    if (!userLocation) return [];
    
    return getSortedDoctorsByDistance().filter(doctor => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        doctor.coordinates.lat,
        doctor.coordinates.lng
      );
      return distance <= 50; // 50km radius
    });
  }, [userLocation, getSortedDoctorsByDistance, calculateDistance]);
  
  // Get online consultation doctors
  const getOnlineDoctors = useCallback(() => {
    return getFilteredDoctors().filter(doctor => doctor.id % 2 === 0);
  }, [getFilteredDoctors]);

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'nearby' && !userLocation) {
      getUserLocation();
    }
  };

  // Appointment booking handler
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

  // Video call handler
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

  // Chat handler
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

  // Doctor card component to avoid repetition
  const DoctorCard = ({ doctor, showDistance = false }) => {
    // Calculate and format distance if user location is available
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

  // Online doctor card component
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

  // Map content component
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
            {/* User location marker */}
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
            
            {/* Doctor markers */}
            {getNearbyDoctors().map((doctor) => (
              <Marker
                key={`marker-${doctor.id}`}
                position={doctor.coordinates}
                onClick={() => setSelectedMapDoctor(doctor)}
              />
            ))}
            
            {/* Info window for selected doctor */}
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
        
        {/* List of nearby doctors */}
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
            
            {/* Location section */}
            {userLocation && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Your Location</h3>
                <div className="bg-blue-50 p-2 rounded-md flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    Location detected
                    <Button 
                      variant="link" 
                      className="text-xs p-0 h-auto text-blue-600"
                      onClick={getUserLocation}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Doctors</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
                <TabsTrigger value="online">Online Consultation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="text-sm text-gray-500 mb-2">
                  {getFilteredDoctors().length} doctors found
                  {userLocation && (
                    <span className="ml-2 text-blue-600">
                      (sorted by distance)
                    </span>
                  )}
                </div>
                
                {getFilteredDoctors().length > 0 ? (
                  getFilteredDoctors().map((doctor) => (
                    <DoctorCard 
                      key={`all-${doctor.id}`} 
                      doctor={doctor}
                      showDistance={!!userLocation} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ListFilter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="nearby">
                {renderMapSection()}
              </TabsContent>
              
              <TabsContent value="online" className="space-y-4">
                {getOnlineDoctors().length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500 mb-2">
                      {getOnlineDoctors().length} doctors available for online consultation
                    </div>
                    
                    {getOnlineDoctors().map((doctor) => (
                      <OnlineDoctorCard key={`online-${doctor.id}`} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No online doctors available</h3>
                    <p className="text-gray-500">Try again later or check other options</p>
                  </div>
                )}
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
