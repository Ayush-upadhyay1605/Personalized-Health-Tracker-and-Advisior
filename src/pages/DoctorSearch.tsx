import { useState, useEffect } from 'react';
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
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define libraries for Google Maps - fixed type error
import type { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
const libraries: Libraries = ['places'];

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

const fetchDoctors = async () => {
  // Replace with your API call to fetch doctors
  return [
    { id: 1, lat: 37.7749, lng: -122.4194, name: 'Dr. Smith' },
    { id: 2, lat: 37.7849, lng: -122.4294, name: 'Dr. Johnson' },
  ];
};

const DoctorSearch = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const { data: doctors, isLoading, error } = useQuery(['doctors'], fetchDoctors);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1>Doctor Search</h1>
      {isLoading && <Skeleton className="h-64 w-full" />}
      {error && (
        <Alert>
          <AlertDescription>Error loading doctors</AlertDescription>
        </Alert>
      )}
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={10}>
        {doctors?.map((doctor) => (
          <Marker key={doctor.id} position={{ lat: doctor.lat, lng: doctor.lng }} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default DoctorSearch;
