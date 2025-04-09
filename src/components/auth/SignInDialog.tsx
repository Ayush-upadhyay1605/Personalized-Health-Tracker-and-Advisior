
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  userType?: 'patient' | 'doctor';
}

const SignInDialog = ({ isOpen, onClose, onOpenSignUp, userType = 'patient' }: SignInDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listen for auth state changes to handle redirects after OAuth sign-ins
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successfully signed in
        toast({
          title: "Successfully signed in",
          description: "Welcome to HealthHub!",
        });
        onClose(); // Close the sign-in dialog
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Successfully signed in",
        description: "Welcome back to HealthHub!",
      });
      
      onClose();
      
      // Redirect based on user type
      if (userType === 'patient') {
        navigate("/home");
      } else {
        // For doctors, we might want a different dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (userType !== 'patient') {
      toast({
        title: "Google Sign In not available for doctors",
        description: "Please use email and password to sign in as a doctor.",
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
          redirectTo: `${baseUrl}/auth/callback`,
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
      // No need to close the dialog here as the page will redirect
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "An error occurred during Google sign in.",
        variant: "destructive",
      });
      console.error("Google sign in error:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {userType === 'patient' ? 'Patient Login' : 'Doctor Login'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Sign in to your HealthHub account
            </DialogDescription>
          </DialogHeader>
          
          {userType === 'patient' && (
            <div className="mt-2 mb-4">
              <Button
                onClick={handleGoogleSignIn}
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
                <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsForgotPasswordOpen(true);
                  }}
                  className="text-xs text-health-primary hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
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
            
            <Button 
              type="submit" 
              className={`w-full ${
                userType === 'patient' 
                  ? 'bg-health-primary hover:bg-health-primary/90' 
                  : 'bg-health-secondary hover:bg-health-secondary/90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account?</span>{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignUp();
                }}
                className="text-health-primary hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <ForgotPasswordDialog 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </>
  );
};

export default SignInDialog;
