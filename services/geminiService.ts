
import { GoogleGenAI } from "@google/genai";

export const generateStrikeReason = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genereer een grappige, korte, droge reden (in het Nederlands) waarom ${name} bij Smash Studios zojuist een 'strike' heeft gekregen. Maak het absurd maar studio-gerelateerd (bijv. 'Koffiebeker niet in de vaatwasser', 'Te veel naar de muur gestaard', 'Muisklikken waren te luid'). Maximaal 10 woorden.`,
    });
    return response.text || "Gewoon omdat het kan.";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Onbekende overtreding.";
  }
};

export const generateTreatCelebration = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Roep enthousiast uit (in het Nederlands) dat ${name} 3 strikes heeft en nu moet trakteren! Maak het een beetje plagerig en vrolijk. Noem iets lekkers zoals worstenbroodjes, vlaai of donuts. Kort bericht.`,
    });
    return response.text || `${name} moet trakteren!`;
  } catch (error) {
    return `${name} moet nu echt gaan trakteren!`;
  }
};
