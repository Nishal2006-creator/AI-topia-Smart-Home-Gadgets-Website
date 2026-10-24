import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateProductDescription = async (
  name: string,
  category: string,
  features: string[] = []
): Promise<string> => {
  try {
    const prompt = `You are a visionary product copywriter for "Aitopia Ectomeric", a futuristic smart home technology company. 
    Write a compelling, sophisticated, and informative product description for the following item:
    
    Product Name: ${name}
    Category: ${category}
    Key Features: ${features.join(', ')}
    
    The tone should be tech-forward, high-end, and slightly mysterious (vibe: "future arrived today"). 
    Focus on how it enhances the user's "neural living space" or "home connectivity".
    Maximum 3 sentences. Do not use generic marketing fluff. Do not use bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "Information synchronized. Awaiting neural deployment.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Ectomeric link established. Description node awaiting manual override.";
  }
};
