
/**
 * Service for interacting with Google Gemini API through our backend
 */

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
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
 * Sends a chat message to the Gemini API
 */
export const sendChatMessage = async (
  message: string, 
  history: ChatMessage[] = []
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from assistant');
    }
    
    const data: GeminiChatResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
