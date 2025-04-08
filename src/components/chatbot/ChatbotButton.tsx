
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ChatbotInterface from './ChatbotInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const ChatbotButton = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Choose component based on device type
  const ChatContainer = isMobile ? Drawer : Sheet;
  const ChatTrigger = isMobile ? DrawerTrigger : SheetTrigger;
  const ChatContent = isMobile ? DrawerContent : SheetContent;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ChatContainer open={isOpen} onOpenChange={setIsOpen}>
        <ChatTrigger asChild>
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
        </ChatTrigger>
        {isMobile ? (
          <ChatContent className="p-0 overflow-hidden h-[85vh]">
            <ChatbotInterface closeChat={() => setIsOpen(false)} />
          </ChatContent>
        ) : (
          <ChatContent 
            className="p-0 overflow-hidden sm:max-w-[400px]" 
            side="right"
          >
            <ChatbotInterface closeChat={() => setIsOpen(false)} />
          </ChatContent>
        )}
      </ChatContainer>
    </div>
  );
};

export default ChatbotButton;
