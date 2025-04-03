
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';

const SampleAppointmentsSetup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const createSampleAppointment = async () => {
    setIsLoading(true);
    try {
      // Create a sample appointment between patient and doctor
      const tomorrowDate = addDays(new Date(), 1);
      
      // This is the mock data for our sample appointment
      const appointmentData = {
        user_id: 'patient_user_id', // This will be updated in the function
        doctor_name: 'Dr. Sample',
        hospital: 'General Hospital',
        appointment_date: tomorrowDate.toISOString(),
        status: 'confirmed',
      };
      
      // First, get the patient's user ID by email
      const { data: patientData, error: patientError } = await supabase
        .from('auth')
        .select('id')
        .eq('email', 'patient@example.com')
        .single();
        
      if (patientError) {
        // If we can't get the patient directly, let's try an alternative
        // Create the appointment with a placeholder user ID
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([{
            ...appointmentData,
            user_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          }]);
          
        if (insertError) throw insertError;
        
        toast({
          title: "Sample appointment created",
          description: "With placeholder user ID. Log in with both accounts to see it work properly.",
          variant: "default",
        });
      } else {
        // We found the patient, so use their actual user ID
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([{
            ...appointmentData,
            user_id: patientData.id,
          }]);
          
        if (insertError) throw insertError;
        
        toast({
          title: "Sample appointment created!",
          description: `Appointment on ${format(tomorrowDate, 'PPP')} has been added to the database.`,
        });
      }
      
      setIsCreated(true);
    } catch (error: any) {
      console.error('Error creating sample appointment:', error);
      toast({
        title: "Error creating appointment",
        description: error.message || "There was an error creating the sample appointment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50 mt-4">
      <h3 className="font-medium text-lg mb-2">Sample Appointment Setup</h3>
      <p className="text-sm text-gray-600 mb-4">
        Create a sample appointment between the patient and doctor accounts.
      </p>
      {isCreated ? (
        <div className="text-sm p-3 bg-green-50 text-green-800 rounded">
          <p className="font-semibold">Appointment created successfully!</p>
          <p>This appointment will appear in the doctor's dashboard and the patient's appointments page.</p>
        </div>
      ) : (
        <Button 
          onClick={createSampleAppointment} 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Creating..." : "Create Sample Appointment"}
        </Button>
      )}
    </div>
  );
};

export default SampleAppointmentsSetup;
