
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This component will handle the auth callback from OAuth providers
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        console.log("Auth callback page loaded, processing authentication...");
        
        // Check if there's a hash fragment in the URL (common for OAuth redirects)
        const hashFragment = window.location.hash;
        console.log("Hash fragment present:", hashFragment ? "Yes" : "No");
        
        if (hashFragment && hashFragment.includes('access_token')) {
          console.log("Access token found in hash fragment, setting session from URL");
          // The hash contains auth info, we need to let Supabase process it
          // This will automatically set the session
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: new URLSearchParams(hashFragment.substring(1)).get('access_token') || '',
            refresh_token: new URLSearchParams(hashFragment.substring(1)).get('refresh_token') || '',
          });
          
          if (setSessionError) {
            console.error("Error setting session from URL params:", setSessionError);
            throw setSessionError;
          }
          
          if (data.session) {
            console.log("Session successfully set from URL params");
          }
        }
        
        // Now check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Authentication successful, redirecting to home");
          toast({
            title: "Successfully signed in",
            description: `Welcome to HealthHub, ${session.user.user_metadata.full_name || ''}!`,
          });
          setIsProcessing(false);
          navigate('/home');
        } else {
          console.log("No session found, checking for error parameters");
          
          // Check if there are error parameters in the URL
          const urlParams = new URLSearchParams(window.location.search);
          const errorParam = urlParams.get('error');
          const errorDescriptionParam = urlParams.get('error_description');
          
          if (errorParam) {
            console.error("Error parameter found in URL:", errorParam, errorDescriptionParam);
            throw new Error(errorDescriptionParam || errorParam);
          }
          
          console.log("No session or error found, redirecting to welcome page");
          setIsProcessing(false);
          navigate('/');
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        setError(error.message || "There was a problem with your authentication");
        toast({
          title: "Authentication error",
          description: error.message || "There was a problem with your authentication",
          variant: "destructive",
        });
        setIsProcessing(false);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-health-light">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-medium text-gray-700">Authentication Error</h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-health-primary text-white px-4 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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
