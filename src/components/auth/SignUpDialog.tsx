
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface SignUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  userType?: 'patient' | 'doctor';
}

const SignUpDialog = ({ isOpen, onClose, onOpenSignIn, userType = 'patient' }: SignUpDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listen for auth state changes to handle redirects after OAuth sign-ups
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successfully signed in/up
        toast({
          title: "Account created successfully",
          description: "Welcome to HealthHub!",
        });
        onClose(); // Close the sign-up dialog
        navigate('/home'); // Redirect to the home page
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, onClose, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: userType,
            ...(userType === 'doctor' && {
              hospital: hospitalName,
              specialty: specialty
            }),
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created successfully",
        description: "Welcome to HealthHub! Please check your email to verify your account.",
      });
      
      onClose();
      if (userType === 'patient') {
        navigate("/home");
      } else {
        // For doctors, we might want a different dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up. Please try again.",
        variant: "destructive",
      });
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (userType !== 'patient') {
      toast({
        title: "Google Sign Up not available for doctors",
        description: "Please use email and password to sign up as a doctor.",
        variant: "destructive",
      });
      return;
    }

    setIsGoogleLoading(true);

    try {
      // Get the base URL for redirects - this must match what's configured in Google Cloud Console
      const baseUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/home`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        throw error;
      }

      // The user will be redirected to Google's authentication page
    } catch (error: any) {
      toast({
        title: "Google sign up failed",
        description: error.message || "An error occurred during Google sign up.",
        variant: "destructive",
      });
      console.error("Google sign up error:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {userType === 'patient' ? 'Create Patient Account' : 'Create Doctor Account'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Join HealthHub to {userType === 'patient' ? 'manage your health journey' : 'connect with patients'}
          </DialogDescription>
        </DialogHeader>
        
        {userType === 'patient' && (
          <div className="mt-2 mb-4">
            <Button
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
              variant="outline"
            >
              {isGoogleLoading ? (
                <div className="h-4 w-4 border-t-2 border-b-2 border-gray-800 rounded-full animate-spin"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              <span>{isGoogleLoading ? "Connecting..." : "Sign up with Google"}</span>
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          {userType === 'doctor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clinic Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="hospital"
                    type="text"
                    placeholder="General Hospital"
                    className="pl-10"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <div className="relative">
                  <Input
                    id="specialty"
                    type="text"
                    placeholder="Cardiology, Pediatrics, etc."
                    className="pl-3"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-health-primary hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-health-primary hover:underline">Privacy Policy</a>.
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${
              userType === 'patient' 
                ? 'bg-health-primary hover:bg-health-primary/90' 
                : 'bg-health-secondary hover:bg-health-secondary/90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="text-health-primary hover:underline focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
