
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInDialog from './auth/SignInDialog';
import SignUpDialog from './auth/SignUpDialog';

const Navbar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-transparent animate-fade-in">
        <Link to="/" className="text-health-primary font-bold text-2xl">
          HealthHub
        </Link>
        
        <div className="flex items-center gap-4">
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
