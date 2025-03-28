
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video, MessageSquare, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DoctorVideoCall from '@/components/DoctorVideoCall';
import DoctorChat from '@/components/DoctorChat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { loadRazorpay } from '@/utils/razorpay';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState('in-person');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    // Retrieve selected doctor from localStorage
    const storedDoctor = localStorage.getItem('selectedDoctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    } else {
      navigate('/doctor-search');
    }
  }, [navigate]);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Add two slots per hour (e.g., 9:00 and 9:30)
      ['00', '30'].forEach(minutes => {
        // Some random availability for demo purposes
        const isAvailable = Math.random() > 0.3;
        slots.push({
          time: `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`,
          available: isAvailable,
        });
      });
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      toast({
        title: "Please select a time",
        description: "You need to select an appointment time to continue",
        variant: "destructive",
      });
      return;
    }

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

    // Open payment dialog
    setIsPaymentDialogOpen(true);
  };

  const handlePayment = async (paymentMethod) => {
    setIsPaymentLoading(true);
    
    try {
      // Format date string for database
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.time.split(' ')[0].split(':');
      const isPM = selectedTime.time.includes('PM');
      
      let hour = parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      appointmentDate.setHours(hour, parseInt(minutes));

      // Get fee amount from doctor data
      const feeAmount = parseInt(doctor.fee.replace(/[^0-9]/g, ''));
      
      if (paymentMethod === 'razorpay') {
        await processRazorpayPayment(feeAmount, appointmentDate);
      } else {
        // For demo purposes, just proceed with booking for other payment methods
        await finalizeBooking(appointmentDate);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      toast({
        title: "Payment failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  const processRazorpayPayment = async (amount, appointmentDate) => {
    try {
      // Load Razorpay
      const razorpay = await loadRazorpay();
      
      // Get user data
      const { data: { session } } = await supabase.auth.getSession();
      const user = session.user;
      
      // Create Razorpay order options
      const options = {
        key: 'rzp_test_YourTestKey', // Replace with your actual Razorpay key
        amount: amount * 100, // Amount in smallest currency unit (paise for INR)
        currency: 'INR',
        name: 'HealthConnect',
        description: `Appointment with ${doctor.name}`,
        image: '/favicon.ico',
        prefill: {
          email: user.email,
          contact: '', // Would need to be fetched from user profile if available
        },
        theme: {
          color: '#3399cc'
        },
        handler: async function(response) {
          // Handle successful payment
          console.log('Payment successful:', response);
          
          // Finalize booking after successful payment
          await finalizeBooking(appointmentDate, response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function() {
            setIsPaymentLoading(false);
            setIsPaymentDialogOpen(false);
          }
        }
      };
      
      // Initialize and open Razorpay payment form
      const paymentObject = new razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      throw new Error('Failed to initialize payment gateway');
    }
  };

  const finalizeBooking = async (appointmentDate, paymentId = null) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Insert appointment into database
    const { error } = await supabase.from('appointments').insert({
      user_id: session.user.id,
      doctor_name: doctor.name, 
      appointment_date: appointmentDate.toISOString(),
      hospital: doctor.location,
      status: 'scheduled',
      payment_status: paymentId ? 'paid' : 'pending',
      payment_id: paymentId,
      consultation_type: consultationType,
      fee_amount: parseInt(doctor.fee.replace(/[^0-9]/g, ''))
    });

    if (error) throw error;

    toast({
      title: "Appointment booked!",
      description: `Your appointment with ${doctor.name} has been scheduled`,
    });

    setIsPaymentLoading(false);
    setIsPaymentDialogOpen(false);
    
    // Redirect to appointments page
    navigate('/appointments');
  };

  const nextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
    setSelectedTime(null);
  };

  const prevDay = () => {
    if (selectedDate > startOfDay(new Date())) {
      setSelectedDate(addDays(selectedDate, -1));
      setSelectedTime(null);
    }
  };

  const handleVideoCall = () => {
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
      
      setIsVideoCallOpen(true);
    });
  };

  const handleChat = () => {
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
      
      setIsChatOpen(true);
    });
  };

  if (!doctor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/doctor-search')}
              className="text-health-primary border-health-primary hover:bg-health-primary/10"
            >
              Back to Search
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Doctor Information */}
          <div className="w-full lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-lg">{doctor.name}</h3>
                    <p className="text-gray-500">{doctor.specialty}</p>
                    <p className="text-gray-500">{doctor.experience} experience</p>
                    <div className="mt-2 flex items-start gap-1">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{doctor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Consultation Options</h4>
                  <Tabs 
                    defaultValue="in-person" 
                    value={consultationType}
                    onValueChange={setConsultationType}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="in-person">In-Person</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>
                    <TabsContent value="in-person" className="mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium block">{doctor.fee}</span>
                          <span className="text-sm text-gray-500">Consultation Fee</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>30 min</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium block">${parseInt(doctor.fee.substring(1)) - 30}</span>
                          <span className="text-sm text-gray-500">Video Consultation</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600">
                          <Video className="h-4 w-4 mr-1" />
                          <span>20 min</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-health-primary hover:bg-health-primary/90"
                        onClick={handleVideoCall}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call Now
                      </Button>
                    </TabsContent>
                    <TabsContent value="chat" className="mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium block">${parseInt(doctor.fee.substring(1)) - 50}</span>
                          <span className="text-sm text-gray-500">Chat Consultation</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>24 hours</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-health-primary hover:bg-health-primary/90"
                        onClick={handleChat}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat Now
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Booking */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Choose Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Date Selection */}
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevDay}
                    disabled={selectedDate <= startOfDay(new Date())}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-health-primary mr-2" />
                    <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <Button variant="outline" size="icon" onClick={nextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="font-medium mb-3">Available Time Slots</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedTime === slot ? "default" : "outline"}
                        className={`${
                          !slot.available
                            ? "opacity-50 cursor-not-allowed"
                            : selectedTime === slot
                            ? "bg-health-primary hover:bg-health-primary/90"
                            : "hover:border-health-primary hover:text-health-primary"
                        }`}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="mt-8">
                  <Button 
                    className="w-full bg-health-primary hover:bg-health-primary/90 flex items-center justify-center gap-2"
                    onClick={handleBookAppointment}
                    disabled={!selectedTime || isLoading}
                  >
                    {isLoading ? "Booking..." : "Proceed to Payment"}
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    By booking this appointment, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Options</DialogTitle>
            <DialogDescription>
              Select a payment method to complete your booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-lg mb-2">Appointment Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Doctor:</span> {doctor.name}</p>
                <p><span className="text-gray-500">Date:</span> {format(selectedDate, 'MMMM d, yyyy')}</p>
                <p><span className="text-gray-500">Time:</span> {selectedTime?.time}</p>
                <p><span className="text-gray-500">Type:</span> {consultationType === 'in-person' ? 'In-Person Visit' : consultationType === 'video' ? 'Video Consultation' : 'Chat Consultation'}</p>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold text-lg">
                  {consultationType === 'in-person' 
                    ? doctor.fee 
                    : consultationType === 'video' 
                      ? `$${parseInt(doctor.fee.substring(1)) - 30}` 
                      : `$${parseInt(doctor.fee.substring(1)) - 50}`}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Select Payment Method</h3>
              
              <div 
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handlePayment('razorpay')}
              >
                <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-full mr-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Razorpay</p>
                  <p className="text-xs text-gray-500">Credit/Debit Card, UPI, Netbanking, Wallet</p>
                </div>
              </div>
              
              <div 
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handlePayment('cash')}
              >
                <div className="h-10 w-10 flex items-center justify-center bg-green-50 rounded-full mr-3">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Pay at Clinic</p>
                  <p className="text-xs text-gray-500">Cash, Card, or UPI accepted at the clinic</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={isPaymentLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <DoctorVideoCall 
        doctorName={doctor.name}
        doctorImage={doctor.image}
        open={isVideoCallOpen}
        onOpenChange={setIsVideoCallOpen}
      />

      {/* Chat Drawer */}
      <DoctorChat 
        doctorName={doctor.name}
        doctorImage={doctor.image}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
};

export default BookAppointment;
