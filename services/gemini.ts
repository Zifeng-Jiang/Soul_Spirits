
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CocktailRecipe, UserProfile } from "../types";

// Schema for the structured JSON response
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Creative name of the cocktail" },
    tagline: { type: Type.STRING, description: "A short, catchy slogan for the drink" },
    story: { type: Type.STRING, description: "A short paragraph explaining why this drink matches the user's personality and mood." },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Name of ingredient (liquor, mixer, fruit, etc)" },
          amount: { type: Type.STRING, description: "Quantity with units (e.g., 60ml, 1 dash, top up)" }
        }
      }
    },
    glassware: { type: Type.STRING, description: "Type of glass to serve in" },
    garnish: { type: Type.STRING, description: "Garnish details" },
    instructions: { type: Type.STRING, description: "Step-by-step preparation instructions" },
    visualDescription: { 
      type: Type.STRING, 
      description: "A highly detailed visual description of the final cocktail for an image generation AI. Describe colors, layers, condensation, lighting, the glass shape, and garnish." 
    }
  },
  required: ["name", "story", "ingredients", "glassware", "garnish", "instructions", "visualDescription"],
};

export const generateRecipe = async (
  userProfile: UserProfile, 
  inventory: string[] = [], 
  strictMode: boolean = false,
  critique?: string
): Promise<CocktailRecipe> => {
  // Initialize AI client inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let feedbackInstruction = "";
  if (critique) {
    feedbackInstruction = `
    IMPORTANT: This is a REGENERATION request. The user rejected the previous recipe with the following feedback: "${critique}".
    You MUST adjust the new recipe to address this critique specifically (e.g., if they said "too sweet", make it dry/bitter; if they disliked a spirit, swap it).
    Acknowledge the change subtly in the 'story' if appropriate.
    `;
  }

  let inventoryInstruction = "";
  if (strictMode && inventory.length > 0) {
    inventoryInstruction = `
    STRICT INVENTORY CONSTRAINT:
    You are serving from a limited bar. You MUST ONLY use the ingredients listed below. 
    DO NOT introduce new spirits or mixers not in this list. 
    Common household staples like Sugar, Water, Salt, and Ice are assumed available even if not listed.
    
    AVAILABLE INVENTORY:
    ${inventory.join(', ')}

    If a perfect match for the user's profile is not possible with these ingredients, create the best possible approximation or a creative fusion using ONLY what is available.
    `;
  } else if (inventory.length > 0) {
    inventoryInstruction = `
    INVENTORY PREFERENCE:
    The user has the following ingredients available: ${inventory.join(', ')}.
    Prioritize using these ingredients if they fit the profile, but feel free to add other common ingredients if necessary to make a better drink.
    `;
  }

  const prompt = `
    Act as a world-class master mixologist and psychologist. 
    Create a bespoke cocktail recipe based on the following user profile:
    
    Name: ${userProfile.name}
    Age Generation: ${userProfile.ageGroup}
    MBTI: ${userProfile.mbti}
    Zodiac: ${userProfile.zodiac}
    Current Mood: ${userProfile.mood}
    Taste Preferences/Allergies: ${userProfile.preferences}
    
    ${inventoryInstruction}
    ${feedbackInstruction}

    The drink should be physically possible to make but creative.
    
    CRITICAL: Adapt the recipe style to the user's generation (${userProfile.ageGroup}). 
    - For Gen Z (21-25) & Late Millennials (26-30): Lean towards trendy, highly visual (instagrammable), perhaps sweeter, lower ABV or unique fusion flavors (yuzu, matcha, elderflower).
    - For Core Millennials (31-35): Balanced craft cocktails, fresh ingredients, nostalgic twists.
    - For Elder Millennials & Gen X: Sophisticated, spirit-forward, complex bitters, classic riffs.
    - For Boomers: Timeless classics, simple execution, premium spirits, recognizable profiles.
    
    The 'story' should connect the ingredients and style to their personality traits, age vibe, and mood.
    The 'visualDescription' must be vivid and specific for an image generator.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      systemInstruction: "You are a sophisticated AI bartender. You are witty, insightful, and knowledgeable about flavor profiles across different generations.",
    },
  });

  const text = response.text;
  if (!text) throw new Error("No recipe generated");
  
  return JSON.parse(text) as CocktailRecipe;
};

export const generateCocktailImage = async (visualDescription: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Professional food and drink photography, 8k resolution, cinematic lighting. ${visualDescription}. photorealistic, condensation on glass, dramatic shadows, shallow depth of field.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    }
  });

  // Extract image from inlineData
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      const base64Data = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64Data}`;
    }
  }

  throw new Error("No image generated in the response");
};
