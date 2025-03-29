
import { http, HttpResponse, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';

// Create a request handler
const handlers = [
  http.post('/api/chat', async ({ request }) => {
    try {
      // Get the request body as text and then parse it
      const text = await request.text();
      const data = JSON.parse(text);
      
      // Now we can safely access properties on the parsed object
      return HttpResponse.json({
        response: `This is a mock response for: ${data.message || 'No message provided'}`
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to process request' },
        { status: 400 }
      );
    }
  }),
  
  // Add more handlers here
];

// Create a worker instance
export const worker = setupWorker(...handlers);
