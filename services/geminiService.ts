
import { GoogleGenAI, Type } from "@google/genai";

// Use a getter to handle potentially undefined process.env at evaluation time
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const getTranslationSuggestion = async (text: string, type: string) => {
  if (!text) return null;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a clear translation and a usage example for this ${type}: "${text}". Respond in a structured JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            example: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
          required: ["translation", "example"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return null;
  }
};
