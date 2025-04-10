
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

// CORS headers for browser requests
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
    // Get the Supabase client with admin rights to verify the JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the JWT from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify the JWT
    const { data: { user }, error: jwtError } = await supabase.auth.getUser(jwt);
    if (jwtError || !user) {
      throw new Error('Invalid JWT token');
    }
    
    // Get the request data
    const { userId, email, fullName, avatarUrl, provider } = await req.json();
    
    // Verify that the user ID matches the one from the JWT
    if (user.id !== userId) {
      throw new Error('User ID mismatch');
    }
    
    // MongoDB connection
    const mongoUri = Deno.env.get('MONGODB_URI') || '';
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const client = new MongoClient();
    await client.connect(mongoUri);
    
    // Create or update user in MongoDB
    const db = client.database("healthhub");
    const usersCollection = db.collection("users");
    
    // Upsert the user (create if not exists, update if exists)
    const result = await usersCollection.updateOne(
      { supabaseId: userId },
      { 
        $set: { 
          email, 
          fullName,
          avatarUrl,
          provider,
          lastLogin: new Date(),
        },
        $setOnInsert: { 
          createdAt: new Date(),
          preferences: {
            notifications: true,
            emailAlerts: true,
          }
        }
      },
      { upsert: true }
    );
    
    // Close MongoDB connection
    await client.close();
    
    return new Response(JSON.stringify({
      success: true,
      message: result.matchedCount > 0 ? 'User updated' : 'User created',
      userId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in create-mongodb-user function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An error occurred while creating/updating the MongoDB user" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
