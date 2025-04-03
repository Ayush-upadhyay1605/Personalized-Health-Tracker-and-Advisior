import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleComponent, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  email: string;
}

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const handleConfirmAppointment = async () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to pick a date for your appointment.",
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

  const handleBookAppointment = async () => {
    if (!selectedDate || !doctor || !user) return;

    try {
      const insertAppointment = {
        user_id: user.id,
        doctor_name: doctor.name,
        hospital: doctor.hospital,
        appointment_date: selectedDate.toISOString(),
        status: 'pending',
        doctor_email: doctor.email, // Add doctor's email
        patient_name: user.user_metadata.full_name || user.email, // Add patient name
        patient_email: user.email // Add patient email
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
      setIsDialogOpen(false);
    }
  };

  if (!doctor) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name: {doctor.name}</p>
          <p>Specialty: {doctor.specialty}</p>
          <p>Hospital: {doctor.hospital}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DatePicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border shadow-sm"
          />
          {selectedDate ? (
            <p>Selected Date: {format(selectedDate, 'PPP')}</p>
          ) : (
            <p>Please select a date.</p>
          )}
        </CardContent>
      </Card>
      
      <Button onClick={handleConfirmAppointment} className="mt-4 bg-health-primary text-white hover:bg-health-primary/90">
        Confirm Appointment
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitleComponent>Confirm Booking</DialogTitleComponent>
            <DialogDescription>
              Are you sure you want to book an appointment with {doctor.name} on{' '}
              {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Doctor Name
              </Label>
              <Input id="name" value={doctor.name} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                value={selectedDate ? format(selectedDate, 'PPP') : 'N/A'}
                className="col-span-3"
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
