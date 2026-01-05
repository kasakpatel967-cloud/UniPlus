
import { GoogleGenAI } from "@google/genai";

export const getSmartCampusResponse = async (query: string, context: string) => {
  try {
    // Instantiate right before call to use the latest selected API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to the campus brain right now. Please try again later.";
  }
};

export const generateCampusVisual = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A professional campus poster or educational diagram: ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw error;
  }
};
