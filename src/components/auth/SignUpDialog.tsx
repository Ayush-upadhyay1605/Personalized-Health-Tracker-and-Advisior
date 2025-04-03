
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, DollarSign, MapPin, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [location, setLocation] = useState('');
  const [fee, setFee] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const specialties = ['Cardiology', 'Dermatology', 'General Medicine', 'Neurology', 'Pediatrics', 'Psychiatry'];
  const locations = ['New York, NY', 'Boston, MA', 'San Francisco, CA', 'Chicago, IL', 'Los Angeles, CA'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return null;
    
    try {
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('doctor_images')
        .upload(filePath, profileImage);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('doctor_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Image upload failed",
        description: "We couldn't upload your profile image.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate doctor-specific required fields
      if (userType === 'doctor') {
        if (!specialty) {
          throw new Error("Please select your specialty");
        }
        if (!location) {
          throw new Error("Please select your location");
        }
        if (!fee) {
          throw new Error("Please enter your consultation fee");
        }
        if (userType === 'doctor' && !profileImage) {
          throw new Error("Please upload your profile image");
        }
      }
      
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
              specialty: specialty,
              location: location,
              fee: fee,
              bio: bio,
              // Image URL will be updated after upload
            }),
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      // If doctor, upload profile image and update user metadata
      if (userType === 'doctor' && data.user) {
        const imageUrl = await uploadProfileImage(data.user.id);
        
        if (imageUrl) {
          // Update user metadata with image URL
          await supabase.auth.updateUser({
            data: { 
              image: imageUrl,
              // Update availability to include Today for demo purposes
              availability: ['Today', 'Tomorrow']
            }
          });
        }
      }
      
      toast({
        title: "Account created successfully",
        description: "Welcome to HealthHub! Please check your email to verify your account.",
      });
      
      onClose();
      if (userType === 'patient') {
        navigate("/home");
      } else {
        // For doctors, go to doctor dashboard
        navigate("/doctor-dashboard");
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
          {/* Basic Information - Common to both patient and doctor */}
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
          
          {/* Doctor-specific fields */}
          {userType === 'doctor' && (
            <>
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-20 h-20 border rounded-full flex items-center justify-center overflow-hidden bg-gray-100"
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label 
                      htmlFor="profileImage" 
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Label>
                    <Input 
                      id="profileImage" 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleImageChange}
                      required={userType === 'doctor'}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This image will be displayed to patients.
                    </p>
                  </div>
                </div>
              </div>

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
                <Select value={specialty} onValueChange={setSpecialty} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Consultation Fee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="fee"
                    type="text"
                    placeholder="$100"
                    className="pl-10"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell patients about your experience and expertise..."
                  className="h-24"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
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
