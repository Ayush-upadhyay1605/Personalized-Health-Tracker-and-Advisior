
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const mongoUri = Deno.env.get('MONGODB_URI');
const client = new MongoClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sessionId, messages, message } = await req.json();
    
    // Connect to MongoDB
    await client.connect(mongoUri);
    const db = client.database("medassist");
    const chatCollection = db.collection("chatSessions");
    
    // Perform different actions based on the request
    switch (action) {
      case 'saveMessage': {
        // Add a new message to an existing session or create a new one
        await chatCollection.updateOne(
          { sessionId },
          { $push: { messages: message }, $setOnInsert: { createdAt: new Date() }, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'getSession': {
        // Retrieve a chat session
        const session = await chatCollection.findOne({ sessionId });
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: session || { sessionId, messages: [] } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'saveSession': {
        // Save full session (used when initializing with existing messages)
        await chatCollection.updateOne(
          { sessionId },
          { $set: { messages, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true }
        );
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'endSession': {
        // Delete the session when chat ends
        await chatCollection.deleteOne({ sessionId });
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in mongodb-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } finally {
    // Ensure MongoDB connection is closed
    try {
      await client.close();
    } catch (e) {
      console.error('Error closing MongoDB connection:', e);
    }
  }
});
