
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { prompt } = await req.json();

    // Updated API endpoint to use the Gemini API v1 instead of v1beta
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful, knowledgeable health assistant. You provide accurate information about health, diseases, symptoms, and medicines to the best of your knowledge. If you don't know something, you acknowledge it and don't make up information.
                
                Remember that you're not a replacement for professional medical advice, diagnosis, or treatment. Always advise users to consult healthcare professionals for specific medical concerns.
                
                User query: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    // Updated to handle the response format of the v1 Gemini API
    let generatedText = "";
    try {
      // Extract the generated text from the v1 API response format
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                      "I'm sorry, I couldn't process your request at this time.";
      
      console.log("Successfully generated response:", generatedText.substring(0, 100) + "...");
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      console.error("Response data:", JSON.stringify(data, null, 2));
      
      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      throw new Error("Unexpected response format from Gemini API");
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-health-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
