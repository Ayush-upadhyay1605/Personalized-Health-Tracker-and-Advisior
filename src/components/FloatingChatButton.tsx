
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onClick}
        size="icon"
        className="rounded-full h-14 w-14 bg-health-primary hover:bg-health-primary/90 shadow-lg"
        aria-label="Open Health Assistant"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default FloatingChatButton;
