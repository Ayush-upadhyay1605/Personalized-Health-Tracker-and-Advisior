
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignInDialog from './auth/SignInDialog';
import SignUpDialog from './auth/SignUpDialog';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';

const Navbar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-transparent animate-fade-in">
        <Link to="/" className="text-health-primary font-bold text-2xl">
          HealthHub
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">
                Hello, {user.user_metadata.full_name || user.email}
              </span>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-health-primary text-health-primary hover:bg-health-primary/10"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsSignInOpen(true)}
                className="text-gray-700 hover:text-health-primary transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="bg-health-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
      
      <SignInDialog 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)}
        onOpenSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      
      <SignUpDialog 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)}
        onOpenSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
