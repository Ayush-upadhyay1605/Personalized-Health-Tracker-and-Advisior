
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Clock, DollarSign, MessageCircle, Video } from 'lucide-react';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();

  const handleBookAppointment = (doctor: Doctor) => {
    navigate('/book-appointment', { state: { doctor } });
  };

  return (
    <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
              
              <div className="flex flex-wrap items-center mt-2 gap-3">
                {doctor.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{doctor.rating}</span>
                  </div>
                )}
                
                {doctor.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{doctor.location}</span>
                  </div>
                )}
                
                {doctor.fee && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">From {doctor.fee}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.consultationTypes?.video?.available && (
                  <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    <span>Video {doctor.consultationTypes.video.fee}</span>
                  </div>
                )}
                
                {doctor.consultationTypes?.chat?.available && (
                  <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span>Chat {doctor.consultationTypes.chat.fee}</span>
                  </div>
                )}
                
                {doctor.consultationTypes?.inPerson?.available && (
                  <div className="flex items-center bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>In-person {doctor.consultationTypes.inPerson.fee}</span>
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
  );
};

export default DoctorCard;
