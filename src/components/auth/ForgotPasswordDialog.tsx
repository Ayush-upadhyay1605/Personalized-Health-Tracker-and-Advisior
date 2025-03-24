
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Reset password for:', email);
    setIsSubmitted(true);
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
              : 'Enter your email address and we will send you a link to reset your password'}
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center mt-6 space-y-4">
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-health-secondary" />
            </div>
            <p className="text-center text-sm text-gray-500">
              Please check your inbox and follow the instructions in the email. 
              The reset link will expire in 30 minutes.
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
