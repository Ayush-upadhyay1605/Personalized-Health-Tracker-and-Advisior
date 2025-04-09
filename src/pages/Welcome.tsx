
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SignInDialog from '@/components/auth/SignInDialog';
import SignUpDialog from '@/components/auth/SignUpDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Welcome = () => {
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for auth state changes, particularly important for OAuth redirects
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('Auth state change detected: SIGNED_IN');
        toast({
          title: "Successfully signed in",
          description: "Welcome to HealthHub!",
        });
        navigate('/home');
      }
    });

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Existing session detected, redirecting to home');
        navigate('/home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    setUserType(role);
  };

  const handleExplore = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-light to-white flex flex-col">
      <header className="w-full py-4 md:py-6 px-4 md:px-8">
        <div className="text-health-primary font-bold text-2xl md:text-3xl">HealthHub</div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="text-center md:text-left">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Healthcare at Your Fingertips
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-6 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join HealthHub to manage your health journey or provide care as a healthcare professional
            </motion.p>
            
            {!userType ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-4">I am a:</h2>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                  <Button
                    onClick={() => handleRoleSelect('patient')}
                    className="bg-health-primary hover:bg-health-primary/90 h-12 md:h-16 text-base md:text-lg"
                    size="lg"
                  >
                    Patient
                  </Button>
                  <Button
                    onClick={() => handleRoleSelect('doctor')}
                    className="bg-health-secondary hover:bg-health-secondary/90 h-12 md:h-16 text-base md:text-lg"
                    size="lg"
                  >
                    Doctor
                  </Button>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={handleExplore}
                    variant="outline"
                    className="border-health-primary text-health-primary hover:bg-health-primary/10"
                  >
                    Explore Without Login
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl md:text-2xl font-medium text-gray-800">
                  Welcome, {userType === 'patient' ? 'Patient' : 'Doctor'}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                  <Button
                    onClick={() => setIsSignInOpen(true)}
                    className="bg-health-primary hover:bg-health-primary/90 h-10 md:h-12 text-sm md:text-base"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setIsSignUpOpen(true)}
                    className={`${
                      userType === 'patient' 
                        ? 'bg-health-secondary hover:bg-health-secondary/90' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } h-10 md:h-12 text-sm md:text-base`}
                  >
                    Create Account
                  </Button>
                </div>
                <Button
                  onClick={() => setUserType(null)}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Change Role
                </Button>
              </motion.div>
            )}
          </div>
          
          <motion.div
            className="relative h-[250px] md:h-[400px] mt-8 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-health-primary/20 to-health-secondary/20 rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 md:px-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">
                    {userType === null && "Join Our Health Community"}
                    {userType === 'patient' && "Get Better Healthcare Experience"}
                    {userType === 'doctor' && "Help More Patients with HealthHub"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {userType === null && "Choose your role to get started with personalized health services"}
                    {userType === 'patient' && "Track your health, find doctors, and book appointments easily"}
                    {userType === 'doctor' && "Manage your practice, connect with patients, and grow your reach"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <SignInDialog 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)}
        onOpenSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
        userType={userType || 'patient'}
      />
      
      <SignUpDialog 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)}
        onOpenSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
        userType={userType || 'patient'}
      />
    </div>
  );
};

export default Welcome;
