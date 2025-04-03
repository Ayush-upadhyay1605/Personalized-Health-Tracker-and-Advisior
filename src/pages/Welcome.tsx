import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SignInDialog from '@/components/auth/SignInDialog';
import SignUpDialog from '@/components/auth/SignUpDialog';
import SampleAccountsSetup from '@/components/SampleAccountsSetup';
import SampleAppointmentsSetup from '@/components/SampleAppointmentsSetup';

const Welcome = () => {
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    setUserType(role);
  };

  const handleExplore = () => {
    navigate('/');
  };

  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-light to-white flex flex-col">
      <header className="w-full py-6 px-8 flex justify-between items-center">
        <div className="text-health-primary font-bold text-3xl">HealthHub</div>
        <div>
          <button 
            onClick={toggleDevTools}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {showDevTools ? "Hide Dev Tools" : "Dev Tools"}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Healthcare at Your Fingertips
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-10"
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
                <h2 className="text-2xl font-medium text-gray-800 mb-4">I am a:</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleRoleSelect('patient')}
                    className="bg-health-primary hover:bg-health-primary/90 h-16 text-lg"
                    size="lg"
                  >
                    Patient
                  </Button>
                  <Button
                    onClick={() => handleRoleSelect('doctor')}
                    className="bg-health-secondary hover:bg-health-secondary/90 h-16 text-lg"
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
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-medium text-gray-800">
                  Welcome, {userType === 'patient' ? 'Patient' : 'Doctor'}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setIsSignInOpen(true)}
                    className="bg-health-primary hover:bg-health-primary/90 h-12 text-base"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setIsSignUpOpen(true)}
                    className={`${
                      userType === 'patient' 
                        ? 'bg-health-secondary hover:bg-health-secondary/90' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } h-12 text-base`}
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
            className="relative h-[400px] hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-health-primary/20 to-health-secondary/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {userType === null && "Join Our Health Community"}
                    {userType === 'patient' && "Get Better Healthcare Experience"}
                    {userType === 'doctor' && "Help More Patients with HealthHub"}
                  </h3>
                  <p className="text-gray-600">
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
      
      {showDevTools && (
        <motion.div 
          className="mt-8 border-t pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SampleAccountsSetup />
          <SampleAppointmentsSetup />

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium mb-2">Test Credentials</h3>
            <div className="text-sm space-y-1">
              <p><strong>Patient:</strong> patient@example.com / Password123</p>
              <p><strong>Doctor:</strong> doctor@example.com / Password123</p>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <p>1. Log in with the patient credentials</p>
              <p>2. Go to Doctor Search and book an appointment with Dr. Sample</p>
              <p>3. Log out and log in with the doctor credentials</p>
              <p>4. Check the Doctor Dashboard to see the appointment</p>
            </div>
          </div>
        </motion.div>
      )}
      
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
