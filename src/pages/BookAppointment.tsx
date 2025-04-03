
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MessageCircle, Video, MapPin, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Doctor } from '@/types/doctor';
import { initiatePayment } from '@/services/paymentService';

interface ConsultationType {
  type: 'video' | 'chat' | 'inPerson';
  label: string;
  icon: React.ComponentType;
  fee: string;
}

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [consultationType, setConsultationType] = useState<'video' | 'chat' | 'inPerson'>('inPerson');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract doctor data from location state
    if (location.state && location.state.doctor) {
      setDoctor(location.state.doctor);
    } else {
      // Redirect to doctor search if no doctor is selected
      navigate('/doctor-search');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        // Redirect to welcome page if not logged in
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const getConsultationFee = () => {
    if (!doctor || !doctor.consultationTypes) return '0';
    
    switch (consultationType) {
      case 'video':
        return doctor.consultationTypes.video?.fee || '0';
      case 'chat':
        return doctor.consultationTypes.chat?.fee || '0';
      case 'inPerson':
        return doctor.consultationTypes.inPerson?.fee || '0';
      default:
        return '0';
    }
  };

  // Convert fee string to number for Razorpay (in paisa)
  const getFeeAmount = () => {
    const feeString = getConsultationFee().replace('$', '');
    return parseInt(feeString) * 100; // Convert to paisa
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to pick a date for your appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Please select a time slot",
        description: "You need to select a time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!doctor || !user) {
      toast({
        title: "Error",
        description: "Doctor or user information is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePayment = () => {
    if (!doctor || !user) return;
    
    setIsLoading(true);
    
    initiatePayment({
      amount: getFeeAmount(),
      name: "HealthCare App",
      description: `Appointment with ${doctor.name}`,
      email: user.email,
      successCallback: (response) => {
        console.log('Payment successful', response);
        handleBookAppointment(response.razorpay_payment_id);
      },
      failureCallback: (error) => {
        console.error('Payment failed', error);
        toast({
          title: "Payment failed",
          description: error.description || "There was an error processing your payment.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    });
  };

  const handleBookAppointment = async (paymentId?: string) => {
    if (!selectedDate || !doctor || !user) return;
    
    try {
      setIsLoading(true);
      
      // Combine date and time
      const appointmentDateTime = new Date(selectedDate);
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        appointmentDateTime.setHours(hours, minutes);
      }

      // Create metadata object for additional fields not in the table schema
      const metadata = {
        doctor_email: doctor.email,
        patient_name: user.user_metadata?.full_name || user.email,
        patient_email: user.email
      };

      const insertAppointment = {
        user_id: user.id,
        doctor_name: doctor.name,
        hospital: doctor.hospital,
        appointment_date: appointmentDateTime.toISOString(),
        status: 'confirmed',
        payment_status: paymentId ? 'paid' : 'pending',
        payment_id: paymentId || null,
        consultation_type: consultationType,
        fee_amount: getFeeAmount() / 100, // Store in dollars/rupees, not paisa
      };
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([insertAppointment]);

      if (error) {
        throw error;
      }

      toast({
        title: "Appointment booked",
        description: "Your appointment has been successfully booked.",
      });
      navigate('/appointments');
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const consultationTypes: ConsultationType[] = [
    { 
      type: 'video', 
      label: 'Video Consultation', 
      icon: Video,
      fee: doctor?.consultationTypes?.video?.fee || '$0'
    },
    { 
      type: 'chat', 
      label: 'Chat Consultation', 
      icon: MessageCircle,
      fee: doctor?.consultationTypes?.chat?.fee || '$0'
    },
    { 
      type: 'inPerson', 
      label: 'In-Person Visit', 
      icon: MapPin,
      fee: doctor?.consultationTypes?.inPerson?.fee || '$0'
    }
  ];

  if (!doctor) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="bg-health-primary/5">
                <CardTitle>Doctor Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={doctor.image || '/placeholder.svg'} 
                      alt={doctor.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-sm flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <span>{doctor.hospital}<br/>{doctor.location}</span>
                  </p>
                  
                  {doctor.rating && (
                    <p className="text-sm flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-400" />
                      <span>{doctor.rating} Rating</span>
                    </p>
                  )}
                </div>
                
                {doctor.bio && (
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">About Doctor</h4>
                    <p className="text-sm text-gray-600">{doctor.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Consultation Type</CardTitle>
                <CardDescription>How would you like to consult with the doctor?</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue={consultationType} 
                  onValueChange={(value) => setConsultationType(value as 'video' | 'chat' | 'inPerson')}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    {consultationTypes.map((type) => (
                      <TabsTrigger 
                        key={type.type} 
                        value={type.type}
                        disabled={!doctor.consultationTypes?.[type.type]?.available}
                      >
                        <type.icon className="h-4 w-4 mr-2" />
                        {type.type === 'inPerson' ? 'In-Person' : type.type === 'video' ? 'Video' : 'Chat'}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {consultationTypes.map((type) => (
                    <TabsContent key={type.type} value={type.type} className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{type.label}</h3>
                          <p className="text-sm text-gray-600">
                            {type.type === 'video' ? 'Face-to-face video consultation' : 
                             type.type === 'chat' ? 'Text-based chat consultation' : 
                             'Visit the doctor at the hospital'}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-health-primary">
                          {type.fee}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose your preferred appointment slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block mb-2">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Time Slot</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`text-xs py-1 px-2 h-auto ${selectedTime === time ? 'bg-health-primary text-white' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee:</p>
                  <p className="text-lg font-semibold text-health-primary">{getConsultationFee()}</p>
                </div>
                <Button 
                  onClick={handleConfirmAppointment} 
                  className="bg-health-primary text-white hover:bg-health-primary/90"
                  disabled={!selectedDate || !selectedTime}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitleComponent>Confirm Booking</DialogTitleComponent>
            <DialogDescription>
              Review your appointment details before proceeding with payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-health-primary/20 rounded-full flex items-center justify-center mr-3">
                  <div className="w-6 h-6 bg-health-primary rounded-full flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}
                      {selectedTime ? `, ${selectedTime}` : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  {consultationType === 'video' ? (
                    <Video className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  ) : consultationType === 'chat' ? (
                    <MessageCircle className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">Consultation Type</p>
                    <p className="text-gray-600">
                      {consultationType === 'video' ? 'Video Call' : 
                       consultationType === 'chat' ? 'Chat' : 'In-Person Visit'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-semibold text-health-primary">{getConsultationFee()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-health-primary hover:bg-health-primary/90"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay & Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
