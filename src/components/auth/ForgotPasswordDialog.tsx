
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMethod, setResetMethod] = useState<'email' | 'sms'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOTPValue] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If your email exists in our system, you will receive a password reset link shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, you would send an OTP to the phone number
    // Since Supabase doesn't natively support SMS OTP, this is a mock implementation
    try {
      // For demonstration purposes, we'll just show the OTP input
      setTimeout(() => {
        setShowOtpInput(true);
        setIsLoading(false);
        toast({
          title: "SMS sent",
          description: "A verification code has been sent to your phone number.",
        });
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    
    // In a real implementation, you would verify the OTP with your backend
    // For this demo, we'll just simulate a successful verification
    try {
      setTimeout(() => {
        if (otpValue === '123456') { // In a real app, you would validate against the actual OTP
          setIsSubmitted(true);
          toast({
            title: "OTP verified",
            description: "Your OTP has been verified successfully.",
          });
        } else {
          toast({
            title: "Invalid OTP",
            description: "The verification code you entered is incorrect.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {isSubmitted ? 'Check Your Email' : 'Reset Your Password'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {isSubmitted 
              ? 'If your email exists in our system, you will receive a password reset link shortly.'
              : 'Choose a method to reset your password'}
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center mt-6 space-y-4">
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-health-secondary" />
            </div>
            <p className="text-center text-sm text-gray-500">
              Please check your {resetMethod === 'email' ? 'inbox' : 'phone'} and follow the instructions to reset your password. 
              {resetMethod === 'email' && ' The reset link will expire in 30 minutes.'}
            </p>
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="mt-4"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={resetMethod === 'email' ? "default" : "outline"}
                className={resetMethod === 'email' ? "bg-health-primary" : ""}
                onClick={() => setResetMethod('email')}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={resetMethod === 'sms' ? "default" : "outline"}
                className={resetMethod === 'sms' ? "bg-health-primary" : ""}
                onClick={() => setResetMethod('sms')}
              >
                SMS
              </Button>
            </div>
            
            {resetMethod === 'email' ? (
              <form onSubmit={handleEmailReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                
                <div className="flex flex-col md:flex-row gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="md:order-1 order-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-health-primary hover:bg-health-primary/90 md:order-2 order-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                {!showOtpInput ? (
                  <form onSubmit={handleSmsReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Enter your phone number including country code
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        className="md:order-1 order-2"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-health-primary hover:bg-health-primary/90 md:order-2 order-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter Verification Code</Label>
                      <div className="flex justify-center my-4">
                        <InputOTP 
                          maxLength={6} 
                          value={otpValue} 
                          onChange={setOTPValue}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Enter the 6-digit code sent to your phone
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowOtpInput(false)}
                        className="md:order-1 order-2"
                      >
                        Back
                      </Button>
                      <Button 
                        type="button"
                        onClick={verifyOtp}
                        className="bg-health-primary hover:bg-health-primary/90 md:order-2 order-1"
                        disabled={isLoading || otpValue.length !== 6 || !newPassword}
                      >
                        {isLoading ? "Verifying..." : "Reset Password"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
