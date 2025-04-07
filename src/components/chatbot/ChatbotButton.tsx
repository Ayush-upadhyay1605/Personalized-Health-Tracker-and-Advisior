
import React from 'react';
import { Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ChatbotInterface from './ChatbotInterface';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatbotButton = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <button 
            className="h-14 w-14 rounded-full bg-health-primary text-white flex items-center justify-center shadow-lg hover:bg-health-primary/90 transition-all duration-300 animate-pulse-subtle"
            onClick={() => {
              // Stop the animation once clicked
              const button = document.querySelector('.animate-pulse-subtle');
              if (button) button.classList.remove('animate-pulse-subtle');
            }}
            aria-label="Open health assistant chat"
          >
            <Bot size={24} />
          </button>
        </SheetTrigger>
        <SheetContent 
          className={`p-0 overflow-hidden ${isMobile ? 'w-[100vw] max-w-[100vw]' : 'sm:max-w-[400px]'}`} 
          side={isMobile ? "bottom" : "right"}
        >
          <ChatbotInterface />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatbotButton;
