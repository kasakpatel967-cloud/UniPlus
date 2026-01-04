
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client using the environment variable directly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartCampusResponse = async (query: string, context: string) => {
  try {
    // Generate content using the recommended Gemini 3 Flash model for basic text tasks.
    // System instructions are moved to the config section for better performance and clarity.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: ${query}`,
      config: {
        systemInstruction: `You are "EduBot", a smart campus assistant for a university. 
        University Data: ${context}
        Instructions: Be helpful, concise, and professional. If you don't know something from the provided context, suggest they contact the administration. Use markdown for formatting.`,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Access the text property directly on the response object.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to the campus brain right now. Please try again later.";
  }
};
