import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { keyword } = await req.json();
    
    console.log('Generating moodboard for keyword:', keyword);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate a detailed moodboard for the keyword "${keyword}". Return a JSON object with this exact structure:

{
  "title": "Creative title for the moodboard",
  "keywords": ["${keyword}", "related keyword 1", "related keyword 2"],
  "colors": [
    {"hex": "#XXXXXX", "name": "Color Name 1"},
    {"hex": "#XXXXXX", "name": "Color Name 2"},
    {"hex": "#XXXXXX", "name": "Color Name 3"},
    {"hex": "#XXXXXX", "name": "Color Name 4"},
    {"hex": "#XXXXXX", "name": "Color Name 5"}
  ],
  "fonts": [
    {"name": "Font Name 1", "family": "Font Family 1, sans-serif", "weight": "400"},
    {"name": "Font Name 2", "family": "Font Family 2, serif", "weight": "700"}
  ],
  "images": [
    {"url": "https://images.unsplash.com/photo-relevant-image-1?w=400", "alt": "Description 1"},
    {"url": "https://images.unsplash.com/photo-relevant-image-2?w=400", "alt": "Description 2"},
    {"url": "https://images.unsplash.com/photo-relevant-image-3?w=400", "alt": "Description 3"},
    {"url": "https://images.unsplash.com/photo-relevant-image-4?w=400", "alt": "Description 4"},
    {"url": "https://images.unsplash.com/photo-relevant-image-5?w=400", "alt": "Description 5"}
  ]
}

Choose colors that match the aesthetic of "${keyword}". Select appropriate fonts that complement the theme. Use real Unsplash photo IDs for images that relate to the concept. Return only valid JSON, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a creative design assistant that generates moodboards. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let moodboard;
    try {
      moodboard = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ moodboard }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-moodboard function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});