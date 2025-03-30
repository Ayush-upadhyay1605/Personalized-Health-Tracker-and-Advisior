
/**
 * Mock service for chat functionality (previously Gemini API)
 */

interface ChatPart {
  text: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
}

interface GeminiChatRequest {
  message: string;
  history?: ChatMessage[];
}

interface GeminiChatResponse {
  response: string;
  error?: string;
}

/**
 * Simulates sending a chat message (mock replacement for Gemini API)
 */
export const sendChatMessage = async (
  message: string, 
  history: ChatMessage[] = []
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses based on keywords in the message
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
    return "Based on your symptoms, you might want to consult with a specialist. What specific symptoms are you experiencing?";
  } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
    return "I understand you're experiencing pain. It's important to get that checked by a healthcare professional. Would you like help finding a doctor near you?";
  } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    return "I can help you book an appointment. You can use our appointment booking feature to find available slots with doctors in your area.";
  } else if (lowerMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with regarding your health concerns?";
  } else {
    return "I'm your health assistant. I can help you find the right doctor, understand health concerns, or navigate our healthcare services. How can I assist you today?";
  }
};
