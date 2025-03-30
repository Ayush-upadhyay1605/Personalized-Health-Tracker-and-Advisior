
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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
