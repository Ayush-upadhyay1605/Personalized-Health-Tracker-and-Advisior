
import { useState, useRef, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: Date;
}

interface DoctorChatProps {
  doctorName?: string;
  doctorImage?: string;
  patientId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DoctorChat = ({ 
  doctorName = "Dr. Smith", 
  doctorImage = "/placeholder.svg", 
  patientId, 
  open = false, 
  onOpenChange 
}: DoctorChatProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'doctor',
      text: `Hello! This is ${doctorName}. How can I help you today?`,
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Log patient ID for debugging
  useEffect(() => {
    if (patientId) {
      console.log(`Chat initialized with patient ID: ${patientId}`);
    }
  }, [patientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate doctor response after a delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check your records.",
        "That's a good question. Based on your symptoms, I recommend...",
        "Please provide more details about your symptoms.",
        "Have you taken the medication I prescribed?",
        "Your test results look normal, but we should monitor this.",
      ];
      
      const doctorMessage: Message = {
        id: messages.length + 2,
        sender: 'doctor',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={doctorImage} 
                alt={doctorName}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <DrawerTitle>{doctorName}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-health-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        
        {/* Message input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-health-primary"
            />
            <Button 
              onClick={handleSendMessage} 
              className="rounded-full bg-health-primary hover:bg-health-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DoctorChat;
