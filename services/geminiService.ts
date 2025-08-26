
import { GoogleGenAI, Type } from "@google/genai";
import { QuizPreferences, RecommendedPerfume } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { 
        type: Type.STRING, 
        description: 'Un nombre creativo y evocador para el perfume.' 
      },
      story: { 
        type: Type.STRING, 
        description: 'Una historia corta y cautivadora que evoque las preferencias del usuario (paisaje, sensación). Debe ser poética y atractiva.' 
      },
      pyramid: {
        type: Type.OBJECT,
        properties: {
          top: { 
            type: Type.STRING, 
            description: 'Notas de salida de la fragancia. Por ejemplo: Bergamota, Limón, Menta.'
          },
          heart: { 
            type: Type.STRING, 
            description: 'Notas de corazón de la fragancia. Por ejemplo: Jazmín, Rosa, Lavanda.' 
          },
          base: { 
            type: Type.STRING, 
            description: 'Notas de fondo de la fragancia. Por ejemplo: Sándalo, Vainilla, Almizcle.' 
          },
        },
        required: ['top', 'heart', 'base']
      },
    },
    required: ['name', 'story', 'pyramid']
  }
};


export const findMyScent = async (preferences: QuizPreferences): Promise<RecommendedPerfume[]> => {
  const prompt = `
    Eres un experto perfumista y narrador de historias para la marca de lujo "ScentMart Perfumes". 
    Tu misión es crear 3 recomendaciones de perfumes ficticios y únicos basados en las siguientes preferencias de un cliente:
    - Paisaje soñado: ${preferences.landscape}
    - Sensación buscada: ${preferences.sensation}
    - Momento preferido del día: ${preferences.timeOfDay}

    Para cada una de las 3 recomendaciones, genera un nombre poético, una historia evocadora que conecte con las preferencias, y la pirámide olfativa completa (notas de salida, corazón y fondo).
    El tono debe ser elegante, lujoso y sensorial, alineado con la marca ScentMart. No incluyas nada más en tu respuesta, solo el JSON.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema,
          temperature: 0.8,
        },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (!Array.isArray(result)) {
        throw new Error("La respuesta de la API no es un array válido.");
    }

    return result as RecommendedPerfume[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("No se pudo obtener una recomendación. Por favor, intente de nuevo más tarde.");
  }
};
