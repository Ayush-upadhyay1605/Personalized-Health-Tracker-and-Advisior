import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Message type
type Message = {
  id: string;
  content: string;
  role: 'user' | 'bot';
  timestamp: Date;
};

// Initial welcome message from the bot
const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! I\'m your health assistant. How can I help you today?',
    role: 'bot',
    timestamp: new Date(),
  }
];

const ChatbotInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="p-4 border-b bg-health-primary text-white">
        <div className="flex items-center">
          <Bot className="mr-2" size={20} />
          <h2 className="text-lg font-semibold">Health Assistant</h2>
        </div>
        <p className="text-xs opacity-75 mt-1">Ask me anything about health, symptoms, or medications</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
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
                  {msg.role === 'bot' ? 'Health Assistant' : 'You'}
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
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200 rounded-tl-none">
              <div className="flex items-center">
                <Bot size={14} className="mr-1 text-health-primary" />
                <span className="text-xs opacity-75">Health Assistant</span>
              </div>
              <p className="text-sm">
                <span className="inline-flex">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your health query..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-health-primary resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            className={`rounded-l-none ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
};

export default ChatbotInterface;
