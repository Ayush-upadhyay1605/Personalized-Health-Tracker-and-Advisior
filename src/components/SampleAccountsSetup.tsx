
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SampleAccountsSetup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const createSampleAccounts = async () => {
    setIsLoading(true);
    try {
      // Create patient account
      const { error: patientError } = await supabase.auth.signUp({
        email: 'patient@example.com',
        password: 'Password123',
        options: {
          data: {
            full_name: 'Sample Patient',
            phone: '555-123-4567',
            role: 'patient',
          },
        },
      });

      if (patientError) throw patientError;

      // Create doctor account
      const { error: doctorError } = await supabase.auth.signUp({
        email: 'doctor@example.com',
        password: 'Password123',
        options: {
          data: {
            full_name: 'Dr. Sample',
            phone: '555-987-6543',
            role: 'doctor',
            hospital: 'General Hospital',
            specialty: 'General Medicine'
          },
        },
      });

      if (doctorError) throw doctorError;

      setIsCreated(true);
      toast({
        title: "Sample accounts created!",
        description: "Patient: patient@example.com and Doctor: doctor@example.com (Password: Password123)",
      });
    } catch (error: any) {
      console.error('Error creating sample accounts:', error);
      toast({
        title: "Error creating accounts",
        description: error.message || "There was an error creating the sample accounts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="font-medium text-lg mb-2">Sample Accounts Setup</h3>
      <p className="text-sm text-gray-600 mb-4">
        Create sample patient and doctor accounts for testing.
      </p>
      {isCreated ? (
        <div className="text-sm p-3 bg-green-50 text-green-800 rounded">
          <p className="font-semibold">Accounts created successfully!</p>
          <p>Patient: patient@example.com</p>
          <p>Doctor: doctor@example.com</p>
          <p>Password: Password123</p>
        </div>
      ) : (
        <Button 
          onClick={createSampleAccounts} 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Creating..." : "Create Sample Accounts"}
        </Button>
      )}
    </div>
  );
};

export default SampleAccountsSetup;
