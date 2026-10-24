import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateSpeech = async (text: string, languageCode?: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Kore',
              // Note: Specific language variations can be handled by checking languageCode if mapping exists
            },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

export interface AIFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  features?: string[];
}

export const translateDescriptionToFilters = async (description: string, categories: string[]): Promise<AIFilters> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following user description of a desired smart home product into structured filter parameters.
      
      User Description: "${description}"
      
      Available Categories: ${categories.join(", ")}
      
      Output ONLY a JSON object with these optional keys:
      - category: Matches one of the available categories.
      - minPrice: Minimum budget (INR).
      - maxPrice: Maximum budget (INR).
      - search: Key search terms or product names.
      - features: Array of specific features requested.
      
      If a parameter cannot be determined, omit it.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            search: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini AI Translation Error:", error);
    return {};
  }
};

export interface AISuggestedAutomation {
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'device' | 'voice' | 'email';
    value: string;
  };
  actions: {
    deviceName: string;
    command: string;
  }[];
}

export const generateAutomationFromPrompt = async (prompt: string): Promise<AISuggestedAutomation | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Design a smart home automation sequence based on this user prompt: "${prompt}"
      
      Available Devices for actions: Aumina Hub, Neon Strips, Ghost Speaker, Iris Cam, Cyber Kettle, Aura Mask, Nexus Mirror, Zenith Sensor
      
      Output ONLY a JSON object with:
      - name: Creative name for the sequence.
      - description: Clear explanation of what it does.
      - trigger: Object with type ('time', 'device', 'voice', or 'email') and value (time format 'HH:mm', voice string, device event, or email matching criteria).
      - actions: Array of { deviceName, command } objects.
      
      Example trigger values:
      - time: "08:30"
      - device: "Iris Cam: Motion Detected"
      - voice: "Good Morning"
      - email: "Subject contains Order"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            trigger: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                value: { type: Type.STRING }
              }
            },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  deviceName: { type: Type.STRING },
                  command: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini AI Automation Generation Error:", error);
    return null;
  }
};

export const chatWithAI = async (prompt: string, history: any[], context?: string) => {
  try {
    const fullPrompt = context ? `Context: ${context}\n\nUser: ${prompt}` : prompt;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        tools: [{
          functionDeclarations: [
            {
              name: "create_automation",
              description: "Propose a new smart home automation sequence",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of automation" },
                  description: { type: Type.STRING, description: "Description" },
                  trigger: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ["time", "device", "voice", "email"] },
                      value: { type: Type.STRING }
                    },
                    required: ["type", "value"]
                  },
                  actions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        deviceName: { type: Type.STRING },
                        command: { type: Type.STRING }
                      },
                      required: ["deviceName", "command"]
                    }
                  }
                },
                required: ["name", "description", "trigger", "actions"]
              }
            },
            {
              name: "recommend_products",
              description: "Recommend specific products from the catalog to the user",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  productIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of product IDs recommended"
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: "Reasoning for the recommendation"
                  }
                },
                required: ["productIds", "reasoning"]
              }
            },
            {
              name: "redirect_to_product",
              description: "Immediately redirect the user to a specific product's detail page when a clear choice is made.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  productId: {
                    type: Type.STRING,
                    description: "The ID of the product to redirect to"
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: "Reasoning for the immediate redirection"
                  }
                },
                required: ["productId", "reasoning"]
              }
            }
          ]
        }]
      }
    });

    return {
      text: response.text,
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Neural interference detected.", functionCalls: null };
  }
};

export const streamChatWithAI = async (prompt: string, history: any[], onUpdate: (text: string) => void, context?: string) => {
  try {
    const fullPrompt = context ? `Context: ${context}\n\nUser: ${prompt}` : prompt;
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
    });
    
    let fullText = "";
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onUpdate(fullText);
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    onUpdate("Neural interference detected.");
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Detect the ISO 639-1 language code and provide a friendly name for this text: "${text}"
      
      Output ONLY a JSON object with:
      - code: Simple language code like 'en', 'es', 'fr', 'hi', etc.
      - bcp47: Full BCP-47 tag like 'en-US', 'es-ES', 'hi-IN', etc.
      - name: Friendly name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            bcp47: { type: Type.STRING },
            name: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result.bcp47 || 'en-US';
  } catch (error) {
    console.error("Language Detection Error:", error);
    return 'en-US';
  }
};

export const generateProductImage = async (name: string, description: string): Promise<string | null> => {
  try {
    const prompt = `Create a high-quality, professional product photography image for a smart home device named "${name}". 
    Description: ${description}. 
    Style: Minimalist, futuristic, clean product photography with soft studio lighting, high-tech aesthetic, 4k, cinematic composition.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};
