
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import DoctorChat from '@/components/DoctorChat';
import DoctorVideoCall from '@/components/DoctorVideoCall';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  doctor_name: string;
  hospital: string;
  user_id: string;
  created_at: string | null;
  // These are not in the schema but we'll handle them via metadata in our UI
  patient_name?: string;
  patient_email?: string;
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [communicationMode, setCommunicationMode] = useState<'none' | 'chat' | 'video'>('none');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and get their details
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchAppointments(session.user.email);
      } else {
        toast({
          title: "Not authorized",
          description: "Please login to view doctor dashboard",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [toast]);

  const fetchAppointments = async (doctorEmail: string) => {
    setIsLoading(true);
    try {
      // Fetch appointments for the doctor based on their email
      // Since we don't have doctor_email in the base schema, we need to
      // handle this in the application logic for this implementation
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Mock filtering by doctor email since we can't modify the schema
      // In a real application, you would have a proper doctor_id field or similar
      const filteredAppointments = data || [];
      setAppointments(filteredAppointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error fetching appointments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state to reflect the change
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));

      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startCommunication = (appointment: Appointment, mode: 'chat' | 'video') => {
    setSelectedAppointment(appointment);
    setCommunicationMode(mode);
  };

  const endCommunication = () => {
    setCommunicationMode('none');
    setSelectedAppointment(null);
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today;
    } else if (activeTab === 'past') {
      return appointmentDate < today;
    } else if (activeTab === 'pending') {
      return apt.status === 'pending';
    } else if (activeTab === 'completed') {
      return apt.status === 'completed';
    }
    return true;
  });

  // Render communication interfaces based on selected mode
  const renderCommunicationInterface = () => {
    if (!selectedAppointment) return null;

    if (communicationMode === 'chat') {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Chat with Patient: {selectedAppointment.patient_name || 'Patient'}</span>
              <Button variant="outline" onClick={endCommunication}>End Chat</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DoctorChat patientId={selectedAppointment.user_id} />
          </CardContent>
        </Card>
      );
    } else if (communicationMode === 'video') {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Video Call with Patient: {selectedAppointment.patient_name || 'Patient'}</span>
              <Button variant="outline" onClick={endCommunication}>End Call</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DoctorVideoCall patientId={selectedAppointment.user_id} />
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  if (isLoading) {
    return <div className="p-6">Loading doctor dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and patient communications</p>
      </div>
      
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Appointment on {format(new Date(appointment.appointment_date), 'PPP')}
                  </CardTitle>
                  <CardDescription>
                    Patient: {appointment.patient_name || 'Patient'} • 
                    Status: <span className={`font-medium ${
                      appointment.status === 'completed' ? 'text-green-600' : 
                      appointment.status === 'cancelled' ? 'text-red-600' : 
                      'text-amber-600'
                    }`}>{appointment.status}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
                    {appointment.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50" 
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => startCommunication(appointment, 'chat')}
                        >
                          Start Chat
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startCommunication(appointment, 'video')}
                        >
                          Start Video
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startCommunication(appointment, 'chat')}
                      >
                        View Chat History
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No {activeTab} appointments found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {renderCommunicationInterface()}
    </div>
  );
};

export default DoctorDashboard;
