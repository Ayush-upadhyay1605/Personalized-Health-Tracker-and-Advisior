
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, MessageCircle, Video } from 'lucide-react';
import DoctorChat from '@/components/DoctorChat';
import DoctorVideoCall from '@/components/DoctorVideoCall';

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  status: string;
  hospital: string;
  patient_image?: string;
  patient_email?: string;
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatDoctor, setActiveChatDoctor] = useState<string | null>(null);
  const [activeVideoDoctor, setActiveVideoDoctor] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your dashboard",
            variant: "destructive",
          });
          return;
        }

        const user = session.session.user;
        const userEmail = user.email;
        
        // Get appointments where this doctor is assigned
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_email', userEmail)
          .order('appointment_date', { ascending: true });

        if (error) throw error;

        // Format the appointments
        const formattedAppointments = data.map((appointment) => ({
          id: appointment.id,
          patient_name: appointment.patient_name || 'Anonymous Patient',
          appointment_date: new Date(appointment.appointment_date).toLocaleString(),
          status: appointment.status,
          hospital: appointment.hospital,
          patient_image: appointment.patient_image || '/placeholder.svg',
          patient_email: appointment.patient_email,
        }));

        setAppointments(formattedAppointments);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error loading appointments",
          description: error.message || "Failed to load your appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  const handleStartChat = (appointment: Appointment) => {
    setActiveChatDoctor(appointment.patient_name);
    setIsChatOpen(true);
  };

  const handleStartVideoCall = (appointment: Appointment) => {
    setActiveVideoDoctor(appointment.patient_name);
    setIsVideoOpen(true);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
      
      {loading ? (
        <p>Loading your appointments...</p>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">You have no appointments scheduled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={appointment.patient_image} 
                          alt={appointment.patient_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{appointment.patient_name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{appointment.appointment_date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleStartChat(appointment)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleStartVideoCall(appointment)}
                        >
                          <Video className="h-4 w-4" />
                          Video
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex flex-wrap justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{appointment.hospital}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-2 md:mt-0">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Chat and Video Components */}
      {activeChatDoctor && (
        <DoctorChat
          doctorName={activeChatDoctor}
          doctorImage="/placeholder.svg"
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}
      
      {activeVideoDoctor && (
        <DoctorVideoCall
          doctorName={activeVideoDoctor}
          doctorImage="/placeholder.svg"
          open={isVideoOpen}
          onOpenChange={setIsVideoOpen}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
