
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
    const { prompt, previousMessages = [] } = await req.json();

    // Create a context from previous messages
    let contextText = "";
    if (previousMessages.length > 0) {
      contextText = "Previous conversation context:\n";
      previousMessages.forEach((msg: { role: string; content: string }) => {
        contextText += `${msg.role === 'bot' ? 'MedAssist' : 'User'}: ${msg.content}\n`;
      });
      contextText += "\nBased on this conversation context, please respond to the user's current message:\n";
    }

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
                text: `You are a helpful, knowledgeable health assistant named MedAssist focused on Indian healthcare. You provide accurate, concise information about health, diseases, symptoms, and medicines available in India. Keep your responses brief and to the point - ideally 2-3 sentences per response unless more detail is specifically needed.

                When asked about symptoms, provide information and suggest which type of doctor would be most appropriate to consult in India (e.g., cardiologist for heart issues, dermatologist for skin problems).
                
                When suggesting emergency services, always use Indian emergency numbers (102 for ambulance, 108 for medical emergencies) and refer to AIIMS, Apollo, Fortis, Max, or other major Indian hospital chains when relevant.
                
                You can provide general information about medications and treatments available in India, but always include a disclaimer that the patient should consult with a healthcare professional before starting any treatment.
                
                When mentioning specialists or medical practices, refer to Indian medical systems like MBBS, MD, AYUSH, Ayurveda, and homeopathy as appropriate.
                
                Be conversational and ask follow-up questions when appropriate to better understand the user's health concern.
                
                Your goal is to provide helpful information that gives users peace of mind while ensuring they understand the importance of professional medical care. Avoid saying phrases like "I cannot provide medical advice" - instead, provide information and emphasize the importance of consulting a doctor.
                
                ${contextText}
                
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
