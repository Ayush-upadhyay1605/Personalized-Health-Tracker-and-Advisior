import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { SendHorizonal, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendChatMessage } from '@/services/geminiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Define interface for the API message format
interface ApiChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatbotDialog = ({ open, onOpenChange }: ChatbotDialogProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I\'m your health assistant. I can help you with information about health conditions, symptoms, medications, and recommend which type of doctor you should consult. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid message.",
        variant: "warning",
      });
      return;
    }
  
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      // Format messages for the API request
      const historyForApi: ApiChatMessage[] = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
  
      // Call the Gemini service
      const response = await sendChatMessage(input.trim(), historyForApi);
  
      // Add bot response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Error",
        description: error.message || "Could not connect to the health assistant. Please try again.",
        variant: "destructive",
      });
  
      // Add error message from bot
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm having trouble connecting to my medical knowledge base. Could you please try again?",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-health-primary" />
            <span>Health Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 my-4 rounded-md border">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex gap-2 max-w-[80%]">
                  {message.role === 'bot' && (
                    <Avatar className="h-8 w-8 bg-health-primary text-white">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-health-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-right text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 bg-gray-500 text-white">
                      <span className="text-sm">You</span>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about symptoms, health conditions, or which doctor to see..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-health-primary hover:bg-health-primary/90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <p className="text-xs text-gray-500 ml-auto">
            Powered by Google Gemini AI
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotDialog;
