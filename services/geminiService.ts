
import { GoogleGenAI, Type } from "@google/genai";
import { QuizPreferences, Perfume } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const apiKey = import.meta.env.GEMINI_API_KEY;

// New Schema for recommending existing perfumes by name
const recommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.STRING,
    description: "El nombre exacto de un perfume recomendado de la lista proporcionada."
  }
};


export const findMyScent = async (preferences: QuizPreferences, availablePerfumes: Perfume[]): Promise<string[]> => {
  // Simplify the perfume data to send to the API to save tokens and focus the model
  const perfumeDataForPrompt = availablePerfumes.map(p => ({
    name: p.name,
    description: p.details?.description,
    olfactoryNotes: p.details?.olfactoryNotes,
    olfactoryFamily: p.olfactoryFamily,
    gender: p.gender,
  }));

  const prompt = `
    Eres un experto perfumista y asesor de fragancias de lujo para "ScentMart Perfumes".
    Tu misión es analizar las preferencias de un cliente y recomendar hasta 3 perfumes de nuestro catálogo en stock que sean la combinación perfecta.

    PREFERENCIAS DEL CLIENTE:
    - Paisaje soñado: ${preferences.landscape}
    - Sensación buscada: ${preferences.sensation}
    - Momento preferido del día: ${preferences.timeOfDay}

    CATÁLOGO DE PERFUMES DISPONIBLES (en formato JSON):
    ${JSON.stringify(perfumeDataForPrompt)}

    INSTRUCCIONES:
    1.  Analiza profundamente las preferencias del cliente. "Playa al atardecer" sugiere notas marinas, cálidas o solares. "Bosque frondoso" sugiere notas amaderadas, verdes o terrosas. "Elegancia y misterio" sugiere notas orientales, especiadas o profundas.
    2.  Compara estas preferencias con la descripción, notas olfativas, familia y género de cada perfume en el catálogo.
    3.  Selecciona un máximo de 3 perfumes que mejor se adapten. Es mejor recomendar uno o dos excelentes que tres mediocres.
    4.  Tu respuesta DEBE SER EXCLUSIVAMENTE un array JSON que contenga los nombres exactos (propiedad "name") de los perfumes seleccionados. No incluyas ninguna explicación, saludo, o texto adicional.
    
    Ejemplo de respuesta si recomiendas "BLEU INTENSE" y "Magnat":
    ["BLEU INTENSE", "Magnat"]
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: recommendationSchema,
          temperature: 0.5, // Lower temperature for more predictable, focused results
        },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (!Array.isArray(result) || !result.every(item => typeof item === 'string')) {
        console.error("La respuesta de la API no es un array de strings válido:", result);
        throw new Error("Formato de respuesta de API inválido.");
    }

    return result as string[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("No se pudo obtener una recomendación. Por favor, intente de nuevo más tarde.");
  }
};
