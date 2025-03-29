import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingChatButtonProps {
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const FloatingChatButton = ({ onClick = () => {}, size = 'medium' }: FloatingChatButtonProps) => {
  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-14 w-14',
    large: 'h-16 w-16',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-4 sm:right-4">
      <Button 
        onClick={onClick}
        size="icon"
        className={`rounded-full ${sizeClasses[size]} bg-health-primary hover:bg-health-primary/90 shadow-lg`}
        aria-label="Open Health Assistant Chatbot"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default FloatingChatButton;
