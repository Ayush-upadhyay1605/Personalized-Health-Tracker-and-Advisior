
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

// Define handlers for mocking API responses during development
export const handlers = [
  // Mock the Gemini API endpoint
  http.post('/api/gemini-chat', async ({ request }) => {
    try {
      const body = await request.json();
      const userMessage = body.message || '';
      
      // Mock responses based on keywords
      if (userMessage.toLowerCase().includes('doctor')) {
        return HttpResponse.json({
          response: "Based on what you've described, I'd recommend seeing a primary care physician first. They can provide an initial assessment and refer you to a specialist if needed. Would you like me to help you find doctors in your area?"
        });
      } else if (userMessage.toLowerCase().includes('pain')) {
        return HttpResponse.json({
          response: "I'm sorry to hear you're experiencing pain. The type of doctor you should see depends on where the pain is located. Could you provide more details about your symptoms?"
        });
      } else if (userMessage.toLowerCase().includes('specialist')) {
        return HttpResponse.json({
          response: "There are many types of specialists, including cardiologists (heart), dermatologists (skin), neurologists (brain/nerves), and orthopedists (bones/joints). Which area of your health are you concerned about?"
        });
      } else {
        return HttpResponse.json({
          response: "I'm here to help you find the right healthcare provider. Could you tell me more about your health concerns or symptoms?"
        });
      }
    } catch (error) {
      return new HttpResponse(null, { status: 500 });
    }
  }),
];

// Create the service worker
export const worker = setupWorker(...handlers);
