
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackToHomeButtonProps {
  className?: string;
}

const BackToHomeButton = ({ className = '' }: BackToHomeButtonProps) => {
  return (
    <Link to="/home">
      <Button variant="ghost" className={`flex items-center gap-2 ${className}`}>
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </Link>
  );
};

export default BackToHomeButton;
