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
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  try {
    const response = await fetch(`${BASE_URL}/api/gemini-chat`, {
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
    if (!data.response) {
      throw new Error('Invalid response from the server');
    }

    return data.response;
  } catch (error: any) {
    if (error.name === 'TypeError') {
      console.error('Network error:', error);
      throw new Error('Network error: Unable to connect to the server');
    }
    console.error('Error sending chat message:', error);
    throw new Error(error.message || 'An unexpected error occurred while sending the chat message');
  }
};
