
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

// Message type
type Message = {
  id: string;
  content: string;
  role: 'user' | 'bot';
  timestamp: Date;
};

// Props type
type ChatbotInterfaceProps = {
  closeChat?: () => void;
};

// Initial welcome message from the bot
const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! I\'m MedAssist, your health assistant. I can help with health questions, suggest appropriate specialists, and provide general information about medications. How can I help you today?',
    role: 'bot',
    timestamp: new Date(),
  }
];

// Sample doctor suggestion examples
const suggestedQueries = [
  "What symptoms indicate I should see a cardiologist?",
  "Can you recommend over-the-counter options for headache?",
  "What specialist should I see for joint pain?",
];

const ChatbotInterface = ({ closeChat }: ChatbotInterfaceProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Auto-adjust textarea height
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call to your Supabase Edge Function that connects to Gemini API
      const { data, error } = await supabase.functions.invoke('gemini-health-chat', {
        body: { prompt: input }
      });

      if (error) {
        throw new Error('Failed to get response from Gemini API');
      }

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.generatedText || "I'm sorry, I couldn't process your request.",
        role: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: "Couldn't get a response. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message from bot
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later.",
        role: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[600px]">
      {/* Header */}
      <div className="p-3 border-b bg-health-primary text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="mr-2" size={18} />
            <h2 className="text-base font-semibold">MedAssist</h2>
          </div>
          {isMobile && closeChat && (
            <button 
              onClick={closeChat}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-xs opacity-75 mt-1">Ask me about health concerns, symptoms, or medications</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-2.5 ${
                msg.role === 'user'
                  ? 'bg-health-primary text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center mb-1">
                {msg.role === 'bot' ? (
                  <Bot size={14} className="mr-1 text-health-primary" />
                ) : (
                  <User size={14} className="mr-1" />
                )}
                <span className="text-xs opacity-75">
                  {msg.role === 'bot' ? 'MedAssist' : 'You'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <div className="text-right">
                <span className="text-[10px] opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%] rounded-lg p-2.5 bg-white border border-gray-200 rounded-tl-none">
              <div className="flex items-center">
                <Bot size={14} className="mr-1 text-health-primary" />
                <span className="text-xs opacity-75">MedAssist</span>
              </div>
              <div className="h-6 flex items-center">
                <div className="typing-indicator inline-flex">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested queries - only show if there's no conversation yet */}
      {messages.length <= 1 && !isLoading && (
        <div className="p-2 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors text-left max-w-full truncate"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your health question..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-health-primary resize-none"
            rows={1}
            disabled={isLoading}
            style={{ maxHeight: '120px' }}
          />
          <Button
            onClick={handleSend}
            className={`rounded-l-none ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading || !input.trim()}
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {isMobile ? 'Press Enter to send. For emergencies, seek medical help.' : 'Press Enter to send, Shift+Enter for a new line. For emergencies, seek medical help.'}
        </p>
      </div>
    </div>
  );
};

export default ChatbotInterface;
