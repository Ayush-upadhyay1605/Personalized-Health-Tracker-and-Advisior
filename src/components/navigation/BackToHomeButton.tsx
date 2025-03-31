
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface BackToHomeButtonProps {
  className?: string;
}

const BackToHomeButton = ({ className = '' }: BackToHomeButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default Link behavior
    navigate('/home'); // Force navigation to /home
    console.log('Navigating to /home'); // Add logging for debugging
  };
  
  return (
    <Link to="/home" onClick={handleClick}>
      <Button variant="ghost" className={`flex items-center gap-2 ${className}`}>
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </Link>
  );
};

export default BackToHomeButton;
