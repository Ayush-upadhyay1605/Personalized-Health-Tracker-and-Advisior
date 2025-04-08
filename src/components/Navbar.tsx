
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignInDialog from './auth/SignInDialog';
import SignUpDialog from './auth/SignUpDialog';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
          toast({
            title: "Signed in successfully",
            description: "Welcome to HealthHub!",
          });
          navigate('/home');
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
  }, [navigate, toast]);

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
      setMobileMenuOpen(false);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
      console.error("Sign out error:", error);
    }
  };

  const handleViewDashboard = () => {
    if (user) {
      navigate('/dashboard');
      setMobileMenuOpen(false);
    } else {
      setIsSignInOpen(true);
      toast({
        title: "Authentication required",
        description: "Please sign in to view your dashboard.",
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full py-4 px-4 md:px-12 flex justify-between items-center bg-transparent animate-fade-in relative z-50">
        <Link to="/" className="text-health-primary font-bold text-2xl">
          HealthHub
        </Link>
        
        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-health-primary" />
            ) : (
              <Menu className="h-6 w-6 text-health-primary" />
            )}
          </button>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 truncate max-w-[150px]">
                Hello, {user.user_metadata.full_name || user.email}
              </span>
              <Button 
                onClick={handleViewDashboard}
                variant="default"
                className="bg-health-primary text-white hover:bg-health-primary/90 whitespace-nowrap"
              >
                View Dashboard
              </Button>
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
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40 animate-fade-in py-4 px-6">
          {user ? (
            <div className="flex flex-col gap-4">
              <span className="text-gray-700 text-center">
                Hello, {user.user_metadata.full_name || user.email}
              </span>
              <Button 
                onClick={handleViewDashboard}
                variant="default"
                className="w-full bg-health-primary text-white hover:bg-health-primary/90"
              >
                View Dashboard
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-health-primary text-health-primary hover:bg-health-primary/10"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setIsSignInOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-gray-700 hover:text-health-primary transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setIsSignUpOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-health-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
      
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
