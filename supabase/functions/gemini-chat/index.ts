
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the API key from environment variables
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, history } = await req.json();
    
    // Prepare the request to Gemini API
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const requestBody = {
      contents: [
        {
          role: "system",
          parts: [
            {
              text: `You are a comprehensive health assistant chatbot. Your role is to:

1. Provide accurate information on health topics, diseases, symptoms, and medications
2. Help users understand potential causes of their symptoms
3. Recommend appropriate medical specialists based on symptoms described
4. Offer general health advice and preventive measures
5. Suggest when users should seek immediate medical attention

Important guidelines:
- ALWAYS recommend seeing a qualified healthcare provider for proper diagnosis
- DO NOT provide definitive medical diagnoses
- DO NOT prescribe specific medications or treatments
- Be compassionate and clear in your explanations
- For serious symptoms (chest pain, difficulty breathing, severe bleeding, etc.), advise seeking emergency care immediately
- When recommending specialists, explain WHY that type of doctor is appropriate for the described symptoms
- If you're unsure about something, acknowledge your limitations and suggest consulting a healthcare professional

For specialist recommendations, use this general guide:
- Primary Care Physician/General Practitioner: First point of contact for most health issues
- Cardiologist: Heart and cardiovascular issues
- Dermatologist: Skin, hair, and nail conditions
- Gastroenterologist: Digestive system issues
- Neurologist: Brain, spinal cord, and nervous system problems
- Orthopedist: Bone and joint issues
- Gynecologist: Women's reproductive health
- Urologist: Urinary tract and male reproductive issues
- Endocrinologist: Hormone-related conditions
- Ophthalmologist: Eye disorders
- ENT (Otolaryngologist): Ear, nose, and throat problems
- Psychiatrist: Mental health disorders
- Pulmonologist: Lung and respiratory issues
- Nephrologist: Kidney diseases
- Rheumatologist: Autoimmune and inflammatory conditions
- Oncologist: Cancer treatment

Remember that your advice is educational in nature and should not replace professional medical consultation.`
            }
          ]
        },
        ...(history || []),
        {
          role: "user",
          parts: [{ text: message }]
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
    };

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error("Failed to get response from Gemini");
    }

    // Extract the response text from the Gemini API response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I'm sorry, I couldn't process your health question at this time. Please try again.";

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in Gemini chat function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
