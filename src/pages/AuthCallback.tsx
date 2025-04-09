
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // This component will handle the auth callback from OAuth providers
    const handleAuthCallback = async () => {
      try {
        // Check for auth state
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          console.log("Authentication successful in callback, redirecting to home");
          toast({
            title: "Successfully signed in",
            description: "Welcome to HealthHub!",
          });
          navigate('/home');
        } else {
          console.log("No session found in callback, redirecting to welcome page");
          navigate('/');
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication error",
          description: error.message || "There was a problem with your authentication",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-health-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-primary mx-auto"></div>
        <h2 className="mt-4 text-xl font-medium text-gray-700">Completing your sign in...</h2>
        <p className="mt-2 text-gray-500">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};

export default AuthCallback;
