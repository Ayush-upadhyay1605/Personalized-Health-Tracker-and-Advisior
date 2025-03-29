
import { rest } from 'msw';
import { setupWorker } from 'msw';

// Create a request handler
const handlers = [
  rest.post('/api/chat', async (req, res, ctx) => {
    try {
      // Get the request body as text and then parse it
      const text = await req.text();
      const data = JSON.parse(text);

      // Now we can safely access properties on the parsed object
      return res(
        ctx.json({
          response: `This is a mock response for: ${data.message || 'No message provided'}`,
        })
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Failed to process request' })
      );
    }
  }),

  // Add more handlers here
];

// Create a worker instance
export const worker = setupWorker(...handlers);